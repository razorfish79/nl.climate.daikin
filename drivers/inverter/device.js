"use strict";

const Homey = require('homey');
const util = require('./../../lib/daikin.js');

class DaikinDevice extends Homey.Device {

    // this method is called when the Device is inited
    onInit() {						
        
		this.log('name:', this.getName());
        this.log('class:', this.getClass());

		this.log('Capability registration started...');
        this.registerCapabilityListener('airco_mode', this.onCapabilityMode.bind(this));
		this.registerCapabilityListener('fan_rate', this.onCapabilityFanRate.bind(this));			
		this.registerCapabilityListener('fan_direction', this.onCapabilityFanDir.bind(this));	       
		this.registerCapabilityListener('airco_humidty', this.onCapabilityAircoHum.bind(this));
        this.registerCapabilityListener('airco_temperature', this.onCapabilityAircoTemp.bind(this));        
		this.registerCapabilityListener('measure_temperature.inside', this.onCapabilityMeasureTemperature.bind(this));
        this.registerCapabilityListener('measure_temperature.outside', this.onCapabilityMeasureTemperature.bind(this));       
                
		this.log('Registration of Capabilities and Report Listeners completed!');

    }
		
	onAdded() {
		this.log('device added');
		
		var deviceData = this.getData();
        this.deviceRequestControl(deviceData.ip); // initialize the app
		this.deviceRequestSensor(deviceData.ip);  // initialize the app
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
	    util.request_control(inverter_ip, this.updateControlListener.bind(this));
		
		return Promise.resolve();
    }

    // Interrogate Temperature Sensor
	deviceRequestSensor(value) {
		this.log('deviceRequestSensor');
				
	    var inverter_ip = value;
	    util.request_sensor(inverter_ip, this.updateSensorListener.bind(this));
		
		return Promise.resolve();
    }

   // Update values after interrogation
	updateControlListener(control_info) {        
		this.log('updateControlListener');
        
        // mode                        
		const amode = Number(control_info[2]);		
		this.onCapabilityMode(amode);

        // temperature
		const atemp = Number(control_info[4]);
		this.onCapabilityAircoTemp(atemp);

        // humidity
		const ahum = Number(control_info[5]);      
        this.onCapabilityAircoHum(ahum);      

        // fan rate
		const frate = String(control_info[23]);      
        this.onCapabilityFanRate(frate);   
        
        // fan direction
		const fdir = Number(control_info[34]);      
        this.onCapabilityFanDir(fdir);           
        	
		return Promise.resolve();
	}

   // Update values after interrogation
	updateSensorListener(sensor_info) {        
		this.log('updateSensorListener');
		                        
		const inside = Number(sensor_info[1]);
		const outside = Number(sensor_info[3]);
		
		this.onCapabilityMeasureTemperature(inside, outside);
			
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
	
    // Capability 1: Device get/set mode
    onCapabilityMode(amode) {
		this.log('onCapabilityMode');

		this.log('mode:', amode);
    	this.setCapabilityValue('airco_mode', amode);

	}

    // Capability 2: Device get/set fan rate
    onCapabilityFanRate(frate) {
		this.log('onCapabilityFanRate');

		this.log('fan rate:', frate);
    	this.setCapabilityValue('fan_rate', frate);

	}

    // Capability 3: Device get/set fan direction
    onCapabilityFanDir(fdir) {
		this.log('onCapabilityFanDir');

		this.log('fan direction:', fdir);
    	this.setCapabilityValue('fan_direction', fdir);

	}

    // Capability 4: Device get/set humidity
    onCapabilityAircoHum(ahum) {
		this.log('onCapabilityAircoHum');

		this.log('humidity %:', ahum);
    	this.setCapabilityValue('airco_humidity', ahum);

	}
        
    // Capability 5: Device get/set target temperature
    onCapabilityAircoTemp(atemp) {
		this.log('onCapabilityAircoTemp');

		this.log('temperature °C:', atemp);
    	this.setCapabilityValue('airco_temperature', atemp);
	
    }        
    	
    // Capability 6. +7: Device measure in/outside temperature
    onCapabilityMeasureTemperature(inside, outside) {
		this.log('onCapabilityMeasureTemperature');

		this.log('temperature inside °C', inside);
		this.log('temperature outside °C:', outside);
		this.setCapabilityValue('measure_temperature.inside', inside);
        this.setCapabilityValue('measure_temperature.outside', outside);
	}

}

module.exports = DaikinDevice;