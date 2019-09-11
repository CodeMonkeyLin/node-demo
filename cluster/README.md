### cluster相关API

**Process 进程 、child_process 子进程 、Cluster 集群**

#### process进程

> process 对象是 Node 的一个全局对象，提供当前 Node 进程的信息，他可以在脚本的任意位置使用，不必通过 require 命令加载。

**属性**

1. **process.argv** 属性，返回一个数组，包含了启动 node 进程时的命令行参数
2. **process.env** 返回包含用户环境信息的对象，可以在 脚本中对这个对象进行增删改查的操作
3. **process.pid** 返回当前进程的进程号
4. **process.platform** 返回当前的操作系统
5. **process.version** 返回当前 node 版本

**方法**

1. **process.cwd()** 返回 node.js 进程当前工作目录
2. process.chdir() 变更 node.js 进程的工作目录
3. **process.nextTick(fn)** 将任务放到当前事件循环的尾部，添加到 ‘next tick’ 队列，一旦当前事件轮询队列的任务全部完成，在 next tick 队列中的所有 callback 会被依次调用
4. **process.exit()** 退出当前进程，很多时候是不需要的
5. process.kill(pid[,signal]) 给指定进程发送信号，包括但不限于结束进程

**事件**

1. beforeExit 事件，在 Node 清空了 EventLoop 之后，再没有任何待处理任务时触发，可以在这里再部署一些任务，使得 Node 进程不退出，显示的终止程序时（process.exit()），不会触发

2. exit 事件，当前进程退出时触发，回调函数中只允许同步操作，因为执行完回调后，进程金辉退出

3. **uncaughtException** 事件，当前进程抛出一个没有捕获的错误时触发，可以用它在进程结束前进行一些已分配资源的同步清理操作，尝试用它来恢复应用的正常运行的操作是不安全的

   > 重点关注

4. warning 事件，任何 Node.js 发出的进程警告，都会触发此事件

#### child_process

> nodejs中用于创建子进程的模块，node中大名鼎鼎的cluster是基于它来封装的。

1. **exec()**

 异步衍生出一个 shell，然后在 shell 中执行命令，且缓冲任何产生的输出，运行结束后调用回调函数

``` js
var exec = require('child_process').exec;

var ls = exec('ls -c', function (error, stdout, stderr) {
  if (error) {
    console.log(error.stack);
    console.log('Error code: ' + error.code);
  }
  console.log('Child Process STDOUT: ' + stdout);
});
```

由于标准输出和标准错误都是流对象（stream），可以监听data事件，因此上面的代码也可以写成下面这样。

```js
var exec = require('child_process').exec;
var child = exec('ls');

child.stdout.on('data', function(data) {
  console.log('stdout: ' + data);
});
child.stderr.on('data', function(data) {
  console.log('stdout: ' + data);
});
child.on('close', function(code) {
  console.log('closing code: ' + code);
});
```
上面的代码还有一个好处。监听data事件以后，可以实时输出结果，否则只有等到子进程结束，才会输出结果。所以，如果子进程运行时间较长，或者是持续运行，第二种写法更好。

2. **execSync()**

exec()的同步版本

3. **execFile()**

execFile方法直接执行特定的程序shell，参数作为数组传入，不会被bash解释，因此具有较高的安全性。

```js
const {execFile} = require('child_process');
execFile('ls',['-c'], (error, stdout, stderr) => {
	if(error) {
		console.error(`exec error: ${error}`);
		return;
	}
	console.log(`${stdout}`);
	console.log(`${stderr}`);
});
```

4. **spawn()**

spawn方法创建一个子进程来执行特定命令shell，用法与execFile方法类似，但是没有回调函数，只能通过监听事件，来获取运行结果。它属于异步执行，适用于子进程长时间运行的情况。

```js
const { spawn } = require('child_process');

var child = spawn('ls', ['-c'],{
    encoding: 'UTF-8'
});

child.stdout.on('data', function(data) {
    console.log('data', data.toString('utf8'))
});
child.on('close',function(code) {
    console.log('closing code: ' + code);
  });

```

> spawn返回的结果是Buffer需要转换为utf8

