import { useEffect, useState } from 'react'
import type { Category } from '../types'
import { db } from '../lib/firebase'
import { loadLocalCategories, saveLocalCategories } from '../lib/localStore'
import { subscribeCategories, saveCategories } from '../lib/cloudStore'
import { DEFAULT_CATEGORIES } from '../utils/categories'

export function useCategories(uid: string, isCloud: boolean) {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)

  useEffect(() => {
    if (isCloud && db) {
      const unsub = subscribeCategories(db, uid, setCategories)
      return unsub
    } else {
      setCategories(loadLocalCategories(uid))
    }
  }, [uid, isCloud])

  async function updateCategories(next: Category[]) {
    setCategories(next)
    if (isCloud && db) {
      await saveCategories(db, uid, next)
    } else {
      saveLocalCategories(uid, next)
    }
  }

  return { categories, updateCategories }
}
