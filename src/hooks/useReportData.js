import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function last3Months() {
  const now = new Date()
  return Array.from({ length: 3 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (2 - i), 1)
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    }
  })
}

export function useReportData() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const months = last3Months()
    const from = `${months[0].key}-01`
    const [ly, lm] = months[2].key.split('-')
    const lastDay = new Date(Number(ly), Number(lm), 0).getDate()
    const to = `${months[2].key}-${String(lastDay).padStart(2, '0')}`

    setLoading(true)
    supabase
      .from('transactions')
      .select('type, amount, category, date')
      .eq('user_id', user.id)
      .gte('date', from)
      .lte('date', to)
      .then(({ data: rows }) => {
        const byCategory = { income: {}, expense: {} }
        const totals = { income: {}, expense: {}, balance: {} }

        ;(rows ?? []).forEach(r => {
          const mk = r.date.substring(0, 7)
          const cat = r.category || 'Sans catégorie'
          if (!byCategory[r.type][cat]) byCategory[r.type][cat] = {}
          byCategory[r.type][cat][mk] = (byCategory[r.type][cat][mk] ?? 0) + Number(r.amount)
          totals[r.type][mk] = (totals[r.type][mk] ?? 0) + Number(r.amount)
        })

        months.forEach(({ key }) => {
          totals.balance[key] = (totals.income[key] ?? 0) - (totals.expense[key] ?? 0)
        })

        setData({ months, byCategory, totals })
        setLoading(false)
      })
  }, [user])

  return { data, loading }
}
