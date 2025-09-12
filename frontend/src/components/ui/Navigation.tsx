import React, { useState } from 'react';
import { Menu, X, Heart, MessageCircle, Calendar, BookOpen, Users, BarChart3, User, Bell, LogOut } from 'lucide-react';

interface NavigationProps {
  userRole?: 'student' | 'counselor' | 'admin';
  userName?: string;
  unreadNotifications?: number;
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  userRole = 'student',
  userName = 'Student',
  unreadNotifications = 0,
  onNavigate,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const studentNavItems = [
    { icon: Heart, label: 'Dashboard', path: '/dashboard', color: 'text-neon-blue-600' },
    { icon: MessageCircle, label: 'Chat Support', path: '/chat', color: 'text-neon-lavender-600' },
    { icon: Calendar, label: 'Appointments', path: '/appointments', color: 'text-neon-mint-600' },
    { icon: BookOpen, label: 'Resources', path: '/resources', color: 'text-neon-blue-600' },
    { icon: Users, label: 'Community', path: '/forum', color: 'text-neon-lavender-600' },
  ];

  const counselorNavItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/counselor/dashboard', color: 'text-neon-blue-600' },
    { icon: Calendar, label: 'My Sessions', path: '/counselor/sessions', color: 'text-neon-mint-600' },
    { icon: Users, label: 'Students', path: '/counselor/students', color: 'text-neon-lavender-600' },
    { icon: BookOpen, label: 'Resources', path: '/counselor/resources', color: 'text-neon-blue-600' },
  ];

  const adminNavItems = [
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics', color: 'text-neon-blue-600' },
    { icon: Users, label: 'User Management', path: '/admin/users', color: 'text-neon-lavender-600' },
    { icon: Calendar, label: 'Sessions', path: '/admin/sessions', color: 'text-neon-mint-600' },
    { icon: BookOpen, label: 'Content', path: '/admin/content', color: 'text-neon-blue-600' },
  ];

  const getNavItems = () => {
    switch (userRole) {
      case 'counselor': return counselorNavItems;
      case 'admin': return adminNavItems;
      default: return studentNavItems;
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-neon-blue-500 to-neon-lavender-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-neon-blue-600 to-neon-lavender-600 bg-clip-text text-transparent">
                NEONEXUS
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:ml-10 md:space-x-8">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate?.(item.path)}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                >
                  <item.icon className={`w-4 h-4 mr-2 ${item.color}`} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200">
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-neon-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-neon-blue-600" />
                </div>
                <span className="hidden md:block text-sm font-medium">{userName}</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Profile Settings
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Privacy Settings
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Language
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onNavigate?.(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <item.icon className={`w-5 h-5 mr-3 ${item.color}`} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;