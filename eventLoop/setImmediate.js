
const fs = require('fs')
const path = require('path')


const fs = require('fs')
const path = require('path')
fs.readFile(path.resolve(__dirname, './read.txt'), function () {
    setTimeout(function () {
        process.nextTick(function () {
            console.log('nextTick1')
        })
        console.log('setTimeout')
    })
    setImmediate(function () {
        process.nextTick(function () {
            console.log('nextTick3')
        })
        console.log('setImmediate')
    })
    console.log(1)
    process.nextTick(function () {
        console.log('nextTick2')
    })
})
// for (var i = 0; i < 1024 * 1024; i++) {
//     process.nextTick(function () { Math.sqrt(i) })
// }

for (var i = 0; i < 1024 * 1024; i++) {
    setTimeout(function () { Math.sqrt(i) })
}
