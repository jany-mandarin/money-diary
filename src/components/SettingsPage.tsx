import { useState } from 'react'
import type { Category } from '../types'
import { useAuth } from '../hooks/useAuth'

interface Props {
  categories: Category[]
  onUpdateCategories: (next: Category[]) => void
}

const PALETTE = ['#F2C14E', '#F2927B', '#8FBF8A', '#9AC7E0', '#B7A4DB', '#7FD1C1', '#D79BD0', '#A9713F', '#F2A65A', '#C99A64']

export default function SettingsPage({ categories, onUpdateCategories }: Props) {
  const { displayName, photoURL, isCloud, canSync, signInWithGoogle, signOutUser } = useAuth()
  const [newLabel, setNewLabel] = useState('')
  const [newEmoji, setNewEmoji] = useState('🍮')

  function addCategory() {
    const label = newLabel.trim()
    if (!label) return
    const id = `${label}-${Date.now().toString(36)}`
    const color = PALETTE[categories.length % PALETTE.length]
    onUpdateCategories([...categories, { id, label, emoji: newEmoji || '🍮', color }])
    setNewLabel('')
    setNewEmoji('🍮')
  }

  function removeCategory(id: string) {
    onUpdateCategories(categories.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-blob border-2 border-pudding-200 p-5 flex items-center gap-4">
        {photoURL ? (
          <img src={photoURL} alt="" className="w-14 h-14 rounded-full border-2 border-pudding-300" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-pudding-200 flex items-center justify-center text-2xl">🍮</div>
        )}
        <div className="flex-1">
          <div className="font-black text-cocoa-700">{displayName}</div>
          <div className="text-xs font-bold text-cocoa-400">
            {isCloud ? '✅ 已與 Google 帳號同步' : '📱 僅儲存在這台裝置'}
          </div>
        </div>
        {canSync && !isCloud && (
          <button
            onClick={() => signInWithGoogle().catch((e) => console.error(e))}
            className="btn-press text-xs font-bold bg-pudding-400 text-white px-3 py-2 rounded-full"
          >
            登入同步
          </button>
        )}
        {isCloud && (
          <button onClick={() => signOutUser()} className="btn-press text-xs font-bold text-cocoa-400 px-3 py-2">
            登出
          </button>
        )}
      </div>

      {!canSync && (
        <div className="bg-pudding-100 border-2 border-pudding-300 rounded-blob p-4 text-sm text-cocoa-600 font-bold">
          尚未設定 Google 同步。部署時請在 .env 填入 Firebase 專案設定，詳見 README。
        </div>
      )}

      <div>
        <div className="font-black text-cocoa-700 mb-2 px-1">管理分類</div>
        <div className="space-y-2 mb-3">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-3 bg-white rounded-blob border-2 border-pudding-100 px-4 py-2.5">
              <span className="text-xl">{c.emoji}</span>
              <span className="flex-1 font-bold text-cocoa-700">{c.label}</span>
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color }} />
              <button onClick={() => removeCategory(c.id)} className="text-cocoa-300 font-bold px-2">
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newEmoji}
            onChange={(e) => setNewEmoji(e.target.value.slice(0, 2))}
            className="w-14 text-center rounded-full border-2 border-pudding-200 bg-white py-2"
            placeholder="🍮"
          />
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            placeholder="新增分類名稱"
            className="flex-1 rounded-full border-2 border-pudding-200 bg-white px-4 py-2"
          />
          <button onClick={addCategory} className="btn-press bg-pudding-400 text-white font-bold px-4 rounded-full">
            新增
          </button>
        </div>
      </div>
    </div>
  )
}
