import { Socket } from 'socket.io'
import { IPlayer } from './types'

export default class Player implements IPlayer {
  readonly socket: Socket
  readonly _id: string
  private _nickname: string | undefined = undefined

  constructor (socket: Socket) {
    this.socket = socket
    this._id = socket.id
  }

  // #region accessors/mutators
  get nickname (): string | undefined {
    return this._nickname
  }

  set nickname (n: string | undefined) {
    this._nickname = n
  }

  get id (): string {
    return this._id
  }

  equals (other: IPlayer): boolean {
    return this.id === other.id
  }
  // #endregion
}