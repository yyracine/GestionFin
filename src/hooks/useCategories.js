import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../lib/categories'

export function useCategories(type = null) {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    let query = supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name')
    if (type) query = query.eq('type', type)
    const { data } = await query
    setCategories(data ?? [])
    setLoading(false)
  }, [user, type])

  useEffect(() => { fetch() }, [fetch])

  const addCategory = async (name, catType) => {
    const { error } = await supabase
      .from('categories')
      .insert([{ name: name.trim(), type: catType, user_id: user.id }])
    if (error) throw error
    await fetch()
  }

  const updateCategory = async (id, name) => {
    const { error } = await supabase
      .from('categories')
      .update({ name: name.trim() })
      .eq('id', id)
      .eq('user_id', user.id)
    if (error) throw error
    await fetch()
  }

  const deleteCategory = async (id) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    if (error) throw error
    await fetch()
  }

  // Seed default categories if the user has none yet
  const seedDefaults = async () => {
    const rows = [
      ...EXPENSE_CATEGORIES.map(name => ({ name, type: 'expense', user_id: user.id })),
      ...INCOME_CATEGORIES.map(name => ({ name, type: 'income', user_id: user.id })),
    ]
    const { error } = await supabase.from('categories').upsert(rows, { onConflict: 'user_id,name,type' })
    if (error) throw error
    await fetch()
  }

  return { categories, loading, addCategory, updateCategory, deleteCategory, seedDefaults, refetch: fetch }
}
