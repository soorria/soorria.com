import { Deta, DetaInstance, DetaBase } from 'deta'

let deta: DetaInstance

export const getDeta = (): DetaInstance => {
  if (!deta) {
    deta = Deta(process.env.DETA_PROJECT_KEY)
  }
  return deta
}

export const getDetaDb = (name: string): DetaBase => {
  const deta = getDeta()
  return deta.Base(name)
}
