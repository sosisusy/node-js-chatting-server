import app from "./app"
import socketio from "socket.io"
import middleware from "./middleware"

const users = {}

export default () => {
    const io = app.get("io") as socketio.Server

    // 토큰 체크 미들웨어
    // io.use(middleware.validSocketToken)

    // io.on("connection", async (socket: socketio.Socket) => {

    //     socket.join("test")
    //     socket.join("test2")
    //     socket.join("test3")
    //     socket.join("test4")

    //     console.log("worker: ", process.pid, "socket id:", socket.id)

    //     socket.emit("hello", socket.id)
    //     socket.on("message", (data) => {
    //         socket.emit("message", data)
    //         socket.broadcast.emit("message", {
    //             userName: socket.id,
    //             contents: "이것은 브로드 캐스트란 것이여",
    //         })
    //     })

    //     socket.on("disconnect", () => {
    //         console.log("disconnect", process.pid)
    //     })
    // })



    io.on("connection", async (socket: socketio.Socket) => {

        socket.emit("hello", socket.id)
        socket.on("message", (data) => {
            socket.emit("message", data)
            socket.broadcast.emit("message", {
                userName: socket.id,
                contents: "이것은 브로드 캐스트란 것이여",
            })
        })

        socket.on("disconnect", () => {
            console.log("disconnect", process.pid)
        })
    })
}