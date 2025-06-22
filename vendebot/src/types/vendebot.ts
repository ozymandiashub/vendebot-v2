// VendeBot MVP - Type Definitions

export interface BusinessConfig {
  name: string;
  category: 'digital_products' | 'canva_accounts' | 'retail' | 'restaurant' | 'services' | 'other';
  products: string[];
  hours: BusinessHours;
  address?: string;
  customFAQs: FAQ[];
  greetingMessage?: string;
  fallbackMessage?: string;
  paymentMethods?: string[];
  deliveryInfo?: string;
}

export interface BusinessHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  open: string;  // "09:00"
  close: string; // "18:00"
  closed: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
  keywords: string[];
}

export interface WhatsAppMessage {
  From: string;      // Cliente WhatsApp number
  To: string;        // Virtual number del negocio
  Body: string;      // Mensaje del cliente
  MessageSid: string;
  AccountSid: string;
  NumSegments: string;
}

export interface MessageClassification {
  type: 'greeting' | 'hours' | 'products' | 'location' | 'delivery' | 'pricing' | 'payment' | 'canva_features' | 'support' | 'complex';
  confidence: number;
  keywords: string[];
}

export interface AnalyticsData {
  totalMessages: number;
  automaticResponses: number;
  responseRate: number;
  averageResponseTime: number;
  topCategories: { category: string; count: number; }[];
  dailyStats: { date: string; messages: number; }[];
}

export interface TwilioWebhookBody {
  ToCountry: string;
  ToState: string;
  SmsMessageSid: string;
  NumMedia: string;
  ToCity: string;
  FromZip: string;
  SmsSid: string;
  FromState: string;
  SmsStatus: string;
  FromCity: string;
  Body: string;
  FromCountry: string;
  To: string;
  ToZip: string;
  NumSegments: string;
  MessageSid: string;
  AccountSid: string;
  From: string;
  ApiVersion: string;
}

// Default FAQs for Canva Account Sales
export const DEFAULT_FAQS: Record<string, string> = {
  saludo: "¡Hola! 🎨 Bienvenido a **CanvaProCL**. Vendemos cuentas Canva Pro y Premium a los mejores precios de Chile. ¿En qué podemos ayudarte hoy?",

  precio: `💰 **Precios Canva Pro Chile 2025:**

🎨 **Canva Pro (1 año)**: $8.990 CLP
⭐ **Canva Teams (1 año)**: $12.990 CLP  
🎯 **Canva Premium (Lifetime)**: $19.990 CLP

✨ **Todos incluyen:**
• 100M+ elementos premium
• Fondo transparente
• Redimensionar diseños
• Almacenamiento ilimitado
• Magic Resize y más!

¿Cuál te interesa? 🤔`,

  productos: `🎨 **Catálogo Canva Disponible:**

1️⃣ **Canva Pro** - $8.990
   • Duración: 1 año completo
   • 100M+ recursos premium
   • Hasta 5 usuarios

2️⃣ **Canva Teams** - $12.990  
   • Duración: 1 año completo
   • Gestión de marca avanzada
   • Hasta 10 usuarios

3️⃣ **Canva Premium Lifetime** - $19.990
   • Acceso de por vida
   • Todos los beneficios Pro
   • Sin renovaciones

💳 **Formas de pago**: Transferencia, WebPay, Mercado Pago

¿Cuál prefieres? ✨`,

  canva_features: `✨ **¿Qué incluye Canva Pro?**

🎨 **Elementos Premium:**
• 100M+ fotos, videos y gráficos
• Plantillas exclusivas ilimitadas
• Efectos y filtros premium

�️ **Herramientas Avanzadas:**
• Fondo transparente (PNG)
• Magic Resize (cambiar tamaños)
• Paletas de colores personalizadas
• Subir fuentes propias

☁️ **Almacenamiento:**
• 1TB de almacenamiento en la nube
• Sincronización en todos tus dispositivos

¿Te interesa alguna característica específica? 🤔`,

  pago: `💳 **Formas de Pago Disponibles:**

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

¿Con cuál prefieres pagar? 🤔`,

  entrega: `🚀 **Proceso de Entrega:**

⏱️ **Tiempo**: 2-5 minutos después del pago
📧 **Método**: Por este mismo WhatsApp
📋 **Recibes**: Email y contraseña de tu cuenta

🔒 **Garantía**:
• Cuenta 100% funcional
• Soporte 30 días gratis
• Reemplazo si hay problemas

✅ **Activación**: Lista para usar al instante

¿Alguna duda sobre la entrega? 🤔`,

  soporte: `�️ **Soporte y Garantías:**

✅ **Garantía 30 días**:
• Si la cuenta presenta problemas
• Reemplazo inmediato sin costo
• Soporte técnico incluido

� **Canales de soporte**:
• WhatsApp (este mismo número)
• Respuesta en menos de 2 horas
• Lunes a Domingo 9:00 - 21:00

🔧 **Ayuda incluida**:
• Configuración inicial
• Tutoriales básicos de Canva
• Resolución de problemas

¿Necesitas ayuda con algo específico? 🤔`,

  horario: `🕐 **Horarios de Atención:**

📱 **WhatsApp Automático**: 24/7
👨‍💼 **Soporte Humano**: 
   • Lunes a Domingo: 9:00 - 21:00
   • Respuesta promedio: 2 horas

⚡ **Entregas Automáticas**: 
   • 24 horas al día
   • Procesamos pagos al instante

¿Tienes alguna consulta urgente? 🚀`,

  fuera_horario: `🌙 **Mensaje Automático - Fuera de Horario**

¡Gracias por tu interés en Canva Pro! 🎨

✅ Puedes hacer tu pedido ahora mismo
⚡ Las entregas son automáticas 24/7
� Procesar pago y recibir cuenta al instante

🕐 **Soporte humano**: Mañana 9:00 - 21:00

¿Quieres ver nuestros productos disponibles? 😊`
};

export interface UserSession {
  id: string;
  email: string;
  name: string;
  businessId?: string;
}

// Legacy interfaces (mantener compatibilidad)
export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Description {
  id: string;
  productId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatbotMessage {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}
