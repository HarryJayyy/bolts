import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'wouter'
import { 
  Save, 
  Send,
  Bot,
  User as UserIcon,
  Loader2,
  Download,
  History,
  ChevronDown
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { useDocument } from '../contexts/DocumentContext'
import { useAuth } from '../contexts/AuthContext'
import { formatRelativeTime } from '../lib/utils'
import { useToast } from '../hooks/use-toast'

export function DocumentEditor() {
  const { id } = useParams<{ id: string }>()
  const [location, navigate] = useLocation()
  const { toast } = useToast()
  const { 
    currentDocument, 
    getDocument, 
    updateDocument, 
    generateContent, 
    chatMessages, 
    addChatMessage, 
    clearChat,
    isLoading 
  } = useDocument()
  const { user } = useAuth()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [versions, setVersions] = useState<any[]>([])
  const [showVersions, setShowVersions] = useState(false)

  useEffect(() => {
    if (id) {
      getDocument(id).catch(() => {
        toast({
          title: "Error",
          description: "Document not found",
          variant: "destructive"
        })
        navigate('/app/documents')
      })
    }
  }, [id])

  useEffect(() => {
    if (currentDocument) {
      setTitle(currentDocument.title)
      setContent(currentDocument.content)
      setHasUnsavedChanges(false)
    }
  }, [currentDocument])

  const handleSave = async () => {
    if (!currentDocument) return

    try {
      await updateDocument(currentDocument.id, { title, content })
      
      // Auto-create version on save
      const newVersion = {
        id: Date.now().toString(),
        version: versions.length + 1,
        title,
        content,
        timestamp: new Date().toISOString(),
        author: user?.name || 'Unknown'
      }
      setVersions(prev => [newVersion, ...prev])
      
      setHasUnsavedChanges(false)
      toast({
        title: "Document saved",
        description: `Saved and created version ${newVersion.version}`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save document",
        variant: "destructive"
      })
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || !currentDocument) return

    const userMessage = chatInput.trim()
    setChatInput('')

    // Add user message
    addChatMessage({
      role: 'user',
      content: userMessage
    })

    try {
      await generateContent(currentDocument.id, userMessage)
      
      // Auto-create version after AI generation
      const newVersion = {
        id: Date.now().toString(),
        version: versions.length + 1,
        title,
        content,
        timestamp: new Date().toISOString(),
        author: user?.name || 'Unknown',
        changes: `AI generated content from prompt: "${userMessage}"`
      }
      setVersions(prev => [newVersion, ...prev])
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content",
        variant: "destructive"
      })
    }
  }

  const handleContentChange = (value: string) => {
    setContent(value)
    setHasUnsavedChanges(true)
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    setHasUnsavedChanges(true)
  }

  const handleExport = (format: string) => {
    if (!currentDocument) return
    
    let exportContent = `# ${title}\n\n${content}`
    let mimeType = 'text/plain'
    let fileExtension = format
    
    if (format === 'pdf') {
      // For PDF, we'll use HTML content that can be printed to PDF
      exportContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 2cm; line-height: 1.6; }
            h1 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            h2 { color: #555; margin-top: 30px; }
            p { margin-bottom: 15px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div>${content.replace(/\n/g, '<br>')}</div>
        </body>
        </html>
      `
      mimeType = 'text/html'
      fileExtension = 'html'
    } else if (format === 'docx') {
      // For Word docs, we'll create a simple HTML that can be opened by Word
      exportContent = `
        <!DOCTYPE html>
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>90</w:Zoom>
              <w:DoNotPromptForConvert/>
              <w:DoNotShowMarkupDialog/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            body { font-family: 'Times New Roman', serif; margin: 1in; }
            h1 { font-size: 20pt; font-weight: bold; margin-bottom: 12pt; }
            p { font-size: 12pt; margin-bottom: 12pt; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div>${content.replace(/\n/g, '<br>')}</div>
        </body>
        </html>
      `
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      fileExtension = 'doc'
    } else if (format === 'gdoc') {
      // For Google Docs, we'll create a link that opens in Google Docs
      const googleDocsUrl = `https://docs.google.com/document/create?title=${encodeURIComponent(title)}&body=${encodeURIComponent(content)}`
      window.open(googleDocsUrl, '_blank')
      toast({
        title: "Opening in Google Docs",
        description: "Document opened in a new tab"
      })
      return
    }
    
    const blob = new Blob([exportContent], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || 'document'}.${fileExtension}`
    a.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: "Document exported",
      description: `Downloaded as ${format === 'docx' ? 'Word Document' : format.toUpperCase()}`
    })
  }



  const restoreVersion = (version: any) => {
    setTitle(version.title)
    setContent(version.content)
    setHasUnsavedChanges(true)
    setShowVersions(false)
    
    toast({
      title: "Version restored",
      description: `Restored to version ${version.version}`
    })
  }

  if (!currentDocument) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/app/documents')}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                Loveletter
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-medium text-gray-900">
                {title || 'Untitled Document'}
              </h1>
              {hasUnsavedChanges && (
                <span className="text-xs text-gray-500">• Unsaved changes</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Version History */}
            <DropdownMenu open={showVersions} onOpenChange={setShowVersions}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <History className="h-4 w-4 mr-2" />
                  Versions
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Version History</span>
                    <span className="text-xs text-gray-500">Auto-saved</span>
                  </div>
                  {versions.length === 0 ? (
                    <p className="text-sm text-gray-500 py-2">No versions yet. Versions are created automatically when you save or use AI.</p>
                  ) : (
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {versions.slice(0, 10).map((version) => (
                        <div
                          key={version.id}
                          className="p-2 rounded hover:bg-gray-50 cursor-pointer"
                          onClick={() => restoreVersion(version)}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium">v{version.version}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(version.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">
                            {version.title}
                          </p>
                          {version.changes && (
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {version.changes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('docx')}>
                  Export as Word Document
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('gdoc')}>
                  Open in Google Docs
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Save */}
            <Button 
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isLoading}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </header>

        {/* Editor Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Title Input */}
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Document title..."
              className="text-2xl font-bold border-none px-0 focus:ring-0 placeholder:text-gray-400"
            />
            
            {/* Content Editor */}
            <Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Start writing your document..."
              className="min-h-[600px] border-none px-0 resize-none focus:ring-0 text-base leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* AI Assistant Panel */}
      <div className="w-80 border-l border-gray-200 flex flex-col bg-gray-50">
        {/* AI Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">AI Assistant</h3>
              <p className="text-xs text-gray-500">Ask me anything about your document</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {chatMessages.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                I'm here to help you write and improve your document. Ask me anything!
              </p>
            </div>
          ) : (
            chatMessages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`flex items-start space-x-3 ${
                  message.role === 'user' ? 'justify-end' : ''
                }`}>
                  {message.role === 'assistant' && (
                    <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white rounded-lg px-3 py-2' 
                      : 'bg-white rounded-lg px-3 py-2 border border-gray-200'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserIcon className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="h-3 w-3 text-white" />
              </div>
              <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleChatSubmit} className="flex space-x-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask AI for help..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="sm"
              disabled={!chatInput.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}