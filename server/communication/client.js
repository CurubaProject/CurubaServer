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
"use strict";

var Properties = require('commun/properties'),
   Util = require('util'),
   Publisher = require('../events/publisher').Publisher,
   Message = require('../core/message'),
   DeviceControl = require('../core/device'),
   SQLRequest = require('../db/request').Request,
   EVENTTYPE = require('../events/eventType').EVENTTYPE,
   Converter = require('./converter'),
   Statistic = require('./statistic'),
   ScheduleUtil = require('./scheduleUtil'),
   DbRequest = require('../db/dbRequest'),
   CommUtil = require('./commUtil');

var listDeviceRequest = {
	sqlQuery : SQLRequest.LISTDEVICEREQUEST,
	callback : function (data, res, jsonPCallback) {
	  res.send( jsonPCallback + '(' + this.format(data) + ')' );
	},
    format : function (data) {
		var listDevice = '[';
		for (var index = data.length; index-- ;) {
     		listDevice += '{ DeviceId:{ DeviceId:' + data[index].ID + ', DeviceNumber: ' + data[index].DeviceNumber + '}' +
							', DeviceName:\'' + data[index].Name + 
							'\', DeviceType:\'' + converter.getAppConstant('DEVICETYPE', data[index].Type) + 
							'\', DeviceStatus:\'' + converter.getAppConstant('DEVICESTATE', data[index].State) + '\' },';
		}
		listDevice = listDevice.substring(0,listDevice.length);
		listDevice += ']';

		return listDevice;
    },
	execute : function (params, res) {
		var that = this;

		res.contentType('application/javascript');
		Publisher.publish({type : EVENTTYPE.LOG, message : 'list device request'}, 'events');

		var devices = DeviceControl.getListDeviceConnected();

		if (devices.length > 0) {
			var CONDITIONNALENDOFSTRINGLENGTH = 4;
			var query = this.sqlQuery;

			for (var index = devices.length; index-- ;) {
				query += ' (idDevice = \'' + devices[index].deviceId + '\' AND DeviceNumber = \'' + devices[index].deviceNumber + '\') OR ' ;
			}
			query = query.substring(0, query.length - CONDITIONNALENDOFSTRINGLENGTH);

         DbRequest.Query(query, function (data) {
            that.callback(data, res, params.callback);
		   });
		} else {
			res.send( params.callback + '([])' );
		}
	}
}.extend(Properties.ListDeviceRequest);

var deviceDetails = {
   sqlQuery : SQLRequest.DEVICEDETAIL,
   callback : function (data, res, jsonPCallback) {
		if (data.length === 0) {
			res.send('[' + '{ Fail : \'Query Fail\'}' + ']');
		} else {
	      res.send( jsonPCallback + '(' + this.format(data) + ')' );
		}
   },
	format : function (data) {
		var listDevice = '[{ DeviceId:{ DeviceId:' + data[0].ID + ', DeviceNumber:' + data[0].DeviceNumber + '}' +
					', DeviceName:\'' + data[0].Name + 
					'\', DeviceType:\'' + converter.getAppConstant('DEVICETYPE', data[0].Type) + 
					'\', DeviceStatus:\'' + converter.getAppConstant('DEVICESTATE', data[0].State) + '\' }]';

		return listDevice;
	},
	execute : function (params, res) {
		res.contentType('application/javascript');
		Publisher.publish({type : EVENTTYPE.LOG, message : 'details device request'}, 'events');

		var that = this;
		var query = Util.format(this.sqlQuery, params.DeviceId);

		DbRequest.Query(query, function (data) {
			that.callback(data, res, params.callback);
		});
	}
}.extend(Properties.GetDeviceDetail);

var setDeviceState = {
   sqlQuery : SQLRequest.SETDEVICESTATE,
   callback : function (data, res) {
   	res.send('[' + '{ Success : \'OK\'}' + ']');
   },
	execute : function (params, res) {
		var that = this;
      res.contentType('application/javascript');

		Publisher.publish(Message.getMessage(30, params), 'devices');

   	res.send('[' + '{ Success : \'OK\'}' + ']');
	}
}.extend(Properties.SetDeviceState);

