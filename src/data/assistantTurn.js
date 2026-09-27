import { extractOperationSize, extractUsageFrequency, isAffirmativeAnswer, isValidAddressAnswer, isValidCityAnswer } from './chatbotWorkflow.js'
import { normalizeAssistantText } from './productAssistantCatalog.js'
import { getQuoteChangeTarget, isQuoteChangeRequest, parseQuoteQuantity } from './quoteOrder.js'

const ACTIONS = new Set(['provide', 'confirm', 'correct', 'question', 'cancel', 'unknown'])
const INTENTS = new Set(['quote', 'training', 'complaint', 'delivery', 'human', 'question', 'unknown'])
const CORRECTIONS = new Set(['product', 'quantity', 'city', 'address', 'name', 'phone', 'email', 'company', 'topic', 'date', 'time', 'attendees', 'reason', 'none'])
const text = (value) => typeof value === 'string' ? value.trim().slice(0, 300) : ''
const positiveInteger = (value) => Number.isSafeInteger(value) && value > 0 && value <= 100000 ? value : null

export function normalizeAssistantTurn(raw) {
  if (!raw || typeof raw !== 'object') return null
  const entities = raw.entities && typeof raw.entities === 'object' ? raw.entities : {}
  const quantity = entities.quantity && typeof entities.quantity === 'object' ? entities.quantity : {}
  return {
    action: ACTIONS.has(raw.action) ? raw.action : 'unknown',
    intent: INTENTS.has(raw.intent) ? raw.intent : 'unknown',
    correctionTarget: CORRECTIONS.has(raw.correctionTarget) ? raw.correctionTarget : 'none',
    entities: {
      productNames: Array.isArray(entities.productNames) ? entities.productNames.map(text).filter(Boolean).slice(0, 10) : [],
      productCount: positiveInteger(entities.productCount),
      quantity: {
        productName: text(quantity.productName),
        units: positiveInteger(quantity.units),
        unitLabel: text(quantity.unitLabel),
        presentation: text(quantity.presentation),
        appliesToAll: quantity.appliesToAll === true,
      },
      operationSize: text(entities.operationSize),
      usageFrequency: text(entities.usageFrequency),
      city: text(entities.city),
      address: text(entities.address),
      name: text(entities.name),
      company: text(entities.company),
      phone: text(entities.phone),
      email: text(entities.email),
      topic: text(entities.topic),
      preferredDate: text(entities.preferredDate),
      preferredTime: text(entities.preferredTime),
      attendees: positiveInteger(entities.attendees),
      complaintDescription: text(entities.complaintDescription),
      orderNumber: text(entities.orderNumber),
    },
  }
}

export function parseLocalTurn(message, workflow, pendingField, catalog) {
  if (!workflow || typeof message !== 'string') return null
  const normalized = normalizeAssistantText(message)
  const currentProductName = workflow.data?.products?.at(-1) || workflow.data?.product || ''
  const currentProduct = catalog.find((product) => product.name === currentProductName)
  const quantity = workflow.type === 'quote' ? parseQuoteQuantity(message, currentProduct?.presentations || []) : { kind: 'unknown' }
  const matchedProducts = catalog.filter((product) =>
    product.aliases?.some((alias) => alias.length >= 5 && normalized.includes(normalizeAssistantText(alias))) ||
    normalized.includes(normalizeAssistantText(product.name)),
  )
  const productQuestionTopic = /\b(?:sirve|usar|uso|aplicar|aplicacion|diluir|diluyo|diluyes|diluye|dilucion|dosificacion|dosificar|seguridad|ficha|precio|cuesta|disponibilidad|presentaciones|diferencia|recomiendas|ingredientes|compatibilidad)\b/.test(normalized)
  const asksProductQuestion = productQuestionTopic && (/\?/.test(message) || /^(?:dime|explicame|quiero saber|necesito saber|puedo usar|precio\b|ficha\b)/.test(normalized))
  const action = isAffirmativeAnswer(message) && /Confirmed$/.test(pendingField)
    ? 'confirm'
    : isQuoteChangeRequest(message)
      ? 'correct'
      : asksProductQuestion
        ? 'question'
        : 'provide'
  const parsed = normalizeAssistantTurn({
    action,
    intent: workflow.type,
    correctionTarget: action === 'correct' ? getQuoteChangeTarget(message) || 'none' : 'none',
    entities: {
      productNames: matchedProducts.map((product) => product.name),
      productCount: quantity.kind === 'product-count' ? quantity.count : null,
      quantity: {
        productName: '',
        units: quantity.kind === 'quantity' ? quantity.unitCount : null,
        unitLabel: quantity.kind === 'quantity' ? quantity.quantity.match(/\b(?:envases?|botellas?|bidones?|canecas?|cajas?|unidades?)\b/i)?.[0] || '' : '',
        presentation: quantity.presentation || '',
        appliesToAll: /\b(?:cada uno|cada una|cada producto|de cada)\b/i.test(message),
      },
      operationSize: extractOperationSize(message),
      usageFrequency: extractUsageFrequency(message),
    },
  })
  return parsed
}

