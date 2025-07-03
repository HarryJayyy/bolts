import React, { createContext, useContext, useReducer } from 'react'
import { Document, DocumentType, ChatMessage, UsageStats } from '../types'
import axios from 'axios'

interface DocumentState {
  documents: Document[]
  currentDocument: Document | null
  chatMessages: ChatMessage[]
  usageStats: UsageStats
  isLoading: boolean
  error: string | null
}

type DocumentAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DOCUMENTS'; payload: Document[] }
  | { type: 'SET_CURRENT_DOCUMENT'; payload: Document | null }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'UPDATE_DOCUMENT'; payload: Document }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'CLEAR_CHAT'; }
  | { type: 'SET_USAGE_STATS'; payload: UsageStats }

interface DocumentContextType extends DocumentState {
  createDocument: (type: DocumentType, prompt: string) => Promise<Document>
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  getDocument: (id: string) => Promise<Document>
  getDocuments: () => Promise<Document[]>
  generateContent: (documentId: string, prompt: string) => Promise<void>
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  clearChat: () => void
  exportDocument: (documentId: string, format: string) => Promise<string>
  parseFile: (file: File) => Promise<Document>
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

const documentReducer = (state: DocumentState, action: DocumentAction): DocumentState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload }
    case 'SET_CURRENT_DOCUMENT':
      return { ...state, currentDocument: action.payload }
    case 'ADD_DOCUMENT':
      return { ...state, documents: [action.payload, ...state.documents] }
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc => 
          doc.id === action.payload.id ? action.payload : doc
        ),
        currentDocument: state.currentDocument?.id === action.payload.id 
          ? action.payload 
          : state.currentDocument
      }
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload),
        currentDocument: state.currentDocument?.id === action.payload 
          ? null 
          : state.currentDocument
      }
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload]
      }
    case 'CLEAR_CHAT':
      return { ...state, chatMessages: [] }
    case 'SET_USAGE_STATS':
      return { ...state, usageStats: action.payload }
    default:
      return state
  }
}

const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    title: 'Mobile Banking App PRD',
    type: 'prd',
    content: '# Product Requirements Document\n\n## Overview\nThis document outlines the requirements for a new mobile banking application...',
    status: 'published',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T14:30:00Z',
    author: 'Demo User',
    version: 2,
    tags: ['banking', 'mobile', 'fintech']
  },
  {
    id: 'doc-2',
    title: 'API Integration BRD',
    type: 'brd',
    content: '# Business Requirements Document\n\n## Executive Summary\nThis document defines the business requirements for API integration...',
    status: 'review',
    createdAt: '2025-01-14T09:15:00Z',
    updatedAt: '2025-01-14T16:45:00Z',
    author: 'Demo User',
    version: 1,
    tags: ['api', 'integration', 'backend']
  },
  {
    id: 'doc-3',
    title: 'User Authentication Tech Spec',
    type: 'tech-spec',
    content: '# Technical Specification\n\n## Architecture Overview\nThis specification covers the technical implementation of user authentication...',
    status: 'draft',
    createdAt: '2025-01-13T11:30:00Z',
    updatedAt: '2025-01-13T11:30:00Z',
    author: 'Demo User',
    version: 1,
    tags: ['authentication', 'security', 'backend']
  }
]

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(documentReducer, {
    documents: mockDocuments,
    currentDocument: null,
    chatMessages: [],
    usageStats: {
      documentsCreated: 12,
      aiGenerations: 48,
      wordsGenerated: 15420,
      timesSaved: 24
    },
    isLoading: false,
    error: null,
  })

  const createDocument = async (type: DocumentType, prompt: string): Promise<Document> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Mock API call to n8n webhook
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        title: `New ${type.toUpperCase()} Document`,
        type,
        content: `# ${type.toUpperCase()} Document\n\n## Generated from prompt:\n${prompt}\n\n## Table of Contents\n1. Introduction\n2. Requirements\n3. Implementation\n4. Conclusion`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'Demo User',
        version: 1
      }
      
      dispatch({ type: 'ADD_DOCUMENT', payload: newDocument })
      dispatch({ type: 'SET_LOADING', payload: false })
      
      return newDocument
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create document' })
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    const document = state.documents.find(doc => doc.id === id)
    if (!document) throw new Error('Document not found')
    
    const updatedDocument = {
      ...document,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: document.version + 1
    }
    
    dispatch({ type: 'UPDATE_DOCUMENT', payload: updatedDocument })
  }

  const deleteDocument = async (id: string) => {
    dispatch({ type: 'DELETE_DOCUMENT', payload: id })
  }

  const getDocument = async (id: string): Promise<Document> => {
    const document = state.documents.find(doc => doc.id === id)
    if (!document) throw new Error('Document not found')
    
    dispatch({ type: 'SET_CURRENT_DOCUMENT', payload: document })
    return document
  }

  const getDocuments = async (): Promise<Document[]> => {
    return state.documents
  }

  const generateContent = async (documentId: string, prompt: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Mock API call to n8n webhook for content improvement
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const document = state.documents.find(doc => doc.id === documentId)
      if (document) {
        const updatedContent = document.content + `\n\n## AI Generated Section\n\nBased on your prompt: "${prompt}"\n\nThis is the AI-generated content that addresses your request...`
        
        await updateDocument(documentId, { content: updatedContent })
      }
      
      dispatch({ type: 'SET_LOADING', payload: false })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to generate content' })
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const chatMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString()
    }
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: chatMessage })
  }

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' })
  }

  const exportDocument = async (documentId: string, format: string): Promise<string> => {
    // Mock export functionality
    await new Promise(resolve => setTimeout(resolve, 2000))
    return `https://example.com/exports/document-${documentId}.${format}`
  }

  const parseFile = async (file: File): Promise<Document> => {
    // Mock file parsing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const parsedDocument: Document = {
      id: `parsed-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      type: 'prd',
      content: `# Parsed Document: ${file.name}\n\nThis content was extracted from the uploaded file...`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'Demo User',
      version: 1
    }
    
    dispatch({ type: 'ADD_DOCUMENT', payload: parsedDocument })
    return parsedDocument
  }

  return (
    <DocumentContext.Provider value={{
      ...state,
      createDocument,
      updateDocument,
      deleteDocument,
      getDocument,
      getDocuments,
      generateContent,
      addChatMessage,
      clearChat,
      exportDocument,
      parseFile,
    }}>
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocument() {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider')
  }
  return context
}