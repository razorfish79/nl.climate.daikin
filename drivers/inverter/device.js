"use strict";

const Homey = require('homey');
const util = require('./../../lib/daikin.js');

class DaikinDevice extends Homey.Device {

    // this method is called when the Device is inited
    onInit() {						
        
		this.log('name:', this.getName());
        this.log('class:', this.getClass());

		this.log('Capability registration started...');
        //this.registerCapabilityListener('onoff', this.onCapabilityOnOff.bind(this));
		//this.registerCapabilityListener('fan_speed', this.onCapabilityFanSpeed.bind(this));			
		//this.registerCapabilityListener('wing_direction', this.onCapabilityWingDir.bind(this));	

		this.registerCapabilityListener('measure_temperature', this.onCapabilityMeasureTemperature.bind(this));
		this.registerCapabilityListener('my_temperature_capability', this.onCapabilityMyMeasureTemperature.bind(this));
		//this.registerCapabilityListener('outsidetemp', this.onCapabilityOutsideTemp.bind(this));
		//this.registerCapabilityListener('target_temperature', this.onCapabilityTargetTemp.bind(this));	
		//this.registerCapabilityListener('thermostat_mode', this.onCapabilityMode.bind(this));
		
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
	}

}

module.exports = DaikinDevice;