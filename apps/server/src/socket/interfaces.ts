export interface ISocketEvent {
  type: string
  payload?: unknown
}

export interface ISocketService {
  send: (event: ISocketEvent) => void
  close: (code?: number, message?: string) => void
  onEvent: (
    callback: (event: ISocketEvent) => void,
    onError?: (error: unknown) => void
  ) => void
  onClose: (callback: () => void) => void
}
