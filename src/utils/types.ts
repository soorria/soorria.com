export type PropsOf<C extends (...args: any[]) => any> = Parameters<C>[0]

export type StylingTypes = { className?: string; style?: React.CSSProperties }
