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
var ws = require('../communication/client.js'),
    should = require('should');

describe('Client test - ', function () {

   it('Objects extend', function (done) {

      var abstract = {
         funct1 : function () {
            return true;
         },
         funct2 : function (value) {
            return '-' + value + '-';
         },
         param1 : 1,
         param2 : "param2"
      };

      var obj = { };

      obj.extend(abstract);

      obj.funct1().should.equal(true);
      obj.funct2('test').should.equal('-test-');
      obj.param1.should.equal(1);
      obj.param2.should.equal("param2");

      done();
   });

});
