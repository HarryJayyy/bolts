import React, { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { 
  FileText, 
  Zap, 
  Users, 
  Shield, 
  ArrowRight, 
  CheckCircle,
  Sparkles,
  Clock,
  Target,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../hooks/use-toast'

const features = [
  {
    icon: Zap,
    title: 'AI-Powered Generation',
    description: 'Create comprehensive documents in minutes with our advanced AI agents.',
    color: 'text-yellow-600'
  },
  {
    icon: FileText,
    title: 'Multiple Document Types',
    description: 'Support for PRD, BRD, Tech Specs, RFPs, SOPs, and more.',
    color: 'text-blue-600'
  },
  {
    icon: Users,
    title: 'Real-time Collaboration',
    description: 'Work together seamlessly with your team on document creation.',
    color: 'text-green-600'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security with end-to-end encryption and compliance.',
    color: 'text-red-600'
  }
]

const documentTypes = [
  { name: 'Product Requirements Document (PRD)', icon: Target },
  { name: 'Business Requirements Document (BRD)', icon: Layers },
  { name: 'Technical Specification', icon: FileText },
  { name: 'Request for Proposal (RFP)', icon: FileText },
  { name: 'Standard Operating Procedure (SOP)', icon: FileText },
  { name: 'Test Plan & Deployment Guide', icon: FileText }
]

const benefits = [
  'Save 80% of document creation time',
  'Ensure consistency across all documents',
  'Reduce errors with AI-powered validation',
  'Streamline approval workflows',
  'Maintain version control automatically',
  'Export to multiple formats (PDF, DOCX, etc.)'
]

function AuthDialog({ isSignUp, onClose }: { isSignUp: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, signup, isLoading, error } = useAuth()
  const { toast } = useToast()
  const [, navigate] = useLocation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isSignUp) {
        await signup(name, email, password)
      } else {
        await login(email, password)
      }
      
      toast({
        title: "Success",
        description: `${isSignUp ? 'Account created' : 'Signed in'} successfully!`
      })
      
      onClose()
      navigate('/app')
    } catch (error) {
      // Error is handled by the auth context
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignUp && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      {!isSignUp && (
        <div className="text-sm text-gray-600">
          Demo credentials: <strong>demo@loveletter.com</strong> / <strong>demo</strong>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
        variant="gradient"
      >
        {isLoading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
      </Button>
    </form>
  )
}

export function Landing() {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const openSignIn = () => {
    setIsSignUp(false)
    setShowAuthDialog(true)
  }

  const openSignUp = () => {
    setIsSignUp(true)
    setShowAuthDialog(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                Loveletter
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={openSignIn}>
                Sign In
              </Button>
              <Button variant="gradient" onClick={openSignUp}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-yellow-50">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-pink-100 to-yellow-100 text-pink-700 border-pink-200">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Document Generation
            </Badge>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Create Professional{' '}
              <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                Documents
              </span>{' '}
              in Minutes
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your document creation process with AI-powered generation. 
              From PRDs to technical specifications, create comprehensive, professional 
              documents that save time and ensure consistency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                variant="gradient" 
                className="text-lg px-8 py-3"
                onClick={openSignUp}
              >
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, manage, and collaborate on professional documents.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className={`w-12 h-12 mx-auto rounded-lg bg-gray-50 flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Document Types Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Support for All Document Types
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Generate any type of business or technical document with AI assistance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentTypes.map((type, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-100 to-yellow-100 rounded-lg flex items-center justify-center">
                  <type.icon className="h-5 w-5 text-pink-600" />
                </div>
                <span className="font-medium text-gray-900">{type.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Why Teams Choose Loveletter
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of teams who have transformed their document creation process 
                and saved countless hours with our AI-powered platform.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">80%</div>
                    <div className="text-sm opacity-90">Time Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">10k+</div>
                    <div className="text-sm opacity-90">Documents Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">500+</div>
                    <div className="text-sm opacity-90">Teams</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">99.9%</div>
                    <div className="text-sm opacity-90">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Transform Your Document Creation?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of teams already using Loveletter to create better documents faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
                <Link to="/app">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-pink-600">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="text-xl font-bold">Loveletter</span>
              </div>
              <p className="text-gray-400">
                AI-powered document generation for modern teams.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Loveletter. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </DialogTitle>
            <DialogDescription>
              {isSignUp 
                ? 'Sign up to start creating amazing documents with AI assistance.'
                : 'Sign in to access your document workspace.'
              }
            </DialogDescription>
          </DialogHeader>
          <AuthDialog 
            isSignUp={isSignUp} 
            onClose={() => setShowAuthDialog(false)} 
          />
          <div className="text-center text-sm text-gray-500 mt-4">
            {isSignUp ? (
              <span>
                Already have an account?{' '}
                <button 
                  onClick={() => setIsSignUp(false)} 
                  className="text-pink-600 hover:underline"
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button 
                  onClick={() => setIsSignUp(true)} 
                  className="text-pink-600 hover:underline"
                >
                  Sign up
                </button>
              </span>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}