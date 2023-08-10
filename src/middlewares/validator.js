const { model } = require('mongoose')
const responseLib=require('../libs/responseLib')

const Joi=require('joi').extend(require('@joi/date'))

// login validation schema
const customLoginValidSchema=Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().required(),
    type:Joi.string().required(),
    password:Joi.string().required()
})

//register validation schema
const customRegisterValidateSchema=Joi.object({
    name:Joi.string().required(),
    password:Joi.string().required(),
    otp:Joi.number().required(),
    type:Joi.string().required(),
    email:Joi.string().email().required(),
    mobile:Joi.string().length(10).required()
})
//forget password validation schema
const forgetPasswordValidateSchema =Joi.object({
    email:Joi.string().email().required(),
    otp:Joi.number().required(),
    newPassword:Joi.string().required(),
    type:Joi.string().required()
    
})
//type validate
let typeValidate=async(req,res,next)=>{
    const type = req.body.type;
    switch(type) {
        case 'login':
            await loginValidate(req,res,next); 
              break;
        case 'register':
            await registerValidate(req,res,next);
              break;  
        case 'forgetPassword':
            await forgetPasswordValidate(req,res,next);
              break; 
        }   
}
//login validation
let loginValidate=async(req,res,next)=>{
    try{
        const value=await customLoginValidSchema.validate(req.body)
        if(value.hasOwnProperty('error'))
        {
            throw new Error(value.error)
        }else{
            next()
        }
    }catch(err){
        res.status(400).send(responseLib.generate(true,err.message,null));
    }
}

// register validation
let registerValidate=async(req,res,next)=>{
    try{
        const value=await customRegisterValidateSchema.validate(req.body)
        if(value.hasOwnProperty('error')){
            throw new Error(value.error)
        }
        else{
            next()
        }
    }catch(err){
        res.status(400).send(responseLib.generate(true,err.message,null));
    }
}

//forgetPassword validation
let forgetPasswordValidate=async(req,res,next)=>{
    try{
        const value=await forgetPasswordValidateSchema.validate(req.body);
        console.log('--',value);
        if(value.hasOwnProperty('error'))
        {
            throw new Error(value.error);
        }else{
            next();
        }
    }catch(err){
        res.status(400).send(responseLib.generate(true,err.message,null));
    }
}

module.exports={
    typeValidate: typeValidate
}
