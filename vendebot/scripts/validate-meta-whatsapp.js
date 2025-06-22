// VendeBot MVP - Script para validar configuración de Meta WhatsApp Business
// Ejecutar con: node scripts/validate-meta-whatsapp.js

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || "EAGrdoMvLeqEBO2oN2l63Mp2abWi3TFWpZAfH4DuHbOZADN4GMEM5dyTbnQAhZBcN7T94T3m8gW9tdrZAXKUHR6rhZCmr3FnYRvMkZCoypbYVIr3DISapbkXE6w9C2y1HJh5Xcs2bmpzCzjtCMmA7pvEtXmlJ6sO3PX0U72AVBRbCk8fKC2V51rdKyxmpwENxyCOZBTLSK14nB0Bvfnm4KbpoRdFL7IyjtAztINPRP3DRGDRiXbhLIvKjS2gBHknNgZDZD";
const WHATSAPP_BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || "309325415606213";
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "680539538479058";

async function validateMetaConfiguration() {
  console.log('🔍 Validando configuración de Meta WhatsApp Business...\n');
  
  try {
    // 1. Verificar el Business Account
    console.log('1️⃣ Verificando Business Account...');
    const businessResponse = await fetch(
      `https://graph.facebook.com/v18.0/${WHATSAPP_BUSINESS_ACCOUNT_ID}?fields=id,name,currency,timezone_offset_hours&access_token=${WHATSAPP_ACCESS_TOKEN}`
    );
    
    if (businessResponse.ok) {
      const businessData = await businessResponse.json();
      console.log('✅ Business Account válido:', businessData);
    } else {
      const error = await businessResponse.json();
      console.log('❌ Error en Business Account:', error);
    }

    // 2. Verificar el Phone Number
    console.log('\n2️⃣ Verificando Phone Number...');
    const phoneResponse = await fetch(
      `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}?fields=id,display_phone_number,verified_name,quality_rating,status&access_token=${WHATSAPP_ACCESS_TOKEN}`
    );
    
    if (phoneResponse.ok) {
      const phoneData = await phoneResponse.json();
      console.log('✅ Phone Number válido:', phoneData);
      
      // Verificar status específico
      if (phoneData.status === 'CONNECTED') {
        console.log('✅ Número conectado y listo para usar');
      } else {
        console.log('⚠️  Estado del número:', phoneData.status);
      }
    } else {
      const error = await phoneResponse.json();
      console.log('❌ Error en Phone Number:', error);
    }

    // 3. Verificar los números de teléfono disponibles
    console.log('\n3️⃣ Verificando números disponibles...');
    const numbersResponse = await fetch(
      `https://graph.facebook.com/v18.0/${WHATSAPP_BUSINESS_ACCOUNT_ID}/phone_numbers?access_token=${WHATSAPP_ACCESS_TOKEN}`
    );
    
    if (numbersResponse.ok) {
      const numbersData = await numbersResponse.json();
      console.log('📱 Números disponibles:', numbersData);
    } else {
      const error = await numbersResponse.json();
      console.log('❌ Error obteniendo números:', error);
    }

    // 4. Test de envío de mensaje (opcional - comentado para evitar spam)
    /*
    console.log('\n4️⃣ Probando envío de mensaje de prueba...');
    const testMessage = {
      messaging_product: "whatsapp",
      to: "56979171217", // Tu propio número para prueba
      type: "text",
      text: {
        body: "✅ Test de configuración VendeBot - " + new Date().toLocaleString()
      }
    };

    const sendResponse = await fetch(
      `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testMessage)
      }
    );

    if (sendResponse.ok) {
      const sendData = await sendResponse.json();
      console.log('✅ Mensaje de prueba enviado:', sendData);
    } else {
      const error = await sendResponse.json();
      console.log('❌ Error enviando mensaje:', error);
    }
    */

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar validación
if (require.main === module) {
  validateMetaConfiguration();
}

module.exports = { validateMetaConfiguration };
