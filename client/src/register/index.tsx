import * as React from 'react'

import './style.sass'

export interface IRegisterProps {
  register: Function
}

export interface IRegisterState {
  nickname: string | undefined
}

class Register extends React.Component<IRegisterProps, IRegisterState> {
  state: IRegisterState = {
    nickname: ''
  }

  constructor (props: IRegisterProps) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.register = this.register.bind(this)
  }

  handleChange (event: any) {
    const value = event.target.value
    this.setState({ nickname: value })
  }

  handleSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (this.state.nickname) {
      this.register(this.state.nickname)
    }
  }

  register (nickname: string) {
    console.log(`Registering with nickname: ${nickname}`)
    this.props.register(nickname)
  }

  render () {
    return (
      <div className="register">
        <form className="register-form" onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Nickname"
            onChange={this.handleChange}
            value={this.state.nickname} />
          <button disabled={this.state.nickname?.length === 0}>Register</button>
        </form>
      </div>
    )
  }
}

export default Register