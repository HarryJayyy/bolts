import { Route, Switch, Redirect, useLocation } from 'wouter'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DocumentProvider } from './contexts/DocumentContext'
import { Toaster } from './components/ui/toaster'
import { AppLayout } from './components/layout/AppLayout'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { DocumentList } from './pages/DocumentList'
import { DocumentEditor } from './pages/DocumentEditor'
import { DocumentCreator } from './pages/DocumentCreator'
import { Settings } from './pages/Settings'
import { Analytics } from './pages/Analytics'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return <Redirect to="/" />
  }
  
  return <>{children}</>
}

function AppContent() {
  const [location] = useLocation()
  
  // Handle nested app routes
  if (location.startsWith('/app')) {
    return (
      <ProtectedRoute>
        <DocumentProvider>
          <AppLayout>
            <Switch>
              <Route path="/app" component={Dashboard} />
              <Route path="/app/documents" component={DocumentList} />
              <Route path="/app/documents/new" component={DocumentCreator} />
              <Route path="/app/documents/:id" component={DocumentEditor} />
              <Route path="/app/documents/:id/edit" component={DocumentEditor} />
              <Route path="/app/analytics" component={Analytics} />
              <Route path="/app/settings" component={Settings} />
            </Switch>
          </AppLayout>
        </DocumentProvider>
      </ProtectedRoute>
    )
  }
  
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AppContent />
        <Toaster />
      </div>
    </AuthProvider>
  )
}

export default App