var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length; // 获取CPU的个数

if (cluster.isMaster) {
  for (var i = 0; i < numCPUs / 4; i++) {
    const worker = cluster.fork();
    worker.send('hello child')
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', (msg) => {
      console.log(`子进程消息 ${msg}`)
    });
  }
  cluster.on('exit', function (worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  process.on('message', (msg) => {
    console.log(`主进程消息 ${msg}`)
  });
  process.send('hello master');
  http.createServer(function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
  }).listen(8000);
}
