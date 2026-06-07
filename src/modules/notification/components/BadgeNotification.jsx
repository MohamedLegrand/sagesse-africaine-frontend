import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import notificationService from '../services/notificationService';

const BadgeNotification = () => {
  const [nonLues, setNonLues] = useState(0);

  const fetchNonLues = async () => {
    const count = await notificationService.compterNonLues();
    setNonLues(count);
  };

  useEffect(() => {
    fetchNonLues();
    
    // Écouter les mises à jour
    window.addEventListener('notificationUpdated', fetchNonLues);
    return () => window.removeEventListener('notificationUpdated', fetchNonLues);
  }, []);

  return (
    <Link to="/mes-notifications" className="relative">
      <div className="p-2 rounded-full bg-amber-50 hover:bg-amber-100 transition-all duration-300">
        <FaBell className="text-xl text-amber-700 hover:text-amber-500 transition-colors" />
      </div>
      {nonLues > 0 && (
        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse">
          {nonLues > 9 ? '9+' : nonLues}
        </span>
      )}
    </Link>
  );
};

export default BadgeNotification;