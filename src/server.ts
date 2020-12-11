
// 환경변수
require("dotenv").config()

import cors from "cors"
import socketio, { Server } from "socket.io"
import bodyParser from "body-parser"
import * as cluster from "cluster"
import os from "os"
import redis from "redis"
import redisAdapter from "socket.io-redis"
import sticky from "sticky-session"
import http from "http"
import net from "net"
import farmhash from "farmhash"

import app from "./app"
import api from "./api"
import config from "./config"
import app_socket from "./app_socket"


// cpu count
const cpuCount = os.cpus().length


// redis
const redisPort = process.env.REDIS_PORT || "8888"
const pubClient = new redis.RedisClient({
    host: "localhost",
    port: parseInt(redisPort),
})
const subClient = pubClient.duplicate()


if (cluster.isMaster) {
    const workers: Array<cluster.Worker> = []
    const forkWorker = (i) => {
        workers[i] = cluster.fork()

        workers[i].on("disconnect", () => {
            console.log("respawning worker", i)
            forkWorker(i)
        })
    }
    const workerIndex = (ip: string, len: number) => {
        return farmhash.fingerprint32(ip) % len
    }

    for (let i = 0; i < cpuCount; i++) {
        forkWorker(i)
    }


    const server = net.createServer({
        pauseOnConnect: true
    }, connection => {
        let worker = workers[workerIndex(connection.remoteAddress as string, cpuCount)]

        worker.send("sticky-session:connection", connection)
    }).listen(process.env.MASTER_PORT)


} else {
    const server = app.listen(process.env.WORKER_PORT, () => {
        console.log(`server is running on port: ${process.env.WORKER_PORT} / worker: ${process.pid}`)
    })

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


    process.on("message", (message, connection) => {
        console.log(message)
        if (message !== 'sticky-session:connection') {
            return;
        }

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