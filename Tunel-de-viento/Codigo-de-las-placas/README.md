# Guía de Configuración y Ejecución - Código de las Placas ESP32
 
## Requisitos Previos
 
### Hardware Necesario
- Placa ESP32
- 4 Ventiladores con conectores PWM y tacómetro
- Cable USB para programación
- Red WiFi disponible
### Software Necesario
- Arduino IDE versión 2.0 o superior
- Driver CH340 instalado
- Mosquitto MQTT Broker ejecutándose en el PC
### Librerías Requeridas
- PubSubClient (versión 2.8.0 o superior)
- ArduinoJson (versión 6.18.0 o superior)
## Instalación de Librerías
 
### Paso 1: Abrir el Administrador de Librerías
En Arduino IDE, dirigirse a Sketch > Incluir Librería > Administrar Librerías.
 
Una vez se abre la ventana, verá un campo de búsqueda en la parte superior izquierda.
 
### Paso 2: Instalar PubSubClient
En la ventana de Administrador de Librerías que se abre, buscar "PubSubClient" en el campo de búsqueda.
 
Pasos detallados:
1. Hacer clic en el campo de búsqueda
2. Escribir "PubSubClient"
3. Esperar a que aparezcan los resultados
4. Seleccionar la librería de autor Nick O'Leary (la primera opción que aparece)
5. Hacer clic en el botón "Instalar"
6. Esperar a que finalice la instalación (verá una barra de progreso)
### Paso 3: Instalar ArduinoJson
Buscar "ArduinoJson" en el campo de búsqueda del mismo administrador.
 
Pasos detallados:
1. Limpiar el campo de búsqueda anterior
2. Hacer clic en el campo de búsqueda
3. Escribir "ArduinoJson"
4. Esperar a que aparezcan los resultados
5. Seleccionar la librería de autor Benoit Blanchon (la primera opción que aparece)
6. Hacer clic en el botón "Instalar"
7. Esperar a que finalice la instalación
### Paso 4: Verificar Instalación
Una vez instaladas ambas librerías:
1. Cerrar el Administrador de Librerías haciendo clic en la X
2. Las librerías están ahora disponibles para usar en los sketches
3. Puede verificar que se instalaron correctamente si no ve mensajes de error en la consola
## Configuración de la Placa
 
### Paso 1: Conectar Placa USB
Conectar la placa ESP32 al PC mediante cable USB.
 
Instrucciones:
1. Tomar el cable USB (tipo USB A a microUSB)
2. Conectar el extremo USB A al puerto USB del PC
3. Conectar el extremo microUSB al puerto de la placa ESP32
4. Verificar que el LED de la placa se enciende (indicador de alimentación)
5. Esperar 2-3 segundos a que el sistema operativo reconozca el dispositivo
Si el LED no se enciende, probar con otro cable USB.
 
### Paso 2: Seleccionar Puerto COM
En Arduino IDE, dirigirse a Herramientas > Puerto.
 
Pasos detallados:
1. Hacer clic en la pestaña "Herramientas" en la barra de menú superior
2. Buscar la opción "Puerto" en el menú desplegable
3. Se abrirá una lista de puertos disponibles (COM3, COM4, COM5, etc.)
4. Seleccionar el puerto que corresponda a la placa ESP32
5. El puerto correcto generalmente será el que tiene mayor número
6. Si no aparece ningún puerto, verificar que:
   - El cable USB está conectado correctamente
   - El driver CH340 está instalado
   - Reiniciar Arduino IDE
Si aún no aparece el puerto, desconectar la placa y volver a conectarla. El puerto debería aparecer automáticamente.
 
### Paso 3: Seleccionar Placa
En Arduino IDE, dirigirse a Herramientas > Placa > Boards Manager.
 
