export const getCurrentTimestamp = (): number => {
  return Math.floor(Date.now() / 1000)
}

export const getTimestampFromDate = (date: Date): number => {
  return Math.floor(date.getTime() / 1000)
}

export const formatTimeAgo = (timestamp: number): string => {
  const now = getCurrentTimestamp()
  const diff = now - timestamp
  
  if (diff < 60) return `${diff} seconds ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  return `${Math.floor(diff / 86400)} days ago`
}

export const isExpired = (timestamp: number, ttlSeconds: number): boolean => {
  const now = getCurrentTimestamp()
  return (now - timestamp) > ttlSeconds
} 