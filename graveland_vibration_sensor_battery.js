const {iasZoneAlarm, identify, battery} = require('zigbee-herdsman-converters/lib/modernExtend');
const ota = require('zigbee-herdsman-converters/lib/ota');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const e = exposes.presets;
const ea = exposes.access;

const fzLocal = {
    reset_count: {
        cluster: 'haDiagnostic',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
            if (msg.data.numberOfResets !== undefined) {
                return {reset_count: msg.data.numberOfResets};
            }
        },
    },
};

const definition = {
    zigbeeModel: ['Vibration Sensor (battery)'],
    model: 'Vibration Sensor (battery)',
    vendor: 'graveland',
    description: 'Vibration sensor (battery powered)',
    extend: [
        iasZoneAlarm({
            zoneType: 'vibration',
            zoneAttributes: ['alarm_1'],
        }),
        identify(),
        battery(),
    ],
    exposes: [
        e.numeric('reset_count', ea.STATE).withDescription('Number of device resets'),
    ],
    fromZigbee: [
        fzLocal.reset_count,
    ],
    configure: async (device, coordinatorEndpoint, logger) => {
        const endpoint = device.getEndpoint(1);
        // Read reset count from diagnostics cluster
        await endpoint.read('haDiagnostic', ['numberOfResets']);
    },
    ota: {
        isUpdateAvailable: async (device, logger, data = null) => {
            return ota.isUpdateAvailable(device, logger, data, {
                imageBlockResponseDelay: 250,
            });
        },
        updateToLatest: async (device, logger, onProgress) => {
            return ota.updateToLatest(device, logger, onProgress, {
                imageBlockResponseDelay: 250,
            });
        },
    },
};

module.exports = definition;
