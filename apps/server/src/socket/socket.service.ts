import type { WebSocket } from 'ws'
import type { ISocketEvent, ISocketService } from './interfaces.js'

const MESSAGE_EVENT = 'message'
const CLOSE_EVENT = 'close'

class SocketService implements ISocketService {
  constructor (private readonly _socket: WebSocket) {}

  public send (event: ISocketEvent): void {
    const message = JSON.stringify(event)
    this._socket.send(message)
  }

  public close (code?: number, message?: string): void {
    this._socket.close(code, message)
  }

  public onEvent (
    onSuccess: (event: ISocketEvent) => void,
    onError?: (error: unknown) => void
  ): void {
    this._socket.addEventListener(MESSAGE_EVENT, ({ data }) => {
      const message = String(data)

      try {
        const socketEvent = JSON.parse(message) as ISocketEvent

        onSuccess(socketEvent)
      } catch (error) {
        onError?.(error)
      }
    })
  }

  public onClose (callback: () => void): void {
    this._socket.addEventListener(CLOSE_EVENT, () => {
      this._socket.removeAllListeners()
      callback()
    })
  }
}

export default SocketService