Pasos detallados:
1. Hacer clic en la pestaña "Herramientas" en la barra de menú superior
2. Buscar la opción "Placa" en el menú desplegable
3. Se abrirá un submenú con opciones de placas
4. Seleccionar "Boards Manager"
5. Se abrirá una nueva ventana
6. En el campo de búsqueda, escribir "esp32"
7. Buscar "ESP32 by Espressif Systems"
8. Hacer clic en "Instalar"
9. Esperar a que finalice la instalación
10. Cerrar la ventana del Boards Manager
11. Volver a Herramientas > Placa
12. Seleccionar "ESP32" en el menú
13. Seleccionar "ESP32 Dev Module" del submenú
14. Confirmar que en el menú Herramientas > Placa aparece "ESP32 Dev Module" seleccionado
## Configuración del Código
 
Antes de cargar el programa en la placa, es necesario modificar los siguientes parámetros en el archivo `Formato-de-codigo.cpp`. Estos parámetros personalizan el código para cada módulo específico.
 
### Paso 1: Abrir el Archivo
En Arduino IDE, abrir el archivo mediante Archivo > Abrir.
 
Pasos detallados:
1. Hacer clic en la pestaña "Archivo" en la barra de menú
2. Seleccionar "Abrir"
3. Se abrirá un navegador de archivos
4. Navegar hasta la carpeta donde se encuentra "Formato-de-codigo.cpp"
5. Hacer clic en el archivo para seleccionarlo
6. Hacer clic en el botón "Abrir"
7. El archivo se abrirá en una nueva pestaña en Arduino IDE
### Paso 2: Identificador del Módulo
Localizar la línea que contiene:
```cpp
const char* MODULE_ID = "modulo_01";
```
 
Pasos detallados:
1. Una vez el archivo esté abierto, usar Ctrl + F para abrir el buscador
2. Escribir "MODULE_ID" en el campo de búsqueda
3. Presionar Enter o hacer clic en "Siguiente" para encontrar la línea
4. Se resaltará la línea que contiene MODULE_ID
5. La línea está aproximadamente en la línea 15 del código
6. Cambiar el valor entre comillas de "modulo_01" por el identificador único de cada placa
Ejemplos:
- Si es la primera placa: cambiar a "modulo_01"
- Si es la segunda placa: cambiar a "modulo_02"
- Si es la tercera placa: cambiar a "modulo_03"
- Continuar hasta "modulo_16" para la última placa
Instrucciones de cambio:
1. Hacer clic al final de "modulo_01"
2. Seleccionar el texto "01" (la parte numérica)
3. Escribir el número correspondiente (02, 03, 04, etc.)
4. Presionar Enter
### Paso 3: Credenciales de Red WiFi
Localizar las líneas que contienen:
```cpp
const char* ssid = "TU_SSID";
const char* password = "TU_PASSWORD";
```
 
Estas líneas están aproximadamente en las líneas 18-19 del código.
 
#### Cambiar SSID (nombre de la red WiFi):
Pasos detallados:
1. Usar Ctrl + F para abrir el buscador
2. Escribir "TU_SSID" en el campo de búsqueda
3. Presionar Enter para encontrar la línea
4. Se resaltará la línea que contiene ssid
5. Hacer doble clic en "TU_SSID" para seleccionarlo
6. Escribir el nombre exacto de la red WiFi a la que se conectará la placa
7. Asegurarse de mantener las comillas: "nombre_de_la_red"
Ejemplo:
```cpp
const char* ssid = "MiRedWiFi";
```
 
Nota: El nombre de la red (SSID) es sensible a mayúsculas y debe ser exacto.
 
#### Cambiar Contraseña (password):
Pasos detallados:
1. Usar Ctrl + F para abrir el buscador
2. Escribir "TU_PASSWORD" en el campo de búsqueda
3. Presionar Enter para encontrar la línea
4. Se resaltará la línea que contiene password
5. Hacer doble clic en "TU_PASSWORD" para seleccionarlo
6. Escribir la contraseña exacta de la red WiFi
7. Asegurarse de mantener las comillas: "contraseña"
Ejemplo:
```cpp
const char* password = "MiContraseña123";
```
 
