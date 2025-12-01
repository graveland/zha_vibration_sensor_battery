const {iasZoneAlarm, identify, numeric} = require('zigbee-herdsman-converters/lib/modernExtend');
const ota = require('zigbee-herdsman-converters/lib/ota');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const e = exposes.presets;

const definition = {
    zigbeeModel: ['Water Leak Sensor'],
    model: 'Water Leak Sensor',
    vendor: 'graveland',
    description: 'Water leak sensor (mains powered router)',
    extend: [
        iasZoneAlarm({
            zoneType: 'water_leak',
            zoneAttributes: ['alarm_1'],
        }),
        identify(),
        numeric({
            name: 'suppressed_changes',
            cluster: 'ssIasZone',
            attribute: {ID: 0xC000, type: 0x23},
            description: 'Cumulative count of suppressed state changes',
            zigbeeCommandOptions: {manufacturerCode: 0x1234},
            reporting: {min: 60, max: 3600, change: 1},
            access: 'STATE_GET',
        }),
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

        // Bind power config and IAS zone clusters
        await endpoint.bind('genPowerCfg', coordinatorEndpoint);
        await endpoint.bind('ssIasZone', coordinatorEndpoint);

        // IAS Zone devices use zone status change notifications, not periodic reporting
        // The device will automatically send notifications when the zone status changes

        // Configure reporting for suppression counter (custom attribute 0xC000)
        await endpoint.configureReporting('ssIasZone', [{
            attribute: {ID: 0xC000, type: 0x23}, // U32 type
            minimumReportInterval: 60,           // Min 60 seconds
            maximumReportInterval: 3600,         // Max 1 hour
            reportableChange: 1,                 // Report on any increment
        }], {manufacturerCode: 0x1234});
    },
};

module.exports = definition;
