// VendeBot MVP - Meta WhatsApp Business API Integration
import { NextRequest } from 'next/server';

interface WhatsAppMessageData {
  from: string;
  id: string;
  text: {
    body: string;
  };
  timestamp: string;
  type: string;
}

interface WhatsAppWebhookEntry {
  id: string;
  changes: Array<{
    value: {
      messaging_product: string;
      metadata: {
        display_phone_number: string;
        phone_number_id: string;
      };
      messages?: WhatsAppMessageData[];
      statuses?: any[];
    };
    field: string;
  }>;
}

interface WhatsAppWebhookBody {
  object: string;
  entry: WhatsAppWebhookEntry[];
}

/**
 * Valida el webhook de Meta WhatsApp Business API
 */
export function validateMetaWebhook(req: NextRequest): boolean {
  try {
    const mode = req.nextUrl.searchParams.get('hub.mode');
    const token = req.nextUrl.searchParams.get('hub.verify_token');
    const challenge = req.nextUrl.searchParams.get('hub.challenge');

    // Verificar que el token coincida
    if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error validating Meta webhook:', error);
    return false;
  }
}

/**
 * Envía un mensaje usando Meta WhatsApp Business API
 */
export async function sendMetaWhatsAppMessage(
  to: string,
  message: string
): Promise<boolean> {
  try {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      console.error('Missing WhatsApp credentials');
      return false;
    }

    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: {
          body: message
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Meta WhatsApp API error:', response.status, errorData);
      return false;
    }

    const result = await response.json();
    console.log('✅ Meta WhatsApp message sent:', result);
    return true;

  } catch (error) {
    console.error('Error sending Meta WhatsApp message:', error);
    return false;
  }
}

/**
 * Procesa el webhook de Meta WhatsApp Business API
 */
export function parseMetaWebhook(body: WhatsAppWebhookBody): {
  from: string;
  message: string;
  messageId: string;
  phoneNumberId: string;
} | null {
  try {
    // Extraer datos del webhook
    const entry = body.entry?.[0];
    if (!entry) return null;

    const change = entry.changes?.[0];
    if (!change) return null;

    const messages = change.value.messages;
    if (!messages || messages.length === 0) return null;

    const message = messages[0];
    if (message.type !== 'text') return null;

    return {
      from: message.from,
      message: message.text.body,
      messageId: message.id,
      phoneNumberId: change.value.metadata.phone_number_id
    };

  } catch (error) {
    console.error('Error parsing Meta webhook:', error);
    return null;
  }
}

/**
 * Marca un mensaje como leído en Meta WhatsApp
 */
export async function markMessageAsRead(messageId: string): Promise<boolean> {
  try {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      return false;
    }

    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId
      })
    });

    return response.ok;

  } catch (error) {
    console.error('Error marking message as read:', error);
    return false;
  }
}

/**
 * Obtiene información del perfil del negocio
 */
export async function getBusinessProfile(): Promise<any> {
  try {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      return null;
    }

    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/whatsapp_business_profile`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });

    if (response.ok) {
      return await response.json();
    }

    return null;

  } catch (error) {
    console.error('Error getting business profile:', error);
    return null;
  }
}
