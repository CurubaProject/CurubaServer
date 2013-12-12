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
var Device = {
	DEVICETYPE : {
		DIMMER : 1,
		OUTLET : 2
	},
	DEVICESTATUS : {
		T : 1
	},
	DEVICESTATE : {
		ON : 1,
		OFF : 2,
		NOLOAD : 3
	},
	TYPESTATISTIC : {
		DAY : 3,
		WEEK : 0,
		MONTH : 1,
		YEAR : 2
	}
};

var App = {
	DEVICETYPE : {
		DIMMER : 'dimmer',
		OUTLET : 'outlet'
	},
	DEVICESTATUS : {
		T : 1
	},
	DEVICESTATE : {
		ON : 'on',
		OFF : 'off',
		NOLOAD : 'noload'
	},
	TYPESTATISTIC : {
		DAY : 'by day',
		WEEK : 'by week',
		MONTH : 'by month',
		YEAR : 'by year'
	}
};

exports.Device = Device;
exports.App = App;
