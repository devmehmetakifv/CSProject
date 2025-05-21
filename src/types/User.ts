export interface User {
  id: string;
  email: string;
  displayName?: string;
  type: 'jobSeeker' | 'employer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
} 