// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
'use strict';

const BaseInterface = require('azure-iot-digitaltwins-device').BaseInterface;
const Telemetry = require('azure-iot-digitaltwins-device').Telemetry;
const Command = require('azure-iot-digitaltwins-device').Command;

module.exports.Diagnostics = class Diagnostics extends BaseInterface {
  constructor(name, commandCallbackHandler) {
    super(name, 'dtmi:com:examples:Diagnostics;1', undefined, commandCallbackHandler);
    this.workingSet = new Telemetry();
    this.reboot = new Command();
  }
};
