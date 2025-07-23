
import { useState, useEffect } from 'react'

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isSlowConnection, setIsSlowConnection] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check connection speed
    const connection = (navigator as any).connection
    if (connection) {
      const updateConnectionSpeed = () => {
        setIsSlowConnection(connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
      }
      
      connection.addEventListener('change', updateConnectionSpeed)
      updateConnectionSpeed()
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, isSlowConnection }
}
