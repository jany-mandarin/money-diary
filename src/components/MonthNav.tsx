import { formatMonthLabel } from '../utils/date'

interface Props {
  monthKey: string
  onPrev: () => void
  onNext: () => void
}

export default function MonthNav({ monthKey, onPrev, onNext }: Props) {
  return (
    <div className="flex items-center justify-between px-1">
      <button onClick={onPrev} className="btn-press text-cocoa-500 text-xl px-3 py-1 rounded-full bg-white border-2 border-pudding-200">
        ‹
      </button>
      <div className="font-black text-cocoa-700 text-lg">{formatMonthLabel(monthKey)}</div>
      <button onClick={onNext} className="btn-press text-cocoa-500 text-xl px-3 py-1 rounded-full bg-white border-2 border-pudding-200">
        ›
      </button>
    </div>
  )
}
