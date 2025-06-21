'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function MetaConfigPage() {  const [config, setConfig] = useState({
    businessAccountId: '',
    accessToken: '',
    phoneNumberId: '',
    businessPhone: '+56979171217'  // Pre-filled con el número de Roff Studio
  });
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [result, setResult] = useState<any>(null);

  const handleValidate = async () => {
    if (!config.accessToken || !config.phoneNumberId) {
      alert('Por favor ingresa Access Token y Phone Number ID primero');
      return;
    }

    setValidating(true);
    setValidationResult(null);

    try {
      const response = await fetch('/api/business/validate-meta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: config.accessToken,
          phoneNumberId: config.phoneNumberId
        }),
      });

      const data = await response.json();
      setValidationResult(data);
    } catch (error) {
      console.error('Error:', error);
      setValidationResult({ 
        valid: false, 
        error: 'Error de conexión',
        details: 'No se pudo validar las credenciales'
      });
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/business/meta-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...config,
          webhookVerifyToken: 'vendebot_webhook_2025_secure_token',
          userId: 'demo-user-id' // En producción, obtener del session
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        alert('✅ ¡Meta WhatsApp Business configurado correctamente!');
      }
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📱 Configurar Meta WhatsApp Business
          </h1>
          <p className="text-xl text-gray-600">
            Conecta tu número de WhatsApp Business verificado con VendeBot
          </p>
        </div>

        {/* Instrucciones */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Antes de empezar</h2>
          <div className="space-y-4 text-lg text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✅</span>
              <span>Tu número de WhatsApp debe estar verificado en Meta Business Manager</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✅</span>
              <span>Debes tener una aplicación creada en Meta for Developers</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">📱</span>
              <span>Necesitas obtener las credenciales desde Meta Business Manager</span>
            </div>
          </div>
        </Card>

        {/* Formulario de Configuración */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🔑 Credenciales de Meta</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">            {/* Business Account ID */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                🏢 Business Account ID
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 123456789012345 (solo números)"
                value={config.businessAccountId}
                onChange={(e) => setConfig({...config, businessAccountId: e.target.value})}
              />
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-semibold">📍 ¿Dónde encontrarlo?</p>
                <ol className="text-blue-700 text-sm mt-1 space-y-1">
                  <li>1. Ve a <strong>business.facebook.com</strong></li>
                  <li>2. Clic en ⚙️ <strong>"Configuración de la empresa"</strong></li>
                  <li>3. Clic en <strong>"Información de la empresa"</strong></li>
                  <li>4. Copia el ID que aparece bajo el nombre</li>
                </ol>
              </div>
            </div>            {/* Access Token */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                🔑 Access Token (Permanente)
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: EAA... (empieza con EAA)"
                value={config.accessToken}
                onChange={(e) => setConfig({...config, accessToken: e.target.value})}
              />
              <div className="mt-2 p-3 bg-green-50 rounded-lg">
                <p className="text-green-800 font-semibold">📍 ¿Dónde encontrarlo?</p>
                <ol className="text-green-700 text-sm mt-1 space-y-1">
                  <li>1. Ve a <strong>developers.facebook.com</strong></li>
                  <li>2. Crea una app tipo <strong>"Empresa"</strong></li>
                  <li>3. Agrega <strong>"WhatsApp Business"</strong></li>
                  <li>4. Ve a <strong>"API Setup"</strong></li>
                  <li>5. Genera <strong>"Access Token Permanente"</strong></li>
                </ol>
                <p className="text-red-600 font-semibold mt-2">⚠️ ¡MANTÉN ESTE TOKEN SECRETO!</p>
              </div>
            </div>            {/* Phone Number ID */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                📱 Phone Number ID
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 987654321098765 (número largo)"
                value={config.phoneNumberId}
                onChange={(e) => setConfig({...config, phoneNumberId: e.target.value})}
              />
              <div className="mt-2 p-3 bg-purple-50 rounded-lg">
                <p className="text-purple-800 font-semibold">📍 ¿Dónde encontrarlo?</p>
                <ol className="text-purple-700 text-sm mt-1 space-y-1">
                  <li>1. En tu app de WhatsApp Business</li>
                  <li>2. Ve a <strong>"API Setup"</strong></li>
                  <li>3. Busca la sección <strong>"From"</strong></li>
                  <li>4. Copia el ID debajo de tu número de teléfono</li>
                </ol>
              </div>
            </div>

            {/* Business Phone */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                Número de WhatsApp Business
              </label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: +56912345678"
                value={config.businessPhone}
                onChange={(e) => setConfig({...config, businessPhone: e.target.value})}
              />
              <p className="text-gray-600 mt-1">
                📱 Tu número de WhatsApp verificado (incluye código de país)
              </p>
            </div>            {/* Botones de Acción */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                size="large"
                disabled={validating || !config.accessToken || !config.phoneNumberId}
                onClick={handleValidate}
                className="flex-1"
              >
                {validating ? '🔍 Validando...' : '🧪 Validar Credenciales'}
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                size="large"
                disabled={loading || validating}
                className="flex-1"
              >
                {loading ? '⏳ Configurando...' : '🚀 Configurar WhatsApp Business'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Resultado de Validación */}
        {validationResult && (
          <Card className="mt-6">
            {validationResult.valid ? (
              <div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                  ✅ ¡Credenciales Válidas!
                </h3>
                <div className="space-y-3">
                  {validationResult.phoneInfo && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800">📱 Información del Número:</h4>
                      <ul className="text-green-700 mt-2 space-y-1">
                        <li><strong>Número:</strong> {validationResult.phoneInfo.displayPhoneNumber}</li>
                        <li><strong>Nombre verificado:</strong> {validationResult.phoneInfo.verifiedName}</li>
                        <li><strong>ID:</strong> {validationResult.phoneInfo.id}</li>
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold text-green-800">🎯 Próximos pasos:</h4>
                    <ol className="list-decimal list-inside text-green-700 mt-2 space-y-1">
                      {validationResult.nextSteps?.map((step: string, index: number) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-red-800 mb-4">
                  ❌ Error de Validación
                </h3>
                <div className="space-y-3">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-700"><strong>Error:</strong> {validationResult.error}</p>
                    {validationResult.details && (
                      <p className="text-red-600 mt-1"><strong>Detalles:</strong> {validationResult.details}</p>
                    )}
                  </div>
                  
                  {validationResult.suggestions && (
                    <div>
                      <h4 className="font-semibold text-red-800">💡 Sugerencias:</h4>
                      <ul className="list-disc list-inside text-red-700 mt-2 space-y-1">
                        {validationResult.suggestions.map((suggestion: string, index: number) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Resultado de Configuración */}
        {result && (
          <Card className="mt-8">
            {result.success ? (
              <div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                  ✅ ¡Configuración Exitosa!
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      📋 Próximos pasos:
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700 mt-2">
                      {result.nextSteps?.map((step: string, index: number) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  
                  {result.webhookConfig && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-blue-900 mb-2">
                        🔗 Configuración del Webhook
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>URL:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{result.webhookConfig.url}</code>
                        </div>
                        <div>
                          <strong>Verify Token:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{result.webhookConfig.verifyToken}</code>
                        </div>
                        <div>
                          <strong>Fields:</strong> {result.webhookConfig.fields.join(', ')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-red-800 mb-4">
                  ❌ Error en la Configuración
                </h3>
                <p className="text-red-700">{result.error}</p>
              </div>
            )}
          </Card>
        )}        {/* Ayuda */}
        <Card className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">❓ Enlaces Directos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">🏢 Meta Business Manager</h4>
              <p className="text-gray-600 mb-3">Para obtener Business Account ID</p>
              <Button
                type="button"
                variant="secondary"
                size="medium"
                className="w-full"
                onClick={() => window.open('https://business.facebook.com', '_blank')}
              >
                🔗 Abrir Business Manager
              </Button>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">👨‍💻 Meta for Developers</h4>
              <p className="text-gray-600 mb-3">Para crear app y obtener tokens</p>
              <Button
                type="button"
                variant="secondary"
                size="medium"
                className="w-full"
                onClick={() => window.open('https://developers.facebook.com', '_blank')}
              >
                🔗 Abrir Developers
              </Button>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="text-lg font-semibold text-yellow-800 mb-2">📋 Orden recomendado:</h4>
            <ol className="list-decimal list-inside text-yellow-700 space-y-1">
              <li>Obtén <strong>Business Account ID</strong> desde Business Manager</li>
              <li>Crea app en Developers y obtén <strong>Access Token</strong></li>
              <li>Copia <strong>Phone Number ID</strong> desde la misma app</li>
              <li>Ingresa todo aquí y configura</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}
