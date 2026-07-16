import { array, literal, number, object, string, union, type InferOutput } from 'valibot'

export const SkillPositionSchema = object({
  x: number(),
  y: number(),
})
export type SkillPosition = InferOutput<typeof SkillPositionSchema>

export const ServerSkillItemSchema = object({
  id: string(),
  label: string(),
  position: SkillPositionSchema,
})
export type ServerSkillItem = InferOutput<typeof ServerSkillItemSchema>

export const ClientMessageSchema = union([
  object({
    type: literal('move-item'),
    itemId: string(),
    newPosition: SkillPositionSchema,
  }),
  object({
    type: literal('add-more'),
  }),
])
export type ClientMessage = InferOutput<typeof ClientMessageSchema>

export const ServerMessageSchema = union([
  object({
    type: literal('init'),
    items: array(ServerSkillItemSchema),
    numConnections: number(),
  }),
  object({
    type: literal('items-updated'),
    items: array(ServerSkillItemSchema),
  }),
  object({
    type: literal('connections-updated'),
    numConnections: number(),
  }),
])
export type ServerMessage = InferOutput<typeof ServerMessageSchema>
