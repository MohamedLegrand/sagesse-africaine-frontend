import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaCheckDouble, FaTrash } from 'react-icons/fa';
import Header from '../../visiteur/components/Header';
import Footer from '../../visiteur/components/Footer';
import CarteNotification from '../components/CarteNotification';
import { NotificationProvider, useNotificationContext } from '../contextes/NotificationContext';

const MesNotificationsContent = () => {
  const { notifications, loading, marquerCommeLu, marquerToutLu, supprimerNotification } = useNotificationContext();
  const [filter, setFilter] = useState('all'); // all, non_lues, lues

  const notificationsFiltrees = notifications.filter(notif => {
    if (filter === 'non_lues') return !notif.est_lu;
    if (filter === 'lues') return notif.est_lu;
    return true;
  });

  const nonLuesCount = notifications.filter(n => !n.est_lu).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <Header />
        <div className="flex justify-center items-center pt-40">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-amber-800 mb-4">
              Mes notifications
            </h1>
            {nonLuesCount > 0 && (
              <p className="text-amber-500">{nonLuesCount} notification(s) non lue(s)</p>
            )}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-16 h-px bg-amber-300"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <div className="w-16 h-px bg-amber-300"></div>
            </div>
          </div>

          {/* Filtres et actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    filter === 'all' 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setFilter('non_lues')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    filter === 'non_lues' 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Non lues
                </button>
                <button
                  onClick={() => setFilter('lues')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    filter === 'lues' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Lues
                </button>
              </div>
              
              {nonLuesCount > 0 && (
                <button
                  onClick={marquerToutLu}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-medium hover:bg-amber-200 transition"
                >
                  <FaCheckDouble />
                  Tout marquer comme lu
                </button>
              )}
            </div>
          </div>

          {/* Liste des notifications */}
          {notificationsFiltrees.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <FaBell className="text-amber-300 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-playfair text-amber-700 mb-2">Aucune notification</h2>
              <p className="text-gray-500">Vous n'avez pas encore de notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notificationsFiltrees.map((notification) => (
                <CarteNotification
                  key={notification.id}
                  notification={notification}
                  onMarquerLu={marquerCommeLu}
                  onSupprimer={supprimerNotification}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const MesNotificationsPage = () => {
  return (
    <NotificationProvider>
      <MesNotificationsContent />
    </NotificationProvider>
  );
};

export default MesNotificationsPage;