import axios from 'axios';

// Configure axios defaults
const token = 'f8ebe492fc8162f8466c3eec5bdc556c2f1029f1';
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

// Add a function to set the token
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
  axios.defaults.headers.common['Authorization'] = `Token ${token}`;
};

// Add a function to remove the token
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  delete axios.defaults.headers.common['Authorization'];
}; 