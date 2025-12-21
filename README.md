# Zigbee Vibration Sensor (Battery Powered)

| Supported Targets | ESP32-C6 | ESP32-H2 |
| ----------------- | -------- | -------- |

A battery-powered Zigbee vibration sensor using the IAS Zone cluster. Configured as an end device with deep sleep for long battery life.

## Hardware

- 1x ESP32-C6 (or ESP32-H2)
- 1x SW-420 vibration sensor module (digital output)
- 1x LiFePO4 3.2V battery cell
- 2x 100kΩ resistors (voltage divider for battery monitoring)

The SW-420 module has an onboard comparator circuit and outputs HIGH when vibration is detected.

## GPIO Configuration

| GPIO | Function | Notes |
|------|----------|-------|
| 14 | Vibration sensor input | HIGH=vibration, LOW=normal |
| 9 | Boot button | Long press (5s) for factory reset, wakes from sleep |
| 5 | Battery ADC input | Via 100k/100k voltage divider |
| 8 | RGB LED (WS2812) | Status indication |
| 13 | Status LED | Disabled to save power |

## Battery Monitoring

Connect the battery through a voltage divider to GPIO5:

```
Battery+ ──┬── 100kΩ ──┬── 100kΩ ──┬── GND
           │           │           │
           │         GPIO5        │
           └───────────────────────┘
```

LiFePO4 voltage range: 2.8V (empty) to 3.6V (full)

## Features

- **End Device**: Battery-powered sleepy device (not a router)
- **Deep Sleep**: Wakes on vibration, boot button press, or 30-minute timer
- **Factory Reset**: Press and hold boot button for 5 seconds (LED flashes red)
- **Battery Reporting**: Reports battery percentage to coordinator
- **IAS Zone Device**: Reports as vibration sensor (zone type 0x0028)
- **Interrupt-Driven**: GPIO wakeup with 50ms debouncing
- **Activity Timeout**: Stays awake 30 seconds after last vibration to catch bursts
- **10-Second Cooldown**: Prevents flooding coordinator with rapid reports
- **OTA Updates**: Supports Over-The-Air firmware updates

## Power Management

The device operates in a sleep cycle:

1. **Deep Sleep** - ~10µA current draw
2. **Wake on vibration** - GPIO interrupt triggers wakeup
3. **Wake on boot button** - Press button to wake and optionally factory reset
4. **Wake on timer** - 30-minute heartbeat with battery report
5. **Active period** - Stays awake 30s after last vibration
6. **Return to sleep** - After activity timeout expires

## OTA Update Process

1. Increment OTA_UPGRADE_FILE_VERSION in main/main.h
2. Build: `idf.py build`
3. Create OTA image: `python3 create_ota_image.py build/zha_vibration_sensor_battery.bin builds/vibration_sensor_v2.zigbee 2`
4. Copy .zigbee file to coordinator's OTA directory
5. Trigger OTA from coordinator (device must be awake)

## Building and Flashing

```bash
idf.py build
idf.py flash monitor
```

## Integration

Shows up as an IAS Zone vibration sensor with battery reporting in:
- Home Assistant (ZHA)
- Zigbee2MQTT (use graveland_vibration_sensor_battery.js converter)
- Other Zigbee coordinators supporting IAS zones

Reports vibration immediately on detection and battery level every 30 minutes.
