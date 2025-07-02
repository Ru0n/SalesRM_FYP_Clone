import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

const NotificationItem = ({ notification, onClick }) => {
  const formattedTime = formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true });

  const getActorName = () => {
    if (!notification.actor_details) return 'System';
    if (notification.actor_details.first_name && notification.actor_details.last_name) {
      return `${notification.actor_details.first_name} ${notification.actor_details.last_name}`;
    }
    return notification.actor_details.first_name || notification.actor_details.email || 'Unknown User';
  };

  const getNotificationIcon = () => {
    const iconSize = "h-5 w-5";

    switch (notification.level) {
      case 'success':
        return <CheckCircle className={cn(iconSize, "text-green-500")} />;
      case 'warning':
        return <AlertTriangle className={cn(iconSize, "text-yellow-500")} />;
      case 'error':
        return <XCircle className={cn(iconSize, "text-red-500")} />;
      case 'info':
      default:
        return <Info className={cn(iconSize, "text-blue-500")} />;
    }
  };

  const getTargetTypeDisplay = () => {
    if (!notification.target_details?.type) return '';
    switch (notification.target_details.type) {
      case 'leaverequest': return 'Leave Request';
      case 'expenseclaim': return 'Expense Claim';
      case 'tourprogram': return 'Tour Program';
      default: return notification.target_details.type;
    }
  };

  return (
    <div
      className={cn(
        "flex items-start space-x-3 p-3 cursor-pointer transition-colors hover:bg-accent",
        notification.unread && "bg-blue-50 hover:bg-blue-100"
      )}
      onClick={onClick}
    >
      <div className="flex-shrink-0 pt-0.5">
        {getNotificationIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className={cn("text-sm", notification.unread ? "font-medium" : "font-normal")}>
          <span className="font-semibold">{getActorName()}</span> {notification.verb}
          {notification.target_details && (
            <span className="font-semibold"> your {getTargetTypeDisplay()}</span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;