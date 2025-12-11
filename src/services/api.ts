import axios from 'axios';
import { ResumeData, TemplateType } from '@/types';
import { auth } from '@/config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, try to refresh
      const user = auth.currentUser;
      if (user) {
        try {
          const token = await user.getIdToken(true); // Force refresh
          error.config.headers.Authorization = `Bearer ${token}`;
          return api.request(error.config);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Optionally redirect to login
        }
      }
    }
    return Promise.reject(error);
  }
);

export interface SavedResume {
  _id: string;
  userId: string;
  userEmail: string;
  title: string;
  resumeData: ResumeData;
  templateType: TemplateType;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Get all resumes for a user
export const getUserResumes = async (userId: string): Promise<SavedResume[]> => {
  try {
    const response = await api.get(`/api/resumes/${userId}`);
    return response.data.resumes || [];
  } catch (error) {
    console.error('Error fetching resumes:', error);
    throw error;
  }
};

// Get a single resume by ID
export const getResumeById = async (resumeId: string): Promise<SavedResume> => {
  try {
    const response = await api.get(`/api/resume/${resumeId}`);
    return response.data.resume;
  } catch (error) {
    console.error('Error fetching resume:', error);
    throw error;
  }
};

// Create a new resume
export const createResume = async (
  userId: string,
  userEmail: string,
  title: string,
  resumeData: ResumeData,
  templateType: TemplateType
): Promise<SavedResume> => {
  try {
    const response = await api.post('/api/resumes', {
      userId,
      userEmail,
      title,
      resumeData,
      templateType,
    });
    return response.data.resume;
  } catch (error) {
    console.error('Error creating resume:', error);
    throw error;
  }
};

// Update a resume
export const updateResume = async (
  resumeId: string,
  updates: {
    title?: string;
    resumeData?: ResumeData;
    templateType?: TemplateType;
  }
): Promise<SavedResume> => {
  try {
    const response = await api.put(`/api/resume/${resumeId}`, updates);
    return response.data.resume;
  } catch (error) {
    console.error('Error updating resume:', error);
    throw error;
  }
};

// Delete a resume
export const deleteResume = async (resumeId: string): Promise<void> => {
  try {
    await api.delete(`/api/resume/${resumeId}`);
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
};

// Health check
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/api/health');
    return response.data.status === 'ok';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

// User & Referral API

export interface UserProfile {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  referralCode: string;
  referredBy: string | null;
  referralCount: number;
  credits: number;
  unlockedTemplates: string[];
  hasClaimedWelcomeBonus: boolean;
}

export interface ReferralStats {
  referralCode: string;
  referralCount: number;
  credits: number;
  unlockedTemplates: string[];
  creditsPerReferral: number;
  creditsToUnlock: number;
}

// Initialize or get user profile
export const initUserProfile = async (referralCode?: string): Promise<UserProfile> => {
  try {
    const params = referralCode ? `?referralCode=${referralCode}` : '';
    const response = await api.get(`/api/user/init${params}`);
    return response.data.user;
  } catch (error) {
    console.error('Error initializing user profile:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get('/api/user/profile');
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Validate referral code
export const validateReferralCode = async (code: string): Promise<{ valid: boolean; referrerName?: string }> => {
  try {
    const response = await api.get(`/api/user/validate-referral/${code}`);
    return { valid: response.data.valid, referrerName: response.data.referrerName };
  } catch (error) {
    console.error('Error validating referral code:', error);
    return { valid: false };
  }
};

// Get referral stats
export const getReferralStats = async (): Promise<ReferralStats> => {
  try {
    const response = await api.get('/api/user/referral-stats');
    return response.data.stats;
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    throw error;
  }
};

// Unlock template
export const unlockTemplate = async (templateId: string): Promise<{ credits: number; unlockedTemplates: string[] }> => {
  try {
    const response = await api.post('/api/user/unlock-template', { templateId });
    return { credits: response.data.credits, unlockedTemplates: response.data.unlockedTemplates };
  } catch (error) {
    console.error('Error unlocking template:', error);
    throw error;
  }
};

