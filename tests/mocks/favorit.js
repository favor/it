function postFormat(val) {
	return 'postFormat returned';
}

module.exports = {
	name: 'Test-Device',
	'gpio-path': 'tests/gpio-test/class/gpio',
	'i2c-bus': '/test/i2cbus',
	components: [
		{type: 'led', color: 'yellow', address: 1, interface: 'gpio',
		direction: 'out'},
		{type: 'led', address: 2, interface: 'gpio', direction: 'out'},
		{type: 'led', address: 3, name: 'has_get', interface: 'gpio',
		get: require('./component_methods'), direction: 'out'},
		{type: 'led', name: 'rgb', structure: {
			red: {address: 4}, green: {address: 5}, blue: {address: 6}
		}, interface: 'gpio', direction: 'out', formatInput: function(x) {
			if (typeof x === 'number') return x;
			return x[Object.keys(this._component.structure)[this._index]];
		}},
		{type: 'button', name: 'light',address: 7, interface: 'gpio',
		direction: 'in', interupt: true},
		{type: 'link', name: 'rht03',address: 8, direction: 'in',
			get: require('./linked_temp_humidity_mock')},
		{type: 'temperature', name: 'link', link: 'rht03'},
		{type: 'humidity', link: 'rht03'},
		{type: 'accelerometer', name: 'bridge', address: 1, init: [
			{type: 'write', cmd: 0x2D, val: [1 << 3]},
			{type: 'write', cmd: 0x31, val: [0x09]},
            {type: 'write', cmd: 0x2c, val: [8 + 2 + 1]}
		], get: {type: 'read', cmd: 0x33}, interface: 'i2c'},
		{type: 'accelerometer', name: 'test_wait', address: 0x1d, init: [
			{type: 'write', cmd: 0x2D, val: [1 << 3]},
			{type: 'write', cmd: 0x31, val: [0x09], wait: 500},
			{type: 'write', cmd: 0x2c, val: [8 + 2 + 1], wait: 500}],
			get: {type: 'read', cmd: 0x33}, interface: 'i2c'},
		{type: 'accelerometer', name: 'init_stream', address: 0x1d, init: [
			{type: 'write',cmd: 0x2D, val: [1 << 3]},
			{type: 'write',cmd: 0x31, val: [0x09], wait: 500},
			{type: 'write',cmd: 0x2c, val: [8 + 2 + 1], wait: 500}],
			get: {type: 'read', cmd: 0x33, val: 6}, interface: 'i2c'},
		{type: 'led', name: 'blinkm', address: 0x09,
			init: {type: 'write', cmd: 0x6d},
			set: {type: 'write', cmd: 0x6E, val: true}, interface: 'i2c'},
		{type: 'led', address: 0x05, name: 'blinkm_with_func',
			set: {type: 'write', cmd: 0x6E, val: true, formatInput: function(val) {
				return [val.r, val.g, val.b];
			}}, interface: 'i2c'},
		{type: 'accelerometer', name: 'formatOutputI2c',
			address: 0x11, init: [
				{type: 'write', cmd: 0x2D, val: [1 << 3]},
				{type: 'write', cmd: 0x31, val: [0x09]},
				{type: 'write', cmd: 0x2c, val: [8 + 2 + 1]}
			],
			get: {type: 'read', cmd: 0x33, val: 6},
				interface: 'i2c', formatOutput: postFormat},
		{type: 'temperature', name: 'formatOutputGpio',  address: 9,
			interface: 'gpio', direction: 'in', formatOutput: postFormat},
		{type: 'temperature', name: 'spi', interface: 'spi',
			address: '/dev/spidev0.0',
			get: {val: [0x23, 0x48, 0xAF, 0x19, 0x19, 0x19]}},
		{type: 'accelerometer', name: 'formatOutputSpi', address: 'dev/spidev0.1',
		'get': {val: [0x11, 0xf2]},
		formatOutput: postFormat, interface: 'spi'},
		{type: 'led', name: 'spiSet', address: '/dev/spidev0.1',
		init: {val: [0x00, 0x00, 0x00, 0x00]},
		set: {val: true, formatInput: function(val) {
			return val;
		}}, interface: 'spi', formatOutput: function(val) { return val.toString();}},
		{type: 'link', name: 'HiH-6130', interface: 'i2c', address: 0x27, get: {
			type: 'write', cmd: 0, val: new Buffer(4)}, formatOutput: function(buf) {
				return {
					temperature: 80
				};
			}
		},
		{type: 'temperature', name: 'i2cLink', link: 'HiH-6130'},
		{type: 'init_only', interface: 'gpio', address: 22},
		{type: 'init_only_i2c', interface: 'i2c', address: 0x00,
			init: {type: 'write', cmd: 0}, get: {type: 'read', cmd: 1}
		},
		{type: 'init_only_spi', interface: 'spi', address: '/dev/spidev0.1',
			init: {val: [0x00, 0x00]}, set: 0x3dD
		}
	]
};