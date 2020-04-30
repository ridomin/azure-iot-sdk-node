'use strict';

const DigitalTwinClient = require('azure-iot-digitaltwins-device').DigitalTwinClient
const DeviceClient = require('azure-iot-device').Client
const Mqtt = require('azure-iot-device-mqtt').Mqtt

const DeviceInformation = require('./deviceInformation').DeviceInformation
const SdkInformation = require('./sdkInformation').SdkInformation
const TemperatureSensor = require('./temperatureSensor').TemperatureSensor

const modelId = "dtmi:com:examples:Thermostat;1"
const connectionString = process.env.DEVICE_CONNECTION_STRING

const propertyUpdateHandler = async (component, propertyName, reportedValue, desiredValue, version) => {
    console.log('Received an update for ' + propertyName + ': ' + JSON.stringify(desiredValue));
    await digitalTwinClient.report(component, { [propertyName]: desiredValue }, {
      code: 200,
      description: 'helpful descriptive text',
      version: version
    });
    console.log('updated the property');
  };

const tempSensor = new TemperatureSensor('tempSensor1', propertyUpdateHandler)
const deviceInformation = new DeviceInformation('deviceInfo')
const sdkInformation = new SdkInformation('sdkInfo')

const  main = async () => {
    const digitalTwinClient = DigitalTwinClient.fromConnectionString(modelId, connectionString)
    digitalTwinClient.addComponents(tempSensor,deviceInformation,sdkInformation)
  
    digitalTwinClient.enableCommands()
    await digitalTwinClient.enablePropertyUpdates()
  
    console.log('Reporting deviceInformation properties...')

    await digitalTwinClient.report(deviceInformation, {
      manufacturer: 'Contoso Device Corporation',
      model: 'Contoso 47-turbo',
      swVersion: '3.1',
      osName: 'Contoso_OS',
      processorArchitecture: 'Contoso_x86',
      processorManufacturer: 'Contoso Industries',
      totalStorage: 65000,
      totalMemory: 640,
    });
  

    await digitalTwinClient.sendTelemetry(tempSensor, {temperature: 21})
  }
  
  main();


