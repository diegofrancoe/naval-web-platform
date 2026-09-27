import assert from 'node:assert/strict'
import test from 'node:test'

import { getQuoteChangeTarget, isQuoteChangeRequest, parseQuoteQuantity } from '../src/data/quoteOrder.js'

test('distingue la presentación publicada de la cantidad solicitada', () => {
  assert.deepEqual(parseQuoteQuantity('1.900 cc', ['1.900 CC']), {
    kind: 'presentation',
    presentation: '1.900 CC',
  })
  assert.deepEqual(parseQuoteQuantity('4 envases de 1.900 cc', ['1.900 CC']), {
    kind: 'quantity',
    unitCount: 4,
    presentation: '1.900 CC',
    quantity: '4 envases de 1.900 CC',
  })
})

test('no confunde el número de referencias con los envases de cada referencia', () => {
  assert.deepEqual(parseQuoteQuantity('quiero 4 productos'), { kind: 'product-count', count: 4 })
  assert.equal(parseQuoteQuantity('10 galones de cada uno').quantity, '10 galones')
})

test('interpreta las formas naturales de pedir cuatro unidades de 1.900 cc', () => {
  for (const message of ['4 de 1.900', 'quiero 4 productos de 1900', '4 cantidades presentación 1900']) {
    assert.deepEqual(parseQuoteQuantity(message, ['1.900 CC', '3.800 CC', '5 GALONES']), {
      kind: 'quantity',
      unitCount: 4,
      presentation: '1.900 CC',
      quantity: '4 unidades de 1.900 CC',
    }, message)
  }
  assert.deepEqual(parseQuoteQuantity('1900', ['1.900 CC']), {
    kind: 'presentation',
    presentation: '1.900 CC',
  })
  assert.deepEqual(parseQuoteQuantity('quiero cuatro unidades de 1900', ['1.900 CC']), {
    kind: 'quantity',
    unitCount: 4,
    presentation: '1.900 CC',
    quantity: '4 unidades de 1.900 CC',
  })
  assert.deepEqual(parseQuoteQuantity('cuatro productos', ['1.900 CC']), {
    kind: 'product-count',
    count: 4,
  })
})

test('entiende correcciones de la solicitud', () => {
  assert.equal(isQuoteChangeRequest('deseo cambiar'), true)
  assert.equal(getQuoteChangeTarget('cambiar la cantidad'), 'quantity')
  assert.equal(getQuoteChangeTarget('corregir los productos'), 'product')
})
