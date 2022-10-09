import Image, { ImageProps } from 'next/future/image'

const MDXImage: React.FC<ImageProps> = props => {
  return (
    <div className="-mx-2 md:-mx-6">
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image {...props} />
    </div>
  )
}

export default MDXImage
