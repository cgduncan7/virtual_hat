import * as React from 'react'

export interface IHatProps {
  hatMaster: boolean
  isHatOpen: boolean
  theme: string | undefined
  setTheme: (theme: string) => void
  reset: () => void
  openHat: () => void
  closeHat: () => void
  pick: () => void
  pickedSubmission?: ISubmission
  submit: (value: string) => void
  myPick: boolean
  nextTurn: () => void
  empty: boolean
  numSubmissions: number
}

export interface IHatState {
  _theme?: string,
  _submission?: string
}

import './style.sass'
import { ISubmission } from './types'

export default class Hat extends React.Component<IHatProps, IHatState> {
  state: IHatState = {
    _theme: '',
    _submission: '',
  }

  constructor (props: IHatProps) {
    super(props)

    this.renderHatMasterControls = this.renderHatMasterControls.bind(this)
  }

  renderHatMasterControls () {
    return (
      <div className="hat-master-controls">
        {
          this.props.theme
            ? <button onClick={this.props.reset}>RESET</button>
            : <div>
              <input
                type="text"
                value={this.state._theme}
                onChange={(e) => this.setState({ _theme: e.target.value })} />
              <button
                disabled={!this.state._theme}
                onClick={() => {
                  if (this.state._theme) {
                    this.props.setTheme(this.state._theme)
                    this.setState({ _theme: undefined })
                  }
                }}>
                  SET THEME
              </button>
            </div>
        }
        {
          this.props.isHatOpen
            ? <button onClick={this.props.closeHat}>CLOSE HAT</button>
            : <button onClick={this.props.openHat}>OPEN HAT</button>
        }
        <h2>{ this.props.numSubmissions }</h2>
        {
          !this.props.isHatOpen &&
          !this.props.empty &&
          <button onClick={this.props.nextTurn}>NEXT TURN</button>
        }
      </div>
    )
  }

  render () {
    return (
      <div>
        <div className="hat">
          {
            this.props.isHatOpen
              ? <div>
                  <input
                    type="text"
                    disabled={!this.props.isHatOpen}
                    value={this.state._submission}
                    onChange={(e) => this.setState({ _submission: e.target.value})}
                  />
                  <button
                    disabled={!this.state._submission}
                    onClick={() => {
                      if (this.state._submission) {
                        this.props.submit(this.state._submission)
                        this.setState({ _submission: '' })
                      }
                    }}>
                      SUBMIT
                  </button>
                </div>
              : <button onClick={this.props.pick} disabled={!this.props.myPick}>PICK</button>
          }
          <img src="/public/top-hat.png"></img>
          <h1>{ this.props.theme || 'Waiting for theme...' }</h1>
        </div>
        { this.props.hatMaster && this.renderHatMasterControls() }
        <div className="pick">
          <h2>{ this.props.pickedSubmission?.value }</h2>
        </div>
      </div>
    )
  }
}