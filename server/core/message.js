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
// TODO belm2440 : RENAME CORE
var binaryParser = require('../communication/binaryParser'),
	 converter = require('../communication/converter');
	 constant = require('../communication/constant'); // TODO belm2440 : Check if this is needed.

var getMessage = function (payLoadID, params) {
	var status = 1;//converter.getModuleConstant('DEVICESTATUS',
						//								  1);
	var state = converter.getModuleConstant('DEVICESTATE', params.Parameters.DeviceState);

	var message = {
		payload : binaryParser.getBuffer(payLoadID, {
			'deviceNumber' : 1,
			'status' : status,
			'state' : state,
			'analogRead' : params.Parameters.DeviceValue
		}),
		DeviceId : params.DeviceId
	};

	return message;
};

exports.getMessage = getMessage;