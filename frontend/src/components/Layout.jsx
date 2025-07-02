import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '../lib/utils';

const Layout = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if current page is login page
  const isLoginPage = location.pathname === '/login';

  // Check if screen is mobile and manage sidebar state
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);

      // Only auto-close sidebar on initial load or when transitioning from desktop to mobile
      if (isMobileView) {
        setSidebarOpen(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Add resize listener
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []); // Remove sidebarOpen from dependencies to prevent circular updates

  // Separate effect to handle desktop transition
  useEffect(() => {
    if (!isMobile && !sidebarOpen) {
      // When transitioning from mobile to desktop, open the sidebar
      // This is in a separate effect to avoid circular dependencies
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {isAuthenticated && (
        <Header toggleSidebar={toggleSidebar} />
      )}

      <div className="flex flex-1 relative">
        {isAuthenticated && (
          <Sidebar isOpen={sidebarOpen} />
        )}

        <main
          className={cn(
            "flex-1 transition-all duration-300 overflow-y-auto"
          )}
        >
          <div
            className={cn(
              "h-full",
              "p-4 md:p-6"
            )}
          >
            {children}
          </div>
        </main>
      </div>

      <footer className="py-4 px-6 bg-white border-t border-gray-200 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} SalesRM. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;