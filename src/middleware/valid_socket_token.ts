import socketio from "socket.io"
import utils from "../utils"

export default (socket: socketio.Socket, next) => {

    const { auth } = socket.handshake
    const token = auth["token"]
    const valid = utils.jwt.verify(token)

    if (valid == null || typeof valid !== "object") return next(new Error("Socket 토큰 인증 실패"))

    return next()
}