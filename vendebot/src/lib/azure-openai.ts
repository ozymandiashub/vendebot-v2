// VendeBot MVP - Azure OpenAI Integration
import { OpenAI } from 'openai';
import { BusinessConfig } from '@/types/vendebot';

// Initialize Azure OpenAI client (solo si está habilitado)
const openai = process.env.AZURE_OPENAI_ENABLED !== 'false' && process.env.AZURE_OPENAI_KEY ? 
  new OpenAI({
    apiKey: process.env.AZURE_OPENAI_KEY!,
    baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_MODEL}`,
    defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
    defaultHeaders: {
      'api-key': process.env.AZURE_OPENAI_KEY!,
    },
  }) : null;

/**
 * Genera una respuesta usando Azure OpenAI como fallback
 */
export async function generateAIResponse(
  message: string,
  businessConfig: BusinessConfig
): Promise<string> {
  // Verificar si Azure OpenAI está habilitado
  if (process.env.AZURE_OPENAI_ENABLED === 'false' || !process.env.AZURE_OPENAI_KEY || !process.env.AZURE_OPENAI_ENDPOINT) {
    console.log('🔄 Azure OpenAI deshabilitado, usando respuesta predeterminada');
    return `Gracias por tu mensaje. Un ejecutivo de ${businessConfig.name} te contactará pronto para ayudarte 👨‍💼`;
  }
  try {
    if (!openai) {
      throw new Error('Azure OpenAI client not initialized');
    }

    const systemPrompt = createSystemPrompt(businessConfig);
    
    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_MODEL!,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content?.trim();
    
    if (!response) {
      throw new Error('No response from AI');
    }

    return response;
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Fallback response if AI fails
    return `Gracias por tu mensaje. Un ejecutivo de ${businessConfig.name} te contactará pronto para ayudarte 👨‍💼`;
  }
}

/**
 * Crea el prompt del sistema para el contexto del negocio
 */
function createSystemPrompt(businessConfig: BusinessConfig): string {
  const products = businessConfig.products.join(', ');
  const address = businessConfig.address || 'dirección disponible en el negocio';
  
  return `Eres un asistente virtual de WhatsApp para ${businessConfig.name}, un negocio de ${businessConfig.category} en Chile.

INFORMACIÓN DEL NEGOCIO:
- Nombre: ${businessConfig.name}
- Categoría: ${businessConfig.category}
- Productos/Servicios: ${products}
- Dirección: ${address}

INSTRUCCIONES IMPORTANTES:
1. Responde SIEMPRE en español chileno, usando modismos locales cuando sea apropiado
2. Sé amigable, profesional y usa emojis moderadamente
3. Si no tienes información específica, deriva a un ejecutivo humano
4. Mantén respuestas cortas (máximo 2-3 líneas)
5. Para precios específicos, stock detallado o consultas complejas, deriva a humano
6. Usa "tú" en lugar de "usted" para ser más cercano
7. Menciona el nombre del negocio cuando sea relevante

EJEMPLOS DE RESPUESTAS:
- Para preguntas de stock: "Te confirmo stock de [producto] y te contacto altiro 📦"
- Para precios: "Te envío la cotización por WhatsApp en un momentito 💰"
- Para ubicación: "Estamos ubicados en ${address} 📍"

Responde de manera natural y útil, siempre derivando consultas específicas a un ejecutivo humano.`;
}

/**
 * Verifica si el mensaje requiere intervención humana
 */
export function requiresHumanIntervention(message: string): boolean {
  const complexPatterns = [
    /precio.*específico/i,
    /cotización/i,
    /descuento/i,
    /promoción/i,
    /garantía/i,
    /devolución/i,
    /reclamo/i,
    /problema/i,
    /no.*funciona/i,
    /defectuoso/i,
    /cambio/i,
  ];

  return complexPatterns.some(pattern => pattern.test(message));
}
