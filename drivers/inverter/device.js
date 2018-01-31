"use strict";

const Homey = require('homey');
const util = require('./../../lib/daikin.js');

class DaikinDevice extends Homey.Device {

    // this method is called when the Device is inited
    onInit() {						
        
		this.log('name:', this.getName());
        this.log('class:', this.getClass());

		this.log('Capability registration started...');
        this.registerCapabilityListener('thermostat_mode', this.onCapabilityMode.bind(this));
        this.registerCapabilityListener('target_temperature', this.onCapabilityTargetTemp.bind(this));	
		this.registerCapabilityListener('measure_temperature.inside', this.onCapabilityMeasureTemperature.bind(this));
        this.registerCapabilityListener('measure_temperature.outside', this.onCapabilityMeasureTemperature.bind(this));       
		//this.registerCapabilityListener('fan_speed', this.onCapabilityFanSpeed.bind(this));			
		//this.registerCapabilityListener('wing_direction', this.onCapabilityWingDir.bind(this));	
        
		this.log('Registration of Capabilities and Report Listeners completed!');

    }
		
	onAdded() {
		this.log('device added');
		
		var deviceData = this.getData();
		this.deviceRequestSensor(deviceData.ip); // initialize the app
	}

    // this method is called when the Device is deleted
    onDeleted() {
        this.log('device deleted');
		
    }

//----------------------

    // Interrogate Airconditioner Status
	deviceRequestControl(value) {
		this.log('deviceRequestControl');
	    
		var inverter_ip = value;
	    util.request_control(inverter_ip, this.updateListeners.bind(this));
		
		return Promise.resolve();
    }

    // Interrogate Temperature Sensor
	deviceRequestSensor(value) {
		this.log('deviceRequestSensor');
				
	    var inverter_ip = value;
	    util.request_sensor(inverter_ip, this.updateListeners.bind(this));
		
		return Promise.resolve();
    }

   // Update values after interrogation
	updateListeners(value1, value2) {
		this.log('updateListeners');
			
<<<<<<< HEAD
		const inside = value1;
		const outside = value2;
		this.log('updated listeners, hometemp: ', inside);
		this.log('updated listeners, outsidetemp: ', outside);
		
		this.onCapabilityMeasureTemperature(inside, outside);
        
        //hardcoded for test mobile card...
        this.onCapabilityMode("auto");
        this.onCapabilityTargetTemp(21);
=======
		const hometemp = value1;
		const outsidetemp = value2;
		this.log('updated listeners, hometemp: ', hometemp);
		this.log('updated listeners, outsidetemp: ', outsidetemp);
		
		this.onCapabilityMeasureTemperature(hometemp);
		this.onCapabilityMyMeasureTemperature(outsidetemp);
		
		//this.setCapabilityValue('measure_temperature', hometemp);
		//this.setCapabilityValue('my_temperature_capability', hometemp);		
		//this.log('get value: ', this.getCapabilityValue('measure_temperature'));
		//this.log('get value: ', this.getCapabilityValue('my_temperature_capability'));
		//setTimeout => (function(){ this.log('get value: ', this.getCapabilityValue('measure_temperature')); }, 1000);
		//setTimeout => (function(){ this.log('get value: ', this.getCapabilityValue('my_temperature_capability')); }, 1000);
>>>>>>> 503ab3f54ec3b6f1aaf2d8da0ba5eff4581228fa
			
		return Promise.resolve();
	}

	// Update Daikin Airconditioner
	deviceSendControl(value) {
		this.log('deviceSendControl');
				
	    var inverter_ip = value;
	    util.send_control(inverter_ip, settings);
		
		return Promise.resolve();
    }


//----------------------
<<<<<<< HEAD
	
    // Device set mode capability
    onCapabilityMode(mode) {
		this.log('onCapabilityMode');

    	this.setCapabilityValue('thermostat_mode', mode);

	}
    
    // Device set target temperature capability
    onCapabilityTargetTemp(target) {
		this.log('onCapabilityTargetTemp');

    	this.setCapabilityValue('target_temperature', target);
	
    }        
    	
    // Device measure in/outside temperature capability
    onCapabilityMeasureTemperature(inside, outside) {
		this.log('onCapabilityMeasureTemperature');

		this.log('device capability >>>> measure_temperature >>>> insidetemp:', inside);
		this.log('device capability >>>> measure_temperature >>>> outsidetemp:', outside);
		this.setCapabilityValue('measure_temperature.inside', inside);
        this.setCapabilityValue('measure_temperature.outside', outside);
=======
		
    // Device capability
    onCapabilityMeasureTemperature(value, opts) {
		this.log('onCapabilityMeasureTemperature');
		
		var deviceData = this.getData();
		this.setCapabilityValue('measure_temperature', value);
		this.log('from device capability... hometemp:', value);
		return Promise.resolve();
	}

    // Device my_capability
    onCapabilityMyMeasureTemperature(value, opts) {
		this.log('onCapabilityMyMeasureTemperature');
		
		var deviceData = this.getData();
		this.setCapabilityValue('my_temperature_capability', value);
		this.log('from device my_capability... outsidetemp:', value);
		return Promise.resolve();
>>>>>>> 503ab3f54ec3b6f1aaf2d8da0ba5eff4581228fa
	}

}

module.exports = DaikinDevice;