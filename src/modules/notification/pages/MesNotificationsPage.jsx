import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaCheckDouble, FaTrash, FaBook, FaCreditCard, FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import Header from '../../Visiteur/components/Header';
import Footer from '../../Visiteur/components/Footer';
import CarteNotification from '../components/CarteNotification';
import { useNotificationContext } from '../contextes/NotificationContext';

const PAR_PAGE = 10;

const TYPE_CONFIG = {
  livre: { icon: <FaBook className="text-amber-600 text-xl" />, bg: 'bg-amber-100', label: 'Livre' },
  paiement: { icon: <FaCreditCard className="text-green-600 text-xl" />, bg: 'bg-green-100', label: 'Paiement' },
};

/* ── Modal détail ─────────────────────────────── */
const DetailModal = ({ notification, onClose }) => {
  if (!notification) return null;
  const config = TYPE_CONFIG[notification.type] || {
    icon: <FaBell className="text-amber-600 text-xl" />,
    bg: 'bg-amber-100',
    label: 'Notification',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
        >
          <FaTimes />
        </button>

        <div className="flex items-center gap-4 mb-5">
          <div className={`w-14 h-14 ${config.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
            {config.icon}
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">{config.label}</span>
            <h2 className="text-xl font-bold text-amber-900 leading-tight mt-0.5">{notification.titre}</h2>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed text-sm mb-5">{notification.message}</p>

        <p className="text-xs text-gray-400 mb-5">
          {format(new Date(notification.cree_le), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
        </p>

        <div className="flex gap-3">
          {notification.lien && (
            <Link
              to={notification.lien}
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition shadow-sm"
            >
              <FaExternalLinkAlt className="text-xs" />
              Voir le contenu
            </Link>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Modal confirmation suppression tout ─────── */
const ConfirmModal = ({ onConfirm, onCancel }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    onClick={onCancel}
  >
    <div
      className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <FaTrash className="text-red-500 text-xl" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Supprimer toutes les notifications ?</h3>
        <p className="text-sm text-gray-500">Cette action est irréversible.</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition shadow-sm"
        >
          Supprimer tout
        </button>
      </div>
    </div>
  </div>
);

/* ── Page principale ─────────────────────────── */
const MesNotificationsPage = () => {
  const {
    notifications,
    loading,
    marquerCommeLu,
    marquerToutLu,
    supprimerNotification,
    supprimerTout,
    getDetail,
  } = useNotificationContext();

  const [filtre, setFiltre] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const nonLuesCount = notifications.filter(n => !n.est_lu).length;

  const notificationsFiltrees = notifications.filter(n => {
    if (filtre === 'non_lues') return !n.est_lu;
    if (filtre === 'lues') return n.est_lu;
    return true;
  });

  const totalPages = Math.ceil(notificationsFiltrees.length / PAR_PAGE);
  const notifPage = notificationsFiltrees.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);

  const handleClickNotification = async (notif) => {
    setLoadingDetail(true);
    try {
      const detail = await getDetail(notif.id);
      setSelectedNotif(detail);
      if (!notif.est_lu) await marquerCommeLu(notif.id);
    } catch {
      setSelectedNotif(notif);
      if (!notif.est_lu) await marquerCommeLu(notif.id);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSupprimerTout = async () => {
    await supprimerTout();
    setShowConfirmDelete(false);
    toast.success('Toutes les notifications ont été supprimées');
  };

  const handleFiltreChange = (f) => {
    setFiltre(f);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <Header />
        <div className="flex justify-center items-center pt-40">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
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
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-amber-800 mb-3">
              Mes notifications
            </h1>
            {nonLuesCount > 0 ? (
              <p className="text-amber-500 font-medium">
                {nonLuesCount} non lue{nonLuesCount > 1 ? 's' : ''}
              </p>
            ) : (
              <p className="text-gray-400">Vous êtes à jour !</p>
            )}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-16 h-px bg-amber-300" />
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
              <div className="w-16 h-px bg-amber-300" />
            </div>
          </div>

          {/* Barre filtres + actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4 mb-6">
            <div className="flex flex-wrap justify-between items-center gap-3">
              {/* Filtres */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'all', label: 'Toutes', count: notifications.length },
                  { key: 'non_lues', label: 'Non lues', count: nonLuesCount },
                  { key: 'lues', label: 'Lues', count: notifications.length - nonLuesCount },
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => handleFiltreChange(key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      filtre === key
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      filtre === key ? 'bg-white/20 text-white' : 'bg-white text-gray-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {nonLuesCount > 0 && (
                  <button
                    onClick={marquerToutLu}
                    className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200 transition"
                  >
                    <FaCheckDouble className="text-xs" />
                    Tout marquer lu
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={() => setShowConfirmDelete(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                  >
                    <FaTrash className="text-xs" />
                    Tout supprimer
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Loader détail */}
          {loadingDetail && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Liste */}
          {notifPage.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-16 text-center">
              <FaBell className="text-amber-200 text-7xl mx-auto mb-4" />
              <h2 className="text-2xl font-playfair text-amber-700 mb-2">Aucune notification</h2>
              <p className="text-gray-400">
                {filtre === 'non_lues' ? 'Toutes vos notifications sont lues.' :
                 filtre === 'lues' ? 'Aucune notification lue pour le moment.' :
                 "Vous n'avez pas encore de notifications."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifPage.map((notif) => (
                <CarteNotification
                  key={notif.id}
                  notification={notif}
                  onMarquerLu={marquerCommeLu}
                  onSupprimer={supprimerNotification}
                  onClick={handleClickNotification}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg bg-white border border-amber-200 text-amber-600 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
                    page === p
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg bg-white border border-amber-200 text-amber-600 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Modal détail notification */}
      {selectedNotif && (
        <DetailModal notification={selectedNotif} onClose={() => setSelectedNotif(null)} />
      )}

      {/* Modal confirmation suppression */}
      {showConfirmDelete && (
        <ConfirmModal
          onConfirm={handleSupprimerTout}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}
    </div>
  );
};

export default MesNotificationsPage;
