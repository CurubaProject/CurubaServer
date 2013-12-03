// Port of WEB server
PortApp = 8080;

// Port of TCP server
PortTCP = 5000;

// Path to logging

LogPath = './log/log.txt';


// Do not modify behong this point
//////////////////////////////////
exports.ConfigApp = {
	portApp : PortApp,
	portTCP : PortTCP,
	log : { logPath : LogPath }
};
//////////////////////////////////