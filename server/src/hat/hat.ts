import { IHat, ISubmission } from "./types";

export default class Hat implements IHat {
  theme: string | undefined
  submissions: ISubmission[] = []

  addSubmission (submission: ISubmission) {
    console.log(submission)
    this.submissions.push(submission)
  }

  removeSubmission (index: number): ISubmission {
    console.log(index)
    return this.submissions.splice(index, 1)[0]
  }

  getSubmission (forPlayer: string): ISubmission | boolean {
    if (this.submissions.length === 0) {
      return false
    }
    let index = this.submissions.findIndex(({ author }) => author !== forPlayer)
    if (index === -1) {
      index = 0
    }
    return this.removeSubmission(index)
  }
}