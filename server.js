const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ============================================
// CONFIGURACIÓN SWAGGER
// ============================================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Crisis Management System API',
      version: '1.0.0',
      description: 'Sistema de Gestión de Crisis en Tiempo Real - Data Center'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local'
      }
    ],
    components: {
      schemas: {
        GameState: {
          type: 'object',
          properties: {
            roomId: { type: 'string' },
            temperature: { type: 'number', example: 45 },
            bandwidth: { type: 'number', example: 75 },
            ddosAttempts: { type: 'number', example: 120 },
            crisisLevel: { type: 'number', example: 3 },
            status: { type: 'string', example: 'active' }
          }
        }
      }
    }
  },
  apis: ['./server.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============================================
// ALMACENAMIENTO DE PARTIDAS
// ============================================
const games = {}; // { roomId: { gameState, players, intervals } }

function initializeGame(roomId) {
  return {
    roomId: roomId,
    temperature: 45,           // Monitor: Temperatura de racks (°C)
    bandwidth: 60,            // Monitor: Consumo de ancho de banda (%)
    ddosAttempts: 50,         // Monitor: Intentos de intrusión DDoS
    crisisLevel: 1,           // Nivel de crisis (1-5)
    status: 'active',
    correctCode: generateCode(),
    timestamp: new Date()
  };
}

function generateCode() {
  // Código aleatorio de 4 dígitos que el técnico debe ingresar
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// ============================================
// SOCKET.IO EVENTOS
// ============================================

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  /**
   * @desc Evento: Unirse a una sala (Monitor o Técnico)
   * @param {Object} data - { roomId, role }
   */
  socket.on('join-room', (data) => {
    const { roomId, role } = data;
    
    // Validar rol
    if (!['monitor', 'tecnico'].includes(role)) {
      socket.emit('error', { message: 'Rol inválido. Use "monitor" o "tecnico"' });
      return;
    }

    // Crear sala si no existe
    if (!games[roomId]) {
      games[roomId] = {
        ...initializeGame(roomId),
        players: {},
        intervals: []
      };
      console.log(`✅ Sala creada: ${roomId}`);
    }

    // Asignar jugador a la sala
    games[roomId].players[socket.id] = { role, socketId: socket.id };
    socket.join(roomId);
    socket.roomId = roomId;
    socket.role = role;

    console.log(`${role.toUpperCase()} se unió a ${roomId}`);

    // Enviar estado actual del juego
    socket.emit('game-state', {
      ...games[roomId],
      players: undefined,
      intervals: undefined
    });

    // Notificar a otros jugadores
    io.to(roomId).emit('player-joined', {
      players: Object.values(games[roomId].players),
      message: `${role} se ha conectado`
    });

    // Iniciar degradación si es la primera vez
    if (Object.keys(games[roomId].players).length === 1) {
      startCrisisDegradation(roomId);
    }
  });

  /**
   * @desc Evento: El técnico ejecuta una acción
   * @param {Object} data - { action, code }
   */
  socket.on('execute-action', (data) => {
    const { roomId } = socket;
    const { action, code } = data;

    if (!roomId || !games[roomId]) {
      socket.emit('error', { message: 'Sala no encontrada' });
      return;
    }

    const game = games[roomId];

    // Validar que sea técnico
    if (socket.role !== 'tecnico') {
      socket.emit('error', { message: 'Solo el técnico puede ejecutar acciones' });
      return;
    }

    // Validar código
    if (code !== game.correctCode) {
      socket.emit('action-result', {
        success: false,
        message: `❌ Código incorrecto. Intento fallido.`,
        correctCode: game.correctCode,
        attempts: (socket.attempts || 0) + 1
      });
      socket.attempts = (socket.attempts || 0) + 1;
      return;
    }

    // Ejecutar acción según el tipo
    let result = executeAction(action, game);

    socket.emit('action-result', {
      success: true,
      message: `✅ Acción ejecutada: ${action}`,
      ...result
    });

    // Generar nuevo código para la próxima acción
    game.correctCode = generateCode();
    
    // Notificar a todos sobre el nuevo estado
    io.to(roomId).emit('game-state', {
      ...game,
      players: undefined,
      intervals: undefined,
      correctCode: game.correctCode
    });
  });

  /**
   * @desc Evento: Desconectar
   */
  socket.on('disconnect', () => {
    const { roomId } = socket;
    
    if (roomId && games[roomId]) {
      delete games[roomId].players[socket.id];
      console.log(`Cliente desconectado de ${roomId}`);

      // Si no hay más jugadores, limpiar la sala
      if (Object.keys(games[roomId].players).length === 0) {
        games[roomId].intervals.forEach(interval => clearInterval(interval));
        delete games[roomId];
        console.log(`Sala ${roomId} eliminada`);
      } else {
        io.to(roomId).emit('player-left', {
          message: 'Un jugador se ha desconectado'
        });
      }
    }
  });
});

