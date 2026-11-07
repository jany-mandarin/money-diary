export interface Category {
  id: string
  label: string
  emoji: string
  color: string // tailwind color class suffix, e.g. 'pudding' | 'cocoa' | custom hex
}

export interface ForeignAmount {
  currency: string // e.g. USD, JPY
  amount: number
}

export interface InstallmentInfo {
  planName: string
  current: number
  total: number
}

export interface Transaction {
  id: string
  date: string // YYYY-MM-DD
  categoryId: string
  item: string
  amountTWD: number
  foreign?: ForeignAmount | null
  method?: string
  note?: string
  installment?: InstallmentInfo | null
  createdAt: number
}

export type NewTransaction = Omit<Transaction, 'id' | 'createdAt'>

export interface UserSettings {
  categories: Category[]
}
