// USD / NZD / EUR 排最前面，符合常用外幣順序；其餘放後面備用
export const COMMON_CURRENCIES = ['USD', 'NZD', 'EUR', 'JPY', 'GBP', 'CNY', 'HKD', 'KRW', 'AUD'] as const

export function formatTWD(amount: number): string {
  return `NT$ ${Math.round(amount).toLocaleString('zh-TW')}`
}

export function formatForeign(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString('zh-TW', { maximumFractionDigits: 2 })}`
}
