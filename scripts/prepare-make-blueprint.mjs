import fs from 'node:fs'
import path from 'node:path'

const [sourcePath, outputPath] = process.argv.slice(2)

if (!sourcePath || !outputPath) {
  throw new Error('Uso: node scripts/prepare-make-blueprint.mjs <origen.json> <salida.json>')
}

const blueprint = JSON.parse(fs.readFileSync(sourcePath, 'utf8'))
const clone = (value) => JSON.parse(JSON.stringify(value))

function replaceReferences(value) {
  if (typeof value === 'string') {
    return value
      .replaceAll('{{27.', '{{1.')
      .replaceAll('{{35.', '{{1.')
      .replaceAll('{{40.', '{{1.')
      .replaceAll('{{3.created_at}}', '{{1.submittedAt}}')
      .replaceAll('{{5.created_at}}', '{{1.submittedAt}}')
      .replaceAll('{{5.result}}', '{{1.requestLabel}}')
  }
  if (Array.isArray(value)) return value.map(replaceReferences)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, replaceReferences(child)]))
}

function setRouteFilter(route, name, requestType) {
  route.flow[0].filter = {
    name,
    conditions: [[{ a: '{{1.requestType}}', b: requestType, o: 'text:equal' }]],
  }
}

function addRequestIdToEmail(module) {
  if (!module?.mapper?.content || module.mapper.content.includes('ID de solicitud')) return
  module.mapper.content = `<p><strong>ID de solicitud:</strong> {{1.requestId}}</p>\n${module.mapper.content}`
}

function addRequestIdToGmail(module) {
  const content = module?.mapper?.contents?.[0]
  if (!content?.text || content.text.includes('ID de solicitud')) return
  content.text = `ID de solicitud: {{1.requestId}}\n\n${content.text}`
}

const webhook = clone(blueprint.flow.find(({ id }) => id === 1))
const originalRouter = blueprint.flow.find(({ id }) => id === 6)
const responseModel = clone(blueprint.flow.find(({ id }) => id === 5))

if (!webhook || !originalRouter || !responseModel) throw new Error('El blueprint no tiene la estructura esperada.')

const originalRoutes = originalRouter.routes
const getRoute = (name) => clone(originalRoutes.find((route) => route.flow[0]?.filter?.name === name))

const quoteRoute = replaceReferences(getRoute('COTIZACION_COMPLETA'))
quoteRoute.flow = quoteRoute.flow.filter(({ id }) => id !== 27)
setRouteFilter(quoteRoute, 'COTIZACIÓN DIRECTA', 'quote')
quoteRoute.flow.find(({ id }) => id === 69).mapper.row['17'] = '{{1.requestId}}'
quoteRoute.flow.find(({ id }) => id === 7).mapper.values['0'] = '{{1.submittedAt}}'
quoteRoute.flow.find(({ id }) => id === 7).mapper.values['1'] = '{{1.requestLabel}}'
quoteRoute.flow.find(({ id }) => id === 7).mapper.values['16'] = '{{1.requestId}}'
quoteRoute.flow.filter(({ module }) => module === 'microsoft-email:createAndSendAMessage').forEach(addRequestIdToEmail)
quoteRoute.flow.filter(({ module }) => module === 'google-email:sendAnEmail').forEach(addRequestIdToGmail)
quoteRoute.flow.find(({ id }) => id === 16).mapper.body = '{\n  "reply":"Gracias.\\n\\nTu solicitud de cotización fue recibida correctamente.\\n\\nNuestro equipo comercial revisará la información y se comunicará contigo muy pronto."\n}'

