import React, { useState } from 'react'
import { useLocation } from 'wouter'
import { 
  FileText, 
  Zap, 
  Upload, 
  ArrowRight, 
  Loader2,
  CheckCircle,
  Target,
  Users,
  Code,
  FileCheck,
  Settings,
  TestTube,
  Rocket,
  X,
  Plus,
  ArrowLeft
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useDocument } from '../contexts/DocumentContext'
import { useToast } from '../hooks/use-toast'
import { DocumentType } from '../types'
import { useDropzone } from 'react-dropzone'

const predefinedTypes = [
  {
    type: 'prd' as DocumentType,
    title: 'Product Requirements Document',
    description: 'Define product features, user stories, and specifications',
    icon: Target,
    color: 'bg-blue-500'
  },
  {
    type: 'brd' as DocumentType,
    title: 'Business Requirements Document',
    description: 'Outline business needs, objectives, and success criteria',
    icon: Users,
    color: 'bg-green-500'
  },
  {
    type: 'tech-spec' as DocumentType,
    title: 'Technical Specification',
    description: 'Detail technical architecture and implementation',
    icon: Code,
    color: 'bg-purple-500'
  },
  {
    type: 'rfp' as DocumentType,
    title: 'Request for Proposal',
    description: 'Create comprehensive RFPs for vendor selection',
    icon: FileCheck,
    color: 'bg-orange-500'
  },
  {
    type: 'sop' as DocumentType,
    title: 'Standard Operating Procedure',
    description: 'Document step-by-step operational processes',
    icon: Settings,
    color: 'bg-pink-500'
  },
  {
    type: 'test-plan' as DocumentType,
    title: 'Test Plan',
    description: 'Comprehensive testing strategy and procedures',
    icon: TestTube,
    color: 'bg-cyan-500'
  }
]

export function DocumentCreator() {
  const [location, navigate] = useLocation()
  const searchParams = new URLSearchParams(location.split('?')[1] || '')
  const { toast } = useToast()
  const { createDocument, parseFile, isLoading } = useDocument()

  const [selectedType, setSelectedType] = useState<DocumentType | 'custom' | ''>('')
  const [customType, setCustomType] = useState('')
  const [title, setTitle] = useState('')
  const [prompt, setPrompt] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [referenceContext, setReferenceContext] = useState('')

  // Initialize with URL params if present
  React.useEffect(() => {
    const typeParam = searchParams.get('type') as DocumentType
    if (typeParam && predefinedTypes.find(dt => dt.type === typeParam)) {
      setSelectedType(typeParam)
    }
  }, [location])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md']
    },
    onDrop: (acceptedFiles) => {
      setUploadedFiles(prev => [...prev, ...acceptedFiles])
      
      // Read file contents for context
      acceptedFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = () => {
          const content = reader.result as string
          setReferenceContext(prev => 
            prev + (prev ? '\n\n---\n\n' : '') + 
            `File: ${file.name}\n\n${content.substring(0, 2000)}${content.length > 2000 ? '...' : ''}`
          )
        }
        reader.readAsText(file)
      })
    }
  })

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedType) {
      toast({
        title: "Missing Information",
        description: "Please select a document type",
        variant: "destructive"
      })
      return
    }

    if (!title.trim()) {
      toast({
        title: "Missing Information", 
        description: "Please enter a document title",
        variant: "destructive"
      })
      return
    }

    if (!prompt.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe what you want to create",
        variant: "destructive"
      })
      return
    }

    try {
      const documentType = selectedType === 'custom' ? (customType as DocumentType) : selectedType
      const fullPrompt = `Create a ${documentType} document with the following requirements:

${prompt}

${referenceContext ? `\n\nReference context from uploaded files:\n${referenceContext}` : ''}

Please create a comprehensive, well-structured document that follows best practices for ${documentType} documents.`

      const newDocument = await createDocument(documentType, fullPrompt)
      
      toast({
        title: "Document Created",
        description: "Your document has been created successfully"
      })
      
      navigate(`/app/documents/${newDocument.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "destructive"
      })
    }
  }

  const selectedTypeInfo = predefinedTypes.find(t => t.type === selectedType)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/app/documents')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documents
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Document</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Document Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Document Type
              </CardTitle>
              <CardDescription>
                Choose a predefined template or create a custom document type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {predefinedTypes.map((docType) => (
                  <div
                    key={docType.type}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedType === docType.type
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedType(docType.type)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 ${docType.color} rounded-lg flex items-center justify-center`}>
                        <docType.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{docType.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{docType.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Custom Type Option */}
                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedType === 'custom'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedType('custom')}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">Custom Document</h3>
                      <p className="text-sm text-gray-600 mt-1">Create your own document type</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedType === 'custom' && (
                <div className="mt-4">
                  <Input
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="Enter custom document type (e.g., Marketing Plan, User Guide, etc.)"
                    required
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Document Details
              </CardTitle>
              <CardDescription>
                Provide the basic information for your document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title for your document"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description & Requirements
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to create. Be as detailed as possible - include objectives, scope, requirements, target audience, etc."
                  className="min-h-[120px]"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Reference Documents Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Reference Documents (Optional)
              </CardTitle>
              <CardDescription>
                Upload previous documents or templates to provide context and guidance for AI generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-pink-400 bg-pink-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">
                  {isDragActive 
                    ? 'Drop files here...' 
                    : 'Drag & drop files here, or click to browse'
                  }
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOC, DOCX, TXT, MD files
                </p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              size="lg"
              disabled={isLoading}
              className="px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Document...
                </>
              ) : (
                <>
                  Create Document
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}