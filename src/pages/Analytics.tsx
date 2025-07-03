import React from 'react'
import { 
  TrendingUp, 
  FileText, 
  Zap, 
  Clock, 
  Users, 
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { useDocument } from '../contexts/DocumentContext'
import { useAuth } from '../contexts/AuthContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line } from 'recharts'

const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']

export function Analytics() {
  const { documents, usageStats } = useDocument()
  const { user } = useAuth()

  // Mock data for charts
  const documentsByType = [
    { name: 'PRD', value: 3, color: '#ff6b6b' },
    { name: 'BRD', value: 2, color: '#4ecdc4' },
    { name: 'Tech Spec', value: 1, color: '#45b7d1' },
    { name: 'RFP', value: 0, color: '#96ceb4' },
  ]

  const monthlyActivity = [
    { month: 'Jan', documents: 2, generations: 8 },
    { month: 'Feb', documents: 4, generations: 15 },
    { month: 'Mar', documents: 3, generations: 12 },
    { month: 'Apr', documents: 5, generations: 20 },
    { month: 'May', documents: 6, generations: 25 },
    { month: 'Jun', documents: 4, generations: 18 },
  ]

  const weeklyProgress = [
    { day: 'Mon', words: 1200 },
    { day: 'Tue', words: 800 },
    { day: 'Wed', words: 1500 },
    { day: 'Thu', words: 2000 },
    { day: 'Fri', words: 1800 },
    { day: 'Sat', words: 600 },
    { day: 'Sun', words: 400 },
  ]

  const stats = [
    {
      title: 'Total Documents',
      value: documents.length,
      change: '+12%',
      changeType: 'positive' as const,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'AI Generations',
      value: usageStats.aiGenerations,
      change: '+23%',
      changeType: 'positive' as const,
      icon: Zap,
      color: 'text-yellow-600'
    },
    {
      title: 'Words Generated',
      value: usageStats.wordsGenerated.toLocaleString(),
      change: '+18%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Hours Saved',
      value: usageStats.timesSaved,
      change: '+15%',
      changeType: 'positive' as const,
      icon: Clock,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Track your productivity and document creation insights.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Document Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Documents by Type
            </CardTitle>
            <CardDescription>
              Distribution of your document types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <RechartsPieChart data={documentsByType}>
                    {documentsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {documentsByType.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {item.value}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Monthly Activity
            </CardTitle>
            <CardDescription>
              Documents created and AI generations over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="documents" fill="#ff6b6b" name="Documents" />
                  <Bar dataKey="generations" fill="#4ecdc4" name="AI Generations" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Weekly Writing Progress
          </CardTitle>
          <CardDescription>
            Words generated per day this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="words" 
                  stroke="#ff6b6b" 
                  strokeWidth={3}
                  dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Usage Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Most Productive Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">Thursday</div>
            <p className="text-sm text-gray-600">
              You generate 40% more content on Thursdays
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Average words/day</span>
                <span>2,000</span>
              </div>
              <Progress value={80} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Favorite Document Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">PRD</div>
            <p className="text-sm text-gray-600">
              50% of your documents are Product Requirements
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>PRD Documents</span>
                <span>3 of 6</span>
              </div>
              <Progress value={50} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">85%</div>
            <p className="text-sm text-gray-600">
              Time saved compared to manual writing
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Hours saved</span>
                <span>{usageStats.timesSaved}</span>
              </div>
              <Progress value={85} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals & Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Goals & Achievements
          </CardTitle>
          <CardDescription>
            Track your progress towards monthly goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-yellow-50 rounded-lg border border-pink-200">
              <div className="text-2xl font-bold text-pink-700 mb-2">6/10</div>
              <p className="text-sm text-pink-600 mb-2">Documents Created</p>
              <Progress value={60} className="mb-2" />
              <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                60% Complete
              </Badge>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700 mb-2">48/50</div>
              <p className="text-sm text-blue-600 mb-2">AI Generations</p>
              <Progress value={96} className="mb-2" />
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                96% Complete
              </Badge>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700 mb-2">15.4k/20k</div>
              <p className="text-sm text-green-600 mb-2">Words Generated</p>
              <Progress value={77} className="mb-2" />
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                77% Complete
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}