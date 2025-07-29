import React, { useState, useEffect } from 'react';
import { Package, Lock, Eye, EyeOff, Check, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PasswordSetup = ({ token, onSetupComplete }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [validToken, setValidToken] = useState(false);

  const { setupPassword, validateInviteToken } = useAuth();

  useEffect(() => {
    // Validate the invitation token when component mounts
    const validateToken = async () => {
      const result = await validateInviteToken(token);
      if (result.success) {
        setValidToken(true);
        setUserInfo(result.user);
      } else {
        setError(result.message);
      }
    };

    if (token) {
      validateToken();
    }
  }, [token, validateInviteToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    const result = await setupPassword(token, formData.password);
    
    if (result.success) {
      onSetupComplete && onSetupComplete(result.user);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-dark-card rounded-lg p-8 border border-red-500/20">
            <h2 className="text-xl font-bold text-red-400 mb-4">Invalid Link</h2>
            <p className="text-muted-foreground">This password setup link is invalid or missing.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!validToken && !error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-bright mx-auto mb-4"></div>
          <p className="text-white">Validating invitation...</p>
        </div>
      </div>
    );
  }

  if (error && !validToken) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-dark-card rounded-lg p-8 border border-red-500/20">
            <h2 className="text-xl font-bold text-red-400 mb-4">Invalid Invitation</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-sm text-muted-foreground">
              Please contact your administrator for a new invitation.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold gradient-text">Welcome to ShippingSorted</h2>
          <p className="mt-2 text-muted-foreground">Set up your password to complete your account</p>
        </div>

        {/* User Info */}
        {userInfo && (
          <div className="bg-dark-card rounded-lg p-4 border border-green-bright/20">
            <div className="text-center">
              <h3 className="font-medium text-white">{userInfo.name}</h3>
              <p className="text-sm text-muted-foreground">{userInfo.email}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                userInfo.role === 'admin' 
                  ? 'bg-yellow-500/20 text-yellow-400' 
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {userInfo.role === 'admin' ? 'Administrator' : 'User'}
              </span>
            </div>
          </div>
        )}

        {/* Password Setup Form */}
        <div className="bg-dark-card rounded-lg p-8 border border-green-bright/20 hover-lift">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-bright/20 p-2 rounded-lg">
              <Key className="w-5 h-5 text-green-bright" />
            </div>
            <div>
              <h3 className="text-lg font-semibold gradient-text">Create Your Password</h3>
              <p className="text-sm text-muted-foreground">Choose a secure password for your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 border border-green-bright/20 rounded-lg bg-dark-bg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-bright focus:border-transparent transition-all duration-200"
                  placeholder="Create a password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-green-bright transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 border border-green-bright/20 rounded-lg bg-dark-bg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-bright focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-green-bright transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-dark-bg rounded-lg p-3 border border-green-bright/10">
              <h4 className="text-sm font-medium text-green-bright mb-2">Password Requirements</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className={`flex items-center space-x-2 ${formData.password.length >= 6 ? 'text-green-400' : ''}`}>
                  <Check className={`w-3 h-3 ${formData.password.length >= 6 ? 'text-green-400' : 'text-muted-foreground'}`} />
                  <span>At least 6 characters long</span>
                </li>
                <li className={`flex items-center space-x-2 ${formData.password === formData.confirmPassword && formData.password ? 'text-green-400' : ''}`}>
                  <Check className={`w-3 h-3 ${formData.password === formData.confirmPassword && formData.password ? 'text-green-400' : 'text-muted-foreground'}`} />
                  <span>Passwords match</span>
                </li>
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Setup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-bright hover:bg-green-dim text-dark-bg font-medium py-3 px-4 rounded-lg transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-green-bright/25"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-dark-bg"></div>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Complete Account Setup</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            After setup, you'll be able to access the ShippingSorted Invoice System
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordSetup; 