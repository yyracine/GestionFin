import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OcrScanner from '../components/ocr/OcrScanner'
import { useTransactions } from '../hooks/useTransactions'

export default function OcrPage() {
  const navigate = useNavigate()
  const { addTransaction } = useTransactions()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const handleExtract = async (transactions) => {
    setSaveError('')
    setSaving(true)
    try {
      for (const tx of transactions) {
        await addTransaction(tx)
      }
      navigate('/transactions')
    } catch (err) {
      setSaveError('Erreur lors de la création : ' + err.message)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Scanner un reçu (OCR)</h1>
        <p className="text-gray-500 text-sm mt-1">
          Importez une photo de reçu, cochez les lignes qui vous intéressent, assignez une catégorie et créez les transactions en un clic.
        </p>
      </div>

      {saveError && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{saveError}</p>
      )}

      {saving && (
        <p className="text-sm text-primary-600 bg-primary-50 px-4 py-3 rounded-lg">
          Enregistrement en cours...
        </p>
      )}

      <OcrScanner onExtract={handleExtract} />
    </div>
  )
}
