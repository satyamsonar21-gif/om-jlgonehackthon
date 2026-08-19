import { storage, db, auth } from '@/firebase';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
  UploadMetadata,
} from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export interface FileValidationOptions {
  maxSizeBytes?: number;
  allowedTypes?: string[];
}

export function validateDocumentFile(
  file: File,
  options?: FileValidationOptions
): { valid: boolean; error?: string } {
  const maxSize = options?.maxSizeBytes || MAX_FILE_SIZE_BYTES;
  const allowedTypes = options?.allowedTypes || ALLOWED_DOCUMENT_TYPES;

  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  if (file.size > maxSize) {
    const sizeInMb = Math.round(maxSize / (1024 * 1024));
    return { valid: false, error: `File size exceeds maximum limit of ${sizeInMb} MB.` };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file format. Please upload a PDF, DOCX, or Image (PNG/JPEG).',
    };
  }

  return { valid: true };
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, '_');
}

// ─── SECURE STORAGE PATH GENERATORS ──────────────────────────────────────────

export const StoragePaths = {
  // Student Documents (Scoped to Student UID)
  studentResume: (uid: string, fileName: string) =>
    `students/${uid}/resumes/${Date.now()}_${sanitizeFileName(fileName)}`,
  studentCertificate: (uid: string, fileName: string) =>
    `students/${uid}/certificates/${Date.now()}_${sanitizeFileName(fileName)}`,
  studentDocument: (uid: string, docType: string, fileName: string) =>
    `students/${uid}/documents/${docType}/${Date.now()}_${sanitizeFileName(fileName)}`,

  // Company Documents (Scoped to Company UID & Application)
  companyOfferLetter: (companyUid: string, applicationId: string, fileName: string) =>
    `companies/${companyUid}/offers/${applicationId}/${Date.now()}_${sanitizeFileName(fileName)}`,
  companyJoiningLetter: (companyUid: string, applicationId: string, fileName: string) =>
    `companies/${companyUid}/joining_letters/${applicationId}/${Date.now()}_${sanitizeFileName(fileName)}`,

  // Internship Documents (Scoped to Internship ID)
  internshipReport: (internshipId: string, reportId: string, fileName: string) =>
    `internships/${internshipId}/reports/${reportId}/${Date.now()}_${sanitizeFileName(fileName)}`,
  internshipCompletion: (internshipId: string, fileName: string) =>
    `internships/${internshipId}/completion/${Date.now()}_${sanitizeFileName(fileName)}`,

  // Admin / T&P Governance Documents
  adminCertificate: (certificateId: string, fileName: string) =>
    `admin/certificates/${certificateId}/${Date.now()}_${sanitizeFileName(fileName)}`,
  adminPpo: (ppoId: string, fileName: string) =>
    `admin/ppo/${ppoId}/${Date.now()}_${sanitizeFileName(fileName)}`,
};

export interface UploadResult {
  downloadUrl: string;
  fullPath: string;
  name: string;
  size: number;
  contentType: string;
  createdAt: string;
  metadataDocId?: string;
}

export type ProgressCallback = (progressPercent: number, snapshot: UploadTaskSnapshot) => void;

/**
 * Uploads a document to Firebase Storage with real-time progress, file validation,
 * and automatic Firestore metadata persistence.
 */
export async function uploadDocument(
  file: File,
  storagePath: string,
  onProgress?: ProgressCallback,
  customMetadata?: Record<string, string>
): Promise<UploadResult> {
  // 1. Validation
  const validation = validateDocumentFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'File validation failed');
  }

  // 2. Prepare Storage Reference & Metadata
  const storageRef = ref(storage, storagePath);
  const metadata: UploadMetadata = {
    contentType: file.type,
    customMetadata: {
      originalName: file.name,
      uploadedBy: auth.currentUser?.uid || 'anonymous',
      uploadedAt: new Date().toISOString(),
      ...customMetadata,
    },
  };

  // 3. Resumable Upload Task
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) {
          onProgress(progress, snapshot);
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          // 4. Retrieve Public/Authorized Download URL
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // 5. Save File Metadata Record in Firestore
          let metadataDocId: string | undefined;
          try {
            const metaDoc = await addDoc(collection(db, 'storage_documents'), {
              fileName: file.name,
              storagePath,
              downloadUrl,
              size: file.size,
              contentType: file.type,
              uploadedByUid: auth.currentUser?.uid || null,
              uploadedByEmail: auth.currentUser?.email || null,
              customMetadata: customMetadata || {},
              createdAt: serverTimestamp(),
            });
            metadataDocId = metaDoc.id;
          } catch (metaErr) {
            console.warn('Document metadata record notice:', metaErr);
          }

          resolve({
            downloadUrl,
            fullPath: storagePath,
            name: file.name,
            size: file.size,
            contentType: file.type,
            createdAt: new Date().toISOString(),
            metadataDocId,
          });
        } catch (urlErr) {
          reject(urlErr);
        }
      }
    );
  });
}

/**
 * Retrieves the download URL for a given storage path
 */
export async function getDocumentDownloadUrl(storagePath: string): Promise<string> {
  const storageRef = ref(storage, storagePath);
  return getDownloadURL(storageRef);
}

/**
 * Deletes a document from Firebase Storage
 */
export async function deleteDocument(storagePath: string): Promise<void> {
  const storageRef = ref(storage, storagePath);
  return deleteObject(storageRef);
}
