// const base = encodeURIComponent('https://mooth.tech')
const getOgUrl = (category: string, title?: string): string => {
  return `https://mooth.tech/api/og?category=${category}&title=${
    title ? encodeURIComponent(title) : ''
  }`
}

export default getOgUrl
