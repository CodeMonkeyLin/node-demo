var Xray = require('x-ray')
var x = Xray()

x('http://47.99.110.113:51070/dfshealth.html#tab-overview', 'body@html')((err, body) => {
    console.log(body)
})