import assert from 'node:assert/strict'
import test from 'node:test'

import { buildCatalogContext, retrieveCatalogProducts } from '../src/data/catalogRetrieval.js'

const catalog = [
  { name: 'Cera Polimérica', aliases: ['cera polimerica'], summary: 'Protege y da brillo al mármol sellado.', surfaces: ['mármol sellado'], presentations: ['3.800 CC'], productUrl: '/productos/cera-polimerica' },
  { name: 'Desengrasante', aliases: ['desengrasante'], summary: 'Retira grasa de superficies lavables.', surfaces: ['acero inoxidable'], presentations: ['1.900 CC'], technicalSheetUrl: '/fichas/desengrasante.pdf' },
]

test('recupera solo información pertinente y publicada', () => {
  const result = retrieveCatalogProducts([{ from: 'user', text: 'Quiero limpiar grasa con desengrasante' }], catalog)
  assert.deepEqual(result.products.map((product) => product.name), ['Desengrasante'])
  const context = buildCatalogContext([{ from: 'user', text: '¿Qué presentaciones tiene el desengrasante?' }], catalog)
  assert.match(context, /1\.900 CC/)
  assert.match(context, /fichas\/desengrasante\.pdf/)
  assert.doesNotMatch(context, /Cera Polimérica/)
  assert.doesNotMatch(context, /precio:|disponibilidad:/i)
})

test('no ofrece compatibilidad no publicada para una superficie delicada', () => {
  const result = retrieveCatalogProducts([{ from: 'user', text: 'Necesito algo para mármol' }], catalog)
  assert.deepEqual(result.products.map((product) => product.name), ['Cera Polimérica'])
})

test('prioriza la pregunta actual sin olvidar el contexto anterior', () => {
  const messages = [
    { from: 'user', text: 'Quiero conocer la cera polimérica para mármol' },
    { from: 'user', text: 'Ahora dime sobre el desengrasante para acero inoxidable' },
  ]
  const result = retrieveCatalogProducts(messages, catalog)
  assert.equal(result.products[0]?.name, 'Desengrasante')
})

test('no rellena una consulta sin coincidencias con productos arbitrarios', () => {
  const context = buildCatalogContext([{ from: 'user', text: 'Necesito solucionar xyzabc' }], catalog)
  assert.match(context, /Ningún producto coincide claramente/)
  assert.doesNotMatch(context, /Producto: Cera|Producto: Desengrasante/)
})
