// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
'use strict';

const BaseInterface = require('azure-iot-digitaltwins-device').BaseInterface;
const Property = require('azure-iot-digitaltwins-device').Property;

module.exports.SdkInformation = class SdkInformation extends BaseInterface {
  constructor(name) {
    super(name, 'dtmi:azure:Client:SDKInformation;1', undefined, undefined);
    this.language = new Property();
    this.version = new Property();
    this.vendor = new Property();    
  }
};
