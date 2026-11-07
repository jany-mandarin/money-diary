// 不用國旗 emoji —— Windows 上國旗會變成英文字母縮寫，改用到處都能正常顯示的可愛圖示
export const CURRENCY_META: Record<string, { emoji: string; color: string }> = {
  TWD: { emoji: '🧋', color: '#F2C14E' },
  USD: { emoji: '💵', color: '#9AC7E0' },
  NZD: { emoji: '🥝', color: '#8FBF8A' },
  EUR: { emoji: '💶', color: '#B7A4DB' },
  JPY: { emoji: '🍣', color: '#F2927B' },
  GBP: { emoji: '💷', color: '#D79BD0' },
  CNY: { emoji: '🧧', color: '#F2A65A' },
  HKD: { emoji: '🥟', color: '#7FD1C1' },
  KRW: { emoji: '🍜', color: '#C99A64' },
  AUD: { emoji: '🦘', color: '#A9713F' }
}

export function currencyMeta(currency: string) {
  return CURRENCY_META[currency] ?? { emoji: '💱', color: '#C99A64' }
}
