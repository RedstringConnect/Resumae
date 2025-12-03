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

