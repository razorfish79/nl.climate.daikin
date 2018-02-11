"use strict";

const Homey = require('homey');
const Driver = require('../../lib/driver');

//Driver for a Daikin Inverter type Airconditioner
class InverterDriver extends Driver {		

	onInit() {
		this.deviceType = 'inverter';

    //--- Temperature flowcards	
	    /*** INSIDE TEMPERATURE TRIGGERS ***/
		this._triggerTemperatureMoreThan = new Homey.FlowCardTriggerDevice('change_inside_temperature_more_than').register();
		this._triggerTemperatureMoreThan.registerRunListener((args, state) => {
			let conditionMet = state.measure_temperature > args.temperature;
			return Promise.resolve(conditionMet);
		});

		this._triggerTemperatureLessThan = new Homey.FlowCardTriggerDevice('change_inside_temperature_less_than').register()
		this._triggerTemperatureLessThan.registerRunListener((args, state) => {
			let conditionMet = state.measure_temperature < args.temperature;
			return Promise.resolve(conditionMet);
		});

		this._triggerTemperatureBetween = new Homey.FlowCardTriggerDevice('change_inside_temperature_between').register()
		this._triggerTemperatureBetween.registerRunListener((args, state) => {
			let conditionMet = state.measure_temperature > args.temperature_from && state.measure_temperature < args.temperature_to;
			return Promise.resolve(conditionMet);
		});

		/*** INSIDE TEMPERATURE CONDITIONS ***/
/*		this._conditionTemperatureMoreThan = new Homey.FlowCardCondition('has_inside_temperature_more_than').register();
		this._conditionTemperatureMoreThan.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().measure_temperature > args.temperature;
			return Promise.resolve(conditionMet);
		});

		this._conditionTemperatureLessThan = new Homey.FlowCardCondition('has_inside_temperature_less_than').register();
		this._conditionTemperatureLessThan.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().measure_temperature < args.temperature;
			return Promise.resolve(conditionMet);
		});

		this._conditionTemperatureBetween = new Homey.FlowCardCondition('has_inside_temperature_between').register();
		this._conditionTemperatureBetween.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().measure_temperature > args.temperature_from && device.getState().measure_temperature < args.temperature_to;
			return Promise.resolve(conditionMet);
		});
*/
		/*** OUTSIDE TEMPERATURE TRIGGERS ***/
		this._triggerTemperatureMoreThan = new Homey.FlowCardTriggerDevice('change_outside_temperature_more_than').register();
		this._triggerTemperatureMoreThan.registerRunListener((args, state) => {
			let conditionMet = state.measure_temperature > args.temperature;
			return Promise.resolve(conditionMet);
		});

		this._triggerTemperatureLessThan = new Homey.FlowCardTriggerDevice('change_outside_temperature_less_than').register()
		this._triggerTemperatureLessThan.registerRunListener((args, state) => {
			let conditionMet = state.measure_temperature < args.temperature;
			return Promise.resolve(conditionMet);
		});

		this._triggerTemperatureBetween = new Homey.FlowCardTriggerDevice('change_outside_temperature_between').register()
		this._triggerTemperatureBetween.registerRunListener((args, state) => {
			let conditionMet = state.measure_temperature > args.temperature_from && state.measure_temperature < args.temperature_to;
			return Promise.resolve(conditionMet);
		});

		/*** OUTSIDE TEMPERATURE CONDITIONS ***/
/*		this._conditionTemperatureMoreThan = new Homey.FlowCardCondition('has_outside_temperature_more_than').register();
		this._conditionTemperatureMoreThan.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().measure_temperature > args.temperature;
			return Promise.resolve(conditionMet);
		});

		this._conditionTemperatureLessThan = new Homey.FlowCardCondition('has_outside_temperature_less_than').register();
		this._conditionTemperatureLessThan.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().measure_temperature < args.temperature;
			return Promise.resolve(conditionMet);
		});

		this._conditionTemperatureBetween = new Homey.FlowCardCondition('has_outside_temperature_between').register();
		this._conditionTemperatureBetween.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().measure_temperature > args.temperature_from && device.getState().measure_temperature < args.temperature_to;
			return Promise.resolve(conditionMet);
		});
*/
		/*** TARGET TEMPERATURE TRIGGERS ***/
		this._triggerTemperatureMoreThan = new Homey.FlowCardTriggerDevice('change_target_temperature_more_than').register();
		this._triggerTemperatureMoreThan.registerRunListener((args, state) => {
			let conditionMet = state.airco_temperature > args.target_temperature;
			return Promise.resolve(conditionMet);
		});

		this._triggerTemperatureLessThan = new Homey.FlowCardTriggerDevice('change_target_temperature_less_than').register()
		this._triggerTemperatureLessThan.registerRunListener((args, state) => {
			let conditionMet = state.airco_temperature < args.target_temperature;
			return Promise.resolve(conditionMet);
		});

		this._triggerTemperatureBetween = new Homey.FlowCardTriggerDevice('change_target_temperature_between').register()
		this._triggerTemperatureBetween.registerRunListener((args, state) => {
			let conditionMet = state.airco_temperature > args.target_temperature_from && state.airco_temperature < args.target_temperature_to;
			return Promise.resolve(conditionMet);
		});

    	/*** TARGET TEMPERATURE CONDITIONS ***/
/*		this._conditionTemperatureMoreThan = new Homey.FlowCardCondition('has_target_temperature_more_than').register();
		this._conditionTemperatureMoreThan.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().airco_temperature > args.target_temperature;
			return Promise.resolve(conditionMet);
		});

		this._conditionTemperatureLessThan = new Homey.FlowCardCondition('has_target_temperature_less_than').register();
		this._conditionTemperatureLessThan.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().airco_temperature < args.target_temperature;
			return Promise.resolve(conditionMet);
		});

		this._conditionTemperatureBetween = new Homey.FlowCardCondition('has_target_temperature_between').register();
		this._conditionTemperatureBetween.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().airco_temperature > args.target_temperature_from && device.getState().airco_temperature < args.target_temperature_to;
			return Promise.resolve(conditionMet);
		});
*/                
    //--- Fan rate flowcards
        
    //--- Fan direction flowcards
        
    //--- mode changes flowcards
        
	}

	triggerTemperatureMoreThan(device, tokens, state) {
        this.log('triggerTemperatureMoreThan');
        this.log('tokens:', tokens);
        this.log('state:', state);
		this.triggerFlow(this._triggerTemperatureMoreThan, device, tokens, state);
		return this;
	}

	triggerTemperatureLessThan(device, tokens, state) {
		this.triggerFlow(this._triggerTemperatureLessThan, device, tokens, state);
		return this;
	}

	triggerTemperatureBetween(device, tokens, state) {
		this.triggerFlow(this._triggerTemperatureBetween, device, tokens, state);
		return this;
	}

}

module.exports = InverterDriver;