import React from 'react';
import { FaBook, FaMoneyBillWave } from 'react-icons/fa';

const RecapitulatifPaiement = ({ panier, total }) => {
  const lignes = panier?.lignes || [];
  const nombreLivres = panier?.nombre_livres || 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
      <h3 className="text-xl font-playfair font-bold text-amber-800 mb-4">
        Récapitulatif
      </h3>
      
      <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
        {lignes.map((ligne) => (
          <div key={ligne.id} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <FaBook className="text-amber-500 text-sm" />
              <span className="text-gray-600 line-clamp-1">
                {ligne.livre?.titre} x{ligne.quantite}
              </span>
            </div>
            <span className="text-amber-700 font-medium">
              {(ligne.livre?.prix * ligne.quantite).toLocaleString()} FCFA
            </span>
          </div>
        ))}
      </div>
      
      <div className="border-t border-amber-100 pt-4 mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Sous-total</span>
          <span className="text-amber-700">{total?.toLocaleString()} FCFA</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Frais de livraison</span>
          <span className="text-green-600">Gratuit</span>
        </div>
      </div>
      
      <div className="border-t border-amber-200 pt-4">
        <div className="flex justify-between">
          <span className="text-lg font-bold text-amber-800">Total à payer</span>
          <span className="text-2xl font-bold text-amber-700">
            {total?.toLocaleString()} FCFA
          </span>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-amber-50 rounded-xl">
        <div className="flex items-center gap-2 text-sm text-amber-700">
          <FaMoneyBillWave />
          <span>Paiement 100% sécurisé</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Vos informations bancaires sont cryptées
        </p>
      </div>
    </div>
  );
};

export default RecapitulatifPaiement;