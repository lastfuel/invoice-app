import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Check, Key, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PasswordChange = ({ onPasswordChanged }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { user, changePassword } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    const result = await changePassword(formData.currentPassword, formData.newPassword);
    
    if (result.success) {
      setSuccess('Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => {
        setShowForm(false);
        setSuccess('');
        if (onPasswordChanged) onPasswordChanged();
      }, 2000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setError('');
    setSuccess('');
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-200 text-sm"
      >
        <Key className="w-4 h-4" />
        <span>Change Password</span>
      </button>
    );
  }

  return (
    <div className="bg-dark-card rounded-lg p-6 border border-blue-500/20 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <Lock className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-400">Change Password</h3>
            <p className="text-sm text-muted-foreground">Update your account password</p>
          </div>
        </div>
        <button
          onClick={handleCancel}
          className="text-muted-foreground hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password Field */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-white mb-2">
            Current Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              id="currentPassword"
              name="currentPassword"
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-12 py-2 border border-blue-500/20 rounded-lg bg-dark-bg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              placeholder="Enter current password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-blue-400 transition-colors"
              disabled={loading}
            >
              {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* New Password Field */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-white mb-2">
            New Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Key className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              id="newPassword"
              name="newPassword"
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-12 py-2 border border-blue-500/20 rounded-lg bg-dark-bg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              placeholder="Enter new password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-blue-400 transition-colors"
              disabled={loading}
            >
              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
            Confirm New Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Key className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-12 py-2 border border-blue-500/20 rounded-lg bg-dark-bg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              placeholder="Confirm new password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-blue-400 transition-colors"
              disabled={loading}
            >
              {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-dark-bg rounded-lg p-3 border border-blue-500/10">
          <h4 className="text-sm font-medium text-blue-400 mb-2">Password Requirements</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li className={`flex items-center space-x-2 ${formData.newPassword.length >= 6 ? 'text-green-400' : ''}`}>
              <Check className={`w-3 h-3 ${formData.newPassword.length >= 6 ? 'text-green-400' : 'text-muted-foreground'}`} />
              <span>At least 6 characters long</span>
            </li>
            <li className={`flex items-center space-x-2 ${formData.newPassword === formData.confirmPassword && formData.newPassword ? 'text-green-400' : ''}`}>
              <Check className={`w-3 h-3 ${formData.newPassword === formData.confirmPassword && formData.newPassword ? 'text-green-400' : 'text-muted-foreground'}`} />
              <span>Passwords match</span>
            </li>
            <li className={`flex items-center space-x-2 ${formData.currentPassword !== formData.newPassword && formData.newPassword ? 'text-green-400' : ''}`}>
              <Check className={`w-3 h-3 ${formData.currentPassword !== formData.newPassword && formData.newPassword ? 'text-green-400' : 'text-muted-foreground'}`} />
              <span>Different from current password</span>
            </li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-400" />
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Change Password</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChange; 