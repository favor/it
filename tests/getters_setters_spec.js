var $$ =  require('../lib/favor_obj_builder.js')('./tests/mock_favorit.json');

describe("setters getters", function(){
    it("should get and set the values for the led", function(){
        var led = $$('led');
        spyOn(led, "onError");
        expect(led.get()).toBe(0);
        led.set('low');
        expect(led.onError).toHaveBeenCalled();
        led.set('high');
        expect(led.onError).toHaveBeenCalled();
        led.set(0).set(1).set(3);
        expect(led.gpio.value).toBe(3);
    });
});