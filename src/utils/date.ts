export function todayISO(): string {
  const d = new Date()
  return toISODate(d)
}

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function monthKeyOf(dateISO: string): string {
  return dateISO.slice(0, 7) // YYYY-MM
}

export function currentMonthKey(): string {
  return monthKeyOf(todayISO())
}

export function shiftMonth(monthKey: string, delta: number): string {
  const [y, m] = monthKey.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function formatMonthLabel(monthKey: string): string {
  const [y, m] = monthKey.split('-').map(Number)
  return `${y} 年 ${m} 月`
}

export function formatDateLabel(dateISO: string): string {
  const [, m, d] = dateISO.split('-').map(Number)
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][new Date(dateISO).getDay()]
  return `${m}/${d}（${weekday}）`
}
