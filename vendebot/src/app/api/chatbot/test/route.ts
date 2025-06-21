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
    }    // Si no hay config, usar configuración de Roff Studio
    const businessConfig: BusinessConfig = config || {
      name: "Roff Studio",
      category: "software_development",
      products: [
        "Desarrollo de Software",
        "Aplicaciones Web",
        "Apps Móviles", 
        "Consultoría Tecnológica",
        "Automatización de Procesos",
        "Integración de APIs"
      ],
      address: "Santiago, Chile",
      hours: {
        monday: { open: "09:00", close: "18:00", closed: false },
        tuesday: { open: "09:00", close: "18:00", closed: false },
        wednesday: { open: "09:00", close: "18:00", closed: false },
        thursday: { open: "09:00", close: "18:00", closed: false },
        friday: { open: "09:00", close: "18:00", closed: false },
        saturday: { open: "10:00", close: "14:00", closed: false },
        sunday: { open: "00:00", close: "00:00", closed: true },
      },
      customFAQs: [],
      greetingMessage: "¡Hola! Bienvenido a **Roff Studio**. Somos especialistas en desarrollo de software y soluciones tecnológicas. ¿En qué podemos ayudarte hoy?",
      fallbackMessage: "Gracias por tu consulta. Un especialista de Roff Studio te contactará pronto para conversar sobre tu proyecto 👨‍💻"
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
