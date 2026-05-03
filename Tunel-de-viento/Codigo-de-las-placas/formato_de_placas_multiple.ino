#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiManager.h>
#include <ArduinoJson.h> // ¡La nueva librería mágica!

// ==========================================
// CONFIGURACIÓN DE HARDWARE
// ==========================================
const int fanPins[4]  = {32, 25, 27, 4}; 
#define LED_PIN 2

String moduloID = "Modulo_1"; // El ESP32 ahora es una sola entidad

// ==========================================
// CONFIGURACIÓN MQTT
// ==========================================
const char* mqttBroker = "broker.emqx.io";
const int mqttPort = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastReconnectAttempt = 0;
unsigned long lastIdPublish = 0;
String macAddress = "";

// ==========================================
// CALLBACK (Manejo del JSON entrante)
// ==========================================
void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) message += (char)payload[i];
  String strTopic = String(topic);

  // 1. Si la web pide identificación
  if (strTopic == "fanWall/wall/id" && message == "get") {
    client.publish("fanWall/wall/id", moduloID.c_str());
  } 
  // 2. Si recibimos un comando para nuestro módulo
  else if (strTopic == "fanWall/wall/" + moduloID) {
    
    // Creamos un documento JSON temporal en la memoria RAM
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, message);

    // Si el mensaje no era un JSON válido, lo ignoramos para evitar que la placa se cuelgue
    if (error) {
      Serial.print("Error leyendo JSON: ");
      Serial.println(error.c_str());
      return;
    }

    // Extraemos las 4 velocidades (si alguna no viene, ponemos 0 por defecto)
    int v1 = doc["v1"] | 0;
    int v2 = doc["v2"] | 0;
    int v3 = doc["v3"] | 0;
    int v4 = doc["v4"] | 0;

    // Ajustamos los ventiladores. 
    // PRO-TIP: Un pequeñísimo delay de 10ms entre cada encendido evita 
    // el pico de consumo (caída de voltaje) que reiniciaba tu placa.
    ledcWrite(fanPins[0], v1); delay(10);
    ledcWrite(fanPins[1], v2); delay(10);
    ledcWrite(fanPins[2], v3); delay(10);
    ledcWrite(fanPins[3], v4);
    
    Serial.printf("JSON Recibido! V1:%d | V2:%d | V3:%d | V4:%d\n", v1, v2, v3, v4);
  }
}

// ==========================================
// SETUP
// ==========================================
void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);

  WiFi.setTxPower(WIFI_POWER_8_5dBm); 

  for (int i = 0; i < 4; i++) {
    ledcAttach(fanPins[i], 25000, 8);
    ledcWrite(fanPins[i], 0);
  }

  WiFiManager wm;
  wm.setConfigPortalTimeout(300);
  if (!wm.autoConnect("ESP32_FanWall_Lab")) {
    Serial.println("Conectando con credenciales guardadas...");
  }

  macAddress = WiFi.macAddress();
  client.setServer(mqttBroker, mqttPort);
  client.setCallback(callback);
  client.setBufferSize(512); 
  
  digitalWrite(LED_PIN, LOW);
  Serial.println("Módulo iniciado en modo JSON.");
}

// ==========================================
// LOOP PRINCIPAL
// ==========================================
void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    if (!client.connected()) {
      unsigned long now = millis();
      if (now - lastReconnectAttempt > 5000) {
        lastReconnectAttempt = now;
        
        String clientId = "ESP32_" + macAddress + "_" + String(random(0xffff), HEX);
        
        if (client.connect(clientId.c_str())) {
          client.subscribe("fanWall/wall/id");
          
          // Ahora solo nos suscribimos a UN canal
          String topic = "fanWall/wall/" + moduloID;
          client.subscribe(topic.c_str());
          
          String statusMsg = "Connected/" + moduloID;
          client.publish("fanWall/wall/status", statusMsg.c_str());
          client.publish("fanWall/wall/id", moduloID.c_str());
        }
      }
    } else {
      client.loop();
      
      // Heartbeat: Solo avisamos de la existencia de "Modulo_1"
      unsigned long now = millis();
      if (now - lastIdPublish > 20000) {
        lastIdPublish = now;
        client.publish("fanWall/wall/id", moduloID.c_str());
      }
    }
  }
}