var child_process = require('child_process');
var path = require('path');

var child = child_process.fork(path.resolve(__dirname, './child.js'));
child.on('message', function (m) {
  console.log('主线程收到消息', m);
});
child.send({
  hello: 'world'
});
