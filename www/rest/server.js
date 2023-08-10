const socket=require('../soket/socket')
const http=require('http')
const startServer=(app)=>{
    const server=http.createServer(app)
        server.listen(process.env.REST_PORT)
        server.on('listening',()=>{
            console.log(`server is listening on port :${server.address().port}`)
            socket.startSocket(server)

        })
        server.on('error',(err)=>{
            console.log(`Error : ${err}`)
        })
        server.on('disconnect',()=>{
        console.log(`server is disconnected`)
    });
}
module.exports={    
    startServer:startServer
}