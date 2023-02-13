import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

const start = async (): Promise<void> => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

await start()
