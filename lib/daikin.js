"use strict";

const Homey = require('homey');
const XMLHttpRequest = require("./../../node_modules/XMLHttpRequest").XMLHttpRequest;

const Device = require('../../lib/device');

var options = {'logger': console.log}; // optional logger method to get debug logging
var Daikin = require('../../node_modules/daikin-controller/index.js');
var DaikinAC = require('../../node_modules/daikin-controller/lib/DaikinAC');

exports.request_control = function(ip_address, callback) {
	//console.log('[Console log] : exports.request_control = function(data, callback)');	

	var target="http://" + ip_address;
	var request="GET";
	var parameters="/aircon/get_control_info";
	
	var xmlhttp=new XMLHttpRequest();
    xmlhttp.open(request,target + parameters ,true);
	xmlhttp.onreadystatechange  = function () {
		if ( xmlhttp.readyState == 4 ){
			if( xmlhttp.status==200 ){
				var json = '{"' + xmlhttp.responseText.replace(/=/g, '": "').replace(/,/g, '", "') + '"}';
				var response = JSON.parse(json);
                var control_info = [];
                for (var setting in response){
                    control_info.push(response[setting]);
                };
				callback(control_info, response);																																											
			}else{
				console.log("Error: control request failed");
			}
		}else{
			//alert(xmlhttp.readyState);
		}
	}
	
	xmlhttp.send();
}

exports.request_sensor = function (ip_address, callback) {
	//console.log('[Console log] : exports.request_sensor = function (data, callback)');	
	
	var target="http://" + ip_address;
	var request="GET";
	var parameters="/aircon/get_sensor_info";
	
	var xmlhttp=new XMLHttpRequest();
    xmlhttp.open(request,target + parameters, true);
	xmlhttp.onreadystatechange  = function () {
		if ( xmlhttp.readyState == 4 ){
			if( xmlhttp.status==200 ){
				var json = '{"' + xmlhttp.responseText.replace(/=/g, '": "').replace(/,/g, '", "') + '"}';
				var response = JSON.parse(json);
                var sensor_info = [];
                for (var setting in response){
                    sensor_info.push(response[setting]);
                };
                callback(sensor_info);
			}else{
				console.log("Error: sensor request failed");
			}
		}else{
			
			//alert(xmlhttp.readyState);
		}
	}

	xmlhttp.send();
}


// POST new Mode settings to Airconditioner    
exports.daikinModeControl = function(airco_mode, ip_address) {
   console.log('exports.daikinModeControl');
      
   var daikin = new DaikinAC(ip_address, options, function(err) {
      // daikin.currentCommonBasicInfo - contains automatically requested basic device data
      // daikin.currentACModelInfo - contains automatically requested device model data           
      // modified DaikinAC,js so that currentACControlInfo is sent iso currentACModelInfo                     
       switch (airco_mode) { 
          case "off":             var amode = 5; var setpow = false;
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

/*
//------- for reference

 get >> /aircon/get_control_info
 
 result:
{ ret: 'OK',
  pow: '0',
  mode: '4',
  adv: '',
  stemp: '25.0',
  shum: '0',
  dt1: '25.0',
  dt2: 'M',
  dt3: '25.0',
  dt4: '25.0',
  dt5: '25.0',
  dt7: '25.0',
  dh1: 'AUTO',
  dh2: '50',
  dh3: '0',
  dh4: '0',
  dh5: '0',
  dh7: 'AUTO',
  dhh: '50',
  b_mode: '4',
  b_stemp: '25.0',
  b_shum: '0',
  alert: '255',
  f_rate: 'A',
  f_dir: '0',
  b_f_rate: 'A',
  b_f_dir: '0',
  dfr1: '5',
  dfr2: '5',
  dfr3: '5',
  dfr4: 'A',
  dfr5: 'A',
  dfr6: '5',
  dfr7: '5',
  dfrh: '5',
  dfd1: '0',
  dfd2: '0',
  dfd3: '0',
  dfd4: '0',
  dfd5: '0',
  dfd6: '0',
  dfd7: '0',
  dfdh: '0' }

 get >> /aircon/get_sensor_info

 result:
{ ret: 'OK',
  htemp: '20.0',
  hhum: '-',
  otemp: '5.0',
  err: '0',
  cmpfreq: '0' }
*/