import assert from 'node:assert/strict'
import test from 'node:test'

import handler, {
  buildOfflineReply,
  extractOpenAIReply,
  extractWebhookReply,
  getSafeConversation,
} from '../api/make-webhook.js'
import {
  buildProductAssistantCatalog,
  findAssistantProduct,
  getProductAssistantResponse,
  getProductRecommendationResponse,
} from '../src/data/productAssistantCatalog.js'
import {
  extractDailySolutionLiters,
  extractOperationSize,
  extractTrainingDate,
  extractTrainingTime,
  extractUsageFrequency,
  hasProductPackageQuantity,
  isAffirmativeAnswer,
  isAmbiguousProductInterest,
  isGenericProductReference,
  isDeliveryInformationRequest,
  isValidAttendeeAnswer,
  isValidAddressAnswer,
  isValidCityAnswer,
  parseDilutionMlPerLiter,
  parsePresentationMilliliters,
  wantsQuantityHelp,
} from '../src/data/chatbotWorkflow.js'
import {
  extractDeliverySubtotal,
  getDeliveryAssistantResponse,
  shouldContinueDeliveryInquiry,
} from '../src/data/deliveryAssistant.js'

const catalog = buildProductAssistantCatalog([
  {
    family: { eyebrow: 'Cocinas' },
    product: {
      name: 'Desengrasante',
      slug: 'productos/desengrasante',
      summary: 'Elimina grasa pesada en cocinas y superficies lavables.',
      dilution: 'Limpieza media: 10 ml por 1 L de agua. Limpieza profunda: 50 ml por 1 L de agua.',
      safetySummary: 'Usar guantes y no mezclar con otros productos.',
      presentations: ['500 cc', '3.800 cc'],
      technicalSheetHref: '/desengrasante-tecnica.pdf',
      safetySheetHref: '/desengrasante-seguridad.pdf',
    },
  },
  {
    family: { eyebrow: 'Cocinas' },
    product: {
      name: 'Detergente Multicocina',
      slug: 'productos/multicocina',
      summary: 'Detergente concentrado para cocinas.',
      dilution: ['50 ml por 1 L de agua.'],
      presentations: ['1.900 cc'],
    },
  },
  {
    family: { eyebrow: 'Desinfección' },
    product: {
      name: 'Limpiador Desinfectante',
      slug: 'productos/limpiador-desinfectante',
      summary: 'Limpia y desinfecta superficies lavables.',
      presentations: ['1.900 cc'],
    },
  },
  {
    family: { eyebrow: 'Multiusos' },
    product: {
      name: 'Detergente Limpiador Multiusos',
      slug: 'productos/detergente-limpiador-multiusos',
      summary: 'Limpieza diaria de superficies lavables.',
      presentations: ['3.800 cc'],
    },
  },
  {
    family: { eyebrow: 'Pisos y superficies' },
    product: {
      name: 'Cera Polimérica',
      slug: 'productos/cera-polimerica',
      summary: 'Protege y da brillo a mármol sellado y otros pisos compatibles.',
      presentations: ['3.800 cc'],
    },
  },
  {
    family: { eyebrow: 'Pisos y superficies' },
    product: {
      name: 'Sellador de Superficies',
      slug: 'productos/sellador-de-superficies',
      summary: 'Protección para pisos porosos y lisos.',
      presentations: ['3.800 cc'],
    },
  },
])

test('encuentra productos aunque el cliente cometa errores de escritura', () => {
  assert.equal(findAssistantProduct('necesito el desengrasnte', catalog)?.name, 'Desengrasante')
})

test('no confunde el estado sellado con el producto sellador', () => {
  assert.equal(findAssistantProduct('sí, el piso está sellado', catalog), null)
})

test('responde dosificaciones con datos del catálogo y una advertencia segura', () => {
  const response = getProductAssistantResponse('¿Cómo diluyo el desengrasante?', catalog)
  assert.match(response.text, /10 ml por 1 L de agua/)
  assert.match(response.text, /• Limpieza media:[^\n]+\n• Limpieza profunda:/)
  assert.match(response.text, /No mezcles productos químicos/)
  assert.equal(response.actions[0].label, 'Ver ficha técnica')
})

test('recomienda productos por la necesidad expresada en lenguaje natural', () => {
  const response = getProductRecommendationResponse('¿Qué producto recomiendan para quitar grasa de una cocina?', catalog)
  assert.match(response.text, /Desengrasante/)
  assert.match(response.text, /Detergente Multicocina/)
})

test('entiende que lavar un baño es una solicitud de recomendación', () => {
  const response = getProductRecommendationResponse('necesito lavar un baño', catalog)
  assert.match(response.text, /Limpiador Desinfectante/)
  assert.match(response.text, /Detergente Limpiador Multiusos/)
  assert.match(response.text, /limpieza diaria, desinfección o remover sarro/i)
})

