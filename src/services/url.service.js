const URLSModel = require("./../models/urls.model")

async function CreateNewURLService(originalUrl, keyId, userId){
    try{

        const result = await URLSModel.create({"originalUrl" : originalUrl, "keyId" : keyId, "userId" : userId})

        if(!result){
            throw new Error("unable to call URLSModel.create()")
        }

        return {
            success : true,
            data : result
        }

    }catch(err){

        console.log(`Error in CreateNewURLService for originalUrl : ${originalUrl} & keyId : ${keyId} `)

        return {
            success : false
        }

    }
}

async function GetURLDetailsUsingItsKeyIdService(keyId){
    try{

        const URLDetail = await URLSModel.findOne({"keyId":keyId}).exec()

        if(!URLDetail){
            throw new Error(`Unable to fetch detail for URL with keyId : ${keyId} `)
        }

        return {
            success : true,
            data : URLDetail
        }

    }catch(err){
        console.log(`Error in GetURLDetailsUsingItsKeyIdService with err : ${err}`)
        return {
            success : false
        }
    }
}

async function UpdateTheURLUsingMongoIdService(mongoId, city, country) {
    try{

        const URL = await URLSModel.findOne({_id:mongoId}).exec()

        URL.clickedCount = URL.clickedCount + 1
        
        URL.openedAtTimestamp = URL.openedAtTimestamp.push(new Date().getTime())

        if(city || country){
            URL.openedAtLocation = URL.openedAtLocation.push(`${country}-${city}`)
        }

        await URL.save()

        return {
            success : true
        }

    }catch(err){
        console.log(`Error in UpdateTheURLUsingMongoIdService with err : ${err}`)
        return {
            success : false
        }
    } 
}

async function GetURLsOfTheUserUsingUserIdService(userId){
    try{

        const URLS = await URLSModel.find({"userId":userId}).exec()

        if(!URLS){
            throw new Error(`Unable to fetch URLS with userId : ${userId} `)
        }

        return {
            success : true,
            message : `${URLS.length} urls are sent`,
            data : URLS
        }

    }catch(err){
        console.log(`Error in GetURLsOfTheUserUsingUserIdService with err : ${err}`)
        return {
            success : false
        }
    }
}

module.exports = {
    CreateNewURLService,
    GetURLDetailsUsingItsKeyIdService,
    UpdateTheURLUsingMongoIdService,
    GetURLsOfTheUserUsingUserIdService
}