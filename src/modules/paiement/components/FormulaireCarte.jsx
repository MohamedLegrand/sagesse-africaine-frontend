import React, { useState } from 'react';
import { FaCreditCard, FaLock } from 'react-icons/fa';

const FormulaireCarte = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    nom: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Formatage numéro de carte
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      formattedValue = formattedValue.substring(0, 19);
    }
    
    // Formatage date d'expiration (MM/AA)
    if (name === 'expiry') {
      formattedValue = value.replace(/\//g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').substring(0, 5);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-amber-700 text-sm font-medium mb-2">
          Nom sur la carte
        </label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
          placeholder="Jean DUPONT"
        />
      </div>
      
      <div>
        <label className="block text-amber-700 text-sm font-medium mb-2">
          Numéro de carte
        </label>
        <div className="relative">
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            required
            maxLength="19"
            className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
            placeholder="1234 5678 9012 3456"
          />
          <FaCreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-amber-700 text-sm font-medium mb-2">
            Date d'expiration
          </label>
          <input
            type="text"
            name="expiry"
            value={formData.expiry}
            onChange={handleChange}
            required
            placeholder="MM/AA"
            className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
          />
        </div>
        <div>
          <label className="block text-amber-700 text-sm font-medium mb-2">
            CVV
          </label>
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            required
            maxLength="4"
            className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
            placeholder="123"
          />
        </div>
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
            <FaLock />
            Payer
          </>
        )}
      </button>
    </form>
  );
};

export default FormulaireCarte;