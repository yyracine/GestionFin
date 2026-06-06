import { useState } from 'react'
import TransactionForm from '../components/transactions/TransactionForm'
import TransactionList from '../components/transactions/TransactionList'
import { useTransactions } from '../hooks/useTransactions'

function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function TransactionsPage() {
  const [month, setMonth] = useState(currentMonth())
  const [typeFilter, setTypeFilter] = useState('')
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction } = useTransactions({
    month,
    type: typeFilter || undefined,
  })

  const handleSave = async (form) => {
    if (editing) {
      await updateTransaction(editing.id, form)
      setEditing(null)
    } else {
      await addTransaction(form)
      setShowForm(false)
    }
  }

  const handleEdit = (tx) => {
    setEditing(tx)
    setShowForm(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette transaction ?')) await deleteTransaction(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <button className="btn-primary" onClick={() => { setShowForm(s => !s); setEditing(null) }}>
          {showForm ? '✕ Fermer' : '+ Nouvelle transaction'}
        </button>
      </div>

      {(showForm || editing) && (
        <div className="card">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {editing ? 'Modifier la transaction' : 'Nouvelle transaction'}
          </h2>
          <TransactionForm
            onSave={handleSave}
            onCancel={editing ? () => setEditing(null) : () => setShowForm(false)}
            initial={editing ? {
              type: editing.type,
              amount: editing.amount,
              label: editing.label,
              category: editing.category,
              date: editing.date,
            } : null}
          />
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap gap-3 items-center">
          <input
            type="month"
            className="input w-auto"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <select
            className="input w-auto"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Tous les types</option>
            <option value="income">Revenus</option>
            <option value="expense">Dépenses</option>
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-3">{error}</p>
        )}

        <TransactionList
          transactions={transactions}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
