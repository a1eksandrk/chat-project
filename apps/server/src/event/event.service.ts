import { isBasePayload, isMessagePayload } from '../chat/typeguards.js'

import ExternalError from '../error/ExternalError.js'

import { CHAT_EVENT } from './constants.js'
import { INVALID_EVENT_ERROR, INVALID_PAYLOAD_ERROR } from '../error/constants.js'

import type { FastifyInstance } from 'fastify'
import type { ISocketEvent } from '../socket/interfaces.js'
import type { IBasePayload, IChatServise, IClient } from '../chat/interfaces.js'

class EventService {
  constructor (
    private readonly _app: FastifyInstance,
    private readonly _chatService: IChatServise,
    private readonly _client: IClient
  ) {}

  public handleEventSuccess = ({ type, payload }: ISocketEvent): void => {
    switch (type) {
      case CHAT_EVENT.chatSearch:
        this._handleSearchEvent()
        break

      case CHAT_EVENT.chatMessage:
        this._handleMessageEvent(payload)
        break

      case CHAT_EVENT.printBegin:
        this._handleBaseEvent(
          payload,
          payload => {
            this._chatService.printBegin(payload)
          })
        break

      case CHAT_EVENT.printEnd:
        this._handleBaseEvent(
          payload,
          payload => {
            this._chatService.printEnd(payload)
          })
        break

      case CHAT_EVENT.chatEnd:
        this._handleBaseEvent(
          payload,
          payload => {
            this._chatService.chatEnd(payload)
          })
        break

      default:
        throw new ExternalError(INVALID_EVENT_ERROR)
    }
  }

  public handleEventError = (error: unknown): void => {
    if (error instanceof ExternalError) {
      this._client.socket.close(4000, error.message)
    }

    this._app.log.error(error)
  }

  private _handleSearchEvent (): void {
    this._chatService.findCompanionAndChatBegin(this._client)
  }

  private _handleMessageEvent (payload: unknown): void {
    if (isMessagePayload(payload)) {
      this._chatService.sendMessage(payload)
    } else {
      throw new ExternalError(INVALID_PAYLOAD_ERROR)
    }
  }

  private _handleBaseEvent (payload: unknown, callback: (payload: IBasePayload) => void): void {
    if (isBasePayload(payload)) {
      callback(payload)
    } else {
      throw new ExternalError(INVALID_PAYLOAD_ERROR)
    }
  }
}

export default EventService
