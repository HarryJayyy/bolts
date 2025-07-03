import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
  Rocket
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

const documentTypes = [
  {
    type: 'prd' as DocumentType,
    title: 'Product Requirements Document',
    description: 'Define product features, user stories, and specifications',
    icon: Target,
    color: 'bg-blue-500',
    examples: ['Mobile app features', 'Web platform requirements', 'API specifications']
  },
  {
    type: 'brd' as DocumentType,
    title: 'Business Requirements Document',
    description: 'Outline business needs, objectives, and success criteria',
    icon: Users,
    color: 'bg-green-500',
    examples: ['Process improvements', 'Business objectives', 'Stakeholder requirements']
  },
  {
    type: 'tech-spec' as DocumentType,
    title: 'Technical Specification',
    description: 'Detail technical architecture and implementation',
    icon: Code,
    color: 'bg-purple-500',
    examples: ['System architecture', 'API design', 'Database schema']
  },
  {
    type: 'rfp' as DocumentType,
    title: 'Request for Proposal',
    description: 'Create comprehensive RFPs for vendor selection',
    icon: FileCheck,
    color: 'bg-orange-500',
    examples: ['Software procurement', 'Service contracts', 'Vendor evaluation']
  },
  {
    type: 'sop' as DocumentType,
    title: 'Standard Operating Procedure',
    description: 'Document step-by-step operational processes',
    icon: Settings,
    color: 'bg-pink-500',
    examples: ['Deployment procedures', 'Quality assurance', 'Incident response']
  },
  {
    type: 'test-plan' as DocumentType,
    title: 'Test Plan',
    description: 'Comprehensive testing strategy and procedures',
    icon: TestTube,
    color: 'bg-cyan-500',
    examples: ['QA testing', 'User acceptance testing', 'Performance testing']
  }
]

export function DocumentCreator() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const { createDocument, parseFile, isLoading } = useDocument()

  const [selectedType, setSelectedType] = useState<DocumentType | ''>('')
  const [title, setTitle] = useState('')
  const [prompt, setPrompt] = useState('')
  const [creationMethod, setCreationMethod] = useState<'generate' | 'upload' | 'template'>('generate')

  // Initialize with URL params if present
  React.useEffect(() => {
    const typeParam = searchParams.get('type') as DocumentType
    if (typeParam && documentTypes.find(dt => dt.type === typeParam)) {
      setSelectedType(typeParam)
    }
  }, [searchParams])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: (files) => {
      if (files.length > 0) {
        setCreationMethod('upload')
      }
    }
  })

  const handleGenerate = async () => {
    if (!selectedType || !prompt.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a document type and provide a prompt.",
        variant: "destructive"
      })
      return
    }

    try {
      const document = await createDocument(selectedType, prompt)
      toast({
        title: "Success",
        description: "Document created successfully!"
      })
      navigate(`/app/documents/${document.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create document. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleUpload = async () => {
    if (acceptedFiles.length === 0) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive"
      })
      return
    }

    try {
      const document = await parseFile(acceptedFiles[0])
      toast({
        title: "Success",
        description: "File uploaded and parsed successfully!"
      })
      navigate(`/app/documents/${document.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse file. Please try again.",
        variant: "destructive"
      })
    }
  }

  const selectedDocType = documentTypes.find(dt => dt.type === selectedType)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Document</h1>
        <p className="text-gray-600">
          Choose how you'd like to create your document with AI assistance
        </p>
      </div>

      {/* Creation Method Tabs */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setCreationMethod('generate')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              creationMethod === 'generate'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Zap className="h-4 w-4 inline mr-2" />
            Generate with AI
          </button>
          <button
            onClick={() => setCreationMethod('upload')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              creationMethod === 'upload'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Upload className="h-4 w-4 inline mr-2" />
            Upload & Parse
          </button>
        </div>
      </div>

      {creationMethod === 'generate' && (
        <div className="space-y-6">
          {/* Document Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Document Type</CardTitle>
              <CardDescription>
                Choose the type of document you want to create
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTypes.map((docType) => (
                  <div
                    key={docType.type}
                    onClick={() => setSelectedType(docType.type)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedType === docType.type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg ${docType.color} flex items-center justify-center`}>
                        <docType.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{docType.title}</h3>
                        <p className="text-sm text-gray-600">{docType.description}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {docType.examples.map((example, index) => (
                        <Badge key={index} variant="secondary" className="text-xs mr-1">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document Details */}
          {selectedType && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {selectedDocType && <selectedDocType.icon className="h-5 w-5 mr-2" />}
                  {selectedDocType?.title} Details
                </CardTitle>
                <CardDescription>
                  Provide details to help AI generate your document
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Title (Optional)
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={`e.g., ${selectedDocType?.examples[0]} ${selectedDocType?.title}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe what you want to create *
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={`Describe your ${selectedDocType?.title.toLowerCase()} requirements. Be as specific as possible - include features, scope, constraints, and any special requirements.`}
                    className="min-h-[120px]"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    💡 Tip: The more detailed your description, the better the AI-generated content will be.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generate Button */}
          {selectedType && prompt && (
            <div className="flex justify-center">
              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                size="lg"
                variant="gradient"
                className="px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating Document...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Generate Document
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {creationMethod === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload & Parse Document</CardTitle>
            <CardDescription>
              Upload an existing document (PDF or DOCX) to extract and improve its content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-blue-600">Drop the file here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Drag & drop a document here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF and DOCX files up to 10MB
                  </p>
                </div>
              )}
            </div>

            {acceptedFiles.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">{acceptedFiles[0].name}</p>
                      <p className="text-sm text-green-600">
                        {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={isLoading}
                    variant="outline"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Parsing...
                      </>
                    ) : (
                      <>
                        Parse Document
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}