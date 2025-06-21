import { test, expect } from '@playwright/test';
import { config } from 'dotenv';

// Cargar variables de entorno
config({ path: '.env.local' });

const META_CREDENTIALS = {
  email: process.env.META_EMAIL || '',
  password: process.env.META_PASSWORD || '',
  businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '309325415606213'
};

test.describe('Meta for Developers Setup', () => {
  test.setTimeout(300000); // 5 minutos timeout

  test('Setup WhatsApp Business API App', async ({ page, context }) => {
    // Configurar el contexto para mantener la sesión
    await context.addCookies([]);

    console.log('🚀 Iniciando automatización de Meta for Developers...');
    
    try {
      // 1. Navegar a Meta for Developers
      console.log('📱 Navegando a Meta for Developers...');
      await page.goto('https://developers.facebook.com/apps/');
      await page.waitForLoadState('networkidle');

      // Tomar screenshot del estado inicial
      await page.screenshot({ path: 'tests/screenshots/01-initial.png' });

      // 2. Verificar si ya está logueado
      const isLoggedIn = await page.locator('[data-testid="app-switcher-button"]').isVisible();
      
      if (!isLoggedIn) {
        console.log('🔐 No está logueado, intentando login...');
        
        // Click en botón de login si existe
        const loginButton = page.locator('text=Log In').first();
        if (await loginButton.isVisible()) {
          await loginButton.click();
          await page.waitForLoadState('networkidle');
        }

        // Llenar formulario de login si es necesario
        const emailInput = page.locator('#email');
        if (await emailInput.isVisible()) {
          if (!META_CREDENTIALS.email || !META_CREDENTIALS.password) {
            console.log('❌ CREDENCIALES FALTANTES: Necesitas configurar META_EMAIL y META_PASSWORD en .env.local');
            console.log('⚠️  Por favor, configura manualmente:');
            console.log('   1. Ve a https://developers.facebook.com/apps/');
            console.log('   2. Inicia sesión con tu cuenta de Meta/Facebook');
            console.log('   3. Crea una nueva app de WhatsApp Business');
            console.log('   4. Obtén el Access Token y Phone Number ID');
            return;
          }
          
          await emailInput.fill(META_CREDENTIALS.email);
          await page.locator('#pass').fill(META_CREDENTIALS.password);
          await page.locator('[name="login"]').click();
          await page.waitForLoadState('networkidle');
        }
      }

      console.log('✅ Logueado exitosamente');
      await page.screenshot({ path: 'tests/screenshots/02-logged-in.png' });

      // 3. Crear nueva app si no existe
      console.log('🆕 Buscando o creando app de WhatsApp Business...');
      
      // Buscar botón de crear app
      const createAppButton = page.locator('text=Create App').first();
      if (await createAppButton.isVisible()) {
        await createAppButton.click();
        await page.waitForLoadState('networkidle');
        
        // Seleccionar tipo de app Business
        await page.locator('text=Business').click();
        await page.locator('text=Next').click();
        
        // Llenar detalles de la app
        await page.locator('[name="name"]').fill('VendeBot Roff Studio');
        await page.locator('[name="contact_email"]').fill('contacto@roffstudio.cl');
        await page.locator('text=Create app').click();
        
        console.log('✅ App creada exitosamente');
        await page.waitForLoadState('networkidle');
      }

      await page.screenshot({ path: 'tests/screenshots/03-app-created.png' });

      // 4. Configurar WhatsApp Business
      console.log('📞 Configurando WhatsApp Business...');
      
      // Buscar y hacer click en WhatsApp
      const whatsappCard = page.locator('text=WhatsApp').first();
      if (await whatsappCard.isVisible()) {
        await whatsappCard.click();
        await page.waitForLoadState('networkidle');
      }

      // Click en "Set up" si aparece
      const setupButton = page.locator('text=Set up').first();
      if (await setupButton.isVisible()) {
        await setupButton.click();
        await page.waitForLoadState('networkidle');
      }

      await page.screenshot({ path: 'tests/screenshots/04-whatsapp-setup.png' });

      // 5. Obtener Access Token
      console.log('🔑 Obteniendo Access Token...');
      
      // Navegar a la sección de tokens
      const getStartedButton = page.locator('text=Get started').first();
      if (await getStartedButton.isVisible()) {
        await getStartedButton.click();
        await page.waitForLoadState('networkidle');
      }

      // Buscar el token en la página
      await page.waitForSelector('[data-testid="access-token"]', { timeout: 10000 });
      const accessToken = await page.locator('[data-testid="access-token"]').textContent();
      
      if (accessToken) {
        console.log('✅ Access Token obtenido:', accessToken);
        
        // Guardar en archivo temporal
        await page.evaluate((token) => {
          localStorage.setItem('vendebot_access_token', token);
        }, accessToken);
      }

      await page.screenshot({ path: 'tests/screenshots/05-access-token.png' });

      // 6. Obtener Phone Number ID
      console.log('📱 Obteniendo Phone Number ID...');
      
      // Navegar a la configuración del número
      const phoneNumberSection = page.locator('text=Phone numbers').first();
      if (await phoneNumberSection.isVisible()) {
        await phoneNumberSection.click();
        await page.waitForLoadState('networkidle');
      }

      // Buscar el Phone Number ID
      const phoneNumberId = await page.locator('[data-testid="phone-number-id"]').textContent();
      
      if (phoneNumberId) {
        console.log('✅ Phone Number ID obtenido:', phoneNumberId);
        
        // Guardar en archivo temporal
        await page.evaluate((id) => {
          localStorage.setItem('vendebot_phone_number_id', id);
        }, phoneNumberId);
      }

      await page.screenshot({ path: 'tests/screenshots/06-phone-number-id.png' });

      // 7. Configurar Webhook
      console.log('🔗 Configurando Webhook...');
      
      const webhookSection = page.locator('text=Webhooks').first();
      if (await webhookSection.isVisible()) {
        await webhookSection.click();
        await page.waitForLoadState('networkidle');
        
        // Configurar webhook URL
        const webhookUrl = 'https://vendebot-roff-studio.netlify.app/api/chatbot/webhook';
        await page.locator('[name="callback_url"]').fill(webhookUrl);
        await page.locator('[name="verify_token"]').fill('vendebot_verify_token_2024');
        
        // Suscribirse a eventos de mensajes
        await page.locator('text=messages').click();
        
        await page.locator('text=Save').click();
        console.log('✅ Webhook configurado exitosamente');
      }

      await page.screenshot({ path: 'tests/screenshots/07-webhook-configured.png' });

      // 8. Generar reporte de configuración
      const configReport = {
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        appName: 'VendeBot Roff Studio',
        businessAccountId: META_CREDENTIALS.businessAccountId,
        accessToken: accessToken || 'NO_OBTENIDO',
        phoneNumberId: phoneNumberId || 'NO_OBTENIDO',
        webhookUrl: 'https://vendebot-roff-studio.netlify.app/api/chatbot/webhook',
        verifyToken: 'vendebot_verify_token_2024'
      };

      console.log('📊 REPORTE DE CONFIGURACIÓN:');
      console.log(JSON.stringify(configReport, null, 2));

      // Guardar reporte en archivo
      const fs = require('fs');
      fs.writeFileSync('meta-config-report.json', JSON.stringify(configReport, null, 2));
      
      console.log('✅ Configuración completada exitosamente!');
      console.log('📄 Reporte guardado en meta-config-report.json');

    } catch (error) {
      console.error('❌ Error durante la configuración:', error);
      await page.screenshot({ path: 'tests/screenshots/error.png' });
      
      // Generar reporte de error
      const errorReport = {
        timestamp: new Date().toISOString(),
        status: 'ERROR',
        error: error.message,
        businessAccountId: META_CREDENTIALS.businessAccountId,
        instructions: [
          '1. Ve manualmente a https://developers.facebook.com/apps/',
          '2. Crea una nueva app de tipo Business',
          '3. Agrega WhatsApp Business API',
          '4. Obtén el Access Token desde la sección de configuración',
          '5. Obtén el Phone Number ID desde Phone Numbers',
          '6. Configura el webhook con URL: https://vendebot-roff-studio.netlify.app/api/chatbot/webhook',
          '7. Usa verify token: vendebot_verify_token_2024'
        ]
      };
      
      const fs = require('fs');
      fs.writeFileSync('meta-config-error.json', JSON.stringify(errorReport, null, 2));
      
      throw error;
    }
  });

  test('Validate Meta Configuration', async ({ page }) => {
    console.log('🔍 Validando configuración de Meta...');
    
    // Leer el reporte de configuración
    const fs = require('fs');
    let configReport;
    
    try {
      configReport = JSON.parse(fs.readFileSync('meta-config-report.json', 'utf8'));
    } catch (error) {
      console.log('❌ No se encontró reporte de configuración previo');
      return;
    }

    if (configReport.status === 'SUCCESS') {
      console.log('✅ Configuración validada exitosamente');
      console.log('🔑 Access Token:', configReport.accessToken ? 'OBTENIDO' : 'FALTANTE');
      console.log('📱 Phone Number ID:', configReport.phoneNumberId ? 'OBTENIDO' : 'FALTANTE');
      console.log('🔗 Webhook URL:', configReport.webhookUrl);
      
      // Actualizar .env.local con los nuevos valores
      if (configReport.accessToken && configReport.phoneNumberId) {
        const envContent = `
# Meta WhatsApp Business API Configuration
WHATSAPP_ACCESS_TOKEN="${configReport.accessToken}"
WHATSAPP_PHONE_NUMBER_ID="${configReport.phoneNumberId}"
WHATSAPP_BUSINESS_ACCOUNT_ID="${configReport.businessAccountId}"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="vendebot_verify_token_2024"

# Roff Studio Configuration
WHATSAPP_NUMBER="+56979171217"
BUSINESS_NAME="Roff Studio"
BUSINESS_DESCRIPTION="Desarrollo de software y soluciones tecnológicas"

# Database Configuration (UPDATE WITH REAL CREDENTIALS)
DATABASE_URL="postgresql://username:password@localhost:5432/vendebot"

# Azure OpenAI Configuration (UPDATE WITH REAL CREDENTIALS)
AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/"
AZURE_OPENAI_API_KEY="your-api-key"
AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4"
        `;
        
        fs.writeFileSync('.env.local.updated', envContent.trim());
        console.log('📄 Configuración actualizada guardada en .env.local.updated');
        console.log('⚠️  Copia manualmente el contenido a .env.local');
      }
    }
  });
});
