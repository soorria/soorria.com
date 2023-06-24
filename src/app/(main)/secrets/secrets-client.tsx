'use client'

import { useLocalStorage } from '~/utils/use-local-storage'

export const Settings: React.FC = () => {
  const [allowAnalytics, setAllowAnalytics] = useLocalStorage<'' | true>('plausible_ignore', '')

  return (
    <div className="mx-auto max-w-xs space-y-6">
      <div className="flex items-center justify-center space-x-2 text-lg">
        <input
          type="checkbox"
          id="allow-analytics"
          name="allow-analytics"
          className="block h-4 w-4"
          checked={!allowAnalytics}
          onChange={e => setAllowAnalytics(e.target.checked ? '' : true)}
        />
        <label htmlFor="allow-analytics" className="block">
          Allow analytics with plausible?
        </label>
      </div>
    </div>
  )
}
