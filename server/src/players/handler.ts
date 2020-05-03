import Player from "./player";
import {
  IPlayer,
  IPlayerSocketEvent,
  PlayerSocketClientEventEnum,
  PlayerSocketServerEventEnum,
} from "./types";
import eventFactory from "./eventFactory";

export default class PlayerHandler {
  currentTurn: number
  socketServer: SocketIO.Server
  players: IPlayer[] = []
  hatMaster: string | undefined = undefined

  constructor (socketServer: SocketIO.Server) {
    this.socketServer = socketServer
    this.currentTurn = 0
  }

  addPlayer (p: IPlayer): boolean {
    console.log(`Adding new player ${p.id}`)
    this.players.push(p)

    return true
  }
  
  removePlayer (id: string): boolean {
    console.log(`Removing player ${id}`)
    const indexToRemove = this.players.findIndex(({ id: _id }) => _id === id)
    if (indexToRemove !== -1) {
      this.players.splice(indexToRemove, 1)
      if (this.hatMaster === id) {
        this.unsetHatMaster()
      }
      return true
    }
    return false
  }

  registerPlayer (id: string, nickname: string): boolean {
    console.log(`Registering player ${id} to ${nickname}`)
    const nnIsTaken = this.players.find(({ nickname: nn }) => nn === nickname)
    
    if (!nnIsTaken) {
      const playerToRegister = this.players.find(({ id: _id }) => _id === id)
      if (playerToRegister) {
        playerToRegister.nickname = nickname
        return true
      }
      return false
    }
    return false
  }
  
  setHatMaster (socket: SocketIO.Socket) {
    this.hatMaster = socket.id
    console.log(`New hat master is ${this.hatMaster}`)
    socket.emit('player', eventFactory(PlayerSocketServerEventEnum.HAT_MASTER))
  }

  unsetHatMaster () {
    this.hatMaster = undefined
    console.log(`Removed hat master`)
    if (this.players.length > 0) {
      this.setHatMaster(this.players[0].socket)
    }
  }

  // #region listener functions
  onConnection (socket: SocketIO.Socket) {
    socket.on('player', (event: IPlayerSocketEvent) => this.handleSocketEvent(socket, event))
    socket.on('disconnect', () => this.removePlayer(socket.id))
    
    const player = new Player(socket)
    this.addPlayer(player)
  }

  handleSocketEvent (socket: SocketIO.Socket, { type, payload }: IPlayerSocketEvent) {
    console.log(`[PLAYER:${type}] ${JSON.stringify(payload)}`)
    switch (type) {
      case PlayerSocketClientEventEnum.REGISTER:
        this.onRegister(socket, payload); break;
      case PlayerSocketClientEventEnum.NEXT_TURN:
        this.nextTurn(socket); break;
      default: break;
    }
  }

  nextTurn (_: SocketIO.Socket) {
    const nextIndex = (this.currentTurn) % this.players.length
    this.players[nextIndex].socket.emit('player', eventFactory(PlayerSocketServerEventEnum.YOUR_PICK))
  }
  
  onRegister (socket: SocketIO.Socket, nickname: string) {
    const id = socket.id
    const registered = this.registerPlayer(id, nickname)
    if (registered) {
      console.log(`Registered player ${socket.id} to ${nickname}`)
      socket.emit('player', eventFactory(PlayerSocketServerEventEnum.REGISTERED))
      if (this.hatMaster === undefined) {
        this.setHatMaster(socket)
      }
    } else {
      console.log(`${nickname} is taken`)
      socket.emit('player', eventFactory(PlayerSocketServerEventEnum.ERROR, { message: `${nickname} is taken!` }))
    }
  }
  // #endregion
}