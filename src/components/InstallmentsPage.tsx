import type { Transaction } from '../types'
import { formatTWD } from '../utils/currency'
import { formatDateLabel } from '../utils/date'

interface Props {
  transactions: Transaction[]
}

interface Plan {
  name: string
  current: number
  total: number
  monthlyAmount: number
  lastDate: string
  entries: number
}

export default function InstallmentsPage({ transactions }: Props) {
  const plans = new Map<string, Plan>()

  for (const t of transactions) {
    if (!t.installment) continue
    const { planName, current, total } = t.installment
    const existing = plans.get(planName)
    if (!existing || current > existing.current || (current === existing.current && t.date > existing.lastDate)) {
      plans.set(planName, {
        name: planName,
        current,
        total,
        monthlyAmount: t.amountTWD,
        lastDate: t.date,
        entries: (existing?.entries ?? 0) + 1
      })
    } else {
      existing.entries += 1
    }
  }

  const list = [...plans.values()].sort((a, b) => {
    const aDone = a.current >= a.total
    const bDone = b.current >= b.total
    if (aDone !== bDone) return aDone ? 1 : -1
    return a.lastDate < b.lastDate ? 1 : -1
  })

  if (list.length === 0) {
    return (
      <div className="text-center py-16 text-cocoa-300">
        <div className="text-5xl mb-2">💳</div>
        <div className="font-bold">目前沒有分期付款項目</div>
        <div className="text-sm mt-1">記帳時勾選「這是分期付款」就會出現在這裡</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {list.map((p) => {
        const remaining = Math.max(p.total - p.current, 0)
        const pct = Math.min(100, Math.round((p.current / p.total) * 100))
        const done = remaining === 0
        return (
          <div key={p.name} className="bg-white rounded-blob border-2 border-pudding-100 px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <div className="font-bold text-cocoa-700">{p.name}</div>
              <div className="text-sm font-black text-cocoa-500">{formatTWD(p.monthlyAmount)} / 期</div>
            </div>
            <div className="h-2.5 rounded-full bg-cream-200 overflow-hidden mb-2">
              <div
                className={`h-full rounded-full ${done ? 'bg-pudding-400' : 'bg-cocoa-400'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-cocoa-400">
              <span>
                已繳 {p.current} / {p.total} 期・最近 {formatDateLabel(p.lastDate)}
              </span>
              <span className={done ? 'text-pudding-600' : 'text-cocoa-500'}>
                {done ? '🎉 已繳清' : `還剩 ${remaining} 期`}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
