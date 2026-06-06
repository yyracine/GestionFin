import { useState, useRef } from 'react'
import Tesseract from 'tesseract.js'
import { useCategories } from '../../hooks/useCategories'

function parseLines(text) {
  return text
    .split('\n')
    .map((raw, i) => ({ raw, i }))
    .filter(({ raw }) => raw.trim().length > 2)
    .map(({ raw, i }) => {
      const line = raw.trim()
      const cfaMatch = line.match(/(\d[\d\s]*(?:[,.]\d+)?)\s*(?:CFA|FCFA|XOF)/i)
      let amount = ''
      if (cfaMatch) {
        const val = parseFloat(cfaMatch[1].replace(/\s/g, '').replace(',', '.'))
        if (!isNaN(val) && val > 0) amount = String(val)
      }
      return {
        id: `row-${i}`,
        label: line,
        amount,
        type: 'expense',
        category: '',
        selected: amount !== '',
      }
    })
}

const today = () => new Date().toISOString().split('T')[0]

export default function OcrScanner({ onExtract }) {
  const [preview, setPreview] = useState(null)
  const [progress, setProgress] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [rawText, setRawText] = useState('')
  const [lines, setLines] = useState([])
  const [txDate, setTxDate] = useState(today())
  const [submitError, setSubmitError] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef()

  const { categories: allCategories } = useCategories()

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image (JPG, PNG, etc.)')
      return
    }
    setError('')
    setSubmitError('')
    setLines([])
    setRawText('')
    setProgress(0)
    setPreview(URL.createObjectURL(file))
    setScanning(true)

    Tesseract.recognize(file, 'fra', {
      logger: (m) => {
        if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100))
      },
    })
      .then(({ data: { text } }) => {
        setRawText(text)
        setLines(parseLines(text))
        setScanning(false)
      })
      .catch((err) => {
        setError('Erreur OCR : ' + err.message)
        setScanning(false)
      })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const toggleLine = (id) =>
    setLines(prev => prev.map(l => l.id === id ? { ...l, selected: !l.selected } : l))

  const updateLine = (id, field, value) =>
    setLines(prev => prev.map(l => {
      if (l.id !== id) return l
      const updated = { ...l, [field]: value }
      if (field === 'type') updated.category = ''
      return updated
    }))

  const toggleAll = () => {
    const allSelected = lines.every(l => l.selected)
    setLines(prev => prev.map(l => ({ ...l, selected: !allSelected })))
  }

  const selected = lines.filter(l => l.selected)

  const handleSubmit = () => {
    setSubmitError('')
    const invalid = selected.filter(l => !l.amount || Number(l.amount) <= 0 || !l.category)
    if (invalid.length > 0) {
      setSubmitError(`${invalid.length} ligne(s) sans montant ou sans catégorie. Complétez-les ou décochez-les.`)
      return
    }
    if (onExtract) {
      onExtract(selected.map(l => ({
        label: l.label,
        amount: Number(l.amount),
        type: l.type,
        category: l.category,
        date: txDate,
      })))
    }
  }

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-10 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 dark:hover:border-primary-500 dark:hover:bg-primary-900/20 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => handleFile(e.target.files[0])} />
        <p className="text-4xl mb-3">📷</p>
        <p className="font-medium text-gray-700 dark:text-gray-200">Glissez une image de reçu ici</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ou cliquez pour sélectionner un fichier</p>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg">{error}</p>}

      {preview && (
        <div className="card">
          <img src={preview} alt="Reçu" className="max-h-64 mx-auto rounded-lg object-contain" />
        </div>
      )}

      {scanning && (
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Analyse en cours... {progress}%</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {lines.length > 0 && !scanning && (
        <div className="card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Lignes extraites
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  {selected.length} / {lines.length} sélectionnée{selected.length > 1 ? 's' : ''}
                </span>
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Cochez les lignes pertinentes, renseignez montant et catégorie, puis créez les transactions.
              </p>
            </div>
            <div>
              <label className="label text-xs">Date</label>
              <input type="date" className="input py-1.5 text-sm" value={txDate}
                onChange={e => setTxDate(e.target.value)} />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-700">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-gray-50 dark:bg-gray-700/60">
                <tr className="text-left text-xs text-gray-500 dark:text-gray-400">
                  <th className="py-2 px-3 w-8">
                    <input type="checkbox"
                      checked={lines.length > 0 && lines.every(l => l.selected)}
                      onChange={toggleAll}
                      className="rounded border-gray-300 dark:border-gray-600 text-primary-600 cursor-pointer"
                    />
                  </th>
                  <th className="py-2 px-2">Libellé</th>
                  <th className="py-2 px-2 w-32">Montant (FCFA)</th>
                  <th className="py-2 px-2 w-28">Type</th>
                  <th className="py-2 px-2 w-44">Catégorie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {lines.map(line => (
                  <tr key={line.id} className={`transition-colors ${
                    line.selected ? 'bg-primary-50/60 dark:bg-primary-900/20' : 'opacity-40'
                  }`}>
                    <td className="py-2 px-3">
                      <input type="checkbox" checked={line.selected} onChange={() => toggleLine(line.id)}
                        className="rounded border-gray-300 dark:border-gray-600 text-primary-600 cursor-pointer"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        className="w-full text-xs bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-500 focus:border-primary-400 focus:outline-none py-0.5 text-gray-800 dark:text-gray-200 disabled:cursor-not-allowed"
                        value={line.label}
                        onChange={e => updateLine(line.id, 'label', e.target.value)}
                        disabled={!line.selected}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input type="number" min="0" step="1"
                        className="w-full text-xs bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-500 focus:border-primary-400 focus:outline-none py-0.5 text-gray-800 dark:text-gray-200 disabled:cursor-not-allowed"
                        value={line.amount}
                        onChange={e => updateLine(line.id, 'amount', e.target.value)}
                        disabled={!line.selected}
                        placeholder="—"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <select
                        className="text-xs bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded px-1.5 py-1 w-full focus:outline-none focus:border-primary-400 disabled:opacity-50"
                        value={line.type}
                        onChange={e => updateLine(line.id, 'type', e.target.value)}
                        disabled={!line.selected}
                      >
                        <option value="expense">Dépense</option>
                        <option value="income">Revenu</option>
                      </select>
                    </td>
                    <td className="py-2 px-2">
                      <select
                        className="text-xs bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded px-1.5 py-1 w-full focus:outline-none focus:border-primary-400 disabled:opacity-50"
                        value={line.category}
                        onChange={e => updateLine(line.id, 'category', e.target.value)}
                        disabled={!line.selected}
                      >
                        <option value="">— Catégorie —</option>
                        {allCategories.filter(c => c.type === line.type).map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <details className="text-xs text-gray-500 dark:text-gray-400">
            <summary className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">Texte brut extrait</summary>
            <pre className="mt-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg overflow-auto max-h-40 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {rawText}
            </pre>
          </details>

          {submitError && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{submitError}</p>
          )}

          <button onClick={handleSubmit} disabled={selected.length === 0} className="btn-primary w-full">
            Créer {selected.length} transaction{selected.length > 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  )
}
