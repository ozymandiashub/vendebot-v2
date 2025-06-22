# 🤖 VendeBot MVP - Bot Inteligente de Ventas para Canva Pro

## 🎯 **¿Qué es VendeBot?**
Bot automatizado de WhatsApp para vender cuentas Canva Pro con integración de MercadoPago y entrega automática. Perfecto para emprendedores que quieren automatizar completamente su negocio de venta digital.

## 🚀 **Estado Actual (22 Junio 2025)**
- ✅ **Landing Page**: https://vendebot-prime-v2.netlify.app
- ✅ **Bot Logic**: Completamente desarrollado
- ✅ **MercadoPago**: Integrado con links de pago reales
- ✅ **Netlify Deploy**: Webhook funcionando
- ⏳ **Meta WhatsApp**: Esperando verificación business
- 📱 **Número**: +56 9 7917 1217 (estado: PENDIENTE)

## 📋 **Archivos Importantes**
- `CHECKLIST_POST_VERIFICACION.md` - Pasos para activar el bot cuando se apruebe
- `GUIA_CONFIGURACION_META_COMPLETA_V2.md` - Guía completa de configuración Meta
- `CONFIGURACION_TEMPORAL.md` - Opciones mientras se resuelve la verificación
- `scripts/monitor-meta-verification.js` - Monitor automático de verificación

## ⚡ **Comandos Esenciales**

### Verificar estado de Meta WhatsApp
```bash
# Verificación única
node scripts/monitor-meta-verification.js

# Monitor continuo (cada 30 min)
node scripts/monitor-meta-verification.js --monitor
```

### Validar configuración completa
```bash
node scripts/validate-meta-whatsapp.js
```

### Probar el bot localmente
```bash
npm run dev
node test-canva-bot.js
```

### Deploy a producción
```bash
git add . && git commit -m "Update" && git push
npx netlify deploy --prod
```

## 🎯 **Flujo Completo del Bot**

### 1. Cliente llegada por landing page
- Hace clic en botón de WhatsApp
- Redirige a: `wa.me/56979171217?text=Hola`

### 2. Conversación automatizada
- **Cliente**: "Hola"
- **Bot**: Saludo + menú de productos
- **Cliente**: "Quiero Canva Pro"
- **Bot**: Precio + descripción + confirmación
- **Cliente**: "Sí, lo quiero"
- **Bot**: Link de pago MercadoPago + instrucciones

### 3. Post-pago
- Cliente paga por MercadoPago
- Bot detecta pago (webhook)
- Entrega automática de cuenta Canva
- Seguimiento y soporte

## 💰 **Productos y Precios**
- **Canva Pro (1 año)**: $8.990 CLP
- **Canva Teams (1 año)**: $12.990 CLP  
- **Canva Premium Lifetime**: $19.990 CLP

## 🔧 **Configuración**

### Variables de entorno requeridas:
```bash
# WhatsApp Business (Meta)
WHATSAPP_BUSINESS_ACCOUNT_ID="obtener_de_meta"
WHATSAPP_ACCESS_TOKEN="obtener_de_meta"
WHATSAPP_PHONE_NUMBER_ID="obtener_de_meta"
WHATSAPP_BUSINESS_PHONE="+56979171217"

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN="APP_USR-xxx"
MERCADOPAGO_PUBLIC_KEY="APP_USR-xxx"

# Webhook
WHATSAPP_WEBHOOK_VERIFY_TOKEN="vendebot_webhook_2025_secure_token"
```

## 🎉 **Cuando se Active (Post-Verificación)**

### Funcionalidades automáticas:
- 🤖 Respuestas automáticas 24/7
- 💬 Clasificación inteligente de mensajes
- 💳 Generación automática de links de pago
- 📦 Entrega automática de productos
- 📊 Tracking de conversiones
- 🔄 Seguimiento post-venta

### Capacidades del bot:
- Responder consultas sobre productos
- Generar cotizaciones personalizadas
- Procesar órdenes de compra
- Manejar pagos y confirmaciones
- Entregar productos digitales
- Brindar soporte técnico

## 📊 **Analytics y Métricas**
- Mensajes recibidos por día
- Conversiones de visitantes a compradores
- Productos más vendidos
- Ingresos por período
- Tiempo de respuesta promedio

## 🛠️ **Stack Tecnológico**
- **Frontend**: Next.js 14 + Tailwind CSS
- **Backend**: API Routes de Next.js
- **WhatsApp**: Meta Business API
- **Pagos**: MercadoPago API
- **Deploy**: Netlify
- **Database**: PostgreSQL (Supabase) - Preparado
- **Monitoring**: Scripts personalizados

## 🆘 **Soporte y Troubleshooting**

### Problema común: "Número no válido"
**Solución**: Esperar verificación Meta Business (en proceso)

### Problema: Bot no responde
**Verificar**:
1. Estado de verificación Meta
2. Webhook configurado correctamente
3. Variables de entorno en Netlify

### Contacto:
- 📱 WhatsApp: +56 9 7917 1217
- 📧 Email: soporte@vendebot.cl
- 🌐 Web: https://vendebot-prime-v2.netlify.app

---
**Desarrollado por**: VendeBot Team  
**Última actualización**: 22 Junio 2025  
**Estado**: ⏳ Esperando verificación Meta Business
Las contribuciones son bienvenidas. Si deseas colaborar, por favor abre un issue o un pull request en el repositorio.

## Contacto
Para más información, visita nuestro sitio web o contáctanos a través de nuestras redes sociales.

¡Únete a VendeBot y transforma tu negocio hoy mismo!