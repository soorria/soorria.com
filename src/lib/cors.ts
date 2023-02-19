export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
}

export const addCorsHeaders = (res: Response): void => {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.headers.set(key, value)
  })
}
