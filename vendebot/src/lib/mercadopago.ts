// Integración MercadoPago para VendeBot

// Configuración MercadoPago
const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const MERCADOPAGO_PUBLIC_KEY = process.env.MERCADOPAGO_PUBLIC_KEY;

interface PaymentItem {
  id: string;
  title: string;
  description: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
}

interface PaymentPreference {
  items: PaymentItem[];
  payer?: {
    phone?: {
      area_code: string;
      number: string;
    };
    identification?: {
      type: string;
      number: string;
    };
    email?: string;
  };
  payment_methods?: {
    excluded_payment_methods?: Array<{ id: string }>;
    excluded_payment_types?: Array<{ id: string }>;
    installments?: number;
  };
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: string;
  external_reference?: string;
  expires?: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
}

/**
 * Crea un link de pago de MercadoPago para productos Canva
 */
export async function createCanvaPaymentLink(
  productId: string,
  customerPhone: string,
  customerName?: string
): Promise<{ success: boolean; paymentUrl?: string; error?: string; preferenceId?: string }> {
  
  console.log('🔍 MercadoPago Debug:', {
    hasAccessToken: !!MERCADOPAGO_ACCESS_TOKEN,
    tokenStart: MERCADOPAGO_ACCESS_TOKEN?.substring(0, 10),
    hasPublicKey: !!MERCADOPAGO_PUBLIC_KEY
  });
  
  if (!MERCADOPAGO_ACCESS_TOKEN) {
    console.error('❌ MercadoPago Access Token no configurado');
    return { success: false, error: 'MercadoPago no configurado' };
  }

  // Definir productos Canva
  const canvaProducts: Record<string, PaymentItem> = {
    '1': {
      id: 'canva-pro-1year',
      title: 'Canva Pro (1 año)',
      description: 'Cuenta Canva Pro por 1 año completo - Incluye 100M+ elementos premium, Magic Resize, fondo transparente',
      quantity: 1,
      currency_id: 'CLP',
      unit_price: 8990
    },
    '2': {
      id: 'canva-teams-1year', 
      title: 'Canva Teams (1 año)',
      description: 'Cuenta Canva Teams por 1 año - Gestión de marca, hasta 10 usuarios, colaboración avanzada',
      quantity: 1,
      currency_id: 'CLP',
      unit_price: 12990
    },
    '3': {
      id: 'canva-premium-lifetime',
      title: 'Canva Premium Lifetime',
      description: 'Acceso de por vida a Canva Pro - Sin renovaciones, actualizaciones incluidas',
      quantity: 1,
      currency_id: 'CLP', 
      unit_price: 19990
    }
  };

  const product = canvaProducts[productId];
  if (!product) {
    return { success: false, error: 'Producto no encontrado' };
  }

  // Limpiar número de teléfono (remover código de país y caracteres especiales)
  const cleanPhone = customerPhone.replace(/^\+?56/, '').replace(/[^\d]/g, '');
  const areaCode = cleanPhone.length >= 8 ? cleanPhone.substring(0, 1) : '9';
  const phoneNumber = cleanPhone.length >= 8 ? cleanPhone.substring(1) : cleanPhone;

  try {
    const preference: PaymentPreference = {
      items: [product],
      payer: {
        phone: {
          area_code: areaCode,
          number: phoneNumber
        },
        email: `cliente${cleanPhone}@canvapro.cl` // Email temporal
      },
      payment_methods: {
        excluded_payment_methods: [], // Permitir todos los métodos
        installments: 12 // Hasta 12 cuotas
      },      back_urls: {
        success: `${process.env.APP_URL || 'https://vendebot-cl.netlify.app'}/success`,
        failure: `${process.env.APP_URL || 'https://vendebot-cl.netlify.app'}/failure`, 
        pending: `${process.env.APP_URL || 'https://vendebot-cl.netlify.app'}/pending`
      },
      external_reference: `canva-${productId}-${Date.now()}-${cleanPhone}`,
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
    };

    console.log('💳 Creando preferencia de pago MercadoPago:', {
      product: product.title,
      price: product.unit_price,
      phone: `+56${areaCode}${phoneNumber}`
    });

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Error MercadoPago API:', response.status, errorData);
      return { success: false, error: `Error ${response.status}: ${errorData}` };
    }    const data = await response.json() as any;
    console.log('✅ Link de pago creado exitosamente:', data.init_point);

    return {
      success: true,
      paymentUrl: data.init_point,
      preferenceId: data.id
    };

  } catch (error) {
    console.error('❌ Error al crear link de pago:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}

/**
 * Verifica el estado de un pago de MercadoPago
 */
export async function checkPaymentStatus(preferenceId: string): Promise<{
  success: boolean;
  status?: string;
  paymentId?: string;
  error?: string;
}> {
  
  if (!MERCADOPAGO_ACCESS_TOKEN) {
    return { success: false, error: 'MercadoPago no configurado' };
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/checkout/preferences/${preferenceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return { success: false, error: `Error ${response.status}` };
    }    const data = await response.json() as any;
    
    return {
      success: true,
      status: data.status,
      paymentId: data.id
    };

  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}

/**
 * Genera mensaje con link de pago para WhatsApp
 */
export function generatePaymentMessage(
  productName: string,
  price: number,
  paymentUrl: string,
  customerName?: string
): string {
  const greeting = customerName ? `Hola ${customerName}` : 'Hola';
  
  return `${greeting}! 🎨

✅ **Producto seleccionado:** ${productName}
💰 **Precio:** $${price.toLocaleString('es-CL')} CLP

🔗 **Link de pago seguro:**
${paymentUrl}

💳 **Opciones de pago:**
• Tarjetas de débito y crédito
• Transferencia desde la app
• Hasta 12 cuotas sin interés

⏱️ **Este link expira en 24 horas**

📱 **Después del pago:**
• Recibirás tu cuenta Canva en 2-5 minutos
• Te llegará email y contraseña
• Soporte incluido por 30 días

¿Necesitas ayuda con el pago? Responde aquí 😊`;
}

/**
 * Datos bancarios para transferencia manual
 */
export function getBankTransferInfo(): string {
  return `🏦 **Transferencia Bancaria - Banco de Chile**

📋 **Datos para transferir:**
• **Nombre:** [TU NOMBRE COMPLETO]
• **RUT:** [TU RUT]
• **Banco:** Banco de Chile
• **Tipo:** Cuenta Corriente
• **Número:** [TU NÚMERO DE CUENTA]
• **Email:** [TU EMAIL]

💰 **Instrucciones:**
1. Haz la transferencia por el monto exacto
2. Envía el comprobante por WhatsApp
3. Recibes tu cuenta Canva en 2-5 minutos

⚡ **Importante:** Incluye tu número de teléfono en el mensaje de la transferencia

¿Ya hiciste la transferencia? Envía el comprobante 📸`;
}

// Configuración por defecto si no hay variables de entorno
export const MERCADOPAGO_CONFIG = {
  publicKey: MERCADOPAGO_PUBLIC_KEY || 'pending_configuration',
  accessToken: MERCADOPAGO_ACCESS_TOKEN || 'pending_configuration',
  isConfigured: !!(MERCADOPAGO_ACCESS_TOKEN && MERCADOPAGO_PUBLIC_KEY)
};
