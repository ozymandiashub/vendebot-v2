"use strict";(()=>{var e={};e.id=695,e.ids=[695],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},33297:(e,o,a)=>{a.r(o),a.d(o,{originalPathname:()=>y,patchFetch:()=>b,requestAsyncStorage:()=>f,routeModule:()=>p,serverHooks:()=>g,staticGenerationAsyncStorage:()=>m});var r={};a.r(r),a.d(r,{GET:()=>l,POST:()=>d});var s=a(49303),t=a(88716),n=a(60670),i=a(87070),c=a(42657),u=a(72609);async function d(e){try{let{message:o,config:a}=await e.json();if(!o)return i.NextResponse.json({error:"Message is required"},{status:400});let r=a||{name:"Roff Studio",category:"software_development",products:["Desarrollo de Software","Aplicaciones Web","Apps M\xf3viles","Consultor\xeda Tecnol\xf3gica","Automatizaci\xf3n de Procesos","Integraci\xf3n de APIs"],address:"Santiago, Chile",hours:{monday:{open:"09:00",close:"18:00",closed:!1},tuesday:{open:"09:00",close:"18:00",closed:!1},wednesday:{open:"09:00",close:"18:00",closed:!1},thursday:{open:"09:00",close:"18:00",closed:!1},friday:{open:"09:00",close:"18:00",closed:!1},saturday:{open:"10:00",close:"14:00",closed:!1},sunday:{open:"00:00",close:"00:00",closed:!0}},customFAQs:[],greetingMessage:"\xa1Hola! Bienvenido a **Roff Studio**. Somos especialistas en desarrollo de software y soluciones tecnol\xf3gicas. \xbfEn qu\xe9 podemos ayudarte hoy?",fallbackMessage:"Gracias por tu consulta. Un especialista de Roff Studio te contactar\xe1 pronto para conversar sobre tu proyecto \uD83D\uDC68‍\uD83D\uDCBB"},s=await (0,c.oJ)(o,r),t=null;try{t=await (0,u.U)(o,r)}catch(e){console.log("AI response not available in test mode")}return i.NextResponse.json({success:!0,message:o,response:s,aiResponse:t,businessConfig:{name:r.name,category:r.category},timestamp:new Date().toISOString()})}catch(e){return console.error("Test endpoint error:",e),i.NextResponse.json({error:"Error testing chatbot",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}async function l(){return i.NextResponse.json({status:"VendeBot Test Endpoint Active",availableTests:["POST /api/chatbot/test - Test message processing"],sampleRequest:{message:"Hola, \xbfcu\xe1l es el horario de atenci\xf3n?",config:{name:"Mi Negocio",category:"retail"}}})}let p=new s.AppRouteRouteModule({definition:{kind:t.x.APP_ROUTE,page:"/api/chatbot/test/route",pathname:"/api/chatbot/test",filename:"route",bundlePath:"app/api/chatbot/test/route"},resolvedPagePath:"C:\\Users\\CODING\\Documents\\NEWERA\\VENDEBOT\\vendebot\\src\\app\\api\\chatbot\\test\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:f,staticGenerationAsyncStorage:m,serverHooks:g}=p,y="/api/chatbot/test/route";function b(){return(0,n.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:m})}},72609:(e,o,a)=>{async function r(e,o){return process.env.AZURE_OPENAI_ENABLED,console.log("\uD83D\uDD04 Azure OpenAI deshabilitado, usando respuesta predeterminada"),`Gracias por tu mensaje. Un ejecutivo de ${o.name} te contactar\xe1 pronto para ayudarte 👨‍💼`}function s(e){return[/precio.*específico/i,/cotización/i,/descuento/i,/promoción/i,/garantía/i,/devolución/i,/reclamo/i,/problema/i,/no.*funciona/i,/defectuoso/i,/cambio/i].some(o=>o.test(e))}a.d(o,{U:()=>r,Y:()=>s}),process.env.AZURE_OPENAI_ENABLED},42657:(e,o,a)=>{a.d(o,{oJ:()=>s});let r={horario:`🕐 **Horarios de Atenci\xf3n - Roff Studio:**

Lunes: 09:00 - 18:00
Martes: 09:00 - 18:00
Mi\xe9rcoles: 09:00 - 18:00
Jueves: 09:00 - 18:00
Viernes: 09:00 - 18:00
S\xe1bado: 10:00 - 14:00
Domingo: Cerrado

📞 Tambi\xe9n puedes llamarnos al +56 9 7917 1217`,precio:`💰 **Informaci\xf3n de Precios:**

Nuestros precios var\xedan seg\xfan:
• Complejidad del proyecto
• Tecnolog\xedas requeridas
• Tiempo de desarrollo
• Funcionalidades espec\xedficas

📞 Te invitamos a una consulta GRATUITA para cotizar tu proyecto.
\xa1Hablemos de tu idea!`,stock:`🎯 **Servicios de Roff Studio:**

• Desarrollo de Software
• Aplicaciones Web y M\xf3viles  
• Consultor\xeda Tecnol\xf3gica
• Automatizaci\xf3n de Procesos
• Integraci\xf3n de APIs
• Soluciones Personalizadas

💡 \xbfNecesitas algo espec\xedfico? \xa1Conversemos!`,envio:`🚀 **Entrega de Proyectos:**

• Desarrollo \xe1gil en sprints
• Entregas parciales cada 2 semanas  
• Testing y feedback continuo
• Deploy y puesta en producci\xf3n
• Soporte post-lanzamiento

⏱️ Tiempos estimados seg\xfan complejidad del proyecto.`,ubicacion:`📍 **Ubicaci\xf3n - Roff Studio:**

Trabajamos de forma remota y presencial en Santiago, Chile.

🚗 Nos desplazamos para reuniones importantes
💻 Reuniones online disponibles
📧 Contacto: info@roffstudio.com

\xbfPrefieres reuni\xf3n presencial o virtual?`,saludo:"\xa1Hola! \uD83D\uDC4B Bienvenido a **Roff Studio**. Somos especialistas en desarrollo de software y soluciones tecnol\xf3gicas. \xbfEn qu\xe9 podemos ayudarte hoy?",fuera_horario:`🌙 **Roff Studio - Fuera de horario**

Gracias por tu mensaje! Te responderemos ma\xf1ana en nuestro horario de atenci\xf3n.

🕐 Lunes a Viernes: 09:00 - 18:00
🕐 S\xe1bados: 10:00 - 14:00

\xa1Que tengas un buen d\xeda! 😊`};async function s(e,o){let a=function(e,o){let a=e.toLowerCase();for(let e of o.customFAQs){let o=e.keywords.some(e=>a.includes(e.toLowerCase())),r=e.question.toLowerCase().split(" ").some(e=>e.length>3&&a.includes(e));if(o||r)return e.answer}return null}(e,o);if(a)return a;let s=function(e){let o=e.toLowerCase().trim();for(let[e,a]of Object.entries({greeting:{regex:/^(hola|hi|buenas|buenos días|buenas tardes|buenas noches|saludos|que tal)/,keywords:["hola","buenas","saludos","que tal"]},hours:{regex:/(horario|abierto|cerrado|atención|atienden|que hora|abren|cierran|horarios)/,keywords:["horario","abierto","cerrado","atenci\xf3n","hora"]},products:{regex:/(precio|costo|valor|producto|vende|stock|disponible|cuanto|catalogo|que tienen)/,keywords:["precio","costo","producto","stock","disponible","catalogo"]},location:{regex:/(dirección|ubicación|donde están|como llegar|direccion|ubicacion|donde quedan)/,keywords:["direcci\xf3n","ubicaci\xf3n","donde","llegar","direccion"]},delivery:{regex:/(envío|despacho|delivery|entrega|envios|reparto|domicilio)/,keywords:["env\xedo","despacho","delivery","entrega","domicilio"]}}))if(a.regex.test(o))return{type:e,confidence:.8,keywords:a.keywords.filter(e=>o.includes(e))};return{type:"complex",confidence:.3,keywords:[]}}(e);return"complex"===s.type?!function(e){let o=new Date,a=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][o.getDay()],r=100*o.getHours()+o.getMinutes(),s=e[a];if(s.closed)return!1;let t=parseInt(s.open.replace(":","")),n=parseInt(s.close.replace(":",""));return r>=t&&r<=n}(o.hours)?r.fuera_horario:"Un ejecutivo te contactar\xe1 en breve para ayudarte con tu consulta \uD83D\uDC68‍\uD83D\uDCBC":function(e,o){let a=e=>e.replace(/\[NEGOCIO\]/g,o.name).replace(/\[DIRECCION\]/g,o.address||"consultar direcci\xf3n");switch(e){case"greeting":return o.greetingMessage||a(r.saludo);case"hours":return function(e){let o={monday:"Lunes",tuesday:"Martes",wednesday:"Mi\xe9rcoles",thursday:"Jueves",friday:"Viernes",saturday:"S\xe1bado",sunday:"Domingo"},a="\uD83D\uDD50 **Horarios de Atenci\xf3n:**\n\n";return Object.entries(e).forEach(([e,r])=>{let s=o[e];r.closed?a+=`${s}: Cerrado
`:a+=`${s}: ${r.open} - ${r.close}
`}),a}(o.hours);case"products":return function(e){if(0===e.length)return"\xa1Hola! Para consultar sobre nuestros productos disponibles, escr\xedbeme qu\xe9 necesitas \uD83D\uDE0A";let o="\uD83D\uDCE6 **Nuestros Productos:**\n\n";return e.forEach((e,a)=>{o+=`${a+1}. ${e}
`}),o+="\n\xbfSobre cu\xe1l te gustar\xeda saber m\xe1s? \uD83E\uDD14"}(o.products);case"location":return a(r.ubicacion);case"delivery":return r.envio;default:return o.fallbackMessage||"Gracias por tu mensaje. Un ejecutivo te contactar\xe1 pronto para ayudarte \uD83D\uDC68‍\uD83D\uDCBC"}}(s.type,o)}}};var o=require("../../../../webpack-runtime.js");o.C(e);var a=e=>o(o.s=e),r=o.X(0,[276,972],()=>a(33297));module.exports=r})();