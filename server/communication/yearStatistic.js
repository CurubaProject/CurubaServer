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

var month = ['Jan', 'Fev', 'Mars', 'april', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

var Year = {
	formatStatistic : function (stats) {
		var result = '[';
		for(var index = month.length; index--;) {
			result += '{\'graduation\': \'' + month[index] + '\', \'value\': ' + stats[index] + '},';
		}

      result += ']';

		return result;
	},
	formatData : function (data) {
		var stats = [0,0,0,0,0,0,0,0,0,0,0,0];

		for (var index = data.length ; index--;) {
			var currentData = data[index];
			stats[new Date(currentData.Date).getMonth()] += currentData.Value;
		}

		return stats;
	},
	type : typeStatistics.YEAR
};

module.exports = Year;