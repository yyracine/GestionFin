import { useState } from 'react'
import { useReportData } from '../hooks/useReportData'
import { useTransactions } from '../hooks/useTransactions'
import {
  buildReportRows,
  downloadTransactionsCSV,
  downloadTransactionsJSON,
  downloadExcel,
  exportGoogleSheets,
  downloadReportPDF,
} from '../lib/exportUtils'

const fmt = v =>
  typeof v === 'number' ? new Intl.NumberFormat('fr-FR').format(v) + ' FCFA' : (v ?? '')

const ROW_STYLES = {
  section:       'bg-blue-50 dark:bg-navy-mid font-bold text-navy dark:text-white uppercase text-xs tracking-wide',
  'total-income':'bg-green-50 dark:bg-green-900/20 font-bold text-income',
  'total-expense':'bg-red-50 dark:bg-red-900/20 font-bold text-expense',
  balance:       'font-bold text-navy dark:text-navy-deep',
  data:          'hover:bg-gray-50 dark:hover:bg-navy-mid/30',
}

function ExportButton({ label, icon, onClick, loading, colorClass = 'btn-secondary' }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${colorClass} flex flex-col items-center gap-2 py-4 w-full`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-semibold">{loading ? 'Export…' : label}</span>
    </button>
  )
}

export default function ReportPage() {
  const { data, loading } = useReportData()
  const { transactions, loading: txLoading } = useTransactions()
  const [busy, setBusy] = useState(null)
  const [sheetsModal, setSheetsModal] = useState(false)

  const run = async (key, fn) => {
    setBusy(key)
    try {
      const result = await fn()
      if (key === 'sheets') setSheetsModal(true)
    } catch (e) {
      alert('Erreur lors de l\'export : ' + e.message)
    } finally {
      setBusy(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-400 dark:text-white/40">Chargement du rapport…</p>
      </div>
    )
  }

  if (!data) return null

  const rows = buildReportRows(data)
  const { months } = data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Rapport mensuel</h1>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">
            {months[0].label} → {months[2].label}
          </p>
        </div>
        <button
          onClick={() => run('pdf', () => downloadReportPDF(data))}
          disabled={busy === 'pdf'}
          className="btn-primary flex items-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {busy === 'pdf' ? 'Génération…' : 'Télécharger PDF'}
        </button>
      </div>

      {/* Rapport tableau */}
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-navy-light/30">
              <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-white/50 w-56">
                Catégorie
              </th>
              {months.map(m => (
                <th key={m.key}
                    className="text-right px-5 py-3 font-semibold text-gray-600 dark:text-white/50 capitalize">
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-navy-light/20">
            {rows.map((row, i) => {
              const isBalance = row.type === 'balance'
              return (
                <tr
                  key={i}
                  className={isBalance
                    ? undefined
                    : ROW_STYLES[row.type] + ' transition-colors'}
                  style={isBalance ? {
                    background: 'linear-gradient(135deg, #c9a84c 0%, #e8c96a 100%)',
                    color: '#0d1b3e',
                  } : undefined}
                >
                  {row.cells.map((cell, j) => (
                    <td
                      key={j}
                      className={`px-5 py-2.5 ${
                        j === 0
                          ? 'text-left'
                          : 'text-right tabular-nums'
                      } ${row.type === 'section' && j > 0 ? 'text-gray-400 dark:text-white/20' : ''}`}
                    >
                      {j === 0 ? cell : (typeof cell === 'number' ? fmt(cell) : cell)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Export données */}
      <div className="card">
        <div className="mb-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Exporter mes données</h2>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">
            {txLoading
              ? 'Chargement des transactions…'
              : `${transactions.length} transaction${transactions.length > 1 ? 's' : ''} · toutes périodes`}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ExportButton
            label="CSV"
            icon="📄"
            loading={busy === 'csv'}
            onClick={() => run('csv', () => downloadTransactionsCSV(transactions))}
          />
          <ExportButton
            label="JSON"
            icon="{ }"
            loading={busy === 'json'}
            onClick={() => run('json', () => downloadTransactionsJSON(transactions))}
          />
          <ExportButton
            label="Excel"
            icon="📊"
            loading={busy === 'excel'}
            onClick={() => run('excel', () => downloadExcel(data, transactions))}
          />
          <ExportButton
            label="Google Sheets"
            icon="🟢"
            loading={busy === 'sheets'}
            onClick={() => run('sheets', () => exportGoogleSheets(transactions))}
          />
        </div>

        <p className="mt-3 text-xs text-gray-400 dark:text-white/25">
          Excel inclut deux feuilles : le rapport agrégé et l'ensemble des transactions brutes.
        </p>
      </div>

      {/* Modal Google Sheets */}
      {sheetsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSheetsModal(false)}
        >
          <div
            className="card max-w-md w-full mx-4 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🟢</span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Import dans Google Sheets</h3>
                  <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">
                    Votre fichier CSV a été téléchargé et une nouvelle feuille s'est ouverte.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSheetsModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white/60 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <ol className="space-y-2 text-sm text-gray-700 dark:text-white/70">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">1</span>
                Dans Google Sheets, cliquez sur <strong className="mx-1 text-gray-900 dark:text-white">Fichier</strong>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">2</span>
                Cliquez sur <strong className="mx-1 text-gray-900 dark:text-white">Importer</strong>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">3</span>
                Onglet <strong className="mx-1 text-gray-900 dark:text-white">Importer</strong> → sélectionnez le fichier
                <code className="ml-1 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-navy-mid text-xs font-mono text-gray-700 dark:text-white/70">
                  transactions_gestionfin.csv
                </code>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">4</span>
                Choisissez <strong className="mx-1 text-gray-900 dark:text-white">Remplacer la feuille</strong> puis <strong className="text-gray-900 dark:text-white">Importer les données</strong>
              </li>
            </ol>

            <button
              onClick={() => setSheetsModal(false)}
              className="btn-primary w-full"
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