var getDeviceStatistics = {
	sqlQuery : SQLRequest.GETSTATISTICS,
	callback : function (data, res, jsonPCallback, typeStat) {
		var stats = typeStat.formatData(data);
		var result = typeStat.formatStatistic(stats);

		res.send( jsonPCallback + '(' + result + ')' );
	},
	execute : function (params, res) {
		res.contentType('application/javascript');
		Publisher.publish({type : EVENTTYPE.LOG, message : 'get device stats request'}, 'events');

		var typeStat = Statistic.getStatistic(params.Granularity);

		var that = this;
		var query = Util.format(this.sqlQuery, params.DeviceId, typeStat.type);

      DbRequest.Query(query, function (data) {
         that.callback(data, res, params.callback, typeStat);
      });
	}
}.extend(Properties.DeviceStatistics);

var getDeviceConfiguration = {
	sqlQuery : SQLRequest.GETDEVICECONFIGURATION,
	callback : function (data, res, jsonPCallback) {
	  res.send( jsonPCallback + '(' + this.format(data) + ')' );
	},
	format : function (data) {
		var schedule = '';

		for (var index = data.length; index--;) {
			if (data[index].ScheduleType === 0) {
				schedule += '{ScheduleId:' + data[index].Id +
							', ScheduleTo:\'' + scheduleUtil.getFormatedSchedule(data, data[index].ScheduleDeviceIdTo) +
							'\', ScheduleFrom:\''+ data[index].Hour + ':' + data[index].Minute +
							'\', ScheduleConfig:{status:\'' + Converter.getAppConstant('DEVICESTATE', data[index].State) +
							'\', value:\'' + data[index].Value + '\'}},';
			}
		}

		var result = '[{DeviceId:\''+ data[0].DeviceId + '\',' +
					 'DeviceType:\'' + Converter.getAppConstant('DEVICETYPE', data[0].Type) + '\', ' +
					 'DeviceName:\'' + data[0].Name + '\', ' +
					 'DeviceSchedule:[' + schedule + ']}]';

		return result;
	},
	execute : function (params, res) {
		var that = this;
		res.contentType('application/javascript');

		var query = Util.format(this.sqlQuery, params.DeviceId);

      DbRequest.Query(query, function (data) {
         that.callback(data, res, params.callback);
      });
	}
}.extend(Properties.DeviceConfiguration);

var setDeviceConfiguration = {
	sqlQuery : SQLRequest.SETDEVICECONFIGURATION,
	callback : function (data, res, jsonPCallback) {
	  res.send('[' + '{ Success : \'OK\'}' + ']');
	},
	execute : function (params, res) {
		var that = this;
		res.contentType('application/javascript');

		var query = Util.format(this.sqlQuery, params.DeviceName, params.DeviceId);
/*
		var insertQuery = '';
		var updateQuery = '';
		for (var index = params.DeviceSchedule.length; index--;) {
			var currentSchedule = params.DeviceSchedule[index];

			if (typeof currentSchedule.ScheduleId !== 'undefined') {
				insertQuery += util.format(SQLRequest.SETDEVICECONFIGURATIONINSERTSCHEDULE, params.DeviceId);
			} else {
				updateQuery += util.format('',  currentSchedule.ScheduleId);
			}
		}
*/
/*
      db.init();
      db.update(query, function (data) {
         that.callback(data, res);
      });
      db.close();
*/
		Publisher.publish({ jobId: 0}, 'jobs');

		res.send('[' + '{ Success : \'OK\'}' + ']');
	}
}.extend(Properties.SetDeviceConfiguration);

exports.ListDeviceQuery = listDeviceRequest;
exports.DeviceDetails = deviceDetails;
exports.SetDeviceState = setDeviceState;
exports.setDeviceStatistics = getDeviceStatistics;
exports.getDeviceConfiguration = getDeviceConfiguration;
exports.setDeviceConfiguration = setDeviceConfiguration;