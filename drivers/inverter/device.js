"use strict";

const Homey = require('homey');
const util = require('./../../lib/daikin');
const Device = require('../../lib/device');

var options = {'logger': console.log}; // optional logger method to get debug logging
var Daikin = require('./../../node_modules/daikin-controller/index.js');
var DaikinAC = require('./../../node_modules/daikin-controller/lib/DaikinAC');

class DaikinDevice extends Device {

    // this method is called when the Device is inited
    onInit() {						

		super.onInit();

		this.log('Capability registration started...');
        this.registerCapabilityListener('airco_mode', this.onCapabilityMode.bind(this));
		this.registerCapabilityListener('fan_rate', this.onCapabilityFanRate.bind(this));			
		this.registerCapabilityListener('fan_direction', this.onCapabilityFanDir.bind(this));	       
		this.registerCapabilityListener('airco_humidty', this.onCapabilityAircoHum.bind(this));
        this.registerCapabilityListener('airco_temperature', this.onCapabilityAircoTemp.bind(this));        
		this.registerCapabilityListener('measure_temperature.inside', this.onCapabilityMeasureTemperature.bind(this));
        this.registerCapabilityListener('measure_temperature.outside', this.onCapabilityMeasureTemperature.bind(this));       
                
		this.log('Registration of Capabilities and Report Listeners completed!');
        
        // for documentation about the Daikin API look at https://github.com/Apollon77/daikin-controller and
        // https://github.com/Apollon77/daikin-controller

    }
		
	onAdded() {
		this.log('device added');

        this.refreshData(); // we intialize our Homey app with data from the airco...
	}

    // this method is called when the Device is deleted
    onDeleted() {
        this.log('device deleted');
		
    }

    // look for changes in the airco its settings made outside of Homey app...
    refreshData() {
		this.log('refreshData');
        
		var deviceData = this.getData();
        var inverter_ip = deviceData.ip;
             
        this.deviceRequestControl(inverter_ip); // refresh the app
		this.deviceRequestSensor(inverter_ip);  // refresh the app

        var interval = 10; // in seconds      
        setTimeout(this.refreshData.bind(this), interval * 1000);
        
    }

//----------------------

    // POST new Power settings to Airconditioner    
    daikinPowerControl(pow) {
       this.log('daikinPowerControl');

	   var deviceData = this.getData();
       var inverter_ip = deviceData.ip;
              
       var daikin = new DaikinAC(inverter_ip, options, function(err) {

           daikin.setACControlInfo({"pow":pow});           
       });
       this.log('Power control: ', pow);      
    }

    // POST new Mode settings to Airconditioner    
    daikinModeControl(airco_mode) {
       this.log('daikinModeControl');
    
       var deviceData = this.getData();     
	   var inverter_ip = deviceData.ip;
       
       var daikin = new DaikinAC(inverter_ip, options, function(err) {
          // daikin.currentCommonBasicInfo - contains automatically requested basic device data
          // daikin.currentACModelInfo - contains automatically requested device model data           
          // modified DaikinAC,js so that currentACControlInfo is sent iso currentACModelInfo                     
           switch (airco_mode) { 
               case "off":            var amode = 5; var setpow = false;
                                      break;
              
              case "cooling":         var amode = 3; var setpow = false;          
                                      break;
                                                        
              case "heating":         var amode = 4; var setpow = false;  
                                      break;
                                                                      
              case "auto":            var amode = 0; var setpow = false; 
                                      break;
                                                        
              case "auto1":           var amode = 1; var setpow = false;    
                                      break;
                                                        
              case "auto2":           var amode = 7; var setpow = false;  
                                      break;
                                                        
              case "dehumid":         var amode = 2; var setpow = false;
                                      break;
                                                        
              case "fan":             var amode = 6; var setpow = false;
                                      break;
                                                        
             default:                 return; // unrecognized mode
           }
           // dehumid and fan mode have no temperature setting assigned, however
           // we must make sure a target temperature is set when we change back to another mode
           var atemp = 21; // just in case targetTemperatureMode1 is not set between 10 - 45 degC
           if (daikin.currentACControlInfo.targetTemperatureMode1 >= 10 && daikin.currentACControlInfo.targetTemperatureMode1 <= 45) { 
               atemp = daikin.currentACControlInfo.targetTemperatureMode1;
           }           
           if (daikin.currentACControlInfo.targetTemperature >= 10 && daikin.currentACControlInfo.targetTemperature <= 45) { 
               atemp = daikin.currentACControlInfo.targetTemperature;
           }           
           var shum = 0; // just in case targetHumidityMode1 is not set between 0 - 50 %
           if (daikin.currentACControlInfo.targetHumidityMode1 >= 0 && daikin.currentACControlInfo.targetHumidityMode1 <= 50) {
               shum = daikin.currentACControlInfo.targetHumidityMode1; 
           }           
           if (daikin.currentACControlInfo.targetHumidity >= 0 && daikin.currentACControlInfo.targetHumidity <= 50) {
               shum = daikin.currentACControlInfo.targetHumidity; 
           }
           // power, mode, targettemperature and targethumidity are mandatory parameters for mode changes!
           daikin.setACControlInfo({"power":setpow, "mode":amode, "targetTemperature":atemp, "targetHumidity":shum});
       
       });
       
    }  

