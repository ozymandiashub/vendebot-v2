// VendeBot MVP - Dashboard Principal (Boomer-friendly)
'use client';

import { useState, useEffect } from 'react';
import { Card, MetricCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardData {
  totalMessages: number;
  automaticResponses: number;
  responseRate: number;
  averageResponseTime: number;
  uniqueClients: number;
  topCategories: { category: string; count: number; }[];
  dailyStats: { date: string; messages: number; }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState('Mi Negocio');

  useEffect(() => {
    // Simular datos para demostración
    // En producción, esto vendría de la API
    setTimeout(() => {
      setData({
        totalMessages: 47,
        automaticResponses: 41,
        responseRate: 87,
        averageResponseTime: 2100,
        uniqueClients: 23,
        topCategories: [
          { category: 'horarios', count: 12 },
          { category: 'productos', count: 8 },
          { category: 'ubicacion', count: 6 },
          { category: 'precios', count: 5 }
        ],
        dailyStats: [
          { date: '2025-06-14', messages: 5 },
          { date: '2025-06-15', messages: 8 },
          { date: '2025-06-16', messages: 12 },
          { date: '2025-06-17', messages: 7 },
          { date: '2025-06-18', messages: 9 },
          { date: '2025-06-19', messages: 6 },
          { date: '2025-06-20', messages: 0 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-4xl text-gray-400 mb-4">⏳</div>
            <h2 className="text-2xl font-semibold text-gray-600">Cargando tu dashboard...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Dashboard de {businessName}</h1>
              <p className="text-xl text-gray-600 mt-2">Resumen de tu bot de WhatsApp</p>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="secondary" 
                size="medium"
                onClick={() => window.location.href = '/dashboard/meta-config'}
              >
                📱 Configurar WhatsApp
              </Button>
              <Button variant="primary" size="medium">
                📊 Ver Mensajes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Métricas Principales */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">📈 Estadísticas de Hoy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Mensajes Recibidos"
              value={data?.totalMessages || 0}
              trend="Últimas 24 horas"
              icon="💬"
              color="blue"
            />
            <MetricCard
              title="Respuestas Automáticas"
              value={`${data?.responseRate || 0}%`}
              trend={`${data?.automaticResponses || 0} de ${data?.totalMessages || 0}`}
              icon="🤖"
              color="green"
            />
            <MetricCard
              title="Clientes Únicos"
              value={data?.uniqueClients || 0}
              trend="Esta semana"
              icon="👥"
              color="yellow"
            />
            <MetricCard
              title="Tiempo de Respuesta"
              value={`${Math.round((data?.averageResponseTime || 0) / 1000)}s`}
              trend="Promedio"
              icon="⚡"
              color="blue"
            />
          </div>
        </section>

        {/* Estado del Bot */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">🟢 Estado del Bot</h2>
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">Bot Activo</h3>
                  <p className="text-lg text-gray-600">Respondiendo mensajes automáticamente</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="secondary" size="medium">
                  🧪 Probar Bot
                </Button>
                <Button variant="danger" size="medium">
                  ⏸️ Pausar
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Acciones Rápidas */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">⚡ Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">WhatsApp Business</h3>
              <p className="text-lg text-gray-600 mb-4">Conecta tu número verificado de Meta</p>
              <Button 
                variant="primary" 
                size="medium" 
                className="w-full"
                onClick={() => window.location.href = '/dashboard/meta-config'}
              >
                Configurar
              </Button>
            </Card>
            
            <Card className="text-center">
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Configurar Respuestas</h3>
              <p className="text-lg text-gray-600 mb-4">Personaliza las respuestas automáticas de tu bot</p>
              <Button variant="primary" size="medium" className="w-full">
                Configurar
              </Button>
            </Card>
            
            <Card className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Ver Analytics</h3>
              <p className="text-lg text-gray-600 mb-4">Analiza el comportamiento de tus clientes</p>
              <Button variant="primary" size="medium" className="w-full">
                Ver Reportes
              </Button>
            </Card>
            
            <Card className="text-center">
              <div className="text-5xl mb-4">🧪</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Probar Bot</h3>
              <p className="text-lg text-gray-600 mb-4">Envía mensajes de prueba para verificar respuestas</p>
              <Button variant="secondary" size="medium" className="w-full">
                Probar Ahora
              </Button>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}