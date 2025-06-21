/**
 * VendeBot - Meta for Developers Configuration Script
 * 
 * Este script automatiza la configuración de Meta WhatsApp Business API
 * para el proyecto VendeBot MVP de Roff Studio.
 */

import { chromium } from 'playwright';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Cargar variables de entorno
config({ path: '.env.local' });

const META_CONFIG = {
  email: process.env.META_EMAIL || '',
  password: process.env.META_PASSWORD || '',
  businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '309325415606213',
  appName: 'VendeBot Roff Studio',
  webhookUrl: 'https://vendebot-roff-studio.netlify.app/api/chatbot/webhook',
  verifyToken: 'vendebot_verify_token_2024'
};

async function setupMetaWhatsApp() {
  console.log('🚀 Iniciando configuración automatizada de Meta WhatsApp Business API...');
  console.log('📋 Configuración:');
  console.log(`   - Nombre de App: ${META_CONFIG.appName}`);
  console.log(`   - Business Account ID: ${META_CONFIG.businessAccountId}`);
  console.log(`   - Webhook URL: ${META_CONFIG.webhookUrl}`);
  console.log(`   - Verify Token: ${META_CONFIG.verifyToken}`);
  
  // Crear directorio de screenshots si no existe
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ 
    headless: false, // Mostrar el navegador para interacción manual si es necesario
    slowMo: 1000 // Ralentizar para poder observar el proceso
  });
  
  const context = await browser.newContext({
    locale: 'es-CL',
    timezoneId: 'America/Santiago'
  });
  
  const page = await context.newPage();

  try {
    // Paso 1: Navegar a Meta for Developers
    console.log('📱 Navegando a Meta for Developers...');
    await page.goto('https://developers.facebook.com/apps/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, '01-meta-developers.png') });

    // Paso 2: Verificar si necesita login
    console.log('🔐 Verificando estado de autenticación...');
    const isLoggedIn = await page.locator('[data-testid="nav-header-profile-dropdown"]').isVisible();
    
    if (!isLoggedIn) {
      console.log('⚠️  No está logueado en Meta for Developers');
      console.log('📋 INSTRUCCIONES MANUALES:');
      console.log('   1. Inicia sesión manualmente en el navegador que se abrió');
      console.log('   2. Ve a https://developers.facebook.com/apps/');
      console.log('   3. Presiona ENTER en esta consola cuando hayas terminado el login');
      
      // Esperar input del usuario
      await new Promise(resolve => {
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        });
        readline.question('Presiona ENTER cuando hayas completado el login: ', () => {
          readline.close();
          resolve(null);
        });
      });
      
      await page.reload({ waitUntil: 'networkidle' });
    }

    await page.screenshot({ path: path.join(screenshotsDir, '02-logged-in.png') });

    // Paso 3: Buscar apps existentes o crear nueva
    console.log('🔍 Buscando apps existentes...');
    
    // Buscar si ya existe una app de VendeBot
    const existingApp = await page.locator(`text=${META_CONFIG.appName}`).first();
    
    if (await existingApp.isVisible()) {
      console.log('✅ App existente encontrada, accediendo...');
      await existingApp.click();
      await page.waitForLoadState('networkidle');
    } else {
      console.log('🆕 Creando nueva app...');
      
      // Buscar botón de crear app
      const createButton = await page.locator('text=Create App').or(page.locator('text=Crear aplicación')).first();
      
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForLoadState('networkidle');
        
        // Seleccionar tipo Business
        await page.locator('text=Business').click();
        await page.locator('text=Next').or(page.locator('text=Siguiente')).click();
        
        // Llenar formulario
        await page.locator('[name="name"]').fill(META_CONFIG.appName);
        await page.locator('[name="contact_email"]').fill('contacto@roffstudio.cl');
        
        await page.locator('text=Create app').or(page.locator('text=Crear aplicación')).click();
        await page.waitForLoadState('networkidle');
      }
    }

    await page.screenshot({ path: path.join(screenshotsDir, '03-app-dashboard.png') });

    // Paso 4: Configurar WhatsApp Business
    console.log('📞 Configurando WhatsApp Business...');
    
    // Buscar tarjeta de WhatsApp
    const whatsappCard = await page.locator('text=WhatsApp').first();
    if (await whatsappCard.isVisible()) {
      await whatsappCard.click();
      await page.waitForLoadState('networkidle');
    }

    // Buscar botón de configuración
    const setupButton = await page.locator('text=Set up').or(page.locator('text=Configurar')).first();
    if (await setupButton.isVisible()) {
      await setupButton.click();
      await page.waitForLoadState('networkidle');
    }

    await page.screenshot({ path: path.join(screenshotsDir, '04-whatsapp-config.png') });

    // Paso 5: Obtener credenciales
    console.log('🔑 Obteniendo credenciales...');
    
    let accessToken = null;
    let phoneNumberId = null;

    // Buscar Access Token
    try {
      const tokenElement = await page.locator('[data-testid="access-token-display"]').or(
        page.locator('input[readonly][value*="EAA"]')
      ).first();
      
      if (await tokenElement.isVisible()) {
        accessToken = await tokenElement.inputValue() || await tokenElement.textContent();
        console.log('✅ Access Token obtenido');
      }
    } catch (error) {
      console.log('⚠️  Access Token no encontrado automáticamente');
    }

    // Buscar Phone Number ID
    try {
      const phoneElement = await page.locator('[data-testid="phone-number-id"]').or(
        page.locator('code').filter({ hasText: /^\d{15,}$/ })
      ).first();
      
      if (await phoneElement.isVisible()) {
        phoneNumberId = await phoneElement.textContent();
        console.log('✅ Phone Number ID obtenido');
      }
    } catch (error) {
      console.log('⚠️  Phone Number ID no encontrado automáticamente');
    }

    await page.screenshot({ path: path.join(screenshotsDir, '05-credentials.png') });

    // Paso 6: Configurar Webhook
    console.log('🔗 Configurando Webhook...');
    
    try {
      // Buscar sección de Webhooks
      const webhookSection = await page.locator('text=Webhooks').first();
      if (await webhookSection.isVisible()) {
        await webhookSection.click();
        await page.waitForLoadState('networkidle');
        
        // Configurar webhook
        const callbackUrlInput = await page.locator('[name="callback_url"]').or(
          page.locator('input[placeholder*="webhook"]')
        ).first();
        
        if (await callbackUrlInput.isVisible()) {
          await callbackUrlInput.fill(META_CONFIG.webhookUrl);
          
          const verifyTokenInput = await page.locator('[name="verify_token"]').first();
          if (await verifyTokenInput.isVisible()) {
            await verifyTokenInput.fill(META_CONFIG.verifyToken);
          }
          
          // Suscribirse a eventos de mensajes
          const messagesCheckbox = await page.locator('input[type="checkbox"][value="messages"]').first();
          if (await messagesCheckbox.isVisible()) {
            await messagesCheckbox.check();
          }
          
          // Guardar configuración
          const saveButton = await page.locator('text=Save').or(page.locator('text=Guardar')).first();
          if (await saveButton.isVisible()) {
            await saveButton.click();
            await page.waitForLoadState('networkidle');
          }
        }
      }
    } catch (error) {
      console.log('⚠️  Configuración de webhook manual requerida');
    }

    await page.screenshot({ path: path.join(screenshotsDir, '06-webhook-config.png') });

    // Paso 7: Generar reporte
    const configReport = {
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      appName: META_CONFIG.appName,
      businessAccountId: META_CONFIG.businessAccountId,
      accessToken: accessToken || 'CONFIGURAR_MANUALMENTE',
      phoneNumberId: phoneNumberId || 'CONFIGURAR_MANUALMENTE',
      webhookUrl: META_CONFIG.webhookUrl,
      verifyToken: META_CONFIG.verifyToken,
      nextSteps: [
        'Copiar Access Token desde la interfaz de Meta',
        'Copiar Phone Number ID desde la sección de números',
        'Verificar que el webhook esté configurado correctamente',
        'Actualizar variables de entorno en .env.local'
      ]
    };

    console.log('📊 REPORTE DE CONFIGURACIÓN:');
    console.log(JSON.stringify(configReport, null, 2));

    // Guardar reporte
    fs.writeFileSync(path.join(__dirname, 'meta-config-report.json'), JSON.stringify(configReport, null, 2));

    // Generar archivo .env actualizado
    const envContent = `
# Meta WhatsApp Business API Configuration
WHATSAPP_ACCESS_TOKEN="${accessToken || 'ACTUALIZAR_DESDE_META_DEVELOPERS'}"
WHATSAPP_PHONE_NUMBER_ID="${phoneNumberId || 'ACTUALIZAR_DESDE_META_DEVELOPERS'}"
WHATSAPP_BUSINESS_ACCOUNT_ID="${META_CONFIG.businessAccountId}"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="${META_CONFIG.verifyToken}"

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
    `.trim();

    fs.writeFileSync(path.join(__dirname, '.env.local.updated'), envContent);

    console.log('✅ Configuración completada!');
    console.log('📄 Archivos generados:');
    console.log('   - meta-config-report.json');
    console.log('   - .env.local.updated');
    console.log('');
    console.log('📋 PRÓXIMOS PASOS:');
    console.log('   1. Copia los valores reales desde la interfaz de Meta');
    console.log('   2. Actualiza .env.local con las credenciales');
    console.log('   3. Ejecuta el test de webhook');
    console.log('   4. Despliega a producción');

    // Mantener el navegador abierto por un momento para inspección manual
    console.log('🔍 El navegador permanecerá abierto por 30 segundos para inspección manual...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
    await page.screenshot({ path: path.join(screenshotsDir, 'error.png') });
    
    // Generar reporte de error
    const errorReport = {
      timestamp: new Date().toISOString(),
      status: 'ERROR',
      error: typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error),
      businessAccountId: META_CONFIG.businessAccountId,
      manualSteps: [
        '1. Ve a https://developers.facebook.com/apps/',
        '2. Crea una nueva app de tipo Business',
        '3. Agrega WhatsApp Business Product',
        '4. Obtén Access Token desde API Setup',
        '5. Obtén Phone Number ID desde Phone Numbers', 
        '6. Configura Webhook URL: ' + META_CONFIG.webhookUrl,
        '7. Configura Verify Token: ' + META_CONFIG.verifyToken,
        '8. Suscríbete a eventos de mensajes'
      ]
    };
    
    fs.writeFileSync(path.join(__dirname, 'meta-config-error.json'), JSON.stringify(errorReport, null, 2));
    throw error;
  } finally {
    await browser.close();
  }
}

// Ejecutar configuración
if (require.main === module) {
  setupMetaWhatsApp().catch(console.error);
}

export { setupMetaWhatsApp };
