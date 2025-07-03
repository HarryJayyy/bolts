export interface User {
  id: string
  name: string
  email: string
  plan: 'free' | 'pro' | 'enterprise'
  avatar?: string
  token?: string
}

export interface Document {
  id: string
  title: string
  type: DocumentType
  content: string
  status: DocumentStatus
  createdAt: string
  updatedAt: string
  author: string
  version: number
  tags?: string[]
}

export type DocumentType = 
  | 'prd' 
  | 'brd' 
  | 'frd' 
  | 'tech-spec' 
  | 'rfp' 
  | 'sop' 
  | 'test-plan' 
  | 'deployment-guide'

export type DocumentStatus = 'draft' | 'review' | 'published' | 'archived'

export interface DocumentVersion {
  version: number
  timestamp: string
  author: string
  contentPreview: string
  changes?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface UsageStats {
  documentsCreated: number
  aiGenerations: number
  wordsGenerated: number
  timesSaved: number
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  message: string
  data?: T
}