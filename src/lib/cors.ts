export const addCorsHeaders = (res: Response): void => {
  res.headers.set('Access-Control-Allow-Origin', '*')
}
