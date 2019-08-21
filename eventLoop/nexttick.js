// setTimeout(function() {
//         console.log('setTimeout')
// }, 2)
// setImmediate(function() {
//     console.log('setImmediate')
// })

// const fs = require('fs')
// const path = require('path')
// fs.readFile(path.resolve(__dirname, './read.txt'), function() {

//     setTimeout(function() {
//         console.log('setTimeout')
//     })
//     setImmediate(function() {
//         console.log('setImmediate')
//         process.nextTick(function() {
//             console.log('nextTick3')
//         })
//     })
//     process.nextTick(function() {
//         console.log('nextTick1')
//     })
//     process.nextTick(function() {
//         console.log('nextTick2')
//     })
//     console.log(999)
// })

// for (var i = 0; i < 1024 * 1024; i++) {
//     process.nextTick(function() { Math.sqrt(i) })
// }
// for (var i = 0; i < 1024 * 1024; i++) {
//     setTimeout(function() { Math.sqrt(i) }, 0)
// }