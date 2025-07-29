import React, { useState, useEffect } from 'react';
import { Users, Shield, Trash2, ToggleLeft, ToggleRight, Mail, Calendar, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserInvitation from './UserInvitation';

const UserManagement = () => {
  const { user, getUsers, updateUserStatus, deleteUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Check if current user is admin
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUsers = () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const result = getUsers();
    if (result.success) {
      setUsers(result.users);
    }
    setLoading(false);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    setActionLoading(userId);
    
    const result = updateUserStatus(userId, !currentStatus);
    if (result.success) {
      loadUsers(); // Reload users to get updated data
    } else {
      alert(result.message);
    }
    
    setActionLoading(null);
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }

    setActionLoading(userId);
    
    const result = deleteUser(userId);
    if (result.success) {
      loadUsers(); // Reload users to get updated data
    } else {
      alert(result.message);
    }
    
    setActionLoading(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAdmin) {
    return (
      <div className="bg-dark-card rounded-lg p-6 border border-red-500/20">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-semibold text-white mb-2">Access Denied</h3>
          <p className="text-muted-foreground">You need administrator privileges to access user management.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-dark-card rounded-lg p-6 border border-green-bright/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-bright mx-auto mb-4"></div>
          <p className="text-white">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Invitation */}
      <UserInvitation onUserInvited={loadUsers} />
      
      <div className="bg-dark-card rounded-lg border border-green-bright/20 hover-lift">
      {/* Header */}
      <div className="p-6 border-b border-green-bright/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-bright/20 p-2 rounded-lg">
              <Users className="w-6 h-6 text-green-bright" />
            </div>
            <div>
              <h3 className="text-lg font-semibold gradient-text">User Management</h3>
              <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
            </div>
          </div>
          <div className="bg-green-bright/10 px-3 py-1 rounded-full">
            <span className="text-green-bright text-sm font-medium">{users.length} Users</span>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="p-6">
        {users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((userData) => (
              <div key={userData.id} className="bg-dark-bg rounded-lg p-4 border border-green-bright/10 hover:border-green-bright/20 transition-all">
                <div className="flex items-center justify-between">
                  {/* User Info */}
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-bright/20 p-3 rounded-full">
                      {userData.role === 'admin' ? (
                        <Crown className="w-5 h-5 text-green-bright" />
                      ) : (
                        <Users className="w-5 h-5 text-green-bright" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-white">{userData.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          userData.role === 'admin' 
                            ? 'bg-yellow-500/20 text-yellow-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {userData.role}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          userData.isActive 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {userData.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{userData.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>@{userData.username}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Joined {formatDate(userData.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {/* Toggle Status Button */}
                    <button
                      onClick={() => handleToggleStatus(userData.id, userData.isActive)}
                      disabled={actionLoading === userData.id || userData.id === user.id}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        userData.isActive
                          ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                          : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title={userData.isActive ? 'Deactivate User' : 'Activate User'}
                    >
                      {actionLoading === userData.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : userData.isActive ? (
                        <ToggleRight className="w-4 h-4" />
                      ) : (
                        <ToggleLeft className="w-4 h-4" />
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteUser(userData.id, userData.username)}
                      disabled={actionLoading === userData.id || userData.id === user.id}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete User"
                    >
                      {actionLoading === userData.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Warning for current user */}
                {userData.id === user.id && (
                  <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400 text-xs">
                    This is your account - you cannot modify your own status or delete your account
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default UserManagement; 