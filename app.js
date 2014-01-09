var express = require('express');
var app = express();

app.use (function(req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        req.body = data;
        next();
    });
});

app.post('/', function(req, res)
{
    console.log(req.body);
	res.send('received data');
});

app.listen(3000);