import { useState, useRef } from 'react'
import Tesseract from 'tesseract.js'

// Cherche le montant total en priorité via mots-clés, sinon propose tous les montants CFA détectés
function parseOcrResults(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  // 1. Chercher une ligne avec mot-clé total
  const totalKeywords = /\b(TOTAL|NET|MONTANT|À PAYER|A PAYER|SOUS.TOTAL|AMOUNT)\b/i
  let totalAmount = ''
  for (const line of lines) {
    if (totalKeywords.test(line)) {
      const nums = line.match(/\d[\d\s]*(?:[,.]\d+)?/g)
      if (nums) {
        const val = parseFloat(nums[nums.length - 1].replace(/\s/g, '').replace(',', '.'))
        if (!isNaN(val) && val > 0) { totalAmount = String(val); break }
      }
    }
  }

  // 2. Extraire tous les montants CFA trouvés (pour permettre à l'utilisateur de choisir)
  const cfaPattern = /(\d[\d\s]*(?:[,.]\d+)?)\s*(?:CFA|FCFA|XOF)/gi
  const seen = new Set()
  const allAmounts = []
  let m
  while ((m = cfaPattern.exec(text)) !== null) {
    const val = parseFloat(m[1].replace(/\s/g, '').replace(',', '.'))
    if (!isNaN(val) && val > 0 && !seen.has(val)) {
      seen.add(val)
      allAmounts.push(val)
    }
  }
  // Trier du plus grand au plus petit (le total est souvent le plus grand)
  allAmounts.sort((a, b) => b - a)

  // Si pas de mot-clé trouvé, prendre le plus grand montant
  if (!totalAmount && allAmounts.length > 0) {
    totalAmount = String(allAmounts[0])
  }

  // 3. Extraire un libellé significatif
  //    - Ignorer les en-têtes de tableau (T Qt Description PU IT, etc.)
  //    - Ignorer les lignes de type "X 1x ARTICLE PRIX CFA"
  const headerPattern = /^[A-Z]\s+[A-Za-z]{2}\s+[A-Za-z]+/
  const itemLinePattern = /^[A-Z]\s+\d+x?\s+/i
  const priceOnlyPattern = /^\d[\d\s,.]*(?:CFA|FCFA)?$/i

  let label = ''
  for (const line of lines) {
    if (line.length < 4) continue
    if (headerPattern.test(line) && /[A-Z]{2,}\s+[A-Z]{2,}/.test(line)) continue
    if (itemLinePattern.test(line)) continue
    if (priceOnlyPattern.test(line)) continue
    if (totalKeywords.test(line)) continue
    label = line
    break
  }
  // Fallback : extraire le nom du premier article
  if (!label) {
    for (const line of lines) {
      const articleMatch = line.match(/^[A-Z]\s+\d+x?\s+(.+?)\s+\d[\d\s]/)
      if (articleMatch) { label = articleMatch[1].trim(); break }
    }
  }

  return { totalAmount, allAmounts, label }
}

export default function OcrScanner({ onExtract }) {
  const [preview, setPreview] = useState(null)
  const [progress, setProgress] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const inputRef = useRef()

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image (JPG, PNG, etc.)')
      return
    }
    setError('')
    setResult(null)
    setProgress(0)
    setPreview(URL.createObjectURL(file))
    setScanning(true)

    Tesseract.recognize(file, 'fra', {
      logger: (m) => {
        if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100))
      },
    })
      .then(({ data: { text } }) => {
        const { totalAmount, allAmounts, label } = parseOcrResults(text)
        setResult({ text, amount: totalAmount, label, allAmounts })
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

  const handleUse = () => {
    if (result && onExtract) {
      onExtract({ amount: result.amount, label: result.label })
    }
  }

  return (
    <div className="space-y-6">
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <p className="text-4xl mb-3">📷</p>
        <p className="font-medium text-gray-700">Glissez une image de reçu ici</p>
        <p className="text-sm text-gray-500 mt-1">ou cliquez pour sélectionner un fichier</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
      )}

      {preview && (
        <div className="card">
          <img src={preview} alt="Reçu" className="max-h-64 mx-auto rounded-lg object-contain" />
        </div>
      )}

      {scanning && (
        <div className="card">
          <p className="text-sm text-gray-600 mb-2">Analyse en cours... {progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {result && !scanning && (
        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-800">Résultats extraits</h3>

          {/* Sélection du montant parmi les montants détectés */}
          {result.allAmounts.length > 0 && (
            <div>
              <label className="label">Montants détectés — cliquez pour sélectionner</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {result.allAmounts.slice(0, 10).map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setResult(r => ({ ...r, amount: String(amt) }))}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      result.amount === String(amt)
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                    }`}
                  >
                    {new Intl.NumberFormat('fr-FR').format(amt)} CFA
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Montant sélectionné</label>
              <input
                className="input"
                value={result.amount}
                onChange={(e) => setResult(r => ({ ...r, amount: e.target.value }))}
                placeholder="Montant"
              />
            </div>
            <div>
              <label className="label">Libellé détecté</label>
              <input
                className="input"
                value={result.label}
                onChange={(e) => setResult(r => ({ ...r, label: e.target.value }))}
                placeholder="Libellé"
              />
            </div>
          </div>

          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700">Texte brut extrait</summary>
            <pre className="mt-2 bg-gray-50 p-3 rounded-lg overflow-auto max-h-40 whitespace-pre-wrap">{result.text}</pre>
          </details>

          <button onClick={handleUse} className="btn-primary w-full">
            Utiliser ces données pour créer une transaction
          </button>
        </div>
      )}
    </div>
  )
}
