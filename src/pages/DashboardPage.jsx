import { useState } from 'react'
import BalanceSummary from '../components/dashboard/BalanceSummary'
import CategoryPieChart from '../components/dashboard/CategoryPieChart'
import MonthlyBarChart from '../components/dashboard/MonthlyBarChart'
import { useMonthlyStats, useCategoryStats, useMonthlyTrend } from '../hooks/useStats'

function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function DashboardPage() {
  const [month, setMonth] = useState(currentMonth())
  const { stats, loading: statsLoading } = useMonthlyStats(month)
  const { data: catData, loading: catLoading } = useCategoryStats(month)
  const { data: trendData, loading: trendLoading } = useMonthlyTrend()

  const monthLabel = new Date(month + '-01').toLocaleDateString('fr-FR', {
    month: 'long', year: 'numeric',
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 text-sm capitalize">{monthLabel}</p>
        </div>
        <input
          type="month"
          className="input w-auto"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      <BalanceSummary stats={stats} loading={statsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart data={catData} loading={catLoading} />
        <MonthlyBarChart data={trendData} loading={trendLoading} />
      </div>
    </div>
  )
}
