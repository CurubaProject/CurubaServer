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
// TODO belm : RENAME CORE
var binaryParser = require('../communication/binaryParser'),
	 Converter = require('../communication/converter');
	 constant = require('../communication/constant'); // TODO belm : Check if this is needed.
	 SQLRequest = require('../db/request').Request,
	 Util = require('util'),
	 DbRequest = require('../db/dbRequest');
	 
var getMessage = function (payLoadID, params, callback) {
	var status = 1;//Converter.getModuleConstant('DEVICESTATUS', 1);
	var state = Converter.getModuleConstant('DEVICESTATE', params.Parameters.DeviceState);
	console.log('state:'  + state);
	console.log('stateP:'  + params.Parameters.DeviceState);

	var deviceGUID = undefined;
	DbRequest.Query(Util.format(SQLRequest.SELECTDEVICEGUID, params.DeviceId), function (data) {
		var message = {
			payload : binaryParser.getBuffer(payLoadID, {
				'deviceNumber' : params.DeviceNumber,
				'status' : status,
				'state' : state,
				'analogRead' : params.Parameters.DeviceValue
			}),
			device : { deviceId : data[0].DeviceGUID , deviceNumber : params.DeviceNumber }
		};

		callback(message);
	});
		
};

exports.getMessage = getMessage;