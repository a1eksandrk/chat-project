import fastify from 'fastify'
import websocketPlugin from '@fastify/websocket'

import chatController from './chat/chat.controller.js'

import type { FastifyInstance, FastifyPluginCallback } from 'fastify'
import type { WebsocketPluginOptions } from '@fastify/websocket'

const app: FastifyInstance = fastify({ logger: true })

app.register(websocketPlugin as unknown as FastifyPluginCallback<WebsocketPluginOptions>)
app.register(chatController)

app.get('/', (_, reply) => {
  reply.send({ hello: 'world' })
})

const start = async (): Promise<void> => {
  try {
    await app.listen({ port: 3000 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
