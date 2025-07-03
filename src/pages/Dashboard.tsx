import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  FileText, 
  Clock, 
  TrendingUp, 
  Users, 
  Zap,
  ArrowRight,
  MoreHorizontal,
  Star,
  Calendar
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { useDocument } from '../contexts/DocumentContext'
import { useAuth } from '../contexts/AuthContext'
import { formatRelativeTime } from '../lib/utils'

export function Dashboard() {
  const { documents, usageStats } = useDocument()
  const { user } = useAuth()

  const recentDocuments = documents.slice(0, 5)
  const stats = [
    {
      title: 'Total Documents',
      value: documents.length,
      icon: FileText,
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'AI Generations',
      value: usageStats.aiGenerations,
      icon: Zap,
      change: '+23%',
      changeType: 'positive' as const
    },
    {
      title: 'Words Generated',
      value: usageStats.wordsGenerated.toLocaleString(),
      icon: TrendingUp,
      change: '+18%',
      changeType: 'positive' as const
    },
    {
      title: 'Hours Saved',
      value: usageStats.timesSaved,
      icon: Clock,
      change: '+15%',
      changeType: 'positive' as const
    }
  ]

  const quickActions = [
    {
      title: 'Product Requirements Document',
      description: 'Define product features and specifications',
      icon: FileText,
      color: 'bg-blue-500',
      href: '/app/documents/new?type=prd'
    },
    {
      title: 'Business Requirements Document',
      description: 'Outline business needs and objectives',
      icon: Users,
      color: 'bg-green-500',
      href: '/app/documents/new?type=brd'
    },
    {
      title: 'Technical Specification',
      description: 'Detail technical implementation',
      icon: Zap,
      color: 'bg-purple-500',
      href: '/app/documents/new?type=tech-spec'
    }
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your documents today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" asChild>
            <Link to="/app/documents">
              View All Documents
            </Link>
          </Button>
          <Button variant="gradient" asChild>
            <Link to="/app/documents/new">
              <Plus className="h-4 w-4 mr-2" />
              New Document
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>{stat.change} from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Start creating documents with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
                >
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mr-4`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-gray-700">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Usage Overview */}
        <div className="space-y-6">
          {/* Plan Usage */}
          {user?.plan === 'pro' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Plan Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>AI Generations</span>
                    <span>{usageStats.aiGenerations}/100</span>
                  </div>
                  <Progress value={(usageStats.aiGenerations / 100) * 100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Documents</span>
                    <span>{documents.length}/50</span>
                  </div>
                  <Progress value={(documents.length / 50) * 100} />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/app/documents/${doc.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-gray-700 truncate block"
                    >
                      {doc.title}
                    </Link>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Badge variant="secondary" className="text-xs">
                        {doc.type.toUpperCase()}
                      </Badge>
                      <span>•</span>
                      <span>{formatRelativeTime(doc.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link to="/app/documents">
                  View All Documents
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tips & Getting Started */}
      <Card className="bg-gradient-to-r from-pink-50 to-yellow-50 border-pink-200">
        <CardHeader>
          <CardTitle className="text-pink-800">💡 Pro Tips</CardTitle>
          <CardDescription className="text-pink-700">
            Get the most out of Loveletter with these helpful tips
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-pink-700">1</span>
            </div>
            <div>
              <p className="text-sm text-pink-800 font-medium">Be specific with your prompts</p>
              <p className="text-xs text-pink-600">The more detailed your initial prompt, the better the AI-generated content will be.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-pink-700">2</span>
            </div>
            <div>
              <p className="text-sm text-pink-800 font-medium">Use the chat feature for refinements</p>
              <p className="text-xs text-pink-600">After generating initial content, use the chat to make specific improvements and additions.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-pink-700">3</span>
            </div>
            <div>
              <p className="text-sm text-pink-800 font-medium">Save templates for recurring documents</p>
              <p className="text-xs text-pink-600">Create templates from your best documents to speed up future creation.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}