Nota: La contraseña es sensible a mayúsculas.
 
### Paso 4: Dirección IP del Servidor MQTT
Localizar la línea que contiene:
```cpp
const char* mqtt_server = "192.168.1.100";
```
 
Esta línea está aproximadamente en la línea 22 del código.
 
#### Cómo obtener la dirección IP del PC:
 
**En Windows:**
1. Presionar Win + R simultáneamente
2. En la ventana que aparece, escribir cmd
3. Presionar Enter
4. Se abrirá la ventana del símbolo del sistema (Command Prompt)
5. En la ventana, escribir el siguiente comando: ipconfig
6. Presionar Enter
7. Aparecerá una lista de adaptadores de red
8. Buscar la sección que dice "Adaptador de LAN inalámbrica Wi-Fi" o similar
9. En esa sección, buscar la línea que dice "Dirección IPv4"
10. Copiar el valor que aparece (será algo como 192.168.1.10 o 192.168.0.50)
11. No copiar valores que comienzan con 169.254 o 127.0.0.1, ya que no son válidos
**En Mac o Linux:**
1. Abrir Terminal
2. Escribir: ifconfig
3. Presionar Enter
4. Buscar la sección de tu adaptador WiFi (generalmente comienza con "en0" o "wlan0")
5. Buscar la línea "inet" (no "inet6")
6. Copiar la dirección IP que aparece
#### Cambiar la dirección IP en el código:
Pasos detallados:
1. Una vez tengas la dirección IP del PC (por ejemplo, 192.168.1.50)
2. Usar Ctrl + F en Arduino IDE
3. Escribir "mqtt_server" en el campo de búsqueda
4. Presionar Enter para encontrar la línea
5. Se resaltará la línea que contiene mqtt_server
6. Hacer clic en la dirección IP actual (192.168.1.100)
7. Seleccionar toda la dirección IP
8. Escribir la nueva dirección IP obtenida
9. Asegurarse de mantener las comillas: "192.168.1.50"
Ejemplo:
```cpp
const char* mqtt_server = "192.168.1.50";
```
 
Nota importante: La dirección IP debe estar en la misma red que el PC. Ambos dispositivos (PC y ESP32) deben estar conectados a la misma red WiFi.
## Procedimiento de Carga del Código
 
### Paso 1: Verificación de Sintaxis
Antes de cargar el código en la placa, es importante verificar que no hay errores.
 
Pasos detallados:
1. Hacer clic en el botón "Verificar" en la barra de herramientas (es un botón con una marca de verificación)
2. También puede usar el atajo Ctrl + Alt + U
3. En la consola inferior, verá mensajes de compilación
4. Esperar a que finalice el proceso (tomará algunos segundos)
5. Si no hay errores, verá el mensaje "Compilación completada" o similar
6. Si hay errores, verá mensajes en rojo con la descripción del error
Si hay errores:
- Leer el mensaje de error cuidadosamente
- Verificar que todos los parámetros se modificaron correctamente
- Revisar que las comillas están presentes en todas las líneas
- Revisar que no hay caracteres especiales inesperados
- Si el error persiste, borrar los cambios y volver a modificar cuidadosamente
### Paso 2: Cargar el Código
Una vez verificado sin errores, cargar el código en la placa.
 
