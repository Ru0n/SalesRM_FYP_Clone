import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUnreadCount } from '../../store/slices/notificationSlice';
import NotificationList from './NotificationList';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '../../lib/utils';
import { Bell } from 'lucide-react';

const SimpleNotificationIcon = () => {
  const { unreadCount } = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  // Fetch unread count on component mount
  useEffect(() => {
    dispatch(fetchUnreadCount());

    // Set up polling for new notifications
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className={cn(
                "absolute -top-1 -right-1 px-1.5 min-w-5 h-5 flex items-center justify-center",
                "text-[10px] font-bold rounded-full"
              )}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 md:w-96 p-0 border-gray-200 shadow-lg max-h-[80vh] overflow-hidden">
        <NotificationList onClose={() => { }} />
      </PopoverContent>
    </Popover>
  );
};

export default SimpleNotificationIcon;