
require('dotenv').config()


declare global {
    namespace NodeJS {
        interface Global {
            app: Express.Application,
            io: socketio.Server
        }
    }
}


// libraries
import express from "express"
import socketio from "socket.io"

// local modules
import middleware from "./middleware"
import api from "./api"
import socket from "./socket"


// express
const app = express()
const server = app.listen(process.env.HOST_PORT, () => console.log("**** server start ****"));

// socket
const socketOptions = {
    path: "/socket",
    cors: {
        origin: "*",
    },
    transports: ["websocket"],
} as socketio.ServerOptions
const io = new socketio.Server(server, socketOptions)


// global variables
global.app = app
global.io = io



// load
middleware()
api()
socket()