Pasos detallados:
1. Asegurarse de que la placa ESP32 está conectada por USB al PC
2. Asegurarse de que el puerto COM está seleccionado correctamente en Herramientas > Puerto
3. Asegurarse de que la placa ESP32 Dev Module está seleccionada en Herramientas > Placa
4. Hacer clic en el botón "Cargar" en la barra de herramientas (es un botón con una flecha hacia la derecha)
5. También puede usar el atajo Ctrl + U
6. En la consola inferior, verá mensajes de compilación y carga
### Paso 3: Esperar a que Finalice
Pasos detallados:
1. En la consola inferior, verá un porcentaje de progreso (0%, 25%, 50%, 75%, 100%)
2. Esperar a que el porcentaje llegue al 100%
3. La placa puede reiniciarse automáticamente durante el proceso
4. Esperar a que aparezca el mensaje "Salida completada" en la consola
5. Este mensaje indica que la carga fue exitosa
Si no aparece este mensaje:
- Esperar 5 segundos más
- Si sigue sin aparecer, revisar que no hay errores de compilación
- Verificar que el puerto COM es el correcto
## Verificación de Conexión
 
### Paso 1: Abrir Monitor Serial
Una vez cargado el código en la placa, abrir el Monitor Serial para ver los mensajes de depuración.
 
Pasos detallados:
1. Hacer clic en la pestaña "Herramientas" en la barra de menú
2. Seleccionar "Monitor Serial"
3. Se abrirá una ventana con el Monitor Serial
4. Esperar a que cargue completamente
### Paso 2: Configurar Velocidad en Bauds
El Monitor Serial debe estar configurado a la misma velocidad que el código.
 
Pasos detallados:
1. En la parte inferior derecha del Monitor Serial, verá un campo que dice "Velocidad en bauds"
2. Hacer clic en el desplegable de velocidad
3. Seleccionar "115200" (esta es la velocidad configurada en el código)
4. El Monitor Serial comenzará a mostrar mensajes
### Paso 3: Observar Mensajes Esperados
El programa imprimirá la siguiente secuencia de mensajes:
 
Primera línea (conexión WiFi iniciada):
```
Conectando a [NOMBRE_DE_TU_RED_WIFI]
```
 
Múltiples puntos (intentos de conexión):
```
.....
```
 
Confirmación de conexión WiFi exitosa:
```
WiFi conectado. IP: 192.168.X.X
```
 
Intento de conexión MQTT:
```
Intentando conexión MQTT...conectado
```
 
Si aparecen todos estos mensajes en el Monitor Serial, la placa está funcionando correctamente y está conectada tanto a WiFi como a MQTT.
 
## Mensajes de Estado
 
### Conexión WiFi Exitosa
El Monitor Serial mostrará:
```
Conectando a mi_red_wifi
.....
WiFi conectado. IP: 192.168.1.50
```
 
Explicación:
- Los puntos (.) indican intentos de conexión a la red WiFi
- Cada punto representa aproximadamente 500 milisegundos de espera
- La línea final muestra la dirección IP local asignada a la placa
- El tiempo total puede variar de 2 a 10 segundos dependiendo de la red
### Conexión MQTT Exitosa
El Monitor Serial mostrará:
```
Intentando conexión MQTT...conectado
```
 
Explicación:
- Este mensaje indica que la placa se conectó al broker MQTT
- La placa ahora está lista para recibir comandos de control
- La placa está lista para enviar datos de sensores y estado
### Publicación de Datos
Aunque el código básico no lo muestra, la placa está publicando datos automáticamente:
```
Publicando sensores cada 1 segundo
Publicando estado cada 1 segundo
```
 
Explicación:
- Cada segundo, la placa calcula las RPM de los ventiladores
- Cada segundo, la placa publica los datos de RPM en el tópico de sensores
- Cada segundo, la placa publica el estado de los ventiladores en el tópico de estado
## Mensajes de Error y Solución de Problemas
 
### Error: No Aparece Puerto COM
 
**Síntoma:** En Herramientas > Puerto, no aparece ningún puerto COM disponible.
 
**Causa:** El driver CH340 no está instalado, el cable USB no es de datos, o la placa no es reconocida por el sistema.
 
**Solución:**
1. Verificar que el cable USB está conectado correctamente
2. Probar con otro cable USB (algunos cables son solo para carga, no para datos)
3. Descargar e instalar el driver CH340:
   - Visitar: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
   - Descargar el driver para tu sistema operativo (Windows, Mac o Linux)
   - Instalar siguiendo las instrucciones del instalador
