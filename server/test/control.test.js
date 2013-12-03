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
/*var should  = require('should'),
   request = require('supertest'),
   app     = require('../app');

var routes = require('commun/properties');
*/

/*
   obj.funct1().should.equal(true);
   obj.funct2('test').should.equal('-test-');
   obj.param1.should.equal(1);
   obj.param2.should.equal("param2");
*/

var clientResquest = {
   un : 'test',
   deux : 'test2',
   un1 : 'test',
   deux1 : 'test2',
   un2 : 'test',
   deux2 : 'test2',
   un3 : 'test',
   deux3 : 'test2',
   un4 : 'test',
   deux4 : 'test2',
   un5 : 'test',
   deux5 : 'test2',
   un6 : 'test',
   deux6 : 'test2',
   un7 : 'test',
   deux7 : 'test2'
};

describe('Control test - ', function () {
   it('Object.keys', function (done) {
      for(var ii = 0 ; ii < 200 ; ii++) {
         var keys = Object.keys(clientResquest);
         var max = keys.length;

         loopRoutes : for(var i = max ; i-- ; ) {
            var test = clientResquest[keys[i]];
            //console.log(clientResquest[keys[i]]);
            //addRoute(clientResquest[keys[i]]);
         };
      }

      done();
   });

   it('hasOwnProperty', function (done) {
      for(var ii = 0 ; ii < 200 ; ii++) {
         loopRoutes : for(var route in clientResquest) {
            if (clientResquest.hasOwnProperty(route)) {
               var test = clientResquest[route];
               //console.log(clientResquest[route]);
               //addRoute(cReq[route]);
            }
         };
      }
      done();
   });

});
