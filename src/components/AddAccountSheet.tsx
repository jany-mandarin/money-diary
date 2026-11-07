import { useState } from 'react'
import type { Account, AccountBalance, DepositCycle, NewAccount } from '../types'
import NumPad from './NumPad'
import { todayISO } from '../utils/date'
import { currencyMeta } from '../utils/currencyMeta'

interface Props {
  initial?: Account
  onSave: (acc: NewAccount) => void
  onClose: () => void
  onDelete?: () => void
}

const CURRENCY_OPTIONS = ['TWD', 'USD', 'NZD', 'EUR', 'JPY', 'GBP', 'CNY', 'HKD', 'KRW', 'AUD']

interface BalanceRow {
  currency: string
  amountStr: string
}

function applyKey(str: string, key: string): string {
  if (key === 'back') return str.slice(0, -1)
  if (key === '.') return str.includes('.') ? str : str + '.'
  if (str === '0') return key
  if (str.replace('.', '').length >= 9) return str
  return str + key
}

function toRows(balances: AccountBalance[] | undefined): BalanceRow[] {
  if (!balances || balances.length === 0) return [{ currency: 'TWD', amountStr: '0' }]
  return balances.map((b) => ({ currency: b.currency, amountStr: String(b.amount) }))
}

export default function AddAccountSheet({ initial, onSave, onClose, onDelete }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [rows, setRows] = useState<BalanceRow[]>(toRows(initial?.balances))
  const [activeRow, setActiveRow] = useState(0)
  const [updatedAt, setUpdatedAt] = useState(initial?.updatedAt ?? todayISO())
  const [isDeposit, setIsDeposit] = useState(Boolean(initial?.fixedDeposit))
  const [cycle, setCycle] = useState<DepositCycle>(initial?.fixedDeposit?.cycle ?? 'monthly')
  const [rate, setRate] = useState(initial?.fixedDeposit?.rate != null ? String(initial.fixedDeposit.rate) : '')
  const [maturityDate, setMaturityDate] = useState(initial?.fixedDeposit?.maturityDate ?? '')
  const [note, setNote] = useState(initial?.note ?? '')

  function handleKey(key: string) {
    setRows((rs) => rs.map((r, i) => (i === activeRow ? { ...r, amountStr: applyKey(r.amountStr, key) } : r)))
  }

  function addRow() {
    const unused = CURRENCY_OPTIONS.find((c) => !rows.some((r) => r.currency === c)) ?? 'USD'
    setRows((rs) => [...rs, { currency: unused, amountStr: '0' }])
    setActiveRow(rows.length)
  }

  function removeRow(i: number) {
    setRows((rs) => rs.filter((_, idx) => idx !== i))
    setActiveRow(0)
  }

  function handleSave() {
    if (!name.trim()) return
    const balances: AccountBalance[] = rows
      .filter((r) => r.currency)
      .map((r) => ({ currency: r.currency, amount: parseFloat(r.amountStr) || 0 }))
    const acc: NewAccount = {
      name: name.trim(),
      balances,
      updatedAt,
      note: note.trim() || undefined,
      fixedDeposit: isDeposit
        ? { cycle, rate: rate ? parseFloat(rate) : undefined, maturityDate: maturityDate || undefined }
        : null
    }
    onSave(acc)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-cocoa-800/40 backdrop-blur-[1px]">
      <div className="w-full sm:max-w-md bg-cream-50 rounded-t-blob sm:rounded-blob max-h-[92vh] overflow-y-auto safe-bottom shadow-2xl">
        <div className="sticky top-0 bg-cream-50 px-5 pt-4 pb-2 flex items-center justify-between border-b border-pudding-200">
          <button onClick={onClose} className="text-cocoa-400 font-bold px-2">
            取消
          </button>
          <div className="text-cocoa-700 font-black">{initial ? '編輯帳戶' : '新增帳戶 🏦'}</div>
          <button onClick={handleSave} className="text-pudding-700 font-black px-2">
            儲存
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <div className="text-xs text-cocoa-400 font-bold mb-1">帳戶 / 平台名稱</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：中國信託、Wise"
              className="w-full rounded-full border-2 border-pudding-200 bg-white px-4 py-2 text-cocoa-700 font-bold"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs text-cocoa-400 font-bold">餘額</div>
            {rows.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <select
                  value={row.currency}
                  onChange={(e) =>
                    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, currency: e.target.value } : r)))
                  }
                  className="rounded-full border-2 border-pudding-200 bg-white px-2 py-2 text-cocoa-700 font-bold"
                >
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {currencyMeta(c).emoji} {c}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setActiveRow(i)}
                  className={`flex-1 text-right rounded-full border-2 px-4 py-2 font-black text-lg ${
                    activeRow === i ? 'border-pudding-500 bg-pudding-100 text-cocoa-700' : 'border-pudding-200 bg-white text-cocoa-600'
                  }`}
                >
                  {row.amountStr || '0'}
                </button>
                {rows.length > 1 && (
                  <button onClick={() => removeRow(i)} className="text-cocoa-300 font-bold px-1">
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button onClick={addRow} className="text-sm font-bold text-pudding-600">
              ＋ 加一個幣別
            </button>
          </div>

          <NumPad onKey={handleKey} />

          <div>
            <div className="text-xs text-cocoa-400 font-bold mb-1">計算時間</div>
            <input
              type="date"
              value={updatedAt}
              onChange={(e) => setUpdatedAt(e.target.value)}
              className="w-full rounded-full border-2 border-pudding-200 bg-white px-3 py-2 text-cocoa-700 font-bold"
            />
          </div>

          <div className="rounded-blob border-2 border-pudding-200 bg-white p-3">
            <label className="flex items-center gap-2 text-sm text-cocoa-600 font-bold mb-2">
              <input
                type="checkbox"
                checked={isDeposit}
                onChange={(e) => setIsDeposit(e.target.checked)}
                className="accent-pudding-500 w-4 h-4"
              />
              這是定存 🔒
            </label>
            {isDeposit && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  {(['monthly', 'yearly'] as DepositCycle[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCycle(c)}
                      className={`flex-1 rounded-full border-2 py-1.5 text-sm font-bold ${
                        cycle === c ? 'bg-cocoa-500 text-white border-cocoa-500' : 'bg-white text-cocoa-500 border-pudding-200'
                      }`}
                    >
                      {c === 'monthly' ? '每月' : '每年'}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-sm text-cocoa-500 font-bold">
                  <span>年利率</span>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="選填"
                    className="w-20 rounded-full border-2 border-pudding-200 px-2 py-1 text-center"
                  />
                  <span>%</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-cocoa-500 font-bold">
                  <span>到期日</span>
                  <input
                    type="date"
                    value={maturityDate}
                    onChange={(e) => setMaturityDate(e.target.value)}
                    className="flex-1 rounded-full border-2 border-pudding-200 px-3 py-1"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="text-xs text-cocoa-400 font-bold mb-1">備註（選填）</div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-full border-2 border-pudding-200 bg-white px-3 py-2 text-cocoa-700"
            />
          </div>

          {initial && onDelete && (
            <button onClick={onDelete} className="w-full text-center text-red-400 font-bold py-2">
              刪除這個帳戶
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
