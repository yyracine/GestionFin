import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CATEGORY_COLORS } from '../../lib/categories'
import { useTheme } from '../../context/ThemeContext'

export default function CategoryPieChart({ data, loading }) {
  const { dark } = useTheme()

  if (loading) return <div className="card animate-pulse h-72" />

  if (!data.length) {
    return (
      <div className="card flex items-center justify-center h-72 text-gray-400 dark:text-gray-500 flex-col gap-2">
        <span className="text-3xl">🍩</span>
        <p className="text-sm">Aucune dépense ce mois-ci</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Dépenses par catégorie</h3>
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
            contentStyle={{
              backgroundColor: dark ? '#1f2937' : '#fff',
              border: `1px solid ${dark ? '#374151' : '#e5e7eb'}`,
              color: dark ? '#f3f4f6' : '#111827',
            }}
          />
          <Legend iconSize={10} iconType="circle" wrapperStyle={{ color: dark ? '#d1d5db' : '#374151' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
