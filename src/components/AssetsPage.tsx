import type { Account } from '../types'
import { formatTWD, formatForeign } from '../utils/currency'
import { toTWD } from '../utils/exchangeRates'
import { currencyMeta } from '../utils/currencyMeta'
import { formatDateLabel } from '../utils/date'

interface RatesInfo {
  rates: Record<string, number>
  fetchedAt: string | null
  isManual: boolean
  fetching: boolean
  fetchError: string | null
  refresh: () => void
}

interface Props {
  accounts: Account[]
  ratesInfo: RatesInfo
  onAdd: () => void
  onSelect: (account: Account) => void
}

function timeAgoLabel(iso: string | null): string {
  if (!iso) return '尚未抓取'
  const diffMin = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (diffMin < 1) return '剛剛更新'
  if (diffMin < 60) return `${diffMin} 分鐘前更新`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr} 小時前更新`
  return `${Math.round(diffHr / 24)} 天前更新`
}

export default function AssetsPage({ accounts, ratesInfo, onAdd, onSelect }: Props) {
  const { rates, fetchedAt, isManual, fetching, fetchError, refresh } = ratesInfo

  const currencyTotals = new Map<string, number>()
  for (const acc of accounts) {
    for (const b of acc.balances) {
      currencyTotals.set(b.currency, (currencyTotals.get(b.currency) ?? 0) + b.amount)
    }
  }
  const totalTWD = [...currencyTotals.entries()].reduce((s, [cur, amt]) => s + toTWD(amt, cur, rates), 0)
  const currencyRows = [...currencyTotals.entries()]
    .map(([currency, amount]) => ({ currency, amount, twd: toTWD(amount, currency, rates) }))
    .sort((a, b) => b.twd - a.twd)

  const generalAccounts = accounts.filter((a) => !a.fixedDeposit)
  const deposits = accounts.filter((a) => a.fixedDeposit)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between px-1">
        <div className="font-black text-cocoa-700 text-lg">💰 資產總覽</div>
        <button onClick={onAdd} className="btn-press bg-pudding-400 text-white font-bold text-sm px-4 py-2 rounded-full">
          ＋ 新增帳戶
        </button>
      </div>

      <div className="bg-white rounded-blob border-2 border-pudding-200 p-5 text-center space-y-1">
        <div className="text-xs text-cocoa-400 font-bold">依目前匯率換算的台幣總資產</div>
        <div className="text-4xl font-black text-cocoa-700">{formatTWD(totalTWD)}</div>
        <button
          onClick={refresh}
          disabled={fetching}
          className="btn-press mt-1 text-xs font-bold text-cocoa-400 bg-cream-100 px-3 py-1.5 rounded-full inline-flex items-center gap-1"
        >
          <span className={fetching ? 'animate-spin' : ''}>🔄</span>
          {fetching ? '匯率更新中…' : `${isManual ? '手動設定' : timeAgoLabel(fetchedAt)}`}
        </button>
        {fetchError && <div className="text-xs text-red-400 font-bold">{fetchError}</div>}
      </div>

      {currencyRows.length > 0 && (
        <div className="space-y-2">
          {currencyRows.map(({ currency, amount, twd }) => {
            const pct = totalTWD > 0 ? Math.round((twd / totalTWD) * 100) : 0
            const meta = currencyMeta(currency)
            return (
              <div key={currency} className="bg-white rounded-blob border-2 border-pudding-100 px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 font-bold text-cocoa-700">
                    <span>{meta.emoji}</span>
                    <span>{currency}</span>
                    <span className="text-cocoa-400 font-normal text-sm">{formatForeign(amount, '')}</span>
                  </div>
                  <div className="font-black text-cocoa-700">{formatTWD(twd)}</div>
                </div>
                <div className="h-2 rounded-full bg-cream-200 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: meta.color }} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AccountGroup title="帳戶" accounts={generalAccounts} onSelect={onSelect} rates={rates} />
      <AccountGroup title="定存 🔒" accounts={deposits} onSelect={onSelect} rates={rates} />

      {accounts.length === 0 && (
        <div className="text-center py-12 text-cocoa-300">
          <div className="text-5xl mb-2">🏦</div>
          <div className="font-bold">還沒有新增任何帳戶，點上面「＋ 新增帳戶」開始吧！</div>
        </div>
      )}
    </div>
  )
}

function AccountGroup({
  title,
  accounts,
  onSelect,
  rates
}: {
  title: string
  accounts: Account[]
  onSelect: (a: Account) => void
  rates: Record<string, number>
}) {
  if (accounts.length === 0) return null
  return (
    <div className="space-y-2">
      <div className="text-sm font-black text-cocoa-500 px-1">{title}</div>
      {accounts.map((acc) => {
        const totalTWD = acc.balances.reduce((s, b) => s + toTWD(b.amount, b.currency, rates), 0)
        return (
          <button
            key={acc.id}
            onClick={() => onSelect(acc)}
            className="btn-press w-full text-left bg-white rounded-blob border-2 border-pudding-100 px-4 py-3"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="font-bold text-cocoa-700">{acc.name}</div>
              <div className="font-black text-cocoa-700">{formatTWD(totalTWD)}</div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-1">
              {acc.balances.map((b, i) => (
                <span key={i} className="text-xs font-bold bg-cream-100 text-cocoa-500 px-2 py-0.5 rounded-full">
                  {currencyMeta(b.currency).emoji} {formatForeign(b.amount, b.currency)}
                </span>
              ))}
            </div>
            <div className="text-xs text-cocoa-400 font-bold">
              {acc.fixedDeposit && `${acc.fixedDeposit.cycle === 'monthly' ? '每月' : '每年'}定存${acc.fixedDeposit.rate ? ` · 年利率 ${acc.fixedDeposit.rate}%` : ''} · `}
              計算於 {formatDateLabel(acc.updatedAt)}
            </div>
          </button>
        )
      })}
    </div>
  )
}
