const cx = (...classes: (string | boolean | null | undefined)[]): string =>
  classes.filter(c => typeof c === 'string').join(' ')

export default cx