4. Reiniciar Arduino IDE
5. Reconectar la placa USB
6. Verificar nuevamente Herramientas > Puerto
Si aún no aparece:
- Verificar que la placa ESP32 se enciende (LED rojo indicador)
- Probar en otro puerto USB del PC
- Reiniciar el PC
### Error: Fallo de Compilación
 
**Síntoma:** Al hacer clic en Verificar, aparecen mensajes de error en la consola inferior.
 
**Mensaje de error típico:**
```
error: 'WiFi' was not declared in this scope
```
 
**Causa:** La placa ESP32 no está seleccionada correctamente o no están instaladas las herramientas de compilación necesarias.
 
**Solución:**
1. Verificar que en Herramientas > Placa está seleccionado "ESP32 Dev Module"
2. Si no aparece ESP32 en el menú:
   - Ir a Herramientas > Placa > Boards Manager
   - Buscar "esp32"
   - Instalar "ESP32 by Espressif Systems"
3. Esperar a que finalice la instalación
4. Reiniciar Arduino IDE
5. Intentar verificar nuevamente
### Error: WiFi No Conecta
 
**Síntoma:** El Monitor Serial muestra puntos continuamente sin conectar:
```
Conectando a mi_red_wifi
.................
```
 
El proceso continúa indefinidamente sin mostrar "WiFi conectado".
 
**Causa:** Las credenciales de WiFi son incorrectas o la red no está disponible.
 
**Solución:**
1. Verificar el SSID (nombre de red):
   - El nombre debe ser exacto, incluyendo mayúsculas y espacios
   - Revisar en las redes WiFi disponibles del PC
   - Copiar exactamente el nombre de la red
2. Verificar la contraseña:
   - La contraseña debe ser correcta
   - Verificar que no hay errores de escritura
   - Las contraseñas son sensibles a mayúsculas
3. Verificar que el PC está conectado a la misma red WiFi
4. Verificar que la red WiFi está activa y en rango
5. Si todo es correcto, reiniciar el router WiFi:
   - Desconectar el router durante 10 segundos
   - Volver a conectar
   - Esperar a que se inicie completamente
6. Volver a cargar el código en la placa
Si aún no conecta:
- Probar con una contraseña WiFi más simple (sin caracteres especiales)
- Verificar que la placa está en rango de la antena WiFi
### Error: MQTT No Conecta
 
**Síntoma:** El Monitor Serial muestra:
```
Intentando conexión MQTT...falló, rc=-2 reintentando en 5s
```
 
El proceso continúa reintentando cada 5 segundos.
 
**Causa:** La dirección IP del servidor MQTT es incorrecta o Mosquitto no está ejecutándose en el PC.
 
**Solución:**
1. Verificar que Mosquitto MQTT está ejecutándose en el PC
2. Verificar la dirección IP:
   - Abrir símbolo del sistema (Win + R, cmd)
   - Escribir ipconfig
   - Copiar la dirección IPv4 correcta
   - Verificar que es la dirección correcta en el código
3. Revisar que no hay errores tipográficos en la dirección IP
4. Verificar que el PC y la placa están en la misma red WiFi
5. Revisar que el firewall no está bloqueando el puerto 1883:
   - En Windows, abrir Windows Defender Firewall
   - Ir a Permitir una aplicación a través del firewall
   - Verificar que Mosquitto está permitido
6. Reiniciar Mosquitto MQTT en el PC
7. Volver a cargar el código en la placa
Si aún no conecta:
- Verificar que Mosquitto está escuchando en el puerto 1883
- Revisar los logs de Mosquitto para mensajes de error
### Error: rc=-3
 
**Síntoma:** El Monitor Serial muestra:
```
Intentando conexión MQTT...falló, rc=-3 reintentando en 5s
```
 
