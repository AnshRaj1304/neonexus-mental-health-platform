import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Calendar, BookOpen, Users, Clock, Award, TrendingUp, BarChart3, ClipboardList } from 'lucide-react';
import { Navigation, Card, Button, MoodSelector, VoiceInput } from '../components/ui';
import { User, MoodCheckIn } from '../types';
import '../styles/animations.css';
import { useLanguage } from '../contexts/LanguageContext';

interface StudentDashboardProps {
  user?: User;
  onLogout?: () => void;
  onMoodSubmit?: (mood: MoodCheckIn) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  onLogout,
  onMoodSubmit,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentMood, setCurrentMood] = useState<number>(0);
  const [moodNotes, setMoodNotes] = useState<string>('');
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [moodHistory, setMoodHistory] = useState<Array<MoodCheckIn & { timestamp: Date; id: string }>>([]);
  const [showMoodHistory, setShowMoodHistory] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState('en-US');
  const [recentActivityList, setRecentActivityList] = useState([
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
  ]);

  // Mock data for demonstration
  const [quickStats, setQuickStats] = useState({
    sessionsCompleted: 3,
    resourcesViewed: 12,
    forumPosts: 5,
    streakDays: 7,
    moodCheckins: 12,
  });

  const quickActions = [
    {
      title: t('mentalHealthScreening', 'Mental Health Screening'),
      description: t('takePHQGAD', 'Take PHQ-9, GAD-7 assessments'),
      icon: ClipboardList,
      color: 'from-red-500 to-pink-500',
      path: '/screening',
      urgent: true,
    },
    {
      title: t('chatSupport', 'Chat Support'),
      description: t('talkToAI', 'Talk to our AI assistant'),
      icon: MessageCircle,
      color: 'from-neon-lavender-500 to-neon-lavender-600',
      path: '/chat',
      urgent: false,
    },
    {
      title: t('bookSession', 'Book Session'),
      description: t('scheduleWithCounselor', 'Schedule with a counselor'),
      icon: Calendar,
      color: 'from-neon-mint-500 to-neon-mint-600',
      path: '/appointments',
      urgent: false,
    },
    {
      title: t('browseResources', 'Browse Resources'),
      description: t('educationalContent', 'Educational content library'),
      icon: BookOpen,
      color: 'from-neon-blue-500 to-neon-blue-600',
      path: '/resources',
      urgent: false,
    },
    {
      title: t('joinCommunity', 'Join Community'),
      description: t('connectPeerSupport', 'Connect with peer support'),
      icon: Users,
      color: 'from-neon-lavender-500 to-neon-blue-500',
      path: '/forum',
      urgent: false,
    },
  ];

  const getMoodEmoji = (mood: number) => {
    switch (mood) {
      case 1: return '😢';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '😊';
      case 5: return '😁';
      default: return '😐';
    }
  };

  const getMoodText = (mood: number) => {
    switch (mood) {
      case 1: return 'Very Sad';
      case 2: return 'Sad';
      case 3: return 'Neutral';
      case 4: return 'Happy';
      case 5: return 'Very Happy';
      default: return 'Neutral';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getAverageMood = () => {
    if (moodHistory.length === 0) return 0;
    const sum = moodHistory.reduce((acc, entry) => acc + entry.mood, 0);
    return Math.round((sum / moodHistory.length) * 10) / 10;
  };

  const getMoodTrend = () => {
    if (moodHistory.length < 2) return 'stable';
    const recent = moodHistory.slice(0, 3).reduce((acc, entry) => acc + entry.mood, 0) / Math.min(3, moodHistory.length);
    const older = moodHistory.slice(3, 6).reduce((acc, entry) => acc + entry.mood, 0) / Math.min(3, moodHistory.slice(3, 6).length);
    
    if (recent > older + 0.5) return 'improving';
    if (recent < older - 0.5) return 'declining';
    return 'stable';
  };

  const handleMoodSubmit = () => {
    if (currentMood > 0) {
      const moodData: MoodCheckIn = {
        mood: currentMood,
        notes: moodNotes,
        factors: [] // We could add factors selection later
      };
      
      // Create entry with timestamp and ID
      const moodEntry = {
        ...moodData,
        timestamp: new Date(),
        id: `mood_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      // Add to mood history (most recent first)
      setMoodHistory(prev => [moodEntry, ...prev].slice(0, 30)); // Keep last 30 entries
      
      // Update recent activity
      const newActivity = {
        type: 'mood',
        message: `Recorded mood as ${getMoodText(currentMood)} ${getMoodEmoji(currentMood)}`,
        time: 'Just now',
        icon: Heart,
        color: 'text-green-500'
      };
      
      setRecentActivityList(prev => [newActivity, ...prev.slice(0, 4)]);
      
      // Update stats
      setQuickStats(prev => ({ 
        ...prev, 
        moodCheckins: prev.moodCheckins + 1,
        streakDays: prev.streakDays + 1 
      }));
      
      // Call parent handler
      onMoodSubmit?.(moodData);
      
      // Reset form and hide it to show the new entry
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
                  {t('welcome', 'Welcome')} back to your mental wellness journey. {t('howFeelingToday', 'How are you feeling today?')}
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
                      {t('moodCheckIn', 'Daily Mood Check-in')}
                    </h2>
                  <span className="text-sm text-gray-500">
                    {quickStats.streakDays} day streak! 🔥
                  </span>
                </div>

                {/* Show latest mood entry if available */}
                {moodHistory.length > 0 && !showMoodForm && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">
                          {getMoodEmoji(moodHistory[0].mood)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-green-900">
                            Latest Entry: {getMoodText(moodHistory[0].mood)}
                          </h3>
                          <p className="text-sm text-green-700">
                            {formatDate(moodHistory[0].timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-800">
                          {moodHistory[0].mood}/5
                        </div>
                      </div>
                    </div>
                    {moodHistory[0].notes && (
                      <div className="mt-3 p-3 bg-white/60 rounded-lg border border-green-100">
                        <p className="text-sm text-green-800 italic">
                          💭 "{moodHistory[0].notes}"
                        </p>
                      </div>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs text-green-600">
                        ✨ Great job tracking your mood!
                      </div>
                      <Button 
                        onClick={() => setShowMoodForm(true)}
                        variant="outline"
                        size="sm"
                        className="text-green-700 border-green-300 hover:bg-green-100"
                      >
                        Add New Entry
                      </Button>
                    </div>
                  </div>
                )}

              {!showMoodForm && moodHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-neon-blue-100 to-neon-lavender-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Heart className="w-8 h-8 text-neon-blue-500 animate-pulse" />
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
                      className="transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      🌟 Start Check-in
                    </Button>
                  </div>
                ) : null}

                {showMoodForm && (
                  <div className="space-y-6">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        How are you feeling right now?
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Take a moment to check in with yourself
                      </p>
                    </div>
                    
                    <MoodSelector 
                      value={currentMood}
                      onChange={setCurrentMood}
                    />

                    {currentMood > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Any thoughts you'd like to share? (Optional)
                          </label>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">💬 Type or</span>
                            <VoiceInput
                              value={moodNotes}
                              onChange={setMoodNotes}
                              language={voiceLanguage}
                              placeholder="Click the microphone to speak..."
                            />
                          </div>
                        </div>
                        <div className="relative">
                          <textarea
                            value={moodNotes}
                            onChange={(e) => setMoodNotes(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neon-blue-200 focus:border-neon-blue-500"
                            placeholder="What's on your mind today? How are you feeling about your studies, relationships, or anything else?"
                          />
                          {moodNotes && (
                            <div className="absolute top-2 right-2 text-xs text-gray-400">
                              {moodNotes.length} characters
                            </div>
                          )}
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            <span>💡 Tip: You can type your thoughts or use voice input</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Voice:</span>
                            <select
                              value={voiceLanguage}
                              onChange={(e) => setVoiceLanguage(e.target.value)}
                              className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-neon-blue-300"
                            >
                              <option value="en-US">🇺🇸 English (US)</option>
                              <option value="en-GB">🇬🇧 English (UK)</option>
                              <option value="hi-IN">🇮🇳 Hindi</option>
                              <option value="ur-PK">🇵🇰 Urdu</option>
                              <option value="ks-IN">🏔️ Kashmiri</option>
                              <option value="doi-IN">🏔️ Dogri</option>
                              <option value="es-ES">🇪🇸 Spanish</option>
                              <option value="fr-FR">🇫🇷 French</option>
                              <option value="de-DE">🇩🇪 German</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <Button 
                        onClick={handleMoodSubmit}
                        variant="primary"
                        disabled={currentMood === 0}
                        className="flex-1 transform hover:scale-105 transition-all duration-200 shadow-lg"
                      >
                        💾 Save Mood Entry
                      </Button>
                      <Button 
                        onClick={() => {
                          setShowMoodForm(false);
                          setCurrentMood(0);
                          setMoodNotes('');
                        }}
                        variant="ghost"
                        className="transform hover:scale-105 transition-all duration-200"
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
                  {t('quickActions', 'Quick Actions')}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(action.path)}
                      className={`p-4 rounded-xl border transition-all duration-200 text-left group relative ${
                        action.urgent 
                          ? 'border-red-200 bg-red-50 hover:border-red-300 hover:shadow-md hover:bg-red-100' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      {action.urgent && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      )}
                      <div className="flex items-start space-x-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium mb-1 ${
                            action.urgent ? 'text-red-800' : 'text-gray-900'
                          }`}>
                            {action.title}
                            {action.urgent && <span className="ml-1 text-xs bg-red-200 text-red-700 px-2 py-0.5 rounded-full">Important</span>}
                          </h3>
                          <p className={`text-sm ${
                            action.urgent ? 'text-red-700' : 'text-gray-600'
                          }`}>
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Mood Journal History */}
              <Card padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-neon-lavender-500" />
                    Mood Journal
                  </h2>
                  <div className="flex items-center space-x-3">
                    {moodHistory.length > 0 && (
                      <div className="text-sm text-gray-500">
                        Avg: {getMoodEmoji(Math.round(getAverageMood()))} {getAverageMood()}/5
                      </div>
                    )}
                    <Button 
                      onClick={() => setShowMoodHistory(!showMoodHistory)}
                      variant="ghost"
                      size="sm"
                      className="text-neon-blue-600 hover:text-neon-blue-700"
                    >
                      {showMoodHistory ? 'Hide History' : 'View History'}
                    </Button>
                  </div>
                </div>

                {moodHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                    <p>No mood entries yet. Start tracking your mood to see your journey!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Mood Trend Summary */}
                    <div className="bg-gradient-to-r from-neon-blue-50 to-neon-lavender-50 rounded-xl p-4 border border-neon-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            getMoodTrend() === 'improving' ? 'bg-green-100' :
                            getMoodTrend() === 'declining' ? 'bg-red-100' : 'bg-blue-100'
                          }`}>
                            <TrendingUp className={`w-5 h-5 ${
                              getMoodTrend() === 'improving' ? 'text-green-600' :
                              getMoodTrend() === 'declining' ? 'text-red-600 transform rotate-180' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Your mood trend is {getMoodTrend()}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {moodHistory.length} entries • Average: {getAverageMood()}/5
                            </p>
                          </div>
                        </div>
                        <div className="text-2xl">
                          {getMoodTrend() === 'improving' ? '📈' : getMoodTrend() === 'declining' ? '📉' : '📊'}
                        </div>
                      </div>
                    </div>

                    {showMoodHistory && (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        <div className="text-sm font-medium text-gray-700 mb-3 border-b pb-2">
                          Recent Entries
                        </div>
                        {moodHistory.map((entry, index) => (
                          <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <div className="text-2xl">
                                  {getMoodEmoji(entry.mood)}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {getMoodText(entry.mood)}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {formatDate(entry.timestamp)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-sm text-gray-400">
                                {entry.mood}/5
                              </div>
                            </div>
                            {entry.notes && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700 italic">
                                  "{entry.notes}"
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {/* Recent Activity */}
              <Card padding="lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {t('recentActivity', 'Recent Activity')}
                </h2>

                <div className="space-y-4">
                  {recentActivityList.map((activity, index) => (
                    <div key={`${activity.time}-${index}`} className="flex items-center space-x-3 py-2">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.time === 'Just now' ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${
                          activity.time === 'Just now' ? 'text-green-900 font-medium' : 'text-gray-900'
                        }`}>
                          {activity.message}
                        </p>
                        <p className={`text-xs ${
                          activity.time === 'Just now' ? 'text-green-600 font-medium' : 'text-gray-500'
                        }`}>
                          {activity.time}
                          {activity.time === 'Just now' && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              New
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Mood Trends Chart */}
              {moodHistory.length > 0 && (
                <Card padding="lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-neon-lavender-500" />
                    Mood Trends
                  </h3>
                  
                  <div className="space-y-3">
                    {/* Simple bar chart representation */}
                    <div className="space-y-2">
                      {moodHistory.slice(0, 7).reverse().map((entry, index) => (
                        <div key={entry.id} className="flex items-center space-x-2">
                          <div className="text-xs text-gray-500 w-12 text-right">
                            {entry.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                            <div 
                              className={`h-3 rounded-full transition-all duration-500 ${
                                entry.mood === 1 ? 'bg-red-400' :
                                entry.mood === 2 ? 'bg-orange-400' :
                                entry.mood === 3 ? 'bg-yellow-400' :
                                entry.mood === 4 ? 'bg-green-400' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${(entry.mood / 5) * 100}%` }}
                            />
                          </div>
                          <div className="text-lg w-8">
                            {getMoodEmoji(entry.mood)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Trend indicator */}
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">7-day trend:</span>
                        <div className={`flex items-center space-x-1 font-medium ${
                          getMoodTrend() === 'improving' ? 'text-green-600' :
                          getMoodTrend() === 'declining' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          <TrendingUp className={`w-3 h-3 ${
                            getMoodTrend() === 'declining' ? 'transform rotate-180' : ''
                          }`} />
                          <span className="capitalize">{getMoodTrend()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
              
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
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span className="text-sm text-gray-600">Mood Check-ins</span>
                    </div>
                    <span className="font-semibold text-gray-900">{quickStats.moodCheckins}</span>
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

                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <ClipboardList className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Mental Health Screening</span>
                    </div>
                    <p className="text-sm text-red-700 mb-2">Complete your PHQ-9 and GAD-7 assessments</p>
                    <button 
                      onClick={() => navigate('/screening')}
                      className="text-xs bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition-colors"
                    >
                      Take Assessments
                    </button>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => navigate('/appointments')}
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
                  onClick={() => navigate('/resources')}
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