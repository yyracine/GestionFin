function StatCard({ label, amount, color, icon }) {
  const formatted = new Intl.NumberFormat('fr-FR').format(Math.abs(amount))
  return (
    <div className={`card border-l-4 ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {formatted} <span className="text-base font-normal text-gray-500 dark:text-gray-400">FCFA</span>
      </p>
    </div>
  )
}

export default function BalanceSummary({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse h-24 dark:bg-gray-700" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label="Revenus" amount={stats.income} color="border-income" icon="📈" />
      <StatCard label="Dépenses" amount={stats.expense} color="border-expense" icon="📉" />
      <StatCard
        label="Solde"
        amount={stats.balance}
        color={stats.balance >= 0 ? 'border-income' : 'border-expense'}
        icon={stats.balance >= 0 ? '✅' : '⚠️'}
      />
    </div>
  )
}
