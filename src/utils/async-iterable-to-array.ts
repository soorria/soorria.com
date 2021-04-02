const asyncIterableToArray = async <T = any>(iter: AsyncIterable<T>): Promise<T[]> => {
  const result = []
  for await (const item of iter) {
    result.push(item)
  }
  return result
}

export default asyncIterableToArray
