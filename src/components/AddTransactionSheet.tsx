import { useState } from 'react'
import type { Category, NewTransaction, Transaction } from '../types'
import NumPad from './NumPad'
import CategoryPicker from './CategoryPicker'
import { COMMON_CURRENCIES } from '../utils/currency'
import { todayISO } from '../utils/date'

interface Props {
  categories: Category[]
  initial?: Transaction
  onSave: (tx: NewTransaction) => void
  onClose: () => void
  onDelete?: () => void
}

const METHODS = ['現金', '信用卡', 'Wise', 'PayPal', '其他']

function applyKey(str: string, key: string): string {
  if (key === 'back') return str.slice(0, -1)
  if (key === '.') return str.includes('.') ? str : str + '.'
  if (str === '0') return key
  if (str.replace('.', '').length >= 9) return str
  return str + key
}

export default function AddTransactionSheet({ categories, initial, onSave, onClose, onDelete }: Props) {
  const [date, setDate] = useState(initial?.date ?? todayISO())
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? 'other')
  const [item, setItem] = useState(initial?.item ?? '')
  const [mainAmountStr, setMainAmountStr] = useState(initial ? String(initial.amountTWD) : '0')
  const [useForeign, setUseForeign] = useState(Boolean(initial?.foreign))
  const [foreignCurrency, setForeignCurrency] = useState(initial?.foreign?.currency ?? 'USD')
  const [foreignAmountStr, setForeignAmountStr] = useState(
    initial?.foreign ? String(initial.foreign.amount) : '0'
  )
  const [activeField, setActiveField] = useState<'main' | 'foreign'>('main')
  const [method, setMethod] = useState<string | undefined>(initial?.method)
  const [useInstallment, setUseInstallment] = useState(Boolean(initial?.installment))
  const [installmentName, setInstallmentName] = useState(initial?.installment?.planName ?? '')
  const [installmentCurrent, setInstallmentCurrent] = useState(initial?.installment?.current ?? 1)
  const [installmentTotal, setInstallmentTotal] = useState(initial?.installment?.total ?? 3)
  const [note, setNote] = useState(initial?.note ?? '')

  function handleKey(key: string) {
    if (activeField === 'main') setMainAmountStr((s) => applyKey(s, key))
    else setForeignAmountStr((s) => applyKey(s, key))
  }

  function handleSave() {
    const amountTWD = parseFloat(mainAmountStr) || 0
    if (amountTWD <= 0) return
    const tx: NewTransaction = {
      date,
      categoryId,
      item: item.trim() || categories.find((c) => c.id === categoryId)?.label || '花費',
      amountTWD,
      foreign: useForeign ? { currency: foreignCurrency, amount: parseFloat(foreignAmountStr) || 0 } : null,
      method,
      note: note.trim() || undefined,
      installment: useInstallment
        ? { planName: installmentName.trim() || item.trim() || '分期項目', current: installmentCurrent, total: installmentTotal }
        : null
    }
    onSave(tx)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-cocoa-800/40 backdrop-blur-[1px]">
      <div className="w-full sm:max-w-md bg-cream-50 rounded-t-blob sm:rounded-blob max-h-[92vh] overflow-y-auto safe-bottom shadow-2xl">
        <div className="sticky top-0 bg-cream-50 px-5 pt-4 pb-2 flex items-center justify-between border-b border-pudding-200">
          <button onClick={onClose} className="text-cocoa-400 font-bold px-2">
            取消
          </button>
          <div className="text-cocoa-700 font-black">{initial ? '編輯花費' : '記一筆 🍮'}</div>
          <button onClick={handleSave} className="text-pudding-700 font-black px-2">
            儲存
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Amount display */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setActiveField('main')}
              className={`w-full text-center rounded-blob py-4 border-2 transition-colors ${
                activeField === 'main' ? 'border-pudding-500 bg-pudding-100' : 'border-pudding-200 bg-white'
              }`}
            >
              <div className="text-xs text-cocoa-400 font-bold mb-1">
                {useForeign ? '台幣實付金額 NT$' : '金額 NT$'}
              </div>
              <div className="text-4xl font-black text-cocoa-700">{mainAmountStr || '0'}</div>
            </button>

            {useForeign && (
              <button
                type="button"
                onClick={() => setActiveField('foreign')}
                className={`w-full text-center rounded-blob py-3 border-2 transition-colors ${
                  activeField === 'foreign' ? 'border-pudding-500 bg-pudding-100' : 'border-pudding-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-xs text-cocoa-400 font-bold mb-1">
                  <span>原幣金額</span>
                  <select
                    value={foreignCurrency}
                    onChange={(e) => {
                      e.stopPropagation()
                      setForeignCurrency(e.target.value)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-pudding-100 rounded-full px-2 py-0.5 text-cocoa-600"
                  >
                    {COMMON_CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-2xl font-black text-cocoa-700">{foreignAmountStr || '0'}</div>
              </button>
            )}

            <label className="flex items-center gap-2 text-sm text-cocoa-500 font-bold px-1">
              <input
                type="checkbox"
                checked={useForeign}
                onChange={(e) => {
                  setUseForeign(e.target.checked)
                  setActiveField('main')
                }}
                className="accent-pudding-500 w-4 h-4"
              />
              這筆是用外幣刷的（Wise / PayPal 等）
            </label>
          </div>

          <NumPad onKey={handleKey} />

          {/* Date & item */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-cocoa-400 font-bold mb-1">日期</div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-full border-2 border-pudding-200 bg-white px-3 py-2 text-cocoa-700 font-bold"
              />
            </div>
            <div>
              <div className="text-xs text-cocoa-400 font-bold mb-1">品項</div>
              <input
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="例如：晚餐"
                className="w-full rounded-full border-2 border-pudding-200 bg-white px-3 py-2 text-cocoa-700 font-bold"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <div className="text-xs text-cocoa-400 font-bold mb-1">分類</div>
            <CategoryPicker categories={categories} value={categoryId} onChange={setCategoryId} />
          </div>

          {/* Method */}
          <div>
            <div className="text-xs text-cocoa-400 font-bold mb-1">付款方式（選填）</div>
            <div className="flex flex-wrap gap-2">
              {METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(method === m ? undefined : m)}
                  className={`btn-press px-3 py-1.5 rounded-full border-2 text-sm font-bold ${
                    method === m ? 'bg-cocoa-500 text-white border-cocoa-500' : 'bg-white text-cocoa-500 border-pudding-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Installment */}
          <div className="rounded-blob border-2 border-pudding-200 bg-white p-3">
            <label className="flex items-center gap-2 text-sm text-cocoa-600 font-bold mb-2">
              <input
                type="checkbox"
                checked={useInstallment}
                onChange={(e) => setUseInstallment(e.target.checked)}
                className="accent-pudding-500 w-4 h-4"
              />
              這是分期付款 💳
            </label>
            {useInstallment && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={installmentName}
                  onChange={(e) => setInstallmentName(e.target.value)}
                  placeholder="分期項目名稱（例如：瑜珈課程）"
                  className="w-full rounded-full border-2 border-pudding-200 px-3 py-1.5 text-cocoa-700 font-bold text-sm"
                />
                <div className="flex items-center gap-3 text-sm text-cocoa-500 font-bold">
                  <span>第</span>
                  <input
                    type="number"
                    min={1}
                    value={installmentCurrent}
                    onChange={(e) => setInstallmentCurrent(Number(e.target.value))}
                    className="w-16 rounded-full border-2 border-pudding-200 px-2 py-1 text-center"
                  />
                  <span>期 ／ 共</span>
                  <input
                    type="number"
                    min={1}
                    value={installmentTotal}
                    onChange={(e) => setInstallmentTotal(Number(e.target.value))}
                    className="w-16 rounded-full border-2 border-pudding-200 px-2 py-1 text-center"
                  />
                  <span>期</span>
                </div>
              </div>
            )}
          </div>

          {/* Note */}
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
            <button
              onClick={onDelete}
              className="w-full text-center text-red-400 font-bold py-2"
            >
              刪除這筆紀錄
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
