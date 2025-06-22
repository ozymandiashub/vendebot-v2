// Test Script for Canva Sales WhatsApp Bot
// Este archivo simula mensajes típicos de clientes interesados en Canva

const WEBHOOK_URL = 'http://localhost:3003/api/chatbot/webhook-simple';
const TEST_PHONE = '+56912345678';

// Configuración de negocio por defecto para testing
const DEFAULT_BUSINESS_CONFIG = {
  name: "CanvaProCL",
  category: "canva_accounts",
  products: [
    "Canva Pro (1 año) - $8.990",
    "Canva Teams (1 año) - $12.990", 
    "Canva Premium Lifetime - $19.990"
  ],
  hours: {
    monday: { open: '09:00', close: '21:00', closed: false },
    tuesday: { open: '09:00', close: '21:00', closed: false },
    wednesday: { open: '09:00', close: '21:00', closed: false },
    thursday: { open: '09:00', close: '21:00', closed: false },
    friday: { open: '09:00', close: '21:00', closed: false },
    saturday: { open: '09:00', close: '21:00', closed: false },
    sunday: { open: '09:00', close: '21:00', closed: false }
  },
  customFAQs: [],
  paymentMethods: ['Transferencia Bancaria', 'WebPay', 'Mercado Pago'],
  deliveryInfo: 'Entrega inmediata por WhatsApp después del pago'
};

// Mensajes de prueba para el flujo de venta de Canva
const TEST_MESSAGES = [
  // Saludo inicial
  { message: "Hola", description: "Saludo inicial - debe responder con bienvenida y mostrar productos" },
  
  // Consultas sobre productos
  { message: "¿Qué productos Canva tienen?", description: "Consulta de catálogo - debe mostrar productos disponibles" },
  { message: "Cuánto cuesta Canva Pro", description: "Consulta de precio - debe mostrar información de precios" },
  { message: "Qué incluye Canva Pro", description: "Consulta de características - debe explicar funciones" },
  
  // Proceso de compra
  { message: "1", description: "Selección de producto 1 (Canva Pro) - debe mostrar detalles y opciones de pago" },
  { message: "Quiero comprar Canva Pro", description: "Intención de compra - debe mostrar catálogo o procesar" },
  { message: "2", description: "Selección de método de pago 2 (WebPay) - debe dar instrucciones" },
  
  // Consultas de soporte
  { message: "¿Cómo funciona la entrega?", description: "Consulta de entrega - debe explicar proceso" },
  { message: "¿Tienen garantía?", description: "Consulta de garantía - debe explicar soporte" },
  { message: "Problema con mi cuenta", description: "Soporte técnico - debe ofrecer ayuda" },
  
  // Consultas de pago
  { message: "¿Cómo puedo pagar?", description: "Métodos de pago - debe mostrar opciones disponibles" },
  { message: "Acepta transferencia", description: "Consulta método específico - debe confirmar y dar datos" },
  
  // Horarios
  { message: "¿Cuál es el horario de atención?", description: "Consulta horarios - debe mostrar disponibilidad" }
];

/**
 * Simula un webhook de Meta WhatsApp Business API
 */
function createMetaWebhook(message, fromPhone = TEST_PHONE) {
  return {
    object: "whatsapp_business_account",
    entry: [
      {
        id: "309325415606213",
        changes: [
          {
            value: {
              messaging_product: "whatsapp",
              metadata: {
                display_phone_number: "+56979171217",
                phone_number_id: "680539538479058"
              },
              contacts: [
                {
                  profile: {
                    name: "Test Customer"
                  },
                  wa_id: fromPhone.replace('+', '')
                }
              ],
              messages: [
                {
                  from: fromPhone.replace('+', ''),
                  id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                  timestamp: Math.floor(Date.now() / 1000).toString(),
                  text: {
                    body: message
                  },
                  type: "text"
                }
              ]
            },
            field: "messages"
          }
        ]
      }
    ]
  };
}

/**
 * Envía un mensaje de prueba al webhook
 */
async function testMessage(messageData) {
  console.log(`\n🧪 Testing: "${messageData.message}"`);
  console.log(`📝 Description: ${messageData.description}`);
  
  const webhook = createMetaWebhook(messageData.message);
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhook)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ Response (${result.responseTime}ms):`);
      console.log(`📱 ${result.response}`);
      console.log(`🏢 Business: ${result.businessName}`);
      console.log(`📡 Provider: ${result.provider}`);
    } else {
      console.log(`❌ Error: ${result.error}`);
    }
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
  }
  
  // Pausa entre mensajes para simular conversación real
  await new Promise(resolve => setTimeout(resolve, 1500));
}

/**
 * Ejecuta todos los tests
 */
async function runAllTests() {
  console.log('🚀 Iniciando pruebas del VendeBot - Venta de Canva');
  console.log('================================================');
    for (const messageData of TEST_MESSAGES) {
    await testMessage(messageData);
  }
  
  console.log('\n✅ Todas las pruebas completadas!');
  console.log('================================================');
}

/**
 * Ejecuta un test interactivo
 */
async function interactiveTest() {
  const message = process.argv[2];
  
  if (!message) {
    console.log('❌ Uso: node test-canva-bot.js "mensaje de prueba"');
    console.log('📝 Ejemplo: node test-canva-bot.js "Hola, quiero Canva Pro"');
    return;
  }
  
  console.log('🧪 Modo interactivo - Probando mensaje personalizado');
  console.log('==================================================');
  
  await testMessage({
    message: message,
    description: 'Mensaje personalizado'
  });
}

// Ejecutar según argumentos
if (process.argv.includes('--all')) {
  runAllTests();
} else if (process.argv[2]) {
  interactiveTest();
} else {
  console.log('🎨 VendeBot - Test de Venta de Canva');
  console.log('==================================');
  console.log('');
  console.log('Opciones disponibles:');
  console.log('  node test-canva-bot.js --all                    # Ejecutar todos los tests');
  console.log('  node test-canva-bot.js "mensaje personalizado"  # Test de mensaje específico');
  console.log('');
  console.log('Ejemplos:');
  console.log('  node test-canva-bot.js "Hola"');
  console.log('  node test-canva-bot.js "Cuánto cuesta Canva Pro"');
  console.log('  node test-canva-bot.js "1"');
  console.log('  node test-canva-bot.js "¿Cómo pago?"');
}

module.exports = {
  testMessage,
  runAllTests,
  interactiveTest,
  createMetaWebhook,
  TEST_MESSAGES,
  DEFAULT_BUSINESS_CONFIG
};
