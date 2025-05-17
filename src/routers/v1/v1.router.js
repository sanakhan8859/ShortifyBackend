const express = require("express")
const URLRouter = require("./url.router")
const authRouter = require("./auth.router")
const UserRouter = require('./user.router')
const v1Router = express.Router()

v1Router.use("/short-url", URLRouter)

v1Router.use("/auth", authRouter)

v1Router.use("/user", UserRouter)

module.exports = v1Router