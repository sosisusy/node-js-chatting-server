import express from "express"
import bodyParser from "body-parser"
import cors from "cors"

export default () => {
    const app = global.app as express.Application
    const corsOptions = {
        origin: '*',
    }

    app.use(cors(corsOptions))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use((req, res, next) => {
        next()
    })
}