# Explicacion del codigo
 
En este documento se explica la lógica de conexión de las placas ESP32 con la interfaz del túnel de viento, cubriendo todas las secciones del código implementado.
 
## Referencias Útiles
 
Los siguientes videos pueden ser útiles para entender los conceptos:
- https://www.youtube.com/watch?v=tc3Qnf79Ny8
- https://www.youtube.com/watch?v=aAG0bp0Q-y4
## Librerías del Proyecto
 
Para que este proyecto funcione es necesario implementar en el código funciones que ya están creadas y se utilizan por medio de librerías. Esto permite no cargar innecesariamente la placa. Las librerías que se utilizan son las siguientes.
 
### WiFi.h
 
Es la herramienta WiFi. Contiene todas las funciones necesarias para que el ESP32 se conecte a una red inalámbrica. Permite que la placa se autentique con el router y establezca comunicación de datos a través de WiFi.
 
**Funciones principales:**
- `WiFi.begin(ssid, password)`: Inicia la conexión a la red WiFi
- `WiFi.status()`: Verifica el estado actual de la conexión
- `WiFi.localIP()`: Obtiene la dirección IP asignada a la placa
### PubSubClient.h
 
Es la herramienta MQTT. Proporciona las funciones para publicar (enviar) y suscribirse (recibir) mensajes usando el protocolo MQTT, que es el "idioma" que se utiliza para comunicarse con el servidor central del sistema.
 
**Funciones principales:**
- `client.connect()`: Establece conexión con el broker MQTT
- `client.publish()`: Publica un mensaje a un tópico
- `client.subscribe()`: Se suscribe a un tópico para recibir mensajes
- `client.loop()`: Mantiene la conexión activa y procesa mensajes entrantes
### ArduinoJson.h
 
Es una herramienta para manejar el formato JSON. Como se envían y reciben datos estructurados (por ejemplo, la velocidad de los 4 ventiladores), se utiliza JSON para empaquetar esa información de forma ordenada y facilitar su procesamiento.
 
**Funciones principales:**
- `StaticJsonDocument`: Crea un documento JSON con tamaño fijo en memoria
- `deserializeJson()`: Convierte un string JSON en un objeto manipulable
- `serializeJson()`: Convierte un objeto JSON a string para transmitir
## Configuración de Constantes y Variables Globales
 
Es necesario definir información fija sobre el funcionamiento del sistema como credenciales de red y parámetros de comunicación. Estas constantes se declaran al inicio del código.
 
### Configuración WiFi
 
```cpp
const char* ssid = "TU_SSID";           // Reemplazar con el nombre de tu red WiFi
const char* password = "TU_PASSWORD";   // Reemplazar con la contraseña de tu WiFi
```
 
**Explicación:**
- `ssid`: Es el nombre de la red WiFi a la cual se conectarán tanto el PC como el ESP32
- `password`: Es la contraseña de autenticación de esa red WiFi
### Configuración MQTT
 
```cpp
const char* mqtt_server = "192.168.1.100";   // Dirección IP del servidor MQTT
const int mqtt_port = 1883;                  // Puerto estándar MQTT
```
 
**Explicación:**
- `mqtt_server`: Es la dirección IP del ordenador que ejecuta el broker MQTT (donde corre FanWallInterface). Es la "oficina central de correos" a la que el ESP32 enviará y de la que recibirá mensajes. La dirección IP es donde el ESP32 debe enviar la información en la red local.
**Cómo obtener la dirección IP del PC:**
1. Abrir terminal de comandos (Win + R, escribir cmd)
2. Ejecutar: `ipconfig`
3. Buscar la sección \\\\\\\"Adaptador de LAN inalámbrica Wi-Fi\\\\\\\"
4. Buscar la variable \\\\\\\"Dirección IPv4\\\\\\\" (ej: 192.168.1.10)
5. Usar este valor en la configuración
- `mqtt_port`: Es el puerto por el que \\\\\\\"escucha\\\\\\\" MQTT. 1883 es el puerto estándar para MQTT sin cifrado.
### Identificador del Módulo
 
```cpp
const char* MODULE_ID = "modulo_01";  // Cada placa debe tener un ID único
```
 
**Explicación:**
Este es un identificador único para cada placa. Es fundamental cuando se tienen 16 módulos, porque permite que el servidor central sepa exactamente qué placa está enviando datos y a cuál debe enviarle comandos.
 
