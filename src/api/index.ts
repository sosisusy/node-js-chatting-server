import express from "express"

export default () => {
    const app = global.app as express.Application

    app.get("/test", (req, res) => {
        console.log("test")
        res.end()
    })
}