function findCanonicalProduct(name, catalog) {
  const normalized = normalizeAssistantText(name)
  if (!normalized) return null
  return catalog.find((product) =>
    normalizeAssistantText(product.name) === normalized || product.aliases?.some((alias) => normalizeAssistantText(alias) === normalized),
  ) || null
}

function findCanonicalPresentation(value, product) {
  const normalized = normalizeAssistantText(value)
  const digits = normalized.replace(/\D/g, '')
  if (!normalized || !product) return ''
  return product.presentations?.find((presentation) => {
    const candidate = normalizeAssistantText(presentation)
    return candidate === normalized || (digits.length >= 3 && candidate.replace(/\D/g, '') === digits)
  }) || ''
}

function quoteItems(data) {
  const names = Array.isArray(data.products) && data.products.length ? data.products : data.product ? [data.product] : []
  return names.map((name) => ({
    name,
    presentation: data.quoteItems?.find((item) => item.name === name)?.presentation || '',
    quantity: data.quoteItems?.find((item) => item.name === name)?.quantity || '',
  }))
}

function syncQuote(data) {
  data.quoteItems = quoteItems(data)
  data.quantity = data.quoteItems.length && data.quoteItems.every((item) => item.quantity)
    ? data.quoteItems.map((item) => `${item.name}: ${item.quantity}`).join('; ')
    : ''
}

function validatedContact(data, entities) {
  if (entities.city && isValidCityAnswer(entities.city)) data.city = entities.city
  if (entities.address && isValidAddressAnswer(entities.address)) data.address = entities.address
  if (entities.name && entities.name.length >= 2) data.name = entities.name
  if (entities.company && entities.company.length >= 2) data.company = entities.company
  if (/\d{7,}/.test(entities.phone.replace(/\D/g, ''))) data.phone = entities.phone
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entities.email)) data.email = entities.email
}

