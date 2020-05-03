export interface IPlayer {
  readonly socket: SocketIO.Socket
  readonly id: string
  nickname?: string
  equals: (p: IPlayer) => boolean
}

export enum PlayerSocketClientEventEnum {
  REGISTER = 'REGISTER',
  NEXT_TURN = 'NEXT_TURN'
}

export enum PlayerSocketServerEventEnum {
  REGISTERED = 'REGISTERED',
  HAT_MASTER = 'HAT_MASTER',
  YOUR_PICK = 'YOUR_PICK',
  ERROR = 'ERROR',
}

export type PlayerSocketEvent = PlayerSocketClientEventEnum | PlayerSocketServerEventEnum

export type IPlayerSocketEvent = {
  type: PlayerSocketEvent
  payload?: any
}