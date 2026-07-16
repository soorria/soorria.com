export const PageRenderedAt = ({ date }: { date?: Date }) => {
  date ||= new Date()
  return (
    <div className="absolute inset-x-0 bottom-0.5 text-center text-xs text-drac-pink">
      Rendered at {date.toLocaleTimeString()}, {date.toLocaleDateString()}
    </div>
  )
}
