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

export interface AccountBalance {
  currency: string // 'TWD' | 'USD' | 'NZD' | 'EUR' | ...
  amount: number
}

export type DepositCycle = 'monthly' | 'yearly'

export interface FixedDepositInfo {
  cycle: DepositCycle
  rate?: number // 年利率 %，選填
  maturityDate?: string // YYYY-MM-DD，選填
}

export interface Account {
  id: string
  name: string // 帳戶 / 平台名稱，例如「中國信託」「Wise」
  balances: AccountBalance[]
  fixedDeposit?: FixedDepositInfo | null
  note?: string
  updatedAt: string // YYYY-MM-DD，對應「計算時間」
  createdAt: number
}

export type NewAccount = Omit<Account, 'id' | 'createdAt'>

export interface ExchangeRates {
  rates: Record<string, number> // 1 單位外幣 = 多少台幣
  fetchedAt: string // ISO timestamp
  isManual?: boolean
}
