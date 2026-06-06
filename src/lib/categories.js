export const EXPENSE_CATEGORIES = [
  'Alimentation',
  'Transport',
  'Loyer',
  'Santé',
  'Loisirs',
  'Vêtements',
  'Éducation',
  'Factures',
  'Autres',
]

export const INCOME_CATEGORIES = [
  'Salaire',
  'Freelance',
  'Investissements',
  'Remboursement',
  'Autres',
]

export const getCategoriesForType = (type) =>
  type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

export const CATEGORY_COLORS = [
  '#0ea5e9', '#f59e0b', '#10b981', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6b7280',
]
