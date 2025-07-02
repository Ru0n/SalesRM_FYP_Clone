import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../../store/slices/notificationSlice';
import NotificationItem from './NotificationItem';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { BellRing, CheckCheck } from 'lucide-react';

const NotificationList = (/*{ onClose }*/) => {
  const { notifications, loading, error } = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleNotificationClick = (notification) => {
    if (notification.unread) {
      dispatch(markNotificationAsRead(notification.id));
    }
    if (notification.target_details) {
      const { type, id } = notification.target_details;
      let path = '';
      switch (type) {
        case 'leaverequest': path = `/leave/${id}`; break;
        case 'expenseclaim': path = `/expense/${id}`; break;
        case 'tourprogram': path = `/tours/${id}`; break;
        default: break;
      }
      if (path) {
        navigate(path);
        // Close popover - This might need coordination with the Popover component
        // or assume Popover closes on clicking outside/an item.
        // If manual closing is needed, a context or callback prop might be required.
        // onClose?.();
      }
    }
  };

  const hasUnread = notifications.some(n => n.unread);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">Notifications</h3>
        <Button
          variant="link"
          size="sm"
          className={`h-auto p-0 text-sm ${hasUnread && !loading ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 cursor-not-allowed'}`}
          onClick={handleMarkAllAsRead}
          disabled={loading || !hasUnread}
        >
          <CheckCheck className="mr-1 h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <ScrollArea className="flex-1 h-[350px]">
        {loading && (
          <div className="flex justify-center items-center p-6 text-gray-500">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2"></div>
            <span>Loading...</span>
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-red-600 bg-red-50 m-2 rounded-md">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">Failed to load notifications.</p>
          </div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">
            <div className="flex justify-center mb-2">
              <BellRing className="text-gray-300 h-10 w-10" />
            </div>
            <p className="font-medium">No notifications</p>
            <p className="text-sm mt-1">You're all caught up!</p>
          </div>
        )}

        {!loading && !error && notifications.length > 0 && (
          <div className="p-0">
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <NotificationItem
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                />
                {index < notifications.length - 1 && <Separator className="my-0" />}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default NotificationList;