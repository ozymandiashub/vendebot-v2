// VendeBot MVP - Meta WhatsApp Business Configuration API
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MetaBusinessConfig {
  businessAccountId: string;
  accessToken: string;
  phoneNumberId: string;
  webhookVerifyToken: string;
}

export async function POST(req: NextRequest) {
  try {
    const { 
      businessAccountId, 
      accessToken, 
      phoneNumberId, 
      webhookVerifyToken,
      userId 
    }: MetaBusinessConfig & { userId: string } = await req.json();

    // Validar datos requeridos
    if (!businessAccountId || !accessToken || !phoneNumberId || !userId) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos para configurar Meta WhatsApp Business' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar o crear configuración del negocio
    const business = await prisma.business.upsert({
      where: { userId },
      update: {
        isActive: true,
        twilioSid: phoneNumberId, // Reutilizar campo para Meta Phone Number ID
        updatedAt: new Date()
      },
      create: {
        userId,
        name: 'Negocio Meta',
        category: 'retail',
        whatsappNumber: phoneNumberId, // Usar phoneNumberId como whatsappNumber
        virtualNumber: phoneNumberId,
        twilioSid: phoneNumberId,
        address: '',
        config: {},
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Generar configuración de webhook para Meta
    const webhookUrl = `${process.env.APP_URL || 'https://vendebot.netlify.app'}/api/chatbot/webhook`;
    
    return NextResponse.json({
      success: true,
      message: 'Meta WhatsApp Business configurado correctamente',
      business: {
        id: business.id,
        name: business.name,
        phoneNumberId,
        isActive: business.isActive
      },
      webhookConfig: {
        url: webhookUrl,
        verifyToken: webhookVerifyToken,
        fields: ['messages', 'message_deliveries', 'message_reads']
      },
      nextSteps: [
        'Configura el webhook en Meta for Developers',
        'Prueba enviar un mensaje a tu número de WhatsApp Business',
        'Verifica que el bot responda automáticamente'
      ]
    });

  } catch (error) {
    console.error('Error configuring Meta WhatsApp Business:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    const business = await prisma.business.findUnique({
      where: { userId },
      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!business) {
      return NextResponse.json({
        configured: false,
        message: 'Meta WhatsApp Business no configurado'
      });
    }

    return NextResponse.json({
      configured: true,
      business,
      webhookUrl: `${process.env.APP_URL || 'https://vendebot.netlify.app'}/api/chatbot/webhook`
    });

  } catch (error) {
    console.error('Error getting Meta WhatsApp Business config:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
