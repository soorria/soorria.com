/** Matches `id="foo"` in a fenced code block's meta string. */
export function extractIdFromMeta(meta: string | null | undefined) {
  return meta?.match(/\bid="(?<id>[^"]+)"/)?.groups?.id
}

export function stripIdFromMeta(meta: string) {
  return meta
    .replace(/\bid="[^"]*"/, '')
    .replace(/\s+/g, ' ')
    .trim()
}
