import { User } from '../models/User';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export class AuthService {
  private auth = getAuth();

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return this.mapFirebaseUserToUser(userCredential.user);
    } catch (error) {
      throw new Error('Giriş başarısız: ' + (error as Error).message);
    }
  }

  async register(email: string, password: string, displayName: string, userType: User['userType']): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return this.mapFirebaseUserToUser(userCredential.user);
    } catch (error) {
      throw new Error('Kayıt başarısız: ' + (error as Error).message);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw new Error('Çıkış başarısız: ' + (error as Error).message);
    }
  }

  private mapFirebaseUserToUser(firebaseUser: any): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || '',
      userType: 'jobseeker', // Varsayılan olarak jobseeker
      createdAt: new Date(firebaseUser.metadata.creationTime),
      updatedAt: new Date(firebaseUser.metadata.lastSignInTime)
    };
  }
} 