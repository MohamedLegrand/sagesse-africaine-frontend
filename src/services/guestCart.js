const KEY = 'guest_cart';

const getItems = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

const save = (items) => {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cartUpdated'));
};

const addItem = (livre, quantite = 1) => {
  const items = getItems();
  const existing = items.find(i => i.livre_id === livre.id);
  if (existing) {
    existing.quantite += quantite;
  } else {
    items.push({
      id: `guest_${livre.id}`,
      livre_id: livre.id,
      livre: {
        id: livre.id,
        titre: livre.titre,
        auteur: livre.auteur,
        prix: livre.prix,
        couverture_url: livre.couverture_url,
        est_gratuit: livre.est_gratuit,
      },
      quantite,
      prix_unitaire: livre.prix || 0,
    });
  }
  save(items);
};

const removeItem = (livreId) => {
  save(getItems().filter(i => i.livre_id !== livreId));
};

const updateQuantite = (livreId, quantite) => {
  if (quantite < 1) { removeItem(livreId); return; }
  const items = getItems();
  const item = items.find(i => i.livre_id === livreId);
  if (item) { item.quantite = quantite; save(items); }
};

const clear = () => {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event('cartUpdated'));
};

const getCount = () => getItems().reduce((sum, i) => sum + i.quantite, 0);

const getTotal = () => getItems().reduce((sum, i) => sum + (i.prix_unitaire * i.quantite), 0);

export default { getItems, addItem, removeItem, updateQuantite, clear, getCount, getTotal };
