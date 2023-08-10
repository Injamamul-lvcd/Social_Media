//response generation format for api
const encLib=require('./encLib')


//generate encrypted response
let generateEnc=(err,message,data)=>{
    let response={
        error:err,
        message:message,
        data:data?encLib.encrypt(data).toString('base64'):data
    }
    return response
}


// generate normal response
let generate=(err,message,data)=>{
    let response={
        err:err,
        message:message,
        data:data
    }
    return response
}

module.exports={
    generate:generate,
    generateEnc:generateEnc
}