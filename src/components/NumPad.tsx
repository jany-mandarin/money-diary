interface NumPadProps {
  onKey: (key: string) => void
}

const KEYS: { key: string; label: string; emoji?: string }[] = [
  { key: '1', label: '1' },
  { key: '2', label: '2' },
  { key: '3', label: '3' },
  { key: '4', label: '4' },
  { key: '5', label: '5' },
  { key: '6', label: '6' },
  { key: '7', label: '7' },
  { key: '8', label: '8' },
  { key: '9', label: '9' },
  { key: '.', label: '.' },
  { key: '0', label: '0' },
  { key: 'back', label: '⌫' }
]

function vibrate() {
  try {
    if (navigator.vibrate) navigator.vibrate(8)
  } catch {
    /* ignore */
  }
}

export default function NumPad({ onKey }: NumPadProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5 w-full select-none">
      {KEYS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => {
            vibrate()
            onKey(key)
          }}
          className={`btn-press rounded-blob text-xl font-bold py-4 shadow-puff-sm border-2 ${
            key === 'back'
              ? 'bg-pudding-200 border-pudding-400 text-cocoa-600'
              : 'bg-white border-pudding-300 text-cocoa-700'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
