// VendeBot MVP - Business Configuration API
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { BusinessConfig } from '@/types/vendebot';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json({ error: 'Business ID required' }, { status: 400 });
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: { user: true }
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      business: {
        id: business.id,
        name: business.name,
        category: business.category,
        whatsappNumber: business.whatsappNumber,
        virtualNumber: business.virtualNumber,
        address: business.address,
        config: business.config,
        isActive: business.isActive,
        createdAt: business.createdAt
      }
    });

  } catch (error) {
    console.error('Error fetching business config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId, config } = await req.json();

    if (!businessId || !config) {
      return NextResponse.json({ 
        error: 'Business ID and config are required' 
      }, { status: 400 });
    }

    // Validar estructura de config
    const businessConfig: BusinessConfig = {
      name: config.name || '',
      category: config.category || 'retail',
      products: config.products || [],
      hours: config.hours || getDefaultHours(),
      address: config.address || '',
      customFAQs: config.customFAQs || [],
      greetingMessage: config.greetingMessage,
      fallbackMessage: config.fallbackMessage
    };

    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: {
        name: businessConfig.name,
        category: businessConfig.category,
        address: businessConfig.address,
        config: businessConfig as unknown as object // Forzar a tipo object para InputJsonValue
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Configuration updated successfully',
      business: {
        id: updatedBusiness.id,
        name: updatedBusiness.name,
        config: updatedBusiness.config
      }
    });

  } catch (error) {
    console.error('Error updating business config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId, businessData } = await req.json();

    if (!userId || !businessData) {
      return NextResponse.json({ 
        error: 'User ID and business data are required' 
      }, { status: 400 });
    }

    // Crear nuevo negocio
    const virtualNumber = `whatsapp:+1415523${Math.floor(1000 + Math.random() * 9000)}`;
    
    const defaultConfig: BusinessConfig = {
      name: businessData.name,
      category: businessData.category || 'retail',
      products: businessData.products || [],
      hours: businessData.hours || getDefaultHours(),
      address: businessData.address || '',
      customFAQs: [],
      greetingMessage: `¡Hola! Bienvenido a ${businessData.name}. ¿En qué puedo ayudarte?`,
      fallbackMessage: `Un ejecutivo de ${businessData.name} te contactará pronto para ayudarte 👨‍💼`
    };

    const business = await prisma.business.create({
      data: {
        name: businessData.name,
        category: businessData.category || 'retail',
        whatsappNumber: businessData.whatsappNumber,
        virtualNumber,
        address: businessData.address,
        config: defaultConfig as unknown as object,
        userId: userId
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Business created successfully',
      business: {
        id: business.id,
        name: business.name,
        virtualNumber: business.virtualNumber,
        config: business.config
      }
    });

  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getDefaultHours() {
  return {
    monday: { open: "09:00", close: "18:00", closed: false },
    tuesday: { open: "09:00", close: "18:00", closed: false },
    wednesday: { open: "09:00", close: "18:00", closed: false },
    thursday: { open: "09:00", close: "18:00", closed: false },
    friday: { open: "09:00", close: "18:00", closed: false },
    saturday: { open: "10:00", close: "14:00", closed: false },
    sunday: { open: "00:00", close: "00:00", closed: true }
  };
}
