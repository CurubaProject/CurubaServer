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
var typeStatistics = require('./constant').Device.TYPESTATISTIC;

var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Tur', 'Fri', 'Sat', 'Sun'];

var Week = {
	formatStatistic : function (stats) {
		var result = '[';
		for(var index = day.length; index--;) {
			result += '{\'graduation\': \'' + day[index] + '\', \'value\': ' + stats[index] + '},';
		}

      result += ']';

		return result;
	},
	formatData : function (data) {
		var stats = [0,0,0,0,0,0,0];

		for (var index = data.length ; index--;) {
			var currentData = data[index];
			stats[new Date(currentData.Date).getDay()] += currentData.Value;
		}

		return stats;
	},
	type : typeStatistics.WEEK
};

module.exports = Week;