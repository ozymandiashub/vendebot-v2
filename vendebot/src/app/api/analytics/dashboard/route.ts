// VendeBot MVP - Dashboard Analytics API
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // En un entorno real, obtendríamos el businessId del token/sesión
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId') || 'demo-business-id';

    // Obtener estadísticas de los últimos 7 días
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Para MVP, generar datos de demostración
    const mockData = {
      totalMessages: Math.floor(Math.random() * 50) + 30,
      automaticResponses: Math.floor(Math.random() * 45) + 25,
      uniqueCustomers: Math.floor(Math.random() * 25) + 15,
      averageResponseTime: (Math.random() * 2 + 1).toFixed(1) + 's',
      responseRate: Math.floor(Math.random() * 15) + 85,
      
      topCategories: [
        { category: "Horarios", count: Math.floor(Math.random() * 10) + 10 },
        { category: "Productos", count: Math.floor(Math.random() * 8) + 8 },
        { category: "Precios", count: Math.floor(Math.random() * 6) + 5 },
        { category: "Ubicación", count: Math.floor(Math.random() * 5) + 4 },
        { category: "Envíos", count: Math.floor(Math.random() * 4) + 3 }
      ],
      
      recentMessages: [
        {
          id: '1',
          content: "Hola, ¿cuál es el horario de atención?",
          response: "¡Hola! 👋 Nuestro horario de atención es Lunes a Viernes de 9:00 a 19:00hrs y Sábados de 10:00 a 14:00hrs",
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          fromNumber: "+56912345678"
        },
        {
          id: '2',
          content: "¿Tienen stock del producto X?",
          response: "¡Hola! Para consultar stock disponible, cuéntame qué producto necesitas y te confirmo disponibilidad 📦",
          timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
          fromNumber: "+56987654321"
        },
        {
          id: '3',
          content: "¿Dónde están ubicados?",
          response: "📍 Estamos ubicados en [DIRECCION]. También puedes comprar online con despacho a domicilio!",
          timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
          fromNumber: "+56911111111"
        },
        {
          id: '4',
          content: "¿Cuánto cuesta el envío?",
          response: "Hacemos envíos a todo Chile 🚚 Santiago: 24-48hrs, Regiones: 2-5 días hábiles. ¿A qué ciudad sería?",
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          fromNumber: "+56922222222"
        }
      ],

      dailyStats: Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toISOString().split('T')[0],
          messages: Math.floor(Math.random() * 15) + 5,
          responses: Math.floor(Math.random() * 12) + 4
        };
      }),

      botStatus: {
        isActive: true,
        lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        uptime: "99.8%",
        messageQueue: 0
      }
    };

    // Agregar timestamps relativos
    mockData.recentMessages = mockData.recentMessages.map(msg => ({
      ...msg,
      timeAgo: getRelativeTime(new Date(msg.timestamp))
    }));

    return NextResponse.json({
      success: true,
      data: mockData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    return NextResponse.json(
      { error: 'Error fetching dashboard data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function para timestamps relativos
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Hace unos segundos';
  if (diffInMinutes === 1) return 'Hace 1 minuto';
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} minutos`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) return 'Hace 1 hora';
  if (diffInHours < 24) return `Hace ${diffInHours} horas`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Hace 1 día';
  return `Hace ${diffInDays} días`;
}
