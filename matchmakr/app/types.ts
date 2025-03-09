export interface Skill {
  id: number;
  name: string;
  description: string;
}

export interface PreviousTitle {
  title: string;
  company: string;
  duration: string;
}

export interface UserProfile {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  is_employer: boolean;
  bio: string;
  skills: Skill[];
  years_of_experience: number;
  image_url: string;
  resume_url: string;
  linkedin_url: string;
  age: number | null;
  location: string;
  role_type: string;
  current_title: string;
  previous_titles: PreviousTitle[];
  created_at: string;
  updated_at: string;
} 