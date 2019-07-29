var http = require('http');

http.createServer(function(req,res){
    var header=req.headers['authorization']||'',        // get the header
        token=header.split(/\s+/).pop()||'',            // and the encoded auth token
        auth=new Buffer.from(token, 'base64').toString(),    // convert from base64
        parts=auth.split(/:/),                          // split on colon
        username=parts[0],
        password=parts[1];
    
        if((username=='admin') && (password=123456)){     
            res.writeHead(200,{'Content-Type':'text/plain'});
            res.end('username is "'+username+'" and password is "'+password+'"');
        }else {
            res.statusCode = 401; 
            res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
            res.end();
        }
  
  
  }).listen(3000,'127.0.0.1');

// var http = require('http');
 
// var server = http.createServer(function(req, res) {
//     var auth = req.headers['authorization'];          
//     console.log("Authorization Header is: ", auth);
// 	if(!auth) {     
// 		res.statusCode = 401;
// 		res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
// 		res.end();
// 	} else if(auth) {
// 		var tmp = auth.split(' '); 
// 		var buf = new Buffer(tmp[1], 'base64');                 
// 		var plain_auth = buf.toString();
// 		console.log("Decoded Authorization ", plain_auth);
// 		var creds = plain_auth.split(':');      // split on a ':'
//         var username = creds[0];
//         var password = creds[1];
// 		if((username == 'hack') && (password == 'thegibson')) {  
// 			res.statusCode = 200;  // OK
//         	res.end('<html><body>登录成功!</body></html>');
//        	 } else {
//             res.statusCode = 401; 
// 			res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
// 			res.end();
//         }
//     }
// }).listen(5000, function() { console.log("Server Listening on http://localhost:5000/"); });