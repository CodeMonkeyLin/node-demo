##  nodejs事件循环

**当Node.js启动时会初始化event loop, 每一个event loop都会包含按如下六个循环阶段，nodejs事件循环和浏览器的事件循环完全不一样。**

###  阶段概览

- **timers(定时器)** : 此阶段执行那些由 `setTimeout()` 和 `setInterval()` 调度的回调函数.

- **I/O callbacks(I/O回调)** : 此阶段会执行几乎所有的回调函数, 除了 **close callbacks(关闭回调)** 和 那些由 **timers** 与 `setImmediate()`调度的回调.

  > setImmediate 约等于 setTimeout(cb,0)

- idle(空转), prepare : 此阶段只在内部使用

- **poll(轮询)** : 检索新的I/O事件; 在恰当的时候Node会阻塞在这个阶段

- check(检查) : `setImmediate()` 设置的回调会在此阶段被调用

- close callbacks(关闭事件的回调): 诸如 `socket.on('close', ...)` 此类的回调在此阶段被调用

在事件循环的每次运行之间, Node.js会检查它是否在等待异步I/O或定时器, 如果没有的话就会自动关闭.

> 如果event loop进入了 poll阶段，且代码未设定timer，将会发生下面情况：
>
> - 如果poll queue不为空，event loop将同步的执行queue里的callback,直至queue为空，或执行的callback到达系统上限;
> - 如果poll queue为空，将会发生下面情况：
>   - 如果代码已经被setImmediate()设定了callback, event loop将结束poll阶段进入check阶段，并执行check阶段的queue (check阶段的queue是 setImmediate设定的)
>   - 如果代码没有设定setImmediate(callback)，event loop将阻塞在该阶段等待callbacks加入poll queue,一旦到达就立即执行
>
> 如果event loop进入了 poll阶段，且代码设定了timer：
>
> - 如果poll queue进入空状态时（即poll 阶段为空闲状态），event loop将检查timers,如果有1个或多个timers时间时间已经到达，event loop将按循环顺序进入 timers 阶段，并执行timer queue.


### 代码执行

> 在nodejs中， setTimeout(demo, 0) === setTimeout(demo, 1)
>
> 在浏览器里面 setTimeout(demo, 0) === setTimeout(demo, 4)

```js
setTimeout(function timeout () {
  console.log('timeout');
},1);

setImmediate(function immediate () {
  console.log('immediate');
});
// setImmediate它有时候是1ms之前执行，有时候又是1ms之后执行？
```

> 因为event loop的启动也是需要时间的，可能执行到poll阶段已经超过了1ms，此时setTimeout会先执行。反之setImmediate先执行

```js
var path = require('path');
var fs = require('fs');

fs.readFile(path.resolve(__dirname, '/read.txt'), () => {
    setImmediate(() => {
        console.log('setImmediate');
    })
    
    setTimeout(() => {
        console.log('setTimeout')
    }, 0)
});
```


