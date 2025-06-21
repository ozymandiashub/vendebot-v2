// VendeBot MVP - Message Classification and Response Generation
import { BusinessConfig, MessageClassification, BusinessHours, DEFAULT_FAQS } from '@/types/vendebot';

/**
 * Clasifica el tipo de mensaje recibido basado en palabras clave
 */
export function classifyMessage(message: string): MessageClassification {
  const normalizedMessage = message.toLowerCase().trim();
  
  // Patterns para diferentes tipos de consulta en español chileno
  const patterns = {
    greeting: {
      regex: /^(hola|hi|buenas|buenos días|buenas tardes|buenas noches|saludos|que tal)/,
      keywords: ['hola', 'buenas', 'saludos', 'que tal']
    },
    hours: {
      regex: /(horario|abierto|cerrado|atención|atienden|que hora|abren|cierran|horarios)/,
      keywords: ['horario', 'abierto', 'cerrado', 'atención', 'hora']
    },
    products: {
      regex: /(precio|costo|valor|producto|vende|stock|disponible|cuanto|catalogo|que tienen)/,
      keywords: ['precio', 'costo', 'producto', 'stock', 'disponible', 'catalogo']
    },
    location: {
      regex: /(dirección|ubicación|donde están|como llegar|direccion|ubicacion|donde quedan)/,
      keywords: ['dirección', 'ubicación', 'donde', 'llegar', 'direccion']
    },
    delivery: {
      regex: /(envío|despacho|delivery|entrega|envios|reparto|domicilio)/,
      keywords: ['envío', 'despacho', 'delivery', 'entrega', 'domicilio']
    }
  };

  // Buscar coincidencias
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.regex.test(normalizedMessage)) {
      const matchedKeywords = pattern.keywords.filter(keyword => 
        normalizedMessage.includes(keyword)
      );
      
      return {
        type: type as any,
        confidence: 0.8,
        keywords: matchedKeywords
      };
    }
  }

  // Si no coincide con patrones básicos, clasificar como complejo
  return {
    type: 'complex',
    confidence: 0.3,
    keywords: []
  };
}

/**
 * Verifica si está dentro del horario comercial
 */
export function isBusinessHours(hours: BusinessHours): boolean {
  const now = new Date();
  const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
  const currentTime = now.getHours() * 100 + now.getMinutes(); // HHMM format
  
  const daySchedule = hours[currentDay as keyof BusinessHours];
  
  if (daySchedule.closed) {
    return false;
  }
  
  const openTime = parseInt(daySchedule.open.replace(':', ''));
  const closeTime = parseInt(daySchedule.close.replace(':', ''));
  
  return currentTime >= openTime && currentTime <= closeTime;
}

/**
 * Formatea los horarios de atención para mostrar al cliente
 */
export function formatBusinessHours(hours: BusinessHours): string {
  const days = {
    monday: 'Lunes',
    tuesday: 'Martes', 
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  let schedule = '🕐 **Horarios de Atención:**\n\n';
  
  Object.entries(hours).forEach(([day, time]) => {
    const dayName = days[day as keyof typeof days];
    if (time.closed) {
      schedule += `${dayName}: Cerrado\n`;
    } else {
      schedule += `${dayName}: ${time.open} - ${time.close}\n`;
    }
  });

  return schedule;
}

/**
 * Formatea la lista de productos del negocio
 */
export function formatProductList(products: string[]): string {
  if (products.length === 0) {
    return "¡Hola! Para consultar sobre nuestros productos disponibles, escríbeme qué necesitas 😊";
  }

  let productList = '📦 **Nuestros Productos:**\n\n';
  products.forEach((product, index) => {
    productList += `${index + 1}. ${product}\n`;
  });
  
  productList += '\n¿Sobre cuál te gustaría saber más? 🤔';
  
  return productList;
}

/**
 * Genera respuesta personalizada para el negocio
 */
export function generatePersonalizedResponse(
  messageType: string,
  businessConfig: BusinessConfig
): string {
  // Reemplazar placeholders en las respuestas
  const replacePlaceholders = (text: string): string => {
    return text
      .replace(/\[NEGOCIO\]/g, businessConfig.name)
      .replace(/\[DIRECCION\]/g, businessConfig.address || 'consultar dirección');
  };

  switch (messageType) {
    case 'greeting':
      return businessConfig.greetingMessage || 
        replacePlaceholders(DEFAULT_FAQS.saludo);
    
    case 'hours':
      return formatBusinessHours(businessConfig.hours);
    
    case 'products':
      return formatProductList(businessConfig.products);
    
    case 'location':
      return replacePlaceholders(DEFAULT_FAQS.ubicacion);
    
    case 'delivery':
      return DEFAULT_FAQS.envio;
    
    default:
      return businessConfig.fallbackMessage || 
        "Gracias por tu mensaje. Un ejecutivo te contactará pronto para ayudarte 👨‍💼";
  }
}

/**
 * Busca en FAQs personalizadas del negocio
 */
export function searchCustomFAQs(message: string, businessConfig: BusinessConfig): string | null {
  const normalizedMessage = message.toLowerCase();
  
  for (const faq of businessConfig.customFAQs) {
    // Buscar coincidencias en keywords
    const hasKeywordMatch = faq.keywords.some(keyword => 
      normalizedMessage.includes(keyword.toLowerCase())
    );
    
    // Buscar coincidencias en la pregunta
    const questionWords = faq.question.toLowerCase().split(' ');
    const hasQuestionMatch = questionWords.some(word => 
      word.length > 3 && normalizedMessage.includes(word)
    );
    
    if (hasKeywordMatch || hasQuestionMatch) {
      return faq.answer;
    }
  }
  
  return null;
}

/**
 * Función principal para generar respuesta completa
 */
export async function generateResponse(
  message: string, 
  businessConfig: BusinessConfig
): Promise<string> {
  // 1. Buscar en FAQs personalizadas primero
  const customResponse = searchCustomFAQs(message, businessConfig);
  if (customResponse) {
    return customResponse;
  }
  
  // 2. Clasificar el mensaje
  const classification = classifyMessage(message);
  
  // 3. Verificar horario comercial para consultas complejas
  if (classification.type === 'complex') {
    if (isBusinessHours(businessConfig.hours)) {
      return "Un ejecutivo te contactará en breve para ayudarte con tu consulta 👨‍💼";
    } else {
      return DEFAULT_FAQS.fuera_horario;
    }
  }
  
  // 4. Generar respuesta personalizada
  return generatePersonalizedResponse(classification.type, businessConfig);
}
