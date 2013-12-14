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
var TypeJob = require('./typeJob'),
	PayloadType = require('commun/payloadType'),
	EVENTTYPE = require('../events/eventType').EVENTTYPE,
	Util = require('util');

var jobfactory = function (type, params) {
	var jobAction = undefined;

	switch (type) {
		case TypeJob.DEVICECONTROLE :
			jobAction = {
				execute : function () {
					Publisher.publish(Message.getMessage(PayloadType.CONTROLREQUEST, {
						DeviceId : params.DeviceId,
						deviceNumber : params.deviceNumber,
						Parameters : {
							DeviceStatus : params.Status,
							DeviceState : params.State,
							DeviceValue : params.Value
						}
					}), 'devices');

					var message = Util.format('Job (id:%s) execute', params.idScheduleDevice);
					Publisher.publish({type : EVENTTYPE.LOG, message : message}, 'events');
				}
			};
			break;
		case TypeJob.DATABASECOMPRESSION :
			jobAction = {
				execute : function () {
					Publisher.publish({}, 'dbCompress');
				
					var message = Util.format('Job (id:%s) execute', params.idScheduleDevice);
					Publisher.publish({type : EVENTTYPE.LOG, message : message}, 'events');
				}
			}
		default :
			break;
	}

	return jobAction;
};

module.exports.getJob = jobfactory;