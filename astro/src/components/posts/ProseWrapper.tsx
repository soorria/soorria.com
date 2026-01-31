type ProseWrapperProps = { children: React.ReactNode; initialStep?: string }

const ProseWrapper = ({ children, initialStep }: ProseWrapperProps) => {
  return (
    <div>
      <div>
        <div
          className="slide-in prose mx-auto mb-12 mt-6 md:prose-lg"
          style={{
            '--initial-step': initialStep ?? '0',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default ProseWrapper
