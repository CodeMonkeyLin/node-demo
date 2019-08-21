// setTimeout(function() {
//         console.log('setTimeout')
// }, 2)
// setImmediate(function() {
//     console.log('setImmediate')
// })

const fs = require('fs')
const path = require('path')
fs.readFile(path.resolve(__dirname, './read.txt'), function() {
    setTimeout(function() {
        console.log('setTimeout')
    })
    setImmediate(function() {
        console.log('setImmediate')
    })
})