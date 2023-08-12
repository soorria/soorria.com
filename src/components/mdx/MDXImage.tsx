import Image, { type ImageProps } from 'next/image'
import { CODE_BLOCK_CLASSNAMES } from './utils'
import cx from '~/utils/cx'

const getSrcUrl = (srcProp: ImageProps['src']): string | null => {
  if (typeof srcProp === 'string') {
    return srcProp
  }
  if ('default' in srcProp) {
    srcProp = srcProp.default
  }
  if ('src' in srcProp && typeof srcProp.src === 'string') {
    return srcProp.src
  }
  return null
}

const getFilename = (src: string): string => {
  const parts = src.split('/').pop()?.split('.')
  if (!parts) return src
  return [parts[0], parts[parts.length - 1]].join('.')
}

const MDXImage: React.FC<ImageProps & { download?: boolean }> = ({ download, ...rest }) => {
  const srcUrl = getSrcUrl(rest.src)
  const filename = srcUrl ? getFilename(srcUrl) : ''
  return (
    <div className="relative -mx-2 md:-mx-6">
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image {...rest} />
      {download && srcUrl ? (
        <div className="not-prose absolute right-4 top-4 cursor-pointer">
          <a
            download={filename}
            className={cx('block', CODE_BLOCK_CLASSNAMES.button)}
            href={srcUrl}
            aria-label={`Download ${filename}`}
          >
            download
          </a>
        </div>
      ) : null}
    </div>
  )
}

export default MDXImage
