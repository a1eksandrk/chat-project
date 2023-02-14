import fastify from 'fastify'
import websocketPlugin from '@fastify/websocket'

import type { FastifyInstance, FastifyPluginCallback } from 'fastify'
import type { WebsocketPluginOptions } from '@fastify/websocket'

const app: FastifyInstance = fastify({
  logger: true
})

await app.register(websocketPlugin as unknown as FastifyPluginCallback<WebsocketPluginOptions>)

app.get('/', (request, reply) => {
  return { hello: 'world' }
})

app.get('/socket', { websocket: true }, (connection, request) => {
  const heartbeat = setInterval(() => {
    connection.socket.send('heartbeat')
  }, 1000)

  connection.socket.on('close', () => {
    clearInterval(heartbeat)
  })
})

const start = async (): Promise<void> => {
  try {
    await app.listen({ port: 3000 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

await start()
