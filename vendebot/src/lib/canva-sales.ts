// VendeBot - Canva Sales Logic
import { BusinessConfig } from '@/types/vendebot';
import { createCanvaPaymentLink, generatePaymentMessage, getBankTransferInfo } from './mercadopago';

export interface CanvaProduct {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  description: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  instructions: string;
  isInstant: boolean;
}

// Catálogo de productos Canva disponibles
export const CANVA_PRODUCTS: CanvaProduct[] = [
  {
    id: 'canva-pro-1year',
    name: 'Canva Pro (1 año)',
    price: 8990,
    duration: '1 año completo',
    features: [
      '100M+ elementos premium',
      'Fondo transparente (PNG)',
      'Magic Resize',
      'Almacenamiento ilimitado',
      'Hasta 5 usuarios',
      'Plantillas exclusivas'
    ],
    description: 'Plan profesional completo con todas las herramientas premium de Canva'
  },
  {
    id: 'canva-teams-1year',
    name: 'Canva Teams (1 año)',
    price: 12990,
    duration: '1 año completo',
    features: [
      'Todas las funciones Pro',
      'Gestión de marca avanzada',
      'Hasta 10 usuarios',
      'Colaboración en equipo',
      'Control de permisos',
      'Analíticas avanzadas'
    ],
    description: 'Plan para equipos con herramientas de colaboración y gestión de marca'
  },
  {
    id: 'canva-premium-lifetime',
    name: 'Canva Premium Lifetime',
    price: 19990,
    duration: 'De por vida',
    features: [
      'Acceso lifetime sin renovaciones',
      'Todas las funciones Pro',
      'Actualizaciones gratuitas',
      'Sin límites de tiempo',
      'Soporte prioritario',
      'Garantía extendida'
    ],
    description: 'Acceso de por vida a Canva Pro sin necesidad de renovaciones'
  }
];

// Métodos de pago disponibles
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'transfer',
    name: 'Transferencia Bancaria',
    instructions: `🏦 **Datos para Transferencia:**

📋 **Banco**: Banco de Chile
👤 **Titular**: CanvaProCL
💳 **Cuenta Corriente**: 98765432-1
🆔 **RUT**: 12.345.678-9

⚡ **Importante**: Envía el comprobante por este WhatsApp para confirmación inmediata.`,
    isInstant: false
  },
  {
    id: 'webpay',
    name: 'WebPay (Tarjetas)',
    instructions: `💳 **Pago con WebPay:**

✅ Acepta todas las tarjetas
🔒 Pago 100% seguro
⚡ Confirmación automática

Te enviaré el link de pago ahora mismo. ¿Confirmas que quieres proceder?`,
    isInstant: true
  },
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    instructions: `🛒 **Pago con Mercado Pago:**

💳 Todas las tarjetas aceptadas
📱 Cuotas sin interés disponibles
⚡ Confirmación inmediata

Te genero el link de pago. ¿Procedemos?`,
    isInstant: true
  }
];

/**
 * Obtiene información de un producto Canva por ID
 */
export function getCanvaProduct(productId: string): CanvaProduct | null {
  return CANVA_PRODUCTS.find(product => product.id === productId) || null;
}

/**
 * Genera el catálogo de productos formateado
 */
export function generateProductCatalog(): string {
  let catalog = '🎨 **Catálogo Canva Pro Chile 2025:**\n\n';
  
  CANVA_PRODUCTS.forEach((product, index) => {
    catalog += `${index + 1}️⃣ **${product.name}** - $${product.price.toLocaleString()} CLP\n`;
    catalog += `   ⏱️ ${product.duration}\n`;
    catalog += `   ✨ ${product.features.slice(0, 3).join(', ')}\n\n`;
  });
  
  catalog += '💳 **Formas de pago**: Transferencia, WebPay, Mercado Pago\n';
  catalog += '⚡ **Entrega**: 2-5 minutos después del pago\n\n';
  catalog += '¿Cuál te interesa? Escribe el número 😊';
  
  return catalog;
}

/**
 * Genera información detallada de un producto
 */
export function generateProductDetails(product: CanvaProduct): string {
  let details = `🎨 **${product.name}**\n\n`;
  details += `💰 **Precio**: $${product.price.toLocaleString()} CLP\n`;
  details += `⏱️ **Duración**: ${product.duration}\n\n`;
  
  details += '✨ **Incluye:**\n';
  product.features.forEach(feature => {
    details += `• ${feature}\n`;
  });
  
  details += `\n📝 **Descripción**: ${product.description}\n\n`;
  details += '💳 **¿Cómo quieres pagar?**\n';
  details += '1️⃣ Transferencia Bancaria\n';
  details += '2️⃣ WebPay (Tarjetas)\n';
  details += '3️⃣ Mercado Pago\n\n';
  details += 'Escribe el número de tu método preferido 😊';
  
  return details;
}

