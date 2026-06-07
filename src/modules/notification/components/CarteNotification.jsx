import React from 'react';
import { FaCheck, FaTrash, FaEnvelope, FaShoppingCart, FaBook, FaUserCheck } from 'react-icons/fa';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const CarteNotification = ({ notification, onMarquerLu, onSupprimer }) => {
  const getIcone = (type) => {
    const icones = {
      'commande': <FaShoppingCart className="text-green-600" />,
      'livre': <FaBook className="text-blue-600" />,
      'auteur': <FaUserCheck className="text-purple-600" />,
      'default': <FaEnvelope className="text-amber-600" />
    };
    return icones[type] || icones.default;
  };

  const getBgColor = (estLu) => {
    return estLu ? 'bg-white' : 'bg-amber-50 border-l-4 border-l-amber-500';
  };

  return (
    <div className={`${getBgColor(notification.est_lu)} rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300`}>
      <div className="flex gap-4">
        {/* Icône */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            {getIcone(notification.type)}
          </div>
        </div>
        
        {/* Contenu */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-amber-800">{notification.titre}</h3>
              <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {format(new Date(notification.cree_le), 'dd MMMM yyyy à HH:mm', { locale: fr })}
              </p>
            </div>
            <div className="flex gap-2">
              {!notification.est_lu && (
                <button
                  onClick={() => onMarquerLu(notification.id)}
                  className="p-1.5 rounded-lg hover:bg-amber-100 transition"
                  title="Marquer comme lu"
                >
                  <FaCheck className="text-green-600 text-sm" />
                </button>
              )}
              <button
                onClick={() => onSupprimer(notification.id)}
                className="p-1.5 rounded-lg hover:bg-red-100 transition"
                title="Supprimer"
              >
                <FaTrash className="text-red-500 text-sm" />
              </button>
            </div>
          </div>
          
          {/* Lien action */}
          {notification.lien && (
            <a 
              href={notification.lien} 
              className="inline-block mt-2 text-amber-600 text-sm hover:text-amber-700 transition"
            >
              Voir les détails →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarteNotification;