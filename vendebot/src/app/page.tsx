// VendeBot MVP - Landing Page (Tu negocio personal de Canva)
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
              <h1 className="text-2xl font-bold text-gray-900">CanvaProCL</h1>
              <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Oficial</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://wa.me/56979171217?text=Hola!%20Quiero%20información%20sobre%20Canva%20Pro" 
                 target="_blank" 
                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            ¡Compra Canva Pro
            <br />
            <span className="text-blue-600">Al Mejor Precio!</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Cuentas Canva Pro originales con garantía. Entrega inmediata por WhatsApp.
            ¡El mejor precio de Chile para diseñadores y emprendedores!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="https://wa.me/56979171217?text=Hola!%20Quiero%20Canva%20Pro" target="_blank">
              <Button size="large" className="w-full sm:w-auto">
                Comprar por WhatsApp - Desde $8.990
              </Button>
            </a>
            <Button variant="secondary" size="large" className="w-full sm:w-auto">
              Ver Precios y Planes
            </Button>
          </div>

          {/* Demo Preview */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">¡Así de fácil es comprar!</h3>
              <p className="text-sm text-gray-600">Conversación real de compra por WhatsApp</p>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Cliente Message */}
              <div className="flex justify-end">
                <div className="bg-green-500 text-white rounded-2xl px-4 py-2 max-w-xs">
                  <p>Hola! ¿Cuánto cuesta Canva Pro?</p>
                  <span className="text-xs opacity-75">14:30</span>
                </div>
              </div>
              
              {/* Bot Response */}
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2 max-w-xs">
                  <p>¡Hola! 🎨 Canva Pro cuesta $8.990 y dura 1 año completo. Incluye 100M+ elementos premium, fondo transparente y todas las funciones pro ✨</p>
                  <span className="text-xs text-gray-500">14:30 ✓✓</span>
                </div>
              </div>

              {/* Cliente Message */}
              <div className="flex justify-end">
                <div className="bg-green-500 text-white rounded-2xl px-4 py-2 max-w-xs">
                  <p>Perfecto! ¿Cómo pago?</p>
                  <span className="text-xs opacity-75">14:31</span>
                </div>
              </div>
              
              {/* Bot Response */}
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2 max-w-xs">
                  <p>🚀 Puedes pagar por transferencia o WebPay. Te envío los datos ahora. Una vez confirmado, recibes tu cuenta al instante 💳</p>
                  <span className="text-xs text-gray-500">14:31 ✓✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por Qué Elegir Nuestras Cuentas Canva?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">100% Originales</h3>
              <p className="text-gray-600">Cuentas completamente legales y funcionales con garantía de 30 días</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Entrega Inmediata</h3>
              <p className="text-gray-600">Recibes tu cuenta en menos de 5 minutos por WhatsApp, listo para usar</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Mejor Precio</h3>
              <p className="text-gray-600">El precio más competitivo de Chile con soporte incluido</p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Planes Disponibles</h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Canva Pro */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">$8.990</div>
              <div className="text-gray-600 mb-4">Canva Pro (1 año)</div>
              
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  100M+ elementos premium
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  Fondo transparente
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  Magic Resize
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  Hasta 5 usuarios
                </li>
              </ul>
              
              <a href="https://wa.me/56979171217?text=Quiero%20Canva%20Pro%20por%20$8990" target="_blank">
                <Button className="w-full">
                  Comprar Ahora
                </Button>
              </a>
            </div>

            {/* Canva Teams */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">Más Popular</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">$12.990</div>
              <div className="text-gray-600 mb-4">Canva Teams (1 año)</div>
              
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  Todo lo de Pro
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  Hasta 10 usuarios
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  Gestión de marca
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  Colaboración avanzada
                </li>
              </ul>
              
              <a href="https://wa.me/56979171217?text=Quiero%20Canva%20Teams%20por%20$12990" target="_blank">
                <Button className="w-full">
                  Comprar Ahora
                </Button>
              </a>
            </div>

            {/* Canva Premium Lifetime */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">$19.990</div>
              <div className="text-gray-600 mb-4">Canva Premium (Lifetime)</div>
              
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  Acceso de por vida
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  Sin renovaciones
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  Todas las funciones Pro
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  Actualizaciones gratis
                </li>
              </ul>
              
              <a href="https://wa.me/56979171217?text=Quiero%20Canva%20Premium%20Lifetime%20por%20$19990" target="_blank">
                <Button className="w-full">
                  Comprar Ahora
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Preguntas Frecuentes</h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">¿Las cuentas son originales?</h3>
              <p className="text-gray-600">Sí, todas nuestras cuentas son 100% originales y completamente funcionales.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">¿Cuánto tiempo demora la entrega?</h3>
              <p className="text-gray-600">La entrega es inmediata, recibes tu cuenta en menos de 5 minutos por WhatsApp.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">¿Qué garantía tienen?</h3>
              <p className="text-gray-600">Ofrecemos garantía de 30 días. Si hay problemas, reemplazamos la cuenta gratis.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-lg mb-2">¿Qué métodos de pago aceptan?</h3>
              <p className="text-gray-600">Transferencia bancaria, WebPay y Mercado Pago. Todos con confirmación rápida.</p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="mt-20 text-center bg-blue-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">¿Listo para empezar con Canva Pro?</h2>
          <p className="text-xl mb-6">Únete a más de 1000+ diseñadores satisfechos</p>
          
          <a href="https://wa.me/56979171217?text=Hola!%20Quiero%20comprar%20Canva%20Pro" target="_blank">
            <Button size="large" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Comprar Ahora por WhatsApp 🚀
            </Button>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 CanvaProCL. Tu tienda de confianza para cuentas Canva originales 🎨</p>
          <p className="mt-2 text-gray-400">WhatsApp: +56 9 7917 1217</p>
        </div>
      </footer>
    </div>
  );
}