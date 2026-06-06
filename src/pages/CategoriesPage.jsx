import { useState } from 'react'
import { useCategories } from '../hooks/useCategories'

function schemaHint(msg) {
  if (msg && msg.toLowerCase().includes('categories') && msg.toLowerCase().includes('schema')) {
    return 'La table "categories" est introuvable dans Supabase. Exécutez le bloc "categories" dans supabase_schema.sql via votre éditeur SQL Supabase, puis rechargez la page.'
  }
  return msg
}

function CategorySection({ title, type, icon }) {
  const { categories, loading, error: fetchError, addCategory, updateCategory, deleteCategory, seedDefaults } = useCategories(type)
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const displayError = fetchError ? schemaHint(fetchError) : error

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
    try { await deleteCategory(id) } catch (err) { setError(err.message) }
  }

  const handleSeed = async () => {
    setSaving(true)
    try { await seedDefaults() } catch (err) { setError(err.message) }
    setSaving(false)
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">{icon} {title}</h2>
        <button
          onClick={handleSeed}
          disabled={saving}
          className="btn-secondary text-xs py-1 px-2"
          title="Charger les catégories par défaut"
        >
          Charger défauts
        </button>
      </div>

      {displayError && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{displayError}</p>
      )}

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {categories.length === 0 && (
            <li className="text-sm text-gray-400 dark:text-gray-500 italic">
              Aucune catégorie — cliquez sur "Charger défauts" ou ajoutez-en une.
            </li>
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
                  <button onClick={() => handleEdit(cat.id)} disabled={saving} className="btn-primary text-xs py-1.5 px-3">OK</button>
                  <button onClick={() => setEditId(null)} className="btn-secondary text-xs py-1.5 px-3">✕</button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {cat.name}
                  </span>
                  <button
                    onClick={() => { setEditId(cat.id); setEditName(cat.name) }}
                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                    title="Renommer"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
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

      <form onSubmit={handleAdd} className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Catégories</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Gérez vos catégories de revenus et de dépenses.
        </p>
      </div>
      <CategorySection title="Catégories de dépenses" type="expense" icon="📉" />
      <CategorySection title="Catégories de revenus" type="income" icon="📈" />
    </div>
  )
}
