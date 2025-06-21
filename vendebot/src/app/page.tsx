// VendeBot MVP - Landing Page
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">VendeBot</h1>
              <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">MVP</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="secondary">Ingresar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Nunca Pierdas Una Venta 
            <br />
            <span className="text-blue-600">Por WhatsApp</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            VendeBot responde automáticamente los mensajes de WhatsApp de tus clientes 
            24/7, aumentando tus ventas sin esfuerzo adicional.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/login">
              <Button size="large" className="w-full sm:w-auto">
                Empezar Gratis - $29.990/mes
              </Button>
            </Link>
            <Button variant="secondary" size="large" className="w-full sm:w-auto">
              Ver Demo en Vivo
            </Button>
          </div>

          {/* Demo Preview */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Demo: WhatsApp de Tu Negocio</h3>
              <p className="text-sm text-gray-600">Así responde VendeBot automáticamente</p>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Cliente Message */}
              <div className="flex justify-end">
                <div className="bg-green-500 text-white rounded-2xl px-4 py-2 max-w-xs">
                  <p>Hola! ¿Cuál es el horario de atención?</p>
                  <span className="text-xs opacity-75">14:30</span>
                </div>
              </div>
              
              {/* Bot Response */}
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2 max-w-xs">
                  <p>¡Hola! 👋 Nuestro horario de atención es Lunes a Viernes de 9:00 a 19:00hrs y Sábados de 10:00 a 14:00hrs</p>
                  <span className="text-xs text-gray-500">14:30 ✓✓</span>
                </div>
              </div>

              {/* Cliente Message */}
              <div className="flex justify-end">
                <div className="bg-green-500 text-white rounded-2xl px-4 py-2 max-w-xs">
                  <p>¿Tienen stock del producto X?</p>
                  <span className="text-xs opacity-75">14:31</span>
                </div>
              </div>
              
              {/* Bot Response */}
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2 max-w-xs">
                  <p>¡Hola! Para consultar stock disponible, cuéntame qué producto necesitas y te confirmo disponibilidad 📦</p>
                  <span className="text-xs text-gray-500">14:31 ✓✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por Qué Comerciantes Chilenos Eligen VendeBot?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Respuesta Instantánea</h3>
              <p className="text-gray-600">Responde en menos de 3 segundos, 24 horas al día, 7 días a la semana</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🇨🇱</div>
              <h3 className="text-xl font-semibold mb-2">Hecho para Chile</h3>
              <p className="text-gray-600">Entiende modismos chilenos y responde como un vendedor local</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Súper Fácil</h3>
              <p className="text-gray-600">Configuración en 5 minutos. Sin tecnicismos complicados</p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Precio Simple y Transparente</h2>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <div className="text-5xl font-bold text-blue-600 mb-2">$29.990</div>
            <div className="text-gray-600 mb-6">CLP por mes</div>
            
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Hasta 500 mensajes automáticos/mes
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Respuestas personalizadas de tu negocio
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Dashboard simple con estadísticas
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Soporte por WhatsApp en español
              </li>
            </ul>
            
            <Link href="/auth/login">
              <Button size="large" className="w-full">
                Empezar Ahora - Gratis 7 Días
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 VendeBot MVP. Hecho con ❤️ para comerciantes chilenos.</p>
        </div>
      </footer>
    </div>
  );
}