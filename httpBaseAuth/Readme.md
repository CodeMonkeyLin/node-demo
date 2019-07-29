## Http Basic Auth
https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Authentication

## node搭建Http Basic Auth
- 在头部增加
```js            
res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
```
## 运行
```bash
node httpBaseAuth/basicAuth.js
```

## nginx搭建Http Basic Auth
```bash
htpasswd -c -d /usr/local/etc/nginx/conf/htpasswd admin
```
>这个配置文件存放路径可以随意指定, 这里我指定的是nginx配置文件目录, 其中admin是指允许登录的用户名, 这个可以自定义

```nginx
location / {
    root   html;
    index  index.html index.htm;
    auth_basic "登录认证";
    auth_basic_user_file /usr/local/etc/nginx/conf/htpasswd;
}
```
>其中 auth_basic 和 auth_basic_user_file 是认证的配置, 注意密码文件的路径一定是上面生成的

## 相关参考
https://juejin.im/entry/5ac175baf265da239e4e3999