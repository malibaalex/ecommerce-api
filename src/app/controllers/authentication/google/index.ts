import GoogleCallbackController from "./google-call-back.js"
import GoogleStartController from "./google-start.js"

const CallBack = new GoogleCallbackController()
const Start = new GoogleStartController()

const Google = {
  CallBack,
  Start,
}

export default Google
