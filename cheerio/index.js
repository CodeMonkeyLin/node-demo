const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true, gotoTimeout: 2000 })
const cheerio = require("cheerio");

selector = 'html'
nightmare
    .goto('http://47.99.110.113:51070/dfshealth.html#tab-overview')
    .evaluate(selector => {
        return document.querySelector(selector).innerHTML
    }, selector)
    .end()
    .then(body => {
        const $ = cheerio.load(body);
        console.log($('#tab-overview table').eq(1).find('tr').eq(1).find('td').html())
    })
    .catch(error => {
        console.error('Search failed:', error)
    })
