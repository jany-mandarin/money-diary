import type { Category, Transaction } from '../types'
import { DEFAULT_CATEGORIES } from '../utils/categories'

const txKey = (uid: string) => `pudding-ledger:${uid}:transactions`
const catKey = (uid: string) => `pudding-ledger:${uid}:categories`

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