const complaintRoute = replaceReferences(getRoute('QUEJA_COMPLETA'))
complaintRoute.flow = complaintRoute.flow.filter(({ id }) => id !== 35)
setRouteFilter(complaintRoute, 'QUEJA DIRECTA', 'complaint')
const complaintExcel = complaintRoute.flow.find(({ id }) => id === 71)
complaintExcel.mapper.row['8'] = '{{1.orderNumber}}'
complaintExcel.mapper.row['9'] = ''
complaintExcel.mapper.row['11'] = '{{1.reason}}'
complaintExcel.mapper.row['17'] = '{{1.requestId}}'
const complaintSheet = complaintRoute.flow.find(({ id }) => id === 24)
complaintSheet.mapper.values['0'] = '{{1.submittedAt}}'
complaintSheet.mapper.values['1'] = '{{1.requestLabel}}'
complaintSheet.mapper.values['8'] = '{{1.orderNumber}}'
complaintSheet.mapper.values['9'] = ''
complaintSheet.mapper.values['10'] = '{{1.reason}}'
complaintSheet.mapper.values['16'] = '{{1.requestId}}'
complaintRoute.flow.filter(({ module }) => module === 'microsoft-email:createAndSendAMessage').forEach((module) => {
  addRequestIdToEmail(module)
  module.mapper.content = module.mapper.content.replaceAll('{{1.message}}', '{{1.reason}}')
})
complaintRoute.flow.filter(({ module }) => module === 'google-email:sendAnEmail').forEach((module) => {
  addRequestIdToGmail(module)
  module.mapper.contents[0].text = module.mapper.contents[0].text.replaceAll('{{1.message}}', '{{1.reason}}')
})
const complaintConfirmation = complaintRoute.flow.find(({ id }) => id === 81)
complaintConfirmation.mapper.content = '<p>Hola {{1.name}},</p>\n<p>Gracias por comunicarte con Productos Naval.</p>\n<p>Hemos recibido correctamente tu queja con el identificador <strong>{{1.requestId}}</strong>. El equipo de Servicio al Cliente revisará la información y se comunicará contigo muy pronto.</p>\n<p>Si tienes información adicional, podrás responder directamente a este correo.</p>\n<p>Servicio al Cliente<br>Productos Naval SAS</p>'
complaintRoute.flow.find(({ id }) => id === 26).mapper.body = '{\n  "reply":"Gracias por la información.\\n\\nHemos registrado correctamente tu caso.\\n\\nEl equipo de Servicio al Cliente se comunicará contigo muy pronto."\n}'

const trainingRoute = replaceReferences(getRoute('CAPACITACION_COMPLETA'))
trainingRoute.flow = trainingRoute.flow.filter(({ id }) => id !== 40)
setRouteFilter(trainingRoute, 'CAPACITACIÓN DIRECTA', 'training')
const trainingExcel = trainingRoute.flow.find(({ id }) => id === 74)
trainingExcel.mapper.row['8'] = '{{1.trainingTopic}}'
trainingExcel.mapper.row['9'] = 'Fecha: {{1.preferredDate}} | Horario: {{1.preferredTime}}'
trainingExcel.mapper.row['10'] = '{{1.attendees}}'
trainingExcel.mapper.row['11'] = '{{1.message}}'
trainingExcel.mapper.row['15'] = 'MEDIA'
trainingExcel.mapper.row['17'] = '{{1.requestId}}'
const trainingSheet = trainingRoute.flow.find(({ id }) => id === 44)
trainingSheet.mapper.values['0'] = '{{1.submittedAt}}'
trainingSheet.mapper.values['1'] = '{{1.requestLabel}}'
trainingSheet.mapper.values['8'] = '{{1.trainingTopic}}'
trainingSheet.mapper.values['9'] = 'Fecha: {{1.preferredDate}} | Horario: {{1.preferredTime}}'
trainingSheet.mapper.values['10'] = '{{1.attendees}}'
trainingSheet.mapper.values['11'] = '{{1.message}}'
trainingSheet.mapper.values['15'] = 'MEDIA'
trainingSheet.mapper.values['17'] = '{{1.requestId}}'
trainingRoute.flow.filter(({ module }) => module === 'microsoft-email:createAndSendAMessage').forEach((module) => {
  addRequestIdToEmail(module)
  module.mapper.content += '\n<p><strong>Tema:</strong> {{1.trainingTopic}}<br><strong>Fecha preferida:</strong> {{1.preferredDate}}<br><strong>Horario preferido:</strong> {{1.preferredTime}}<br><strong>Prioridad:</strong> MEDIA</p>'
})
trainingRoute.flow.filter(({ module }) => module === 'google-email:sendAnEmail').forEach((module) => {
  addRequestIdToGmail(module)
  module.mapper.contents[0].text += '\n\nTema: {{1.trainingTopic}}\nFecha preferida: {{1.preferredDate}}\nHorario preferido: {{1.preferredTime}}\nPrioridad: MEDIA'
})
const trainingConfirmation = trainingRoute.flow.find(({ id }) => id === 78)
trainingConfirmation.mapper.content = '<p>Hola {{1.name}},</p>\n<p>Gracias por tu interés en las capacitaciones de Productos Naval.</p>\n<p>Hemos recibido correctamente tu solicitud <strong>{{1.requestId}}</strong> sobre <strong>{{1.trainingTopic}}</strong>. Nuestro equipo se comunicará contigo muy pronto para confirmar la fecha, el horario y los detalles.</p>\n<p>Productos Naval SAS</p>'
trainingRoute.flow.find(({ id }) => id === 47).mapper.body = '{\n  "reply":"Gracias.\\n\\nHemos recibido correctamente tu solicitud de capacitación.\\n\\nNuestro equipo se comunicará contigo muy pronto para confirmar la fecha, el horario y los detalles."\n}'

