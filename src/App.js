import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import CustomerFilter from './components/CustomerFilter';
import InvoiceGenerator from './components/InvoiceGenerator';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagement from './components/UserManagement';
import PasswordSetup from './components/PasswordSetup';
import PasswordChange from './components/PasswordChange';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Package, Bell, User, LogOut, Users } from 'lucide-react';

// CRITICAL: Add immediate check for environment variables
const hasRequiredEnvVars = () => {
  const required = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN', 
    'REACT_APP_FIREBASE_PROJECT_ID'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('🚨 CRITICAL SECURITY: Missing environment variables:', missing);
    console.error('🚨 Authentication will fail. BLOCKING ACCESS.');
    return false;
  }
  
  return true;
};

// Separate component for the main app content to use auth hooks
const AppContent = () => {
  const [uploadedData, setUploadedData] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState('invoice');
  const { user, logout } = useAuth();

  // Debug: Log user object
  console.log('👤 Current user in AppContent:', user);

  // CRITICAL: Additional security check - never render without valid user
  if (!user || !user.uid || !user.email) {
    console.error('🚨 SECURITY BREACH ATTEMPT: No valid user detected in AppContent');
    console.error('🚨 Redirecting to login...');
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to access this application.</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    console.log('🚪 Logout button clicked');
    if (window.confirm('Are you sure you want to logout?')) {
      console.log('🚪 Logout confirmed, calling logout()');
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Header */}
      <header className="bg-dark-card border-b border-green-bright/20">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-bright p-2 rounded-lg animate-pulse-green">
              <Package className="w-6 h-6 text-dark-bg" />
            </div>
            <h1 className="text-xl font-semibold gradient-text">ShippingSorted Invoice</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Password Change */}
            <PasswordChange />
            
            {/* Navigation */}
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('invoice')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'invoice'
                    ? 'bg-green-bright/20 text-green-bright'
                    : 'text-muted-foreground hover:text-green-bright'
                }`}
              >
                Invoice
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                    activeTab === 'users'
                      ? 'bg-green-bright/20 text-green-bright'
                      : 'text-muted-foreground hover:text-green-bright'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Users</span>
                </button>
              )}
            </nav>

            <Bell className="w-5 h-5 text-muted-foreground hover:text-green-bright cursor-pointer transition-colors" />
            
            {/* User info and logout */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm text-white">{user?.name || 'User'}</div>
                <div className="text-xs text-muted-foreground capitalize">{user?.role || 'user'}</div>
              </div>
              <div className="bg-green-bright p-2 rounded-full">
                <User className="w-4 h-4 text-dark-bg" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-muted-foreground hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10 border border-red-400/20"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-8">
        <div className="max-w-6xl mx-auto animate-fade-in-up">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold gradient-text">
              {activeTab === 'invoice' ? 'Invoice Generator' : 'User Management'}
            </h2>
            <div className="text-sm text-muted-foreground">
              Welcome back, {user?.name}! Last login: {new Date(user?.loginTime).toLocaleString()}
            </div>
          </div>
          
          {activeTab === 'invoice' ? (
            <>
              {/* File Upload Section */}
              <div className="mb-8">
                <FileUpload onDataUploaded={setUploadedData} />
              </div>

              {/* Customer Filter Section */}
              {uploadedData && (
                <div className="mb-8">
                  <CustomerFilter 
                    data={uploadedData}
                    selectedCustomer={selectedCustomer}
                    onCustomerSelect={setSelectedCustomer}
                    onFilteredData={setFilteredData}
                  />
                </div>
              )}

              {/* Invoice Generator Section */}
              {filteredData.length > 0 && (
                <div className="mb-8">
                  <InvoiceGenerator 
                    customerName={selectedCustomer}
                    transactions={filteredData}
                  />
                </div>
              )}
            </>
          ) : (
            /* User Management Section */
            <div className="mb-8">
              <UserManagement />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [urlParams, setUrlParams] = useState(new URLSearchParams(window.location.search));

  // CRITICAL: Check environment variables immediately
  const envVarsValid = hasRequiredEnvVars();
  
  console.log('🔒 App.js Security Check:', {
    envVarsValid,
    currentPath,
    hasToken: !!urlParams.get('token')
  });

  useEffect(() => {
    // Simple client-side routing
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setUrlParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle password setup route
  if (currentPath === '/setup') {
    const token = urlParams.get('token');
    return (
      <AuthProvider>
        <PasswordSetup 
          token={token} 
          onSetupComplete={() => {
            window.history.pushState({}, '', '/');
            setCurrentPath('/');
            setUrlParams(new URLSearchParams());
          }}
        />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App; 