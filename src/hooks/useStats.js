import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useMonthlyStats(month) {
  const { user } = useAuth()
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !month) return
    const [year, m] = month.split('-')
    const from = `${year}-${m}-01`
    const lastDay = new Date(Number(year), Number(m), 0).getDate()
    const to = `${year}-${m}-${lastDay}`

    setLoading(true)
    supabase
      .from('transactions')
      .select('type, amount')
      .eq('user_id', user.id)
      .gte('date', from)
      .lte('date', to)
      .then(({ data }) => {
        const income = (data ?? [])
          .filter(t => t.type === 'income')
          .reduce((s, t) => s + Number(t.amount), 0)
        const expense = (data ?? [])
          .filter(t => t.type === 'expense')
          .reduce((s, t) => s + Number(t.amount), 0)
        setStats({ income, expense, balance: income - expense })
        setLoading(false)
      })
  }, [user, month])

  return { stats, loading }
}

export function useCategoryStats(month) {
  const { user } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !month) return
    const [year, m] = month.split('-')
    const from = `${year}-${m}-01`
    const lastDay = new Date(Number(year), Number(m), 0).getDate()
    const to = `${year}-${m}-${lastDay}`

    setLoading(true)
    supabase
      .from('transactions')
      .select('category, amount')
      .eq('user_id', user.id)
      .eq('type', 'expense')
      .gte('date', from)
      .lte('date', to)
      .then(({ data: rows }) => {
        const map = {}
        ;(rows ?? []).forEach(r => {
          map[r.category] = (map[r.category] ?? 0) + Number(r.amount)
        })
        setData(Object.entries(map).map(([name, value]) => ({ name, value })))
        setLoading(false)
      })
  }, [user, month])

  return { data, loading }
}

export function useMonthlyTrend() {
  const { user } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        year: d.getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0'),
        label: d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
      })
    }

    const from = `${months[0].year}-${months[0].month}-01`
    const last = months[months.length - 1]
    const lastDay = new Date(last.year, Number(last.month), 0).getDate()
    const to = `${last.year}-${last.month}-${lastDay}`

    setLoading(true)
    supabase
      .from('transactions')
      .select('type, amount, date')
      .eq('user_id', user.id)
      .gte('date', from)
      .lte('date', to)
      .then(({ data: rows }) => {
        const trend = months.map(({ year, month, label }) => {
          const prefix = `${year}-${month}`
          const filtered = (rows ?? []).filter(r => r.date.startsWith(prefix))
          const income = filtered.filter(r => r.type === 'income').reduce((s, r) => s + Number(r.amount), 0)
          const expense = filtered.filter(r => r.type === 'expense').reduce((s, r) => s + Number(r.amount), 0)
          return { label, income, expense }
        })
        setData(trend)
        setLoading(false)
      })
  }, [user])

  return { data, loading }
}
