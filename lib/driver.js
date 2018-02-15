"use strict";

const Homey = require('homey');

//Driver for a Daikin Airconditioner
class Driver extends Homey.Driver {
			
    onPair(socket) {
        socket.on('manual_add', function( device, callback ) {

		   var devices = {};
	       var request = require('request');
		   var url = 'http://' + device.data.ip + '/aircon/get_control_info';
		   console.log('Calling '+ url);
		   request(url, function (error, response, body) 
		   	{
				if (response === null || response === undefined) 
					{
						socket.emit("error", "http error");
						return;
					}
				if (!error && response.statusCode == 200) 
					{
		                devices[device.data.id] = {
		                  id: device.data.id,
		                  name: device.name,
	                      ip: device.data.ip
		                };
                   
						console.log('Device ID: ', device.data.id);
						console.log('Device ip-address: ', device.data.ip);
		                callback( null, devices );
		                socket.emit("success", device);
				  	} else {
			            socket.emit("error", "http error: "+response.statusCode);
					}
			});

            // emit when devices are still being searched
            socket.emit('list_devices', devices );

            // fire the callback when searching is done
            callback( null, devices );    

            // when no devices are found, return an empty array
            callback( null, [] );

            // or fire a callback with Error to show that instead
            callback( new Error('Something bad has occured!') );        

        });

    }

	triggerFlow(trigger, device, tokens, state) {
		if (trigger) {
			trigger
				.trigger(device, tokens, state)
				.then(this.log('flowcard triggered'))
				.catch(this.error);
		}
	}

	getDeviceType() {
		return this.deviceType ? this.deviceType : false;
	}
    
}

module.exports = Driver;