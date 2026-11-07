import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type Firestore
} from 'firebase/firestore'
import type { Category, Transaction } from '../types'
import { DEFAULT_CATEGORIES } from '../utils/categories'

export function subscribeTransactions(
  db: Firestore,
  uid: string,
  cb: (txs: Transaction[]) => void
): () => void {
  const q = query(collection(db, 'users', uid, 'transactions'), orderBy('date', 'desc'))
  return onSnapshot(q, (snap) => {
    const txs: Transaction[] = []
    snap.forEach((d) => txs.push(d.data() as Transaction))
    cb(txs)
  })
}

export async function upsertTransaction(db: Firestore, uid: string, tx: Transaction): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'transactions', tx.id), tx)
}

export async function removeTransaction(db: Firestore, uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'transactions', id))
}

export function subscribeCategories(
  db: Firestore,
  uid: string,
  cb: (categories: Category[]) => void
): () => void {
  return onSnapshot(doc(db, 'users', uid, 'settings', 'categories'), (snap) => {
    const data = snap.data() as { items?: Category[] } | undefined
    cb(data?.items?.length ? data.items : DEFAULT_CATEGORIES)
  })
}

export async function saveCategories(db: Firestore, uid: string, categories: Category[]): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'settings', 'categories'), { items: categories })
}