// ============================================
// LÓGICA DE DEGRADACIÓN DE CRISIS
// ============================================

function startCrisisDegradation(roomId) {
  const game = games[roomId];
  
  const interval = setInterval(() => {
    if (!games[roomId]) {
      clearInterval(interval);
      return;
    }

    // Incrementar métricas cada segundo
    game.temperature += Math.random() * 2;
    game.bandwidth += Math.random() * 1.5;
    game.ddosAttempts += Math.floor(Math.random() * 5) + 1;

    // Calcular nivel de crisis (1-5)
    game.crisisLevel = Math.min(5, Math.ceil((game.temperature / 85) + (game.bandwidth / 100) + (game.ddosAttempts / 500)));

    // Verificar si perdió
    if (game.temperature > 95 || game.bandwidth > 100 || game.crisisLevel >= 5) {
      game.status = 'failed';
      io.to(roomId).emit('game-over', {
        success: false,
        message: '❌ CRISIS NO CONTROLADA - FALLO DEL SISTEMA',
        finalMetrics: {
          temperature: game.temperature.toFixed(2),
          bandwidth: game.bandwidth.toFixed(2),
          ddosAttempts: game.ddosAttempts
        }
      });
      clearInterval(interval);
      game.intervals = game.intervals.filter(i => i !== interval);
      return;
    }

    // Enviar actualización a todos en la sala
    io.to(roomId).emit('metrics-update', {
      temperature: game.temperature.toFixed(2),
      bandwidth: game.bandwidth.toFixed(2),
      ddosAttempts: game.ddosAttempts,
      crisisLevel: game.crisisLevel,
      correctCode: game.correctCode
    });

  }, 1000); // Cada 1 segundo

  game.intervals.push(interval);
}

// ============================================
// EJECUTAR ACCIONES DEL TÉCNICO
// ============================================

function executeAction(action, game) {
  switch(action) {
    case 'enfriar-racks':
      game.temperature = Math.max(20, game.temperature - 15);
      return { effect: 'Aire acondicionado activado, temperatura reducida' };
    
    case 'reiniciar-servidores':
      game.bandwidth = Math.max(0, game.bandwidth - 20);
      game.ddosAttempts = Math.max(0, game.ddosAttempts - 30);
      return { effect: 'Servidores reiniciados, tráfico normalizado' };
    
    case 'activar-firewall':
      game.ddosAttempts = Math.max(0, game.ddosAttempts - 50);
      return { effect: 'Firewall de emergencia activado, DDoS bloqueado' };
    
    case 'liberar-ancho-banda':
      game.bandwidth = Math.max(0, game.bandwidth - 25);
      return { effect: 'Ancho de banda optimizado' };
    
    case 'activar-modo-emergencia':
      game.temperature = Math.max(20, game.temperature - 20);
      game.bandwidth = Math.max(0, game.bandwidth - 30);
      game.ddosAttempts = Math.max(0, game.ddosAttempts - 40);
      game.crisisLevel = 1;
      return { effect: 'MODO EMERGENCIA: Todas las métricas reducidas' };
    
    default:
      return { effect: 'Acción desconocida' };
  }
}

// ============================================
// RUTAS REST
// ============================================

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Obtener todas las salas activas
 *     responses:
 *       200:
 *         description: Lista de salas con su estado
 */
app.get('/api/rooms', (req, res) => {
  const rooms = Object.keys(games).map(roomId => ({
    roomId,
    ...games[roomId],
    players: undefined,
    intervals: undefined
  }));
  res.json({ rooms });
});

/**
 * @swagger
 * /api/rooms/{roomId}:
 *   get:
 *     summary: Obtener estado de una sala específica
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado actual de la sala
 *       404:
 *         description: Sala no encontrada
 */
app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  
  if (!games[roomId]) {
    return res.status(404).json({ error: 'Sala no encontrada' });
  }

  const game = games[roomId];
  res.json({
    roomId,
    temperature: game.temperature.toFixed(2),
    bandwidth: game.bandwidth.toFixed(2),
    ddosAttempts: game.ddosAttempts,
    crisisLevel: game.crisisLevel,
    status: game.status,
    playersConnected: Object.keys(game.players).length
  });
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verificar que el servidor está funcionando
 *     responses:
 *       200:
 *         description: Servidor activo
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// ============================================
// INICIO DEL SERVIDOR
// ============================================

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════╗
  ║   🚀 CRISIS MANAGEMENT SYSTEM INICIADO    ║
  ╠════════════════════════════════════════════╣
  ║   Servidor: http://localhost:${PORT}        ║
  ║   API Docs: http://localhost:${PORT}/api-docs ║
  ║   Socket.io: Conectado                     ║
  ╚════════════════════════════════════════════╝
  `);
});

module.exports = server;
