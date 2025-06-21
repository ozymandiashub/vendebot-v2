// VendeBot MVP - Twilio WhatsApp Integration
import twilio from 'twilio';
import crypto from 'crypto';
import { NextRequest } from 'next/server';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

/**
 * Valida la firma del webhook de Twilio para seguridad
 */
export async function validateTwilioSignature(req: NextRequest): Promise<boolean> {
  try {
    const twilioSignature = req.headers.get('x-twilio-signature');
    if (!twilioSignature) return false;

    const authToken = process.env.TWILIO_AUTH_TOKEN!;
    const url = req.url;
    const body = await req.text();

    const expectedSignature = crypto
      .createHmac('sha1', authToken)
      .update(url + body)
      .digest('base64');

    return crypto.timingSafeEqual(
      Buffer.from(twilioSignature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Error validating Twilio signature:', error);
    return false;
  }
}

/**
 * Envía un mensaje de WhatsApp usando la API de Twilio
 */
export async function sendWhatsAppMessage(
  to: string,
  message: string,
  from?: string
): Promise<boolean> {
  try {
    const fromNumber = from || process.env.TWILIO_PHONE_NUMBER!;
    
    await client.messages.create({
      body: message,
      from: fromNumber,
      to: to
    });

    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
}

/**
 * Obtiene el historial de mensajes para un número específico
 */
export async function getMessageHistory(phoneNumber: string, limit: number = 50) {
  try {
    const messages = await client.messages.list({
      from: phoneNumber,
      limit: limit
    });

    return messages.map(msg => ({
      sid: msg.sid,
      body: msg.body,
      from: msg.from,
      to: msg.to,
      direction: msg.direction,
      status: msg.status,
      dateCreated: msg.dateCreated
    }));
  } catch (error) {
    console.error('Error getting message history:', error);
    return [];
  }
}

/**
 * Obtiene información del número virtual de Twilio
 */
export async function getPhoneNumberInfo(phoneNumber: string) {
  try {
    const number = await client.incomingPhoneNumbers.list({
      phoneNumber: phoneNumber
    });

    return number[0] || null;
  } catch (error) {
    console.error('Error getting phone number info:', error);
    return null;
  }
}
