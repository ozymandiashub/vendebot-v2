# Configuración de Variables de Entorno para Netlify

## Variables Esenciales para el Webhook

Ve a: https://app.netlify.com/sites/vendebot-cl/settings/env

Configura estas variables:

```bash
# WhatsApp Business API
WHATSAPP_BUSINESS_ACCOUNT_ID=309325415606213
WHATSAPP_ACCESS_TOKEN=EAGrdoMvLeqEBO2oN2l63Mp2abWi3TFWpZAfH4DuHbOZADN4GMEM5dyTbnQAhZBcN7T94T3m8gW9tdrZAXKUHR6rhZCmr3FnYRvMkZCoypbYVIr3DISapbkXE6w9C2y1HJh5Xcs2bmpzCzjtCMmA7pvEtXmlJ6sO3PX0U72AVBRbCk8fKC2V51rdKyxmpwENxyCOZBTLSK14nB0Bvfnm4KbpoRdFL7IyjtAztINPRP3DRGDRiXbhLIvKjS2gBHknNgZDZD
WHATSAPP_PHONE_NUMBER_ID=680539538479058
WHATSAPP_WEBHOOK_VERIFY_TOKEN=vendebot_webhook_2025_secure_token
WHATSAPP_BUSINESS_PHONE=+56979171217
WHATSAPP_BUSINESS_NAME=Roff Studio
WHATSAPP_PROVIDER=meta

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-3001054132363026-062112-ed54d00c29f35bb94cf72806ab672b89-1614290002
MERCADOPAGO_PUBLIC_KEY=APP_USR-df39209b-6915-47fb-adf5-2b588a5e5768

# App Settings
ENVIRONMENT=production
APP_URL=https://vendebot-cl.netlify.app
NEXTAUTH_SECRET=production-secret-change-this
NEXTAUTH_URL=https://vendebot-cl.netlify.app
```

## URL del Webhook para Meta Business:
https://vendebot-cl.netlify.app/api/chatbot/webhook-simple

## Verify Token:
vendebot_webhook_2025_secure_token
