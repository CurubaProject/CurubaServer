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
var Config = require('../config.db').ConfigDB; // TODO belm2440 : refactor

// TODO belm2440 : We need and other adapter/factory structure to handle the data without handling it everywhere in the code.
module.exports = (function () {
   var dbClient;
   var result = [];

   var setup = function () {
      dbClient.auto_prepare = true;
      dbClient.auth(Config.dataBaseName, Config.userName, Config.password);
   };

	return {
		init : function () {
			dbClient = require('mysql-native').createTCPClient();
			setup();
		},
		request : function (sqlQuery, callback) {
			var dump_rows = function (cmd) {
				cmd.addListener('row', function (r) { result.push(r); });
				cmd.addListener('end', function(r) { callback(result); result = [];});
			};

			dump_rows(dbClient.query(sqlQuery));
		},
		update : function (sqlQuery, callback) {
			var returnQuery = function (cmd) {
				cmd.addListener('end', function(r) { callback(); });
			};

			returnQuery(dbClient.query(sqlQuery));
		},
		close : function () {
			dbClient.close();
		}
	};
})();