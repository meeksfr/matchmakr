import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/',
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export interface Skill {
  id: number;
  name: string;
  description: string;
}

export interface PreviousTitle {
  id: number;
  title: string;
  company: string;
  duration: string;
}

export interface UserProfile {
  id: number;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  bio: string;
  years_of_experience: number;
  is_employer: boolean;
  skills: Skill[];
  image_url: string;
  resume_url: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  twitter_url: string;
  personal_website: string;
  age: number;
  location: string;
  role_type: string;
  current_title: string;
  previous_titles: PreviousTitle[];
  created_at: string;
  updated_at: string;
}

export const login = async (email: string, password: string): Promise<{ token: string }> => {
  try {
    const response = await api.post('auth/login/', { email, password });
    const { token } = response.data;
    localStorage.setItem('auth_token', token);
    return { token };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('auth_token');
};

export const fetchCandidates = async (): Promise<UserProfile[]> => {
  try {
    const response = await api.get('profiles/');
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

export const fetchSkills = async (): Promise<Skill[]> => {
  try {
    const response = await api.get('skills/');
    return response.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

export const createMatch = async (userId: number, jobId: number): Promise<void> => {
  try {
    await api.post('matches/', {
      user_id: userId,
      job_id: jobId,
    });
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
};

export const deleteMatch = async (userId: number, jobId: number): Promise<void> => {
  try {
    await api.delete(`matches/${userId}/${jobId}/`);
  } catch (error) {
    console.error('Error deleting match:', error);
    throw error;
  }
}; 