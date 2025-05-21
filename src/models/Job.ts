export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  createdAt: Date;
  employerId: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedAt: Date;
  updatedAt: Date;
  coverLetter?: string;
  resumeUrl: string;
} 