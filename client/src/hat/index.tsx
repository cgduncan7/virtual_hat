/// <reference path="../index.d.ts" />
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

import { ISubmission } from './types'
import './style.sass'
import HatPNG from './virtual_hat.png'

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
            : (
              <div className="hat-master-controls-theme">
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
            )
        }
        {
          this.props.theme &&
          (
            this.props.isHatOpen
              ? <button onClick={this.props.closeHat}>CLOSE HAT</button>
              : <button onClick={this.props.openHat}>OPEN HAT</button>
          )
        }
        {
          this.props.theme &&
          !this.props.isHatOpen &&
          !this.props.empty &&
          <button onClick={this.props.nextTurn}>NEXT TURN</button>
        }
      </div>
    )
  }

  renderHatImage () {
    return <img src={HatPNG}/>
  }

  renderHatPick () {
    if (this.props.pickedSubmission) {
      const flipSubmission = () => {
        const hatPick = document.getElementById("hatPick")
        if (hatPick) {
          hatPick.classList.add("flipped")
          setTimeout(() => {
            hatPick.classList.remove("flipped")
          }, 1000)
        }
      }
      setTimeout(() => {
        document.getElementById("hatPick")?.classList.remove("flipped")
      }, 1000)
      return (
        <div id="hatPick" className="pick flipped" onClick={flipSubmission}>
          <h2>{ this.props.pickedSubmission?.value }</h2>
        </div>
      )
    }
    return undefined
  }

  render () {
    return (
      <div>
        <div className="hat">
          <div className="num_submissions">
            <h2>{ this.props.numSubmissions }</h2>
          </div>
          {
            this.props.isHatOpen
              ? <div className="hat_submission">
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
              : <button className="hat_pick attention" onClick={this.props.pick} disabled={!this.props.myPick}>PICK</button>
          }
          { this.renderHatPick() }
          { this.renderHatImage() }
          <h1>{ this.props.theme || 'Waiting for theme...' }</h1>
        </div>
        { this.props.hatMaster && this.renderHatMasterControls() }
      </div>
    )
  }
}