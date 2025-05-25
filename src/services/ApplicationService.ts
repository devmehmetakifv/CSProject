import { Application, ApplicationStatus, ApplicationData, CreateApplicationInput, ApplicationError, ApplicationErrorCodes } from '../models/Application';
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, Timestamp, deleteDoc, writeBatch, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

export class ApplicationService {
  private readonly db = getFirestore();
  private readonly applicationsCollection = collection(this.db, 'applications');

  private handleError(error: unknown, code: string, message: string): never {
    console.error(`${message}:`, error);
    throw new ApplicationError(message, code, error);
  }

  async createApplication(application: CreateApplicationInput): Promise<Application> {
    try {
      const now = Timestamp.now();
      const applicationData = {
        ...application,
        status: 'pending' as const,
        createdAt: application.createdAt || now,
        updatedAt: application.updatedAt || now
      };

      const docRef = await addDoc(this.applicationsCollection, applicationData);
      
      return {
        ...applicationData,
        id: docRef.id
      } as Application;
    } catch (error) {
      this.handleError(error, ApplicationErrorCodes.CREATE_FAILED, 'Başvuru oluşturulamadı');
    }
  }

  async getApplications(options: {
    userId: string;
    userType: 'applicant' | 'employer';
    status?: ApplicationStatus;
    limit?: number;
    orderBy?: 'date' | 'status';
  }): Promise<Application[]> {
    try {
      const field = options.userType === 'applicant' ? 'applicantId' : 'employerId';
      let q = query(this.applicationsCollection, where(field, '==', options.userId));

      if (options.status) {
        q = query(q, where('status', '==', options.status));
      }

      if (options.orderBy) {
        switch (options.orderBy) {
          case 'date':
            q = query(q, orderBy('createdAt', 'desc'));
            break;
          case 'status':
            q = query(q, orderBy('status'));
            break;
        }
      }

      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt || Timestamp.now(),
          updatedAt: data.updatedAt || Timestamp.now(),
          status: data.status || 'pending' as const
        } as Application;
      });
    } catch (error) {
      this.handleError(error, ApplicationErrorCodes.FETCH_FAILED, 'Başvurular alınamadı');
    }
  }

  async updateApplicationStatus(
    applicationId: string, 
    status: ApplicationStatus, 
    reviewerId: string,
    notes?: string
  ): Promise<void> {
    try {
      const now = Timestamp.now();
      const applicationRef = doc(this.applicationsCollection, applicationId);
      await updateDoc(applicationRef, {
        status,
        reviewedAt: now,
        reviewedBy: reviewerId,
        updatedAt: now,
        notes: notes ?? null
      });
    } catch (error) {
      this.handleError(error, ApplicationErrorCodes.STATUS_UPDATE_FAILED, 'Başvuru durumu güncellenemedi');
    }
  }

  async withdrawApplication(applicationId: string): Promise<void> {
    try {
      const now = Timestamp.now();
      const applicationRef = doc(this.applicationsCollection, applicationId);
      await updateDoc(applicationRef, {
        status: 'withdrawn' as const,
        updatedAt: now
      });
    } catch (error) {
      this.handleError(error, ApplicationErrorCodes.STATUS_UPDATE_FAILED, 'Başvuru geri çekilemedi');
    }
  }

  async deleteApplication(applicationId: string): Promise<void> {
    try {
      const applicationRef = doc(this.applicationsCollection, applicationId);
      await deleteDoc(applicationRef);
    } catch (error) {
      this.handleError(error, ApplicationErrorCodes.DELETE_FAILED, 'Başvuru silinemedi');
    }
  }
} 