5. **fork()**

fork方法直接创建一个子进程，执行Node脚本，`fork('./child.js')` 相当于 `spawn('node', ['./child.js'])` 。与spawn方法不同的是，fork会在父进程与子进程之间，建立一个通信管道pipe，用于进程之间的通信,也是IPC通信的基础。

`main.js`

```js
var child_process = require('child_process');
var path = require('path');

var child = child_process.fork(path.resolve(__dirname, './child.js'));
child.on('message', function(m) {
  console.log('主线程收到消息', m);
});
child.send({ hello: 'world' });
```

`child.js`

```js
process.on('message', function (m) {
    console.log('子进程收到消息', m);
});
process.send({ foo: 'bar' });
```

#### cluster

node进行多进程的模块

**属性和方法**

1. **isMaster** 属性，返回该进程是不是主进程
2. **isWorker** 属性，返回该进程是不是工作进程
3. **fork()** 方法，只能通过主进程调用，衍生出一个新的 worker 进程，返回一个 worker 对象。和process.child的区别，不用创建一个新的child.js
4. setupMaster([settings]) 方法，用于修改 fork() 默认行为，一旦调用，将会按照cluster.settings进行设置。
5. settings 属性，用于配置，参数 exec: worker文件路径；args: 传递给 worker 的参数；execArgv: 传递给 Node.js 可执行文件的参数列表

**事件**

1. **fork** 事件，当新的工作进程被 fork 时触发，可以用来记录工作进程活动
2. **listening** 事件，当一个工作进程调用 listen() 后触发，事件处理器两个参数 worker：工作进程对象
3. **message**事件， 比较特殊需要去在单独的worker上监听。
4. online 事件，复制好一个工作进程后，工作进程主动发送一条 online 消息给主进程，主进程收到消息后触发，回调参数 worker 对象
5. **disconnect** 事件，主进程和工作进程之间 IPC 通道断开后触发
6. **exit** 事件，有工作进程退出时触发，回调参数 worker 对象、code 退出码、signal 进程被 kill 时的信号
7. setup 事件，cluster.setupMaster() 执行后触发


##### cluster中的优雅退出

1. 关闭异常 Worker 进程所有的 TCP Server（将已有的连接快速断开，且不再接收新的连接），断开和 Master 的 IPC 通道，不再接受新的用户请求。
2. Master 立刻 fork 一个新的 Worker 进程，保证在线的『工人』总数不变。
3. 异常 Worker 等待一段时间，处理完已经接受的请求后退出。

```
if (cluster.isMaster) {
	cluster.fork()
} else {
	// 出错之后
	process.disconnect();  // exit()
}	
```

##### 进程守护

master 进程除了负责接收新的连接，分发给各 worker 进程处理之外，还得像天使一样默默地守护着这些 worker 进程，保障整个应用的稳定性。一旦某个 worker 进程异常退出就 fork 一个新的子进程顶替上去。

这一切 cluster 模块都已经好处理了，当某个 worker 进程发生异常退出或者与 master 进程失去联系（disconnected）时，master 进程都会收到相应的事件通知。

```
cluster.on('exit', function () {
    clsuter.fork();
});

cluster.on('disconnect', function () {
    clsuter.fork();
});
```

##### IPC通信

IPC通信就是进程间的通信。

虽然每个 Worker 进程是相对独立的，但是它们之间始终还是需要通讯的，叫进程间通讯（IPC）。下面是 Node.js 官方提供的一段示例代码

```js
'use strict';
const cluster = require('cluster');

if (cluster.isMaster) {
  const worker = cluster.fork();
  worker.send('hi there');
  worker.on('message', msg => {
    console.log(`msg: ${msg} from worker#${worker.id}`);
  });
} else if (cluster.isWorker) {
  process.on('message', (msg) => {
    process.send(msg);
  });
}
```

cluster 的 IPC 通道只存在于 Master 和 Worker 之间，Worker 与 Worker 进程互相间是没有的。那么 Worker 之间想通讯该怎么办呢？通过 Master 来转发。

核心： worker直接的通信，靠master转发，利用workder的pid。