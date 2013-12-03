var express = require('express'),
   Communication = require('./communication/control'),
	Config = require('./config.app').ConfigApp,
	EVENTLOG = require('./events/console')(Config.log),
	Device = require('./core/device'),
	Job = require('./job/jobControl');

var app = express();

Communication.init({
	app : app,
	portApp : Config.portApp,
	portTCP : Config.portTCP
});

Job.init();