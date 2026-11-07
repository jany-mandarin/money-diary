import type { Category, Transaction } from '../types'
import { findCategory } from '../utils/categories'
import { formatTWD } from '../utils/currency'
import CategoryDonut from './CategoryDonut'
import MonthNav from './MonthNav'

interface Props {
  monthKey: string
  transactions: Transaction[]
  categories: Category[]
  onPrevMonth: () => void
  onNextMonth: () => void
}

export default function MonthSummary({ monthKey, transactions, categories, onPrevMonth, onNextMonth }: Props) {
  const total = transactions.reduce((s, t) => s + t.amountTWD, 0)

  const byCategory = new Map<string, number>()
  for (const t of transactions) {
    byCategory.set(t.categoryId, (byCategory.get(t.categoryId) ?? 0) + t.amountTWD)
  }
  const rows = [...byCategory.entries()]
    .map(([id, value]) => ({ category: findCategory(categories, id), value }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="space-y-4">
      <MonthNav monthKey={monthKey} onPrev={onPrevMonth} onNext={onNextMonth} />

      <div className="bg-white rounded-blob border-2 border-pudding-200 p-5 flex flex-col items-center gap-4">
        <CategoryDonut
          slices={rows.map((r) => ({ color: r.category.color, value: r.value }))}
          centerLabel={formatTWD(total)}
          centerSub="本月總支出"
        />
      </div>

      <div className="space-y-2">
        {rows.length === 0 && <div className="text-center text-cocoa-300 py-8">這個月還沒有花費紀錄</div>}
        {rows.map(({ category, value }) => {
          const pct = total > 0 ? Math.round((value / total) * 100) : 0
          return (
            <div key={category.id} className="bg-white rounded-blob border-2 border-pudding-100 px-4 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 font-bold text-cocoa-700">
                  <span>{category.emoji}</span>
                  <span>{category.label}</span>
                </div>
                <div className="font-black text-cocoa-700">{formatTWD(value)}</div>
              </div>
              <div className="h-2 rounded-full bg-cream-200 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: category.color }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
