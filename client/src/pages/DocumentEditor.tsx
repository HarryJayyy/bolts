import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'wouter'
import { 
  Save, 
  Download, 
  Share2, 
  MessageSquare, 
  History, 
  Settings,
  Loader2,
  Send,
  Bot,
  User as UserIcon
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet'
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
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

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
      setHasUnsavedChanges(false)
      toast({
        title: "Success",
        description: "Document saved successfully"
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
      // Generate AI response
      await generateContent(currentDocument.id, userMessage)
      
      // Add AI response
      addChatMessage({
        role: 'assistant',
        content: `I've updated the document based on your request: "${userMessage}". The changes have been applied to the content.`
      })

      // Refresh document to get updated content
      await getDocument(currentDocument.id)
      
      toast({
        title: "Success",
        description: "Content updated with AI assistance"
      })
    } catch (error) {
      addChatMessage({
        role: 'assistant',
        content: "I apologize, but I encountered an error while processing your request. Please try again."
      })
      
      toast({
        title: "Error",
        description: "Failed to generate content",
        variant: "destructive"
      })
    }
  }

  if (!currentDocument) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary">
                  {currentDocument.type.toUpperCase()}
                </Badge>
                <Badge variant="secondary" className={
                  currentDocument.status === 'published' ? 'bg-green-100 text-green-800' :
                  currentDocument.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {currentDocument.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  Last updated {formatRelativeTime(currentDocument.updatedAt)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI Assistant
                </Button>
              </SheetTrigger>
              <SheetContent className="w-96">
                <SheetHeader>
                  <SheetTitle>AI Assistant</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full mt-6">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Bot className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>Ask me to help improve your document!</p>
                        <p className="text-sm mt-1">Try: "Expand the introduction section" or "Add more technical details"</p>
                      </div>
                    ) : (
                      chatMessages.map((message) => (
                        <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === 'user' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <div className="flex items-center space-x-2 mb-1">
                              {message.role === 'user' ? (
                                <UserIcon className="h-3 w-3" />
                              ) : (
                                <Bot className="h-3 w-3" />
                              )}
                              <span className="text-xs opacity-75">
                                {message.role === 'user' ? 'You' : 'AI Assistant'}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <Bot className="h-3 w-3" />
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span className="text-xs text-gray-600">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleChatSubmit} className="flex space-x-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask AI to improve your document..."
                      disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !chatInput.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                  {chatMessages.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearChat} className="mt-2">
                      Clear Chat
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            
            <Button variant="outline" size="sm">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!hasUnsavedChanges || isLoading}
              variant={hasUnsavedChanges ? "default" : "outline"}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {hasUnsavedChanges ? 'Save' : 'Saved'}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setHasUnsavedChanges(true)
                }}
                className="text-2xl font-bold border-none p-0 focus-visible:ring-0"
                placeholder="Document title..."
              />
            </CardHeader>
            <CardContent>
              <Textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value)
                  setHasUnsavedChanges(true)
                }}
                className="min-h-[600px] border-none p-0 focus-visible:ring-0 resize-none"
                placeholder="Start writing your document content here..."
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Version {currentDocument.version}</span>
            <span>•</span>
            <span>{content.split(' ').length} words</span>
            <span>•</span>
            <span>Last saved {formatRelativeTime(currentDocument.updatedAt)}</span>
          </div>
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (
              <span className="text-orange-600">Unsaved changes</span>
            )}
            <span>Editing as {user?.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}