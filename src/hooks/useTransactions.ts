import { useEffect, useMemo, useState } from 'react'
import type { NewTransaction, Transaction } from '../types'
import { db } from '../lib/firebase'
import { loadLocalTransactions, saveLocalTransactions } from '../lib/localStore'
import { subscribeTransactions, upsertTransaction, removeTransaction } from '../lib/cloudStore'

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function useTransactions(uid: string, isCloud: boolean) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (isCloud && db) {
      const unsub = subscribeTransactions(db, uid, (txs) => {
        setTransactions(txs)
        setLoading(false)
      })
      return unsub
    } else {
      setTransactions(loadLocalTransactions(uid))
      setLoading(false)
    }
  }, [uid, isCloud])

  async function addTransaction(tx: NewTransaction) {
    const full: Transaction = { ...tx, id: makeId(), createdAt: Date.now() }
    if (isCloud && db) {
      await upsertTransaction(db, uid, full)
    } else {
      const next = [full, ...transactions]
      setTransactions(next)
      saveLocalTransactions(uid, next)
    }
  }

  async function updateTransaction(id: string, patch: Partial<Transaction>) {
    const existing = transactions.find((t) => t.id === id)
    if (!existing) return
    const updated = { ...existing, ...patch }
    if (isCloud && db) {
      await upsertTransaction(db, uid, updated)
    } else {
      const next = transactions.map((t) => (t.id === id ? updated : t))
      setTransactions(next)
      saveLocalTransactions(uid, next)
    }
  }

  async function deleteTransaction(id: string) {
    if (isCloud && db) {
      await removeTransaction(db, uid, id)
    } else {
      const next = transactions.filter((t) => t.id !== id)
      setTransactions(next)
      saveLocalTransactions(uid, next)
    }
  }

  const sorted = useMemo(
    () => [...transactions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt - a.createdAt)),
    [transactions]
  )

  return { transactions: sorted, loading, addTransaction, updateTransaction, deleteTransaction }
}
