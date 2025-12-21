#include "esp_zigbee_core.h"
#include "esp_zigbee_ota.h"

/* Zigbee configuration */
#define INSTALLCODE_POLICY_ENABLE                                              \
  false /* enable the install code policy for security */
#define ED_AGING_TIMEOUT ESP_ZB_ED_AGING_TIMEOUT_64MIN
#define ED_KEEP_ALIVE 3000 /* 3000 millisecond */
#define HA_ESP_VIBRATION_ENDPOINT 1 /* esp vibration sensor device endpoint */

#define ESP_ZB_PRIMARY_CHANNEL_MASK                                            \
  ESP_ZB_TRANSCEIVER_ALL_CHANNELS_MASK /* Zigbee primary channel mask use in   \
                                          the example */

#define VIBRATION_GPIO 14 /* GPIO pin for vibration sensor (SW-420) */
#define RGB_LED_GPIO 8 /* GPIO pin for RGB LED */
#define STATUS_LED_GPIO 13 /* GPIO pin for board status LED (disabled) */
#define BOOT_BUTTON_GPIO 9 /* GPIO pin for boot button (factory reset) */
#define HEARTBEAT_INTERVAL_US (1800000000ULL) /* Heartbeat every 30m (microseconds) */
#define REPORT_COOLDOWN_MS 10000 /* 10 second cooldown between reports */
#define ACTIVITY_TIMEOUT_MS 30000 /* Stay awake 30s after last vibration */
#define BOOT_BUTTON_LONG_PRESS_MS 5000 /* 5 second hold for factory reset */

/* Battery ADC configuration (LiFePO4 3.2V cell) */
#define BATTERY_ADC_CHANNEL ADC_CHANNEL_4 /* GPIO5 = ADC1_CHANNEL_4 on ESP32-H2 */
#define BATTERY_VOLTAGE_DIVIDER 0.5f /* 100k/100k divider ratio */
#define BATTERY_MIN_MV 2800 /* 2.8V = 0% (LiFePO4 cutoff) */
#define BATTERY_MAX_MV 3600 /* 3.6V = 100% (LiFePO4 full) */

/* Attribute values in ZCL string format
 * The string should be started with the length of its own.
 */
#define MANUFACTURER_NAME                                                      \
  "\x09"                                                                       \
  "graveland"
#define MODEL_IDENTIFIER                                                       \
  "\x1a"                                                                       \
  "Vibration Sensor (battery)"

/* OTA Upgrade configuration */
#define OTA_UPGRADE_MANUFACTURER                                               \
  0x1234 /* Manufacturer code (must match OTA image) */
#define OTA_UPGRADE_IMAGE_TYPE 0x567c       /* Image type (must match OTA image) */
#define OTA_UPGRADE_FILE_VERSION        0x00000005              /* Current firmware version */
#define OTA_UPGRADE_HW_VERSION 0x0001       /* Hardware version */
#define OTA_UPGRADE_MAX_DATA_SIZE 64        /* OTA image block size */

/* OTA element format */
#define OTA_ELEMENT_HEADER_LEN                                                 \
  6 /* Header size: tag identifier (2) + length (4) */

typedef enum {
  UPGRADE_IMAGE = 0x0000, /* Upgrade image tag */
} esp_ota_element_tag_id_t;

#define ESP_ZB_ZED_CONFIG()                                                    \
  {                                                                            \
      .esp_zb_role = ESP_ZB_DEVICE_TYPE_ED,                                    \
      .install_code_policy = INSTALLCODE_POLICY_ENABLE,                        \
      .nwk_cfg.zed_cfg =                                                       \
          {                                                                    \
              .ed_timeout = ED_AGING_TIMEOUT,                                  \
              .keep_alive = ED_KEEP_ALIVE,                                     \
          },                                                                   \
  }

#define ESP_ZB_ZR_CONFIG()                                                     \
  {                                                                            \
      .esp_zb_role = ESP_ZB_DEVICE_TYPE_ROUTER,                                \
      .install_code_policy = INSTALLCODE_POLICY_ENABLE,                        \
      .nwk_cfg.zczr_cfg =                                                      \
          {                                                                    \
              .max_children = 10,                                              \
          },                                                                   \
  }

#define ESP_ZB_DEFAULT_RADIO_CONFIG()                                          \
  {                                                                            \
      .radio_mode = ZB_RADIO_MODE_NATIVE,                                      \
  }

#define ESP_ZB_DEFAULT_HOST_CONFIG()                                           \
  {                                                                            \
      .host_connection_mode = ZB_HOST_CONNECTION_MODE_NONE,                    \
  }

