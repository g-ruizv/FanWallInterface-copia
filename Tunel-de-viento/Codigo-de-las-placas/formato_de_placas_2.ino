#include <WiFi.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiManager.h>

// ==========================================
// CONFIGURACIÓN DE HARDWARE (MK II)
// ==========================================
const int fanPins[4]  = {32, 25, 27, 4};   
const int tachPins[4] = {33, 26, 14, 13};  
#define LED_PIN 2

// ==========================================
// CONFIGURACIÓN MQTT
// ==========================================
const char* mqttBroker = "broker.emqx.io";
const int mqttPort = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

String macAddress = "";
String selfTopic = "";
unsigned long lastReconnectAttempt = 0;

// ==========================================
// CONTROL DE VENTILADORES
// ==========================================
void setSpeeds(int speed) {
  speed = constrain(speed, 0, 255);
  for (int i = 0; i < 4; i++) {
    ledcWrite(fanPins[i], speed);
  }
  Serial.printf("Velocidad: %d\n", speed);
}

// ==========================================
// RECEPCIÓN DE MENSAJES (Desde la Web)
// ==========================================
void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) message += (char)payload[i];
  String strTopic = String(topic);

  // 1. La web pregunta "¿Quién está ahí?"
  if (strTopic == "fanWall/wall/id" && message == "get") {
    client.publish("fanWall/wall/id", macAddress.c_str());
    Serial.println("-> Respondí a la orden 'get'");
    delay(10);
  }
  // 2. La web manda una nueva velocidad a esta placa
  else if (strTopic == selfTopic) {
    setSpeeds(message.toInt());
  }
}

// ==========================================
// CONEXIÓN MQTT
// ==========================================
boolean reconnect() {
  Serial.println("Conectando a MQTT...");
  String clientId = "ESP32-" + macAddress;
  
  if (client.connect(clientId.c_str())) {
    Serial.println("¡Conectado al Broker MQTT!");
    
    // Suscribirse a los canales
    client.subscribe("fanWall/wall/id");
    client.subscribe("fanWall/wall/control");
    client.subscribe(selfTopic.c_str());
    
    // Avisarle a Python que acabo de revivir
    String statusMsg = "Connected/" + macAddress;
    client.publish("fanWall/wall/status", statusMsg.c_str());
    return true;
  }
  return false;
}

// ==========================================
// SETUP MAIN
// ==========================================
void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);

  // MITIGACIÓN DE COLAPSO ELÉCTRICO (BROWNOUT)
  // Bajamos el consumo del WiFi del 100% al 70% para no ahogar la placa
  WiFi.setTxPower(WIFI_POWER_8_5dBm); 

  // Iniciar ventiladores apagados
  for (int i = 0; i < 4; i++) {
    ledcAttach(fanPins[i], 25000, 8);
    ledcWrite(fanPins[i], 0);
  }

  // Iniciar WiFiManager (Creará la red ESP32_FanWall si no tiene internet)
  WiFiManager wm;
  wm.setConfigPortalTimeout(120);
  if (!wm.autoConnect("ESP32_FanWall")) {
    Serial.println("Fallo al conectar WiFi. Reiniciando...");
    delay(3000);
    ESP.restart();
  }

  macAddress = WiFi.macAddress();
  selfTopic = "fanWall/wall/" + macAddress;

  client.setServer(mqttBroker, mqttPort);
  client.setCallback(callback);
  
  digitalWrite(LED_PIN, LOW); // Apaga el LED cuando ya está todo listo
  Serial.println("=== SISTEMA INICIADO Y LIGERO ===");
}

// ==========================================
// LOOP PRINCIPAL (Sin bloqueos)
// ==========================================
void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    if (!client.connected()) {
      long now = millis();
      // Intentar reconectar cada 5 segundos, sin congelar la placa
      if (now - lastReconnectAttempt > 5000) {
        lastReconnectAttempt = now;
        if (reconnect()) {
          lastReconnectAttempt = 0;
        }
      }
    } else {
      // Mantiene viva la conexión
      client.loop();
    }
  }
}