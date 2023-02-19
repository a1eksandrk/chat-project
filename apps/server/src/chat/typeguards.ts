import { isObject } from '../typeguards.js'

import type { IBasePayload, IMessagePayload } from './interfaces.js'

export const isBasePayload = (payload: unknown): payload is IBasePayload => {
  return (
    isObject(payload) &&
    typeof (payload as IMessagePayload)?.id === 'string'
  )
}

export const isMessagePayload = (payload: unknown): payload is IMessagePayload => {
  return (
    isBasePayload(payload) &&
    typeof (payload as IMessagePayload)?.message === 'string'
  )
}
