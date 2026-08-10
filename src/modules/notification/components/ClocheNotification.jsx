import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNotificationContext } from '../contextes/NotificationContext';
import { traduireNotification } from '../services/traduireNotification';

const TYPE_ICONS = { livre: '📚', paiement: '💳' };

const ClocheNotification = ({ className = '' }) => {
  const { t } = useTranslation('notifications');
  const ctx = useNotificationContext();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!ctx || !localStorage.getItem('access_token')) return null;

  const { notifications, nonLues, marquerCommeLu } = ctx;
  const dernieres = notifications.slice(0, 5);

  const handleClickNotif = async (notif) => {
    if (!notif.est_lu) await marquerCommeLu(notif.id);
    setOpen(false);
    navigate('/mes-notifications');
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(v => !v)}
        className="relative p-2 rounded-lg text-brown-600 hover:bg-cream-100 transition-colors"
        aria-label={t('cloche.ariaLabel')}
      >
        <Bell className="w-5 h-5" />
        {nonLues > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold leading-none">
            {nonLues > 9 ? '9+' : nonLues}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-cream-200 z-50 overflow-hidden">
          {/* En-tête */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-cream-100 bg-cream-50">
            <span className="font-semibold text-brown-800 text-sm">{t('cloche.titre')}</span>
            {nonLues > 0 && (
              <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                {t('cloche.nonLue', { count: nonLues })}
              </span>
            )}
          </div>

          {/* Liste */}
          <div className="divide-y divide-cream-100 max-h-72 overflow-y-auto">
            {dernieres.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="w-10 h-10 mx-auto mb-3 text-brown-200" />
                <p className="text-sm text-brown-400">{t('cloche.aucuneNotification')}</p>
              </div>
            ) : (
              dernieres.map((notif) => {
                const { titre, message } = traduireNotification(notif);
                return (
                <button
                  key={notif.id}
                  onClick={() => handleClickNotif(notif)}
                  className={`w-full text-left px-4 py-3 hover:bg-cream-50 transition-colors flex items-start gap-3 ${
                    !notif.est_lu ? 'bg-amber-50/60' : ''
                  }`}
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">
                    {TYPE_ICONS[notif.type] || '🔔'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className={`text-sm font-medium leading-tight ${!notif.est_lu ? 'text-brown-900' : 'text-brown-600'}`}>
                        {titre}
                      </p>
                      {!notif.est_lu && (
                        <div className="w-1.5 h-1.5 bg-terra-500 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-brown-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {message}
                    </p>
                    <p className="text-[10px] text-brown-300 mt-1">
                      {formatDistanceToNow(new Date(notif.cree_le), { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                </button>
                );
              })
            )}
          </div>

          {/* Pied */}
          <div className="border-t border-cream-100 px-4 py-2.5 bg-cream-50">
            <Link
              to="/mes-notifications"
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-semibold text-terra-600 hover:text-terra-800 transition-colors py-1"
            >
              {t('cloche.voirToutes')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClocheNotification;
