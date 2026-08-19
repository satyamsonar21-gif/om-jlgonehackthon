import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken } from './api';
import { RoleKey } from '@/design-system/tokens';
import { toast } from 'sonner';
import { auth, db } from '@/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const VALID_ROLES = [
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

interface AuthContextType {
  activeRole: RoleKey;
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password?: string }) => Promise<any>;
  registerStudent: (data: any) => Promise<any>;
  registerFaculty: (data: any) => Promise<any>;
  registerCompany: (data: any) => Promise<any>;
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Synchronize Firebase ID token for authenticated API requests
          const token = await firebaseUser.getIdToken();
          setAuthToken(token);

          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const rawRole = userData.role;
            if (rawRole && VALID_ROLES.includes(rawRole.toUpperCase())) {
              let studentData = undefined;
              if (rawRole.toUpperCase() === 'STUDENT') {
                try {
                  const studentSnap = await getDoc(doc(db, 'students', firebaseUser.uid));
                  if (studentSnap.exists()) {
                    studentData = studentSnap.data();
                  }
                } catch (sErr) {
                  console.warn('Student profile fetch notice:', sErr);
                }
              }

              const appUser = {
                uid: firebaseUser.uid,
                id: firebaseUser.uid,
                email: firebaseUser.email,
                ...userData,
                student: studentData,
              };
              setUser(appUser);
              setActiveRole(normalizeRoleToKey(rawRole));
            } else {
              console.warn('Firebase user has missing or invalid role in Firestore');
              setUser(null);
            }
          } else {
            console.warn('Firebase user doc not found in Firestore');
            setUser(null);
          }
        } catch (err) {
          console.error('Error fetching Firestore user profile on auth state change:', err);
          setUser(null);
          setAuthToken(null);
        }
      } else {
        setUser(null);
        setAuthToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ─── REAL FIREBASE AUTHENTICATION + FIRESTORE ROLE LOOKUP ──────────────────
  const login = async (credentials: { email: string; password?: string }) => {
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

      // 2. Fetch Firestore profile at users/{uid}
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // User profile not found
        await signOut(auth);
        setUser(null);
        const errorMsg = 'User profile not found in Firestore. Please register or contact support.';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      const userData = userDocSnap.data();
      const rawRole = userData.role;

      // 3. Validate Role
      if (!rawRole || !VALID_ROLES.includes(rawRole.toUpperCase())) {
        await signOut(auth);
        setUser(null);
        const errorMsg = 'User account has an invalid or missing role configuration.';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      let studentData = undefined;
      if (rawRole.toUpperCase() === 'STUDENT') {
        try {
          const studentSnap = await getDoc(doc(db, 'students', uid));
          if (studentSnap.exists()) {
            studentData = studentSnap.data();
          }
        } catch (sErr) {
          console.warn('Student profile fetch notice on login:', sErr);
        }
      }

      const appUser = {
        uid: firebaseUser.uid,
        id: firebaseUser.uid,
        email: firebaseUser.email,
        ...userData,
        student: studentData,
      };

      setUser(appUser);
      const normalized = normalizeRoleToKey(rawRole);
      setActiveRole(normalized);

      const displayName = userData.name || userData.firstName || firebaseUser.displayName || 'Student';
      toast.success(`Welcome back, ${displayName}!`);

      return {
        user: appUser,
        role: rawRole,
        status: userData.status,
      };
    } catch (err: any) {
      let msg = err.message || 'Authentication failed. Please try again.';
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
          case 'auth/invalid-login-credentials':
            msg = 'Invalid email or password. Please try again.';
            break;
          case 'auth/invalid-email':
            msg = 'The email address format is invalid.';
            break;
          case 'auth/user-disabled':
            msg = 'This account has been disabled.';
            break;
          case 'auth/too-many-requests':
            msg = 'Too many failed login attempts. Please try again later.';
            break;
          case 'auth/network-request-failed':
            msg = 'Network connection error. Please check your internet connection.';
            break;
          default:
            msg = err.message || 'Failed to authenticate with Firebase.';
        }
        toast.error(msg);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ─── REAL STUDENT REGISTRATION (Firebase Auth + Firestore) ─────────────────
  const registerStudent = async (data: any) => {
    setLoading(true);
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
      const firebaseUser = userCredential.user;
      const uid = firebaseUser.uid;

      if (fullName) {
        await updateProfile(firebaseUser, { displayName: fullName }).catch(() => {});
      }

      // 2. Format skills as array of strings
      const skillsArray = Array.isArray(data.skills)
        ? data.skills
        : (typeof data.skills === 'string' && data.skills.trim()
            ? data.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
            : ['React', 'TypeScript', 'Node.js']);

      // 3. Create users/{uid} document in Firestore
      const userDocRef = doc(db, 'users', uid);
      const userDocData = {
        uid,
        name: fullName,
        displayName: fullName,
        email: firebaseUser.email || email,
        phone: data.phone || '',
        role: 'STUDENT',
        status: 'ACTIVE',
        department: branch,
        collegeName: data.collegeName || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(userDocRef, userDocData);

      // 4. Create role-specific students/{uid} document in Firestore matching exact schema
      const studentDocRef = doc(db, 'students', uid);
      const studentDocData = {
        name: fullName,
        email: firebaseUser.email || email,
        rollNumber: rollNumber,
        branch: branch,
        cgpa: Number(data.cgpa) || 0,
        backlogs: Number(data.backlogs) || 0,
        passingYear: Number(data.passingYear) || 2026,
        skills: skillsArray,
        resume: data.resume || data.resumeUrl || '',
        // Compatibility and dossier fields
        uid,
        userId: uid,
        phone: data.phone || '',
        studentId: rollNumber,
        enrollmentNumber: rollNumber,
        collegeName: data.collegeName || '',
        department: branch,
        year: Number(data.year) || 3,
        semester: Number(data.semester) || 6,
        resumeUrl: data.resumeUrl || data.resume || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(studentDocRef, studentDocData);

      // Synchronize with API backend asynchronously if available
      api.registerStudent({ ...data, rollNumber, branch, firebaseUid: uid }).catch(() => {});

      const appUser = {
        uid,
        id: uid,
        email,
        ...userDocData,
        student: studentDocData,
      };
      setUser(appUser);
      setActiveRole('student');

      toast.success('Student account registered and authenticated successfully!');
      return { uid, user: appUser };
    } catch (err: any) {
      let msg = err.message || 'Student registration failed';
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            msg = 'This email is already registered. Please sign in instead.';
            break;
          case 'auth/weak-password':
            msg = 'Password must be at least 8 characters long.';
            break;
          case 'auth/invalid-email':
            msg = 'Please enter a valid email address.';
            break;
          case 'auth/network-request-failed':
            msg = 'Network error. Please check your internet connection.';
            break;
          default:
            msg = err.message || 'Student registration failed.';
        }
      }
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ─── REAL FACULTY REGISTRATION (Firebase Auth + Firestore) ─────────────────
  const registerFaculty = async (data: any) => {
    setLoading(true);
    try {
      const email = (data.email || '').trim().toLowerCase();
      const password = data.password;
      const fullName = (data.name || `${data.firstName || ''} ${data.lastName || ''}`).trim();

      if (!email || !password) {
        const msg = 'Email and password are required for faculty registration.';
        toast.error(msg);
        throw new Error(msg);
      }

      // 1. Firebase Authentication account creation
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const uid = firebaseUser.uid;

      if (fullName) {
        await updateProfile(firebaseUser, { displayName: fullName }).catch(() => {});
      }

      // 2. Create users/{uid} document in Firestore
      const userDocRef = doc(db, 'users', uid);
      const userDocData = {
        uid,
        name: fullName,
        displayName: fullName,
        email,
        phone: data.phone || '',
        role: 'FACULTY',
        status: 'PENDING_APPROVAL',
        department: data.department || '',
        designation: data.designation || '',
        collegeName: data.collegeName || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(userDocRef, userDocData);

      // 3. Create role-specific faculty/{uid} document in Firestore
      const facultyDocRef = doc(db, 'faculty', uid);
      await setDoc(facultyDocRef, {
        uid,
        userId: uid,
        name: fullName,
        email,
        phone: data.phone || '',
        facultyId: data.facultyId || data.employeeId || '',
        employeeId: data.employeeId || data.facultyId || '',
        department: data.department || '',
        designation: data.designation || '',
        collegeName: data.collegeName || '',
        status: 'PENDING_APPROVAL',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Synchronize with API backend asynchronously
      api.registerFaculty({ ...data, firebaseUid: uid }).catch(() => {});

      const appUser = {
        uid,
        id: uid,
        email,
        ...userDocData,
      };
      setUser(appUser);
      setActiveRole('faculty');

      toast.info('Faculty registration submitted. Pending administrative review.');
      return { uid, user: appUser };
    } catch (err: any) {
      let msg = err.message || 'Faculty registration failed';
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            msg = 'An account with this email already exists.';
            break;
          case 'auth/weak-password':
            msg = 'Password must be at least 8 characters long.';
            break;
          case 'auth/invalid-email':
            msg = 'Please enter a valid email address.';
            break;
          default:
            msg = err.message || 'Faculty registration failed.';
        }
      }
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ─── REAL COMPANY REGISTRATION (Firebase Auth + Firestore) ─────────────────
  const registerCompany = async (data: any) => {
    setLoading(true);
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

      // 1. Firebase Authentication account creation
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const uid = firebaseUser.uid;

      if (contactPerson || companyName) {
        await updateProfile(firebaseUser, { displayName: contactPerson || companyName }).catch(() => {});
      }

      // 2. Create users/{uid} document in Firestore
      const userDocRef = doc(db, 'users', uid);
      const userDocData = {
        uid,
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
      await setDoc(userDocRef, userDocData);

      // 3. Create role-specific companies/{uid} document in Firestore
      const companyDocRef = doc(db, 'companies', uid);
      await setDoc(companyDocRef, {
        uid,
        userId: uid,
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
      });

      // Synchronize with API backend asynchronously
      api.registerCompany({ ...data, firebaseUid: uid }).catch(() => {});

      const appUser = {
        uid,
        id: uid,
        email,
        ...userDocData,
      };
      setUser(appUser);
      setActiveRole('company');

      toast.info('Company registration submitted. Pending institutional verification.');
      return { uid, user: appUser };
    } catch (err: any) {
      let msg = err.message || 'Company registration failed';
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            msg = 'An account with this email already exists.';
            break;
          case 'auth/weak-password':
            msg = 'Password must be at least 8 characters long.';
            break;
          case 'auth/invalid-email':
            msg = 'Please enter a valid email address.';
            break;
          default:
            msg = err.message || 'Company registration failed.';
        }
      }
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ─── REAL LOGOUT ───────────────────────────────────────────────────────────
  const logout = async () => {
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
  };

  // ─── REFRESH USER IDENTITY FROM FIRESTORE ──────────────────────────────────
  const refreshUser = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const rawRole = userData.role;
          if (rawRole && VALID_ROLES.includes(rawRole.toUpperCase())) {
            const appUser = {
              uid: currentUser.uid,
              id: currentUser.uid,
              email: currentUser.email,
              ...userData,
            };
            setUser(appUser);
            setActiveRole(normalizeRoleToKey(rawRole));
          } else {
            setUser(null);
          }
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
  };

  return (
    <AuthContext.Provider
      value={{
        activeRole,
        user,
        isAuthenticated: Boolean(user),
        loading,
        login,
        registerStudent,
        registerFaculty,
        registerCompany,
        logout,
        refreshUser,
      }}
    >
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
