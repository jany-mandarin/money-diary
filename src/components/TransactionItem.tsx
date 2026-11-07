import type { Category, Transaction } from '../types'
import { formatForeign, formatTWD } from '../utils/currency'

interface Props {
  tx: Transaction
  category: Category
  onClick: () => void
}

export default function TransactionItem({ tx, category, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="btn-press w-full flex items-center gap-3 bg-white rounded-blob px-4 py-3 border-2 border-pudding-100 text-left"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
        style={{ backgroundColor: `${category.color}33` }}
      >
        {category.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-cocoa-700 truncate">{tx.item}</div>
        <div className="text-xs text-cocoa-400 truncate">
          {category.label}
          {tx.installment && ` · 第 ${tx.installment.current}/${tx.installment.total} 期`}
          {tx.method && ` · ${tx.method}`}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-black text-cocoa-700">{formatTWD(tx.amountTWD)}</div>
        {tx.foreign && <div className="text-xs text-cocoa-400">{formatForeign(tx.foreign.amount, tx.foreign.currency)}</div>}
      </div>
    </button>
  )
}
