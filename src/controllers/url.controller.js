const {CreateNewURLService, GetURLDetailsUsingItsKeyIdService, UpdateTheURLUsingMongoIdService} = require("./../services/url.service")
const {GenerateUniqueIdForTheURLUtil} = require("./../utils/url.utils")
require("dotenv").config()

const geoip = require('geoip-lite')

const NODE_ENV = process.env.NODE_ENV

const PORT = process.env[`${NODE_ENV}_PORT`]

const CreateNewURLController = async (req, res)=>{
    try{

        const userId = req.userId

        const {originalURL} = req.body

        if(!originalURL){
            const err = new Error("originalURL is missing inside the body")
            err.statusCode = 400
            throw err
        }

        const keyId = GenerateUniqueIdForTheURLUtil(6)

        const CreateNewURLServiceResult = await CreateNewURLService(originalURL, keyId, userId)

        if(!CreateNewURLServiceResult.success){
            const err = new Error("Unable to create new URL")
            err.statusCode = 500
            throw err
        }

        const {data : {keyId : keyIdFromDB}} = CreateNewURLServiceResult

        const baseURL = NODE_ENV==="DEV" ? "localhost:" + PORT : req.host

        res.status(201).json({
            success : true,
            message : "New URL is created",
            redirectURL : `http://${baseURL}/${keyIdFromDB}`
        })

    }catch(err){

        console.log(`Error in CreateNewURLController with err : ${err}`)

        res.status(err.statusCode ? err.statusCode : 500).json({
            success : false,
            message : err.message
        })

    }
}

const RedirectURLController = async (req, res)=>{
    try{

        const ip = req.ip

        const geography = geoip.lookup(ip)

        const {keyId} = req.params

        if(!keyId){
            const err = new Error("keyId is required")
            err.statusCode = 400
            throw err
        }

        const GetURLDetailsUsingItsKeyIdServiceResult = await GetURLDetailsUsingItsKeyIdService(keyId)

        if(!GetURLDetailsUsingItsKeyIdServiceResult.success){
            const err = new Error("Unable to fetch data from GetURLDetailsUsingItsKeyIdService")
            err.statusCode = 400
            throw err
        }

        const { data : {_id : mongoId, originalUrl, clickedCount, createdAt}} = GetURLDetailsUsingItsKeyIdServiceResult

        // check if clickedCount < 10
        if(clickedCount>10){
            const err = new Error("You have reached the max limit of 10 request. Please upgrade for more limits")
            err.statusCode = 400
            throw err
        }

        // check if it is newer than 7 days
        if((new Date().getTime()-createdAt)>7*24*60*60*1000){
            const err = new Error("Your redirect url is expired. Please upgrade for more expire limits")
            err.statusCode = 400
            throw err
        }

        // update the URL in db
        const UpdateTheURLUsingMongoIdServiceResult = await UpdateTheURLUsingMongoIdService(mongoId, geography?.region, geography?.country)

        if(!UpdateTheURLUsingMongoIdServiceResult.success){
            const err = new Error(`Error while updating the URL in db`)
            err.statusCode = 500
            throw err
        }

        res.redirect(originalUrl)

    }catch(err){

        console.log(`Error in RedirectURLController with err : ${err}`)

        res.status(err.statusCode?err.statusCode:500).json({
            success : false,
            message : err.message
        })

    }
}

module.exports = {
    CreateNewURLController,
    RedirectURLController
}