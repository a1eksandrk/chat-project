import ExternalError from '../error/ExternalError.js'

import { CHAT_EVENT } from '../event/constants.js'
import { CLIENT_IS_ALREADY_IN_QUEUE, UNKNOWN_COMPANION_ID_ERROR, HANDSHAKE_MISSING_CLIENT_ERROR } from '../error/constants.js'

import type { IBasePayload, IChatServise, IClient, IMessagePayload } from './interfaces.js'

class ChatService implements IChatServise {
  private _clients: IClient[] = []
  private _queue: IClient[] = []

  public get clientsCount (): number {
    return this._clients.length
  }

  public get searchCount (): number {
    return this._queue.length
  }

  public register (client: IClient): void {
    this._clients.push(client)
  }

  public unregister (client: IClient): void {
    this._clients = this._clients.filter(c => c.id !== client.id)
    this._queue = this._queue.filter(c => c.id !== client.id)
  }

  public findClient (id: string): IClient {
    const companion = this._clients.find(c => c.id === id)

    if (companion === undefined) {
      throw new ExternalError(UNKNOWN_COMPANION_ID_ERROR)
    }

    return companion
  }

  public findCompanionAndChatBegin (client: IClient): void {
    if (this._isAlreadyInQueue(client)) {
      throw new ExternalError(CLIENT_IS_ALREADY_IN_QUEUE)
    }

    const companion = this._findCompanion(client)

    if (companion === undefined) {
      this._queue.push(client)
    } else {
      this._eventHandshake(CHAT_EVENT.chatBegin, client, companion)
    }
  }

  public sendMessage ({ id, message }: IMessagePayload): void {
    this._sendEventById(id, CHAT_EVENT.printBegin, { message })
  }

  public printBegin ({ id }: IBasePayload): void {
    this._sendEventById(id, CHAT_EVENT.printBegin)
  }

  public printEnd ({ id }: IBasePayload): void {
    this._sendEventById(id, CHAT_EVENT.printEnd)
  }

  public chatEnd ({ id }: IBasePayload): void {
    this._sendEventById(id, CHAT_EVENT.chatEnd)
  }

  private _sendEventById (id: string, eventType: string, eventPayload?: unknown): void {
    const companion = this.findClient(id)

    companion.socket.send({
      type: eventType,
      payload: eventPayload
    })
  }

  private _isAlreadyInQueue (client: IClient): boolean {
    return Boolean(this._queue.find(c => c.id === client.id))
  }

  private _findCompanion (client: IClient): IClient | undefined {
    return this._queue.find(companion => companion.id !== client.id)
  }

  private _eventHandshake (eventType: string, leftClient: IClient, rightClient: IClient): void {
    if (leftClient === undefined || rightClient === undefined) {
      throw new ExternalError(HANDSHAKE_MISSING_CLIENT_ERROR)
    }

    leftClient.socket.send({
      type: eventType,
      payload: { id: rightClient.id }
    })

    rightClient.socket.send({
      type: eventType,
      payload: { id: leftClient.id }
    })
  }
}

const chatServiceInstance = new ChatService()

export default chatServiceInstance
