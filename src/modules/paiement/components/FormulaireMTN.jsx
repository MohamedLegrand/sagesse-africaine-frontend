import React, { useState } from 'react';
import { FaMobileAlt, FaLock } from 'react-icons/fa';

const FormulaireMTN = ({ onSubmit, loading }) => {
  const [telephone, setTelephone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(telephone);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-amber-50 rounded-xl p-4 mb-4">
        <p className="text-amber-700 text-sm">
          Vous allez recevoir une notification sur votre téléphone MTN Mobile Money pour confirmer le paiement.
        </p>
      </div>
      
      <div>
        <label className="block text-amber-700 text-sm font-medium mb-2">
          Numéro MTN Mobile Money
        </label>
        <div className="relative">
          <FaMobileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            required
            pattern="[0-9]{9}"
            className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
            placeholder="6X XX XX XX"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Format: 6XXXXXXXX (9 chiffres)</p>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <FaMobileAlt />
            Payer avec MTN Mobile Money
          </>
        )}
      </button>
    </form>
  );
};

export default FormulaireMTN;