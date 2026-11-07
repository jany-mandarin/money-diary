import { useEffect, useState } from 'react'
import type { ExchangeRates } from '../types'
import { db } from '../lib/firebase'
import { loadLocalRates, saveLocalRates } from '../lib/localStore'
import { subscribeRates, saveRates } from '../lib/cloudStore'
import { fetchLiveRates, FALLBACK_RATES } from '../utils/exchangeRates'

const STALE_MS = 1000 * 60 * 60 * 12 // 12 小時沒更新就自動在背景重抓一次

export function useExchangeRates(uid: string, isCloud: boolean) {
  const [data, setData] = useState<ExchangeRates | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    setLoaded(false)
    if (isCloud && db) {
      const unsub = subscribeRates(db, uid, (r) => {
        setData(r)
        setLoaded(true)
      })
      return unsub
    } else {
      setData(loadLocalRates(uid))
      setLoaded(true)
    }
  }, [uid, isCloud])

  async function persist(next: ExchangeRates) {
    setData(next)
    if (isCloud && db) await saveRates(db, uid, next)
    else saveLocalRates(uid, next)
  }

  async function refresh() {
    setFetching(true)
    setFetchError(null)
    try {
      const live = await fetchLiveRates()
      await persist({ rates: live, fetchedAt: new Date().toISOString(), isManual: false })
    } catch (e) {
      setFetchError('匯率抓取失敗，先用目前的數值')
      console.error(e)
    } finally {
      setFetching(false)
    }
  }

  async function setManualRate(currency: string, twdPerUnit: number) {
    const base = data?.rates ?? {}
    await persist({ rates: { ...base, [currency]: twdPerUnit }, fetchedAt: new Date().toISOString(), isManual: true })
  }

  useEffect(() => {
    if (!loaded) return
    const isStale = !data || (!data.isManual && (!data.fetchedAt || Date.now() - new Date(data.fetchedAt).getTime() > STALE_MS))
    if (isStale) refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, data])

  const rates = data?.rates ?? FALLBACK_RATES

  return {
    rates,
    fetchedAt: data?.fetchedAt ?? null,
    isManual: Boolean(data?.isManual),
    fetching,
    fetchError,
    refresh,
    setManualRate
  }
}
