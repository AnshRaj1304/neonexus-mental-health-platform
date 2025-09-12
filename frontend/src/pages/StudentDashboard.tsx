import React, { useState } from 'react';
import { Heart, MessageCircle, Calendar, BookOpen, Users, Clock, Bell, Award } from 'lucide-react';
import { Navigation, Card, Button, MoodSelector } from '../components/ui';
import { User, MoodCheckIn } from '../types';

interface StudentDashboardProps {
  user?: User;
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
  onMoodSubmit?: (mood: MoodCheckIn) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  onNavigate,
  onLogout,
  onMoodSubmit,
}) => {
  const [currentMood, setCurrentMood] = useState<number>(0);
  const [moodNotes, setMoodNotes] = useState<string>('');
  const [showMoodForm, setShowMoodForm] = useState(false);

  // Mock data for demonstration
  const quickStats = {
    sessionsCompleted: 3,
    resourcesViewed: 12,
    forumPosts: 5,
    streakDays: 7,
  };

  const recentActivity = [
    {
      type: 'mood',
      message: 'Completed daily mood check-in',
      time: '2 hours ago',
      icon: Heart,
      color: 'text-neon-blue-500'
    },
    {
      type: 'resource',
      message: 'Watched "Managing Exam Stress"',
      time: '1 day ago',
      icon: BookOpen,
      color: 'text-neon-lavender-500'
    },
    {
      type: 'appointment',
      message: 'Session with Dr. Priya Sharma',
      time: '3 days ago',
      icon: Calendar,
      color: 'text-neon-mint-500'
    },
  ];

  const quickActions = [
    {
      title: 'Chat Support',
      description: 'Talk to our AI assistant',
      icon: MessageCircle,
      color: 'from-neon-lavender-500 to-neon-lavender-600',
      path: '/chat',
      urgent: false,
    },
    {
      title: 'Book Session',
      description: 'Schedule with a counselor',
      icon: Calendar,
      color: 'from-neon-mint-500 to-neon-mint-600',
      path: '/appointments',
      urgent: false,
    },
    {
      title: 'Browse Resources',
      description: 'Educational content library',
      icon: BookOpen,
      color: 'from-neon-blue-500 to-neon-blue-600',
      path: '/resources',
      urgent: false,
    },
    {
      title: 'Join Community',
      description: 'Connect with peer support',
      icon: Users,
      color: 'from-neon-lavender-500 to-neon-blue-500',
      path: '/forum',
      urgent: false,
    },
  ];

  const handleMoodSubmit = () => {
    if (currentMood > 0) {
      const moodData: MoodCheckIn = {
        mood: currentMood,
        notes: moodNotes,
        factors: [] // We could add factors selection later
      };
      
      onMoodSubmit?.(moodData);
      setShowMoodForm(false);
      setCurrentMood(0);
      setMoodNotes('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        userRole="student" 
        userName={user?.profile?.fullName || 'Student'}
        unreadNotifications={3}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-gradient-to-r from-neon-blue-500 via-neon-lavender-500 to-neon-mint-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.profile?.fullName?.split(' ')[0] || 'Student'}! 👋
                </h1>
                <p className="mt-2 text-blue-100">
                  Welcome back to your mental wellness journey. How are you feeling today?
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mood Check-in Section */}
              <Card padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-neon-blue-500" />
                    Daily Mood Check-in
                  </h2>
                  <span className="text-sm text-gray-500">
                    {quickStats.streakDays} day streak! 🔥
                  </span>
                </div>

                {!showMoodForm ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-neon-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-neon-blue-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Ready for your daily check-in?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Take a moment to reflect on how you're feeling today
                    </p>
                    <Button 
                      onClick={() => setShowMoodForm(true)}
                      variant="primary"
                      size="lg"
                    >
                      Start Check-in
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <MoodSelector 
                      value={currentMood}
                      onChange={setCurrentMood}
                    />

                    {currentMood > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Any thoughts you'd like to share? (Optional)
                        </label>
                        <textarea
                          value={moodNotes}
                          onChange={(e) => setMoodNotes(e.target.value)}
                          rows={3}
                          className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neon-blue-200 focus:border-neon-blue-500"
                          placeholder="What's on your mind today?"
                        />
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <Button 
                        onClick={handleMoodSubmit}
                        variant="primary"
                        disabled={currentMood === 0}
                        className="flex-1"
                      >
                        Submit Check-in
                      </Button>
                      <Button 
                        onClick={() => {
                          setShowMoodForm(false);
                          setCurrentMood(0);
                          setMoodNotes('');
                        }}
                        variant="ghost"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Quick Actions */}
              <Card padding="lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Quick Actions
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => onNavigate?.(action.path)}
                      className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card padding="lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Recent Activity
                </h2>

                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 py-2">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Progress
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-neon-mint-500" />
                      <span className="text-sm text-gray-600">Sessions</span>
                    </div>
                    <span className="font-semibold text-gray-900">{quickStats.sessionsCompleted}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-neon-blue-500" />
                      <span className="text-sm text-gray-600">Resources</span>
                    </div>
                    <span className="font-semibold text-gray-900">{quickStats.resourcesViewed}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-neon-lavender-500" />
                      <span className="text-sm text-gray-600">Forum Posts</span>
                    </div>
                    <span className="font-semibold text-gray-900">{quickStats.forumPosts}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">Streak</span>
                    </div>
                    <span className="font-semibold text-gray-900">{quickStats.streakDays} days</span>
                  </div>
                </div>
              </Card>

              {/* Upcoming Appointments */}
              <Card padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Upcoming
                </h3>

                <div className="space-y-3">
                  <div className="p-3 bg-neon-mint-50 rounded-lg border border-neon-mint-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="w-4 h-4 text-neon-mint-600" />
                      <span className="text-sm font-medium text-neon-mint-800">Session Tomorrow</span>
                    </div>
                    <p className="text-sm text-neon-mint-700">Dr. Priya Sharma - 3:00 PM</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Bell className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Reminder</span>
                    </div>
                    <p className="text-sm text-gray-600">Complete PHQ-9 screening</p>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => onNavigate?.('/appointments')}
                >
                  View All Appointments
                </Button>
              </Card>

              {/* Wellness Tip */}
              <Card padding="lg" className="bg-gradient-to-br from-neon-blue-50 to-neon-lavender-50 border-neon-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  💡 Today's Wellness Tip
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  "Take 5 minutes for deep breathing exercises. It can significantly reduce stress and improve focus for your studies."
                </p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate?.('/resources')}
                >
                  Explore More Tips
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;