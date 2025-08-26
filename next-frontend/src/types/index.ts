export interface User {
  id: string
  username: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface Issue {
  id: string
  title: string
  description: string
  category: string
  status: 'Open' | 'In Progress' | 'Resolved'
  location: {
    lat: number
    lng: number
    address?: string
  }
  imageUrl?: string
  upvotes: number
  userId: string
  user: User
  createdAt: string
  updatedAt: string
  comments?: Comment[]
}

export interface Comment {
  id: string
  content: string
  userId: string
  user: User
  issueId: string
  createdAt: string
  updatedAt: string
}

export interface CreateIssueData {
  title: string
  description: string
  category: string
  location: {
    lat: number
    lng: number
    address?: string
  }
  image?: File
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface EmergencyContact {
  title: string
  number: string
  icon: string
  category: 'police' | 'fire' | 'ambulance' | 'women' | 'disaster'
}

export interface AuthorityContact {
  title: string
  number: string
  icon: string
  category: 'municipal' | 'water' | 'electricity' | 'sanitation' | 'publicworks'
}
