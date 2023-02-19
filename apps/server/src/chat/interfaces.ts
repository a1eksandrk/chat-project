import type { ISocketService } from '../socket/interfaces.js'

export interface IClient {
  id: string
  socket: ISocketService
}

export interface IBasePayload {
  id: string
}

export interface IMessagePayload extends IBasePayload {
  message: string
}

export interface IChatServise {
  clientsCount: number
  searchCount: number
  register: (client: IClient) => void
  unregister: (client: IClient) => void
  findClient: (id: string) => IClient | undefined
  findCompanionAndChatBegin: (client: IClient) => void
  sendMessage: (messagePayload: IMessagePayload) => void
  printBegin: (payload: IBasePayload) => void
  printEnd: (payload: IBasePayload) => void
  chatEnd: (payload: IBasePayload) => void
}
