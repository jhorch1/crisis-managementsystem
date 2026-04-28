
# Crisis Management System - Data Center

Sistema de gestión de crisis en tiempo real con Node.js y Socket.io.

## Descripción

Un **Monitor** observa métricas de un Data Center (temperatura, ancho de banda, DDoS) mientras un **Técnico** ejecuta acciones para controlar la crisis usando códigos de autorización.

## Instalación

### 1. Descargar o clonar
```bash
git clone https://github.com/jhorch1/crisis-managementsystem.git
cd crisis-managementsystem
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar el servidor
```bash
npm start
```

El servidor estará en: http://localhost:3000

## Cómo usar

1. Abre http://localhost:3000 en **DOS navegadores**
2. **Navegador 1**: 
   - Sala: `sala-1`
   - Rol: Monitor
   - Conectar

3. **Navegador 2**: 
   - Sala: `sala-1`
   - Rol: Técnico
   - Conectar

4. **Monitor** ve las métricas subir
5. **Técnico** usa el código y presiona botones para ejecutar acciones

## Archivos principales

- `server.js` - Servidor principal
- `public/index.html` - Interfaz gráfica
- `package.json` - Dependencias

## Tecnologías

- Node.js
- Express
- Socket.io
- HTML5 + CSS3

## API

- GET http://localhost:3000/api/health
- GET http://localhost:3000/api/rooms
- GET http://localhost:3000/api-docs (Swagger)
