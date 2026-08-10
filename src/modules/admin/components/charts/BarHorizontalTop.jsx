import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartTooltip from './ChartTooltip';
import { GRID_COLOR, AXIS_COLOR, SEQUENTIAL } from './chartTheme';

// Barres horizontales pour les classements ("Top 5…") : les libellés (titres de
// livres) sont longs et se lisent mieux sur l'axe Y qu'en abscisse.
const BarHorizontalTop = ({ data, dataKey = 'value', labelKey = 'label', valueFormatter, height = 240 }) => {
  const { t } = useTranslation('admin');
  if (!data || data.length === 0) {
    return <p className="text-center py-10 text-brown-300 text-sm">{t('commun.aucuneDonnee')}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 4, bottom: 4 }}
        barCategoryGap="25%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: AXIS_COLOR }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey={labelKey}
          tick={{ fontSize: 11, fill: AXIS_COLOR }}
          axisLine={false}
          tickLine={false}
          width={130}
          tickFormatter={(v) => (v.length > 22 ? `${v.slice(0, 22)}…` : v)}
        />
        <Tooltip content={<ChartTooltip formatter={valueFormatter} />} cursor={{ fill: GRID_COLOR, opacity: 0.4 }} />
        <Bar dataKey={dataKey} radius={[0, 4, 4, 0]} maxBarSize={22} fill={SEQUENTIAL[3]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarHorizontalTop;
