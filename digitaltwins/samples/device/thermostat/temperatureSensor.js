'use strict';

const BaseInterface = require('azure-iot-digitaltwins-device').BaseInterface;
const Telemetry = require('azure-iot-digitaltwins-device').Telemetry;
const Property = require('azure-iot-digitaltwins-device').Property;
const Command = require('azure-iot-digitaltwins-device').Command;

module.exports.TemperatureSensor = class TemperatureSensor extends BaseInterface {
  constructor(name, propertyCallback, commandCallback) {
    super(name, 'dtmi:com:examples:TemperatureSensor;1', propertyCallback, commandCallback);
    this.temperature = new Telemetry();
    this.targetTemperature = new Property(true);
  }
};