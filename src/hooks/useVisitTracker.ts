import { useEffect } from 'react'
import func2url from '../../backend/func2url.json'

function generateSessionId(): string {
  const key = 'lsk_session_id'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem(key, id)
  }
  return id
}

export function useVisitTracker() {
  useEffect(() => {
    const sessionId = generateSessionId()
    const startTime = Date.now()

    const sendVisit = (timeOnSite?: number) => {
      navigator.sendBeacon(
        func2url['track-visit'],
        JSON.stringify({
          session_id: sessionId,
          time_on_site: timeOnSite ?? Math.round((Date.now() - startTime) / 1000),
          referrer: document.referrer
        })
      )
    }

    sendVisit(undefined)

    const handleUnload = () => sendVisit()
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [])
}
