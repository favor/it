var $$ =  require('../lib/favor_obj_builder.js')('../tests/mocks/favorit');
describe('working with i2c', function() {
	it('should get i2c', function() {
		var acc = false;
		var mocki2c = false;
		var start = new Date();
		runs(function() {
			var accel = $$('accelerometer').get(function(f) {
				mocki2c = f.counts;
				acc = f.inputs;
			});
		});

		waitsFor(function() {
			return acc;
		},3000);

		runs(function() {
			expect(acc).toBe('51,6');
			expect(mocki2c.writeBytes.length).toBe(3);
			expect(mocki2c.writeBytes[0]).toBe('45,8');
			expect(mocki2c.writeBytes[2]).toBe('44,11');
			expect(mocki2c.readBytes[0]).toBe('51,6');
		});
	});

	it('should wait if a wait value is supplied', function() {
		var acc;
		var mocki2c;
		var start = new Date();
		runs(function() {
			var accel = $$('accelerometer#test_wait').get(function(f) {
				mocki2c = f.counts;
				acc = f.inputs;
			});
		});

		waitsFor(function() {
			return acc;
		},3000);

		runs(function() {
			var end = new Date();
			expect(end.valueOf() - start.valueOf()).toBeGreaterThan(1000);
			expect(acc).toBe('51,6');
			expect(mocki2c.writeBytes.length).toBe(3);
			expect(mocki2c.readBytes[0]).toBe('51,6');
		});
	});

	it('should use the input value as the bytes value', function() {
		var mocki2c;
		var led = $$('led#blinkm');
		runs(function() {
			led.set([0,0,0],function(f) {
				mocki2c = f.counts;
			});
		});

		waitsFor(function() {
			return mocki2c;
		},1000);

		runs(function() {
			expect(mocki2c.writeBytes.length).toBe(1);
			expect(mocki2c.writeBytes[0]).toBe('110,0,0,0');
		});
	});

	it('should take a function as the set value', function() {
		var mocki2c;
		var led = $$('led#blinkm_with_func');
		runs(function() {
			led.set({r: 1, g: 2, b: 3},
				function(f) {
				mocki2c = f.counts;
			});
		});

		waitsFor(function() {
			return mocki2c;
		},1000);

		runs(function() {
			expect(mocki2c.writeBytes.length).toBe(1);
			expect(mocki2c.writeBytes[0]).toBe('110,1,2,3');
		});
	});

	it('should get the correct function after initialized', function() {
		var mocki2c;
		runs(function() {
			$$('led#blinkm').set([2,2,2], function(f) {
				mocki2c = f.counts;
			});
		});

		waitsFor(function() {
			return mocki2c;
		},1000);

		runs(function() {
			expect(mocki2c.writeBytes.length).toBe(2);
			expect(mocki2c.writeBytes[1]).toBe('110,2,2,2');
		});
	});

	it('should error if get or set is not defined', function() {
		var mocki2c;
		var led = $$('led#blinkm');
		spyOn(led, 'onError');
		runs(function() {
			led.get(function(f) {
				mocki2c = f;
			});
		});

		waitsFor(function() {
			return mocki2c;
		},1000);

		runs(function() {
			expect(led.onError).toHaveBeenCalled();
			expect(mocki2c.err).toBeDefined();
		});
	});

	it('should watch i2c', function() {
		var watchEvents = [];
		var done = false;
		var removedEvt = false;
		function watchEvt(data) {
			watchEvents.push(data.counts);
			// removeing watcher is not currently working, this needs to be fixed!
			if (watchEvents.length === 4) {
				$$('accelerometer#test_wait').removeListener('data', watchEvt);
			}
			setTimeout(function() {
				done = true;
			}, 1000);
		}

		runs(function() {
			$$('accelerometer#test_wait').on('data', watchEvt);
		});

		waitsFor(function() {
			return done;
		},3000);

		runs(function() {
			expect(watchEvents.length).toBeGreaterThan(4);
		});
	});

	it('should initialize and watch i2c', function() {
		var watchEvents = [];
		var done = false;
		var removedEvt = false;
		function watch(data) {
			watchEvents.push(data.counts);
			if (watchEvents.length === 5) {
				$$('accelerometer#init_stream').removeListener('data', watch);
			}
			setTimeout(function() {
				done = true;
			}, 1000);
		}

		runs(function() {
			$$('accelerometer#init_stream').on('data', watch);
		});

		waitsFor(function() {
			return done;
		},3000);

		runs(function() {
			expect(watchEvents.length).toBeGreaterThan(5);
		});
	});

});