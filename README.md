# 🚨 Crisis Management System - Data Center

Sistema asimétrico de gestión de crisis en **Node.js** con **Socket.io** para comunicación en tiempo real. Un **Monitor** observa las métricas mientras un **Técnico** ejecuta acciones para controlar la crisis.

## 📋 Descripción del Proyecto

Este es un taller de **Electiva** que implementa un sistema de gestión de crisis basado en Data Center (infraestructura cloud). 

### Temática: Gestión de Data Center
- **Monitor**: Ve la temperatura de racks, consumo de ancho de banda e intentos de DDoS
- **Técnico**: Controla la potencia del aire acondicionado, reinicia servidores y activa firewalls

El servidor incrementa automáticamente las métricas cada segundo, y el técnico debe usar códigos de autorización para ejecutar acciones correctivas.

## ✨ Características

✅ **Salas Dinámicas**: Soporte para múltiples partidas simultáneas  
✅ **Validación de Códigos**: Códigos aleatorios para autorizar acciones  
✅ **Degradación Automática**: Las métricas empeoran cada segundo  
✅ **Socket.io en Tiempo Real**: Comunicación bidireccional  
✅ **Swagger API**: Documentación interactiva de rutas REST  
✅ **Frontend Responsive**: Interfaz moderna con CSS Grid  
✅ **Eventos Asimétricos**: Monitor y Técnico tienen roles distintos  

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Socket.io** - Comunicación en tiempo real
- **Swagger/OpenAPI** - Documentación de API
- **HTML5 + CSS3 + Vanilla JS** - Frontend

## 📦 Requisitos Previos

