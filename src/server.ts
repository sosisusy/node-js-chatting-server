
// 환경변수
require("dotenv").config()

import cors from "cors"
import socketio, { Server } from "socket.io"
import bodyParser from "body-parser"
import * as cluster from "cluster"
import redis from "redis"
import redisAdapter from "socket.io-redis"
import http from "http"
import sticky from "sticky-session"

import app from "./app"
import api from "./api"
import config from "./config"
import app_socket from "./app_socket"


// redis
const redisPort = process.env.REDIS_PORT || "8888"
const pubClient = new redis.RedisClient({
    host: process.env.REDIS_URL,
    port: parseInt(redisPort),
})
const subClient = pubClient.duplicate()


if (cluster.isMaster) {

    // 관제 서버 생성
    const server = http.createServer()
    sticky.listen(server, 80)

    server.once("listening", () => {
        console.log("tttt")
    })
} else {
    const server = app.listen(process.env.WORKER_PORT)

    // socket
    const io = new socketio.Server(server, {
        cors: {
            origin: "*"
        }
    })
    io.adapter(redisAdapter.createAdapter({
        pubClient,
        subClient,
    }))

    // 워커 접속
    process.on("message", (message, connection) => {
        server.emit("connection", connection)
        connection.resume();
    })




    /**
     * app settings
     */

    // 소켓 io 글로벌 변수 등록
    app.set("io", io)


    // cors
    app.use(cors())
    app.options('*', cors());


    // parser
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())


    // api 라우터 로드
    app.use(config.apiPath, api())


    // run socket
    app_socket()
}