#include "driver/gpio.h"
#include "esp_log.h"

#define WATER_LEAK_GPIO_PIN 14

// Initialize the water leak sensor GPIO
void init_water_leak_gpio(void);

// Read the current water leak state
bool read_water_leak_state(void);
