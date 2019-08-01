const dgram = require('dgram')

const client = dgram.createSocket('udp4')

client.on('listening',()=>{
    const address = client.address()
    console.log(`server running ${address.address}:${address.port}`)
    client.send('hello' , 3000, 'localhost')
})

client.on('message',(msg,remoteInfo)=>{
    // const address = client.address()
    console.log(`server got ${msg} from ${remoteInfo.address}:${remoteInfo.port}`)
})

client.on('error',(err)=>{
    console.log('client error',err)
})

client.bind(4000,function(){
    client.addMembership('224.1.2.3');
});