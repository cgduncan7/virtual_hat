import Hat from './hat'
import { IHatSocketEvent, HatSocketClientEventEnum, HatSocketHatMasterClientEventEnum, HatSocketServerEventEnum } from './types'
import eventFactory from './eventFactory'

export default class HatHandler {
  socketServer: SocketIO.Server
  hat: Hat
  isHatOpen: boolean = false
  time: number = 120 // seconds
  
  constructor (io: SocketIO.Server) {
    this.socketServer = io
    this.hat = new Hat()

    this.onConnection = this.onConnection.bind(this)
  }

  onConnection (socket: SocketIO.Socket) {
    socket.on('hat', (event: IHatSocketEvent) => this.handleSocketEvent(socket, event))
  }

  handleSocketEvent (socket: SocketIO.Socket, { type, payload }: IHatSocketEvent) {
    console.log(`[HAT:${type}] ${JSON.stringify(payload)}`)
    switch (type) {
      case HatSocketClientEventEnum.PICK: {
        socket.broadcast.emit('hat', eventFactory(HatSocketServerEventEnum.WAIT))
        socket.emit('hat', eventFactory(HatSocketServerEventEnum.PICK, this.hat.getSubmission(socket.id)))
        break;
      }
      case HatSocketClientEventEnum.SUBMIT: {
        socket.broadcast.emit('hat', eventFactory(HatSocketServerEventEnum.SUBMISSION_RECEIVED))
        socket.emit('hat', eventFactory(HatSocketServerEventEnum.SUBMISSION_RECEIVED))
        this.hat.addSubmission(payload)
        break;
      }
      case HatSocketHatMasterClientEventEnum.RESET: {
        this.hat = new Hat()
        socket.broadcast.emit('hat', eventFactory(HatSocketServerEventEnum.RESET))
        socket.emit('hat', eventFactory(HatSocketServerEventEnum.RESET))
        break;
      }
      case HatSocketHatMasterClientEventEnum.SET_THEME: {
        this.hat.theme = payload
        socket.broadcast.emit('hat', eventFactory(HatSocketServerEventEnum.THEME_SET, payload))
        socket.emit('hat', eventFactory(HatSocketServerEventEnum.THEME_SET, payload))
        break;
      }
      case HatSocketHatMasterClientEventEnum.OPEN_HAT: {
        socket.broadcast.emit('hat', eventFactory(HatSocketServerEventEnum.HAT_OPENED))
        socket.emit('hat', eventFactory(HatSocketServerEventEnum.HAT_OPENED))
        break;
      }
      case HatSocketHatMasterClientEventEnum.CLOSE_HAT: {
        socket.broadcast.emit('hat', eventFactory(HatSocketServerEventEnum.HAT_CLOSED))
        socket.emit('hat', eventFactory(HatSocketServerEventEnum.HAT_CLOSED))
        break;
      }
      default: break;
    }
  }
}