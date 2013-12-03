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
var JobAPI = require('./job'), // TODO belm2440 : Maybe JobAPI is a name too generic. Find a new one.
	SQLRequest = require('../db/request').Request,
	Publisher = require('../events/publisher').Publisher,
	EVENTTYPE = require('../events/eventType').EVENTTYPE,
	Message = require('../core/message'),
	UtilFormat = require('./util'),
	TypeJob = require('./typeJob'),
	JobFactory = require('./jobFactory'),
    DbRequest = require('../db/dbRequest');

var JobControl = (function () {
	var listJob = [];

	var createJob = function (jobInfo) {
		var job = JobAPI.createJob(formatJobParam(jobInfo),
				  		  	       JobFactory.getJob((TypeJob.DEVICECONTROLE, jobInfo).execute));
		job.id = jobInfo.idScheduleDevice;
      
		listJob.push(job);
	};

	var callbackAddJob = function (data) {
		createJob(data[0]);
	};

	var formatJobParam = function (data) {
		return '' + UtilFormat.formatNull(data.Minute) + ' ' +
						UtilFormat.formatNull(data.Hour) + ' ' +
						UtilFormat.formatNull(data.DayMonth) + ' ' +
						UtilFormat.formatNull(data.Month) + ' ' +
						UtilFormat.formatNull(data.DayWeek) + ' ';
	};

	return {
		addJobs : function (data) { // TODO belm2440 : refactor this function : not the same purpose.
			for (var index = data.length ; index-- ;) {
				createJob(data[index]);
			}
		},
		addJob : function (job) {
			var query = SQLRequest.INITJOB + ' WHERE idScheduleDevice = ' + job.id; // TODO belm2440 : refactor this too.
         DbRequest.Query(query, callbackAddJob);
		},
		removeJob : function (job) {
			for (var index = listJob.length; index--; ) {
				var currentJob = listJob[index];

				if (currentJob.id === job.id) {
					currentJob.stop();
					listJob.splice(index, 1);
					break;
				}
			};
		}
	};
})();

var init = function (arg) {
	DbRequest.Query(SQLRequest.INITJOB, JobControl.addJobs);
	Publisher.publish({type : EVENTTYPE.LOG, message : 'Job Initialization - State : Done'}, 'events');
};

var subscribe = (function () {
	Publisher.subscribe(function (message) {
		var job = { id : message.jobId };

		JobControl.removeJob(job);
		JobControl.addJob(job);
	}, 'jobs');
})();

exports.init = init;