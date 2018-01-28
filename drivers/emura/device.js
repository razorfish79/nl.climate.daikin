"use strict";

const Homey = require('homey');

class DaikinDevice extends Homey.Device {

    // this method is called when the Device is inited
    onInit() {
        this.log('device init');
        this.log('name:', this.getName());
        this.log('class:', this.getClass());

        // register the capability listeners
		this.log('capability registration...');
		
        this.registerCapabilityListener('onoff', 
		     this.onCapabilityOnoff.bind(this));
		
		const setTemp = this.getSetting('stemp')|| 99;
		this.registerCapabilityListener('target_temperature', 'measuredValue', setTemp,
		     this.onCapabilityTargetT.bind(this));
    }

    // this method is called when the Device is added
    onAdded() {
        this.log('device added');
    }

    // this method is called when the Device is deleted
    onDeleted() {
        this.log('device deleted');
		
    }

    // this method is called when the Device has requested a state change (turned on or off)
    onCapabilityOnoff( value, opts, callback ) {
		
		this.log('state change on/off');
        // ... set value to real device
		this.setCapabilityValue('onoff', parsedValue);
		his.log('pow=',parsedValue);

        // Then, emit a callback ( err, result )
        callback( null );

        // or, return a Promise
        return Promise.reject( new Error('Switching the device failed!') );
    }

    // this method is called when the Device has requested a state change (turned on or off)
    onCapabilityTargetT( value, opts, callback ) {
		
		this.log('state change target temperature');
        // ... set value to real device
		this.setCapabilityValue('set_temperature', parsedValue);
		this.log('stemp=',parsedValue);

        // Then, emit a callback ( err, result )
        callback( null );

        // or, return a Promise
        return Promise.reject( new Error('Switching the device failed!') );
    }
}

module.exports = DaikinDevice;