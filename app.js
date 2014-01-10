var express = require('express'),
	util = require('util'),
    exec = require('child_process').exec,
	fs = require('fs'),
	path = require('path'),
    child,
	app = express();

/*
 * Generate a random alphanumeric string
 */
function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

/*
 * Initialize a new ino project
 */
function initInoProject(directory, res, callback) {
	child = exec('./inoInit.sh ' + directory, function (error, stdout, stderr) {
        // console.log(stdout);
	    if(stderr) {
		    res.send('error: ' + stderr);
	    } else {
		   	callback();
	    }
	});
}

/*
 * Write the submitted sketch data to an .ino file
 */
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

/*
 * Build an ino project
 */
function buildInoProject(directory, res, callback) {
	child = exec('./inoBuild.sh ' + directory, function (error, stdout, stderr) {
        // console.log(stdout);
	    if(stderr) {
		    res.send('error: ' + stderr);
	    } else {
		   	callback();
	    }
	});
}

/*
 * Read the hex data generated from a built ino project
 */
function readHexFile(directory, res, callback) {
	fs.readFile(directory + '/.build/uno/firmware.hex', 'utf8', function (err, data) {
		if (err) {
			console.log(err);
			res.send('error: ' + err);
		}
		callback(data);
    });
}

/*
 * Send a hex file generated from a built ino project
 */
function sendHexFile(directory, res) {
	var file = path.join(__dirname, directory + '/.build/uno/firmware.hex');
	var filename = path.basename(file);
	res.setHeader('Content-disposition', 'attachment; filename=' + filename);
	var filestream = fs.createReadStream(file);
    filestream.pipe(res);
}

/*
 * Middleware for reading data from the request body
 */
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

app.get("/compiled/*",function(req, res){
	sendHexFile(req.path, res);
});

app.post('/', function(req, res) {
	var sketch = req.body;
	var directory = './compiled/' + randomString(12);

	initInoProject(directory, res, function() {
		writeSketchData(directory, sketch, res, function() {
			buildInoProject(directory, res, function() {
				sendHexFile(directory, res);
			});
		});
	});
});

app.listen(3000);