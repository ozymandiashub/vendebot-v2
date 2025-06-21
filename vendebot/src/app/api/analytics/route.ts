// VendeBot MVP - Analytics Dashboard API (App Router)
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');
    const days = parseInt(searchParams.get('days') || '7');

    if (!businessId) {
      return NextResponse.json({ error: 'Business ID required' }, { status: 400 });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Obtener métricas principales
    const analytics = await prisma.analytics.findMany({
      where: {
        businessId,
        timestamp: {
          gte: startDate
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    // Calcular estadísticas
    const totalMessages = analytics.filter(a => a.messageType === 'received').length;
    const automaticResponses = analytics.filter(a => a.messageType === 'sent').length;
    const responseRate = totalMessages > 0 ? (automaticResponses / totalMessages) * 100 : 0;
    
    const responseTimes = analytics
      .filter(a => a.responseTime && a.responseTime > 0)
      .map(a => a.responseTime || 0);
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0;

    // Mensajes por categoría
    const categoryStats = analytics
      .filter(a => a.category && a.messageType === 'received')
      .reduce((acc, curr) => {
        const category = curr.category || 'other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryStats)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Mensajes por día
    const dailyStats = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const messagesOnDay = analytics.filter(a => {
        const analyticDate = a.timestamp.toISOString().split('T')[0];
        return analyticDate === dateStr && a.messageType === 'received';
      }).length;

      return {
        date: dateStr,
        messages: messagesOnDay
      };
    }).reverse();

    // Clientes únicos
    const uniqueClients = new Set(
      analytics
        .filter(a => a.fromNumber && a.messageType === 'received')
        .map(a => a.fromNumber)
    ).size;

    return NextResponse.json({
      success: true,
      analytics: {
        totalMessages,
        automaticResponses,
        responseRate: Math.round(responseRate),
        averageResponseTime: Math.round(averageResponseTime),
        uniqueClients,
        topCategories,
        dailyStats,
        period: `${days} días`
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
