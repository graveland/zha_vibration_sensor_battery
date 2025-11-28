const {temperature, identify} = require('zigbee-herdsman-converters/lib/modernExtend');
const ota = require('zigbee-herdsman-converters/lib/ota');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const e = exposes.presets;

const definition = {
    zigbeeModel: ['Temperature Sensor'],
    model: 'Temperature Sensor',
    vendor: 'graveland',
    description: 'Temperature sensor (mains powered)',
    extend: [
        temperature(),
        identify(),
    ],
    ota: {
        isUpdateAvailable: async (device, logger, data = null) => {
            return ota.isUpdateAvailable(device, logger, data, {
                imageBlockResponseDelay: 500,
            });
        },
        updateToLatest: async (device, logger, onProgress) => {
            return ota.updateToLatest(device, logger, onProgress, {
                imageBlockResponseDelay: 500,
            });
        },
    },
    configure: async (device, coordinatorEndpoint) => {
        const endpoint = device.getEndpoint(1);

        // Bind power config and temperature measurement clusters for reporting
        await endpoint.bind('genPowerCfg', coordinatorEndpoint);
        await endpoint.bind('msTemperatureMeasurement', coordinatorEndpoint);

        // Configure temperature reporting
        await endpoint.configureReporting('msTemperatureMeasurement', [
            {
                attribute: 'measuredValue',
                minimumReportInterval: 5,     // Report at least every 5 second
                maximumReportInterval: 300,   // Report every 5 minutes
                reportableChange: 50,         // Report on 1.0°C change (value is in 0.01°C units)
            }
        ]);
    },
};

module.exports = definition;
