import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useTransactions(filters = {}) {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (filters.month) {
      const [year, month] = filters.month.split('-')
      const from = `${year}-${month}-01`
      const lastDay = new Date(Number(year), Number(month), 0).getDate()
      const to = `${year}-${month}-${lastDay}`
      query = query.gte('date', from).lte('date', to)
    }
    if (filters.type) {
      query = query.eq('type', filters.type)
    }

    const { data, error: err } = await query
    if (err) setError(err.message)
    else setTransactions(data ?? [])
    setLoading(false)
  }, [user, filters.month, filters.type])

  useEffect(() => { fetch() }, [fetch])

  const addTransaction = async (tx) => {
    const { error: err } = await supabase
      .from('transactions')
      .insert([{ ...tx, user_id: user.id }])
    if (err) throw err
    await fetch()
  }

  const updateTransaction = async (id, tx) => {
    const { error: err } = await supabase
      .from('transactions')
      .update(tx)
      .eq('id', id)
      .eq('user_id', user.id)
    if (err) throw err
    await fetch()
  }

  const deleteTransaction = async (id) => {
    const { error: err } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    if (err) throw err
    await fetch()
  }

  return { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction, refetch: fetch }
}