/**
 * Genera instrucciones de pago
 */
export function generatePaymentInstructions(
  paymentMethodId: string, 
  product: CanvaProduct
): string {
  const paymentMethod = PAYMENT_METHODS.find(pm => pm.id === paymentMethodId);
  
  if (!paymentMethod) {
    return 'Método de pago no válido. Por favor selecciona: 1 (Transferencia), 2 (WebPay) o 3 (Mercado Pago)';
  }
  
  let instructions = `🎯 **Pedido Confirmado:**\n`;
  instructions += `🎨 Producto: ${product.name}\n`;
  instructions += `💰 Total: $${product.price.toLocaleString()} CLP\n\n`;
  instructions += paymentMethod.instructions + '\n\n';
  
  if (paymentMethod.isInstant) {
    instructions += '⚡ **Entrega**: Inmediata después de confirmar el pago\n';
  } else {
    instructions += '⚡ **Entrega**: 2-5 minutos después de enviar el comprobante\n';
  }
  
  instructions += '🛡️ **Garantía**: 30 días de soporte incluido\n\n';
  instructions += '¿Alguna duda antes de proceder? 😊';
  
  return instructions;
}

/**
 * Simula la entrega de una cuenta Canva (en producción, esto se conectaría con el sistema de inventario)
 */
export function generateAccountDelivery(product: CanvaProduct): string {
  // En producción, aquí se consultaría la base de datos de cuentas disponibles
  const mockEmail = `canva.user.${Date.now()}@gmail.com`;
  const mockPassword = `CanvaPro${Math.random().toString(36).substring(2, 8)}`;
  
  let delivery = '🎉 **¡Pago Confirmado! Tu cuenta Canva está lista:**\n\n';
  delivery += '📧 **Email**: ' + mockEmail + '\n';
  delivery += '🔑 **Contraseña**: ' + mockPassword + '\n\n';
  
  delivery += '🚀 **Instrucciones de acceso:**\n';
  delivery += '1️⃣ Ve a canva.com\n';
  delivery += '2️⃣ Haz clic en "Iniciar sesión"\n';
  delivery += '3️⃣ Ingresa el email y contraseña\n';
  delivery += '4️⃣ ¡Disfruta Canva Pro!\n\n';
  
  delivery += '⚠️ **Importante**:\n';
  delivery += '• No cambies la contraseña los primeros 7 días\n';
  delivery += '• Guarda estos datos en un lugar seguro\n';
  delivery += '• Soporte 30 días incluido\n\n';
  
  delivery += '✅ **Tu cuenta está activa y lista para usar**\n';
  delivery += '¿Necesitas ayuda con algo más? 😊';
  
  return delivery;
}

/**
 * Detecta si el usuario está en proceso de compra
 */
export function detectPurchaseIntent(message: string): {
  intent: 'browse' | 'product_selection' | 'payment_method' | 'purchase_confirmation' | 'none';
  productIndex?: number;
  paymentMethodIndex?: number;
} {
  const normalizedMessage = message.toLowerCase().trim();
  
  // Detectar selección de producto por número
  const productMatch = normalizedMessage.match(/^[123]$/);
  if (productMatch) {
    return {
      intent: 'product_selection',
      productIndex: parseInt(productMatch[0]) - 1
    };
  }
  
  // Detectar selección de método de pago
  const paymentMatch = normalizedMessage.match(/^[123]$/) && 
    (normalizedMessage.includes('pago') || 
     message.includes('transferencia') || 
     message.includes('webpay') || 
     message.includes('mercado'));
     
  if (paymentMatch) {
    return {
      intent: 'payment_method',
      paymentMethodIndex: parseInt(normalizedMessage) - 1
    };
  }
  
  // Detectar palabras clave de compra
  const purchaseKeywords = ['comprar', 'quiero', 'lo quiero', 'comprarlo', 'pagar', 'proceder'];
  const hasPurchaseIntent = purchaseKeywords.some(keyword => 
    normalizedMessage.includes(keyword)
  );
  
  if (hasPurchaseIntent) {
    return { intent: 'purchase_confirmation' };
  }
  
  return { intent: 'none' };
}

/**
 * Configuración por defecto para negocios de venta de Canva
 */
