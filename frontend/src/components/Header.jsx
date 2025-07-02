import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import SimpleNotificationIcon from './notifications/SimpleNotificationIcon';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import {
  FaBars,
  FaCalendarAlt,
  FaEnvelope,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaBell
} from 'react-icons/fa';

// Revert: Remove sidebarOpen and isMobile props
const Header = ({ toggleSidebar }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return '';

    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user.first_name) {
      return user.first_name;
    } else {
      return user.email;
    }
  };

  // Get user's initials for avatar
  const getUserInitials = () => {
    if (!user) return '';

    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`;
    } else if (user.first_name) {
      return user.first_name[0];
    } else if (user.email) {
      return user.email[0].toUpperCase();
    }

    return 'U';
  };

  // Get current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/leave')) return 'Leave Requests';
    if (path.startsWith('/expense')) return 'Expense Claims';
    if (path.startsWith('/contact/doctors')) return 'Doctors';
    if (path.startsWith('/contact/chemists')) return 'Chemists';
    if (path.startsWith('/dcr')) return 'Daily Call Reports';
    if (path.startsWith('/tours')) return 'Tour Programs';
    if (path.startsWith('/reports')) return 'Reports';
    return 'SalesRM';
  };

  return (
    <header className="sticky top-0 z-[60] bg-white border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center px-4 py-2 lg:px-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              toggleSidebar();
            }}
            className="mr-4 text-gray-600 hover:text-blue-600 hover:bg-gray-100"
            aria-label="Toggle sidebar"
            id="sidebar-toggle-button"
          >
            <FaBars className="h-5 w-5" />
          </Button>

          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600 mr-6 flex items-center">
              <span className="bg-blue-600 text-white p-1 rounded mr-2">SR</span>
              <span className="hidden md:inline">SalesRM</span>
            </Link>
            <h1 className="text-lg font-medium text-gray-800 hidden md:block">{getPageTitle()}</h1>
          </div>
        </div>

        {isAuthenticated && (
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full hidden md:flex"
              aria-label="Calendar"
            >
              <FaCalendarAlt className="h-5 w-5" />
            </Button>

            <div className="relative">
              <SimpleNotificationIcon />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full hidden md:flex"
              aria-label="Mail"
            >
              <FaEnvelope className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 rounded-full px-3 py-2 h-auto"
                >
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-800 hidden sm:inline-block">{getUserDisplayName()}</span>
                  {user?.role && (
                    <Badge
                      variant="secondary"
                      className="ml-1 hidden sm:inline-flex"
                    >
                      {user.role}
                    </Badge>
                  )}
                  <FaChevronDown className="text-gray-500 text-xs ml-1" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="font-medium text-gray-800">{getUserDisplayName()}</p>
                    {user?.email && <p className="text-xs text-gray-500">{user.email}</p>}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center cursor-pointer">
                    <FaUserCircle className="mr-3 h-4 w-4 text-gray-500" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center cursor-pointer">
                    <FaCog className="mr-3 h-4 w-4 text-gray-500" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
                >
                  <FaSignOutAlt className="mr-3 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;