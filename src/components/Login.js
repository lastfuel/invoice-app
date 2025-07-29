import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const { login, error, setError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError('');
    setError('');

    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setLocalError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (localError) setLocalError('');
    if (error) setError('');
  };

  const fillAdminCredentials = () => {
    setFormData({
      email: 'admin@invoice-app.com',
      password: 'admin123'
    });
    setLocalError('');
    setError('');
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-bright p-3 rounded-lg animate-pulse-green">
              <Package className="w-8 h-8 text-dark-bg" />
            </div>
          </div>
          <h2 className="text-3xl font-bold gradient-text">ShippingSorted</h2>
          <p className="mt-2 text-muted-foreground">Sign in to access the Invoice Generator</p>
        </div>

        {/* Login Form */}
        <div className="bg-dark-card rounded-lg p-8 border border-green-bright/20 hover-lift">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {displayError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{displayError}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-green-bright/20 rounded-lg bg-dark-bg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-bright focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-green-bright/20 rounded-lg bg-dark-bg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-bright focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-green-bright transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-bright hover:bg-green-dim text-dark-bg font-medium py-3 px-4 rounded-lg transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-green-bright/25"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-dark-bg"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Demo Credentials Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="text-sm text-green-bright hover:text-green-dim underline transition-colors"
                disabled={isLoading}
              >
                Fill Admin Credentials (Demo)
              </button>
            </div>
          </form>
        </div>

        {/* Access Notice */}
        <div className="bg-dark-card rounded-lg p-4 border border-blue-500/20">
          <div className="text-center">
            <h3 className="text-sm font-medium text-blue-400 mb-2">Need Access?</h3>
            <p className="text-xs text-muted-foreground">
              If you've received an invitation email, click the setup link to create your account. 
              Otherwise, contact your administrator for access.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            🔒 Secured with Firebase Authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 