**Valores para cada módulo:**
- Placa 1: \\\\\\\"modulo_01\\\\\\\"
- Placa 2: \\\\\\\"modulo_02\\\\\\\"
- Placa 3: \\\\\\\"modulo_03\\\\\\\"
- Continuar hasta \\\\\\\"modulo_16\\\\\\\" para la placa 16
## Construcción Dinámica de Tópicos MQTT
 
La siguiente parte del código es la construcción dinámica de tópicos MQTT:
 
```cpp
String topic_sensores = "fanwall/" + String(MODULE_ID) + "/sensores";
String topic_estado   = "fanwall/" + String(MODULE_ID) + "/estado";
String topic_control  = "fanwall/" + String(MODULE_ID) + "/control";
```
 
**Explicación de cada tópico:**
 
- `topic_sensores`: Tópico en donde el ESP32 publica los datos de los sensores (RPM de ventiladores). Ejemplo: `fanwall/modulo_01/sensores`
- `topic_estado`: Tópico en donde el ESP32 publica el estado actual de los ventiladores (encendidos/apagados y velocidades). Ejemplo: `fanwall/modulo_01/estado`
- `topic_control`: Tópico al cual el ESP32 se suscribe para recibir los comandos de la interfaz web (órdenes de encendido/apagado y cambio de velocidad). Ejemplo: `fanwall/modulo_01/control`
**Ventaja clave:**
La gracia de este fragmento de código es que al solo cambiar el `MODULE_ID`, todos los otros tópicos se actualizan automáticamente. No es necesario modificar cada tópico individualmente.
 
## Pines de Control de los Ventiladores
 
Es de vital importancia nombrar correctamente los pines en los cuales se conectan los ventiladores. Los ventiladores utilizan dos tipos de señales:
 
### Tabla de Distribución de Pines del Ventilador
 
| Pin | Función | Dirección (desde ESP32) | Descripción |
|-----|---------|------------------------|-------------|
| 1 | GND | N/A | Tierra 0V |
| 2 | VCC | N/A | Alimentación +12V |
| 3 | Tacómetro | Entrada | El ventilador envía pulsos que indican sus revoluciones |
| 4 | PWM | Salida | El ESP32 envía una señal PWM para controlar la velocidad |
 
**Conclusión:**
La señal de control (`topic_control`) corresponde al pin PWM, mientras que la lectura de sensores (`topic_sensores`) corresponde al pin del tacómetro.
 
### Pines PWM (Control de Velocidad)
 
```cpp
const int fanPins[4] = {28, 26, 11, 16};
```
 
La función de esta lista de números es definir los pines GPIO del ESP32 que están conectados al cable de control de velocidad (PWM) de cada ventilador.
 
**Asignación de pines:**
- `fanPins[0] = 28` → Ventilador 1
- `fanPins[1] = 26` → Ventilador 2
- `fanPins[2] = 11` → Ventilador 3
- `fanPins[3] = 16` → Ventilador 4
### Pines TACH (Tacómetro)
 
```cpp
const int tachPins[4] = {29, 27, 12, 13};
```
 
La función de esta lista de números es definir los pines GPIO del ESP32 que están conectados al cable de señal del tacómetro de cada ventilador.
 
**Asignación de pines:**
- `tachPins[0] = 29` → Tacómetro Ventilador 1
- `tachPins[1] = 27` → Tacómetro Ventilador 2
- `tachPins[2] = 12` → Tacómetro Ventilador 3
- `tachPins[3] = 13` → Tacómetro Ventilador 4
## Objetos de Cliente de Red
 
El código de esta sección es el siguiente:
 
```cpp
WiFiClient espClient;
PubSubClient client(espClient);
```
 
**Explicación:**
 
- `WiFiClient espClient`: Clase que gestiona la conexión TCP/IP a través de WiFi. Es la capa base de comunicación que proporciona la infraestructura de red necesaria.
- `PubSubClient client(espClient)`: Clase que implementa el protocolo MQTT sobre la conexión proporcionada por WiFiClient. Es la que permite publicar, suscribirse y recibir mensajes de manera sencilla, abstrayendo la complejidad del protocolo MQTT.
## Variables de Estado de los Ventiladores
 
El código de esta sección es el siguiente:
 
```cpp
bool fanStates[4] = {false, false, false, false};
int fanSpeeds[4] = {0, 0, 0, 0};
```
 
**Explicación:**
 
