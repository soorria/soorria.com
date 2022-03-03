export type Awaited<P> = P extends PromiseLike<infer T> ? T : P
