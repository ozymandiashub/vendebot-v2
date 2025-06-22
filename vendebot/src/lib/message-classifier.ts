// VendeBot MVP - Message Classification and Response Generation
import { BusinessConfig, MessageClassification, BusinessHours, DEFAULT_FAQS } from '@/types/vendebot';
import { 
  detectPurchaseIntent, 
  generateProductCatalog, 
  generateProductDetails,
  generatePaymentInstructions,
  generateAccountDelivery,
  CANVA_PRODUCTS,
  PAYMENT_METHODS
} from './canva-sales';

/**
 * Clasifica el tipo de mensaje recibido basado en palabras clave
 */
export function classifyMessage(message: string): MessageClassification {
  const normalizedMessage = message.toLowerCase().trim();
  
  // Patterns para diferentes tipos de consulta relacionadas con Canva
  const patterns = {
    greeting: {
      regex: /^(hola|hi|buenas|buenos días|buenas tardes|buenas noches|saludos|que tal)/,
      keywords: ['hola', 'buenas', 'saludos', 'que tal']
    },
    products: {
      regex: /(canva|pro|premium|teams|lifetime|cuenta|cuentas|planes|plan|producto|productos|catalogo|que tienen|que venden)/,
      keywords: ['canva', 'pro', 'premium', 'teams', 'cuenta', 'planes', 'catalogo']
    },
    pricing: {
      regex: /(precio|costo|valor|cuanto|cuánto|vale|cotizar|cotización|precios|barato)/,
      keywords: ['precio', 'costo', 'valor', 'cuanto', 'vale', 'barato']
    },
    canva_features: {
      regex: /(que incluye|funciones|características|beneficios|features|elementos|plantillas|fondo transparente|magic resize)/,
      keywords: ['incluye', 'funciones', 'características', 'beneficios', 'elementos', 'plantillas']
    },
    payment: {
      regex: /(pago|pagar|transferencia|webpay|mercado pago|tarjeta|como pago|forma de pago|métodos)/,
      keywords: ['pago', 'pagar', 'transferencia', 'webpay', 'mercado', 'tarjeta']
    },
    delivery: {
      regex: /(entrega|cuando llega|cuanto demora|envío|recibo|entregan|delivery|inmediato)/,
      keywords: ['entrega', 'llega', 'demora', 'envío', 'recibo', 'inmediato']
    },
    support: {
      regex: /(ayuda|soporte|garantía|problema|no funciona|error|ayúdame|consulta|duda)/,
      keywords: ['ayuda', 'soporte', 'garantía', 'problema', 'error', 'duda']
    },
    hours: {
      regex: /(horario|abierto|cerrado|atención|atienden|que hora|abren|cierran|horarios)/,
      keywords: ['horario', 'abierto', 'cerrado', 'atención', 'hora']
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
 * Formatea la lista de productos del negocio (específico para Canva)
 */
export function formatProductList(products: string[], businessConfig?: BusinessConfig): string {
  if (products.length === 0 || (businessConfig && businessConfig.category === 'canva_accounts')) {
    // Usar el catálogo especializado de Canva
    return generateProductCatalog();
  }

  let productList = '🎨 **Productos Canva Disponibles:**\n\n';
  products.forEach((product, index) => {
    productList += `${index + 1}. ${product}\n`;
  });
  
  productList += '\n💳 **Formas de pago**: Transferencia, WebPay, Mercado Pago\n';
  productList += '⚡ **Entrega**: Inmediata después del pago\n\n';
  productList += '¿Cuál te interesa? 🤔';
  
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
      .replace(/\[DIRECCION\]/g, businessConfig.address || 'venta online');
  };

  switch (messageType) {
    case 'greeting':
      return businessConfig.greetingMessage || 
        replacePlaceholders(DEFAULT_FAQS.saludo);
      case 'products':
      return formatProductList(businessConfig.products, businessConfig);
    
    case 'pricing':
      return DEFAULT_FAQS.precio;
    
    case 'canva_features':
      return DEFAULT_FAQS.canva_features;
    
    case 'payment':
      return DEFAULT_FAQS.pago;
    
    case 'delivery':
      return DEFAULT_FAQS.entrega;
    
    case 'support':
      return DEFAULT_FAQS.soporte;
    
    case 'hours':
      return formatBusinessHours(businessConfig.hours);
    
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
  // 1. Detectar intención de compra (específico para Canva)
  const purchaseIntent = detectPurchaseIntent(message);
  
  if (purchaseIntent.intent !== 'none') {
    return handlePurchaseFlow(message, purchaseIntent, businessConfig);
  }
  
  // 2. Buscar en FAQs personalizadas primero
  const customResponse = searchCustomFAQs(message, businessConfig);
  if (customResponse) {
    return customResponse;
  }
  
  // 3. Clasificar el mensaje
  const classification = classifyMessage(message);
  
  // 4. Verificar horario comercial para consultas complejas
  if (classification.type === 'complex') {
    if (isBusinessHours(businessConfig.hours)) {
      return "Un ejecutivo te contactará en breve para ayudarte con tu consulta 👨‍💼";
    } else {
      return DEFAULT_FAQS.fuera_horario;
    }
  }
  
  // 5. Generar respuesta personalizada
  return generatePersonalizedResponse(classification.type, businessConfig);
}

/**
 * Maneja el flujo de compra específico para Canva
 */
function handlePurchaseFlow(
  message: string,
  intent: any,
  businessConfig: BusinessConfig
): string {
  switch (intent.intent) {
    case 'product_selection':
      if (intent.productIndex !== undefined && intent.productIndex < CANVA_PRODUCTS.length) {
        const selectedProduct = CANVA_PRODUCTS[intent.productIndex];
        return generateProductDetails(selectedProduct);
      }
      return 'Por favor selecciona un número válido del catálogo (1, 2 o 3) 😊';
    
    case 'payment_method':
      if (intent.paymentMethodIndex !== undefined && intent.paymentMethodIndex < PAYMENT_METHODS.length) {
        // En una implementación real, necesitaríamos mantener el estado del producto seleccionado
        // Por ahora, usaremos el primer producto como ejemplo
        const paymentMethod = PAYMENT_METHODS[intent.paymentMethodIndex];
        const exampleProduct = CANVA_PRODUCTS[0]; // En producción, esto vendría del estado de la conversación
        return generatePaymentInstructions(paymentMethod.id, exampleProduct);
      }
      return 'Por favor selecciona un método de pago válido (1, 2 o 3) 😊';
    
    case 'purchase_confirmation':
      return generateProductCatalog();
    
    default:
      return generateProductCatalog();
  }
}
