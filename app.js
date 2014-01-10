var express = require('express'),
	util = require('util'),
    exec = require('child_process').exec,
	fs = require('fs'),
    child,
	app = express();


function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


// write sketch data to sketch.ino
function writeSketchData(directory, sketch, res, callback) {
	fs.writeFile(directory + "/src/sketch.ino", sketch, function(err) {
	    if(err) {
	        console.log(err);
		    res.send('error: ' + err);
	    } else {
		    callback();
        }
	});
}


function initInoProject(directory, res, callback) {
	child = exec('./inoInit.sh ' + directory, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
	    if(stderr) {
		    res.send('error: ' + stderr);
	    } else {
		   	callback();
	    }
	});
}

function buildInoProject(directory, res, callback) {
	child = exec('./inoBuild.sh ' + directory, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
	    if(stderr) {
		    res.send('error: ' + stderr);
	    } else {
		   	callback();
	    }
	});
}

function readHexFile(directory, res, callback) {
	fs.readFile(directory + '/.build/uno/firmware.hex', 'utf8', function (err, data) {
		if (err) {
			console.log(err);
			res.send('error: ' + err);
		}
		callback(data);
    })
}

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
	var directory = './compiled/' + randomString(25);

	initInoProject(directory, res, function() {
		writeSketchData(directory, sketch, res, function() {
			buildInoProject(directory, res, function() {
				readHexFile(directory, res, function(data) {
					res.send(data);
				})
			});
		});
	});

});

/*
app.post('/', function(req, res)
{
	var sketch = req.body;
	var directory = './compiled/' + randomString(25);

	// write sketch data to sketch.ino
	fs.writeFile("./src/sketch.ino", sketch, function(err) {
	    if(err) {
	        console.log(err);
		    res.send('error: ' + err);
	    } else {

		    // sketch was saved to sketch.ino
		    // build firmware
		    child = exec('./compile.sh ' + directory, function (error, stdout, stderr) {
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
*/

app.listen(3000);