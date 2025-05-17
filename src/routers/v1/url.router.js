const express = require('express')
const {AuthenticationMiddleware} = require("./../../middlewares/auth.middleware")

const URLRouter = express.Router()

const {CreateNewURLController} = require("./../../controllers/url.controller")

URLRouter.post("/new", AuthenticationMiddleware, CreateNewURLController)

module.exports = URLRouter