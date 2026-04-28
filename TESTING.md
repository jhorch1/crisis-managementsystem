# 🧪 GUÍA DE TESTING - Crisis Management System

## Opción 1: Testing Manual en el Navegador

### Pasos:

1. **Inicia el servidor**:
   ```bash
   npm start
   ```

2. **Abre dos navegadores**:
   - Navegador 1: `http://localhost:3000` (Monitor)
   - Navegador 2: `http://localhost:3000` (Técnico)

3. **En Navegador 1 (Monitor)**:
   - Sala: `sala-1`
   - Rol: Monitor
   - Conectar

4. **En Navegador 2 (Técnico)**:
   - Sala: `sala-1`
   - Rol: Técnico
   - Conectar

5. **Observa cómo**:
   - El Monitor ve las métricas subir cada segundo
   - El Técnico ve un código (ej: 1234)
   - Técnico ingresa el código y elige una acción
   - Si es correcto, se ejecuta y baja la métrica
   - Se genera un nuevo código automáticamente

---

## Opción 2: Testing con Postman (REST API)

### 1. Verificar que el servidor está activo

**GET** `http://localhost:3000/api/health`

```
Respuesta:
{
  "status": "OK",
  "timestamp": "2024-04-27T10:30:00.000Z"
}
```

### 2. Ver todas las salas activas

**GET** `http://localhost:3000/api/rooms`

```
Respuesta:
{
  "rooms": [
    {
      "roomId": "sala-1",
      "temperature": 52.34,
      "bandwidth": 78.92,
      "ddosAttempts": 145,
      "crisisLevel": 2,
      "status": "active",
      "timestamp": "2024-04-27T10:25:00.000Z"
    }
  ]
}
```

### 3. Ver estado de una sala específica

**GET** `http://localhost:3000/api/rooms/sala-1`

```
Respuesta:
{
  "roomId": "sala-1",
  "temperature": "52.34",
  "bandwidth": "78.92",
  "ddosAttempts": 145,
  "crisisLevel": 2,
  "status": "active",
  "playersConnected": 2
}
```

---

## Opción 3: Testing con Postman WebSocket

### 1. Conectar al WebSocket

- **URL**: `ws://localhost:3000/socket.io/?transport=websocket`

### 2. Enviar evento de unión (Monitor)

```json
{
  "event": "join-room",
  "data": {
    "roomId": "sala-test",
    "role": "monitor"
  }
}
```

**Respuesta esperada**:
```json
{
  "event": "game-state",
  "data": {
    "roomId": "sala-test",
    "temperature": 45,
    "bandwidth": 60,
    "ddosAttempts": 50,
    "crisisLevel": 1,
    "status": "active",
    "correctCode": "4521"
  }
}
```

### 3. Enviar evento de unión (Técnico)

```json
{
  "event": "join-room",
  "data": {
    "roomId": "sala-test",
    "role": "tecnico"
  }
}
```

### 4. Esperar actualizaciones de métricas

Cada segundo recibirás:
```json
{
  "event": "metrics-update",
  "data": {
    "temperature": 47.32,
    "bandwidth": 62.15,
    "ddosAttempts": 55,
    "crisisLevel": 1,
    "correctCode": "4521"
  }
}
```

### 5. Ejecutar una acción (Técnico)

```json
{
  "event": "execute-action",
  "data": {
    "roomId": "sala-test",
    "action": "enfriar-racks",
    "code": "4521"
  }
}
```

**Respuesta correcta**:
```json
{
  "event": "action-result",
  "data": {
    "success": true,
    "message": "✅ Acción ejecutada: enfriar-racks",
    "effect": "Aire acondicionado activado, temperatura reducida"
  }
}
```

**Respuesta incorrecta** (código equivocado):
```json
{
  "event": "action-result",
  "data": {
    "success": false,
    "message": "❌ Código incorrecto. Intento fallido.",
    "correctCode": "7834",
    "attempts": 1
  }
}
```

---

## Opción 4: Testing con cURL (Terminal)

### Verificar salud del servidor

```bash
curl http://localhost:3000/api/health
```

### Ver salas activas

```bash
curl http://localhost:3000/api/rooms
```

### Ver una sala específica

```bash
curl http://localhost:3000/api/rooms/sala-1
```

---

## Opción 5: Testing Automatizado (Node.js)

Crea un archivo `test.js`:

