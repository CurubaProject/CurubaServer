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
var parser = require('../communication/binaryParser.js'),
    should = require('should');

describe('BinaryParser test - ', function () {
    it('Parse buffer - is ok', function (done) {

        var object = parser.parser(new Buffer([0x14,0x02,0x03, 0x04]));

        object.payload.should.equal(20);
        object.status.should.equal(2);
        object.state.should.equal(3);
        object.analogicRead.should.equal(4);

        done();
    });

    it('Parse buffer - Payload error', function (done) {
        var error;

        try {
            var object = parser.parser(new Buffer([0x00,0x02,0x03]));
        } catch (err) {
            error = err;
        };

        error.should["throw"]("object is not a function");

        done();
    });

    it('Parse buffer - Incomplete Payload detail', function (done) {
        var object = parser.parser(new Buffer([0x14,0x02]));

        object.payload.should.equal(20);
        object.status.should.equal(2);
        should.not.exist(object.state);
        should.not.exist(object.analogicRead);

        done();
    });

    it('GetBuffer - Is ok' , function (done) {
        var PAYLOAD = 30,
            STATUS = 2,
            STATE = 3;
        var object = parser.getBuffer(PAYLOAD, { status : STATUS, state : STATE});

        Buffer.isBuffer(object).should.equal(true);
        var binary = require('binary');
        var objectResponse = binary.parse(object).word8('payload').word8('status').word8('state').vars;

        objectResponse.payload.should.equal(PAYLOAD);
        objectResponse.status.should.equal(STATUS);
        objectResponse.state.should.equal(STATE);

        done();
    });
});
