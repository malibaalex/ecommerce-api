import GoogleCallbackRoute from "./google-call-back.js"
import GoogleStartRoute from "./google-start.js"

const PATH = "/auth"

const Start = new GoogleStartRoute(PATH)
const CallBack = new GoogleCallbackRoute(PATH)

const Google = {
  Start,
  CallBack,
}

export default Google
