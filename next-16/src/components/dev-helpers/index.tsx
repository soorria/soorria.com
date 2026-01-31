import { TailwindIndicator } from './TailwindIndicator'
import { OgImagePreview } from './og-preview'

export const DevHelpers = () => {
  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="fixed bottom-2 left-2 z-50 flex items-center justify-center font-mono text-drac-pink">
      <TailwindIndicator />
      <OgImagePreview />
    </div>
  )
}
