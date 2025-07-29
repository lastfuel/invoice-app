import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Store additional user data in localStorage (role, etc.)
  const getUserData = (firebaseUser) => {
    if (!firebaseUser) return null;
    
    const storedUsers = JSON.parse(localStorage.getItem('invoiceApp_userData') || '{}');
    const userData = storedUsers[firebaseUser.uid] || {
      role: firebaseUser.email === 'admin@invoice-app.com' ? 'admin' : 'user',
      name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
      isActive: true
    };
    
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified,
      ...userData
    };
  };

  const saveUserData = (firebaseUser, additionalData = {}) => {
    if (!firebaseUser) return;
    
    const storedUsers = JSON.parse(localStorage.getItem('invoiceApp_userData') || '{}');
    storedUsers[firebaseUser.uid] = {
      ...storedUsers[firebaseUser.uid],
      ...additionalData
    };
    localStorage.setItem('invoiceApp_userData', JSON.stringify(storedUsers));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('🔥 Firebase Auth State Changed:', {
        user: firebaseUser,
        uid: firebaseUser?.uid,
        email: firebaseUser?.email,
        emailVerified: firebaseUser?.emailVerified
      });
      
      if (firebaseUser) {
        const userData = getUserData(firebaseUser);
        console.log('👤 Setting user data:', userData);
        setUser(userData);
      } else {
        console.log('❌ No user - should show login');
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = getUserData(userCredential.user);
      
      if (!userData.isActive) {
        await signOut(auth);
        throw new Error('Account is inactive. Please contact an administrator.');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.message.includes('inactive')) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!user || !auth.currentUser) {
        throw new Error('No user logged in');
      }

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      await updatePassword(auth.currentUser, newPassword);
      
      return { success: true, message: 'Password updated successfully!' };
    } catch (error) {
      console.error('Password change error:', error);
      let errorMessage = 'Failed to change password. Please try again.';
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'New password is too weak. Please choose a stronger password.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Admin functions for user management
  const createUserAccount = async (email, password, userData) => {
    try {
      if (!user || user.role !== 'admin') {
        throw new Error('Only administrators can create user accounts');
      }

      // Note: In a real app, this would be done via Firebase Admin SDK on the backend
      // For now, we'll simulate this by creating the account and storing additional data
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      saveUserData(userCredential.user, {
        name: userData.name,
        role: userData.role || 'user',
        isActive: true,
        createdBy: user.uid,
        createdAt: new Date().toISOString()
      });

      // Sign out the newly created user and sign back in as admin
      await signOut(auth);
      await signInWithEmailAndPassword(auth, user.email, 'admin123'); // This needs to be handled better
      
      return { success: true, message: 'User account created successfully!' };
    } catch (error) {
      console.error('Create user error:', error);
      return { success: false, error: error.message };
    }
  };

  const getUsers = () => {
    // In a real app, this would fetch from Firebase/Firestore
    const storedUsers = JSON.parse(localStorage.getItem('invoiceApp_userData') || '{}');
    return Object.entries(storedUsers).map(([uid, userData]) => ({
      uid,
      ...userData
    }));
  };

  const updateUserStatus = (userId, isActive) => {
    const storedUsers = JSON.parse(localStorage.getItem('invoiceApp_userData') || '{}');
    if (storedUsers[userId]) {
      storedUsers[userId].isActive = isActive;
      localStorage.setItem('invoiceApp_userData', JSON.stringify(storedUsers));
      return true;
    }
    return false;
  };

  const deleteUser = (userId) => {
    // In a real app, this would delete from Firebase/Firestore
    const storedUsers = JSON.parse(localStorage.getItem('invoiceApp_userData') || '{}');
    if (storedUsers[userId]) {
      delete storedUsers[userId];
      localStorage.setItem('invoiceApp_userData', JSON.stringify(storedUsers));
      return true;
    }
    return false;
  };

  // Initialize admin user on first load
  useEffect(() => {
    const initializeAdmin = async () => {
      console.log('🔄 Admin initialization starting...');
      try {
        // Check if admin already exists
        const storedUsers = JSON.parse(localStorage.getItem('invoiceApp_userData') || '{}');
        const adminExists = Object.values(storedUsers).some(user => user.role === 'admin');
        
        console.log('👑 Admin check:', { storedUsers, adminExists });
        
        if (!adminExists) {
          console.log('🆕 Creating admin account...');
          // Create admin account
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, 'admin@invoice-app.com', 'admin123');
            console.log('✅ Admin created:', userCredential.user.uid);
          } catch (error) {
            // Admin might already exist in Firebase, just not in our local storage
            console.log('⚠️ Admin creation error (might already exist):', error.code);
            if (error.code !== 'auth/email-already-in-use') {
              console.error('❌ Failed to create admin:', error);
            }
          }
        } else {
          console.log('✅ Admin already exists in localStorage');
        }
      } catch (error) {
        console.error('❌ Admin initialization error:', error);
      }
    };

    initializeAdmin();
  }, []);

  const value = {
    user,
    login,
    logout,
    loading,
    error,
    setError,
    changePassword,
    // Admin functions
    createUserAccount,
    getUsers,
    updateUserStatus,
    deleteUser,
    // Legacy functions for compatibility (simplified)
    inviteUser: async (userData) => {
      return await createUserAccount(userData.email, 'tempPassword123', userData);
    },
    validateInviteToken: () => ({ valid: false }), // Disabled for now
    setupPassword: () => ({ success: false }) // Disabled for now
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 