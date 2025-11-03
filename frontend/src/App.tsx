import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import { LanguageProvider } from './contexts/LanguageContext';
import StudentDashboard from './pages/StudentDashboard';
import CounselorDashboard from './pages/CounselorDashboard';
import PeerSupportDashboard from './pages/PeerSupportDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ChatBot from './pages/ChatBot';
import Appointments from './pages/Appointments';
import Resources from './pages/Resources';
import Community from './pages/Community';
import MentalHealthScreeningPage from './pages/MentalHealthScreening';
import ProfileSettings from './pages/ProfileSettings';
import ErrorBoundary from './components/ErrorBoundary';
import { PageLoader, ThemeToggle, OfflineIndicator } from './components/ui';
import { User, LoginForm, UserRole, MoodCheckIn } from './types';
import Navigation from './components/ui/Navigation';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider, useToast } from './contexts/NotificationContext';
import { register as registerSW, initializeInstallPrompt } from './utils/serviceWorker';

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const toast = useToast();

  // Initialize PWA features
  useEffect(() => {
    // Register service worker
    registerSW({
      onSuccess: () => {
        toast.success('App ready for offline use!');
      },
      onUpdate: () => {
        toast.info('New version available', 'Please refresh the page to update');
      },
      onOffline: () => {
        toast.warning('You are now offline', 'Some features may be limited');
      },
      onOnline: () => {
        toast.success('Connection restored!');
      }
    });

    // Initialize install prompt
    initializeInstallPrompt();
  }, [toast]);

  // Mock registration function
  const handleRegister = async (registrationData: any) => {
    setIsLoading(true);
    setRegistrationError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Registration data:', registrationData);
      // In a real app, this would send data to backend
      
    } catch (error) {
      setRegistrationError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock authentication function
  const handleLogin = async (credentials: LoginForm & { role: UserRole }) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock user data based on role
      const mockUser: User = {
        id: 1,
        username: credentials.role === 'student' ? 'student123' : 
                 credentials.role === 'counselor' ? 'counselor1' : 'admin1',
        email: credentials.email,
        role: credentials.role,
        institutionId: 'UNIV123',
        isActive: true,
        isVerified: true,
        languagePreference: 'en',
        createdAt: new Date().toISOString(),
        profile: credentials.role === 'student' ? {
          fullName: 'Kabir Kumar',
          yearOfStudy: 3,
          department: 'Computer Science',
          preferences: {
            language: 'en',
            notifications: true,
            anonymousMode: false
          }
        } : credentials.role === 'counselor' ? {
          fullName: 'Dr. Aasha Akhtar',
          licenseNumber: 'PSY123456',
          specialization: ['Anxiety', 'Depression'],
          experienceYears: 8,
          qualifications: ['PhD Psychology', 'Licensed Clinical Psychologist'],
          languages: ['English', 'Hindi'],
          isAvailable: true,
          rating: 4.8,
          totalSessions: 245
        } : {
          fullName: 'Admin User',
          institution: 'University Mental Health Center'
        }
      };

      setCurrentUser(mockUser);
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };


  const handleMoodSubmit = (mood: MoodCheckIn) => {
    console.log('Mood submitted:', mood);
    // In a real app, this would save to the backend
    alert(`Mood check-in submitted! You're feeling: ${mood.mood}/5`);
  };

  // Protected Route Component
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
  };

  // Community Layout Component
  const CommunityLayout = () => {
    if (!currentUser) return <Navigate to="/login" replace />;
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          userRole={currentUser.role}
          userName={currentUser.profile?.fullName || currentUser.username}
          onLogout={handleLogout}
        />
        <Community />
      </div>
    );
  };

  // Role-based Dashboard Component
  const DashboardRoute = () => {
    if (!currentUser) return <Navigate to="/login" replace />;
    
    switch (currentUser.role) {
      case 'student':
        return (
          <StudentDashboard 
            user={currentUser}
            onLogout={handleLogout}
            onMoodSubmit={handleMoodSubmit}
          />
        );
      
      case 'counselor':
        return (
          <CounselorDashboard 
            user={currentUser}
            onLogout={handleLogout}
          />
        );
      
      case 'peer_volunteer':
        return (
          <PeerSupportDashboard 
            user={currentUser}
            onLogout={handleLogout}
          />
        );
      
      case 'admin':
        return (
          <AdminDashboard 
            user={currentUser}
            onLogout={handleLogout}
          />
        );
      
      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome, {currentUser.profile?.fullName}!
              </h1>
              <p className="text-gray-600 mb-6">
                Dashboard for role '{currentUser.role}' is not available.
              </p>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-neon-blue-500 text-white rounded-lg hover:bg-neon-blue-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        );
    }
  };

  // Show loading screen during authentication
  if (isLoading && !currentUser) {
    return <PageLoader text="Signing you in..." />;
  }

  return (
    <LanguageProvider>
      <ErrorBoundary>
        <Router>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              currentUser ? 
                <Navigate to="/dashboard" replace /> : 
                <LoginPage 
                  onLogin={handleLogin}
                  onRegister={handleRegister}
                  isLoading={isLoading}
                  error={loginError}
                  registrationError={registrationError}
                />
            } 
          />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardRoute />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatBot 
                user={currentUser || undefined}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/appointments" 
          element={
            <ProtectedRoute>
              <Appointments 
                user={currentUser || undefined}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/resources" 
          element={
            <ProtectedRoute>
              <Resources 
                user={currentUser || undefined}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/forum" 
          element={
            <ProtectedRoute>
              <CommunityLayout />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/screening" 
          element={
            <ProtectedRoute>
              <MentalHealthScreeningPage 
                user={currentUser || undefined}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile-settings" 
          element={
            <ProtectedRoute>
              <ProfileSettings 
                user={currentUser || undefined}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/privacy-settings" 
          element={
            <ProtectedRoute>
              <ProfileSettings 
                user={currentUser || undefined}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
        </Routes>
        </Router>
      </ErrorBoundary>
    </LanguageProvider>
  );
}

// Main App with providers
function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppContent />
        <OfflineIndicator />
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
