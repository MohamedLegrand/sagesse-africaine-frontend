import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import ChartTooltip from './ChartTooltip';
import { GRID_COLOR, AXIS_COLOR, CATEGORICAL } from './chartTheme';

// Barres verticales à une série (mois, opérateur, devise…). Extrémités
// arrondies côté données, ancrées à la ligne de base ; grille discrète.
const BarVertical = ({ data, dataKey = 'value', labelKey = 'label', color, colors, valueFormatter, height = 220 }) => {
  const { t } = useTranslation('admin');
  if (!data || data.length === 0) {
    return <p className="text-center py-10 text-brown-300 text-sm">{t('commun.aucuneDonnee')}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
        <XAxis
          dataKey={labelKey}
          tick={{ fontSize: 11, fill: AXIS_COLOR }}
          axisLine={{ stroke: GRID_COLOR }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: AXIS_COLOR }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<ChartTooltip formatter={valueFormatter} />} cursor={{ fill: GRID_COLOR, opacity: 0.4 }} />
        <Bar dataKey={dataKey} radius={[4, 4, 0, 0]} maxBarSize={48}>
          {data.map((entry, i) => (
            <Cell key={i} fill={colors ? colors[i % colors.length] : (color || CATEGORICAL[0])} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarVertical;
