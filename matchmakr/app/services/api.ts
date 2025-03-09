import axios from 'axios';
import { UserProfile, Skill } from '../types';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Company {
  id: number;
  name: string;
  description: string;
  website: string;
  location: string;
  created_by: number;
}

export interface JobPosting {
  id: number;
  title: string;
  company: Company;
  description: string;
  requirements: string;
  required_skills: Skill[];
  preferred_skills: Skill[];
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  employment_type: string;
  experience_level: string;
  is_remote: boolean;
  is_active: boolean;
  application_deadline: string;
}

export interface Match {
  id: number;
  job: JobPosting;
  candidate: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  score: number;
  match_type: 'ALGORITHM' | 'MANUAL';
  created_at: string;
}

export const fetchCandidates = async (): Promise<UserProfile[]> => {
  try {
    const response = await fetch(`${API_URL}/profiles/?is_employer=false`);
    if (!response.ok) {
      throw new Error('Failed to fetch candidates');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

export const fetchJobs = async () => {
  const response = await api.get<JobPosting[]>('/jobs/');
  return response.data;
};

export const fetchMatches = async (jobId: number) => {
  const response = await api.get<Match[]>(`/matches/?job=${jobId}`);
  return response.data;
};

export const createMatch = async (jobId: number, userId: number, matchType: string) => {
  const response = await api.post('/matches/', {
    job: jobId,
    candidate: userId,
    match_type: matchType,
  });
  return response.data;
};

export const deleteMatch = async (matchId: number) => {
  await api.delete(`/matches/${matchId}/`);
};

export const fetchSkills = async (): Promise<Skill[]> => {
  try {
    const response = await fetch(`${API_URL}/skills/`);
    if (!response.ok) {
      throw new Error('Failed to fetch skills');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

export const fetchLocations = async () => {
  const response = await api.get('/jobs/locations/');
  return response.data;
};

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export { UserProfile, Skill }; 