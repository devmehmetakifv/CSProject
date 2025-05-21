import { Timestamp } from 'firebase/firestore';

export type ApplicationStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'withdrawn';

export interface ApplicationData {
  coverLetter?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  additionalDocuments?: string[];
  [key: string]: unknown;
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  employerId: string;
  status: ApplicationStatus;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  reviewedAt?: Timestamp | Date;
  reviewedBy?: string;
  data?: ApplicationData;
  notes?: string;
}

export type CreateApplicationInput = Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'reviewedAt' | 'reviewedBy'> & {
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
};

export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

export const ApplicationErrorCodes = {
  CREATE_FAILED: 'APPLICATION_CREATE_FAILED',
  FETCH_FAILED: 'APPLICATION_FETCH_FAILED',
  UPDATE_FAILED: 'APPLICATION_UPDATE_FAILED',
  DELETE_FAILED: 'APPLICATION_DELETE_FAILED',
  STATUS_UPDATE_FAILED: 'APPLICATION_STATUS_UPDATE_FAILED',
  INVALID_STATUS: 'APPLICATION_INVALID_STATUS'
} as const; 