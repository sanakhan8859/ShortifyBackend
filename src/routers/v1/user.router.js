const express = require('express')
const {FetchAllUrlsOfTheUserUsingUserIdController, DeleteUserByUserIdController} = require("./../../controllers/user.controller")
const {AuthenticationMiddleware, AuthoriztionMiddlewareGenerator} = require('./../../middlewares/auth.middleware')

const UserRouter = express.Router()

UserRouter.get("/urls", AuthenticationMiddleware, FetchAllUrlsOfTheUserUsingUserIdController)

UserRouter.delete("/delete/:userId", AuthenticationMiddleware, AuthoriztionMiddlewareGenerator("ORG_ADMIN"), DeleteUserByUserIdController)

module.exports = UserRouter