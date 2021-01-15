import redis from "redis"
import socketio from "socket.io"
import mariadb from "mariadb"

/**
 * 설정 파일
 */
export default {

    /**
     * mariaDB 옵션
     */
    mariaDBOptions: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
    } as mariadb.ConnectionConfig,

    /**
     * socketio 옵션
     */
    socketOptions: {
        path: "/socket",
        cors: {
            origin: "*",
        },
        transports: ["websocket"],
    } as socketio.ServerOptions,

    /**
     * redis 옵션
     */
    redisOptions: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PASSWORD,
    } as redis.ClientOpts,
}