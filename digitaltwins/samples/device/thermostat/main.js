'use strict';

const os = require('os')

const DigitalTwinClient = require('azure-iot-digitaltwins-device').DigitalTwinClient

const DeviceInformation = require('./deviceInformation').DeviceInformation
const SdkInformation = require('./sdkInformation').SdkInformation
const TemperatureSensor = require('./temperatureSensor').TemperatureSensor
const Diagnostics = require('./diagnostics').Diagnostics

const modelId = "dtmi:com:examples:Thermostat;1"
const connectionString = process.env.DEVICE_CONNECTION_STRING

let currentTemp = 20
let targetTemp = 20
let telemetryLoop = {}

const propertyUpdateHandler = async (component, propertyName, reportedValue, desiredValue, version) => {
  console.log('Received an update for ' + propertyName + ': ' + JSON.stringify(desiredValue));
  targetTemp = parseFloat(JSON.stringify(desiredValue))
  adjustTemp(targetTemp)
  await digitalTwinClient.report(component, { [propertyName]: desiredValue }, {
    code: 200,
    description: 'helpful descriptive text',
    version: version
  });
  console.log('updated the property');
};

const commandHandler = async (request, response) => {
  console.log('received command: ' + request.commandName + ' for component: ' + request.componentName);
  if (request.commandName==='reboot') {
    clearInterval(telemetryLoop)
    console.log('rebooting')
    for (let index = 0; index < 10; index++) {
      console.log('.')
      await sleep(300)
    }
    currentTemp = 20
    await startTelemetryLoop()
  }
  response.acknowledge(200, 'helpful response text');
  console.log('acknowledgement succeeded.');
};

const digitalTwinClient = DigitalTwinClient.fromConnectionString(modelId, connectionString)

const tempSensor = new TemperatureSensor('tempSensor1', propertyUpdateHandler)
const deviceInformation = new DeviceInformation('deviceInfo')
const sdkInformation = new SdkInformation('sdkInfo')
const diag = new Diagnostics('diag', commandHandler)


const thisSdkInfo = {
  language: 'node',
  version: '0.9.1-preview',
  vendor: 'rido'
}

const thisDeviceInfo = {
  manufacturer: 'Azure IoT Samples',
  model: 'Thermostat.PnP-PPR',
  swVersion: '0.1',
  osName: os.platform(),
  processorArchitecture: os.arch(),
  processorManufacturer: 'Contoso Industries',
  totalStorage: 65000,
  totalMemory: os.totalmem(),
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const adjustTemp = async (target) => {
  let step = (parseFloat(target) - currentTemp) / 10
  for (let index = 9; index >= 0; index--) {
    currentTemp = target - step * parseFloat(index)
    console.log("updating current temp to " + currentTemp)
    await sleep(1000)
  }
}

const startTelemetryLoop = async() => {
  telemetryLoop = setInterval(async () => {
    if (currentTemp != targetTemp) {
      console.log("sending temp " + currentTemp)
      await digitalTwinClient.sendTelemetry(tempSensor, { temperature: currentTemp })
    } else {
      console.log("CurrentTemp equals TargetTemp, not sending temp telemetry")
    }
    await digitalTwinClient.sendTelemetry(diag, { workingSet: os.freemem})
  }, 2000)
}

const main = async () => {
  digitalTwinClient.addComponents(tempSensor, deviceInformation, sdkInformation, diag)
  digitalTwinClient.enableCommands()
  await digitalTwinClient.enablePropertyUpdates()
  await digitalTwinClient.report(deviceInformation, thisDeviceInfo)
  await digitalTwinClient.report(sdkInformation, thisSdkInfo)
}

main();


