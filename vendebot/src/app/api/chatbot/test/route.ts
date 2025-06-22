// VendeBot MVP - Chatbot Test Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { generateResponse } from '@/lib/message-classifier';
import { generateAIResponse } from '@/lib/azure-openai';
import { BusinessConfig, DEFAULT_FAQS } from '@/types/vendebot';

export async function POST(req: NextRequest) {
  try {
    const { message, config } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }    // Si no hay config, usar configuración de CanvaProCL (venta personal de Canva)
    const businessConfig: BusinessConfig = config || {
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
      fallbackMessage: "Gracias por tu consulta sobre Canva. Te contactaremos pronto para ayudarte con tu compra 🎨"
    };

    // Generar respuesta usando la misma lógica del webhook
    const response = await generateResponse(message, businessConfig);

    // También probar con IA si está disponible
    let aiResponse = null;
    try {
      aiResponse = await generateAIResponse(message, businessConfig);
    } catch (error) {
      console.log('AI response not available in test mode');
    }

    return NextResponse.json({
      success: true,
      message: message,
      response: response,
      aiResponse: aiResponse,
      businessConfig: {
        name: businessConfig.name,
        category: businessConfig.category
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({ 
      error: 'Error testing chatbot',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'VendeBot Test Endpoint Active',
    availableTests: [
      'POST /api/chatbot/test - Test message processing',
    ],
    sampleRequest: {
      message: "Hola, ¿cuál es el horario de atención?",
      config: {
        name: "Mi Negocio",
        category: "retail"
      }
    }
  });
}
