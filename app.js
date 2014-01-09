var express = require('express'),
	util = require('util'),
    exec = require('child_process').exec,
	fs = require('fs'),
    child,
	app = express();

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
	var sketch = req.body;

	fs.writeFile("./ino/src/sketch.ino", sketch, function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("Sketch was saved!");
	    }
	});

    // console.log(req.body);
	child = exec('cd ino; ino build; cd ..;',
		function (error, stdout, stderr) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
	res.send('received data');
});

app.listen(3000);