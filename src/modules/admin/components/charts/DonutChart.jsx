import React from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartTooltip from './ChartTooltip';
import { CATEGORICAL, INK_PRIMARY } from './chartTheme';

// Légende personnalisée : texte toujours en encre neutre, jamais dans la
// couleur de la série (la puce porte l'identité, pas le texte).
const renderLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3">
    {payload.map((entry, i) => (
      <div key={i} className="flex items-center gap-1.5 text-xs">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
        <span style={{ color: INK_PRIMARY }}>{entry.value}</span>
      </div>
    ))}
  </div>
);

const DonutChart = ({ data, colors = CATEGORICAL, valueFormatter, height = 240 }) => {
  const { t } = useTranslation('admin');
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return <p className="text-center py-10 text-brown-300 text-sm">{t('commun.aucuneDonnee')}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={2}
          strokeWidth={2}
          stroke="#ffffff"
        >
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip formatter={valueFormatter} />} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;
