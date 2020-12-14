import app from "./app"
import socketio from "socket.io"
import middleware from "./middleware"
import { IChattingMessage } from "./interfaces/chatting"


export default () => {
    const io = app.get("io") as socketio.Server

    // 토큰 체크 미들웨어
    // io.use(middleware.validSocketToken)


    io.on("connection", (socket: socketio.Socket) => {
        const myRoom = "my" + socket.handshake.auth["id"]

        // console.log("현인원", rooms[myRoom].length)

        socket.join(myRoom)

        socket.emit("hello", `${socket.id} ${myRoom}`)

        socket.on("message", (data: IChattingMessage) => {
            io.to(myRoom).emit("message", data)
        })

        socket.on("notice", (data: IChattingMessage) => {
            io.emit("notice", data)
        })

        socket.on("ping", (time: number) => {
            socket.emit("ping", time)
        })

        socket.on("disconnect", () => {
            console.log("disconnect", socket.id, myRoom)
        })
    })
}