**Causa:** La conexión fue rechazada por el servidor MQTT (credenciales MQTT inválidas).
 
**Solución:**
1. Verificar que Mosquitto MQTT está ejecutándose sin requerir autenticación
2. Si Mosquitto requiere usuario y contraseña, estos no están configurados en el código
3. Para desactivar autenticación en Mosquitto:
   - Editar el archivo mosquitto.conf
   - Asegurarse de que la opción "allow_anonymous true" está habilitada
   - Reiniciar Mosquitto
4. Si la autenticación es requerida, modificar el código para incluir usuario y contraseña
5. Reiniciar la placa
### Error: rc=-4
 
**Síntoma:** El Monitor Serial muestra:
```
Intentando conexión MQTT...falló, rc=-4 reintentando en 5s
```
 
**Causa:** Conexión perdida o no disponible (MQTT estaba conectado pero se perdió la conexión).
 
**Solución:**
1. Verificar que Mosquitto MQTT sigue ejecutándose
2. Verificar que la conexión WiFi no se ha desconectado
3. Revisar en el Monitor Serial si hay mensajes de desconexión
4. Reiniciar Mosquitto MQTT en el PC
5. Reiniciar la placa ESP32 presionando el botón RESET
### Código de Estados MQTT Comunes
 
Tabla de referencia para entender los códigos de error:
 
| Código | Significado | Acción Recomendada |
|--------|-------------|-------------------|
| -2 | Imposible conectar (red no disponible) | Verificar conexión WiFi |
| -3 | Conexión rechazada | Revisar autenticación MQTT |
| -4 | Conexión perdida | Reiniciar broker MQTT |
| -1 | Socket no conectado | Verificar dirección IP y puerto |
| 0 | Conectado exitosamente | Estado normal, sin acción necesaria |
 
## Monitoreo Continuo
 
Una vez que la placa está conectada exitosamente, el Monitor Serial mostrará permanentemente mensajes de actividad.
 
**Es normal ver:**
- Puntos (.) durante la conexión WiFi inicial
- Mensajes de intento de reconexión si la conexión se pierde temporalmente
- La placa intenta reconectarse automáticamente cada 5 segundos si la conexión se cae
**Para verificar que la placa está funcionando correctamente:**
1. Dejar el Monitor Serial abierto durante 30 segundos
2. Verificar que los mensajes de conexión aparecieron al inicio
3. Verificar que no hay mensajes de error después de la conexión exitosa
4. Si hay mensajes de error, revisar la sección "Mensajes de Error" anterior
**Para detener el Monitor Serial:**
- Hacer clic en el botón "X" en la ventana del Monitor Serial
- O usar el atajo Ctrl + Shift + M
## Finalización
 
Una vez que aparezca en el Monitor Serial el mensaje:
```
Intentando conexión MQTT...conectado
```
 
La placa está completamente configurada y lista para funcionar. El programa continuará ejecutándose indefinidamente con el siguiente comportamiento:
 
1. Mantiene la conexión WiFi activa
2. Mantiene la conexión MQTT activa
3. Calcula las RPM de los ventiladores cada segundo
4. Publica los datos de sensores cada segundo
5. Publica el estado de los ventiladores cada segundo
6. Recibe comandos de control del servidor central
7. Intenta reconectar automáticamente si se pierde la conexión
La placa ahora está lista para comunicarse con la interfaz del túnel de viento y controlar los 4 ventiladores según los comandos recibidos del servidor MQTT.
 
Para detener el funcionamiento de la placa:
- Desconectar el cable USB
- O cargar un sketch diferente
Para verificar que todo está funcionando:
- Enviar un comando MQTT al tópico fanwall/modulo_01/control (reemplazar modulo_01 con el MODULE_ID correspondiente)
- Verificar que la placa recibe el comando y ajusta el estado de los ventiladores
- Verificar que la placa publica el nuevo estado en el tópico fanwall/modulo_01/estado
 