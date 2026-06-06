import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTheme } from '../../context/ThemeContext'

export default function MonthlyBarChart({ data, loading }) {
  const { dark } = useTheme()

  if (loading) return <div className="card animate-pulse h-72" />

  const gridColor = dark ? '#374151' : '#f0f0f0'
  const tickColor = dark ? '#9ca3af' : '#6b7280'
  const tooltipStyle = {
    backgroundColor: dark ? '#1f2937' : '#fff',
    border: `1px solid ${dark ? '#374151' : '#e5e7eb'}`,
    color: dark ? '#f3f4f6' : '#111827',
  }

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Revenus vs Dépenses (6 mois)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: tickColor }} />
          <YAxis tick={{ fontSize: 12, fill: tickColor }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(v) => `${new Intl.NumberFormat('fr-FR').format(v)} FCFA`}
            contentStyle={tooltipStyle}
          />
          <Legend iconSize={10} wrapperStyle={{ color: dark ? '#d1d5db' : '#374151' }} />
          <Bar dataKey="income" name="Revenus" fill="#16a34a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Dépenses" fill="#dc2626" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
