import { useState, useEffect } from 'react'
import { useCategories } from '../../hooks/useCategories'

const today = () => new Date().toISOString().split('T')[0]

const emptyForm = {
  type: 'expense',
  amount: '',
  label: '',
  category: '',
  date: today(),
}

export default function TransactionForm({ onSave, onCancel, initial = null }) {
  const [form, setForm] = useState(initial ?? emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { categories, loading: catLoading } = useCategories(form.type)

  useEffect(() => {
    if (initial) setForm(initial)
  }, [initial])

  const set = (field) => (e) => {
    const value = e.target.value
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'type') next.category = ''
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Le montant doit être supérieur à 0.')
      return
    }
    if (!form.category) {
      setError('Veuillez sélectionner une catégorie.')
      return
    }
    setLoading(true)
    try {
      await onSave({ ...form, amount: Number(form.amount) })
      if (!initial) setForm(emptyForm)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setForm(f => ({ ...f, type: 'income', category: '' }))}
          className={`py-2 rounded-lg font-medium border transition-colors ${
            form.type === 'income'
              ? 'bg-income text-white border-income'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
          }`}
        >
          Revenu
        </button>
        <button
          type="button"
          onClick={() => setForm(f => ({ ...f, type: 'expense', category: '' }))}
          className={`py-2 rounded-lg font-medium border transition-colors ${
            form.type === 'expense'
              ? 'bg-expense text-white border-expense'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
          }`}
        >
          Dépense
        </button>
      </div>

      <div>
        <label className="label">Montant (FCFA)</label>
        <input type="number" step="0.01" min="0.01" required className="input"
          value={form.amount} onChange={set('amount')} placeholder="0.00" />
      </div>

      <div>
        <label className="label">Libellé</label>
        <input type="text" required className="input" value={form.label}
          onChange={set('label')} placeholder="Description de la transaction" />
      </div>

      <div>
        <label className="label">
          Catégorie
          {catLoading && <span className="text-xs text-gray-400 ml-2">Chargement...</span>}
        </label>
        <select required className="input" value={form.category} onChange={set('category')}>
          <option value="">Sélectionner une catégorie</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
          {!catLoading && categories.length === 0 && (
            <option disabled>Aucune catégorie — ajoutez-en dans Catégories</option>
          )}
        </select>
      </div>

      <div>
        <label className="label">Date</label>
        <input type="date" required className="input" value={form.date} onChange={set('date')} />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Enregistrement...' : (initial ? 'Mettre à jour' : 'Ajouter')}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary flex-1">
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}
