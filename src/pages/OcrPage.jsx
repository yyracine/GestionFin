import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OcrScanner from '../components/ocr/OcrScanner'
import TransactionForm from '../components/transactions/TransactionForm'
import { useTransactions } from '../hooks/useTransactions'

export default function OcrPage() {
  const navigate = useNavigate()
  const [prefill, setPrefill] = useState(null)
  const { addTransaction } = useTransactions()

  const handleExtract = ({ amount, label }) => {
    setPrefill({ amount, label })
  }

  const handleSave = async (form) => {
    await addTransaction(form)
    navigate('/transactions')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Scanner un reçu (OCR)</h1>
        <p className="text-gray-500 text-sm mt-1">
          Importez une photo de reçu pour extraire automatiquement le montant et le libellé.
        </p>
      </div>

      <OcrScanner onExtract={handleExtract} />

      {prefill && (
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">Créer la transaction</h2>
          <TransactionForm
            onSave={handleSave}
            onCancel={() => setPrefill(null)}
            initial={{
              type: 'expense',
              amount: prefill.amount || '',
              label: prefill.label || '',
              category: '',
              date: new Date().toISOString().split('T')[0],
            }}
          />
        </div>
      )}
    </div>
  )
}
