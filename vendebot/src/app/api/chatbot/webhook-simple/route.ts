// VendeBot MVP - Simplified Personal Canva Sales Webhook
// Para uso personal sin base de datos - configuración hardcodeada
import { NextRequest, NextResponse } from 'next/server';

// Meta WhatsApp Business API
import { 
  parseMetaWebhook, 
  markMessageAsRead,
  sendMetaWhatsAppMessage 
} from '@/lib/meta-whatsapp';

import { generateResponse } from '@/lib/message-classifier';
import { generateRealPaymentLink, processPaymentMethodSelection } from '@/lib/canva-sales';
import { BusinessConfig } from '@/types/vendebot';

const WHATSAPP_PROVIDER = process.env.WHATSAPP_PROVIDER || 'meta';

// Configuración hardcodeada para tu negocio personal de Canva
const PERSONAL_CANVA_BUSINESS: BusinessConfig = {
  name: "CanvaProCL",
  category: "canva_accounts",
  products: [
    "Canva Pro (1 año) - $8.990 CLP",
    "Canva Teams (1 año) - $12.990 CLP", 
    "Canva Premium Lifetime - $19.990 CLP"
  ],
  address: "Santiago, Chile",
  hours: {
    monday: { open: "09:00", close: "21:00", closed: false },
    tuesday: { open: "09:00", close: "21:00", closed: false },
    wednesday: { open: "09:00", close: "21:00", closed: false },
    thursday: { open: "09:00", close: "21:00", closed: false },
    friday: { open: "09:00", close: "21:00", closed: false },
    saturday: { open: "09:00", close: "21:00", closed: false },
    sunday: { open: "09:00", close: "21:00", closed: false },
  },
  customFAQs: [],
  greetingMessage: "¡Hola! 🎨 Bienvenido a **CanvaProCL**\n\nSomos especialistas en cuentas Canva Premium y Pro. Tenemos los mejores precios del mercado con entrega inmediata:\n\n🎯 **Nuestros Productos:**\n• Canva Pro (1 año) - $8.990\n• Canva Teams (1 año) - $12.990 \n• Canva Premium Lifetime - $19.990\n\n💳 **Métodos de Pago:** Transferencia, WebPay, MercadoPago\n📱 **Entrega:** Inmediata por WhatsApp\n\n¿Qué producto te interesa? 👇",
  fallbackMessage: "Gracias por tu consulta sobre Canva. Te contactaremos pronto para ayudarte con tu compra 🎨",
  paymentMethods: ['Transferencia Bancaria', 'WebPay', 'Mercado Pago'],
  deliveryInfo: 'Entrega inmediata por WhatsApp después del pago'
};

export async function GET(req: NextRequest) {
  // Validación del webhook de Meta WhatsApp Business API
  const mode = req.nextUrl.searchParams.get('hub.mode');
  const token = req.nextUrl.searchParams.get('hub.verify_token');
  const challenge = req.nextUrl.searchParams.get('hub.challenge');

  console.log('🔍 Meta webhook validation request:', { mode, token: token?.substring(0, 10) + '...' });

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('✅ Meta webhook validated successfully');
    return new NextResponse(challenge, { status: 200 });
  }

  console.error('❌ Meta webhook validation failed');
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    let clientNumber: string = '';
    let messageBody: string = '';
    let messageId: string = '';

    if (WHATSAPP_PROVIDER === 'meta') {
      // 🔥 USAR META WHATSAPP BUSINESS API
      console.log('📱 Using Meta WhatsApp Business API');
      
      try {
        const webhookBody = await req.json();
        console.log('📱 Meta webhook body received:', JSON.stringify(webhookBody, null, 2));
        
        const parsedData = parseMetaWebhook(webhookBody);
        
        if (!parsedData) {
          console.error('❌ Failed to parse Meta webhook data');
          return NextResponse.json({ error: 'Invalid Meta webhook data' }, { status: 400 });
        }

        clientNumber = parsedData.from;
        messageBody = parsedData.message;
        messageId = parsedData.messageId;

        // Marcar mensaje como leído (solo si tenemos credenciales válidas)
        if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_ACCESS_TOKEN !== 'pending_verification') {
          await markMessageAsRead(messageId);
        }
        
      } catch (jsonError) {
        console.error('❌ Error parsing Meta webhook JSON:', jsonError);
        return NextResponse.json({ error: 'Invalid JSON in webhook' }, { status: 400 });
      }

    } else {
      console.log('❌ Solo Meta WhatsApp Business API está soportado en el webhook simplificado');
      return NextResponse.json({ error: 'Only Meta WhatsApp Business API supported' }, { status: 400 });
    }

    if (!clientNumber || !messageBody) {
      console.error('Missing required webhook data');
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    console.log(`📱 Message received from ${clientNumber}: "${messageBody}"`);    // Generar respuesta usando la configuración hardcodeada
    let response: string;
    let responseType = 'faq';

    try {
      // Detectar si es selección de producto o método de pago para generar links reales
      const isProductSelection = ['1', '2', '3'].includes(messageBody.trim());
      const isPaymentMethod = messageBody.toLowerCase().includes('mercado') || 
                             messageBody.toLowerCase().includes('webpay') ||
                             messageBody.toLowerCase().includes('pago');
      
      if (isProductSelection) {
        // Generar link de pago real con MercadoPago
        console.log(`🛒 Cliente seleccionó producto ${messageBody}, generando link de pago...`);
        response = await generateRealPaymentLink(messageBody.trim(), clientNumber);
        responseType = 'payment_link';
      } else if (isPaymentMethod) {
        // Procesar método de pago seleccionado
        response = await processPaymentMethodSelection(messageBody.trim(), {}, clientNumber);
        responseType = 'payment_method';
      } else {
        // Respuesta normal del bot
        response = await generateResponse(messageBody, PERSONAL_CANVA_BUSINESS);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      response = `Gracias por tu mensaje. Un ejecutivo de ${PERSONAL_CANVA_BUSINESS.name} te contactará pronto 👨‍💼`;
      responseType = 'fallback';
    }// Enviar respuesta usando Meta WhatsApp Business API
    let messageSent = false;
    if (process.env.WHATSAPP_ACCESS_TOKEN && 
        process.env.WHATSAPP_ACCESS_TOKEN !== 'pending_verification' && 
        process.env.NODE_ENV === 'production') {
      messageSent = await sendMetaWhatsAppMessage(clientNumber, response);
    } else {
      console.log('🧪 MODO TESTING: Simulando envío de mensaje (Access Token no configurado o en desarrollo)');
      console.log(`📱 Mensaje que se enviaría a ${clientNumber}:`);
      console.log(`📄 "${response}"`);
      messageSent = true; // Simular envío exitoso para testing
    }
    
    if (!messageSent) {
      console.error('Failed to send WhatsApp message');
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    const responseTime = Date.now() - startTime;
    console.log(`✅ Response sent to ${clientNumber}: "${response}" (${responseTime}ms)`);

    // Log básico sin base de datos
    console.log(`📊 Analytics: Business=${PERSONAL_CANVA_BUSINESS.name}, From=${clientNumber}, Message="${messageBody}", Response="${response.substring(0, 100)}...", Time=${responseTime}ms`);

    return NextResponse.json({ 
      success: true, 
      response,
      responseTime,
      businessName: PERSONAL_CANVA_BUSINESS.name,
      provider: WHATSAPP_PROVIDER,
      clientNumber,
      messageReceived: messageBody
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
