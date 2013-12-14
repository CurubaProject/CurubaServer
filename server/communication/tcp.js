// ----------------------------------------------------------------------------
// This file is part of "Curuba Server".
//
// "Curuba Server" is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// "Curuba Server" is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with "Curuba Server".  If not, see <http://www.gnu.org/licenses/>.
// ----------------------------------------------------------------------------
var net = require('net'),
    binaryParser = require('./binaryParser'),
	Publisher = require('../events/publisher').Publisher,
	EVENTTYPE = require('../events/eventType').EVENTTYPE,
	PayloadType = require('commun/payloadType');

var devices = [],
    IDLETIMEOUT = 1000 * 60 * 1/2;

// net.createServer create a TCP server, the function pass in parameter define
// every events.
var createTCPServer = function (port) {
    return net.createServer(function (device) {
        var that = this;
        device.name = device.remoteAddress + ":" + device.remotePort;
        device.setKeepAlive(true, IDLETIMEOUT);

        device.setTimeout(IDLETIMEOUT, function () {
            devices.splice(devices.indexOf(device), 1);
			
			if (devices.indexOf(device) === -1) {
				if (device.infoDevice[0]) {
					Publisher.publish({
						deviceId : device.infoDevice[0].deviceId
					}, 'clientsDeconection');
				}
				device.end();
				
				Publisher.publish({ type : EVENTTYPE.LOG, message : device.name + ': end' }, 'events');
			} else {
				this();
			}
        });

        device.on('end', function () {
            devices.splice(devices.indexOf(device), 1);

			if (devices.indexOf(device) === -1) {
				if (device.infoDevice[0]) {
					Publisher.publish({
						deviceId : device.infoDevice[0].deviceId
					}, 'clientsDeconection');
				}
				
				Publisher.publish({ type : EVENTTYPE.LOG, message : device.name + ': end' }, 'events');
			} else {
				this();
			}
        });

        device.on('close', function () {
            devices.splice(devices.indexOf(device), 1);
			
			if (devices.indexOf(device) === -1) {
				if (device.infoDevice[0]) {
					Publisher.publish({
						deviceId : device.infoDevice[0].deviceId
					}, 'clientsDeconection');
				}
				
				device.end();
				Publisher.publish({ type : EVENTTYPE.LOG, message : device.name + ': end' }, 'events');
			} else {
				this();
			}
        });

        device.on('error', function (err) {
			Publisher.publish({ type : EVENTTYPE.ERROR, message : err }, 'events');
        });

        device.on('data', function (data) {
            var decodedData = binaryParser.parser(data);
			console.log(decodedData);
			
			this.deviceId = '' + decodedData.mac_nic_1 + decodedData.mac_nic_2 + decodedData.mac_nic_3;
			if ( decodedData.payload === PayloadType.INFORESPONSE && !deviceExist(devices, device.deviceId, decodedData.deviceNumber) ) {
				this.deviceId = '' + decodedData.mac_nic_1 + decodedData.mac_nic_2 + decodedData.mac_nic_3;
				this.infoDevice.push({ deviceId : device.deviceId, deviceNumber : decodedData.deviceNumber });
				devices.push(this);

				Publisher.publish({
					deviceId : device.deviceId,
					deviceNumber : decodedData.deviceNumber,
					deviceState :  decodedData.state,
					deviceType : decodedData.type,
					deviceIP : device.remoteAddress
				}, 'clients');
				Publisher.publish({ type : EVENTTYPE.LOG, message : 'Registrer : ' + device.deviceId }, 'events');
			} else if ( decodedData.payload === PayloadType.HEARTBEAT ) {
				Publisher.publish({
					deviceId : device.deviceId,
					deviceNumber : decodedData.deviceNumber,
					deviceState :  decodedData.state,
					deviceType : decodedData.type,
					deviceIP : device.remoteAddress,
					deviceData : decodedData.analogicRead
				}, 'hearbeat');
				
				Publisher.publish({ type : EVENTTYPE.LOG, message : 'Update Device : ' + device.deviceId }, 'events');
				
				device.write(binaryParser.getBuffer(PayloadType.HEARTBEATREQUEST, undefined));
			}
        });
        var message = 'Connected : ' + device.name;
        Publisher.publish({type : EVENTTYPE.LOG, message : message}, 'events');
		
		device.infoDevice = [];
        device.write(binaryParser.getBuffer(PayloadType.INFOREQUEST, undefined));
    }).listen(port);
};

var deviceExist = function (listDevice, deviceID, deviceNumber) {
	var exist = false;
			
	for (var index = 0; index < listDevice.length; index++ ) {
		var infoDevice = listDevice[index].infoDevice;
		for(var index2 = infoDevice.length; index--;) {
			if (infoDevice[index2].deviceId === deviceID && infoDevice[index2].deviceNumber === deviceNumber) {
				exist = true;
				break;
			}
		}
	}

	return exist;
};

var broadcast = function (message) {
    devices.forEach(function (client) {
        client.write(message);
    });
};

var subscribe = (function () {
	Publisher.subscribe(function (message) {
		sendMessage(message.payload, {
			deviceId:message.device.deviceId,
			deviceNumber:message.device.deviceNumber
		});
	}, 'devices');
})();

var sendMessage = function (message, currentDevice) {
	var success = false;

	firstLoop  : for (var index0 = devices.length; index0--; ) {
		var device = devices[index0];
		for (var index = device.infoDevice.length; index--;) {
			if (device.infoDevice[index].deviceId === currentDevice.deviceId && 
				device.infoDevice[index].deviceNumber == currentDevice.deviceNumber) {
				device.write(message);
				success = true;
				console.log('Message sent!');
				break firstLoop;
			}
		}
	}

    return { 'success' : success };
};

process.on('SIGUSR1', function () {
	createTCPServer.close();
	process.exit( );
});

process.on( 'SIGINT', function() {
	createTCPServer.close();
	process.exit( );
});

exports.broadcast = broadcast;
exports.createTCPServer = createTCPServer;
exports.sendMessage = sendMessage;

// TODO belm : move this code to a test file? You know what to do.
// TODO For Debug Only
////////////////////////////////////////////////////////////////
var PAYLOADNUMBER = 30,
	 STATUS = 1,
	 state = 1;

var analogValue = 0;

var index = 0;

var test = function (device) {

	var sended = binaryParser.getBuffer(PAYLOADNUMBER, {
		deviceNumber : 1,
		status : STATUS,
		state : state++,
		analogRead : analogValue
	});

	device.write(sended);

	console.log(index++);
	console.log(sended);

	setTimeout(function () { test(device); }, 3000);

	if (state >= 3)
		state = 1;

	analogValue += 5;

	if (analogValue >= 100)
		analogValue = 0;
};
////////////////////////////////////////////////////////////////