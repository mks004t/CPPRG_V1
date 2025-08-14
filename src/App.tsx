import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { PublicClientApplication } from '@azure/msal-browser';
// import { MsalProvider } from '@azure/msal-react';
import { Toaster } from 'react-hot-toast';

// import { msalConfig } from './config/msalConfig';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Request from './pages/Request';
import ResourceRequestPage from './pages/ResourceRequestPage';
import MyAction from './pages/MyAction';
import MDM from './pages/MDM';

// Azure SSO setup - commented out for development
// const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    // Azure SSO Provider wrapper - commented out for development
    // <MsalProvider instance={msalInstance}>
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <ProtectedRoute>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="request" element={<Request />} />
                    <Route path="resource-request" element={<ResourceRequestPage />} />
                    <Route path="my-action" element={<MyAction />} />
                    <Route path="mdm" element={<MDM />} />
                  </Route>
                </Routes>
              </ProtectedRoute>
              
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                    border: '1px solid var(--toast-border)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#ffffff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#ffffff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
    // </MsalProvider>
  );
}

export default App;