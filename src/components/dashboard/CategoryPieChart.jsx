import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CATEGORY_COLORS } from '../../lib/categories'

export default function CategoryPieChart({ data, loading }) {
  if (loading) return <div className="card animate-pulse h-72" />

  if (!data.length) {
    return (
      <div className="card flex items-center justify-center h-72 text-gray-400 flex-col gap-2">
        <span className="text-3xl">🍩</span>
        <p className="text-sm">Aucune dépense ce mois-ci</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 mb-4">Dépenses par catégorie</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v) => `${new Intl.NumberFormat('fr-FR').format(v)} FCFA`}
          />
          <Legend iconSize={10} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
