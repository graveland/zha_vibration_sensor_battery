# Zigbee Vibration Sensor

| Supported Targets | ESP32-C6 | ESP32-H2 |
| ----------------- | -------- | -------- |

This is a Zigbee vibration sensor using the IAS (Intruder Alarm System) Zone cluster. It's configured as a router device (powered by mains) and reports vibration status to your Zigbee coordinator.

## Hardware

- 1x ESP32-C6 (or ESP32-H2)
- 1x SW-420 vibration sensor module (digital output)

The SW-420 module has an onboard comparator circuit and outputs HIGH when vibration is detected.

## GPIO Configuration

- GPIO 14: Vibration sensor input (configurable via VIBRATION_GPIO in main/main.h)
  - HIGH (1) = Vibration detected
  - LOW (0) = No vibration (normal state)

## Features

- **IAS Zone Device**: Properly reports as a vibration sensor (zone type 0x0028)
- **Router Device**: Mains-powered Zigbee router (not an end device)
- **Interrupt-Driven**: Immediate response using GPIO interrupts with 50ms debouncing
- **10-Second Cooldown**: Prevents flooding coordinator with rapid vibration reports
- **Low Power**: CPU-efficient interrupt-driven design instead of polling
- **OTA Updates**: Supports Over-The-Air firmware updates

## OTA Update Process

1. Increment OTA_UPGRADE_FILE_VERSION in main/main.h (e.g., from 1 to 2)
2. Build the firmware: `idf.py build`
3. Create OTA image: `python3 create_ota_image.py build/zha_vibration_sensor.bin builds/vibration_sensor_v2.zigbee 2`
4. Copy the .zigbee file to your coordinator's OTA directory
5. Trigger OTA update from your Zigbee coordinator (ZHA, Zigbee2MQTT, etc.)

## Building and Flashing

```bash
idf.py build
idf.py flash monitor
```

## Integration

This device will show up as an IAS Zone vibration sensor in:
- Home Assistant (ZHA)
- Zigbee2MQTT
- Other Zigbee coordinators supporting IAS zones

The sensor reports immediately when vibration is detected or stopped.
