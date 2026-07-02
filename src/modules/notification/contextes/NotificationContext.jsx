import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import notificationService from '../services/notificationService';

const NotificationContext = createContext(null);

export const useNotificationContext = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [nonLues, setNonLues] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!localStorage.getItem('access_token')) {
      setLoading(false);
      return;
    }
    try {
      const data = await notificationService.getMesNotifications();
      const liste = data.notifications || [];
      setNotifications(liste);
      setNonLues(data.non_lues ?? liste.filter(n => !n.est_lu).length);
    } catch {
      // silently fail pendant le polling
    } finally {
      setLoading(false);
    }
  }, []);

  const marquerCommeLu = async (notificationId) => {
    try {
      await notificationService.marquerCommeLu(notificationId);
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, est_lu: true } : n));
      setNonLues(prev => Math.max(0, prev - 1));
      window.dispatchEvent(new Event('notificationUpdated'));
    } catch (e) {
      console.error('marquerCommeLu:', e);
    }
  };

  const marquerToutLu = async () => {
    try {
      await notificationService.marquerToutLu();
      setNotifications(prev => prev.map(n => ({ ...n, est_lu: true })));
      setNonLues(0);
      window.dispatchEvent(new Event('notificationUpdated'));
    } catch (e) {
      console.error('marquerToutLu:', e);
    }
  };

  const supprimerNotification = async (notificationId) => {
    const notif = notifications.find(n => n.id === notificationId);
    try {
      await notificationService.supprimerNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notif && !notif.est_lu) setNonLues(prev => Math.max(0, prev - 1));
      window.dispatchEvent(new Event('notificationUpdated'));
    } catch (e) {
      console.error('supprimerNotification:', e);
    }
  };

  const supprimerTout = async () => {
    try {
      await notificationService.supprimerTout();
      setNotifications([]);
      setNonLues(0);
      window.dispatchEvent(new Event('notificationUpdated'));
    } catch (e) {
      console.error('supprimerTout:', e);
    }
  };

  const getDetail = async (notificationId) => {
    return await notificationService.getNotification(notificationId);
  };

  useEffect(() => {
    fetchNotifications();
    intervalRef.current = setInterval(fetchNotifications, 30000);
    window.addEventListener('notificationUpdated', fetchNotifications);
    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener('notificationUpdated', fetchNotifications);
    };
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      nonLues,
      loading,
      marquerCommeLu,
      marquerToutLu,
      supprimerNotification,
      supprimerTout,
      getDetail,
      fetchNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
