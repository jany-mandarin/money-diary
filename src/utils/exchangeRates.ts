import { COMMON_CURRENCIES } from './currency'

// 抓不到即時匯率時的備援參考值（1 單位外幣 = 多少台幣），數字不用很精準，
// 之後連上網路會自動被即時匯率覆蓋過去。
export const FALLBACK_RATES: Record<string, number> = {
  USD: 32.8,
  NZD: 18.2,
  EUR: 36.5,
  JPY: 0.21,
  GBP: 41.5,
  CNY: 4.5,
  HKD: 4.2,
  KRW: 0.022,
  AUD: 21.3
}

export async function fetchLiveRates(): Promise<Record<string, number>> {
  const res = await fetch('https://open.er-api.com/v6/latest/TWD')
  if (!res.ok) throw new Error('匯率 API 回應失敗')
  const data = (await res.json()) as { result: string; rates: Record<string, number> }
  if (data.result !== 'success') throw new Error('匯率 API 回傳錯誤')

  const twdPerUnit: Record<string, number> = {}
  for (const currency of COMMON_CURRENCIES) {
    const unitsPerTwd = data.rates[currency]
    if (unitsPerTwd) twdPerUnit[currency] = 1 / unitsPerTwd
  }
  return twdPerUnit
}

export function rateFor(rates: Record<string, number>, currency: string): number {
  if (currency === 'TWD') return 1
  return rates[currency] ?? FALLBACK_RATES[currency] ?? 0
}

export function toTWD(amount: number, currency: string, rates: Record<string, number>): number {
  return amount * rateFor(rates, currency)
}