- `fanStates`: Arreglo de tipo booleano (verdadero/falso) que indica si cada ventilador está encendido (true) o apagado (false). Se inicializa con todos apagados al arrancar el programa.
- `fanSpeeds`: Arreglo de números enteros que almacena la velocidad deseada para cada ventilador en un rango de 0 a 255 (típico de PWM de 8 bits). En esta versión básica se utiliza solo para guardar el valor recibido por MQTT y reportarlo; no se aplica directamente al hardware.
## Variables para la Medición de RPM
 
El código de esta sección es el siguiente:
 
```cpp
volatile unsigned int tachPulseCount[4] = {0, 0, 0, 0};
unsigned long lastRPMCalc = 0;
float fanRPM[4] = {0.0, 0.0, 0.0, 0.0};
```
 
**Explicación:**
 
- `tachPulseCount`: Contadores que acumulan el número de pulsos recibidos en cada pin de tacómetro. La palabra clave `volatile` es obligatoria porque estos contadores se modifican dentro de una interrupción. Esto le avisa al compilador que el valor puede cambiar en cualquier momento, evitando optimizaciones que podrían causar errores.
- `lastRPMCalc`: Almacena el instante de tiempo en milisegundos desde el arranque en que se realizó el último cálculo de RPM. Sirve para medir el intervalo transcurrido entre cálculos consecutivos.
- `fanRPM`: Arreglo que guarda las revoluciones por minuto calculadas para cada ventilador. Son números con decimales (por eso tipo `float`), ya que la velocidad no siempre es un número entero exacto.
## Configuración Inicial del Dispositivo
 
La función `setup()` tiene como objetivo dejar todo preparado para que el programa pueda funcionar correctamente en el bucle principal. En este apartado se configuran los pines, se inician las comunicaciones y se establecen las conexiones iniciales.
 
```cpp
void setup() {
  Serial.begin(115200);
  
  for (int i = 0; i < 4; i++) {
    pinMode(fanPins[i], OUTPUT);
    digitalWrite(fanPins[i], LOW);
  }
  
  for (int i = 0; i < 4; i++) {
    pinMode(tachPins[i], INPUT_PULLUP);
    attachInterruptArg(digitalPinToInterrupt(tachPins[i]), tachISR, 
                       &tachPulseCount[i], FALLING);
  }
  
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}
```
 
### Inicialización Serial
 
```cpp
Serial.begin(115200);
```
 
El parámetro 115200 es la velocidad de conexión en bits por segundo. Esta línea es fundamental para poder depurar el programa, permitiendo:
- Saber si se conectó correctamente a WiFi
- Verificar si el dispositivo inició correctamente
- Detectar errores de conexión con el servidor MQTT
- Observar los mensajes que se reciben y envían
### Configuración de Pines PWM
 
```cpp
for (int i = 0; i < 4; i++) {
  pinMode(fanPins[i], OUTPUT);
  digitalWrite(fanPins[i], LOW);
}
```
 
**Explicación:**
 
- `pinMode(fanPins[i], OUTPUT)`: Define cada pin como una salida digital. Esto significa que el ESP32 podrá enviar una señal eléctrica a través de estos pines con el fin de encender o apagar los ventiladores.
- `digitalWrite(fanPins[i], LOW)`: Coloca cada pin en estado bajo (0V). Esto asegura que los ventiladores inicien apagados al arrancar, evitando encendidos accidentales.
### Configuración de Pines TACH
 
```cpp
for (int i = 0; i < 4; i++) {
  pinMode(tachPins[i], INPUT_PULLUP);
  attachInterruptArg(digitalPinToInterrupt(tachPins[i]), tachISR, 
                     &tachPulseCount[i], FALLING);
}
```
 
**Explicación:**
 
- `pinMode(tachPins[i], INPUT_PULLUP)`: Configura los pines como entradas digitales con resistencia pull-up interna. Esta configuración permite escuchar correctamente cuando se ha completado una vuelta del ventilador.
- `attachInterruptArg(...)`: Adjunta una interrupción a cada pin del tacómetro. Esto garantiza que no se pierda ninguna señal que cuenta las vueltas, ya que se procesan de forma prioritaria mediante interrupciones.
### Conexión WiFi
 
```cpp
setup_wifi();
```
 
Se llama a la función auxiliar `setup_wifi()` que realiza la conexión a la red inalámbrica utilizando las credenciales configuradas.
 
### Configuración MQTT
 
```cpp
client.setServer(mqtt_server, mqtt_port);
client.setCallback(callback);
```
 
**Explicación:**
 
