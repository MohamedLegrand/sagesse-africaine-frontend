import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaTrash, FaBook, FaCreditCard, FaBell } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { traduireNotification } from '../services/traduireNotification';

const TYPE_CONFIG = {
  livre: { icon: <FaBook className="text-amber-600" />, bg: 'bg-amber-100' },
  paiement: { icon: <FaCreditCard className="text-green-600" />, bg: 'bg-green-100' },
};

const CarteNotification = ({ notification, onMarquerLu, onSupprimer, onClick }) => {
  const { t } = useTranslation('notifications');
  const config = TYPE_CONFIG[notification.type] || {
    icon: <FaBell className="text-brown-500" />,
    bg: 'bg-brown-100',
  };
  const { titre, message } = traduireNotification(notification);

  return (
    <div
      className={`rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${
        notification.est_lu ? 'bg-white' : 'bg-amber-50 border-l-4 border-l-amber-500'
      }`}
      onClick={() => onClick?.(notification)}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 ${config.bg} rounded-full flex items-center justify-center`}>
            {config.icon}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`font-semibold truncate ${notification.est_lu ? 'text-brown-700' : 'text-amber-900'}`}>
                  {titre}
                </h3>
                {!notification.est_lu && (
                  <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
                )}
              </div>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(new Date(notification.cree_le), { addSuffix: true, locale: fr })}
              </p>
            </div>

            <div className="flex gap-1 flex-shrink-0">
              {!notification.est_lu && (
                <button
                  onClick={(e) => { e.stopPropagation(); onMarquerLu(notification.id); }}
                  className="p-1.5 rounded-lg hover:bg-amber-100 transition"
                  title={t('carte.marquerCommeLu')}
                >
                  <FaCheck className="text-green-600 text-sm" />
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onSupprimer(notification.id); }}
                className="p-1.5 rounded-lg hover:bg-red-100 transition"
                title={t('carte.supprimer')}
              >
                <FaTrash className="text-red-500 text-sm" />
              </button>
            </div>
          </div>

          {notification.lien && (
            <Link
              to={notification.lien}
              onClick={(e) => e.stopPropagation()}
              className="inline-block mt-2 text-xs font-medium text-amber-600 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-full transition"
            >
              {t('carte.voir')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarteNotification;
