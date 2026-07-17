import type { ImageMetadata } from 'astro'
import type { ImgHTMLAttributes } from 'react'

export type CompatImageSource = string | ImageMetadata
export type CompatImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: CompatImageSource
  alt: string
  fill?: boolean
  placeholder?: string
}

const CompatImage = ({ src, fill, placeholder: _, style, alt, ...props }: CompatImageProps) => {
  const metadata = typeof src === 'string' ? undefined : src

  return (
    <img
      {...props}
      alt={alt}
      src={typeof src === 'string' ? src : src.src}
      width={props.width ?? metadata?.width}
      height={props.height ?? metadata?.height}
      style={
        fill ? { ...style, position: 'absolute', inset: 0, width: '100%', height: '100%' } : style
      }
    />
  )
}

export default CompatImage