export function applyInterpretedTurn(beforeWorkflow, localWorkflow, rawTurn, catalog, pendingField) {
  const turn = normalizeAssistantTurn(rawTurn)
  if (!turn || !beforeWorkflow || !localWorkflow) return localWorkflow
  if (turn.action === 'question') return { ...beforeWorkflow, interruption: 'question' }
  if (turn.action === 'cancel') return { ...beforeWorkflow, interruption: 'cancel' }
  if (!['unknown', beforeWorkflow.type].includes(turn.intent)) return localWorkflow

  const data = { ...localWorkflow.data }
  const entities = turn.entities
  let validationError = localWorkflow.validationError || ''
  if (turn.action === 'correct' && turn.correctionTarget !== 'none') {
    delete data.submissionConfirmed
    if (beforeWorkflow.type === 'quote') delete data.orderConfirmed
    const fields = {
      product: ['product', 'products', 'quoteItems', 'quantity', 'selectionConfirmed', 'requestedProductCount'],
      quantity: ['quantity', 'needsQuantityHelp'],
      topic: ['topics', 'detailsConfirmed'],
      reason: ['reason', 'detailsConfirmed'],
      date: ['preferredDate', 'detailsConfirmed'],
      time: ['preferredTime', 'detailsConfirmed'],
      attendees: ['attendees', 'detailsConfirmed'],
    }[turn.correctionTarget] || [turn.correctionTarget]
    for (const field of fields) {
      if (['city', 'address', 'name', 'phone', 'email', 'company'].includes(field) &&
          localWorkflow.data[field] && localWorkflow.data[field] !== beforeWorkflow.data[field]) continue
      delete data[field]
    }
    if (beforeWorkflow.type === 'quote' && turn.correctionTarget === 'quantity') {
      data.quoteItems = quoteItems(beforeWorkflow.data).map((item) => ({ ...item, quantity: '' }))
      syncQuote(data)
    }
    validationError = ''
  }

  validatedContact(data, entities)

  if (beforeWorkflow.type === 'quote') {
    const products = entities.productNames.map((name) => findCanonicalProduct(name, catalog)).filter(Boolean)
    const selectedNames = [...new Set(products.map((product) => product.name))]
    if (selectedNames.length && (pendingField === 'product' || pendingField === 'productCountPending' || turn.correctionTarget === 'product')) {
      const previousNames = turn.correctionTarget === 'product' ? [] : beforeWorkflow.data.products || (beforeWorkflow.data.product ? [beforeWorkflow.data.product] : [])
      data.products = [...new Set([...previousNames, ...selectedNames])]
      data.product = data.products.join(', ')
      delete data.selectionConfirmed
      syncQuote(data)
      validationError = ''
    }
    if (entities.productCount && !entities.quantity.units && ['selectionConfirmed', 'orderConfirmed', 'productCountPending'].includes(pendingField) && entities.productCount > quoteItems(data).length) {
      data.requestedProductCount = entities.productCount
      delete data.selectionConfirmed
      validationError = ''
    }

    const wanted = entities.quantity
    if (wanted.units && quoteItems(data).length) {
      const items = quoteItems(data)
      const named = wanted.productName ? findCanonicalProduct(wanted.productName, catalog)?.name : ''
      const indexes = wanted.appliesToAll
        ? items.map((_, index) => index)
        : [named ? items.findIndex((item) => item.name === named) : Math.max(0, items.findIndex((item) => !item.quantity))]
      if (indexes.every((index) => index >= 0)) {
        for (const index of indexes) {
          const item = items[index]
          const product = catalog.find((entry) => entry.name === item.name)
          const presentation = wanted.presentation ? findCanonicalPresentation(wanted.presentation, product) : item.presentation
          if (wanted.presentation && !presentation) {
            validationError = 'unsupportedPresentation'
            continue
          }
          const unitLabel = /^(?:envases?|botellas?|bidones?|canecas?|cajas?|unidades?)$/i.test(wanted.unitLabel)
            ? wanted.unitLabel.toLowerCase()
            : 'unidades'
          item.presentation = presentation
          item.quantity = `${wanted.units} ${unitLabel}${presentation ? ` de ${presentation}` : ''}`
          validationError = ''
        }
        data.quoteItems = items
        syncQuote(data)
        if (items.every((item) => item.quantity)) delete data.needsQuantityHelp
      }
    }
    if (entities.operationSize) data.operationSize = entities.operationSize
    if (entities.usageFrequency) data.usageFrequency = entities.usageFrequency
  } else if (beforeWorkflow.type === 'training') {
    if (entities.topic) data.topics = entities.topic
    if (entities.preferredDate) data.preferredDate = entities.preferredDate
    if (entities.preferredTime) data.preferredTime = entities.preferredTime
    if (entities.attendees) data.attendees = `${entities.attendees} personas`
    if (turn.action === 'correct') delete data.detailsConfirmed
  } else if (beforeWorkflow.type === 'complaint') {
    if (entities.complaintDescription) data.reason = entities.complaintDescription
    if (entities.orderNumber) data.orderNumber = entities.orderNumber
    if (turn.action === 'correct') delete data.detailsConfirmed
  }

  if (turn.action === 'confirm' && ['selectionConfirmed', 'orderConfirmed', 'detailsConfirmed', 'submissionConfirmed'].includes(pendingField)) {
    data[pendingField] = 'Sí'
    validationError = ''
  }

  return { ...localWorkflow, data, validationError }
}
