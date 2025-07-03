import React, { useState } from 'react'
import { Link } from 'wouter'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  FileText, 
  Edit, 
  Trash2, 
  Download,
  Eye,
  Clock,
  User
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../components/ui/dropdown-menu'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select'
import { useDocument } from '../contexts/DocumentContext'
import { formatRelativeTime } from '../lib/utils'
import { DocumentStatus, DocumentType } from '../types'

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  review: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-red-100 text-red-800'
}

const typeColors = {
  prd: 'bg-blue-100 text-blue-800',
  brd: 'bg-green-100 text-green-800',
  frd: 'bg-purple-100 text-purple-800',
  'tech-spec': 'bg-indigo-100 text-indigo-800',
  rfp: 'bg-orange-100 text-orange-800',
  sop: 'bg-pink-100 text-pink-800',
  'test-plan': 'bg-cyan-100 text-cyan-800',
  'deployment-guide': 'bg-emerald-100 text-emerald-800'
}

export function DocumentList() {
  const { documents, deleteDocument } = useDocument()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all')

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
    const matchesType = typeFilter === 'all' || doc.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(id)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">
            Manage and organize all your documents in one place.
          </p>
        </div>
        <Button variant="gradient" asChild>
          <Link to="/app/documents/new">
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as DocumentStatus | 'all')}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as DocumentType | 'all')}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="prd">PRD</SelectItem>
                <SelectItem value="brd">BRD</SelectItem>
                <SelectItem value="frd">FRD</SelectItem>
                <SelectItem value="tech-spec">Tech Spec</SelectItem>
                <SelectItem value="rfp">RFP</SelectItem>
                <SelectItem value="sop">SOP</SelectItem>
                <SelectItem value="test-plan">Test Plan</SelectItem>
                <SelectItem value="deployment-guide">Deployment Guide</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'Try adjusting your filters or search query.'
                : 'Get started by creating your first document.'
              }
            </p>
            <Button variant="gradient" asChild>
              <Link to="/app/documents/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Document
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate group-hover:text-gray-700">
                      <Link to={`/app/documents/${document.id}`}>
                        {document.title}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge 
                        variant="secondary" 
                        className={typeColors[document.type]}
                      >
                        {document.type.toUpperCase()}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={statusColors[document.status]}
                      >
                        {document.status}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/app/documents/${document.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/app/documents/${document.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDelete(document.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 mb-4">
                  {document.content.substring(0, 150)}...
                </CardDescription>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{document.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatRelativeTime(document.updatedAt)}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Version {document.version}
                    </span>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/app/documents/${document.id}`}>
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/app/documents/${document.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}