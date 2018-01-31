"use strict";

const Homey = require('homey');
const XMLHttpRequest = require("./../../node_modules/XMLHttpRequest").XMLHttpRequest;

// variables used in function request_control for parsing of "/aircon/get_control_info" data
var pow=0, mode=0, adv=0, stemp=0, shum=0, dt1=0, dt2=0, dt3=0, dt4=0, dt5=0, dt6=0, dt7=0, dh1=0, dh2=0, dh3=0, dh4=0, dh5=0, dh6=0, dh7=0, dhh=0,
    b_mode=0, b_stemp=0, b_shum=0, ac_alert=0, f_rate=0, f_dir=0, b_f_rate=0, b_f_dir=0, dfr1=0, dfr2=0, dfr3=0, dfr4=0, dfr5=0, dfr6=0, dfr7=0, dhfrh=0,
    dfd1=0, dfd2=0, dfd3=0, dfd4=0, dfd5=0, dfd6=0, dfd7=0, dfdh=0;
	
// variables used in fuction request_sensor for parsing of "/aircon/get_sensor_info" data
var htemp = 0, otemp = 0;

exports.request_control = function(data, callback) {
	console.log('[Console log] : exports.request_control = function(data, callback)');	

	var target="http://" + data;
	var request="GET";
	var parameters="/aircon/get_control_info";
	
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange  = function () {
		if ( xmlhttp.readyState == 4 ){
			if( xmlhttp.status==200 ){
				var json = '{"' + xmlhttp.responseText.replace(/=/g, '": "').replace(/,/g, '", "') + '"}';
				var response = JSON.parse(json);
				pow = (String(response.pow));
			    mode = (String(response.mode));
				adv = (String(response.adv));
				stemp = (String(response.stemp));
				shum = (String(response.shum));
				dt1 = (String(response.dt1));
				dt2 = (String(response.dt2));
				dt3 = (String(response.dt3));
				dt4 = (String(response.dt4));
				dt5 = (String(response.dt5));				
				//dt6 = (String(response.dt6));
				dt7 = (String(response.dt7));
				dh1 = (String(response.dh1));
				dh2 = (String(response.dh2));
				dh3 = (String(response.dh3));
				dh4 = (String(response.dh4));
				dh5 = (String(response.dh5));
				//dh6 = (String(response.dh6));
				dh7 = (String(response.dh7));				
				dhh = (String(response.dhh));
				b_mode = (String(response.b_mode));
				b_stemp = (String(response.b_stemp));
				b_shum = (String(response.b_shum));
				ac_alert = (String(response.alert));
				f_rate = (String(response.f_rate));
				f_dir = (String(response.f_dir));
				b_f_rate = (String(response.b_f_rate));
				b_f_dir = (String(response.b_f_dir));				
				dfr1 = (String(response.dfr1));
				dfr2 = (String(response.dfr2));
				dfr3 = (String(response.dfr3));
				dfr4 = (String(response.dfr4));								
				dfr5 = (String(response.dfr5));
				//dfr6 = (String(response.dfr6));
				dfr7 = (String(response.dfr7));
				dfrh = (String(response.dfrh));					
				dfd1 = (String(response.dfd1));
				dfd2 = (String(response.dfd2));
				dfd3 = (String(response.dfd3));
				dfd4 = (String(response.dfd4));								
				dfd5 = (String(response.dfd5));
				//dfd6 = (String(response.dfd6));
				dfd7 = (String(response.dfd7));
				dfdh = (String(response.dfdh));
				console.log('pow:', pow);
				console.log('mode:', mode);
				console.log('adv:', adv);
				console.log('stemp:', stemp);
				console.log('shum:', shum);
				console.log('dt1:', dt1);
				console.log('dt2:', dt2);
				console.log('dt3:', dt3);
				console.log('dt4:', dt4);
				console.log('dt5:', dt5);
				console.log('dt7:', dt7);
				console.log('dh1:', dh1);
				console.log('dh2:', dh2);
				console.log('dh3:', dh3);
				console.log('dh4:', dh4);
				console.log('dh5:', dh5);
				console.log('dh7:', dh7);				
				console.log('dhh:', dhh);
				console.log('b_mode:', b_mode);
				console.log('b_stemp:', b_stemp);																								
				console.log('b_shum:', b_shum);
				console.log('alert:', alert);
				console.log('f_rate:', f_rate);
				console.log('f_dir:', f_dir);
				console.log('b_f_rate:', b_f_rate);
				console.log('b_f_dir:', b_f_dir);
				console.log('dfr1:', dfr1);																								
				console.log('dfr2:', dfr2);
				console.log('dfr3:', dfr3);
				console.log('dfr4:', dfr4);
				console.log('dfr5:', dfr5);
				console.log('dfr7:', dfr7);
				console.log('dfrh:', dfrh);
				console.log('dfd1:', dfd1);																								
				console.log('dfd2:', dfd2);
				console.log('dfd3:', dfd3);
				console.log('dfd4:', dfd4);
				console.log('dfd5:', dfd5);
				console.log('dfd7:', dfd7);
				console.log('dfdh:', dfdh);
				callback(pow, mode, adv, stemp, shum, dt1, dt2, dt3, dt4, dt5, dt6, dt7, dh1, dh2, dh3, dh4, dh5, dh6, dh7, dhh,
                           b_mode, b_stemp, b_shum, ac_alert, f_rate, f_dir, b_f_rate, b_f_dir, dfr1, dfr2, dfr3, dfr4, dfr5, dfr6,
					          dfr7, dhfrh, dfd1, dfd2, dfd3, dfd4, dfd5, dfd6, dfd7, dfdh);																																											
			}else{
				console.log("Error: control request failed");
			}
		}else{
			//alert(xmlhttp.readyState);
		}
	}
	
	xmlhttp.open(request,target + parameters ,true);
	xmlhttp.send();
}

exports.request_sensor = function (data, callback) {
	console.log('[Console log] : exports.request_sensor = function (data, callback)');	
	
	var target="http://" + data;
	var request="GET";
	var parameters="/aircon/get_sensor_info";
	
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange  = function () {
		if ( xmlhttp.readyState == 4 ){
			if( xmlhttp.status==200 ){
				var json = '{"' + xmlhttp.responseText.replace(/=/g, '": "').replace(/,/g, '", "') + '"}';
				var response = JSON.parse(json);
				htemp = (String(response.htemp));
				otemp = (String(response.otemp));
				//console.log('hometemp:', htemp);
				//console.log('outsidetemp:', otemp);
			    callback(htemp, otemp);
			}else{
				console.log("Error: sensor request failed");
			}
		}else{
			
			//alert(xmlhttp.readyState);
		}
	}
	xmlhttp.open(request,target + parameters, true);
	xmlhttp.send();
}

exports.send_control = function (opts) {
	
	var target="http://" + data; console.log('passed data: ', data);
	var request="POST";
	
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange  = function () {
		if ( xmlhttp.readyState == 4 ){
			if( xmlhttp.status==200 ){
				var response = JSON.parse(xmlhttp.responseText);
				console.log(response);
			}else{
				console.log("Error: send control request failed");
			}
		}else{
			//alert(xmlhttp.readyState);
		}
	}
	
	xmlhttp.open(request,target,true);
	xmlhttp.setRequestHeader("Content-type","application/json");
	xmlhttp.send(JSON.stringify(opts));
		
}
