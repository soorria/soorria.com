export type Awaited<P> = P extends PromiseLike<infer T> ? T : P

export type Props<C extends (...args: any[]) => any> = Parameters<C>[0]
