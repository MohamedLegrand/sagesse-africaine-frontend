import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ChartTooltip from './ChartTooltip';
import { CATEGORICAL, INK_PRIMARY } from './chartTheme';

// Barre empilée horizontale à 100% — forme par défaut pour un "part-to-whole"
// (préférée à un camembert/donut, jamais recommandé par le guide de choix de forme).
// Une seule ligne, segments arrondis aux deux extrémités, séparés par un liseré
// blanc de 2px ; légende directe avec pourcentages (jamais le texte en couleur
// de série).
const PartToWholeBar = ({ data, colors = CATEGORICAL, valueFormatter, height = 56 }) => {
  const { t } = useTranslation('admin');
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return <p className="text-center py-6 text-brown-300 text-sm">{t('commun.aucuneDonnee')}</p>;
  }

  const row = { name: 'total' };
  data.forEach((d) => { row[d.name] = d.value; });

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={[row]} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <XAxis type="number" hide domain={[0, total]} />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip content={<ChartTooltip formatter={valueFormatter} />} cursor={{ fill: 'transparent' }} />
          {data.map((d, i) => (
            <Bar
              key={d.name}
              dataKey={d.name}
              name={d.name}
              stackId="a"
              fill={colors[i % colors.length]}
              stroke="#ffffff"
              strokeWidth={2}
              radius={
                data.length === 1 ? [6, 6, 6, 6]
                  : i === 0 ? [6, 0, 0, 6]
                  : i === data.length - 1 ? [0, 6, 6, 0]
                  : [0, 0, 0, 0]
              }
              barSize={32}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
            <span style={{ color: INK_PRIMARY }}>{d.name}</span>
            <span className="font-semibold" style={{ color: INK_PRIMARY }}>
              {Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartToWholeBar;
