const dgram = require('dgram')

const client = dgram.createSocket('udp4')

// client.send('hello' , 3000, 'localhost')

// client.on('listening',()=>{
//     const address = client.address()
//     console.log(`server running ${address.address}:${address.port}`)
// })

client.on('message',(msg,remoteInfo)=>{
    const address = client.address()
    console.log(`server got ${msg} from ${remoteInfo.address}:${remoteInfo.port}`)
})

client.on('error',(err)=>{
    console.log('client error',err)
})

client.bind(7000)