import React, { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { 
  FileEdit,
  Clock,
  Star,
  Settings,
  BarChart3,
  User,
  CreditCard,
  Shield,
  LogOut,
  Plus,
  PanelLeftClose
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { useAuth } from '../../contexts/AuthContext'
import { useDocument } from '../../contexts/DocumentContext'

export function Sidebar() {
  const [location] = useLocation()
  const { user, logout } = useAuth()
  const { documents, usageStats } = useDocument()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [analyticsOpen, setAnalyticsOpen] = useState(false)

  const recentDocuments = documents.slice(0, 8)

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
              Loveletter
            </span>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/app/dashboard">
          <Button variant="outline" className="w-full justify-start">
            <Plus className="h-4 w-4 mr-3" />
            New Chat
          </Button>
        </Link>
      </div>

      {/* Recent Documents */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {recentDocuments.map((doc) => (
            <Link key={doc.id} href={`/app/documents/${doc.id}`}>
              <div className={`flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer group ${
                location.includes(doc.id) ? 'bg-gray-100' : ''
              }`}>
                <FileEdit className="h-4 w-4 mr-3 text-gray-400 group-hover:text-gray-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.title}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          
          {recentDocuments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileEdit className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No recent documents</p>
            </div>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {user?.plan}
                  </Badge>
                  {user?.plan === 'pro' && (
                    <Star className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" side="right">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Settings Dialog */}
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </h4>
                    <div className="pl-6 space-y-1">
                      <p className="text-sm text-gray-600">Name: {user?.name}</p>
                      <p className="text-sm text-gray-600">Email: {user?.email}</p>
                      <Button variant="outline" size="sm">Edit Profile</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Plan & Billing
                    </h4>
                    <div className="pl-6 space-y-1">
                      <p className="text-sm text-gray-600">Current Plan: {user?.plan}</p>
                      <Button variant="outline" size="sm">Manage Billing</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Data & Privacy
                    </h4>
                    <div className="pl-6 space-y-1">
                      <p className="text-sm text-gray-600">Export your data</p>
                      <Button variant="outline" size="sm">Privacy Settings</Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Analytics Dialog */}
            <Dialog open={analyticsOpen} onOpenChange={setAnalyticsOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Analytics Overview</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Documents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{usageStats.documentsCreated}</div>
                        <p className="text-xs text-gray-500">Total created</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">AI Generations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{usageStats.aiGenerations}</div>
                        <p className="text-xs text-gray-500">This month</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Words Generated</span>
                      <span>{usageStats.wordsGenerated.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Time Saved</span>
                      <span>{usageStats.timesSaved}h</span>
                    </div>
                  </div>
                  
                  {user?.plan === 'pro' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Usage</span>
                        <span>{usageStats.aiGenerations}/100</span>
                      </div>
                      <Progress value={(usageStats.aiGenerations / 100) * 100} />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}