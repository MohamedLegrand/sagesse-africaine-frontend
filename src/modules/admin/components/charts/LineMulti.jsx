import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import ChartTooltip from './ChartTooltip';
import { GRID_COLOR, AXIS_COLOR, CATEGORICAL, INK_PRIMARY } from './chartTheme';

const renderLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 mt-3">
    {payload.map((entry, i) => (
      <div key={i} className="flex items-center gap-2 text-xs font-medium">
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
        <span style={{ color: INK_PRIMARY }}>{entry.value}</span>
      </div>
    ))}
  </div>
);

// Libellé direct uniquement sur le dernier point de chaque série (valeur du
// mois en cours) : jamais un chiffre sur chaque point, juste le repère utile.
const creerLabelDernierPoint = (couleur, dataLength) => (props) => {
  const { x, y, index, value } = props;
  if (index !== dataLength - 1) return null;
  return (
    <text x={x} y={y - 12} textAnchor="middle" fontSize={12} fontWeight={700} fill={couleur}>
      {value}
    </text>
  );
};

// Courbes multi-séries avec zone remplie (tendance visible d'un coup d'œil) et
// valeur affichée sur le dernier point (mois en cours). Traits épais et points
// larges pour une lecture facile ; légende toujours présente dès 2 séries.
const LineMulti = ({ data, series, labelKey = 'label', height = 280 }) => {
  const { t } = useTranslation('admin');
  if (!data || data.length === 0) {
    return <p className="text-center py-10 text-brown-300 text-sm">{t('commun.aucuneDonnee')}</p>;
  }

  const dataLength = data.length;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 24, right: 24, left: 0, bottom: 0 }}>
        <defs>
          {series.map((s, i) => (
            <linearGradient key={s.key} id={`degrade-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CATEGORICAL[i % CATEGORICAL.length]} stopOpacity={0.28} />
              <stop offset="100%" stopColor={CATEGORICAL[i % CATEGORICAL.length]} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
        <XAxis
          dataKey={labelKey}
          tick={{ fontSize: 12, fill: AXIS_COLOR, fontWeight: 500 }}
          axisLine={{ stroke: GRID_COLOR }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: AXIS_COLOR }}
          axisLine={false}
          tickLine={false}
          width={36}
          allowDecimals={false}
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend content={renderLegend} />
        {series.map((s, i) => {
          const couleur = CATEGORICAL[i % CATEGORICAL.length];
          return (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={couleur}
              strokeWidth={3}
              fill={`url(#degrade-${s.key})`}
              dot={{ r: 5, strokeWidth: 2, stroke: '#ffffff', fill: couleur }}
              activeDot={{ r: 6 }}
              label={creerLabelDernierPoint(couleur, dataLength)}
              isAnimationActive={false}
            />
          );
        })}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default LineMulti;
