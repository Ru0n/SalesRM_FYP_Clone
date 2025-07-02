import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUnreadCount } from '../../store/slices/notificationSlice';
import NotificationList from './NotificationList';
import './Notifications.css';

const NotificationIcon = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  
  // Fetch unread count on component mount and every 30 seconds
  useEffect(() => {
    dispatch(fetchUnreadCount());
    console.log('NotificationIcon mounted, fetching unread count');
    
    // Set up polling for new notifications
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
      console.log('Polling for notifications');
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  // Log unread count when it changes
  useEffect(() => {
    console.log('Unread count:', unreadCount);
  }, [unreadCount]);
  
  // Toggle notification list
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  
  return (
    <div className="notification-container">
      <button 
        className="notification-icon-button" 
        onClick={toggleNotifications}
        aria-label="Notifications"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ color: 'white' }}
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
      
      {showNotifications && (
        <NotificationList onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
};

export default NotificationIcon;