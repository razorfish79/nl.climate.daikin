"use strict";

const Homey = require('homey');

class Device extends Homey.Device {

	onInit() {
		this.log('Device initialization...');    
		this.log('Driver name:', this.getName());
        this.log('Driver class:', this.getClass());
	}

	onAdded() {
		this.log('device added');
	}

	onDeleted() {
		this.log('device deleted');
	}

	getDeviceUrl() {
		return this.getData().deviceURL;
	}

	getDeviceType() {
		this.getDriver().getDeviceType();
	}

}

module.exports = Device;