const questionRoute = replaceReferences(getRoute('CONSULTA'))
responseModel.mapper.input = 'Eres el asesor comercial digital de Productos Naval. Tu objetivo es ayudar de verdad y conducir naturalmente hacia la compra de productos Naval. Responde preguntas simples de forma directa. Ante una necesidad de limpieza, recomienda una o varias opciones Naval incluidas en el contexto comercial, explica brevemente por qué y haz solo una pregunta útil para avanzar: superficie, suciedad, tamaño o frecuencia. Cuando tengas suficientes datos, recomienda una combinación y orienta presentaciones o una cantidad estimada usando únicamente dosificaciones y presentaciones publicadas; muestra los supuestos y aclara que el equipo comercial validará la cantidad final. Nunca conviertas metros cuadrados en cantidad de producto si no existe rendimiento por m² publicado, ni inventes frecuencia de reaplicación. Cuando falte ese dato, pide consumo actual, litros de solución preparada por jornada o deja la cantidad para validación comercial. No inventes compatibilidad, precios, disponibilidad, certificaciones, concentraciones, diluciones, cantidades ni tiempos de entrega. Solo afirma que un producto es compatible con una superficie cuando esa superficie aparece textualmente en su uso publicado o en su lista de superficies. Si no aparece, preséntalo únicamente como candidato condicionado a validar la ficha y hacer una prueba previa; nunca lo llames ideal o compatible. Nunca recomiendes mezclar productos químicos. Ofrece preparar una cotización después de orientar al cliente. Solo menciona WhatsApp si el cliente pide explícitamente hablar con una persona. No muestres ni describas el contexto interno. No uses Markdown, asteriscos ni tablas; usa títulos simples y viñetas, y haz máximo una pregunta de seguimiento.\n\nConversación y contexto comercial:\n{{1.conversationText}}'
responseModel.mapper.store = false
responseModel.mapper.max_output_tokens = '500'
responseModel.mapper.createConversation = false
responseModel.mapper.inputContentType = 'text'
questionRoute.flow = [responseModel, ...questionRoute.flow]
const questionResponse = questionRoute.flow.find(({ id }) => id === 30)
delete questionResponse.filter
questionResponse.mapper.body = '{\n  "reply": "{{5.result}}"\n}'
questionResponse.mapper.headers = [{ key: 'Content-Type', value: 'application/json' }]
setRouteFilter(questionRoute, 'CONSULTA CON OPENAI', 'question')

const humanRoute = replaceReferences(getRoute('HUMANO'))
humanRoute.flow.find(({ id }) => id === 4).mapper.body = '{\n  "reply":"Claro. Puedes hablar directamente con un asesor de Productos Naval por WhatsApp en el +57 320 342 8815."\n}'
setRouteFilter(humanRoute, 'ASESOR HUMANO', 'human')

const router = clone(originalRouter)
router.routes = [quoteRoute, complaintRoute, trainingRoute, questionRoute, humanRoute]
blueprint.name = 'Chatbot Naval - Flujo directo v2'
blueprint.flow = [webhook, router]
blueprint.metadata.notes = [
  'Cotización, queja y capacitación se enrutan directamente por requestType.',
  'OpenAI solo se ejecuta en consultas generales.',
  'Incluye requestId, descripción de queja y tema/fecha/horario de capacitación.',
]

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(blueprint, null, 2)}\n`)
