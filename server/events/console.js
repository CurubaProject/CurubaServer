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
module.exports = function (config) {
	var Publisher = require('./publisher').Publisher,
		EVENTTYPE = require('./eventType').EVENTTYPE;

	var fs = require('fs');

	var writeFile = function (path, message) {
		fs.open(path, 'a+', 0666, function(err, fd){
			fs.write(fd, message, null, undefined, function(err) {
				 if(err) {
					  console.error(err);
				 }
			});
		});
	};

	var saveLog = function (message) {
		var date = new Date();
		var error = date + ' : \n' + message + '\n';
		var path = config.logPath || './log/log.txt';

		writeFile(path, error);
	};

	var subscribe = (function () {
		Publisher.subscribe(function (event) {
			switch (event.type) {
				case EVENTTYPE.LOG :
					console.log(event.message);
					break;
				case EVENTTYPE.ERROR :
					console.error(event.message);
					saveLog(event.message);
					break;
			}
		}, 'events');
	})();
};