import { useState } from 'react'
import { useCategories } from '../hooks/useCategories'

function CategorySection({ title, type, icon }) {
  const { categories, loading, addCategory, updateCategory, deleteCategory, seedDefaults } = useCategories(type)
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setError('')
    setSaving(true)
    try {
      await addCategory(newName, type)
      setNewName('')
    } catch (err) {
      setError(err.message.includes('unique') ? 'Cette catégorie existe déjà.' : err.message)
    }
    setSaving(false)
  }

  const handleEdit = async (id) => {
    if (!editName.trim()) return
    setError('')
    setSaving(true)
    try {
      await updateCategory(id, editName)
      setEditId(null)
      setEditName('')
    } catch (err) {
      setError(err.message)
    }
    setSaving(false)
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer la catégorie "${name}" ?`)) return
    try {
      await deleteCategory(id)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSeed = async () => {
    setSaving(true)
    try { await seedDefaults() } catch (err) { setError(err.message) }
    setSaving(false)
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 text-lg">{icon} {title}</h2>
        <button
          onClick={handleSeed}
          disabled={saving}
          className="btn-secondary text-xs py-1 px-2"
          title="Charger les catégories par défaut"
        >
          Charger défauts
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {categories.length === 0 && (
            <li className="text-sm text-gray-400 italic">Aucune catégorie — cliquez sur "Charger défauts" ou ajoutez-en une.</li>
          )}
          {categories.map(cat => (
            <li key={cat.id} className="flex items-center gap-2">
              {editId === cat.id ? (
                <>
                  <input
                    className="input flex-1 py-1.5 text-sm"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleEdit(cat.id)}
                    autoFocus
                  />
                  <button onClick={() => handleEdit(cat.id)} disabled={saving} className="btn-primary text-xs py-1.5 px-3">
                    OK
                  </button>
                  <button onClick={() => setEditId(null)} className="btn-secondary text-xs py-1.5 px-3">
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                    {cat.name}
                  </span>
                  <button
                    onClick={() => { setEditId(cat.id); setEditName(cat.name) }}
                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Renommer"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="flex gap-2 pt-2 border-t border-gray-100">
        <input
          className="input flex-1 text-sm"
          placeholder={`Nouvelle catégorie ${type === 'income' ? 'revenu' : 'dépense'}...`}
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button type="submit" disabled={saving || !newName.trim()} className="btn-primary text-sm px-4">
          + Ajouter
        </button>
      </form>
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
        <p className="text-gray-500 text-sm mt-1">
          Gérez vos catégories de revenus et de dépenses.
        </p>
      </div>
      <CategorySection title="Catégories de dépenses" type="expense" icon="📉" />
      <CategorySection title="Catégories de revenus" type="income" icon="📈" />
    </div>
  )
}
