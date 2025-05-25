export interface User {
  id: string;
  email: string;
  displayName: string;
  type: 'jobseeker' | 'employer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  profile?: {
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    bio?: string;
    skills?: string[];
    experience?: string;
    education?: string;
    languages?: string[];
    certifications?: string[];
    socialLinks?: {
      linkedin?: string;
      github?: string;
      website?: string;
    };
  };
}

export interface UserProfile extends User {
  phoneNumber?: string;
  address?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  resumeUrl?: string;
} 