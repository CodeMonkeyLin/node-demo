var cluster = require('cluster');
const net = require('net');

var handle = net._createServerHandle('0.0.0.0', 3000);
var numCPUs = require('os').cpus().length; // 获取CPU的个数

if (cluster.isMaster) {
  for (var i = 0; i < 4; i++) {
    const worker = cluster.fork();
    worker.send({}, handle);
  }

  //   cluster.on('exit', function (worker, code, signal) {
  //     console.log('worker ' + worker.process.pid + ' died');
  //   });
} else {
  process.on('message', function (m, handle) {
    start(handle);
  });

  var buf = 'hello nodejs';
  var res = ['HTTP/1.1 200 OK', 'content-length:' + buf.length].join('\r\n') + '\r\n\r\n' + buf;

  var data = {};

  function start(server) {
    server.listen();
    server.onconnection = function (err, handle) {
      var pid = process.pid;
      if (!data[pid]) {
        data[pid] = 0;
      }
      data[pid]++;
      console.log('got a connection on worker, pid = %d', process.pid, data[pid]);
      var socket = new net.Socket({
        handle: handle
      });
      socket.readable = socket.writable = true;
      socket.end(res);
    }
  }
}
