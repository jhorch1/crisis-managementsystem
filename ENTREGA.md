# 📋 INSTRUCCIONES DE ENTREGA - MOODLE

## ¿Qué necesito entregar?

Tu entrega debe consistir en **UNA SOLA PUBLICACIÓN** en Moodle con la siguiente información:

---

## 📝 Plantilla para Copiar/Pegar en Moodle

```
ENTREGA TALLER ELECTIVA - SISTEMA DE GESTIÓN DE CRISIS

INTEGRANTES:
- Nombre Completo Estudiante 1 (Cédula: XXXX)
- Nombre Completo Estudiante 2 (Cédula: XXXX)

TEMÁTICA ELEGIDA:
Gestión de Data Center (Infraestructura Cloud)

DESCRIPCIÓN:
Sistema de Crisis Management en tiempo real donde:
- Monitor: Observa temperatura de racks, ancho de banda e intentos de DDoS
- Técnico: Ejecuta acciones (enfriar, reiniciar, firewall) validadas con códigos

ENLACE AL REPOSITORIO:
https://github.com/tu-usuario-github/crisis-management-system

INSTRUCCIONES DE INSTALACIÓN Y USO:

1. Clonar el repositorio:
   git clone https://github.com/tu-usuario-github/crisis-management-system.git

2. Entrar a la carpeta:
   cd crisis-management-system

3. Instalar dependencias:
   npm install

4. Iniciar el servidor:
   npm start

5. Abrir navegador en:
   http://localhost:3000

6. Abre dos pestañas y conecta una como Monitor y otra como Técnico

ARCHIVOS INCLUIDOS:
✅ server.js - Servidor Node.js con Socket.io
✅ package.json - Dependencias del proyecto
✅ public/index.html - Frontend (Monitor + Técnico)
✅ README.md - Documentación completa
✅ TESTING.md - Guía de testing
✅ .gitignore - Configuración de Git

TECNOLOGÍAS UTILIZADAS:
- Node.js
- Express.js
- Socket.io (comunicación en tiempo real)
- Swagger (documentación API)
- HTML5 + CSS3 + Vanilla JavaScript

CARACTERÍSTICAS IMPLEMENTADAS:
✅ Múltiples salas simultáneas (Rooms de Socket.io)
✅ Ciclo de degradación automático cada segundo
✅ Validación de códigos para ejecutar acciones
✅ Eventos asimétricos (Monitor vs Técnico)
✅ API REST documentada con Swagger
✅ Frontend responsivo y moderno
✅ Sistema de crisis level progresivo (1-5)
✅ Interfaz con métricas en tiempo real

CÓMO PROBAR:

1. Abre http://localhost:3000/api-docs para ver Swagger

2. En navegador 1:
   - Sala: sala-1
   - Rol: Monitor
   - Conectar
   
3. En navegador 2:
   - Sala: sala-1
   - Rol: Técnico
   - Conectar

4. Monitor observa cómo suben las métricas cada segundo

5. Técnico ejecuta acciones usando el código mostrado

6. Objetivo: Mantener crisis < 5 antes de perder

DOCUMENTACIÓN:
- README.md: Instalación, características, API
- TESTING.md: Guía completa de testing
- Código comentado: Explicaciones inline

```

---

## 📤 Pasos para Entregar en Moodle

### Paso 1: Crear repositorio en GitHub

1. Ve a https://github.com (crea cuenta si no tienes)
2. Click en **"New repository"**
3. Nombre: `crisis-management-system`
4. Descripción: `Sistema de Gestión de Crisis - Data Center`
5. Tipo: **Public**
6. Agregar `.gitignore` para Node.js
7. Crear repositorio

### Paso 2: Subir archivos a GitHub

```bash
git init
git add .
git commit -m "Proyecto crisis management system completado"
git branch -M main
git remote add origin https://github.com/tu-usuario/crisis-management-system.git
git push -u origin main
```

O usa GitHub Desktop si no sabes Git.

### Paso 3: Ir a Moodle

1. Entra a la plataforma Moodle de tu universidad
2. Ve al curso "Electiva"
3. Busca la tarea "Taller 2 - Sistema de Crisis"
4. Haz click en **"Añadir entrega"**

### Paso 4: Escribir y enviar

1. Copia la **Plantilla** de arriba
2. Reemplaza:
   - `Nombre Completo Estudiante 1` con TU NOMBRE
   - `Nombre Completo Estudiante 2` con el NOMBRE de tu compañer@
   - `https://github.com/tu-usuario-github/...` con TU ENLACE REAL
3. Haz click en **"Guardar cambios"**

### Paso 5: Adjuntar archivos (Opcional pero recomendado)

Si Moodle te permite, adjunta un ZIP con:
- README.md
- TESTING.md
- package.json
- server.js

⚠️ **NO subas la carpeta `node_modules/`** (está en .gitignore)

---

## ✅ Checklist Antes de Entregar

- [ ] ¿Los dos nombres están correctos?
- [ ] ¿El enlace de GitHub es accesible?
- [ ] ¿El repositorio tiene todos los archivos?
- [ ] ¿Probaste `npm install` y `npm start`?
- [ ] ¿El servidor inicia sin errores?
- [ ] ¿Monitor y Técnico se conectan?
- [ ] ¿Las métricas actualizan en tiempo real?
- [ ] ¿Las acciones del técnico funcionan?
- [ ] ¿Swagger está documentado en `/api-docs`?
- [ ] ¿El README tiene instrucciones claras?
- [ ] ¿Hay archivo TESTING.md con ejemplos?

---

## 🎯 Rúbrica de Evaluación (Típica)

| Aspecto | Puntos | Logrado |
|---------|--------|---------|
| Servidor funcionando | 15 | ☐ |
| Socket.io en tiempo real | 15 | ☐ |
| Múltiples salas | 10 | ☐ |
| Ciclo de degradación | 10 | ☐ |
| Validación de códigos | 10 | ☐ |
| Frontend Monitor + Técnico | 15 | ☐ |
| API REST + Swagger | 10 | ☐ |
| README + Documentación | 5 | ☐ |
| **TOTAL** | **90** | |

---

## 💡 Consejos Finales

1. **Entrega ANTES de la fecha límite** - No esperes al último minuto
2. **Verifica que tu GitHub está público** - El profesor debe poder acceder
3. **Incluye ambos nombres** - Ambos estudiantes aparecerán en la entrega
4. **Documenta bien** - Un buen README vale puntos
5. **Prueba todo antes de entregar** - Nada es peor que un servidor roto
6. **Sé responsable** - Si dividieron el trabajo, ambos deben entender el código

---

## ❓ Preguntas Frecuentes

**¿Qué si solo soy uno y no tengo compañero?**
- Habla con tu profesor. Algunos permiten entregas individuales con más requisitos.

**¿Qué si el profesor pide frontend también?**
- Está incluido en `public/index.html` con CSS responsivo.

**¿Qué si necesito cambiar la temática?**
- Cambia los nombres de acciones en `server.js` función `executeAction()`

**¿Qué si no funciona Socket.io?**
- Revisa que CORS esté configurado en `server.js`
- Verifica que el puerto 3000 no está ocupado

**¿Puedo agregar más funcionalidades?**
- ¡SÍ! Eso suma puntos. Base de datos, autenticación, más acciones, etc.

---

## 📞 Contacto

Si tienes dudas sobre la entrega:
1. Revisa el README.md incluido
2. Chequea los logs del servidor
3. Consulta con tu profesor vía email

---

**¡Éxito en tu entrega! 🚀**

Recuerda: Un buen sistema de crisis es aquél que controla la crisis, ¡no que la cause!

