"use strict";

const Homey = require('homey');
const Driver = require('../../lib/driver');
const inverterctrl = require('../../lib/daikin');

//Driver for a Daikin Inverter type Airconditioner
class InverterDriver extends Driver {		

	onInit() {
		this.deviceType = 'inverter';

    //--- Temperature flowcards	
	    /*** INSIDE TEMPERATURE TRIGGERS ***/
/*		this._triggerTemperatureMoreThan = new Homey.FlowCardTriggerDevice('change_inside_temperature_more_than').register();
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

		/*** OUTSIDE TEMPERATURE TRIGGERS ***/
/*		this._triggerTemperatureMoreThan = new Homey.FlowCardTriggerDevice('change_outside_temperature_more_than').register();
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

		/*** TARGET TEMPERATURE TRIGGERS ***/        
        this._triggerTemperatureMoreThan = new Homey.FlowCardTriggerDevice('change_target_temperature_more_than').register();
		this._triggerTemperatureMoreThan.registerRunListener((args, state) => {
			let conditionMet = state.airco_temperature > args.target_temperature;
            this.log('trigger args.target_temperature', args.target_temperature);
            this.log('trigger state.airco_temperature', (state.airco_temperature) );
            this.log('trigger conditionMet', conditionMet);
			return Promise.resolve(conditionMet);
		});
/*
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
		this._conditionTemperatureMoreThan = new Homey.FlowCardCondition('has_target_temperature_more_than').register();
		this._conditionTemperatureMoreThan.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().airco_temperature > args.target_temperature;
            this.log('condition args.target_temperature', args.target_temperature);            
            this.log('condition device.getState().airco_temperature', (device.getState().airco_temperature) );
            this.log('condition conditionMet', conditionMet);
			return Promise.resolve(conditionMet);
		});

/*		this._conditionTemperatureLessThan = new Homey.FlowCardCondition('has_target_temperature_less_than').register();
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
        
    //--- Mode changes flowcards
    	/*** TARGET TEMPERATURE ACTIONS ***/ 
		this._actionAircoOn = new Homey.FlowCardAction('turn_airco_on').register();
		this._actionAircoOn.registerRunListener((args, state) => {
			let device = args.device;           
            let settings = device.getSettings();   
                                    
            var ip_address = settings.inverter_ip;    
            this.log('ip_address', ip_address);                        

            var airco_mode = args.mode;
            this.log('airco_mode', airco_mode); 
                        
            inverterctrl.daikinModeControl(airco_mode, ip_address);
			return Promise.resolve(airco_mode);
		});

		this._actionAircoOff = new Homey.FlowCardAction('turn_airco_off').register();
		this._actionAircoOff.registerRunListener((args, state) => {
			let device = args.device;           
            let settings = device.getSettings();   
                                    
            var ip_address = settings.inverter_ip;    
            this.log('ip_address', ip_address);                        

            var airco_mode = args.mode;
            this.log('airco_mode', airco_mode); 
                        
            inverterctrl.daikinModeControl(airco_mode, ip_address);
			return Promise.resolve(airco_mode);
		});            

		this._actionFanRate = new Homey.FlowCardAction('change_fan_rate').register();
		this._actionFanRate.registerRunListener((args, state) => {
			let device = args.device;           
            let settings = device.getSettings();   
                                    
            var ip_address = settings.inverter_ip;    
            this.log('ip_address', ip_address);                        

            var fan_rate = args.frate;
            this.log('fan_rate', fan_rate);
                        
            inverterctrl.daikinFanRateControl(fan_rate, ip_address);
			return Promise.resolve(fan_rate);
		});  

		this._actionFanDirection = new Homey.FlowCardAction('change_fan_direction').register();
		this._actionFanDirection.registerRunListener((args, state) => {
			let device = args.device;           
            let settings = device.getSettings();   
                                    
            var ip_address = settings.inverter_ip;    
            this.log('ip_address', ip_address);                        

            var fan_direction = args.fdir;
            this.log('fan_direction', fan_direction);
                        
            inverterctrl.daikinFanDirControl(fan_direction, ip_address);
			return Promise.resolve(fan_direction);
		});  

		this._actionTargetTemp = new Homey.FlowCardAction('change_target_temp').register();
		this._actionTargetTemp.registerRunListener((args, state) => {
			let device = args.device;           
            let settings = device.getSettings();   
                                    
            var ip_address = settings.inverter_ip;    
            this.log('ip_address', ip_address);                        

            var atemp = args.atemp;
            this.log('target temp', atemp);
                        
            inverterctrl.daikinTempControl(atemp, ip_address);
			return Promise.resolve(atemp);
		});  
               
	}

	triggerTemperatureMoreThan(device, tokens, state) {
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