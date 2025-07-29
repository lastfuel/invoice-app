import React, { useState } from 'react';
import { UserPlus, Mail, Send, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserInvitation = ({ onUserInvited }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { user, inviteUser } = useAuth();

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

  const validateForm = () => {
    if (!formData.name || !formData.email) {
      setError('Please fill in all required fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    const result = await inviteUser(formData);
    
    if (result.success) {
      setSuccess(`Invitation sent to ${formData.email}! They will receive an email to set up their account.`);
      setFormData({
        name: '',
        email: '',
        role: 'user'
      });
      setTimeout(() => {
        setShowForm(false);
        setSuccess('');
        if (onUserInvited) onUserInvited();
      }, 3000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ name: '', email: '', role: 'user' });
    setError('');
    setSuccess('');
  };

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="mb-6">
      {!showForm ? (
        /* Invite Button */
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-bright hover:bg-green-dim text-dark-bg font-medium py-3 px-4 rounded-lg transition-all duration-300 hover-lift flex items-center space-x-2 shadow-lg hover:shadow-green-bright/25"
        >
          <UserPlus className="w-5 h-5" />
          <span>Invite New User</span>
        </button>
      ) : (
        /* Invitation Form */
        <div className="bg-dark-card rounded-lg p-6 border border-green-bright/20 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-bright/20 p-2 rounded-lg">
                <Mail className="w-5 h-5 text-green-bright" />
              </div>
              <div>
                <h3 className="text-lg font-semibold gradient-text">Invite New User</h3>
                <p className="text-sm text-muted-foreground">Send an invitation email to create a new account</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="text-muted-foreground hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-green-bright/20 rounded-lg bg-dark-bg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-bright focus:border-transparent transition-all duration-200"
                placeholder="Enter user's full name"
                disabled={loading}
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-green-bright/20 rounded-lg bg-dark-bg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-bright focus:border-transparent transition-all duration-200"
                placeholder="Enter user's email address"
                disabled={loading}
              />
            </div>

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-white mb-2">
                User Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-green-bright/20 rounded-lg bg-dark-bg text-white focus:outline-none focus:ring-2 focus:ring-green-bright focus:border-transparent transition-all duration-200"
                disabled={loading}
              >
                <option value="user">User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
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
                className="bg-green-bright hover:bg-green-dim text-dark-bg font-medium py-2 px-4 rounded-lg transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-dark-bg"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Invitation</span>
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

          {/* Email Preview */}
          <div className="mt-6 p-4 bg-dark-bg rounded-lg border border-green-bright/10">
            <h4 className="text-sm font-medium text-green-bright mb-2">Email Preview</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>To:</strong> {formData.email || 'user@example.com'}</p>
              <p><strong>Subject:</strong> You're invited to join ShippingSorted Invoice System</p>
              <p><strong>Content:</strong> Welcome email with secure setup link</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInvitation; 