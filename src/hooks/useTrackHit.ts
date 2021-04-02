import { useEffect } from 'react'

const useTrackHit = (category: string, slug: string): void => {
  useEffect(() => {
    fetch(`/api/hits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category, slug }),
    })
  }, [category, slug])
}

export default useTrackHit