- `client.setServer(mqtt_server, mqtt_port)`: Indica al objeto que maneja la comunicación MQTT cuál es la dirección IP y el puerto del servidor MQTT a utilizar.
- `client.setCallback(callback)`: Define la función que se ejecutará automáticamente cada vez que llegue un mensaje MQTT desde el servidor a un tópico al cual el dispositivo está suscrito.
## Trabajo Continuo del Dispositivo
 
Después de la función `setup()`, que define el comportamiento inicial del sistema, viene la función `loop()`, que ejecuta el comportamiento continuo del sistema de forma repetida.
 
```cpp
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  static unsigned long lastPublish = 0;
  unsigned long now = millis();
  if (now - lastPublish > 1000) {
    calcularRPM();
    publicarSensores();
    publicarEstado();
    lastPublish = now;
  }
}
```
 
### Mantenimiento de Conexión MQTT
 
```cpp
if (!client.connected()) {
  reconnect();
}
client.loop();
```
 
**Explicación:**
 
- `if (!client.connected())`: Verifica si la conexión MQTT está activa
- `reconnect()`: Si la conexión se ha perdido (entrega FALSE), se ejecuta la función de reconexión
- `client.loop()`: Recibe los mensajes entrantes y mantiene activa la conexión con el broker MQTT
### Publicación Periódica de Datos
 
```cpp
static unsigned long lastPublish = 0;
unsigned long now = millis();
if (now - lastPublish > 1000) {
  calcularRPM();
  publicarSensores();
  publicarEstado();
  lastPublish = now;
}
```
 
**Explicación:**
 
Este bloque se encarga de enviar datos al servidor una vez por segundo, pero de una forma inteligente que no detiene el resto del programa. El funcionamiento es el siguiente:
 
1. `static unsigned long lastPublish = 0`: Variable estática que recuerda la última vez que se mandaron datos
2. `unsigned long now = millis()`: Obtiene el tiempo actual en milisegundos desde el arranque
3. `if (now - lastPublish > 1000)`: Verifica si han pasado más de 1000 milisegundos (1 segundo) desde la última publicación
4. Si se cumple la condición:
   - `calcularRPM()`: Calcula las revoluciones por minuto actuales
   - `publicarSensores()`: Publica el valor de los sensores (RPM) al servidor
   - `publicarEstado()`: Publica el estado actual de los ventiladores al servidor
   - `lastPublish = now`: Actualiza el timestamp de la última publicación
**Nota:** Este intervalo de 1000 ms puede modificarse para enviar datos con mayor o menor frecuencia, pero es necesario verificar que la red es estable si se reduce significativamente.
 
## Funciones Auxiliares
 
### Función setup_wifi()
 
```cpp
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi conectado. IP: " + WiFi.localIP().toString());
}
```
 
**Explicación:**
 
Esta función se encarga de conectar el ESP32 a la red WiFi por medio de las credenciales `ssid` y `password`. El funcionamiento es el siguiente:
 
1. `delay(10)`: Pequeña pausa inicial para estabilización
2. `Serial.println()` y `Serial.print()`: Imprime mensajes en el Monitor Serial indicando el proceso
3. `WiFi.begin(ssid, password)`: Inicia la conexión a la red WiFi
4. `while (WiFi.status() != WL_CONNECTED)`: Bucle que continúa hasta que se establezca la conexión
5. `delay(500)` y `Serial.print(".")`: Dentro del bucle, espera 500 ms e imprime un punto como indicador visual
6. Una vez conectado, imprime un mensaje con la dirección IP asignada
Si no se logra conectar, esta función continúa intentándose cada 500 ms hasta conseguir la conexión.
 
### Función reconnect()
 
```cpp
void reconnect() {
  while (!client.connected()) {
    Serial.print("Intentando conexión MQTT...");
    String clientId = "ESP32_" + String(MODULE_ID) + "_" + 
                      String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
      Serial.println("conectado");
      client.subscribe(("fanwall/" + String(MODULE_ID) + "/control").c_str());
    } else {
      Serial.print("falló, rc=");
      Serial.print(client.state());
      Serial.println(" reintentando en 5s");
      delay(5000);
    }
  }
}
```
 
**Explicación:**
 
Si la conexión al servidor MQTT se pierde por cualquier motivo, esta función intenta recuperarla automáticamente. El funcionamiento es:
 
1. `while (!client.connected())`: Bucle que continúa mientras no haya conexión MQTT
2. Imprime \\\\\\\"Intentando conexión MQTT...\\\\\\\" en el Monitor Serial
3. `String clientId = ...`: Crea un identificador único para el cliente combinando el MODULE_ID y un número aleatorio
4. `if (client.connect(...))`: Intenta conectarse al broker MQTT
   - Si es exitoso: imprime \\\\\\\"conectado\\\\\\\" y se suscribe al tópico de control
   - Si falla: imprime el código de error (`client.state()`), espera 5 segundos y reintenta
