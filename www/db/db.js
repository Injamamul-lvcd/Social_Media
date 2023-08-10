let dataAPI;
const mode=process.env.NODE_ENV;
const mongoose=require('mongoose');
const server=require('../rest/server');

const startDB=(app)=>{
    console.log(`Environment : ${mode} Database : ${process.env.DATABASE_TYPE}`)
    try{
        mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true, useUnifiedTopology: true })
        mongoose.connection.on('error',(err)=>{
            console.log(`database error :${err}`)
        })
        mongoose.connection.on('open',(err)=>{
            if(err)
            {
                console.log(`database error:${JSON.stringify(err)}`)
                process.exit(1)
            }
            else
             {
                console.log(`database connection open succsss`)
                server.startServer(app)
            }
        })
    }catch(err)
    {
        console.log(`Database connection open Error :${err}`)
    }
  

}
mongoose.set('debug',true)

module.exports={
    startDB:startDB
}

//mongodb://root:kzwjjQd7T%239Pc35%2A@localhost:27017/
//mongodb+srv://system:system@socailmedia.y10dbva.mongodb.net/?retryWrites=true&w=majority