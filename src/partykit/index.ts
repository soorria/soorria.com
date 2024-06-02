import type * as Party from 'partykit/server'
import { array, parse, safeParse } from 'valibot'
import {
  SKILLS,
  SKILLS_MAGIC_NUMBERS as SKILLS_MAGIC_NUMBERS,
  getRandomSkillIndexes,
} from '~/lib/skills/definitions'
import {
  ServerSkillItemSchema,
  type ServerSkillItem,
  type ServerMessage,
  type ClientMessage,
  ClientMessageSchema,
  type SkillPosition,
} from '~/lib/skills/schems'
import { random } from '~/utils/random'

type ServerState =
  | {
      status: 'ready'
      items: ServerSkillItem[]
    }
  | {
      status: 'not-ready'
    }

type SenderState = {
  lastMessageTime?: number
}

const StoredItemsSchema = array(ServerSkillItemSchema)

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {
    if (room.id !== 'the-one-room') {
      throw new Error('wtf')
    }
  }

  private state: ServerState = {
    status: 'not-ready',
  }
  async onStart() {
    const unsafeSavedItems = await this.room.storage.get<ServerSkillItem[]>('items')
    const parseResult = safeParse(StoredItemsSchema, unsafeSavedItems)
    if (parseResult.success) {
      this.state = {
        status: 'ready',
        items: parseResult.output,
      }
    } else {
      this.state = {
        status: 'ready',
        items: Server.getRandomSkills('grid'),
      }
    }
  }
  async saveState() {
    if (this.state.status === 'not-ready') {
      return
    }
    await this.room.storage.put('items', this.state.items)
  }

  private static getId() {
    return crypto.randomUUID()
  }

  private static getRandomSkills(positionMode: 'random' | 'grid' = 'random') {
    return getRandomSkillIndexes().map((skillIndex, indexInArray) => {
      const position =
        positionMode === 'random'
          ? Server.getRandomPosition()
          : Server.getGridPosition(indexInArray)

      return {
        label: SKILLS[skillIndex]!.label,
        id: Server.getId(),
        position,
      }
    })
  }

  private static getGridPosition(i: number): SkillPosition {
    const width = SKILLS_MAGIC_NUMBERS.rootWidthPx
    const height = width / SKILLS_MAGIC_NUMBERS.aspectRatio

    const rowNumber = Math.floor(i / SKILLS_MAGIC_NUMBERS.numColumns)
    const colNumber = i - rowNumber * SKILLS_MAGIC_NUMBERS.numColumns

    const columnWidth = width / SKILLS_MAGIC_NUMBERS.numColumns
    const centerOfColumn = (colNumber + 0.5) * columnWidth

    const rowHeight = height / 2
    const centerOfRow = (rowNumber + 0.5) * rowHeight

    return {
      x: centerOfColumn,
      y: centerOfRow,
    }
  }

  private static getRandomPosition(): SkillPosition {
    const halfImageWidthPx = SKILLS_MAGIC_NUMBERS.imageWidthPx / 2

    const x = random(halfImageWidthPx, SKILLS_MAGIC_NUMBERS.rootWidthPx - halfImageWidthPx)
    const y = random(0, SKILLS_MAGIC_NUMBERS.rootWidthPx / SKILLS_MAGIC_NUMBERS.aspectRatio)

    return {
      x,
      y,
    }
  }

  private static serializeServerMessage(message: ServerMessage) {
    return JSON.stringify(message)
  }

  private static deserializeClientMessage(serializedMessage: string): ClientMessage | null {
    try {
      const unsafeParsedJSON = JSON.parse(serializedMessage)
      return parse(ClientMessageSchema, unsafeParsedJSON)
    } catch (e) {
      console.log('Failed to parse message from client', e)
      return null
    }
  }

  private broadcastConnections() {
    this.room.broadcast(
      Server.serializeServerMessage({
        type: 'connections-updated',
        numConnections: [...this.room.getConnections()].length,
      })
    )
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`
    )

    if (this.room.id !== 'the-one-room') {
      conn.close()
      return
    }

    if (this.state.status !== 'ready') {
      return
    }

    conn.send(
      Server.serializeServerMessage({
        type: 'init',
        items: this.state.items,
        numConnections: [...this.room.getConnections()].length,
      })
    )

    this.broadcastConnections()
  }

  onClose() {
    this.broadcastConnections()
  }

  async onMessage(message: string, sender: Party.Connection<SenderState>) {
    if (this.state.status !== 'ready') {
      return
    }

    const now = Date.now()
    const prevSendTime = sender.state?.lastMessageTime ?? 0
    const nextSendTime = prevSendTime + SKILLS_MAGIC_NUMBERS.sendMessageTimeoutMs

    if (now < nextSendTime) {
      return
    }
    sender.setState({
      lastMessageTime: now,
    })

    const clientMessage = Server.deserializeClientMessage(message)
    if (!clientMessage) {
      return
    }

    let ignoreSelf = false

    if (clientMessage.type === 'move-item') {
      this.state.items = this.state.items.map(item => {
        if (item.id !== clientMessage.itemId) {
          return item
        }
        return {
          ...item,
          position: clientMessage.newPosition,
        }
      })

      ignoreSelf = true
    } else if (clientMessage.type === 'add-more') {
      this.state.items.push(...Server.getRandomSkills())
      this.state.items = this.state.items.slice(-32)
    } else {
      return
    }

    this.room.broadcast(
      Server.serializeServerMessage({
        type: 'items-updated',
        items: this.state.items,
      }),
      ignoreSelf ? [sender.id] : []
    )
    await Promise.all([this.room.storage.setAlarm(Date.now() + 2 * 60 * 1000), this.saveState()])
  }

  async onAlarm() {
    if (this.state.status === 'not-ready') {
      return
    }

    this.state.items = this.state.items.slice(-8).map((item, i) => {
      return {
        ...item,
        position: Server.getGridPosition(i),
      }
    })
    this.room.broadcast(
      Server.serializeServerMessage({
        type: 'items-updated',
        items: this.state.items,
      })
    )
    await this.saveState()
  }
}

Server satisfies Party.Worker
