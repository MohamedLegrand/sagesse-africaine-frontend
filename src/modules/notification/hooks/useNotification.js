import { useNotificationContext } from '../contextes/NotificationContext';

const useNotification = () => {
  const context = useNotificationContext();
  
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  
  return context;
};

export default useNotification;