import React, { useState } from 'react';
import LoginPage from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import { User, LoginForm, UserRole, MoodCheckIn } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

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
          hourlyRate: 1500,
          rating: 4.8,
          totalSessions: 245
        } : {
          fullName: 'Admin User',
          institution: 'University Mental Health Center'
        }
      };

      setCurrentUser(mockUser);
      setCurrentPage('dashboard');
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleNavigate = (path: string) => {
    // For demo purposes, we'll just log the navigation
    console.log(`Navigating to: ${path}`);
    // In a real app, you'd use React Router here
  };

  const handleMoodSubmit = (mood: MoodCheckIn) => {
    console.log('Mood submitted:', mood);
    // In a real app, this would save to the backend
    alert(`Mood check-in submitted! You're feeling: ${mood.mood}/5`);
  };

  if (currentPage === 'login' || !currentUser) {
    return (
      <LoginPage 
        onLogin={handleLogin}
        isLoading={isLoading}
        error={loginError}
      />
    );
  }

  if (currentPage === 'dashboard' && currentUser.role === 'student') {
    return (
      <StudentDashboard 
        user={currentUser}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onMoodSubmit={handleMoodSubmit}
      />
    );
  }

  // Fallback for other roles (counselor, admin) - you can implement these later
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome, {currentUser.profile?.fullName}!
        </h1>
        <p className="text-gray-600 mb-6">
          {currentUser.role === 'counselor' ? 'Counselor' : 'Admin'} dashboard coming soon...
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

export default App;