export function getDefaultCanvaBusinessConfig(): Partial<BusinessConfig> {
  return {
    name: 'CanvaProCL',
    category: 'canva_accounts',
    products: [
      'Canva Pro (1 año) - $8.990',
      'Canva Teams (1 año) - $12.990', 
      'Canva Premium Lifetime - $19.990'
    ],
    hours: {
      monday: { open: '09:00', close: '21:00', closed: false },
      tuesday: { open: '09:00', close: '21:00', closed: false },
      wednesday: { open: '09:00', close: '21:00', closed: false },
      thursday: { open: '09:00', close: '21:00', closed: false },
      friday: { open: '09:00', close: '21:00', closed: false },
      saturday: { open: '09:00', close: '21:00', closed: false },
      sunday: { open: '09:00', close: '21:00', closed: false }
    },
    paymentMethods: ['Transferencia Bancaria', 'WebPay', 'Mercado Pago'],
    deliveryInfo: 'Entrega inmediata por WhatsApp después del pago',
    customFAQs: [
      {
        question: '¿Cuánto dura Canva Pro?',
        answer: 'Canva Pro dura 1 año completo desde la activación. Canva Premium es de por vida.',
        keywords: ['dura', 'duración', 'tiempo', 'cuanto tiempo']
      },
      {
        question: '¿Las cuentas son originales?',
        answer: 'Sí, todas nuestras cuentas son 100% originales y funcionan perfectamente. Garantía 30 días.',
        keywords: ['originales', 'funcionan', 'verdaderas', 'legales']
      },
      {
        question: '¿Puedo cambiar la contraseña?',
        answer: 'Sí, pero te recomendamos esperar 7 días después de la entrega para mayor estabilidad de la cuenta.',
        keywords: ['cambiar', 'contraseña', 'password', 'modificar']
      }
    ]
  };
}

/**
 * Genera link de pago real con MercadoPago para productos Canva
 */
export async function generateRealPaymentLink(
  productSelection: string,
  customerPhone: string,
  customerName?: string
): Promise<string> {
    // Intentar crear link de MercadoPago
  const productIds = ['1', '2', '3'];
  if (!productIds.includes(productSelection)) {
    console.log('⚠️ Producto no válido para pago');
    return getBankTransferInfo();
  }
  
  const paymentResult = await createCanvaPaymentLink(productSelection, customerPhone, customerName);
  
  if (paymentResult.success && paymentResult.paymentUrl) {
    const productMap: Record<string, { name: string; price: number }> = {
      '1': { name: 'Canva Pro (1 año)', price: 8990 },
      '2': { name: 'Canva Teams (1 año)', price: 12990 },
      '3': { name: 'Canva Premium Lifetime', price: 19990 }
    };
    
    const product = productMap[productSelection];
    return generatePaymentMessage(
      product.name,
      product.price,
      paymentResult.paymentUrl,
      customerName
    );
  } else {
    console.log('⚠️ MercadoPago no disponible, mostrando transferencia bancaria');
    return getBankTransferInfo();
  }
}

/**
 * Procesa selección de método de pago con links reales
 */
export async function processPaymentMethodSelection(
  selection: string,
  previousContext: any = {},
  customerPhone: string = '',
  customerName?: string
): Promise<string> {
  
  // Si hay un producto seleccionado previamente y ahora selecciona método de pago
  if (previousContext.selectedProduct && ['1', '2', '3'].includes(selection)) {
    const methodMap: Record<string, string> = {
      '1': 'transferencia',
      '2': 'webpay', 
      '3': 'mercadopago'
    };
    
    const selectedMethod = methodMap[selection];
    
    if (selectedMethod === 'mercadopago') {
      return await generateRealPaymentLink(previousContext.selectedProduct, customerPhone, customerName);
    } else if (selectedMethod === 'transferencia') {
      return getBankTransferInfo();
    } else if (selectedMethod === 'webpay') {
      // Para WebPay también usar MercadoPago que soporta tarjetas
      return await generateRealPaymentLink(previousContext.selectedProduct, customerPhone, customerName);
    }
  }
  // Fallback a respuesta estática
  return `💳 **Formas de Pago Disponibles:**

🏦 **Transferencia Bancaria**
   • Banco de Chile
   • Confirmación inmediata

💰 **WebPay (Tarjetas)**
   • Débito y crédito
   • Pago seguro

🛒 **Mercado Pago**
   • Todas las tarjetas
   • Cuotas disponibles

⚡ **Entrega Inmediata**: Una vez confirmado el pago, recibes tu cuenta Canva en menos de 5 minutos.

¿Con cuál prefieres pagar? 🤔`;
}
