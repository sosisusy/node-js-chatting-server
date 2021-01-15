
require('dotenv').config()


declare global {
    namespace NodeJS {
        interface Global {
            app: Express.Application,
            io: socketio.Server,
            db: mariadb.Pool,
        }
    }
}


// libraries
import express from "express"
import socketio from "socket.io"
import redisAdapter from "socket.io-redis"
import redis from "redis"
import mariadb from "mariadb"

// local modules
import config from "./config"
import middleware from "./middleware"
import api from "./api"
import socket from "./socket"


// express
const app = express()
const server = app.listen(process.env.HOST_PORT, () => {
    console.log("**** server start ****")
});


// maria db
const db = mariadb.createPool(config.mariaDBOptions)


// socket
const io = new socketio.Server(server, config.socketOptions)
const pubClient = new redis.RedisClient(config.redisOptions)
const subClient = pubClient.duplicate();

io.adapter(redisAdapter.createAdapter({ pubClient, subClient }));


// global variables
global.app = app
global.io = io
global.db = db

// load
middleware()
api()
socket()


// PM2 종료 이벤트 수신
process.on('SIGINT', function () {
    db.end()
        .then(() => {
            io.close(err => {
                if (err) process.exit(1)
                pubClient.end()
                subClient.end()
                process.exit()
            })
        })
        .catch(err => process.exit(1))
})