// VendeBot MVP - Type Definitions

export interface BusinessConfig {
  name: string;
  category: 'retail' | 'restaurant' | 'services' | 'other';
  products: string[];
  hours: BusinessHours;
  address: string;
  customFAQs: FAQ[];
  greetingMessage?: string;
  fallbackMessage?: string;
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
  type: 'greeting' | 'hours' | 'products' | 'location' | 'delivery' | 'complex';
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

// Default FAQs for Roff Studio
export const DEFAULT_FAQS: Record<string, string> = {
  horario: `🕐 **Horarios de Atención - Roff Studio:**

Lunes: 09:00 - 18:00
Martes: 09:00 - 18:00
Miércoles: 09:00 - 18:00
Jueves: 09:00 - 18:00
Viernes: 09:00 - 18:00
Sábado: 10:00 - 14:00
Domingo: Cerrado

📞 También puedes llamarnos al +56 9 7917 1217`,

  precio: `💰 **Información de Precios:**

Nuestros precios varían según:
• Complejidad del proyecto
• Tecnologías requeridas
• Tiempo de desarrollo
• Funcionalidades específicas

📞 Te invitamos a una consulta GRATUITA para cotizar tu proyecto.
¡Hablemos de tu idea!`,

  stock: `🎯 **Servicios de Roff Studio:**

• Desarrollo de Software
• Aplicaciones Web y Móviles  
• Consultoría Tecnológica
• Automatización de Procesos
• Integración de APIs
• Soluciones Personalizadas

💡 ¿Necesitas algo específico? ¡Conversemos!`,

  envio: `🚀 **Entrega de Proyectos:**

• Desarrollo ágil en sprints
• Entregas parciales cada 2 semanas  
• Testing y feedback continuo
• Deploy y puesta en producción
• Soporte post-lanzamiento

⏱️ Tiempos estimados según complejidad del proyecto.`,

  ubicacion: `📍 **Ubicación - Roff Studio:**

Trabajamos de forma remota y presencial en Santiago, Chile.

🚗 Nos desplazamos para reuniones importantes
💻 Reuniones online disponibles
📧 Contacto: info@roffstudio.com

¿Prefieres reunión presencial o virtual?`,

  saludo: "¡Hola! 👋 Bienvenido a **Roff Studio**. Somos especialistas en desarrollo de software y soluciones tecnológicas. ¿En qué podemos ayudarte hoy?",

  fuera_horario: `🌙 **Roff Studio - Fuera de horario**

Gracias por tu mensaje! Te responderemos mañana en nuestro horario de atención.

🕐 Lunes a Viernes: 09:00 - 18:00
🕐 Sábados: 10:00 - 14:00

¡Que tengas un buen día! 😊`
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
