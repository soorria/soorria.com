// eslint-disable-next-line @typescript-eslint/ban-types
export type LooseAutocomplete<T extends string> = T | (string & {})