test('convierte una consulta sobre mármol en asesoría comercial segura', () => {
  const response = getProductRecommendationResponse('¿Cómo limpio un piso de mármol?', catalog)
  assert.match(response.text, /Cera Polimérica/)
  assert.match(response.text, /mármol sellado/i)
  assert.match(response.text, /¿el mármol está sellado/i)
})

test('separa el tamaño de la operación de una cantidad de compra', () => {
  const message = 'tengo un restaurante y necesito limpiar 10 mesas diario'
  assert.equal(extractOperationSize(message), '10 mesas')
  assert.equal(extractUsageFrequency(message), 'diario')
  assert.equal(hasProductPackageQuantity(message), false)
})

test('reconoce que el cliente pide ayuda con la cantidad y no informa una ciudad', () => {
  const message = 'no sé cuánto necesito'
  assert.equal(wantsQuantityHelp(message), true)
  assert.equal(isValidCityAnswer(message), false)
})

test('valida ciudad y dirección antes de avanzar', () => {
  assert.equal(isValidCityAnswer('Bogotá'), true)
  assert.equal(isValidCityAnswer('10 mesas todos los días'), false)
  assert.equal(isValidAddressAnswer('Carrera 20 # 10-30'), true)
  assert.equal(isValidAddressAnswer('no sé cuánto necesito'), false)
})

test('distingue información de entregas de una solicitud de capacitación', () => {
  assert.equal(isDeliveryInformationRequest('🚚 Información de entregas'), true)
  assert.equal(isDeliveryInformationRequest('¿Hacen entregas en Medellín?'), true)
  assert.equal(isDeliveryInformationRequest('quiero cotizar 10 galones con entrega'), false)
  assert.equal(isDeliveryInformationRequest('quiero una capacitación'), false)
})

test('guía la entrega paso a paso y calcula el mínimo en Bogotá', () => {
  const start = getDeliveryAssistantResponse('Información de entregas')
  assert.match(start.text, /¿A dónde sería el pedido/)
  assert.doesNotMatch(start.text, /\$\s?300[.,]000/)

  const city = getDeliveryAssistantResponse('Bogotá', start.inquiry)
  assert.match(city.text, /tiempo de entrega o calcular el costo/)
  assert.doesNotMatch(city.text, /300[.,]000|2 a 5 días/)

  const cost = getDeliveryAssistantResponse('¿Cuánto cuesta el domicilio?', city.inquiry)
  assert.match(cost.text, /300[.,]000 antes de IVA/)
  assert.equal(cost.inquiry.phase, 'subtotal')

  const estimate = getDeliveryAssistantResponse('mi pedido es de $250.000 antes de IVA', cost.inquiry)
  assert.match(estimate.text, /faltan[^\n]*50[.,]000/)
  assert.match(estimate.text, /20[.,]000 a[^\n]*30[.,]000/)
  assert.equal(estimate.inquiry.subtotal, 250000)
})

test('distingue municipios aledaños, pedido mínimo y hora de corte', () => {
  const result = getDeliveryAssistantResponse('En un municipio aledaño, el pedido es de 900 mil y lo hago después de las 3 pm')
  assert.match(result.text, /cubr[ae] el flete/)
  assert.match(result.text, /siguiente día hábil/)
  assert.match(result.text, /municipio específico debe confirmarla Naval/)
})

test('no confunde cantidades de producto con el valor del pedido ni calcula con IVA incluido', () => {
  assert.equal(extractDeliverySubtotal('quiero 10 galones'), null)
  assert.deepEqual(extractDeliverySubtotal('son $350.000 con IVA'), { needsPretax: true })
  assert.equal(shouldContinueDeliveryInquiry('quiero una capacitación', { phase: 'subtotal', zone: 'bogota' }), false)
  const answer = getDeliveryAssistantResponse('son $350.000 con IVA', { phase: 'subtotal', zone: 'bogota' })
  assert.match(answer.text, /antes de IVA/)
  assert.equal(answer.inquiry.subtotal, undefined)
})

test('extrae y valida los datos principales de una capacitación', () => {
  assert.equal(isValidAttendeeAnswer('seríamos 25 personas'), true)
  assert.equal(isValidAttendeeAnswer('somos varios'), false)
  assert.equal(extractTrainingDate('preferimos el 15 de octubre de 2026'), '15 de octubre de 2026')
  assert.equal(extractTrainingDate('puede ser el próximo martes'), 'el próximo martes')
  assert.equal(extractTrainingDate('Carrera 20 # 10-30'), '')
  assert.equal(extractTrainingTime('a las 9:30 a. m.'), '9:30 a. m')
  assert.equal(extractTrainingTime('preferimos en la tarde'), 'tarde')
})

