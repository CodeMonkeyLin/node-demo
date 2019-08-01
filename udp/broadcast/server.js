const dgram = require('dgram')

const server = dgram.createSocket('udp4')

server.on('listening',()=>{
    const address = server.address()
    console.log(`server running ${address.address}:${address.port}`)
    server.setBroadcast(true)
    setInterval(function(){
        server.send('hello xx',7000,'255.255.255.255')
    },2000)
})

server.on('message',(msg,remoteInfo)=>{
    const address = server.address()
    console.log(`server got ${msg} from ${remoteInfo.address}:${remoteInfo.port}`)
    server.send('world',remoteInfo.port,remoteInfo.address)
})

server.bind(3000)