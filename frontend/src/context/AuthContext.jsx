import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing session status on initial load
  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth/status', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async ({ email, password }) => {
    // Send request to Flask authentication backend with credentials
    const res = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || 'Invalid email or password.');
    }

    if (data.user) {
      setUser(data.user);
    } else {
      // Re-verify session if user object wasn't in response
      await checkAuthStatus();
    }

    return data;
  };

  const register = async ({ full_name, email, password, confirm_password }) => {
    const res = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: full_name,
        full_name,
        email,
        password,
        confirm_password,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || 'Error creating account.');
    }

    if (data.user) {
      setUser(data.user);
    } else {
      await checkAuthStatus();
    }

    return data;
  };

  const logout = async () => {
    try {
      await fetch('/logout', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