```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

socket.on('connect', () => {
  console.log('✅ Conectado al servidor');
  
  // Unirse como monitor
  socket.emit('join-room', {
    roomId: 'test-room',
    role: 'monitor'
  });
});

socket.on('game-state', (gameState) => {
  console.log('📊 Estado inicial:', gameState);
});

socket.on('metrics-update', (metrics) => {
  console.log('📈 Métricas actualizadas:', metrics);
});

socket.on('error', (error) => {
  console.error('❌ Error:', error);
});

// Cerrar después de 10 segundos
setTimeout(() => {
  socket.disconnect();
  console.log('❌ Desconectado');
  process.exit(0);
}, 10000);
```

**Ejecutar**:
```bash
npm install socket.io-client
node test.js
```

---

## ✅ Checklist de Testing

- [ ] Servidor inicia sin errores
- [ ] Swagger accesible en `/api-docs`
- [ ] Monitor puede conectarse
- [ ] Técnico puede conectarse a la misma sala
- [ ] Monitor ve métricas en tiempo real
- [ ] Técnico ve nuevo código cada 1-2 segundos
- [ ] Técnico puede ejecutar acciones con código correcto
- [ ] Técnico NO puede ejecutar acciones con código incorrecto
- [ ] Las métricas bajan cuando el técnico ejecuta acciones
- [ ] Crisis sube progresivamente (1-5)
- [ ] Juego termina cuando crisis = 5 o temperatura > 95
- [ ] Se pueden crear múltiples salas simultáneamente
- [ ] La API REST funciona correctamente

---

## 🐛 Debugging

### Ver logs en consola del servidor

```bash
npm start
```

Busca líneas como:
```
✅ Sala creada: sala-1
MONITOR se unió a sala-1
TECNICO se unió a sala-1
```

### Ver logs en consola del navegador (F12)

```javascript
// En la consola abierta en el navegador
console.log('Logs de socket.io');
```

### Ver tráfico de red (F12 → Network)

Filtra por:
- `socket.io` - para ver handshakes
- `XHR/Fetch` - para ver llamadas REST

---

## 📊 Métricas de Prueba Esperadas

**Temperatura**:
- Inicio: 45°C
- Incremente: +1-2°C/segundo
- Acción "Enfriar": -15°C
- Límite crítico: 95°C

**Ancho de Banda**:
- Inicio: 60%
- Incremente: +1.5%/segundo
- Acción "Liberar": -25%
- Límite crítico: 100%

**DDoS**:
- Inicio: 50 intentos
- Incremente: +1-5 intentos/segundo
- Acción "Firewall": -50 intentos
- Máximo: sin límite (afecta crisis)

**Crisis Level**:
- Rango: 1-5
- Se calcula con: (temp/85) + (bandwidth/100) + (ddos/500)
- Juego termina en: 5

---

## 🎯 Escenarios de Test

### Escenario 1: Control Perfecto
1. Técnico responde rápido a cada código
2. Ejecuta acciones antes de que crisis suba
3. **Resultado**: Victoria (métricas controladas)

### Escenario 2: Control Tardío
1. Técnico se demora en ejecutar acciones
2. Las métricas suben más de lo necesario
3. **Resultado**: Derrota (crisis = 5)

### Escenario 3: Código Incorrecto
1. Técnico intenta ingresar código equivocado
2. Acción no se ejecuta
3. Nuevas métricas siguen escalando
4. **Resultado**: Derrota eventual

### Escenario 4: Modo Emergencia
1. Crisis está muy alta
2. Técnico usa "MODO EMERGENCIA"
3. Todas las métricas bajan drásticamente
4. **Resultado**: Posible victoria

---

## 📝 Reporte de Testing

Cuando termines de probar, reporta:

```
REPORTE DE TESTING - Crisis Management System
=============================================

Fecha: 2024-04-27
Hora: 10:30 AM
Testeador: [Tu nombre]

✅ TESTS PASADOS:
- Servidor inicia correctamente
- Monitor y Técnico se conectan
- Métricas actualizan en tiempo real
- Códigos funcionan correctamente
- Acciones se ejecutan correctamente
- Juego termina en crisis=5

❌ TESTS FALLIDOS:
[Ninguno]

⚠️ PROBLEMAS ENCONTRADOS:
[Ninguno]

📊 OBSERVACIONES:
- Sistema funciona estable
- Interfaz es responsiva
- Socket.io se reconecta automáticamente
- API REST funciona según spec

Conclusión: ✅ SISTEMA LISTO PARA ENTREGA
```

---

¡Listo para probar! 🚀
