import type { ReactNode } from 'react'

export type Tab = 'home' | 'summary' | 'installments' | 'settings'

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'home', label: '紀錄', emoji: '📒' },
  { id: 'summary', label: '總覽', emoji: '🍩' },
  { id: 'installments', label: '分期', emoji: '💳' },
  { id: 'settings', label: '設定', emoji: '⚙️' }
]

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
  onAdd: () => void
  children: ReactNode
}

export default function Layout({ active, onChange, onAdd, children }: Props) {
  return (
    <div className="min-h-screen bg-cream-100 flex">
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex flex-col w-56 bg-white border-r-2 border-pudding-200 p-5 gap-2">
        <div className="flex items-center gap-2 mb-6 px-1">
          <span className="text-3xl">🍮</span>
          <span className="font-black text-cocoa-700 text-lg">布丁記帳</span>
        </div>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`btn-press flex items-center gap-3 rounded-blob px-4 py-3 font-bold text-left ${
              active === t.id ? 'bg-pudding-300 text-cocoa-700' : 'text-cocoa-400 hover:bg-cream-100'
            }`}
          >
            <span className="text-xl">{t.emoji}</span>
            {t.label}
          </button>
        ))}
        <button
          onClick={onAdd}
          className="btn-press mt-4 bg-cocoa-500 text-white font-black rounded-blob py-3 shadow-puff"
        >
          ＋ 記一筆
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="sm:hidden sticky top-0 z-30 bg-cream-100/90 backdrop-blur safe-top px-5 pt-4 pb-2 flex items-center gap-2">
          <span className="text-2xl">🍮</span>
          <span className="font-black text-cocoa-700 text-lg">布丁記帳</span>
        </header>

        <main className="flex-1 px-4 sm:px-8 py-4 sm:py-8 max-w-2xl w-full mx-auto pb-28 sm:pb-8">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t-2 border-pudding-200 safe-bottom">
          <div className="relative flex items-center justify-around px-2 py-2">
            {TABS.slice(0, 2).map((t) => (
              <TabButton key={t.id} tab={t} active={active === t.id} onClick={() => onChange(t.id)} />
            ))}
            <div className="w-16" />
            {TABS.slice(2).map((t) => (
              <TabButton key={t.id} tab={t} active={active === t.id} onClick={() => onChange(t.id)} />
            ))}
            <button
              onClick={onAdd}
              aria-label="記一筆"
              className="btn-press absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-full bg-pudding-500 text-white text-3xl font-black shadow-puff flex items-center justify-center border-4 border-cream-100"
            >
              ＋
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}

function TabButton({
  tab,
  active,
  onClick
}: {
  tab: { id: Tab; label: string; emoji: string }
  active: boolean
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-0.5 px-3 py-1 w-16">
      <span className={`text-xl ${active ? '' : 'opacity-50'}`}>{tab.emoji}</span>
      <span className={`text-[11px] font-bold ${active ? 'text-cocoa-700' : 'text-cocoa-300'}`}>{tab.label}</span>
    </button>
  )
}
