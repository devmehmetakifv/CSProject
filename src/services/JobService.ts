import { Job, JobApplication } from '../models/Job';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

export class JobService {
  private db = getFirestore();
  private jobsCollection = collection(this.db, 'jobs');
  private applicationsCollection = collection(this.db, 'applications');

  async createJob(job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
    try {
      const docRef = await addDoc(this.jobsCollection, {
        ...job,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return {
        ...job,
        id: docRef.id,
        createdAt: new Date()
      };
    } catch (error) {
      throw new Error('İş ilanı oluşturulamadı: ' + (error as Error).message);
    }
  }

  async updateJob(id: string, job: Partial<Job>): Promise<void> {
    try {
      const jobRef = doc(this.db, 'jobs', id);
      await updateDoc(jobRef, {
        ...job,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new Error('İş ilanı güncellenemedi: ' + (error as Error).message);
    }
  }

  async deleteJob(id: string): Promise<void> {
    try {
      const jobRef = doc(this.db, 'jobs', id);
      await deleteDoc(jobRef);
    } catch (error) {
      throw new Error('İş ilanı silinemedi: ' + (error as Error).message);
    }
  }

  async getJob(id: string): Promise<Job> {
    try {
      const jobRef = doc(this.db, 'jobs', id);
      const jobDoc = await getDoc(jobRef);
      
      if (!jobDoc.exists()) {
        throw new Error('İş ilanı bulunamadı');
      }

      return {
        id: jobDoc.id,
        ...jobDoc.data()
      } as Job;
    } catch (error) {
      throw new Error('İş ilanı getirilemedi: ' + (error as Error).message);
    }
  }

  async getJobs(filters?: Partial<Job>): Promise<Job[]> {
    try {
      let q = this.jobsCollection;
      
      if (filters) {
        const conditions = Object.entries(filters).map(([key, value]) => where(key, '==', value));
        q = query(this.jobsCollection, ...conditions) as any;
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Job));
    } catch (error) {
      throw new Error('İş ilanları getirilemedi: ' + (error as Error).message);
    }
  }

  async applyForJob(application: Omit<JobApplication, 'id' | 'appliedAt' | 'updatedAt'>): Promise<JobApplication> {
    try {
      const docRef = await addDoc(this.applicationsCollection, {
        ...application,
        appliedAt: new Date(),
        updatedAt: new Date()
      });

      return {
        ...application,
        id: docRef.id,
        appliedAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      throw new Error('Başvuru yapılamadı: ' + (error as Error).message);
    }
  }
} 