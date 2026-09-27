import assert from 'node:assert/strict'
import test from 'node:test'

import { applyInterpretedTurn, normalizeAssistantTurn, parseLocalTurn } from '../src/data/assistantTurn.js'

const catalog = [{ name: 'Desengrasante', aliases: ['desengrasante'], presentations: ['1.900 CC', '3.800 CC'] }]
const quote = { type: 'quote', data: { product: 'Desengrasante', products: ['Desengrasante'], quoteItems: [{ name: 'Desengrasante', presentation: '', quantity: '' }], quantity: '' } }

test('el estado guarda por separado unidades y presentación, aunque el flujo anterior falle', () => {
  const turn = parseLocalTurn('quiero 4 productos de 1900', quote, 'quantity', catalog)
  const result = applyInterpretedTurn(quote, { ...quote, validationError: 'quantity' }, turn, catalog, 'quantity')
  assert.equal(result.data.quoteItems[0].presentation, '1.900 CC')
  assert.equal(result.data.quoteItems[0].quantity, '4 unidades de 1.900 CC')
  assert.equal(result.validationError, '')
})

test('una pregunta de producto interrumpe sin perder la solicitud', () => {
  for (const message of ['¿para qué sirve el desengrasante?', '¿Cómo diluyo el Desengrasante?']) {
    const turn = parseLocalTurn(message, quote, 'quantity', catalog)
    const result = applyInterpretedTurn(quote, { ...quote, data: { ...quote.data, quantity: 'dato incorrecto' } }, turn, catalog, 'quantity')
    assert.equal(result.interruption, 'question', message)
    assert.deepEqual(result.data, quote.data)
  }
})

test('las preguntas directas sin signo conservan capacitaciones y quejas abiertas', () => {
  for (const type of ['training', 'complaint']) {
    const before = { type, data: { name: 'Cliente', preferredDate: 'octubre' } }
    const turn = parseLocalTurn('dime el precio del desengrasante', before, 'city', catalog)
    const result = applyInterpretedTurn(before, { ...before, data: { ...before.data, city: 'dato incorrecto' } }, turn, catalog, 'city')
    assert.equal(result.interruption, 'question')
    assert.deepEqual(result.data, before.data)
  }
})

test('una corrección borra la confirmación anterior y aplica una nueva cantidad', () => {
  const before = { ...quote, data: { ...quote.data, quoteItems: [{ name: 'Desengrasante', presentation: '1.900 CC', quantity: '4 unidades de 1.900 CC' }], orderConfirmed: 'Sí', submissionConfirmed: 'Sí' } }
  const turn = normalizeAssistantTurn({ action: 'correct', intent: 'quote', correctionTarget: 'quantity', entities: { quantity: { units: 6, presentation: '1900', unitLabel: 'envases', appliesToAll: false } } })
  const result = applyInterpretedTurn(before, before, turn, catalog, 'orderConfirmed')
  assert.equal(result.data.quoteItems[0].quantity, '6 envases de 1.900 CC')
  assert.equal(result.data.orderConfirmed, undefined)
  assert.equal(result.data.submissionConfirmed, undefined)
})

test('un producto o presentación no publicados no entran en la solicitud', () => {
  const unknownProduct = normalizeAssistantTurn({ action: 'provide', intent: 'quote', entities: { productNames: ['Producto inventado'] } })
  const start = { type: 'quote', data: {} }
  assert.equal(applyInterpretedTurn(start, start, unknownProduct, catalog, 'product').data.product, undefined)

  const unknownPresentation = normalizeAssistantTurn({ action: 'provide', intent: 'quote', entities: { quantity: { units: 4, presentation: '20 L', appliesToAll: false } } })
  const result = applyInterpretedTurn(quote, quote, unknownPresentation, catalog, 'quantity')
  assert.equal(result.data.quantity, '')
  assert.equal(result.validationError, 'unsupportedPresentation')
})

test('una confirmación solo valida el paso esperado', () => {
  const turn = normalizeAssistantTurn({ action: 'confirm', intent: 'training' })
  const training = { type: 'training', data: { topics: 'Uso seguro' } }
  const result = applyInterpretedTurn(training, training, turn, catalog, 'detailsConfirmed')
  assert.equal(result.data.detailsConfirmed, 'Sí')
  assert.equal(result.data.submissionConfirmed, undefined)
})
