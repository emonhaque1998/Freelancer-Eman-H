
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: string;
  avatar?: string;
  bscMajor?: string;
  graduationYear?: string;
}

export interface AboutData {
  id: string;
  name: string;
  title: string;
  overview: string;
  bio: string;
  vision: string;
  skills: string[];
  values: string[];
  experience_years: string;
  projects_count: string;
  education: string;
  location: string;
  email: string;
  imageUrl: string;
  workspaceImageUrl?: string;
  hardwareImageUrl?: string;
  faviconUrl?: string;
}

export interface LocationData {
  country: string;
  countryCode: string;
  currency: string;
  currencySymbol: string;
  region: string;
  ip: string;
  exchangeRate: number; // Rate relative to USD
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  demoUrl: string;
  imageUrl: string;
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
  features: string[];
}

export type InquiryStatus = 'pending' | 'accepted' | 'in-progress' | 'completed' | 'rejected';

export interface ServiceInquiry {
  id: string;
  serviceId: string;
  serviceTitle: string;
  clientName: string;
  clientEmail: string;
  clientId?: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface InquiryMessage {
  id: string;
  inquiryId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  createdAt: string;
}

export interface Review {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}