test('reconoce referencias al producto anterior y calcula datos publicados', () => {
  assert.equal(isGenericProductReference('quiero comprarlo'), true)
  assert.equal(isAmbiguousProductInterest('quiero multiusos'), true)
  assert.equal(isAmbiguousProductInterest('quiero comprar multiusos'), false)
  assert.equal(isAmbiguousProductInterest('quiero verlo'), false)
  assert.equal(isAffirmativeAnswer('sí, me sirve'), true)
  assert.equal(isAffirmativeAnswer('sí, enviar'), true)
  assert.equal(extractDailySolutionLiters('preparamos 2 litros de solución al día'), 2)
  assert.equal(parseDilutionMlPerLiter('Limpieza media: 10 ml/Pto a 1 L de agua.'), 10)
  assert.equal(parsePresentationMilliliters('1.900 CC'), 1900)
})

test('extrae respuestas de Make y de la estructura de Responses API', () => {
  assert.equal(extractWebhookReply('{"reply":"Hola"}'), 'Hola')
  assert.equal(extractOpenAIReply({ output: [{ content: [{ type: 'output_text', text: 'Respuesta segura' }] }] }), 'Respuesta segura')
})

test('limita y sanea el historial que se envía al modelo', () => {
  const messages = Array.from({ length: 20 }, (_, index) => ({ role: index % 2 ? 'assistant' : 'user', content: `mensaje ${index}` }))
  messages.push({ role: 'system', content: 'no permitido' })
  const safeConversation = getSafeConversation({ messages })
  assert.equal(safeConversation.length, 16)
  assert.ok(safeConversation.every(({ role }) => role === 'user' || role === 'assistant'))
})

test('la respuesta sin conexión no afirma que la solicitud fue registrada', () => {
  assert.doesNotMatch(buildOfflineReply('quote'), /recibimos|registramos/i)
  assert.doesNotMatch(buildOfflineReply('quote'), /WhatsApp/i)
  assert.doesNotMatch(buildOfflineReply('complaint'), /WhatsApp/i)
  assert.doesNotMatch(buildOfflineReply('training'), /WhatsApp/i)
  assert.match(buildOfflineReply('human'), /WhatsApp/i)
})

test('el endpoint devuelve una ayuda util si Make responde con error', async () => {
  const originalFetch = global.fetch
  const originalWebhookUrl = process.env.MAKE_WEBHOOK_URL
  const originalOpenAIKey = process.env.OPENAI_API_KEY
  global.fetch = async () => new Response('Not found', { status: 404 })
  process.env.MAKE_WEBHOOK_URL = 'https://example.test/webhook'
  delete process.env.OPENAI_API_KEY

  let statusCode = 0
  let payload = null
  const response = {
    status(code) {
      statusCode = code
      return this
    },
    json(value) {
      payload = value
      return value
    },
    setHeader() {},
  }

  try {
    await handler({ method: 'POST', body: { message: 'Quiero cotizar', requestType: 'quote' } }, response)
  } finally {
    global.fetch = originalFetch
    if (originalWebhookUrl === undefined) delete process.env.MAKE_WEBHOOK_URL
    else process.env.MAKE_WEBHOOK_URL = originalWebhookUrl
    if (originalOpenAIKey === undefined) delete process.env.OPENAI_API_KEY
    else process.env.OPENAI_API_KEY = originalOpenAIKey
  }

  assert.equal(statusCode, 200)
  assert.equal(payload.delivered, false)
  assert.equal(payload.provider, 'local-fallback')
  assert.doesNotMatch(payload.reply, /WhatsApp/)
})

test('una confirmación técnica de Make no se presenta como respuesta a una pregunta', async () => {
  const originalFetch = global.fetch
  const originalWebhookUrl = process.env.MAKE_WEBHOOK_URL
  const originalOpenAIKey = process.env.OPENAI_API_KEY
  global.fetch = async () => new Response('Accepted', { status: 200 })
  process.env.MAKE_WEBHOOK_URL = 'https://example.test/webhook'
  delete process.env.OPENAI_API_KEY

  let payload = null
  const response = {
    status() { return this },
    json(value) { payload = value; return value },
    setHeader() {},
  }

  try {
    await handler({ method: 'POST', body: { message: '¿Qué recomiendan para el baño?', requestType: 'question' } }, response)
  } finally {
    global.fetch = originalFetch
    if (originalWebhookUrl === undefined) delete process.env.MAKE_WEBHOOK_URL
    else process.env.MAKE_WEBHOOK_URL = originalWebhookUrl
    if (originalOpenAIKey === undefined) delete process.env.OPENAI_API_KEY
    else process.env.OPENAI_API_KEY = originalOpenAIKey
  }

  assert.equal(payload.delivered, false)
  assert.equal(payload.provider, 'local')
  assert.match(payload.reply, /superficie|espacio/i)
  assert.doesNotMatch(payload.reply, /recibimos|registramos/i)
})
