export type PropsOf<C extends (...args: any[]) => any> = Parameters<C>[0]
