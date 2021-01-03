


import socketio from "socket.io"

export default () => {
    const io = global.io as socketio.Server

    io.on("connection", (client: socketio.Socket) => {
        console.log("connection")

        client.on("ping", (req) => {
            client.emit("pong", req)
        })
    })
}