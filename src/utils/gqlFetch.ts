const gqlFetch = async <T = Record<string, any>>(
  url: string,
  query: string,
  variables: Record<string, any> = {}
): Promise<T> => {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
  })
  const json = await response.json()
  return json.data as T
}

export default gqlFetch
