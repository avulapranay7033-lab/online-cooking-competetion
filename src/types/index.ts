export type UserRole = 'chef' | 'audience' | 'admin';

export interface Chef {
  id: string;
  name: string;
  email: string;
  mobile: string;
  profilePicture: string;
  recipes: Recipe[];
  votes: number;
  rank?: number;
  createdAt: string;
}

export interface Recipe {
  id: string;
  chefId: string;
  name: string;
  ingredients: string;
  timeRequired: string;
  media: string;
  mediaType: 'image' | 'video';
  createdAt: string;
}

export interface Audience {
  id: string;
  name: string;
  email: string;
  mobile: string;
  votedChefId?: string;
  createdAt: string;
}

export interface CompetitionState {
  isResultsDeclared: boolean;
  rankings: {
    chefId: string;
    rank: number;
  }[];
}

export interface AuthState {
  isLoggedIn: boolean;
  role: UserRole | null;
  userId: string | null;
}
