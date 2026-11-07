import type { Category, Transaction } from '../types'
import TransactionItem from './TransactionItem'
import { findCategory } from '../utils/categories'
import { formatDateLabel } from '../utils/date'
import { formatTWD } from '../utils/currency'

interface Props {
  transactions: Transaction[]
  categories: Category[]
  onSelect: (tx: Transaction) => void
}

export default function TransactionList({ transactions, categories, onSelect }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-cocoa-300">
        <div className="text-5xl mb-2">🍮</div>
        <div className="font-bold">這個月還沒有記錄喔，點下面的按鈕開始記帳吧！</div>
      </div>
    )
  }

  const groups = new Map<string, Transaction[]>()
  for (const tx of transactions) {
    const arr = groups.get(tx.date) ?? []
    arr.push(tx)
    groups.set(tx.date, arr)
  }

  return (
    <div className="space-y-5">
      {[...groups.entries()].map(([date, txs]) => {
        const dayTotal = txs.reduce((s, t) => s + t.amountTWD, 0)
        return (
          <div key={date}>
            <div className="flex items-center justify-between px-1 mb-2">
              <div className="text-sm font-black text-cocoa-500">{formatDateLabel(date)}</div>
              <div className="text-sm font-bold text-cocoa-400">{formatTWD(dayTotal)}</div>
            </div>
            <div className="space-y-2">
              {txs.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  tx={tx}
                  category={findCategory(categories, tx.categoryId)}
                  onClick={() => onSelect(tx)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
