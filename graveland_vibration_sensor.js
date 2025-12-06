const {iasZoneAlarm, identify, numeric} = require('zigbee-herdsman-converters/lib/modernExtend');
const ota = require('zigbee-herdsman-converters/lib/ota');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const e = exposes.presets;

const definition = {
    zigbeeModel: ['Vibration Sensor'],
    model: 'Vibration Sensor',
    vendor: 'graveland',
    description: 'Vibration sensor (mains powered router)',
    extend: [
        iasZoneAlarm({
            zoneType: 'vibration',
            zoneAttributes: ['alarm_1'],
        }),
        identify(),
        numeric({
            name: 'suppressed_changes',
            cluster: 'ssIasZone',
            attribute: {ID: 0xC000, type: 0x23},
            description: 'Cumulative count of suppressed state changes',
            reporting: {min: 60, max: 3600, change: 1},
            access: 'STATE_GET',
        }),
    ],
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
    configure: async (device, coordinatorEndpoint) => {
        const endpoint = device.getEndpoint(1);

        // Bind power config and IAS zone clusters
        await endpoint.bind('genPowerCfg', coordinatorEndpoint);
        await endpoint.bind('ssIasZone', coordinatorEndpoint);

        // IAS Zone devices use zone status change notifications, not periodic reporting
        // The device will automatically send notifications when the zone status changes
    },
};

module.exports = definition;
