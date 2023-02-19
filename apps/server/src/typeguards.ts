export const isObject = (entity: unknown): entity is NonNullable<object> => {
  return typeof entity === 'object' && entity !== null
}
