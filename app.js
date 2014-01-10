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

	// write sketch data to sketch.ino
	fs.writeFile("./src/sketch.ino", sketch, function(err) {
	    if(err) {
	        console.log(err);
		    res.send('error: ' + err);
	    } else {
		    // sketch was saved to sketch.ino
		    // build firmware
		    child = exec('./build.sh', function (error, stdout, stderr) {
		        console.log('stdout: ' + stdout);

			    if(stderr) {
				    res.send('error: ' + stderr);
			    } else {

				    // read compiled file
				    fs.readFile('./.build/uno/firmware.hex', 'utf8', function (err, data) {
				      if (err) {
						console.log(err);
						res.send('error: ' + err);
				      }
					    res.send(data);
				    })

		        }
		   	});

	    }
	});
});

app.listen(3000);