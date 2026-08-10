import React from 'react';
import { INK_PRIMARY, INK_MUTED } from './chartTheme';

// Tooltip partagé pour tous les graphiques admin : fond blanc, ombre légère,
// puce de couleur par série (jamais le texte lui-même en couleur de série).
const ChartTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-cream-200 px-3 py-2 text-xs">
      {label !== undefined && (
        <p className="font-semibold mb-1" style={{ color: INK_PRIMARY }}>{label}</p>
      )}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color || entry.payload?.fill }}
          />
          <span style={{ color: INK_MUTED }}>{entry.name}</span>
          <span className="font-semibold ml-auto" style={{ color: INK_PRIMARY }}>
            {formatter ? formatter(entry.value, entry.name) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChartTooltip;
