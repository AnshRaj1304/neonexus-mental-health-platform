import React, { useState } from 'react';
import { Heart, Eye, EyeOff, UserCheck, Stethoscope, Shield } from 'lucide-react';
import { Button, Input, Card } from '../components/ui';
import { LoginForm, UserRole } from '../types';

interface LoginPageProps {
  onLogin?: (credentials: LoginForm & { role: UserRole }) => void;
  isLoading?: boolean;
  error?: string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  isLoading = false,
  error
}) => {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
    remember: false
  });
  const [selectedRole, setSelectedRole] = useState<'student' | 'counselor' | 'admin'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const roleConfig = {
    student: {
      icon: UserCheck,
      title: 'Student Login',
      subtitle: 'Access mental health support and resources',
      color: 'from-neon-blue-500 to-neon-lavender-500',
      borderColor: 'border-neon-blue-200',
      demo: { email: 'student@university.edu', password: 'demo123' }
    },
    counselor: {
      icon: Stethoscope,
      title: 'Counselor Login',
      subtitle: 'Manage sessions and support students',
      color: 'from-neon-lavender-500 to-neon-mint-500',
      borderColor: 'border-neon-lavender-200',
      demo: { email: 'counselor@university.edu', password: 'demo123' }
    },
    admin: {
      icon: Shield,
      title: 'Admin Login',
      subtitle: 'System administration and analytics',
      color: 'from-neon-mint-500 to-neon-blue-500',
      borderColor: 'border-neon-mint-200',
      demo: { email: 'admin@university.edu', password: 'demo123' }
    }
  };

  const currentRole = roleConfig[selectedRole];

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onLogin?.({ ...formData, role: selectedRole });
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      ...formData,
      email: currentRole.demo.email,
      password: currentRole.demo.password
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neon-lavender-50 via-white to-neon-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-neon-blue-500 to-neon-lavender-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="mt-6 text-3xl font-bold bg-gradient-to-r from-neon-blue-600 to-neon-lavender-600 bg-clip-text text-transparent">
            NEONEXUS
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Digital Mental Health Support Platform
          </p>
        </div>

        {/* Role Selection */}
        <div className="flex justify-center space-x-2">
          {(Object.keys(roleConfig) as ('student' | 'counselor' | 'admin')[]).map((role) => {
            const config = roleConfig[role];
            const Icon = config.icon;
            
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`
                  p-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${selectedRole === role 
                    ? `${config.borderColor} bg-gradient-to-r ${config.color} bg-opacity-10` 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                type="button"
              >
                <Icon className={`w-5 h-5 ${selectedRole === role ? 'text-current' : 'text-gray-500'}`} />
              </button>
            );
          })}
        </div>

        {/* Login Form */}
        <Card padding="lg" className="shadow-lg">
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${currentRole.color} bg-opacity-10 mb-3`}>
              <currentRole.icon className="w-6 h-6 text-gray-700" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{currentRole.title}</h2>
            <p className="text-sm text-gray-600">{currentRole.subtitle}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              placeholder="Enter your email"
              required
              error={validationErrors.email}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(value) => setFormData({ ...formData, password: value })}
                placeholder="Enter your password"
                required
                error={validationErrors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  className="rounded border-gray-300 text-neon-blue-500 focus:ring-neon-blue-200"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>

              <button className="text-sm text-neon-blue-600 hover:text-neon-blue-700">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            {/* Demo Credentials */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Demo Credentials:</p>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs text-neon-blue-600 hover:text-neon-blue-700 underline"
              >
                Fill demo login for {selectedRole}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              New to NEONEXUS?{' '}
              <button className="text-neon-blue-600 hover:text-neon-blue-700 font-medium">
                Create an account
              </button>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>Made with ❤️ for student mental health</p>
          <p className="mt-1">Supporting universities across India</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;