### Función callback()
 
```cpp
void callback(char* topic, byte* payload, unsigned int length) {
  String mensaje;
  for (int i = 0; i < length; i++) {
    mensaje += (char)payload[i];
  }
  
  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, mensaje);
  if (error) {
    Serial.println("Error al parsear JSON");
    return;
  }
  
  if (doc.containsKey("ventiladores")) {
    JsonArray fans = doc["ventiladores"];
    for (int i = 0; i < fans.size() && i < 4; i++) {
      JsonObject fan = fans[i];
      if (fan.containsKey("estado")) {
        fanStates[i] = fan["estado"];
        digitalWrite(fanPins[i], fanStates[i] ? HIGH : LOW);
      }
      if (fan.containsKey("velocidad")) {
        fanSpeeds[i] = fan["velocidad"];
      }
    }
  }
  
  publicarEstado();
}
```
 
**Explicación:**
 
Esta función se ejecuta automáticamente cada vez que llega un mensaje a un tópico al cual el ESP32 está suscrito (en este caso, `topic_control`). El funcionamiento es:
 
1. **Conversión de payload**: Los bytes recibidos se convierten a un string llamado `mensaje`
2. **Parseo JSON**: Se crea un documento JSON y se deserializa el mensaje
   - Si hay error al parsear, se imprime un mensaje de error y se abandona la función
   - Si es exitoso, se continúa con el procesamiento
3. **Procesamiento de comandos**: Si el JSON contiene una clave \\\\\\\"ventiladores\\\\\\\":
   - Se itera sobre cada ventilador en el array
   - Para cada ventilador, se verifica:
     - Si contiene \\\\\\\"estado\\\\\\\": se actualiza `fanStates[i]` y se aplica al pin PWM (HIGH = encendido, LOW = apagado)
     - Si contiene \\\\\\\"velocidad\\\\\\\": se actualiza `fanSpeeds[i]`
4. **Confirmación**: Se llama a `publicarEstado()` para confirmar al servidor que se recibió el comando y enviar el nuevo estado
## Estructura de Datos MQTT
 
### Mensaje de Control Recibido
 
El servidor envía comandos con la siguiente estructura JSON al tópico de control:
 
```json
{
  "ventiladores": [
    {"estado": true, "velocidad": 200},
    {"estado": false, "velocidad": 0},
    {"estado": true, "velocidad": 150},
    {"estado": true, "velocidad": 220}
  ]
}
```
 
### Mensaje de Sensores Publicado
 
El ESP32 publica periódicamente los RPM de los ventiladores:
 
```json
{
  "module_id": "modulo_01",
  "rpm_ventiladores": [1500.5, 0, 1480.2, 1510.8]
}
```
 
### Mensaje de Estado Publicado
 
El ESP32 publica periódicamente el estado de los ventiladores:
 
```json
{
  "module_id": "modulo_01",
  "ventiladores": [
    {"id": 0, "estado": true, "velocidad": 200},
    {"id": 1, "estado": false, "velocidad": 0},
    {"id": 2, "estado": true, "velocidad": 150},
    {"id": 3, "estado": true, "velocidad": 220}
  ]
}
```
 
## Flujo General de Ejecución
 
El programa sigue el siguiente flujo de ejecución:
 
1. **setup()**: Se ejecuta una única vez al inicializar
   - Inicializa la comunicación serial
   - Configura los pines de control (PWM) y tacómetro
   - Conecta a WiFi
   - Configura MQTT y establece la función callback
2. **loop()**: Se ejecuta continuamente
   - Verifica y mantiene la conexión MQTT (reconecta si es necesario)
   - Procesa mensajes MQTT entrantes
   - Cada 1 segundo:
     - Calcula RPM de los ventiladores
     - Publica los datos de sensores
     - Publica el estado de los ventiladores
3. **callback()**: Se ejecuta cuando se recibe un mensaje MQTT
   - Procesa el comando de control recibido
   - Actualiza el estado de los ventiladores
   - Publica la confirmación del nuevo estado
4. **Reconexión automática**: El sistema intenta reconectar automáticamente si se pierde la conexión a WiFi o MQTT
Este diseño garantiza que el sistema sea resiliente y mantenga la comunicación incluso ante interrupciones temporales de la red.