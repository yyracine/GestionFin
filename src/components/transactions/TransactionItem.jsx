export default function TransactionItem({ tx, onEdit, onDelete }) {
  const isIncome = tx.type === 'income'
  const formatted = new Intl.NumberFormat('fr-FR').format(tx.amount)
  const date = new Date(tx.date).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isIncome
            ? 'bg-income-light dark:bg-green-900/40'
            : 'bg-expense-light dark:bg-red-900/40'
        }`}>
          <span className="text-lg">{isIncome ? '↑' : '↓'}</span>
        </div>
        <div className="min-w-0">
          <p className="font-medium text-gray-900 dark:text-white truncate">{tx.label}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{tx.category} · {date}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 ml-4">
        <span className={`font-semibold whitespace-nowrap ${isIncome ? 'text-income' : 'text-expense'}`}>
          {isIncome ? '+' : '-'}{formatted} FCFA
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(tx)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
            title="Modifier"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(tx.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
