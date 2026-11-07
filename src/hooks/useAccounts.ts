import { useEffect, useMemo, useState } from 'react'
import type { Account, NewAccount } from '../types'
import { db } from '../lib/firebase'
import { loadLocalAccounts, saveLocalAccounts } from '../lib/localStore'
import { subscribeAccounts, upsertAccount, removeAccount } from '../lib/cloudStore'

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function useAccounts(uid: string, isCloud: boolean) {
  const [accounts, setAccounts] = useState<Account[]>([])

  useEffect(() => {
    if (isCloud && db) {
      const unsub = subscribeAccounts(db, uid, setAccounts)
      return unsub
    } else {
      setAccounts(loadLocalAccounts(uid))
    }
  }, [uid, isCloud])

  async function addAccount(acc: NewAccount) {
    const full: Account = { ...acc, id: makeId(), createdAt: Date.now() }
    if (isCloud && db) {
      await upsertAccount(db, uid, full)
    } else {
      const next = [...accounts, full]
      setAccounts(next)
      saveLocalAccounts(uid, next)
    }
  }

  async function updateAccount(id: string, patch: Partial<Account>) {
    const existing = accounts.find((a) => a.id === id)
    if (!existing) return
    const updated = { ...existing, ...patch }
    if (isCloud && db) {
      await upsertAccount(db, uid, updated)
    } else {
      const next = accounts.map((a) => (a.id === id ? updated : a))
      setAccounts(next)
      saveLocalAccounts(uid, next)
    }
  }

  async function deleteAccount(id: string) {
    if (isCloud && db) {
      await removeAccount(db, uid, id)
    } else {
      const next = accounts.filter((a) => a.id !== id)
      setAccounts(next)
      saveLocalAccounts(uid, next)
    }
  }

  const sorted = useMemo(() => [...accounts].sort((a, b) => a.createdAt - b.createdAt), [accounts])

  return { accounts: sorted, addAccount, updateAccount, deleteAccount }
}
