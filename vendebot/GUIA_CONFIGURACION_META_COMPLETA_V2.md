# 🚀 GUÍA COMPLETA: Configuración Meta WhatsApp Business API para VendeBot

## ⚠️ PROBLEMA DETECTADO
Los valores actuales en `.env.local` no son válidos:
- Business Account ID: `309325415606213` ❌ (No existe o sin permisos)
- Phone Number ID: `680539538479058` ❌ (No existe o sin permisos)
- Access Token: Probablemente expirado ❌

## 🎯 SOLUCIÓN: Reconfigurar desde cero

### 1️⃣ **Acceder a Meta Business**
1. Ve a: https://business.facebook.com/
2. Asegúrate de estar en la cuenta correcta de **Roff Studio**
3. Ve a **Configuración** → **Cuentas empresariales**

### 2️⃣ **Configurar WhatsApp Business**
1. Ve a: https://business.facebook.com/wa/manage/
2. Si no tienes una cuenta WhatsApp Business configurada:
   - Haz clic en **"Comenzar"**
   - Selecciona **"Usar el número de teléfono de una cuenta de WhatsApp Business existente"**
   - Ingresa: `+56979171217`
   - Sigue el proceso de verificación

### 3️⃣ **Obtener IDs correctos**
1. Ve a: https://developers.facebook.com/apps/
2. Busca tu aplicación o crea una nueva:
   - Tipo: **Business**
   - Casos de uso: **Customer engagement**
3. En el panel de la app, ve a **WhatsApp** → **API Setup**

### 4️⃣ **Valores que necesitas obtener**

#### A) **Business Account ID**
```
Ubicación: WhatsApp → API Setup → "WhatsApp Business Account ID"
Formato: Número de 15 dígitos (ej: 123456789012345)
```

#### B) **Phone Number ID**
```
Ubicación: WhatsApp → API Setup → "From" dropdown
Formato: Número de 15 dígitos (ej: 123456789012345)
```

#### C) **Access Token**
```
Ubicación: WhatsApp → API Setup → "Access Token"
- Para TESTING: Usar "Temporary access token" (válido 24hrs)
- Para PRODUCCIÓN: Crear "Permanent access token"
```

#### D) **Webhook Verification Token**
```
Ubicación: WhatsApp → Configuration → Webhook
URL del webhook: https://vendebot-prime-v2.netlify.app/api/chatbot/webhook-simple
Verification Token: vendebot_webhook_2025_secure_token
```

### 5️⃣ **Verificar el número de teléfono**

#### Opción A: Verificación por SMS/Llamada
1. En WhatsApp → API Setup
2. Haz clic en **"Manage"** junto al número
3. Selecciona **"Verify phone number"**
4. Elige método: SMS o llamada telefónica
5. Ingresa el código de verificación

#### Opción B: Verificación por Meta Business
1. Asegúrate de que el número esté asociado a tu cuenta de WhatsApp Business
2. En WhatsApp Business app, ve a Configuración → Business
3. Verifica que el número aparezca como "Verified"

### 6️⃣ **Configurar webhook en Meta**
1. Ve a WhatsApp → Configuration → Webhook
2. **Callback URL**: `https://vendebot-prime-v2.netlify.app/api/chatbot/webhook-simple`
3. **Verify Token**: `vendebot_webhook_2025_secure_token`
4. **Webhook Fields**: Selecciona `messages`
5. Haz clic en **"Verify and Save"**

### 7️⃣ **Actualizar variables de entorno**
Una vez obtengas los valores correctos, actualiza `.env.local`:

```bash
# WhatsApp Business API (Meta Official) - VALORES CORRECTOS
WHATSAPP_BUSINESS_ACCOUNT_ID="TU_NUEVO_BUSINESS_ACCOUNT_ID"
WHATSAPP_ACCESS_TOKEN="TU_NUEVO_ACCESS_TOKEN"
WHATSAPP_PHONE_NUMBER_ID="TU_NUEVO_PHONE_NUMBER_ID"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="vendebot_webhook_2025_secure_token"
WHATSAPP_BUSINESS_PHONE="+56979171217"
```

### 8️⃣ **Validar configuración**
Ejecuta el script de validación:
```bash
node scripts/validate-meta-whatsapp.js
```

### 9️⃣ **Probar el bot**
1. Envía un mensaje desde WhatsApp a `+56979171217`
2. El mensaje debe llegar al webhook en Netlify
3. El bot debe responder automáticamente

## 🔗 **Links importantes**
- Meta Business: https://business.facebook.com/
- WhatsApp Business API: https://business.facebook.com/wa/manage/
- Meta Developers: https://developers.facebook.com/apps/
- Documentación oficial: https://developers.facebook.com/docs/whatsapp/cloud-api/

## 🆘 **Problemas comunes**

### "Número no válido"
- Verificar formato: +56979171217 (con código de país)
- El número debe estar verificado en WhatsApp Business
- El número no puede estar usado en WhatsApp personal

### "Token inválido"
- Los tokens temporales expiran en 24 horas
- Crear un token permanente para producción
- Verificar permisos: `whatsapp_business_messaging`

### "Webhook failed"
- URL debe ser HTTPS
- URL debe responder con status 200
- Verificar que el verify token coincida

## ✅ **Estado objetivo**
Al final deberías tener:
- ✅ Número verificado en Meta Business
- ✅ Webhook configurado y funcionando
- ✅ Token de acceso válido con permisos
- ✅ Bot respondiendo mensajes automáticamente
