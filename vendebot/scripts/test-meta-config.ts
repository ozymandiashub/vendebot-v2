/**
 * VendeBot - Test de configuración Meta WhatsApp
 * 
 * Script para probar la configuración actual de Meta WhatsApp Business API
 */

import { config } from 'dotenv';
import fetch from 'node-fetch';

// Cargar variables de entorno
config({ path: '.env.local' });

interface MetaConfig {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  verifyToken: string;
  whatsappNumber: string;
  businessName: string;
}

const META_CONFIG: MetaConfig = {
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '309325415606213',
  verifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'vendebot_verify_token_2024',
  whatsappNumber: process.env.WHATSAPP_NUMBER || '+56979171217',
  businessName: process.env.BUSINESS_NAME || 'Roff Studio'
};

async function testMetaConfiguration() {
  console.log('🔍 Probando configuración de Meta WhatsApp Business API...');
  console.log('');
  
  // Verificar variables de entorno
  console.log('📋 CONFIGURACIÓN ACTUAL:');
  console.log('   - Business Account ID:', META_CONFIG.businessAccountId);
  console.log('   - Access Token:', META_CONFIG.accessToken ? 'CONFIGURADO ✅' : 'FALTANTE ❌');
  console.log('   - Phone Number ID:', META_CONFIG.phoneNumberId ? 'CONFIGURADO ✅' : 'FALTANTE ❌');
  console.log('   - Verify Token:', META_CONFIG.verifyToken ? 'CONFIGURADO ✅' : 'FALTANTE ❌');
  console.log('   - WhatsApp Number:', META_CONFIG.whatsappNumber);
  console.log('   - Business Name:', META_CONFIG.businessName);
  console.log('');

  // Test 1: Verificar Business Account
  console.log('🏢 TEST 1: Verificando Business Account...');
  if (META_CONFIG.accessToken) {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${META_CONFIG.businessAccountId}`, {
        headers: {
          'Authorization': `Bearer ${META_CONFIG.accessToken}`
        }
      });
      
      if (response.ok) {
        const data: any = await response.json();
        console.log('   ✅ Business Account válido:', data?.name || 'Nombre no disponible');
      } else {
        const error: any = await response.json();
        console.log('   ❌ Error en Business Account:', error?.error?.message || 'Error desconocido');
      }
    } catch (error) {
      console.log('   ❌ Error de conexión:', typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error));
    }
  } else {
    console.log('   ⚠️  Access Token no configurado, saltando test');
  }
  console.log('');

  // Test 2: Verificar Phone Number
  console.log('📱 TEST 2: Verificando Phone Number...');
  if (META_CONFIG.accessToken && META_CONFIG.phoneNumberId) {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${META_CONFIG.phoneNumberId}`, {
        headers: {
          'Authorization': `Bearer ${META_CONFIG.accessToken}`
        }
      });
      
      if (response.ok) {
        const data: any = await response.json();
        console.log('   ✅ Phone Number válido:', data?.display_phone_number || 'Número no disponible');
        console.log('   📞 Status:', data?.code_verification_status || 'Status no disponible');
      } else {
        const error: any = await response.json();
        console.log('   ❌ Error en Phone Number:', error?.error?.message || 'Error desconocido');
      }
    } catch (error) {
      console.log('   ❌ Error de conexión:', typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error));
    }
  } else {
    console.log('   ⚠️  Phone Number ID no configurado, saltando test');
  }
  console.log('');

  // Test 3: Test de Webhook Local
  console.log('🔗 TEST 3: Probando Webhook Local...');
  try {
    const webhookUrl = 'http://localhost:3000/api/chatbot/webhook';
    const testPayload = {
      object: 'whatsapp_business_account',
      entry: [{
        id: META_CONFIG.businessAccountId,
        changes: [{
          value: {
            messaging_product: 'whatsapp',
            metadata: {
              display_phone_number: META_CONFIG.whatsappNumber,
              phone_number_id: META_CONFIG.phoneNumberId
            },
            messages: [{
              from: '56912345678',
              id: 'test_message_id',
              timestamp: Math.floor(Date.now() / 1000).toString(),
              text: { body: 'Hola, ¿cuáles son sus horarios?' },
              type: 'text'
            }]
          },
          field: 'messages'
        }]
      }]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': 'test_signature'
      },
      body: JSON.stringify(testPayload)
    });

    if (response.ok) {
      console.log('   ✅ Webhook local responde correctamente');
      const responseText = await response.text();
      console.log('   📝 Respuesta:', responseText || 'Sin contenido');
    } else {
      console.log('   ❌ Webhook local no responde:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('   ⚠️  Servidor local no disponible (ejecuta npm run dev)');
  }
  console.log('');

  // Generar reporte
  const configStatus: any = {
    timestamp: new Date().toISOString(),
    businessAccountId: META_CONFIG.businessAccountId,
    accessTokenConfigured: !!META_CONFIG.accessToken,
    phoneNumberIdConfigured: !!META_CONFIG.phoneNumberId,
    verifyTokenConfigured: !!META_CONFIG.verifyToken,
    webhookUrl: 'https://vendebot-roff-studio.netlify.app/api/chatbot/webhook',
    localWebhookUrl: 'http://localhost:3000/api/chatbot/webhook',
    nextSteps: []
  };

  if (!META_CONFIG.accessToken) {
    configStatus.nextSteps.push('Configurar WHATSAPP_ACCESS_TOKEN en .env.local');
  }
  
  if (!META_CONFIG.phoneNumberId) {
    configStatus.nextSteps.push('Configurar WHATSAPP_PHONE_NUMBER_ID en .env.local');
  }

  if (configStatus.nextSteps.length === 0) {
    configStatus.nextSteps.push('Configuración completa - Listo para producción');
  }

  console.log('📊 REPORTE DE ESTADO:');
  console.log(JSON.stringify(configStatus, null, 2));
  console.log('');

  // Instrucciones finales
  console.log('📋 INSTRUCCIONES PARA COMPLETAR LA CONFIGURACIÓN:');
  console.log('');
  console.log('1. 🌐 Ve a https://developers.facebook.com/apps/');
  console.log('2. 🔑 Crea o selecciona tu app de WhatsApp Business');
  console.log('3. 📱 Ve a WhatsApp > API Setup');
  console.log('4. 🎯 Copia el "Access Token" y agrégalo a .env.local como WHATSAPP_ACCESS_TOKEN');
  console.log('5. 📞 Ve a WhatsApp > Phone Numbers');
  console.log('6. 🆔 Copia el "Phone Number ID" y agrégalo a .env.local como WHATSAPP_PHONE_NUMBER_ID');
  console.log('7. 🔗 Configura el webhook con URL: https://vendebot-roff-studio.netlify.app/api/chatbot/webhook');
  console.log('8. 🔐 Usa verify token: vendebot_verify_token_2024');
  console.log('9. ✅ Suscríbete a eventos de "messages"');
  console.log('10. 🚀 Despliega a Netlify y prueba con mensajes reales');
  console.log('');
  console.log('💡 TIPS:');
  console.log('   - El Access Token tiene formato: EAA...');
  console.log('   - El Phone Number ID es un número largo (15+ dígitos)');
  console.log('   - Usa el test de webhook local para validar antes de producción');
  console.log('');
}

if (require.main === module) {
  testMetaConfiguration().catch(console.error);
}

export { testMetaConfiguration };
