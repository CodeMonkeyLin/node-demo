const dgram = require('dgram')

const server = dgram.createSocket('udp4')

server.on('listening',()=>{
    const address = server.address()
    console.log(`server running ${address.address}:${address.port}`)
    setInterval(function(){
        server.send('hello xx',4000,'224.1.2.3')
    },2000)
})

server.on('message',(msg,remoteInfo)=>{
    const address = server.address()
    console.log(`server got ${msg} from ${remoteInfo.address}:${remoteInfo.port}`)
    server.send('world',)
})

server.bind(3000)