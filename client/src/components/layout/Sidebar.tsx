import React from 'react'
import { Link, useLocation } from 'wouter'
import { 
  Home, 
  FileText, 
  Plus, 
  Settings, 
  BarChart3, 
  Clock,
  Star,
  Folder
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { useDocument } from '../../contexts/DocumentContext'
import { useAuth } from '../../contexts/AuthContext'

const navigation = [
  { name: 'Dashboard', href: '/app', icon: Home },
  { name: 'Documents', href: '/app/documents', icon: FileText },
  { name: 'Analytics', href: '/app/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/app/settings', icon: Settings },
]

const documentTypes = [
  { name: 'PRD', count: 3, color: 'bg-blue-500' },
  { name: 'BRD', count: 2, color: 'bg-green-500' },
  { name: 'Tech Spec', count: 1, color: 'bg-purple-500' },
  { name: 'RFP', count: 0, color: 'bg-orange-500' },
]

export function Sidebar() {
  const [location] = useLocation()
  const { documents, usageStats } = useDocument()
  const { user } = useAuth()

  const recentDocuments = documents.slice(0, 3)

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
            Loveletter
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-200">
        <Button 
          variant="gradient" 
          className="w-full justify-start"
          asChild
        >
          <Link to="/app/documents/new">
            <Plus className="mr-2 h-4 w-4" />
            New Document
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gradient-to-r from-pink-50 to-yellow-50 text-pink-700 border border-pink-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Recent Documents */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Recent</h3>
          <Clock className="h-4 w-4 text-gray-400" />
        </div>
        <div className="space-y-2">
          {recentDocuments.map((doc) => (
            <Link
              key={doc.id}
              to={`/app/documents/${doc.id}`}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <Folder className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {doc.title}
                </p>
                <p className="text-xs text-gray-500">
                  {doc.type.toUpperCase()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Document Types */}
      <div className="px-4 py-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Document Types</h3>
        <div className="space-y-2">
          {documentTypes.map((type) => (
            <div key={type.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={cn("w-2 h-2 rounded-full", type.color)} />
                <span className="text-sm text-gray-600">{type.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {type.count}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Stats */}
      {user?.plan === 'pro' && (
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-pink-50 to-yellow-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">AI Usage</span>
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <Progress value={75} className="mb-2" />
            <p className="text-xs text-gray-600">
              {usageStats.aiGenerations}/100 generations used
            </p>
          </div>
        </div>
      )}
    </div>
  )
}