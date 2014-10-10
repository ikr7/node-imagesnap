
var childProcess = require('child_process');
var path = require('path');

var imagesnap = path.resolve(__dirname, 'bin', 'imagesnap');

var getDevices = exports.getDevices = function(callback){
	childProcess.exec(imagesnap + ' -l', function(error, stdout, stderror){
		if(error){
			return callback(error);
		}
		if(stderror){
			return callback(stderror);
		}
		return callback(null, stdout.trim().split('\n').slice(1));
	});
};

var take = exports.take = function(device, callback){

	if(typeof device === 'function'){
		callback = device;
		device = false;
	}

	var opts = device ? ['-', '-d', device] : ['-'];

	var command = childProcess.spawn(imagesnap, opts).stdout;
	var image = new Buffer(0);

	command.on('data', function(chunk){
		var tmpbuf = new Buffer(image.length + chunk.length);
		image.copy(tmpbuf, 0);
		chunk.copy(tmpbuf, image.length);
		image = tmpbuf;
	});

	command.on('end', function(){
		callback(null, image);
	});
};
