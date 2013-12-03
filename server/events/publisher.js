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
var Publisher = {
	Subscribers: {
		any: [],
		devices : [],
		clients : [],
		jobs : [],
		events : []
	},
	subscribe: function (fn, type) {
		type = type || 'any';
		if (typeof this.Subscribers[type] === 'undefined') {
			this.Subscribers[type] = [];
		}
		this.Subscribers[type].push(fn);
	},
	unsubscribe: function (fn, type) {
		this.Subscribers[type].pop(fn);
	},
	publish: function (publication, type) {
		this.visitSubscribers('publish', publication, type);
	},
	visitSubscribers: function (action, arg, type) {
		var eventType = type || 'any',
		subscribers = this.Subscribers[eventType];

		for (var i = subscribers.length; i-- ;) {
			subscribers[i](arg);
		}
	}
};

exports.Publisher = Publisher;