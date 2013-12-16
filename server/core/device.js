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
var Publisher = require('../events/publisher').Publisher,
	SQLRequest = require('../db/request').Request,
	Util = require('util'),
    DbRequest = require('../db/dbRequest');

var db = undefined;
var listDeviceConnected = [];

var getListDeviceConnected = function () {
	return listDeviceConnected;
};

var DeviceRegistrer = {
	sqlRequestRegister : SQLRequest.REGISTRERDEVICE,
	sqlRequestAddCustomInfo : SQLRequest.AddCUSTOMINFO,
	sqlRequestSelectDeviceId : SQLRequest.SELECTDEVICEID,
	sqlRequestAddDeviceConsumption : SQLRequest.ADDSTATISTICS,
	callback : function (newDevice) {
		var that = this;

	    DbRequest.Query(that.getQuerySelectDeviceId(newDevice), function (data) {
			that.callbackCustomInfo(data[0].idDevice);
        });
	},
	callbackCustomInfo : function (data) {
		var that = this;
		// TODO UPDATE??
		DbRequest.Query(that.getQueryCustomInfo(data), function (data) {
        });
	},
	getQuery : function (newDevice) {
		var that = this;
		
		return Util.format(that.sqlRequestRegister, 
								newDevice.deviceId, 
								newDevice.deviceType, 
								newDevice.deviceState, 
								newDevice.deviceIP, 
								newDevice.deviceNumber);
	},
	getQuerySelectDeviceId : function (newDevice) {
		var that = this;
	
		return Util.format(that.sqlRequestSelectDeviceId, newDevice.deviceId, newDevice.deviceNumber);
	},
	getQueryCustomInfo : function (deviceId) {
		var that = this;
		
		return Util.format(that.sqlRequestAddCustomInfo, deviceId);
	},
	saveDevice : function (newDevice) {
		var that = this;

		DbRequest.Query(that.getQuery(newDevice), function (data) {
			that.callback(newDevice);
		});
	},
	saveDeviceConsumption : function (device) {
		var that = this;
		
	    DbRequest.Query(that.getQuerySelectDeviceId(device), function (data) {
			DbRequest.Query(Util.format(that.sqlRequestAddDeviceConsumption, data[0].idDevice, device.deviceData), function (data) {
			// NOTHING TO DO
			});
        });
	}

};

var subscribe = (function () {
	Publisher.subscribe(function (device) {
		var newDevice = {
			deviceId : device.deviceId,
			deviceNumber : device.deviceNumber,
			deviceType : device.deviceType,
			deviceState : device.deviceState,
			deviceIP : device.deviceIP
		};

		listDeviceConnected.push(newDevice);
		DeviceRegistrer.saveDevice(newDevice);
	}, 'clients');
})();

var subscribeDeconection = (function () {
	Publisher.subscribe(function (device) {
		var oldDevice = {
			deviceId : device.deviceId,
			deviceNumber : device.deviceNumber
		};
		
		for (var index = listDeviceConnected.length; index--;) {
			if (oldDevice.deviceId === listDeviceConnected[index].deviceId) {

				listDeviceConnected.pop(listDeviceConnected[index]);
			}
		}
	}, 'clientsDeconection');
})();

var subscribeHearbeat = (function () {
	Publisher.subscribe(function (device) {
		var newDevice = {
			deviceId : device.deviceId,
			deviceNumber : device.deviceNumber,
			deviceType : device.deviceType,
			deviceState : device.deviceState,
			deviceIP : device.deviceIP,
			deviceData : device.deviceData
		};
		
		DeviceRegistrer.saveDevice(newDevice);
		DeviceRegistrer.saveDeviceConsumption(newDevice);
	}, 'hearbeat');
})();

exports.getListDeviceConnected = getListDeviceConnected;