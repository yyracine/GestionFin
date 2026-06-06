import TransactionItem from './TransactionItem'

export default function TransactionList({ transactions, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="divide-y divide-gray-100">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 animate-pulse flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        <p className="text-4xl mb-3">📋</p>
        <p className="font-medium">Aucune transaction</p>
        <p className="text-sm mt-1">Ajoutez votre première transaction ci-dessus.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {transactions.map(tx => (
        <TransactionItem key={tx.id} tx={tx} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
