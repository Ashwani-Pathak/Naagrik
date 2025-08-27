import { User as PrismaUser, Issue as PrismaIssue, Comment as PrismaComment, Role, IssueStatus } from '@prisma/client'

// Export Prisma types with relations
export type User = PrismaUser & {
  issues?: Issue[]
  comments?: Comment[]
}

export type Issue = PrismaIssue & {
  user: User
  comments?: Comment[]
}

export type Comment = PrismaComment & {
  user: User
  issue?: Issue
}

// Export enums
export { Role, IssueStatus }

// Custom types for API
export interface CreateIssueData {
  title: string
  description: string
  category: string
  location: {
    lat: number
    lng: number
  }
  photo?: string
}

export interface CreateUserData {
  username: string
  email: string
  password: string
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
