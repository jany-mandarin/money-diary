interface Slice {
  color: string
  value: number
}

interface Props {
  slices: Slice[]
  centerLabel: string
  centerSub: string
}

const SIZE = 180
const STROKE = 26
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function CategoryDonut({ slices, centerLabel, centerSub }: Props) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1
  let offset = 0

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="#FFF0C9" strokeWidth={STROKE} />
        {slices.map((s, i) => {
          const length = (s.value / total) * CIRCUMFERENCE
          const dasharray = `${length} ${CIRCUMFERENCE - length}`
          const dashoffset = -offset
          offset += length
          return (
            <circle
              key={i}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={s.color}
              strokeWidth={STROKE}
              strokeDasharray={dasharray}
              strokeDashoffset={dashoffset}
              strokeLinecap="butt"
            />
          )
        })}
      </svg>
      <div className="absolute flex flex-col items-center">
        <div className="text-xl font-black text-cocoa-700">{centerLabel}</div>
        <div className="text-xs text-cocoa-400 font-bold">{centerSub}</div>
      </div>
    </div>
  )
}
