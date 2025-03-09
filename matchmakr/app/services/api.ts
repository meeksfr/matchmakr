import axios from 'axios';

// Configure axios defaults
const token = 'dc0dab3d4d7d48cafd2e6e6d03d6615e88fcd5a2';
axios.defaults.headers.common['Authorization'] = `Token ${token}`;

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

export const fetchCandidates = async (): Promise<UserProfile[]> => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/v1/profiles/');
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

export const fetchSkills = async (): Promise<Skill[]> => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/v1/skills/');
    return response.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

export const createMatch = async (userId: number, jobId: number): Promise<void> => {
  try {
    await axios.post('http://127.0.0.1:8000/api/v1/matches/', {
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
    await axios.delete(`http://127.0.0.1:8000/api/v1/matches/${userId}/${jobId}/`);
  } catch (error) {
    console.error('Error deleting match:', error);
    throw error;
  }
};

export interface SignupData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bio?: string;
  age?: number;
  location?: string;
  roleType?: string;
  currentTitle?: string;
  yearsOfExperience?: number;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  imageUrl?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: UserProfile;
}

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await fetch('/api/v1/signup/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create account');
  }

  return response.json();
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch('/api/v1/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Invalid credentials');
  }

  return response.json();
}; 