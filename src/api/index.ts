import express from "express"

export default () => {
    const app = global.app as express.Application
    const db = global.db

    app.get("/test", async (req, res) => {
        const dbcon = await db.getConnection();
        let rows;

        console.log("test");

        dbcon.end()
        res.end()
    })
}