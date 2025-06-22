// VendeBot MVP - Monitor de Estado de Verificación Meta WhatsApp Business
// Ejecutar con: node scripts/monitor-meta-verification.js

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || "EAGrdoMvLeqEBO2oN2l63Mp2abWi3TFWpZAfH4DuHbOZADN4GMEM5dyTbnQAhZBcN7T94T3m8gW9tdrZAXKUHR6rhZCmr3FnYRvMkZCoypbYVIr3DISapbkXE6w9C2y1HJh5Xcs2bmpzCzjtCMmA7pvEtXmlJ6sO3PX0U72AVBRbCk8fKC2V51rdKyxmpwENxyCOZBTLSK14nB0Bvfnm4KbpoRdFL7IyjtAztINPRP3DRGDRiXbhLIvKjS2gBHknNgZDZD";
const WHATSAPP_BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || "309325415606213";
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "680539538479058";

async function checkVerificationStatus() {
  const timestamp = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
  console.log(`\n🔍 Verificando estado de verificación - ${timestamp}`);
  console.log('📱 Número: +56 9 7917 1217');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Verificar el Phone Number específico
    const phoneResponse = await fetch(
      `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}?fields=id,display_phone_number,verified_name,quality_rating,status,name_status,code_verification_status&access_token=${WHATSAPP_ACCESS_TOKEN}`
    );
    
    if (phoneResponse.ok) {
      const phoneData = await phoneResponse.json();
      console.log('📋 ESTADO DEL NÚMERO:');
      console.log(`   📱 Display Phone: ${phoneData.display_phone_number || 'N/A'}`);
      console.log(`   ✅ Status: ${phoneData.status || 'N/A'}`);
      console.log(`   🏷️  Verified Name: ${phoneData.verified_name || 'N/A'}`);
      console.log(`   ⭐ Quality Rating: ${phoneData.quality_rating || 'N/A'}`);
      console.log(`   📝 Name Status: ${phoneData.name_status || 'N/A'}`);
      console.log(`   🔐 Code Verification: ${phoneData.code_verification_status || 'N/A'}`);
      
      // Analizar el estado
      if (phoneData.status === 'CONNECTED') {
        console.log('\n🎉 ¡VERIFICACIÓN APROBADA! El número está listo para usar.');
        console.log('🚀 Próximo paso: Ejecutar CHECKLIST_POST_VERIFICACION.md');
        return 'APPROVED';
      } else if (phoneData.status === 'PENDING') {
        console.log('\n⏳ Verificación aún pendiente. Documentos en revisión.');
        return 'PENDING';
      } else {
        console.log(`\n⚠️  Estado desconocido: ${phoneData.status}`);
        return 'UNKNOWN';
      }
    } else {
      const error = await phoneResponse.json();
      console.log('❌ Error obteniendo estado del número:');
      
      if (error.error?.code === 100) {
        console.log('   🔑 Token inválido o permisos insuficientes');
        console.log('   📋 Esto es normal mientras la cuenta esté pendiente');
      } else {
        console.log(`   📄 ${JSON.stringify(error, null, 2)}`);
      }
      return 'ERROR';
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return 'CONNECTION_ERROR';
  }
}

async function monitorContinuously() {
  console.log('🤖 VendeBot - Monitor de Verificación Meta WhatsApp Business');
  console.log('⏰ Verificando cada 30 minutos hasta que se apruebe...\n');

  let checkCount = 0;
  const maxChecks = 48; // 24 horas (48 * 30 min)

  while (checkCount < maxChecks) {
    checkCount++;
    
    const status = await checkVerificationStatus();
    
    if (status === 'APPROVED') {
      console.log('\n🎯 ¡LISTO! Tu cuenta WhatsApp Business ha sido verificada.');
      console.log('📋 Ejecuta ahora: CHECKLIST_POST_VERIFICACION.md');
      break;
    }
    
    if (checkCount < maxChecks) {
      console.log(`\n⏰ Próxima verificación en 30 minutos... (${checkCount}/${maxChecks})`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Esperar 30 minutos (1800000 ms)
      await new Promise(resolve => setTimeout(resolve, 1800000));
    }
  }

  if (checkCount >= maxChecks) {
    console.log('\n⏰ Tiempo de monitoreo completado (24 horas).');
    console.log('🔄 Ejecuta manualmente para seguir verificando.');
  }
}

// Función para verificación única
async function checkOnce() {
  const status = await checkVerificationStatus();
  
  if (status === 'APPROVED') {
    console.log('\n🎉 ¡PERFECTO! Continúa con CHECKLIST_POST_VERIFICACION.md');
  } else if (status === 'PENDING') {
    console.log('\n⏳ Sigue esperando. Puedes ejecutar este script nuevamente más tarde.');
  } else {
    console.log('\n🔄 Intenta nuevamente en unos minutos.');
  }
}

// Determinar modo de ejecución
const args = process.argv.slice(2);
const isMonitorMode = args.includes('--monitor') || args.includes('-m');

if (require.main === module) {
  if (isMonitorMode) {
    console.log('🔄 Modo monitor activado (verificación continua cada 30 min)');
    monitorContinuously();
  } else {
    console.log('📋 Modo verificación única');
    console.log('💡 Tip: Usa --monitor para verificación automática continua');
    checkOnce();
  }
}

module.exports = { checkVerificationStatus, checkOnce, monitorContinuously };
