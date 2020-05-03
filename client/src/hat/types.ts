export interface ISubmission {
  author: string
  value: string
}

export interface IHat {
  theme: string | undefined
}

export enum HatSocketClientEventEnum {
  PICK = 'PICK',
  SUBMIT = 'SUBMIT',
}

export enum HatSocketHatMasterClientEventEnum {
  OPEN_HAT = 'OPEN_HAT',
  CLOSE_HAT = 'CLOSE_HAT',
  SET_THEME = 'SET_THEME',
  SET_TIME = 'SET_TIME',
  RESET = 'RESET',
}

export enum HatSocketServerEventEnum {
  THEME_SET = 'THEME_SET',
  TIME_SET = 'TIME_SET',
  PICK = 'PICK',
  WAIT = 'WAIT',
  SUBMISSION_RECEIVED = 'SUBMISSION_RECEIVED',
  NO_SUBMISSIONS_LEFT = 'NO_SUBMISSIONS_LEFT',
  ERROR = 'ERROR',
  RESET = 'RESET',
  HAT_OPENED = 'HAT_OPENED',
  HAT_CLOSED = 'HAT_CLOSED',
}

export enum HatSocketHatMasterServerEventEnum {}

export type HatSocketEvent = HatSocketClientEventEnum | HatSocketServerEventEnum |
  HatSocketHatMasterClientEventEnum | HatSocketHatMasterServerEventEnum

export type IHatSocketEvent = {
  type: HatSocketEvent
  payload?: any
}