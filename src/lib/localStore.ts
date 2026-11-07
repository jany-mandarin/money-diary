import type { Account, Category, ExchangeRates, Transaction } from '../types'
import { DEFAULT_CATEGORIES } from '../utils/categories'

const txKey = (uid: string) => `pudding-ledger:${uid}:transactions`
const catKey = (uid: string) => `pudding-ledger:${uid}:categories`
const accountsKey = (uid: string) => `pudding-ledger:${uid}:accounts`
const ratesKey = (uid: string) => `pudding-ledger:${uid}:exchangeRates`

export function loadLocalTransactions(uid: string): Transaction[] {
  try {
    const raw = localStorage.getItem(txKey(uid))
    return raw ? (JSON.parse(raw) as Transaction[]) : []
  } catch {
    return []
  }
}

export function saveLocalTransactions(uid: string, txs: Transaction[]): void {
  localStorage.setItem(txKey(uid), JSON.stringify(txs))
}

export function loadLocalCategories(uid: string): Category[] {
  try {
    const raw = localStorage.getItem(catKey(uid))
    return raw ? (JSON.parse(raw) as Category[]) : DEFAULT_CATEGORIES
  } catch {
    return DEFAULT_CATEGORIES
  }
}

export function saveLocalCategories(uid: string, categories: Category[]): void {
  localStorage.setItem(catKey(uid), JSON.stringify(categories))
}

export function loadLocalAccounts(uid: string): Account[] {
  try {
    const raw = localStorage.getItem(accountsKey(uid))
    return raw ? (JSON.parse(raw) as Account[]) : []
  } catch {
    return []
  }
}

export function saveLocalAccounts(uid: string, accounts: Account[]): void {
  localStorage.setItem(accountsKey(uid), JSON.stringify(accounts))
}

export function loadLocalRates(uid: string): ExchangeRates | null {
  try {
    const raw = localStorage.getItem(ratesKey(uid))
    return raw ? (JSON.parse(raw) as ExchangeRates) : null
  } catch {
    return null
  }
}

export function saveLocalRates(uid: string, rates: ExchangeRates): void {
  localStorage.setItem(ratesKey(uid), JSON.stringify(rates))
}
