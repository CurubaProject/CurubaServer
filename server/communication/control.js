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
var clientResquest = require('./client'),
	tcp = require('./tcp'),
	Validator = require('commun/validator').Validator,
	Publisher = require('../events/publisher').Publisher,
	EVENTTYPE = require('../events/eventType').EVENTTYPE;

var app;

var setupRouting = function () {
   var getParams = function (validators, req) {
      if (!Object.keys(validators).length) {
         return {
            haveParams : false
         };
      }

      var valid = new Validator(),
         params = req.getParams(validators);

      valid.checkParams(params, validators);

      return {
			errors : valid.getErrors(),
			sanitizeParams : params,
			haveParams : true
      };
   };

   var addRoute = function (element) {
      app.get(element.route, function(req, res) {
         var params = getParams(element.validators, req),
            err = params.errors,
            haveParams = params.haveParams;

         if ((err && err.length === 0) || haveParams) {
            element.execute(params.sanitizeParams, res);
         } else {
            res.send(err);
         }
      });
   };

   var keys = Object.keys(clientResquest);
   loopRoutes : for(var i = keys.length ; i-- ; ) {
      addRoute(clientResquest[keys[i]]);
   };
};

var overloadRequest = function () {
   app.request.getParams = function (params) {
      var ret = [],
         keys = Object.keys(params);
		 
      findParams : for(var i = keys.length ; i-- ; ) {
         ret[keys[i]] = this.query[keys[i]];
      }

      return ret;
   };
};

var init = function (arg) {
	initApp(arg.app, arg.portApp);
	initTCP(arg.portTCP);
};

var initTCP = function (port) {
	 var port = port | 5000;
    tcp.createTCPServer(port);

	 var message = 'Listening on port ' + port + '...';
	 Publisher.publish({type : EVENTTYPE.LOG, message : message}, 'events');
};

var initApp = function (application, port) {
	 app = application;
 	 overloadRequest();
 	 setupRouting();

	 var port = port | 8080;

	 app.listen(port);

	 var message = 'Listening on port ' + port + '...';
	 Publisher.publish({type : EVENTTYPE.ERROR, message : message}, 'events');
};

exports.init = init;