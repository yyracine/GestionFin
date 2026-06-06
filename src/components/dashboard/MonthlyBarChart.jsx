import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function MonthlyBarChart({ data, loading }) {
  if (loading) return <div className="card animate-pulse h-72" />

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 mb-4">Revenus vs Dépenses (6 mois)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(v) => `${new Intl.NumberFormat('fr-FR').format(v)} FCFA`}
          />
          <Legend iconSize={10} />
          <Bar dataKey="income" name="Revenus" fill="#16a34a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Dépenses" fill="#dc2626" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