    // POST new Fan Rate settings to Airconditioner    
    daikinFanRateControl(fan_rate) {
       this.log('daikinFanRateControl');
    
       var deviceData = this.getData();     
	   var inverter_ip = deviceData.ip;
       
       var fanRate = fan_rate;
       var daikin = new DaikinAC(inverter_ip, options, function(err) {
           switch (fan_rate) { 
              case "A":         fanRate = "A";
                                return;
              
              case "B":         fanRate = "B";
                                return;
                                                        
              case "3":         fanRate = "3";
                                return;
                                                                      
              case "4":         fanRate = "4";
                                return;
                                                        
              case "5":         fanRate = "5";
                                return;
                                                        
              case "6":         fanRate = "6";
                                return;
                                                        
              case "7":         fanRate = "7";
                                return;
                                                        
             default:           break; // unrecognized fan rate
           }
           daikin.setACControlInfo({"fanRate":fanRate});

       });
        
    }  

    // POST new Fan Rate settings to Airconditioner    
    daikinFanDirControl(fan_direction) {
       this.log('daikinFanDirControl');
    
       var deviceData = this.getData();     
	   var inverter_ip = deviceData.ip;
       
       var fanDirection = fan_direction;
       var daikin = new DaikinAC(inverter_ip, options, function(err) {
           switch (fan_direction) { 
              case "0":         fanDirection = "0";
                                return;
              
              case "1":         fanDirection = "1";
                                return;
                                                        
              case "2":         fanDirection = "2";
                                return;
                                                                      
              case "3":         fanDirection = "3";
                                return;
                                                        
             default:           break; // unrecognized fan direction
           }
           daikin.setACControlInfo({"fanRate":fanDirection});
           
       });
    }  
       
    // POST new Temperature settings to Airconditioner    
    daikinTempControl(atemp) {
       this.log('daikinTempControl');

       var deviceData = this.getData();     
	   var inverter_ip = deviceData.ip;
              
       var daikin = new DaikinAC(inverter_ip, options, function(err) {
         daikin.setACControlInfo({"targetTemperature":atemp});
       });

       // flowcard
   	   var oldTargetTemperature = this.getState().airco_temperature;
           this.log('oldTargetTemperature: ', oldTargetTemperature);
   	   if (oldTargetTemperature != atemp) {
   		   this.setCapabilityValue('airco_temperature', atemp);
           this.log('set new target temperature °C to:', atemp);

   		   let device = this;
   		   let tokens = {
   			   'target_temperature': atemp
   		   };

   		   let state  = {
   			   'airco_temperature': atemp
   		   }

   		   //trigger temperature flows
   		   let driver = this.getDriver();
   		   driver
   				.triggerTemperatureMoreThan(device, tokens, state)
   				.triggerTemperatureLessThan(device, tokens, state)
   				.triggerTemperatureBetween(device, tokens, state);
   		}
    }

    // Interrogate Airconditioner Status
	deviceRequestControl(ip_address) {
		this.log('deviceRequestControl');
	    
		var inverter_ip = ip_address;
	    util.request_control(inverter_ip, this.updateControlListeners.bind(this));
		
		return Promise.resolve();
    }

    // Interrogate Airconditioner Temperature Sensor
	deviceRequestSensor(ip_address) {
		this.log('deviceRequestSensor');
				
	    var inverter_ip = ip_address;
	    util.request_sensor(inverter_ip, this.updateSensorListeners.bind(this));
		
		return Promise.resolve();
    }

   // Update the app after interrogation of control_request
	updateControlListeners(control_info, control_response) {        
		this.log('updateControlListeners');

    //---- mode
        var airco_modes = [ "auto", "auto1", "dehumid", "cooling", "heating", "off", "fan", "auto2" ];                        
        const amode = Number(control_info[2]);
        const airco_mode = airco_modes[amode];	
        this.log('mode:', airco_mode);
        this.setCapabilityValue('airco_mode', airco_mode);
        
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

//----------------------
    	
    // Capability 1: Device get/set mode
    onCapabilityMode(airco_mode) {
		this.log('onCapabilityMode');

		this.log('mode:', airco_mode);
    	this.setCapabilityValue('airco_mode', airco_mode);
        
        this.daikinModeControl(airco_mode);
	}
    
//-------
    // Capability 2: Device get/set fan rate
    onCapabilityFanRate(fan_rate) {
		this.log('onCapabilityFanRate');

		this.log('fan rate:', fan_rate);
    	this.setCapabilityValue('fan_rate', fan_rate);
        
        this.daikinFanRateControl(fan_rate);
	}
//-------
    // Capability 3: Device get/set fan direction
    onCapabilityFanDir(fan_direction) {
		this.log('onCapabilityFanDir');

		this.log('fan direction:', fan_direction);
    	this.setCapabilityValue('fan_direction', fan_direction);
        
        this.daikinFanDirControl(fan_direction);
	}
//-------
    // Capability 4: Device get/set humidity
    onCapabilityAircoHum(ahum) {
		this.log('onCapabilityAircoHum');

		this.log('humidity %:', ahum);
    	this.setCapabilityValue('airco_humidity', ahum);
	}
//-------        
    // Capability 5: Device get/set target temperature
    onCapabilityAircoTemp(atemp) {
		this.log('onCapabilityAircoTemp');

        this.log('new target temperature °C:', atemp);
        //this.setCapabilityValue('airco_temperature', atemp); // is done in flowcard logic!!!

        this.daikinTempControl(atemp);

    }        
//-------    	
    // Capability 6 & 7: Device measure in/outside temperature    
   onCapabilityMeasureTemperature(inside, outside) {
		this.log('onCapabilityMeasureTemperature');

        // updates by interrogation of airco, refer to refreshData function.

		return Promise.resolve();      
	}

//----------------------

}

module.exports = DaikinDevice;