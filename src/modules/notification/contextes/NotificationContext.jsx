import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';

const NotificationContext = createContext();

export const useNotificationContext = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [nonLues, setNonLues] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getMesNotifications();
      setNotifications(data.notifications || []);
      const count = (data.notifications || []).filter(n => !n.est_lu).length;
      setNonLues(count);
    } catch (error) {
      console.error('Erreur fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const marquerCommeLu = async (notificationId) => {
    try {
      await notificationService.marquerCommeLu(notificationId);
      await fetchNotifications();
      // Déclencher mise à jour du badge
      window.dispatchEvent(new Event('notificationUpdated'));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const marquerToutLu = async () => {
    try {
      await notificationService.marquerToutLu();
      await fetchNotifications();
      window.dispatchEvent(new Event('notificationUpdated'));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const supprimerNotification = async (notificationId) => {
    try {
      await notificationService.supprimerNotification(notificationId);
      await fetchNotifications();
      window.dispatchEvent(new Event('notificationUpdated'));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Écouter les mises à jour
    window.addEventListener('notificationUpdated', fetchNotifications);
    return () => window.removeEventListener('notificationUpdated', fetchNotifications);
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      nonLues,
      loading,
      marquerCommeLu,
      marquerToutLu,
      supprimerNotification,
      fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};