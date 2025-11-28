started from: https://github.com/prairiesnpr/esp_zha_freezer_mon

This is just a single temperature sensor now, but I'm attempting to hack on OTA updates. I'm currently stuck getting
zigbee2mqtt to cooperate.

to OTA:
- increment OTA_UPGRADE_FILE_VERSION in main/main.h from 1 -> 2
- idf.py build
- python3 create_ota_image.py build/graveland_temperature_sensor.bin builds/graveland_temperature_sensor_v2.zigbee 2
- copy builds/graveland_temperature_monitor_v2.zigbee to zigbee2mqtt's data/ota directory
- update zigbee2mqtt's index.json


original README:
| Supported Targets | ESP32-C6 | ESP32-H2 | 
| ----------------- | -------- | -------- | 

This is a Zigbee temperature monitor, in my case used for a freezer. The design supports up to
four ds18b20s. The only other component required is a 4.7kohm resistor between data and Vcc.

As built:
1 - esp32-C6 Super Mini.
1 - 4.7kohm resistor
4 - ds18b20s temperature probes