- **Node.js 14+** (descargar desde https://nodejs.org/)
- **npm** (incluido con Node.js)
- **Git** (opcional, para clonar el repositorio)

## 🚀 Instalación Rápida

### 1. Clonar o descargar el proyecto

```bash
git clone https://github.com/tu-usuario/crisis-management-system.git
cd crisis-management-system
```

O simplemente descarga los archivos y extrae la carpeta.

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará:
- express
- socket.io
- cors
- swagger-ui-express
- swagger-jsdoc

### 3. Iniciar el servidor

```bash
npm start
```

O para desarrollo con reinicio automático:

```bash
npm run dev
```

Deberías ver:

```
╔════════════════════════════════════════════╗
║   🚀 CRISIS MANAGEMENT SYSTEM INICIADO    ║
╠════════════════════════════════════════════╣
║   Servidor: http://localhost:3000        ║
║   API Docs: http://localhost:3000/api-docs║
║   Socket.io: Conectado                    ║
╚════════════════════════════════════════════╝
```

## 🎮 Cómo Jugar

### En tu navegador

1. Abre **dos pestañas** de navegador en `http://localhost:3000`
2. **Pestaña 1**: 
   - Ingresa un ID de sala (ej: `sala-1`)
   - Selecciona **Monitor**
   - Haz clic en **Conectar a Sala**

3. **Pestaña 2**: 
   - Ingresa el MISMO ID de sala
   - Selecciona **Técnico**
   - Haz clic en **Conectar a Sala**

4. **Monitor** observa cómo suben:
   - Temperatura (límite: 95°C)
   - Ancho de Banda (límite: 100%)
   - Intentos de DDoS

5. **Técnico** ejecuta acciones:
   - Lee el código mostrado (ej: 1234)
   - Ingresa el código en la caja de texto
   - Presiona un botón de acción
   - Si el código es correcto, ¡la acción se ejecuta!
   - Se genera un nuevo código automáticamente

6. **Objetivo**: Mantener todas las métricas por debajo de los límites antes de que suba el nivel de crisis a 5.

## 📡 API REST (Swagger)

Accede a `http://localhost:3000/api-docs` para ver la documentación interactiva.

### Endpoints disponibles:

```
GET /api/health
→ Verifica que el servidor está activo

GET /api/rooms
→ Obtiene todas las salas activas

GET /api/rooms/:roomId
→ Obtiene el estado de una sala específica
```

### Ejemplo de consulta:

```bash
curl http://localhost:3000/api/rooms/sala-1
```

Respuesta:
```json
{
  "roomId": "sala-1",
  "temperature": 52.34,
  "bandwidth": 78.92,
  "ddosAttempts": 145,
  "crisisLevel": 2,
  "status": "active",
  "playersConnected": 2
}
```

## 🔌 Eventos de Socket.io

### Client → Server

```javascript
// Unirse a una sala
socket.emit('join-room', { roomId: 'sala-1', role: 'monitor' });

// Ejecutar una acción (solo técnico)
socket.emit('execute-action', { 
  roomId: 'sala-1', 
  action: 'enfriar-racks',
  code: '1234'
});
```

### Server → Client

```javascript
// Estado inicial del juego
socket.on('game-state', (gameState) => {
  // { temperature, bandwidth, ddosAttempts, crisisLevel, ... }
});

// Actualización de métricas (cada segundo)
socket.on('metrics-update', (metrics) => {
  // Nuevas métricas
});

// Resultado de una acción
socket.on('action-result', (result) => {
  // { success, message, effect }
});

// Fin del juego
socket.on('game-over', (result) => {
  // { success, message, finalMetrics }
});
```

## 🔧 Acciones Disponibles del Técnico

| Acción | Efecto |
|--------|--------|
| **Enfriar Racks** | -15°C en temperatura |
| **Reiniciar Servidores** | -20% bandwidth, -30 DDoS |
| **Activar Firewall** | -50 intentos de DDoS |
| **Liberar Ancho de Banda** | -25% bandwidth |
| **MODO EMERGENCIA** | -20°C, -30% BW, -40 DDoS, crisis=1 |

## 📂 Estructura de Carpetas

```
crisis-management-system/
├── server.js              # Servidor principal
├── package.json           # Dependencias
├── README.md             # Este archivo
└── public/
    └── index.html        # Frontend (Monitor + Técnico)
```

## 🧪 Testing con Postman (Socket Tester)

1. Abre **Postman**
2. Ve a **New → WebSocket**
3. Conecta a: `ws://localhost:3000/socket.io/?transport=websocket`
4. Envía eventos JSON:

```json
{
  "event": "join-room",
  "data": {
    "roomId": "test-sala",
    "role": "monitor"
  }
}
```

## 🐛 Solución de Problemas

### Error: "Port 3000 is already in use"
```bash
# Cambia el puerto en server.js
const PORT = process.env.PORT || 3001;

# O mata el proceso en el puerto 3000
# En Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# En Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### Los sockets no se conectan
- Verifica que CORS está habilitado en server.js ✅
- Asegúrate de que ambas pestañas usan `http://localhost:3000` (no `127.0.0.1`)
- Comprueba la consola del navegador (F12) para errores

### Las métricas no actualizan
- Verifica que el servidor está ejecutándose
- Recarga la página (Ctrl+R)
- Abre la consola (F12) y verifica los logs de socket.io

## 📝 Notas para la Entrega

### Información a incluir en Moodle:

```
Integrantes: 
- Nombre Completo Estudiante 1
- Nombre Completo Estudiante 2

Temática Elegida: 
Gestión de Data Center (Infraestructura Cloud)

Enlace al Repositorio: 
https://github.com/tu-usuario/crisis-management-system

README: ✅ Incluido con instrucciones de instalación
```

### Checklist de Entrega:

- ✅ Servidor funcional (Node.js + Express + Socket.io)
- ✅ Múltiples salas soportadas
- ✅ Ciclo de degradación automático
- ✅ Validación de códigos
- ✅ Swagger API documentada
- ✅ Frontend con Monitor y Técnico
- ✅ README con instrucciones
- ✅ Código probado y funcionando

## 🎯 Mejoras Opcionales

Si quieres agregar más funcionalidad:

1. **Base de datos**: Guardar historial de partidas en MongoDB
2. **Autenticación**: Agregar login con JWT
3. **Estadísticas**: Dashboard con análisis de partidas
4. **Dificultades**: Modo fácil, normal, difícil
5. **Sonidos**: Agregar efectos de sonido
6. **Temas**: Selector de temáticas (satelital, química, etc.)
7. **Mobile**: Optimizar completamente para celular
8. **Leaderboard**: Ranking de mejores técnicos

## 📞 Contacto y Soporte

Para problemas o preguntas:
- Revisa los logs del servidor
- Abre la consola del navegador (F12)
- Verifica que las dependencias estén instaladas: `npm list`

## 📄 Licencia

MIT License - Libre para usar en proyectos educativos

---

**Creado para**: Electiva - Sistemas de Tiempo Real  
**Temática**: Gestión de Data Center  
**Año**: 2024-2025
