import React, { useState, useRef } from 'react'
import { Send, Upload, FileText, Paperclip } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useDocument } from '../contexts/DocumentContext'
import { useAuth } from '../contexts/AuthContext'
import { DocumentType } from '../types'
import { toast } from '../hooks/use-toast'
import { useLocation } from 'wouter'

export function Dashboard() {
  const [, navigate] = useLocation()
  const { user } = useAuth()
  const { createDocument, addChatMessage, parseFile } = useDocument()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = async () => {
    if (!message.trim() && uploadedFiles.length === 0) return

    setIsLoading(true)
    
    try {
      let prompt = message.trim()
      let documentType: DocumentType = 'prd'
      
      // If files are uploaded, use them as context
      if (uploadedFiles.length > 0) {
        const fileContents = await Promise.all(
          uploadedFiles.map(async (file) => {
            const text = await file.text()
            return `File: ${file.name}\n${text}`
          })
        )
        prompt = `Based on these files:\n\n${fileContents.join('\n\n')}\n\nUser request: ${prompt}`
      }
      
      // Determine document type from prompt
      if (prompt.toLowerCase().includes('brd') || prompt.toLowerCase().includes('business requirement')) {
        documentType = 'brd'
      } else if (prompt.toLowerCase().includes('tech') || prompt.toLowerCase().includes('technical')) {
        documentType = 'tech-spec'
      } else if (prompt.toLowerCase().includes('rfp') || prompt.toLowerCase().includes('request for proposal')) {
        documentType = 'rfp'
      } else if (prompt.toLowerCase().includes('sop') || prompt.toLowerCase().includes('standard operating')) {
        documentType = 'sop'
      } else if (prompt.toLowerCase().includes('test') || prompt.toLowerCase().includes('testing')) {
        documentType = 'test-plan'
      } else if (prompt.toLowerCase().includes('deployment') || prompt.toLowerCase().includes('deploy')) {
        documentType = 'deployment-guide'
      } else if (prompt.toLowerCase().includes('frd') || prompt.toLowerCase().includes('functional requirement')) {
        documentType = 'frd'
      }

      // Create document
      const document = await createDocument(documentType, prompt)
      
      // Add initial chat message
      addChatMessage({
        role: 'user',
        content: message
      })

      // Navigate to editor
      navigate(`/app/documents/${document.id}`)
      
    } catch (error) {
      console.error('Error creating document:', error)
      toast({
        title: "Error",
        description: "Failed to create document. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setMessage('')
      setUploadedFiles([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.includes('text') || 
      file.name.endsWith('.md') || 
      file.name.endsWith('.txt') || 
      file.name.endsWith('.pdf') || 
      file.name.endsWith('.docx')
    )
    
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files])
      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) added as context`
      })
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files])
      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) added as context`
      })
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8">
        {/* Welcome Message */}
        <div className="text-center mb-8 max-w-2xl">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600 text-lg">
            What document would you like to create today?
          </p>
        </div>

        {/* Example prompts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full max-w-4xl">
          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setMessage("Create a PRD for a new mobile app that helps users track their fitness goals")}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Product Requirements</h3>
                <p className="text-sm text-gray-500">Create a PRD for a new product</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setMessage("Write a technical specification for a REST API with authentication")}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Technical Specs</h3>
                <p className="text-sm text-gray-500">Define technical requirements</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setMessage("Create an RFP for a new website development project")}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">RFP Document</h3>
                <p className="text-sm text-gray-500">Request for proposals</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Chat Input */}
        <div className="w-full max-w-4xl">
          {/* File Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors ${
              dragOver 
                ? 'border-pink-400 bg-pink-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-gray-500">
              Supports: TXT, MD, PDF, DOCX files
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.md,.pdf,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {uploadedFiles.map((file, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() => removeFile(index)}
                >
                  {file.name} ×
                </Badge>
              ))}
            </div>
          )}

          {/* Message Input */}
          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the document you want to create..."
              className="min-h-[100px] pr-12 resize-none border-2 border-gray-300 focus:border-pink-500"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={(!message.trim() && uploadedFiles.length === 0) || isLoading}
              className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}