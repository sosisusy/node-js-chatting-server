
import express from "express"
import app from "../app"
import utils from "../utils"

export default () => {
    const router = express.Router()

    router.get("/token", (req, res, next) => {
        console.log("create token")
        res.write(utils.jwt.sign(req.query))
        res.end()
    })

    return router
}