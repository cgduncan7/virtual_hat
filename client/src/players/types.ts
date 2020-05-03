export interface IPlayer {
  readonly socket?: SocketIOClient.Socket
  readonly id: string
  nickname?: string
}

export enum PlayerSocketClientEventEnum {
  REGISTER = 'REGISTER',
  NEXT_TURN = 'NEXT_TURN'
}

export enum PlayerSocketServerEventEnum {
  REGISTERED = 'REGISTERED',
  YOUR_PICK = 'YOUR_PICK',
  HAT_MASTER = 'HAT_MASTER',
  ERROR = 'ERROR',
}

export type PlayerSocketEvent = PlayerSocketClientEventEnum | PlayerSocketServerEventEnum

export type IPlayerSocketEvent = {
  type: PlayerSocketEvent
  payload?: any
}