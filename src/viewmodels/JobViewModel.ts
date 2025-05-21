import { makeAutoObservable } from 'mobx';
import { Job, JobApplication } from '../models/Job';
import { JobService } from '../services/JobService';

export class JobViewModel {
  private jobService: JobService;
  jobs: Job[] = [];
  currentJob: Job | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.jobService = new JobService();
  }

  async fetchJobs(filters?: Partial<Job>) {
    try {
      this.loading = true;
      this.error = null;
      this.jobs = await this.jobService.getJobs(filters);
    } catch (error) {
      this.error = (error as Error).message;
    } finally {
      this.loading = false;
    }
  }

  async fetchJob(id: string) {
    try {
      this.loading = true;
      this.error = null;
      this.currentJob = await this.jobService.getJob(id);
    } catch (error) {
      this.error = (error as Error).message;
    } finally {
      this.loading = false;
    }
  }

  async createJob(job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      this.loading = true;
      this.error = null;
      const newJob = await this.jobService.createJob(job);
      this.jobs.push(newJob);
    } catch (error) {
      this.error = (error as Error).message;
    } finally {
      this.loading = false;
    }
  }

  async updateJob(id: string, job: Partial<Job>) {
    try {
      this.loading = true;
      this.error = null;
      await this.jobService.updateJob(id, job);
      const index = this.jobs.findIndex(j => j.id === id);
      if (index !== -1) {
        this.jobs[index] = { ...this.jobs[index], ...job };
      }
      if (this.currentJob?.id === id) {
        this.currentJob = { ...this.currentJob, ...job };
      }
    } catch (error) {
      this.error = (error as Error).message;
    } finally {
      this.loading = false;
    }
  }

  async deleteJob(id: string) {
    try {
      this.loading = true;
      this.error = null;
      await this.jobService.deleteJob(id);
      this.jobs = this.jobs.filter(job => job.id !== id);
      if (this.currentJob?.id === id) {
        this.currentJob = null;
      }
    } catch (error) {
      this.error = (error as Error).message;
    } finally {
      this.loading = false;
    }
  }

  async applyForJob(application: Omit<JobApplication, 'id' | 'appliedAt' | 'updatedAt'>) {
    try {
      this.loading = true;
      this.error = null;
      await this.jobService.applyForJob(application);
    } catch (error) {
      this.error = (error as Error).message;
    } finally {
      this.loading = false;
    }
  }

  clearError() {
    this.error = null;
  }
} 