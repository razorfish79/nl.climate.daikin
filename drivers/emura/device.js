"use strict";

const Homey = require('homey');
const util = require('../../lib/daikin');
const Device = require('../../lib/device');

//Device for a Daikin Emura device
class EmuraDevice extends Device {

    onInit() {						

		super.onInit();

		this.log('Emura capability registration started...');
        this.registerCapabilityListener('airco_mode_emura', this.onCapabilityMode.bind(this));
		this.registerCapabilityListener('fan_rate', this.onCapabilityFanRate.bind(this));			
		this.registerCapabilityListener('fan_direction', this.onCapabilityFanDir.bind(this));	       
		this.registerCapabilityListener('airco_humidty', this.onCapabilityAircoHum.bind(this));
        this.registerCapabilityListener('airco_temperature', this.onCapabilityAircoTemp.bind(this));        
		this.registerCapabilityListener('measure_temperature.inside', this.onCapabilityMeasureTemperature.bind(this));
        this.registerCapabilityListener('measure_temperature.outside', this.onCapabilityMeasureTemperature.bind(this));       
                
		this.log('Emura registration of Capabilities and Report Listeners completed!');
        
        // for documentation about the Daikin API look at https://github.com/Apollon77/daikin-controller and at
        // https://github.com/Apollon77/daikin-controller

        this.emuraIsDeleted = false;
        this.refreshData(); // refresh every x-seconds the Homey app with data retrieved from the airco...

    }
		
	onAdded() {
		this.log('Emura device added');

	}

    // this method is called when the Device is deleted
    onDeleted() {
        this.log('Emura device deleted');
        
        this.setSettings({emura_ip: "0.0.0.0", interval: "0"})
            .then(this.log('settings for emura are cleared'));
            
        this.emuraIsDeleted = true;
        
    }

//-------- app capabilities --------------
    	
    // Capability 1: Device get/set mode
    onCapabilityMode(airco_mode_emura) {
		this.log('onCapabilityMode');

		this.log('mode:', airco_mode_emura);
    	this.setCapabilityValue('airco_mode_emura', airco_mode_emura);
        
        this.daikinModeControl(airco_mode_emura);

		return Promise.resolve();  
	}
    
    // Capability 2: Device get/set fan rate
    onCapabilityFanRate(fan_rate) {
		this.log('onCapabilityFanRate');

		this.log('fan rate:', fan_rate);
    	this.setCapabilityValue('fan_rate', fan_rate);
        
        this.daikinFanRateControl(fan_rate);

		return Promise.resolve();  
	}

    // Capability 3: Device get/set fan direction
    onCapabilityFanDir(fan_direction) {
		this.log('onCapabilityFanDir');

		this.log('fan direction:', fan_direction);
    	this.setCapabilityValue('fan_direction', fan_direction);
        
        this.daikinFanDirControl(fan_direction);

		return Promise.resolve();  
	}

    // Capability 4: Device get/set humidity
    onCapabilityAircoHum(ahum) {
		this.log('onCapabilityAircoHum');

		this.log('humidity %:', ahum);
    	this.setCapabilityValue('airco_humidity', ahum);
        
        return Promise.resolve();  
	}
      
    // Capability 5: Device get/set target temperature
    onCapabilityAircoTemp(atemp, opts) {
		this.log('onCapabilityAircoTemp');

 	    var oldTargetTemperature = this.getState().airco_temperature;
        this.log('oldTargetTemperature: ', oldTargetTemperature);
 	    
        if (oldTargetTemperature != atemp) {
           this.log('new target airco temperature °C:', atemp);        
 	   	   this.setCapabilityValue('airco_temperature', atemp);
       
 	   	   let device = this;
 	   	   let tokens = {
 	   		   'target_temperature': atemp
 	   	   };
       
 	   	   let state  = {
 	   		   'airco_temperature': atemp
 	   	   }
       
 	   	   // trigger temperature flows
 	   	   let driver = this.getDriver();
 	   	   driver
 	   			.triggerTemperatureMoreThan(device, tokens, state)
 	   			.triggerTemperatureLessThan(device, tokens, state)
 	   			.triggerTemperatureBetween(device, tokens, state);
           
           // update the airco its settings         
           this.daikinTempControl(atemp);
 	   	}
       
		return Promise.resolve(); 
        
    }        
   	
    // Capability 6 & 7: Device measure in/outside temperature    
    onCapabilityMeasureTemperature(inside, outside) {
		this.log('onCapabilityMeasureTemperature');

        // updates by interrogation of the airco, refer to refreshData method.

		return Promise.resolve();      
	}

//-------- airco data retrieval and app refresh/update methods --------------

