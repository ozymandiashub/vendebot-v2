// VendeBot MVP - WhatsApp Webhook (Meta Business API + Twilio Fallback)
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Meta WhatsApp Business API
import { 
  validateMetaWebhook, 
  sendMetaWhatsAppMessage, 
  parseMetaWebhook, 
  markMessageAsRead 
} from '@/lib/meta-whatsapp';

// Twilio Fallback
import { validateTwilioSignature, sendWhatsAppMessage } from '@/lib/twilio';

import { generateResponse } from '@/lib/message-classifier';
import { generateAIResponse, requiresHumanIntervention } from '@/lib/azure-openai';
import { TwilioWebhookBody, BusinessConfig } from '@/types/vendebot';

const prisma = new PrismaClient();
const WHATSAPP_PROVIDER = process.env.WHATSAPP_PROVIDER || 'meta';

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
    let virtualNumber: string = '';
    let messageBody: string = '';
    let messageId: string = '';    if (WHATSAPP_PROVIDER === 'meta') {
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
        virtualNumber = parsedData.phoneNumberId;
        messageBody = parsedData.message;
        messageId = parsedData.messageId;

        // Marcar mensaje como leído (solo si tenemos credenciales válidas)
        if (process.env.WHATSAPP_ACCESS_TOKEN !== 'pending_verification') {
          await markMessageAsRead(messageId);
        }
        
      } catch (jsonError) {
        console.error('❌ Error parsing Meta webhook JSON:', jsonError);
        return NextResponse.json({ error: 'Invalid JSON in webhook' }, { status: 400 });
      }

    } else {
      // 🔄 FALLBACK A TWILIO
      console.log('📱 Using Twilio WhatsApp API (fallback)');
      
      const isValid = await validateTwilioSignature(req);
      if (!isValid && process.env.ENVIRONMENT === 'production') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }      const formData = await req.formData();
      const webhookData: Partial<TwilioWebhookBody> = {};
      
      formData.forEach((value, key) => {
        webhookData[key as keyof TwilioWebhookBody] = value.toString();
      });

      clientNumber = webhookData.From || '';
      virtualNumber = webhookData.To || '';
      messageBody = webhookData.Body || '';
      messageId = webhookData.MessageSid || '';
    }

    if (!clientNumber || !virtualNumber || !messageBody) {
      console.error('Missing required webhook data');
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    console.log(`📱 Message received from ${clientNumber}: "${messageBody}"`);

    // Buscar el negocio por número virtual (adaptar según provider)
    let business;
    if (WHATSAPP_PROVIDER === 'meta') {
      // Para Meta, buscar por phoneNumberId
      business = await prisma.business.findFirst({
        where: { 
          OR: [
            { virtualNumber: virtualNumber },
            { twilioSid: virtualNumber } // Usar twilioSid para almacenar phoneNumberId de Meta
          ]
        },
        include: { user: true }
      });
    } else {
      business = await prisma.business.findUnique({
        where: { virtualNumber },
        include: { user: true }
      });
    }

    if (!business) {
      console.error(`Business not found for number: ${virtualNumber}`);
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    if (!business.isActive) {
      console.log(`Business ${business.name} is inactive`);
      return NextResponse.json({ success: true, message: 'Business inactive' });
    }

    // Log del mensaje recibido
    await logAnalytics(business.id, 'received', messageBody, clientNumber);    // Generar respuesta
    const businessConfig = business.config as unknown as BusinessConfig;
    let response: string;
    let responseType = 'faq';

    try {
      response = await generateResponse(messageBody, businessConfig);
      
      if (requiresHumanIntervention(messageBody)) {
        response = await generateAIResponse(messageBody, businessConfig);
        responseType = 'ai';
      }
    } catch (error) {
      console.error('Error generating response:', error);
      response = `Gracias por tu mensaje. Un ejecutivo de ${businessConfig.name} te contactará pronto 👨‍💼`;
      responseType = 'fallback';
    }

    // Enviar respuesta usando el proveedor correspondiente
    let messageSent = false;
    if (WHATSAPP_PROVIDER === 'meta') {
      messageSent = await sendMetaWhatsAppMessage(clientNumber, response);
    } else {
      messageSent = await sendWhatsAppMessage(clientNumber, response, virtualNumber);
    }
    
    if (!messageSent) {
      console.error('Failed to send WhatsApp message');
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    // Log de la respuesta enviada
    const responseTime = Date.now() - startTime;
    await logAnalytics(business.id, 'sent', response, clientNumber, responseType, responseTime);

        console.log(`✅ Response sent to ${clientNumber}: "${response}" (${responseTime}ms)`);

    return NextResponse.json({ 
      success: true, 
      response,
      responseTime,
      businessName: business.name,
      provider: WHATSAPP_PROVIDER
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Registra analytics del mensaje en la base de datos
 */
async function logAnalytics(
  businessId: string,
  messageType: 'received' | 'sent',
  content: string,
  fromNumber?: string,
  category?: string,
  responseTime?: number
) {
  try {
    await prisma.analytics.create({
      data: {
        businessId,
        messageType,
        content: content.substring(0, 500), // Truncar contenido largo
        fromNumber,
        category,
        responseTime,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error logging analytics:', error);
    // No fallar el webhook por errores de analytics
  }
}
