const net = require('net');
const fork = require('child_process').fork;

var handle = net._createServerHandle('0.0.0.0', 3000);

for (var i = 0; i < 4; i++) {
  console.log('11111111111111111111111111')
  fork('./worker').send({}, handle);
}