    // look for changes in the airco its settings made outside of Homey app...
    refreshData() {
		this.log('refreshData');
        
        if (this.emuraIsDeleted) {
            this.log('Emura device has been deleted, the refresh loop is now stopped...');
            
            return;
        }

        var settings = this.getSettings();
        var emura_ip = settings.emura_ip; this.log('Emura ip-address: ', emura_ip);        
        var interval = settings.interval; this.log('Refresh interval: ', interval);
             
        this.deviceRequestControl(emura_ip); // refresh the app
		this.deviceRequestSensor(emura_ip);  // refresh the app
     
        setTimeout(this.refreshData.bind(this), interval * 1000);
        
    }

    // Interrogate Airconditioner Status
	deviceRequestControl(emura_ip) {
		this.log('deviceRequestControl');
	    
	    util.request_control(emura_ip, this.updateControlListeners.bind(this));
		
		return Promise.resolve();
    }

    // Interrogate Airconditioner Temperature Sensor
	deviceRequestSensor(emura_ip) {
		this.log('deviceRequestSensor');
				
	    util.request_sensor(emura_ip, this.updateSensorListeners.bind(this));
		
		return Promise.resolve();
    }

   // Update the app after interrogation of control_request
	updateControlListeners(control_info, control_response) {        
		this.log('updateControlListeners');

    //---- mode
        var airco_mode_emuras = [ "auto", "auto1", "dehumid", "cooling", "heating", "off", "fan", "auto2" ];                        
        const amode = Number(control_info[2]);
        const airco_mode_emura = airco_mode_emuras[amode];	
        this.log('mode:', airco_mode_emura);
        this.setCapabilityValue('airco_mode_emura', airco_mode_emura);
        
    //---- temperature
		const atemp = Number(control_info[4]);
        this.log('temperature °C:', atemp);  
        this.setCapabilityValue('airco_temperature', atemp);
        
    //---- humidity
		const ahum = Number(control_info[5]);      
    	this.setCapabilityValue('airco_humidity', ahum);              
        
    //---- fan rate
        var fan_rates = [ "A", "B", "3", "4", "5", "6", "7"];
		var frate_nbr = -1;
        const frate = String(control_info[23]);
        if (frate == "A") { frate_nbr = 0; }
        if (frate == "B") { frate_nbr = 1; } 
        if ( frate_nbr !=0 && frate_nbr != 1 ) { frate_nbr = parseInt(frate - 1); }
        const fan_rate = fan_rates[frate_nbr];
        this.log('frate:', fan_rate);            
    	this.setCapabilityValue('fan_rate', fan_rate);
            
    //---- fan direction
        var fan_directions = [ "0", "1", "2", "3" ];
		const fdir = Number(control_info[24]);      
        const fan_direction = fan_directions[fdir];             
    	this.setCapabilityValue('fan_direction', fan_direction);
        this.log('fdir:', fan_direction);                 	
		return Promise.resolve();
	}

   // Update the app after interrogation of sensor_request
	updateSensorListeners(sensor_info) {        
		this.log('updateSensorListeners');

		const inside = Number(sensor_info[1]);
		const outside = Number(sensor_info[3]);
		this.setCapabilityValue('measure_temperature.inside', inside);
        this.log('Temp inside:', inside);     
        this.setCapabilityValue('measure_temperature.outside', outside);
        this.log('Temp outside:', outside);            		
		
		return Promise.resolve();
	}

//-------- airco controll methods --------------

    // POST new Power settings to Airconditioner    
    daikinPowerControl(pow) {
       this.log('daikinPowerControl');

       var settings = this.getSettings();
       var emura_ip = settings.emura_ip;
              
       var daikin = new DaikinAC(emura_ip, options, function(err) {

           daikin.setACControlInfo({"pow":pow});           
       });
       this.log('Power control: ', pow);      
    }

    // POST new Mode settings to Airconditioner    
    daikinModeControl(airco_mode_emura) {
       this.log('daikinModeControl');

       var settings = this.getSettings();
       var emura_ip = settings.emura_ip;
       
       util.daikinModeControl(airco_mode_emura, emura_ip);
      
    }  

    // POST new Fan Rate settings to Airconditioner    
    daikinFanRateControl(fan_rate) {
       this.log('daikinFanRateControl');
    
       var settings = this.getSettings();
       var emura_ip = settings.emura_ip;
       
       util.daikinFanRateControl(fan_rate, emura_ip);
       
    }  

    // POST new Fan Rate settings to Airconditioner    
    daikinFanDirControl(fan_direction) {
       this.log('daikinFanDirControl');
    
       var settings = this.getSettings();
       var emura_ip = settings.emura_ip;
       
       util.daikinFanDirControl(fan_direction, emura_ip);
      
    }  
       
    // POST new Temperature settings to Airconditioner    
    daikinTempControl(atemp) {
       this.log('daikinTempControl');

       var settings = this.getSettings();
       var emura_ip = settings.emura_ip;

       util.daikinTempControl(atemp, emura_ip);

    }

}

module.exports = EmuraDevice;