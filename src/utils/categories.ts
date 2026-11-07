import type { Category } from '../types'

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', label: '食物', emoji: '🍚', color: '#F2C14E' },
  { id: 'medical', label: '醫療', emoji: '💊', color: '#F2927B' },
  { id: 'selfgrowth', label: '自我充實', emoji: '📚', color: '#8FBF8A' },
  { id: 'daily', label: '生活用品', emoji: '🧺', color: '#9AC7E0' },
  { id: 'subscription', label: '訂閱', emoji: '📱', color: '#B7A4DB' },
  { id: 'utility', label: '水電費', emoji: '💡', color: '#7FD1C1' },
  { id: 'rent', label: '房租', emoji: '🏠', color: '#D79BD0' },
  { id: 'transport', label: '交通', emoji: '🚗', color: '#A9713F' },
  { id: 'fun', label: '娛樂', emoji: '🎮', color: '#F2A65A' },
  { id: 'other', label: '其他', emoji: '🍮', color: '#C99A64' }
]

export function findCategory(categories: Category[], id: string): Category {
  return (
    categories.find((c) => c.id === id) ?? {
      id,
      label: id,
      emoji: '🍮',
      color: '#C99A64'
    }
  )
}
