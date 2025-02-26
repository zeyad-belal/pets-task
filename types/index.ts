export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  created_at: string;
  owner_id: string;
}

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
} 