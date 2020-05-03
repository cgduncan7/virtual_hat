import * as React from 'react'
import * as io from 'socket.io-client'

import Register from './register'
import Hat from './hat'
import playerEventFactory from './players/eventFactory'
import hatEventFactory from './hat/eventFactory'
import { PlayerSocketClientEventEnum, IPlayerSocketEvent, PlayerSocketServerEventEnum } from './players/types'
import { IHatSocketEvent, HatSocketServerEventEnum, HatSocketClientEventEnum, HatSocketHatMasterClientEventEnum, ISubmission } from './hat/types'

export interface IAppProps {}

export interface IAppState {
  socket: SocketIOClient.Socket | undefined
  connected: boolean,
  registered: boolean,
  hatMaster: boolean,
  hatTheme?: string,
  isHatOpen: boolean,
  myPick: boolean,
  pickedSubmission?: ISubmission,
  empty: boolean,
  numSubmissions: number
}

class App extends React.Component<IAppProps, IAppState> {
  state: IAppState = {
    socket: undefined,
    connected: false,
    registered: false,
    hatMaster: false,
    hatTheme: undefined,
    isHatOpen: false,
    myPick: false,
    pickedSubmission: undefined,
    empty: false,
    numSubmissions: 0,
  }

  constructor (props: IAppProps) {
    super(props)
    
    this.register = this.register.bind(this)
    this.setTheme = this.setTheme.bind(this)
    this.reset = this.reset.bind(this)
    this.openHat = this.openHat.bind(this)
    this.closeHat = this.closeHat.bind(this)
    this.pick = this.pick.bind(this)
    this.submit = this.submit.bind(this)
    this.nextTurn = this.nextTurn.bind(this)
    this.renderVirtualHatScreen = this.renderVirtualHatScreen.bind(this)
    this.renderRegisterScreen = this.renderRegisterScreen.bind(this)
  }

  componentDidMount () {
    const socket = io.connect('http://home.collinduncan.com:54321/virtual-hat/')
    
    socket.on('connect', () => {
      this.setState({ connected: true })
      this.forceUpdate()
    })

    socket.on('disconnnect', () => {
      this.setState({ connected: false, registered: false })
      this.forceUpdate()
    })

    socket.on('player', ({ type, payload }: IPlayerSocketEvent) => {
      switch (type) {
        case PlayerSocketServerEventEnum.REGISTERED: {
          this.setState({ registered: true })
          break
        }
        case PlayerSocketServerEventEnum.HAT_MASTER: {
          this.setState({ hatMaster: true })
          break
        }
        case PlayerSocketServerEventEnum.ERROR: {
          console.error(payload.message)
          break
        }
        case PlayerSocketServerEventEnum.YOUR_PICK: {
          this.setState({ myPick: true })
          break
        }
      }
    })

    socket.on('hat', ({ type, payload }: IHatSocketEvent) => {
      switch (type) {
        case HatSocketServerEventEnum.THEME_SET: {
          this.setState({ hatTheme: payload })
          break
        }
        case HatSocketServerEventEnum.PICK: {
          this.setState({ pickedSubmission: payload })
          break
        }
        case HatSocketServerEventEnum.WAIT: {
          this.setState({ pickedSubmission: undefined })
        }
        case HatSocketServerEventEnum.NO_SUBMISSIONS_LEFT: {
          this.setState({ empty: true })
          break
        }
        case HatSocketServerEventEnum.HAT_CLOSED: {
          this.setState({ isHatOpen: false })
          break
        }
        case HatSocketServerEventEnum.HAT_OPENED: {
          this.setState({ isHatOpen: true })
          break
        }
        case HatSocketServerEventEnum.ERROR: {
          console.error(payload.message)
          break
        }
        case HatSocketServerEventEnum.SUBMISSION_RECEIVED: {
          console.log('here')
          this.setState({ numSubmissions: this.state.numSubmissions + 1 })
          break
        }
        case HatSocketServerEventEnum.RESET: {
          this.setState({
            isHatOpen: false,
            myPick: false,
            hatTheme: undefined,
            pickedSubmission: undefined,
            empty: false,
          })
          break
        }
        default: break
      }
    })

    this.setState({
      socket,
    })
  }

  register (nickname: string) {
    this.state.socket?.emit('player', playerEventFactory(PlayerSocketClientEventEnum.REGISTER, nickname))
  }

  setTheme (theme: string) {
    this.state.socket?.emit('hat', hatEventFactory(HatSocketHatMasterClientEventEnum.SET_THEME, theme))
  }

  reset () {
    this.state.socket?.emit('hat', hatEventFactory(HatSocketHatMasterClientEventEnum.RESET))
  }

  openHat () {
    this.state.socket?.emit('hat', hatEventFactory(HatSocketHatMasterClientEventEnum.OPEN_HAT))
  }

  closeHat () {
    this.state.socket?.emit('hat', hatEventFactory(HatSocketHatMasterClientEventEnum.CLOSE_HAT))
  }

  pick () {
    if (this.state.myPick) {
      this.state.socket?.emit('hat', hatEventFactory(HatSocketClientEventEnum.PICK))
      this.setState({ myPick: false })
    }
  }

  submit (value: string) {
    if (this.state.socket) {
      const submission: ISubmission = {
        author: this.state.socket.id,
        value,
      }
      this.state.socket?.emit('hat', hatEventFactory(HatSocketClientEventEnum.SUBMIT, submission))
    }
  }
  
  nextTurn () {
    this.setState({ numSubmissions: this.state.numSubmissions - 1 })
    this.state.socket?.emit('player', playerEventFactory(PlayerSocketClientEventEnum.NEXT_TURN))
  }

  renderVirtualHatScreen () {
    return <Hat
      numSubmissions={this.state.numSubmissions}
      theme={this.state.hatTheme}
      isHatOpen={this.state.isHatOpen}
      hatMaster={this.state.hatMaster}
      setTheme={this.setTheme}
      reset={this.reset}
      openHat={this.openHat}
      closeHat={this.closeHat}
      pick={this.pick}
      pickedSubmission={this.state.pickedSubmission}
      submit={this.submit}
      myPick={this.state.myPick}
      nextTurn={this.nextTurn}
      empty={this.state.empty}
    />
  }

  renderRegisterScreen () {
    return <Register
      register={this.register}
    />
  }

  render () {
    return (
      <div>
        {
          this.state.registered
            ? this.renderVirtualHatScreen()
            : this.renderRegisterScreen()
        }
      </div>
    )
  }
}

export default App