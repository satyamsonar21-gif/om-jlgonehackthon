import { Injectable, Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { getApps, getApp, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth, Auth, DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAdminService.name);
  private app: App;

  onModuleInit() {
    this.initFirebaseAdmin();
  }

  private initFirebaseAdmin() {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      this.app = getApp();
      return;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID || 'interniq-5a405';
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

    try {
      if (serviceAccountJson) {
        const parsed = JSON.parse(serviceAccountJson);
        this.app = initializeApp({
          credential: cert(parsed),
          projectId: parsed.project_id || projectId,
        });
        this.logger.log('Firebase Admin SDK initialized using FIREBASE_SERVICE_ACCOUNT environment variable');
      } else if (clientEmail && privateKey) {
        this.app = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
          projectId,
        });
        this.logger.log('Firebase Admin SDK initialized using client email & private key environment variables');
      } else {
        this.app = initializeApp({
          projectId,
        });
        this.logger.log(`Firebase Admin SDK initialized with project ID: ${projectId}`);
      }
    } catch (err: any) {
      this.logger.warn(`Firebase Admin SDK initialization notice: ${err.message}`);
      const apps = getApps();
      if (apps.length > 0) {
        this.app = getApp();
      }
    }
  }

  getAuth(): Auth {
    return getAuth(this.app);
  }

  getFirestore(): Firestore {
    return getFirestore(this.app);
  }

  async verifyIdToken(token: string): Promise<DecodedIdToken> {
    try {
      return await this.getAuth().verifyIdToken(token, true);
    } catch (error: any) {
      const code = error.code || '';
      if (code === 'auth/id-token-expired') {
        throw new UnauthorizedException('Firebase authentication token has expired. Please sign in again.');
      } else if (code === 'auth/id-token-revoked') {
        throw new UnauthorizedException('Firebase authentication token has been revoked. Please sign in again.');
      } else if (code === 'auth/argument-error' || code === 'auth/invalid-id-token') {
        throw new UnauthorizedException('Malformed or invalid Firebase authentication token.');
      }
      throw new UnauthorizedException(error.message || 'Failed to authenticate Firebase token.');
    }
  }
}
