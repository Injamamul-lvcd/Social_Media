const envConfig =require('dotenv').config({debug: process.env.DEBUG});

if(envConfig.error){
    throw envConfig.error;
}

const express=require('express');
const database=require('./www/db/db')
const fs=require('fs');
const path=require('path');

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const routesPath='./src/routes';
fs.readdirSync(routesPath).forEach((file)=>{
    if(~file.indexOf('.js'))
    {
        let route=require(routesPath+'/'+file)
        route.setRouter(app)

    }
});

//start the Database
database.startDB(app);