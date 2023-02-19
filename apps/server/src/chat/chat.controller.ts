import { randomUUID } from 'node:crypto'

import chatServiceInstance from './chat.service.js'
import EventService from '../event/event.service.js'
import SocketService from '../socket/socket.service.js'

import type { FastifyInstance, FastifyPluginAsync } from 'fastify'

const CHAT_ROUTE = '/chat'

const chatController: FastifyPluginAsync = async (app: FastifyInstance): Promise<void> => {
  app.get(CHAT_ROUTE, { websocket: true }, connection => {
    const client = {
      id: randomUUID(),
      socket: new SocketService(connection.socket)
    }

    const eventService = new EventService(
      app,
      chatServiceInstance,
      client
    )

    chatServiceInstance.register(client)

    client.socket.onEvent(
      eventService.handleEventSuccess,
      eventService.handleEventError
    )

    client.socket.onClose(() => { chatServiceInstance.unregister(client) })
  })
}

export default chatController
