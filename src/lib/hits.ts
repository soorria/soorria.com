import { Hit } from '@/types/hits'
import asyncIterableToArray from '@/utils/async-iterable-to-array'
import { DetaBase } from 'deta'
import { getDetaDb } from './deta'

export const getHitsDb = (): DetaBase =>
  getDetaDb(process.env.NODE_ENV === 'production' ? 'hits' : 'hits-dev')

export const getHits = async (category: string, slug: string): Promise<number> => {
  const db = getHitsDb()
  const response: any = await db.get(`${category}/${slug}`)
  const hits = response?.hits ?? 0
  return hits
}

export const getAllHits = async (): Promise<Record<string, Hit[]>> => {
  const db = getHitsDb()
  const records: Hit[] = (await asyncIterableToArray(await db.fetch())).flat() as any[]

  const result: Record<string, Hit[]> = {}
  records.forEach(record => {
    if (!result[record.category]) {
      result[record.category] = []
    }
    result[record.category].push(record)
  })

  return result
}

export const getHitsByCategory = async (category: string): Promise<Hit[]> => {
  const db = getHitsDb()
  const res = (await asyncIterableToArray(await db.fetch({ category }))).flat()
  return res as Hit[]
}

export const trackHit = async (category: string, slug: string): Promise<void> => {
  const db = getHitsDb()
  const key = `${category}/${slug}`
  try {
    await db.update({ hits: db.util.increment(1) }, key)
  } catch (err) {
    await db.insert({ hits: 1, category, slug }, key)
  }
}
