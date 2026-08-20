import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { api, setAuthToken } from './api';
import { RoleKey } from '@/design-system/tokens';
import { toast } from 'sonner';
import { auth, db, storage } from '@/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const VALID_ROLES = [
  'STUDENT',
  'FACULTY',
  'FACULTY_MENTOR',
  'COMPANY',
  'COMPANY_MENTOR',
  'ADMIN',
  'TNP_ADMIN',
  'HOD_ADMIN',
  'SUPER_ADMIN',
];

export function normalizeRoleToKey(role: string): RoleKey {
  const r = (role || '').toUpperCase();
  if (r === 'STUDENT') return 'student';
  if (r === 'FACULTY' || r === 'FACULTY_MENTOR') return 'faculty';
  if (r === 'COMPANY' || r === 'COMPANY_MENTOR') return 'company';
  if (['ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'SUPER_ADMIN'].includes(r)) return 'admin';
  return 'student';
}

export function getRoleDashboardPath(role: string, status?: string): string {
  if (status === 'PENDING_APPROVAL') {
    return '/pending-approval';
  }
  if (status === 'SUSPENDED') {
    return '/account-suspended';
  }
  const r = (role || '').toUpperCase();
  if (r === 'STUDENT') return '/student';
  if (r === 'FACULTY' || r === 'FACULTY_MENTOR') return '/faculty';
  if (r === 'COMPANY' || r === 'COMPANY_MENTOR') return '/company';
  if (['ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'SUPER_ADMIN'].includes(r)) return '/admin';
  return '/student';
}

export function formatFirebaseError(err: any, fallbackMessage: string): string {
  if (!err) return fallbackMessage;
  const code = err.code || '';
  const message = (err.message || '').toString();

  // Firestore Database Not Found (Database '(default)' not provisioned or mismatch)
  if (
    message.includes('(default)') ||
    (message.includes('not found') && message.includes('Database')) ||
    (message.includes('NOT_FOUND') && message.includes('database')) ||
    code === 'not-found'
  ) {
    return "Cloud Firestore database '(default)' was not found on project 'interniq-5a405'. Please ensure Cloud Firestore is enabled in Native Mode in the Firebase Console (https://console.firebase.google.com/project/interniq-5a405/firestore).";
  }

  // Firestore Timeout
  if (code === 'FIRESTORE_TIMEOUT' || message.includes('FIRESTORE_TIMEOUT') || code === 'deadline-exceeded') {
    return 'Firestore database operation timed out. Please verify Firestore is active and check network connectivity.';
  }

  // Firebase Storage CORS / Missing Bucket
  if (
    message.includes('CORS') ||
    message.includes('preflight') ||
    message.includes('ERR_FAILED') ||
    code === 'storage/unknown' ||
    code === 'storage/cannot-slice-blob' ||
    code === 'storage/bucket-not-found'
  ) {
    return "Firebase Storage bucket not accessible or blocked by CORS. Please verify Cloud Storage is enabled in Firebase Console (https://console.firebase.google.com/project/interniq-5a405/storage).";
  }

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address format.';
    case 'auth/weak-password':
      return 'Password must be at least 8 characters long.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Invalid email address or password. Please check your credentials.';
    case 'auth/user-disabled':
      return 'This account has been disabled or suspended by administration.';
    case 'auth/too-many-requests':
      return 'Too many failed sign-in attempts. Please try again after a few minutes.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'permission-denied':
      return 'Permission denied by Firestore security rules. Check firestore.rules configuration.';
    case 'unavailable':
      return 'Database service is temporarily unavailable. Please try again in a moment.';
    case 'storage/unauthorized':
      return 'Storage permission denied. You are not authorized to upload to this path.';
    case 'storage/quota-exceeded':
      return 'Storage quota exceeded for this Firebase project.';
    case 'storage/retry-limit-exceeded':
      return 'Storage operation timed out. Please try again.';
    default:
      return err.message || fallbackMessage;
  }
}

/**
 * Multi-Collection Profile Resolver
 * Queries users/{UID} followed by role-specific collections:
 * - students/{UID}
 * - faculty/{UID}
 * - companyMentors/{UID} (and companies/{UID})
 * - admins/{UID}
 */
async function fetchFullUserProfile(uid: string, email?: string | null): Promise<any | null> {
  const userDocRef = doc(db, 'users', uid);
  let userDocSnap = null;
  
  try {
    userDocSnap = await getDoc(userDocRef);
  } catch (err: any) {
    console.error('Error fetching users/' + uid + ' from Firestore:', err);
    return null;
  }

  let userData = userDocSnap && userDocSnap.exists() ? userDocSnap.data() : null;

  // Fallback check across role collections if users/{UID} document is missing
  if (!userData) {
    try {
      const [stuSnap, facSnap, compMentorSnap, compSnap, admSnap] = await Promise.all([
        getDoc(doc(db, 'students', uid)).catch(() => null),
        getDoc(doc(db, 'faculty', uid)).catch(() => null),
        getDoc(doc(db, 'companyMentors', uid)).catch(() => null),
        getDoc(doc(db, 'companies', uid)).catch(() => null),
        getDoc(doc(db, 'admins', uid)).catch(() => null),
      ]);

      if (stuSnap && stuSnap.exists()) {
        const sData = stuSnap.data();
        userData = {
          uid,
          email: email || sData.email,
          name: sData.name || 'Student',
          role: 'STUDENT',
          status: 'ACTIVE',
        };
        setDoc(userDocRef, { ...userData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});
      } else if (facSnap && facSnap.exists()) {
        const fData = facSnap.data();
        userData = {
          uid,
          email: email || fData.email,
          name: fData.name || 'Faculty Member',
          role: 'FACULTY',
          status: fData.status || 'PENDING_APPROVAL',
        };
        setDoc(userDocRef, { ...userData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});
      } else if ((compMentorSnap && compMentorSnap.exists()) || (compSnap && compSnap.exists())) {
        const cData = compMentorSnap?.exists() ? compMentorSnap.data() : compSnap?.data();
        userData = {
          uid,
          email: email || cData.contactEmail || cData.email,
          name: cData.contactPerson || cData.companyName || 'Company Mentor',
          role: 'COMPANY_MENTOR',
          status: cData.status || 'PENDING_APPROVAL',
        };
        setDoc(userDocRef, { ...userData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});
      } else if (admSnap && admSnap.exists()) {
        const aData = admSnap.data();
        userData = {
          uid,
          email: email || aData.email,
          name: aData.name || 'Administrator',
          role: 'ADMIN',
          roleTier: aData.roleTier || 'TNP_ADMIN',
          status: 'ACTIVE',
        };
        setDoc(userDocRef, { ...userData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});
      }
    } catch (err) {
      console.warn('Role collection fallback lookup notice:', err);
    }
  }

  if (!userData) {
    return null;
  }

  const rawRole = (userData.role || '').toUpperCase();
  if (!rawRole || !VALID_ROLES.includes(rawRole)) {
    return null;
  }

  let roleData: any = undefined;
  if (rawRole === 'STUDENT') {
    try {
      const studentSnap = await getDoc(doc(db, 'students', uid));
      if (studentSnap && studentSnap.exists()) {
        roleData = studentSnap.data();
      }
    } catch (err) {
      console.warn('Student profile lookup notice:', err);
    }
  } else if (rawRole === 'FACULTY' || rawRole === 'FACULTY_MENTOR') {
    try {
      const facultySnap = await getDoc(doc(db, 'faculty', uid));
      if (facultySnap && facultySnap.exists()) {
        roleData = facultySnap.data();
      }
    } catch (err) {
      console.warn('Faculty profile lookup notice:', err);
    }
  } else if (rawRole === 'COMPANY' || rawRole === 'COMPANY_MENTOR') {
    try {
      let companySnap = await getDoc(doc(db, 'companyMentors', uid)).catch(() => null);
      if (!companySnap || !companySnap.exists()) {
        companySnap = await getDoc(doc(db, 'companies', uid)).catch(() => null);
      }
      if (companySnap && companySnap.exists()) {
        roleData = companySnap.data();
      }
    } catch (err) {
      console.warn('Company profile lookup notice:', err);
    }
  } else if (['ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'SUPER_ADMIN'].includes(rawRole)) {
    try {
      const adminSnap = await getDoc(doc(db, 'admins', uid));
      if (adminSnap && adminSnap.exists()) {
        roleData = adminSnap.data();
      }
    } catch (err) {
      console.warn('Admin profile lookup notice:', err);
    }
  }

  return {
    uid,
    id: uid,
    email: email || userData.email,
    ...userData,
    student: rawRole === 'STUDENT' ? roleData : undefined,
    faculty: rawRole === 'FACULTY' || rawRole === 'FACULTY_MENTOR' ? roleData : undefined,
    company: (rawRole === 'COMPANY' || rawRole === 'COMPANY_MENTOR') ? roleData : undefined,
    companyMentor: (rawRole === 'COMPANY' || rawRole === 'COMPANY_MENTOR') ? roleData : undefined,
    admin: ['ADMIN', 'TNP_ADMIN', 'HOD_ADMIN', 'SUPER_ADMIN'].includes(rawRole) ? roleData : undefined,
    roleData,
  };
}

interface AuthContextType {
  activeRole: RoleKey;
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password?: string }) => Promise<any>;
  registerStudent: (data: any) => Promise<any>;
  registerFaculty: (data: any) => Promise<any>;
  registerCompany: (data: any) => Promise<any>;
  registerAdmin: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<RoleKey>('student');
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ─── INITIALIZATION: FIREBASE AUTH & FIRESTORE PROFILE SYNC ────────────────
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (!isMounted) return;

      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken().catch(() => null);
          if (token) setAuthToken(token);

          const fullProfile = await fetchFullUserProfile(firebaseUser.uid, firebaseUser.email);
          if (isMounted) {
            if (fullProfile) {
              setUser(fullProfile);
              setActiveRole(normalizeRoleToKey(fullProfile.role));
            } else {
              setUser(null);
            }
          }
        } catch (err) {
          console.error('Error resolving user profile on auth state change:', err);
          if (isMounted) {
            setUser(null);
            setAuthToken(null);
          }
        }
      } else {
        if (isMounted) {
          setUser(null);
          setAuthToken(null);
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // ─── REAL FIREBASE AUTHENTICATION + FIRESTORE ROLE LOOKUP ──────────────────
  const login = useCallback(async (credentials: { email: string; password?: string }) => {
    setLoading(true);
    try {
      const email = (credentials.email || '').trim();
      const password = (credentials.password || '').trim();

      if (!email || !password) {
        const errorMsg = 'Please enter both your email address and password.';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      // 1. Firebase Authentication sign-in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const uid = firebaseUser.uid;

      // 2. Fetch profile from Firestore
      const fullProfile = await fetchFullUserProfile(uid, firebaseUser.email);

      if (!fullProfile) {
        // Handle missing Firestore profile: sign out from Auth to prevent inconsistent state
        await signOut(auth).catch(() => {});
        setUser(null);
        setAuthToken(null);
        const errorMsg = 'User profile was not found in Firestore. Please ensure your account has been registered and Cloud Firestore is created in the Firebase console.';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      // 3. Handle suspended status
      if (fullProfile.status === 'SUSPENDED') {
        setUser(fullProfile);
        setActiveRole(normalizeRoleToKey(fullProfile.role));
        toast.error('This account has been suspended. Please contact institutional administration.');
        return {
          user: fullProfile,
          role: fullProfile.role,
          status: 'SUSPENDED',
        };
      }

      // 4. Update session token and state
      const token = await firebaseUser.getIdToken().catch(() => null);
      if (token) setAuthToken(token);

      setUser(fullProfile);
      const normalized = normalizeRoleToKey(fullProfile.role);
      setActiveRole(normalized);

      const displayName = fullProfile.name || fullProfile.displayName || firebaseUser.displayName || 'User';
      toast.success(`Welcome back, ${displayName}!`);

      return {
        user: fullProfile,
        role: fullProfile.role,
        status: fullProfile.status,
      };
    } catch (err: any) {
      const friendlyMsg = formatFirebaseError(err, 'Authentication failed. Please check your credentials.');
      toast.error(friendlyMsg);
      throw new Error(friendlyMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── REAL STUDENT REGISTRATION (Firebase Auth + Storage + Firestore) ───────
  const registerStudent = useCallback(async (data: any) => {
    setLoading(true);
    let createdAuthUser: FirebaseUser | null = null;
    try {
      const email = (data.email || '').trim().toLowerCase();
      const password = data.password;
      const fullName = (data.name || `${data.firstName || ''} ${data.lastName || ''}`).trim();
      const rollNumber = (data.rollNumber || data.studentId || data.enrollmentNumber || '').trim();
      const branch = (data.branch || data.department || '').trim();

      if (!email || !password) {
        const msg = 'Email and password are required for student registration.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (!fullName) {
        const msg = 'Full name is required.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (!rollNumber) {
        const msg = 'Roll Number / PRN is required.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (password.length < 8) {
        const msg = 'Password must be at least 8 characters long.';
        toast.error(msg);
        throw new Error(msg);
      }

      // 1. Firebase Authentication: Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      createdAuthUser = userCredential.user;
      const firebaseUid = createdAuthUser.uid;

      // 2. Update Firebase Auth Profile Display Name
      if (fullName) {
        await updateProfile(createdAuthUser, { displayName: fullName }).catch((e) => {
          console.warn('Could not update Firebase Auth displayName:', e);
        });
      }

      // 3. Firebase Storage: Upload Resume (Optional) to students/{UID}/resumes/{filename}
      let resumeUrl = '';
      if (data.resumeFile instanceof File) {
        const file = data.resumeFile;
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('Resume file size exceeds maximum limit of 10MB.');
        }

        const validMimes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!validMimes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
          throw new Error('Only PDF, DOC, or DOCX resume formats are supported.');
        }

        try {
          const sanitizedFileName = (file.name || 'resume.pdf').replace(/[^a-zA-Z0-9.-]/g, '_');
          const storagePath = `students/${firebaseUid}/resumes/${Date.now()}_${sanitizedFileName}`;
          const storageRef = ref(storage, storagePath);

          const uploadSnapshot = await uploadBytes(storageRef, file, {
            contentType: file.type || 'application/pdf',
            customMetadata: {
              originalName: file.name,
              uploadedBy: firebaseUid,
              uploadedAt: new Date().toISOString(),
            },
          });

          resumeUrl = await getDownloadURL(uploadSnapshot.ref);
        } catch (storageErr: any) {
          console.error('Firebase Storage upload error:', storageErr);
          if (createdAuthUser) {
            await createdAuthUser.delete().catch(() => {});
          }
          const storageErrorMsg = formatFirebaseError(
            storageErr,
            'Failed to upload resume to Firebase Storage. Please ensure Firebase Storage is enabled in the Firebase Console.'
          );
          throw new Error(storageErrorMsg);
        }
      } else if (typeof data.resumeUrl === 'string' && data.resumeUrl && !data.resumeUrl.includes('storage.ilmp.edu')) {
        resumeUrl = data.resumeUrl;
      }

      // 4. Format skills
      const skills = Array.isArray(data.skills)
        ? data.skills.map((skill: any) => String(skill).trim()).filter(Boolean)
        : typeof data.skills === 'string'
        ? data.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean)
        : [];

      // 5. Document Payloads with strict Firebase UID as document ID
      const userDocData = {
        uid: firebaseUid,
        email: createdAuthUser.email || email,
        name: fullName,
        role: 'STUDENT',
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const studentDocData = {
        uid: firebaseUid,
        name: fullName,
        email: createdAuthUser.email || email,
        rollNumber: rollNumber,
        branch: branch,
        year: Number(data.year) || 3,
        semester: Number(data.semester) || 6,
        cgpa: Number(data.cgpa) || 8.0,
        backlogs: Number(data.backlogs) || 0,
        passingYear: Number(data.passingYear) || 2026,
        skills: skills,
        certifications: Array.isArray(data.certifications) ? data.certifications : [],
        experience: Array.isArray(data.experience) ? data.experience : [],
        resumeUrl: resumeUrl,
        profileCompleted: true,
        verified: false,
        phone: data.phone || '',
        studentId: rollNumber,
        enrollmentNumber: rollNumber,
        collegeName: data.collegeName || 'G.H. Raisoni College of Engineering (Autonomous)',
        department: branch,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // 6. Firestore: Create users/{UID} and students/{UID} documents
      try {
        await Promise.all([
          setDoc(doc(db, 'users', firebaseUid), userDocData),
          setDoc(doc(db, 'students', firebaseUid), studentDocData),
        ]);
      } catch (firestoreErr: any) {
        console.error('Firestore write failure during student registration:', firestoreErr);
        if (createdAuthUser) {
          await createdAuthUser.delete().catch((delErr) => {
            console.warn('Could not roll back Auth user on Firestore failure:', delErr);
          });
        }
        const friendlyFirestoreMsg = formatFirebaseError(
          firestoreErr,
          'Failed to create student profile in Firestore database.'
        );
        throw new Error(friendlyFirestoreMsg);
      }

      api.registerStudent({ ...data, rollNumber, branch, firebaseUid, resumeUrl }).catch(() => {});

      const appUser = {
        uid: firebaseUid,
        id: firebaseUid,
        email,
        ...userDocData,
        student: studentDocData,
      };

      setUser(appUser);
      setActiveRole('student');

      const token = await createdAuthUser.getIdToken().catch(() => null);
      if (token) setAuthToken(token);

      toast.success('Student account registered and authenticated successfully!');
      return { uid: firebaseUid, user: appUser };
    } catch (err: any) {
      const msg = formatFirebaseError(err, err.message || 'Student registration failed');
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── REAL FACULTY REGISTRATION (Firebase Auth + Firestore) ─────────────────
  const registerFaculty = useCallback(async (data: any) => {
    setLoading(true);
    let createdAuthUser: FirebaseUser | null = null;
    try {
      const email = (data.email || '').trim().toLowerCase();
      const password = data.password;
      const fullName = (data.name || `${data.firstName || ''} ${data.lastName || ''}`).trim();

      if (!email || !password) {
        const msg = 'Email and password are required for faculty registration.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (!fullName) {
        const msg = 'Full name is required.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (password.length < 8) {
        const msg = 'Password must be at least 8 characters long.';
        toast.error(msg);
        throw new Error(msg);
      }

      // 1. Firebase Authentication: Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      createdAuthUser = userCredential.user;
      const firebaseUid = createdAuthUser.uid;

      if (fullName) {
        await updateProfile(createdAuthUser, { displayName: fullName }).catch(() => {});
      }

      // 2. Document Payloads with strict Firebase UID
      const userDocData = {
        uid: firebaseUid,
        name: fullName,
        displayName: fullName,
        email,
        phone: data.phone || '',
        role: 'FACULTY',
        status: 'PENDING_APPROVAL',
        department: data.department || '',
        designation: data.designation || '',
        collegeName: data.collegeName || 'G.H. Raisoni College of Engineering (Autonomous)',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const facultyDocData = {
        uid: firebaseUid,
        userId: firebaseUid,
        name: fullName,
        email,
        phone: data.phone || '',
        facultyId: data.facultyId || data.employeeId || '',
        employeeId: data.employeeId || data.facultyId || '',
        department: data.department || '',
        designation: data.designation || '',
        collegeName: data.collegeName || 'G.H. Raisoni College of Engineering (Autonomous)',
        status: 'PENDING_APPROVAL',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // 3. Firestore: Create users/{UID} and faculty/{UID}
      try {
        await Promise.all([
          setDoc(doc(db, 'users', firebaseUid), userDocData),
          setDoc(doc(db, 'faculty', firebaseUid), facultyDocData),
        ]);
      } catch (firestoreErr: any) {
        console.error('Firestore write failure during faculty registration:', firestoreErr);
        if (createdAuthUser) {
          await createdAuthUser.delete().catch(() => {});
        }
        const friendlyFirestoreMsg = formatFirebaseError(
          firestoreErr,
          'Failed to create faculty profile in Firestore database.'
        );
        throw new Error(friendlyFirestoreMsg);
      }

      api.registerFaculty({ ...data, firebaseUid }).catch(() => {});

      const appUser = {
        uid: firebaseUid,
        id: firebaseUid,
        email,
        ...userDocData,
        faculty: facultyDocData,
      };

      setUser(appUser);
      setActiveRole('faculty');

      const token = await createdAuthUser.getIdToken().catch(() => null);
      if (token) setAuthToken(token);

      toast.info('Faculty registration submitted. Pending administrative approval.');
      return { uid: firebaseUid, user: appUser };
    } catch (err: any) {
      const msg = formatFirebaseError(err, err.message || 'Faculty registration failed');
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── REAL COMPANY REGISTRATION (Firebase Auth + Firestore) ─────────────────
  const registerCompany = useCallback(async (data: any) => {
    setLoading(true);
    let createdAuthUser: FirebaseUser | null = null;
    try {
      const email = (data.contactEmail || data.email || '').trim().toLowerCase();
      const password = data.password;
      const companyName = (data.company || data.name || '').trim();
      const contactPerson = (data.contactPerson || companyName).trim();

      if (!email || !password) {
        const msg = 'Email and password are required for company registration.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (!companyName) {
        const msg = 'Company name is required.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (password.length < 8) {
        const msg = 'Password must be at least 8 characters long.';
        toast.error(msg);
        throw new Error(msg);
      }

      // 1. Firebase Authentication: Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      createdAuthUser = userCredential.user;
      const firebaseUid = createdAuthUser.uid;

      if (contactPerson || companyName) {
        await updateProfile(createdAuthUser, { displayName: contactPerson || companyName }).catch(() => {});
      }

      // 2. Document Payloads with strict Firebase UID
      const userDocData = {
        uid: firebaseUid,
        name: contactPerson || companyName,
        companyName,
        displayName: contactPerson || companyName,
        email,
        phone: data.contactPhone || data.phone || '',
        role: 'COMPANY_MENTOR',
        status: 'PENDING_APPROVAL',
        domain: data.domain || '',
        location: data.location || '',
        website: data.website || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const companyDocData = {
        uid: firebaseUid,
        userId: firebaseUid,
        companyName,
        domain: data.domain || '',
        website: data.website || '',
        location: data.location || '',
        description: data.description || '',
        contactPerson,
        contactEmail: email,
        contactPhone: data.contactPhone || data.phone || '',
        status: 'PENDING_APPROVAL',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // 3. Firestore: Create users/{UID}, companyMentors/{UID} and companies/{UID}
      try {
        await Promise.all([
          setDoc(doc(db, 'users', firebaseUid), userDocData),
          setDoc(doc(db, 'companyMentors', firebaseUid), companyDocData),
          setDoc(doc(db, 'companies', firebaseUid), companyDocData),
        ]);
      } catch (firestoreErr: any) {
        console.error('Firestore write failure during company registration:', firestoreErr);
        if (createdAuthUser) {
          await createdAuthUser.delete().catch(() => {});
        }
        const friendlyFirestoreMsg = formatFirebaseError(
          firestoreErr,
          'Failed to create company profile in Firestore database.'
        );
        throw new Error(friendlyFirestoreMsg);
      }

      api.registerCompany({ ...data, firebaseUid }).catch(() => {});

      const appUser = {
        uid: firebaseUid,
        id: firebaseUid,
        email,
        ...userDocData,
        company: companyDocData,
        companyMentor: companyDocData,
      };

      setUser(appUser);
      setActiveRole('company');

      const token = await createdAuthUser.getIdToken().catch(() => null);
      if (token) setAuthToken(token);

      toast.info('Company registration submitted. Pending institutional verification.');
      return { uid: firebaseUid, user: appUser };
    } catch (err: any) {
      const msg = formatFirebaseError(err, err.message || 'Company registration failed');
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── REAL ADMIN REGISTRATION (Firebase Auth + Firestore) ─────────────────
  const registerAdmin = useCallback(async (data: any) => {
    setLoading(true);
    let createdAuthUser: FirebaseUser | null = null;
    try {
      const email = (data.email || '').trim().toLowerCase();
      const password = data.password;
      const fullName = (data.name || data.fullName || `${data.firstName || ''} ${data.lastName || ''}`).trim();
      const roleTier = (data.role || data.roleTier || 'TNP_ADMIN').toUpperCase();
      const department = (data.department || 'Training & Placement Cell').trim();
      const designation = (data.designation || 'Administrator').trim();

      if (!email || !password) {
        const msg = 'Email and password are required for administrator registration.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (!fullName) {
        const msg = 'Full name is required.';
        toast.error(msg);
        throw new Error(msg);
      }

      if (password.length < 8) {
        const msg = 'Password must be at least 8 characters long.';
        toast.error(msg);
        throw new Error(msg);
      }

      // 1. Firebase Authentication: Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      createdAuthUser = userCredential.user;
      const firebaseUid = createdAuthUser.uid;

      if (fullName) {
        await updateProfile(createdAuthUser, { displayName: fullName }).catch(() => {});
      }

      // 2. Document Payloads with strict Firebase UID
      const userDocData = {
        uid: firebaseUid,
        email,
        name: fullName,
        displayName: fullName,
        phone: data.phone || '',
        role: 'ADMIN',
        roleTier,
        department,
        designation,
        collegeName: data.collegeName || 'G.H. Raisoni College of Engineering (Autonomous)',
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const adminDocData = {
        uid: firebaseUid,
        userId: firebaseUid,
        name: fullName,
        email,
        phone: data.phone || '',
        role: 'ADMIN',
        roleTier,
        department,
        designation,
        collegeName: data.collegeName || 'G.H. Raisoni College of Engineering (Autonomous)',
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // 3. Firestore: Create users/{UID} and admins/{UID}
      try {
        await Promise.all([
          setDoc(doc(db, 'users', firebaseUid), userDocData),
          setDoc(doc(db, 'admins', firebaseUid), adminDocData),
        ]);
      } catch (firestoreErr: any) {
        console.error('Firestore write failure during admin registration:', firestoreErr);
        if (createdAuthUser) {
          await createdAuthUser.delete().catch(() => {});
        }
        const friendlyFirestoreMsg = formatFirebaseError(
          firestoreErr,
          'Failed to create admin profile in Firestore database.'
        );
        throw new Error(friendlyFirestoreMsg);
      }

      api.createAdmin({ ...data, firebaseUid }).catch(() => {});

      const appUser = {
        uid: firebaseUid,
        id: firebaseUid,
        email,
        ...userDocData,
        admin: adminDocData,
      };

      setUser(appUser);
      setActiveRole('admin');

      const token = await createdAuthUser.getIdToken().catch(() => null);
      if (token) setAuthToken(token);

      toast.success(`Administrator account created successfully for ${fullName}!`);
      return { uid: firebaseUid, user: appUser };
    } catch (err: any) {
      const msg = formatFirebaseError(err, err.message || 'Administrator registration failed');
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── REAL LOGOUT ───────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      await api.logout().catch(() => {});
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setUser(null);
      setAuthToken(null);
      setActiveRole('student');
      localStorage.removeItem('ilmp_token');
      localStorage.removeItem('ilmp_active_role');
      localStorage.removeItem('ilmp_user_id');
      toast.info('You have been signed out.');
    }
  }, []);

  // ─── REFRESH USER IDENTITY FROM FIRESTORE ──────────────────────────────────
  const refreshUser = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const fullProfile = await fetchFullUserProfile(currentUser.uid, currentUser.email);
        if (fullProfile) {
          setUser(fullProfile);
          setActiveRole(normalizeRoleToKey(fullProfile.role));
        }
      } catch (err) {
        console.error('Error refreshing user profile:', err);
      }
    } else {
      setUser(null);
    }
  }, []);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      activeRole,
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      registerStudent,
      registerFaculty,
      registerCompany,
      registerAdmin,
      logout,
      refreshUser,
    }),
    [
      activeRole,
      user,
      loading,
      login,
      registerStudent,
      registerFaculty,
      registerCompany,
      registerAdmin,
      logout,
      refreshUser,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
