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
var ListDeviceConnected = [];

var getListDeviceConnected = function () {
	return ListDeviceConnected;
};

var DeviceRegistrer = {
	sqlRequest : SQLRequest.REGISTRERDEVICE,
	callback : function (data) {
	    // Nothing to be done here.
	},
	getQuery : function (newDevice) {
		return Util.format(this.sqlRequest,
								newDevice.deviceId,
								newDevice.deviceType,
								newDevice.deviceState,
								newDevice.deviceIP,
								newDevice.deviceNumber);
	},
	saveDevice : function (newDevice) {
		var that = this;

      DbRequest.Query(that.getQuery(newDevice), function (data) {
         that.callback(data);
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

		ListDeviceConnected.push(newDevice);
		DeviceRegistrer.saveDevice(newDevice);
	}, 'clients');
})();

exports.getListDeviceConnected = getListDeviceConnected;