import assert from 'node:assert/strict'
import test from 'node:test'

import { isWorkflowStarter } from '../src/data/workflowRouting.js'

test('cambia de proceso ante solicitudes explícitas en lenguaje natural', () => {
  assert.equal(isWorkflowStarter('complaint', 'Quiero reportar una queja'), true)
  assert.equal(isWorkflowStarter('complaint', 'Necesito poner un reclamo por el pedido'), true)
  assert.equal(isWorkflowStarter('training', 'Quiero agendar una capacitación de uso seguro'), true)
  assert.equal(isWorkflowStarter('quote', 'Quiero solicitar una cotización de Desengrasante'), true)
  assert.equal(isWorkflowStarter('quote', 'Quiero cotizar Desengrasante'), true)
  assert.equal(isWorkflowStarter('complaint', 'Recibí un envase roto'), false)
})
