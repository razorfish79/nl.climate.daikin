"use strict";

const Homey = require('homey');
const XMLHttpRequest = require("./../../node_modules/XMLHttpRequest").XMLHttpRequest;

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
                var control_info = [];
                for (var setting in response){
                    control_info.push(response[setting]);
                }; 
				callback(control_info);																																											
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
