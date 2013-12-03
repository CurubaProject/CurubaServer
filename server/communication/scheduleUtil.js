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
var getFormatedSchedule = function (data, id) {
	var foundedIndex = undefined;

	for (var index = data.length; index--;) {
		if (data[index].Id === id) {
			foundedIndex = index;
			break;
		}
	}

	var result = '';
	if (typeof foundedIndex !== 'undefined') {
		result = data[foundedIndex].Hour + ':' + data[foundedIndex].Minute;
	}

	return result;
};

exports.getFormatedSchedule = getFormatedSchedule;