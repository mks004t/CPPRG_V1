import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { useMsal } from '@azure/msal-react';
// import { AccountInfo } from '@azure/msal-browser';
// import { loginRequest } from '../config/msalConfig';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  jwtToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // const { instance, accounts } = useMsal();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  // Azure SSO verification - commented out for development
  // const verifyUserWithBackend = async (azureAccount: AccountInfo) => {
  //   try {
  //     const response = await axios.post('/api/auth/verify', {
  //       azureId: azureAccount.localAccountId,
  //       name: azureAccount.name,
  //       email: azureAccount.username,
  //     });

  //     const { token, user: userData } = response.data;
      
  //     setJwtToken(token);
  //     localStorage.setItem('jwtToken', token);
      
  //     setUser({
  //       id: userData.id,
  //       name: userData.name,
  //       email: userData.email,
  //       username: userData.username,
  //     });

  //     // Set default authorization header
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
  //     toast.success('Successfully logged in!');
  //   } catch (error) {
  //     console.error('Backend verification failed:', error);
  //     toast.error('Authentication failed. Please try again.');
  //     logout();
  //   }
  // };

  const login = async () => {
    try {
      setIsLoading(true);
      
      // Bypass Azure SSO for development - simulate successful login
      const mockUser = {
        id: 'dev-user-001',
        name: 'John Developer',
        email: 'john.developer@tata.com',
        username: 'john.developer@tata.com',
      };
      
      const mockToken = 'dev-jwt-token-' + Date.now();
      
      setJwtToken(mockToken);
      localStorage.setItem('jwtToken', mockToken);
      setUser(mockUser);
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
      
      toast.success('Successfully logged in! (Development Mode)');
      
      // Original Azure SSO code - commented out
      // const response = await instance.loginPopup(loginRequest);
      // await verifyUserWithBackend(response.account);
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // instance.logoutPopup(); // Azure SSO logout - commented out
    setUser(null);
    setJwtToken(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userInfo');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('jwtToken');
        const storedUser = localStorage.getItem('userInfo');
        
        if (storedToken && storedUser) {
          // Auto-login for returning users (development bypass)
          setJwtToken(storedToken);
          setUser(JSON.parse(storedUser));
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        
        // Original Azure SSO auto-login code - commented out
        // if (accounts.length > 0 && storedToken && storedUser) {
        //   // Auto-login for returning users
        //   setJwtToken(storedToken);
        //   setUser(JSON.parse(storedUser));
        //   axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        // } else if (accounts.length > 0) {
        //   // Azure session exists but no backend token
        //   await verifyUserWithBackend(accounts[0]);
        // }
      } catch (error) {
        console.error('Auto-login failed:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []); // Removed accounts dependency for development bypass

  // Store user info when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('userInfo', JSON.stringify(user));
    }
  }, [user]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    jwtToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};