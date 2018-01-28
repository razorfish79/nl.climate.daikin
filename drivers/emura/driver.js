"use strict";

const Homey = require('homey');

//Driver for a Daikin Emura Airconditioner
class EmuraDriver extends Homey.Driver {
	
    onPair( socket ) {

        socket.on('manual_add', function( device, callback ) {

	       var request = require('request');
		   var devices = {};
		   var url = 'http://' + device.data.ip + '/aircon/get_model_info';
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
		                console.log('Daikin Emura Airconditioner added');
		                devices[device.data.id] = {
		                  id: device.data.id,
		                  name: device.name,
	                      ip: device.data.ip
		                };
						console.log(device.data);
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
}

module.exports = EmuraDriver;