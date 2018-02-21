#    >>>>>  THIS APP IS IN DEVELOPMENT  <<<<<
Do not use the MASTER branch for now, what is available in the development branch is the best available, use at own risk!

# Daikin AC
Adds support for Daikin Airconditioners.

# Current useability status:
* can be used for testing flows, familiarization etc. the airco is however always powered of to be safe.

# To-do (in random order)
* add more flow cards
* improve and extend "error handling"
* differentiate capabilities by model (inverter, emura, nexura)
* debugging...

# Development history
* 31-JAN-18: inside / outside / target temperature (fixed value for now) show on mobile card.
* 02-FEB-18: all data shown on mobile card is read from the airconditioner.
* 03-FEB-18: lifted the requirement to use experimental firmware v1.5.6, can now be previewed with Homey stable firmware v1.5.3.
* 04-FEB-18: translations of mode, fan, wing etc code in to meaningfull strings. Work done on changing airco setting.
* 07-FEB-18: Mobile card: temperature control is functional, mode selection functional.
* 11-FEB-18: 1/ Implemented the Apollon77 library. Note: for testing/troubleshooting purposes the airco power is always set to OFF.
* 11-FEB-18: 2/ Working on flow cards... not functional!
* 15-FEB-18: Added a trigger, condition and action flowcard.
* 16-FEB-18: 1/ Action triggers to set the: Airco Operation Mode, Fan rate, Fan direction and Target temperature.
* 16-FEB-18: 2/ Several code optimizations
* 16-FEB-18: 3/ Asset updates, now passes the Homey App Store validation cli
* 18-FEB-18: 1/ New pairing dialog
* 18-FEB-18: 2/ Emura driver enabled (still needs refinement...)  
* 19-FEB-18: 1/ Flowcard fix, now available to both the Emura and Inverter driver
* 19-FEB-18: 2/ Introduced demo mode which can be set via settings (as precaution by default the airco is put into demo mode)
* 19-FEB-18:    in demo mode the power is always OFF.
* 19-FEB-18: 3/ Mode switching: crushed a few bugs
* 20-FEB-18: The airco can now also be switched off with the mode settings wheel
* 21-FEB-18: Added a whole bunch of condition triggers

# Note: airco's power is always set to OFF when demo mode is selected (= default)

#Credits
<div>App uses icons that where created by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>