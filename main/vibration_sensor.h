#include "driver/gpio.h"
#include "esp_log.h"

#define VIBRATION_GPIO_PIN 14

// Initialize the vibration sensor GPIO
void init_vibration_gpio(void);

// Read the current vibration state
bool read_vibration_state(void);
