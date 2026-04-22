import { useEffect } from 'react'
import func2url from '../../backend/func2url.json'

const TRACK_URL = func2url['track-visit']

export function useVisitTracker() {
  useEffect(() => {
    const startTime = Date.now()

    fetch(TRACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referrer: document.referrer || '' }),
    }).catch(() => {})

    const sendTime = () => {
      const seconds = Math.round((Date.now() - startTime) / 1000)
      if (seconds < 2) return
      navigator.sendBeacon(
        TRACK_URL,
        JSON.stringify({ time_on_site: seconds })
      )
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') sendTime()
    }

    window.addEventListener('beforeunload', sendTime)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', sendTime)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])
}
