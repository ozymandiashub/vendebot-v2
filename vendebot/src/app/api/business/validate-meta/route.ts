// VendeBot MVP - Validador de credenciales Meta WhatsApp Business
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { accessToken, phoneNumberId } = await req.json();

    if (!accessToken || !phoneNumberId) {
      return NextResponse.json(
        { error: 'Access Token y Phone Number ID son requeridos' },
        { status: 400 }
      );
    }

    // Validar credenciales con Meta API
    const metaApiUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}`;
    
    const response = await fetch(metaApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({
        valid: false,
        error: 'Credenciales inválidas',
        details: errorData.error?.message || 'Error desconocido',
        suggestions: [
          'Verifica que el Access Token sea permanente (no temporal)',
          'Confirma que el Phone Number ID sea correcto',
          'Asegúrate de que los permisos whatsapp_business_messaging estén activos'
        ]
      });
    }

    const phoneData = await response.json();
    
    return NextResponse.json({
      valid: true,
      message: '✅ Credenciales válidas',
      phoneInfo: {
        displayPhoneNumber: phoneData.display_phone_number,
        verifiedName: phoneData.verified_name,
        id: phoneData.id
      },
      nextSteps: [
        'Las credenciales son correctas',
        'Puedes proceder a configurar el webhook',
        'El bot está listo para recibir mensajes'
      ]
    });

  } catch (error) {
    console.error('Error validating Meta credentials:', error);
    return NextResponse.json(
      { 
        valid: false,
        error: 'Error de conexión', 
        details: 'No se pudo conectar con Meta API',
        suggestions: [
          'Verifica tu conexión a internet',
          'Confirma que las credenciales estén bien copiadas',
          'Intenta nuevamente en unos minutos'
        ]
      },
      { status: 500 }
    );
  }
}
