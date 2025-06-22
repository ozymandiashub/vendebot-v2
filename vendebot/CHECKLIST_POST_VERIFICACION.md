# 🚀 CHECKLIST POST-VERIFICACIÓN: Activar VendeBot Automático

## ✅ ESTADO ACTUAL (22 Junio 2025)
- 📱 Número: +56 9 7917 1217 registrado en Meta Business
- 📄 Documentos enviados para verificación
- ⏳ Estado: PENDIENTE
- 🤖 Bot: Listo para activar
- 🌐 Landing: Funcionando en Netlify
- 💳 MercadoPago: Configurado

## 🔄 PASOS CUANDO SE APRUEBE LA VERIFICACIÓN

### 1️⃣ **Verificar Estado de Aprobación**
```bash
# Ejecutar script de validación
cd c:\Users\CODING\Documents\NEWERA\VENDEBOT\vendebot
node scripts/validate-meta-whatsapp.js
```

**Resultado esperado**: ✅ Todos los checks en verde

### 2️⃣ **Obtener Nuevos IDs (Si es necesario)**
Si el script sigue fallando, obtener IDs actualizados:

**A) Business Account ID**
1. Ve a: https://business.facebook.com/wa/manage/
2. En la URL verás algo como: `/accounts/XXXXXXXXX/`
3. Ese número es tu Business Account ID

**B) Phone Number ID**  
1. Ve a: https://developers.facebook.com/apps/
2. Selecciona tu app → WhatsApp → API Setup
3. En el dropdown "From" verás el Phone Number ID

**C) Access Token**
1. En la misma página (API Setup)
2. Generar un "Permanent access token" (no temporal)
3. Asegurar permisos: `whatsapp_business_messaging`

### 3️⃣ **Actualizar Variables de Entorno**
```bash
# En .env.local (si los IDs cambiaron)
WHATSAPP_BUSINESS_ACCOUNT_ID="NUEVO_ID_SI_CAMBIÓ"
WHATSAPP_PHONE_NUMBER_ID="NUEVO_ID_SI_CAMBIÓ"
WHATSAPP_ACCESS_TOKEN="NUEVO_TOKEN_PERMANENTE"

# En Netlify
npx netlify env:set WHATSAPP_BUSINESS_ACCOUNT_ID "NUEVO_ID"
npx netlify env:set WHATSAPP_PHONE_NUMBER_ID "NUEVO_ID"
npx netlify env:set WHATSAPP_ACCESS_TOKEN "NUEVO_TOKEN"
```

### 4️⃣ **Configurar Webhook en Meta**
1. Ve a: https://developers.facebook.com/apps/
2. WhatsApp → Configuration → Webhook
3. **Callback URL**: `https://vendebot-prime-v2.netlify.app/api/chatbot/webhook-simple`
4. **Verify Token**: `vendebot_webhook_2025_secure_token`
5. **Webhook Fields**: ✅ `messages`
6. Clic en **"Verify and Save"**

### 5️⃣ **Probar el Bot Completo**
```bash
# Validar configuración
node scripts/validate-meta-whatsapp.js

# Probar webhook
curl -X POST "https://vendebot-prime-v2.netlify.app/api/chatbot/webhook-simple" \
  -H "Content-Type: application/json" \
  -d '{"entry":[{"changes":[{"value":{"messages":[{"from":"56979171217","text":{"body":"hola"}}]}}]}]}'
```

### 6️⃣ **Test Real con WhatsApp**
1. Envía mensaje desde otro teléfono a: `+56 9 7917 1217`
2. Mensaje sugerido: `"Hola"`
3. Deberías recibir respuesta automática del bot
4. Probar flujo completo: `"Quiero Canva Pro"`

## 🎯 **FLUJO DE PRUEBA COMPLETO**

### Test 1: Saludo
**Cliente**: `Hola`
**Bot esperado**: `¡Hola! 🎨 Soy el bot de CanvaProCL...`

### Test 2: Consulta producto
**Cliente**: `Quiero Canva Pro`
**Bot esperado**: `¡Excelente elección! 🚀 Canva Pro cuesta $8.990...`

### Test 3: Confirmación compra
**Cliente**: `Sí, lo quiero`
**Bot esperado**: `¡Perfecto! 💳 Te envío el link de pago...` + Link MercadoPago

## 🚨 **TROUBLESHOOTING COMÚN**

### Problema: "Webhook verification failed"
**Solución**: 
- Verificar que el verify token sea exacto: `vendebot_webhook_2025_secure_token`
- URL debe ser HTTPS y responder 200

### Problema: "Token invalid"
**Solución**:
- Generar nuevo token permanente (no temporal)
- Verificar permisos de la app

### Problema: "Phone number not found"
**Solución**:
- Esperar hasta que el estado sea "CONECTADO" (no "PENDIENTE")
- Verificar que el número esté asociado a la Business Account

## 📊 **MONITORING POST-ACTIVACIÓN**

### Logs a revisar:
```bash
# Logs de Netlify
npx netlify logs

# Test local del bot
npm run dev
node test-canva-bot.js
```

### Métricas a trackear:
- ✅ Mensajes recibidos por webhook
- ✅ Respuestas automáticas enviadas
- ✅ Links de pago generados
- ✅ Conversiones a venta

## 🎉 **RESULTADO FINAL ESPERADO**
- 🤖 Bot 100% automático respondiendo 24/7
- 💬 Clientes pueden comprar directamente por WhatsApp
- 💳 Links de pago reales de MercadoPago
- 📊 Todas las conversaciones trackeadas
- 🚀 Escalabilidad completa para el negocio

---
**Fecha de preparación**: 22 Junio 2025
**Estado**: ⏳ Esperando verificación Meta Business
**Próximo paso**: Ejecutar este checklist cuando llegue la aprobación
