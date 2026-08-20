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
      return 'Permission denied by Firestore security rules.';
    case 'unavailable':
      return 'Database service is temporarily unavailable. Please try again in a moment.';
    default:
      return err.message || fallbackMessage;
  }
}

/**
 * Multi-Collection Profile Resolver with Self-Healing Recovery
 * Queries users/{UID} followed by the role-specific collection:
 * - students/{UID}
 * - faculty/{UID}
 * - companies/{UID}
 * - admins/{UID}
 */
async function fetchFullUserProfile(uid: string, email?: string | null): Promise<any | null> {
  const userDocRef = doc(db, 'users', uid);
  let userDocSnap = await getDoc(userDocRef).catch(() => null);

  let userData = userDocSnap && userDocSnap.exists() ? userDocSnap.data() : null;

  // Self-Healing Fallback: If users/{UID} is missing, search role-specific collections
  if (!userData) {
    try {
      const [stuSnap, facSnap, compSnap, admSnap] = await Promise.all([
        getDoc(doc(db, 'students', uid)).catch(() => null),
        getDoc(doc(db, 'faculty', uid)).catch(() => null),
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
      } else if (compSnap && compSnap.exists()) {
        const cData = compSnap.data();
        userData = {
          uid,
          email: email || cData.contactEmail,
          name: cData.contactPerson || cData.companyName || 'Company Mentor',
          role: 'COMPANY',
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
      console.warn('Fallback profile lookup notice:', err);
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
      const companySnap = await getDoc(doc(db, 'companies', uid));
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
    company: rawRole === 'COMPANY' || rawRole === 'COMPANY_MENTOR' ? roleData : undefined,
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

    // Timeout guard to prevent infinite loading state
    const timeoutTimer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 5000);

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
              console.warn('Firebase user exists in Auth but has missing Firestore profile');
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
        clearTimeout(timeoutTimer);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutTimer);
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

      // 1. Firebase Authentication sign-in (Authenticates credentials & obtains UID)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const uid = firebaseUser.uid;

      // 2. Fetch trusted Firestore profile across users/{uid} and role collections
      const fullProfile = await fetchFullUserProfile(uid, firebaseUser.email);

      if (!fullProfile) {
        // Handle missing Firestore profile: clean sign out from Auth to prevent stuck state
        await signOut(auth).catch(() => {});
        setUser(null);
        setAuthToken(null);
        const errorMsg = 'User account authenticated, but profile document was not found in Firestore. Please register or contact system administration.';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      // 3. Handle suspended/deactivated status
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
      const friendlyMsg = formatFirebaseError(err, 'Authentication failed. Please try again.');
      toast.error(friendlyMsg);
      throw new Error(friendlyMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── REAL STUDENT REGISTRATION (Firebase Auth + Firestore) ─────────────────
  const registerStudent = useCallback(async (data: any) => {
    setLoading(true);
    let firebaseUser: FirebaseUser | null = null;
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

      // 1. Firebase Authentication account creation
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      firebaseUser = userCredential.user;
      const firebaseUid = firebaseUser.uid;

      if (fullName) {
        await updateProfile(firebaseUser, { displayName: fullName }).catch(() => {});
      }

      // 2. Real Firebase Storage Resume Upload
      let resumeUrl = '';
      if (data.resumeFile instanceof File) {
        const file = data.resumeFile;
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Resume file size exceeds maximum limit of 5MB.');
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
        } catch (uploadErr: any) {
          console.warn('Resume upload notice:', uploadErr?.message);
        }
      } else if (typeof data.resumeUrl === 'string' && data.resumeUrl && !data.resumeUrl.includes('storage.ilmp.edu')) {
        resumeUrl = data.resumeUrl;
      }

      // 3. Format skills
      const skills = Array.isArray(data.skills)
        ? data.skills.map((skill: any) => String(skill).trim()).filter(Boolean)
        : typeof data.skills === 'string'
        ? data.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean)
        : [];

      // 4. Document Payloads
      const userDocData = {
        uid: firebaseUid,
        email: firebaseUser.email || email,
        name: fullName,
        role: 'STUDENT',
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const studentDocData = {
        uid: firebaseUid,
        name: fullName,
        email: firebaseUser.email || email,
        rollNumber: rollNumber,
        branch: branch,
        year: Number(data.year) || 1,
        cgpa: Number(data.cgpa) || 0,
        backlogs: Number(data.backlogs) || 0,
        passingYear: Number(data.passingYear) || new Date().getFullYear(),
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
        semester: Number(data.semester) || 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // 5. Firestore Transactional Profile Creation with Safe Recovery Strategy
      try {
        await setDoc(doc(db, 'users', firebaseUid), userDocData, { merge: true });
        await setDoc(doc(db, 'students', firebaseUid), studentDocData, { merge: true });
      } catch (firestoreErr: any) {
        console.error('Firestore write failure during student registration:', firestoreErr);
        if (firebaseUser) {
          try {
            await firebaseUser.delete();
          } catch (delErr) {
            console.warn('Could not roll back Auth user on student Firestore failure:', delErr);
          }
        }
        const errorMsg = `Database profile creation failed: ${formatFirebaseError(firestoreErr, 'Failed to save student profile')}. Registration was rolled back.`;
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Synchronize with API backend asynchronously
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

      toast.success('Student account registered and authenticated successfully!');
      return { uid: firebaseUid, user: appUser };
    } catch (err: any) {
      const msg = formatFirebaseError(err, 'Student registration failed');
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── REAL FACULTY REGISTRATION (Firebase Auth + Firestore) ─────────────────
  const registerFaculty = useCallback(async (data: any) => {
    setLoading(true);
    let firebaseUser: FirebaseUser | null = null;
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

      // 1. Firebase Authentication account creation
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      firebaseUser = userCredential.user;
      const firebaseUid = firebaseUser.uid;

      if (fullName) {
        await updateProfile(firebaseUser, { displayName: fullName }).catch(() => {});
      }

      // 2. Document Payloads
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

      // 3. Firestore Creation with Safe Rollback
      try {
        await setDoc(doc(db, 'users', firebaseUid), userDocData, { merge: true });
        await setDoc(doc(db, 'faculty', firebaseUid), facultyDocData, { merge: true });
      } catch (firestoreErr: any) {
        console.error('Firestore write failure during faculty registration:', firestoreErr);
        if (firebaseUser) {
          try {
            await firebaseUser.delete();
          } catch (delErr) {
            console.warn('Could not roll back Auth user on faculty Firestore failure:', delErr);
          }
        }
        const errorMsg = `Faculty profile creation failed: ${formatFirebaseError(firestoreErr, 'Failed to save faculty profile')}. Registration was rolled back.`;
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Synchronize with API backend asynchronously
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

      toast.info('Faculty registration submitted. Pending administrative approval.');
      return { uid: firebaseUid, user: appUser };
    } catch (err: any) {
      const msg = formatFirebaseError(err, 'Faculty registration failed');
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── REAL COMPANY REGISTRATION (Firebase Auth + Firestore) ─────────────────
  const registerCompany = useCallback(async (data: any) => {
    setLoading(true);
    let firebaseUser: FirebaseUser | null = null;
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

      // 1. Firebase Authentication account creation
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      firebaseUser = userCredential.user;
      const firebaseUid = firebaseUser.uid;

      if (contactPerson || companyName) {
        await updateProfile(firebaseUser, { displayName: contactPerson || companyName }).catch(() => {});
      }

      // 2. Document Payloads
      const userDocData = {
        uid: firebaseUid,
        name: contactPerson || companyName,
        companyName,
        displayName: contactPerson || companyName,
        email,
        phone: data.contactPhone || data.phone || '',
        role: 'COMPANY',
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

      // 3. Firestore Creation with Safe Rollback
      try {
        await setDoc(doc(db, 'users', firebaseUid), userDocData, { merge: true });
        await setDoc(doc(db, 'companies', firebaseUid), companyDocData, { merge: true });
      } catch (firestoreErr: any) {
        console.error('Firestore write failure during company registration:', firestoreErr);
        if (firebaseUser) {
          try {
            await firebaseUser.delete();
          } catch (delErr) {
            console.warn('Could not roll back Auth user on company Firestore failure:', delErr);
          }
        }
        const errorMsg = `Company profile creation failed: ${formatFirebaseError(firestoreErr, 'Failed to save company profile')}. Registration was rolled back.`;
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Synchronize with API backend asynchronously
      api.registerCompany({ ...data, firebaseUid }).catch(() => {});

      const appUser = {
        uid: firebaseUid,
        id: firebaseUid,
        email,
        ...userDocData,
        company: companyDocData,
      };

      setUser(appUser);
      setActiveRole('company');

      toast.info('Company registration submitted. Pending institutional verification.');
      return { uid: firebaseUid, user: appUser };
    } catch (err: any) {
      const msg = formatFirebaseError(err, 'Company registration failed');
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── REAL ADMIN REGISTRATION (Firebase Auth + Firestore) ───────────────────
  const registerAdmin = useCallback(async (data: any) => {
    setLoading(true);
    let firebaseUser: FirebaseUser | null = null;
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

      // 1. Firebase Authentication account creation
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      firebaseUser = userCredential.user;
      const firebaseUid = firebaseUser.uid;

      if (fullName) {
        await updateProfile(firebaseUser, { displayName: fullName }).catch(() => {});
      }

      // 2. Document Payloads
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

      // 3. Firestore Creation with Safe Rollback
      try {
        await setDoc(doc(db, 'users', firebaseUid), userDocData, { merge: true });
        await setDoc(doc(db, 'admins', firebaseUid), adminDocData, { merge: true });
      } catch (firestoreErr: any) {
        console.error('Firestore write failure during admin registration:', firestoreErr);
        if (firebaseUser) {
          try {
            await firebaseUser.delete();
          } catch (delErr) {
            console.warn('Could not roll back Auth user on admin Firestore failure:', delErr);
          }
        }
        const errorMsg = `Admin profile creation failed: ${formatFirebaseError(firestoreErr, 'Failed to save admin document')}. Registration was rolled back.`;
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Synchronize with API backend asynchronously
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

      toast.success(`Administrator account created successfully for ${fullName}!`);
      return { uid: firebaseUid, user: appUser };
    } catch (err: any) {
      const msg = formatFirebaseError(err, 'Administrator registration failed');
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
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error refreshing user profile:', err);
        setUser(null);
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
