import React, { createContext, useContext, useState, useEffect } from 'react';

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  // Normalize initial path: e.g. '/login', '/register', '/dashboard', or '/'
  const getInitialPath = () => {
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/login')) return '/login';
    if (path.startsWith('/register')) return '/register';
    if (path.startsWith('/pricing')) return '/pricing';
    if (path.startsWith('/products')) return '/products';
    if (path.startsWith('/sales')) return '/sales';
    if (path.startsWith('/market')) return '/market';
    if (path.startsWith('/reports')) return '/reports';
    if (path.startsWith('/dashboard')) return '/dashboard';
    return '/';
  };

  const [currentPath, setCurrentPath] = useState(getInitialPath);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getInitialPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    let cleanPath = path;
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
    window.history.pushState(null, '', cleanPath);
    setCurrentPath(cleanPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavigationContext.Provider value={{ currentPath, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

