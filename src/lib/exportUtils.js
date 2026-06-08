function fmtCurrency(v) {
  return typeof v === 'number'
    ? new Intl.NumberFormat('fr-FR').format(v) + ' FCFA'
    : (v ?? '')
}

function dl(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Build structured rows from aggregated report data
export function buildReportRows(data) {
  const { months, byCategory, totals } = data
  const rows = []

  rows.push({ type: 'section', cells: ['REVENUS', ...months.map(() => '')] })
  Object.keys(byCategory.income).sort().forEach(cat => {
    rows.push({ type: 'data', cells: [cat, ...months.map(m => byCategory.income[cat][m.key] ?? 0)] })
  })
  rows.push({ type: 'total-income', cells: ['Total Revenus', ...months.map(m => totals.income[m.key] ?? 0)] })

  rows.push({ type: 'section', cells: ['DÉPENSES', ...months.map(() => '')] })
  Object.keys(byCategory.expense).sort().forEach(cat => {
    rows.push({ type: 'data', cells: [cat, ...months.map(m => byCategory.expense[cat][m.key] ?? 0)] })
  })
  rows.push({ type: 'total-expense', cells: ['Total Dépenses', ...months.map(m => totals.expense[m.key] ?? 0)] })

  rows.push({ type: 'balance', cells: ['SOLDE', ...months.map(m => totals.balance[m.key] ?? 0)] })

  return rows
}

// ── CSV (transactions brutes) ─────────────────────────────────────────────────

export function downloadTransactionsCSV(transactions) {
  const headers = ['Date', 'Type', 'Catégorie', 'Description', 'Montant (FCFA)']
  const rows = transactions.map(t => [
    t.date,
    t.type === 'income' ? 'Revenu' : 'Dépense',
    t.category ?? '',
    t.description ?? '',
    Number(t.amount),
  ])
  const escape = v => typeof v === 'number' ? v : `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [headers, ...rows].map(r => r.map(escape).join(',')).join('\n')
  dl(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }), 'transactions_gestionfin.csv')
}

// ── JSON (transactions brutes) ────────────────────────────────────────────────

export function downloadTransactionsJSON(transactions) {
  const payload = transactions.map(({ id, user_id, created_at, ...rest }) => ({
    ...rest,
    amount: Number(rest.amount),
  }))
  dl(
    new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
    'transactions_gestionfin.json'
  )
}

// ── Excel (2 feuilles : rapport + transactions) ───────────────────────────────

export async function downloadExcel(reportData, transactions) {
  const { utils, writeFile } = await import('xlsx')

  // Feuille 1 : Rapport
  const { months } = reportData
  const reportRows = buildReportRows(reportData)
  const sheetReport = utils.aoa_to_sheet([
    ['Catégorie', ...months.map(m => m.label)],
    ...reportRows.map(r => r.cells),
  ])

  // Feuille 2 : Transactions
  const txRows = transactions.map(t => [
    t.date,
    t.type === 'income' ? 'Revenu' : 'Dépense',
    t.category ?? '',
    t.description ?? '',
    Number(t.amount),
  ])
  const sheetTx = utils.aoa_to_sheet([
    ['Date', 'Type', 'Catégorie', 'Description', 'Montant (FCFA)'],
    ...txRows,
  ])

  const wb = utils.book_new()
  utils.book_append_sheet(wb, sheetReport, 'Rapport')
  utils.book_append_sheet(wb, sheetTx, 'Transactions')
  writeFile(wb, 'gestionfin.xlsx')
}

// ── Google Sheets (copie TSV + ouverture sheets.new) ─────────────────────────

export async function exportGoogleSheets(transactions) {
  const headers = ['Date', 'Type', 'Catégorie', 'Description', 'Montant (FCFA)']
  const rows = transactions.map(t => [
    t.date,
    t.type === 'income' ? 'Revenu' : 'Dépense',
    t.category ?? '',
    t.description ?? '',
    Number(t.amount),
  ])
  const tsv = [headers, ...rows].map(r => r.join('\t')).join('\n')
  await navigator.clipboard.writeText(tsv)
  window.open('https://sheets.new', '_blank', 'noopener,noreferrer')
}

// ── PDF (rapport tableau) ─────────────────────────────────────────────────────

export async function downloadReportPDF(data) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])

  const { months } = data
  const rows = buildReportRows(data)
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  // En-tête
  doc.setFontSize(18)
  doc.setTextColor(13, 27, 62)
  doc.text('Rapport Financier — GestionFin', 14, 18)

  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)
  const period = `${months[0].label} → ${months[2].label}`
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} · ${period}`, 14, 25)

  const tableHead = [['Catégorie', ...months.map(m => m.label)]]
  const tableBody = rows.map(r =>
    r.cells.map((c, i) => (i > 0 && typeof c === 'number' ? fmtCurrency(c) : c ?? ''))
  )

  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: 31,
    styles: { fontSize: 9, cellPadding: 3, font: 'helvetica' },
    headStyles: { fillColor: [13, 27, 62], textColor: 255, fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 58 } },
    didParseCell({ row, cell }) {
      if (row.section !== 'body') return
      const type = rows[row.index]?.type
      if (type === 'section') {
        cell.styles.fillColor = [237, 242, 255]
        cell.styles.fontStyle = 'bold'
        cell.styles.textColor = [13, 27, 62]
      } else if (type === 'total-income') {
        cell.styles.fillColor = [220, 252, 231]
        cell.styles.fontStyle = 'bold'
        cell.styles.textColor = [22, 163, 74]
      } else if (type === 'total-expense') {
        cell.styles.fillColor = [254, 226, 226]
        cell.styles.fontStyle = 'bold'
        cell.styles.textColor = [220, 38, 38]
      } else if (type === 'balance') {
        cell.styles.fillColor = [201, 168, 76]
        cell.styles.textColor = [13, 27, 62]
        cell.styles.fontStyle = 'bold'
      }
    },
  })

  const month0 = months[0].key
  const month2 = months[2].key
  doc.save(`rapport_gestionfin_${month0}_${month2}.pdf`)
}
