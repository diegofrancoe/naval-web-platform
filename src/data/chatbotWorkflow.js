const normalize = (value) => String(value ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9.#-]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const productQuantityPattern = /\b\d+(?:[.,]\d+)?\s*(?:unidades?|envases?|botellas?|bidones?|canecas?|cajas?|galones?|litros?|lts?|cc|ml)\b/i
const operationSizePattern = /\b\d+(?:[.,]\d+)?\s*(?:m2|m²|metros?\s+cuadrados?|mesas?|sillas?|habitaciones?|cuartos?|baños?|sanitarios?|puestos?|empleados?|personas?|dispensadores?|ventanales?|pisos?|cargas?|kilos?)\b/i
const frequencyPattern = /\b(?:todos?\s+los\s+dias|cada\s+dia|diari[oa]s?|diariamente|\d+\s+veces?\s+(?:al|por)\s+(?:dia|semana|mes)|semanal(?:mente)?|quincenal(?:mente)?|mensual(?:mente)?|ocasional(?:mente)?|varias\s+veces\s+por\s+semana)\b/i
const solutionVolumePattern = /\b(\d+(?:[.,]\d+)?)\s*(?:l|lt|lts|litros?)\s+(?:de\s+)?(?:soluci[oó]n|mezcla|producto\s+preparado|preparados?)?(?:\s*(?:al|por|cada)\s+d[ií]a|\s+diari[oa]s?)\b/i

export function wantsQuantityHelp(message) {
  return /\b(?:no\s+s[eé]|no\s+tengo\s+claro|ay[uú]dame|recomi[eé]ndame|calcular|calcula|estimar|estima|cu[aá]nt[oa]s?\s+necesito)\b/i.test(message)
}

export function isGenericProductReference(message) {
  const normalized = normalize(message)
  return /^(?:quiero|deseo|necesito)?\s*(?:comprar|cotizar|pedir)?(?:lo|la)?\s*(?:ese|esa|este|esta)?\s*(?:producto)?$/.test(normalized) ||
    /\b(?:quiero|deseo|necesito)\s+(?:comprarlo|comprarla|cotizarlo|cotizarla|pedirlo|pedirla)\b/.test(normalized)
}

export function isAmbiguousProductInterest(message) {
  const normalized = normalize(message)
  if (/\b(?:comprar|cotizar|pedido|precio|ver|verlo|verla|mostrar|abrir|consultar|informacion|ficha|usar|limpiar|diluir|sirve|como)\b/.test(normalized)) return false
  return /^(?:lo\s+)?quiero(?:\s+(?:el|la|los|las))?(?:\s+.+)?$/.test(normalized) ||
    /^(?:me\s+interesa|me\s+gusta)(?:\s+(?:el|la|los|las))?(?:\s+.+)?$/.test(normalized)
}

export function extractOperationSize(message) {
  return message.match(operationSizePattern)?.[0]?.trim() ?? ''
}

export function extractUsageFrequency(message) {
  return message.match(frequencyPattern)?.[0]?.trim() ?? ''
}

export function extractDailySolutionLiters(message) {
  const match = message.match(solutionVolumePattern)
  if (!match) return null
  const liters = Number(match[1].replace(',', '.'))
  return Number.isFinite(liters) && liters > 0 ? liters : null
}

export function hasProductPackageQuantity(message) {
  return productQuantityPattern.test(message)
}

export function isAffirmativeAnswer(message) {
  return /^(?:s[ií](?:,?\s+(?:me\s+sirve|confirmo|enviar|envíalo|envialo))?|claro|correcto|confirmo|confirmado|de acuerdo|ok|okay|perfecto|me sirve|esta bien|está bien)[.!\s]*$/i.test(message.trim())
}

export function isValidCityAnswer(message) {
  const normalized = normalize(message)
  if (!normalized || wantsQuantityHelp(message) || /\d|\?|cuanto|cantidad|producto|mesa|diari|direccion|calle|carrera/.test(normalized)) return false

  const explicitCity = message.match(/\b(?:ciudad\s*(?:es|:)?|entrega\s+en|estoy\s+en|queda\s+en|vivo\s+en)\s*([a-záéíóúñü][a-záéíóúñü\s-]{1,40})\b/i)?.[1]
  const candidate = (explicitCity || message).trim().replace(/[.,;]+$/, '')
  return /^[a-záéíóúñü]+(?:[\s-]+[a-záéíóúñü]+){0,3}$/i.test(candidate)
}

export function isValidAddressAnswer(message) {
  const normalized = normalize(message)
  if (!normalized || wantsQuantityHelp(message)) return false
  return /\b(?:calle|cl|carrera|cra|avenida|av|diagonal|diag|transversal|tv|autopista|kilometro|km|numero|#)\b/i.test(message) && /\d/.test(message)
}

export function isDeliveryInformationRequest(message) {
  const normalized = normalize(message)
  if (!/\b(?:entregas?|envios?|despachos?|domicilios?|transporte|cobertura)\b/.test(normalized)) return false
  if (/\b(?:quiero|necesito|deseo)\s+(?:comprar|cotizar|pedir)\b/.test(normalized)) return false
  return /\b(?:informacion|como|cuando|donde|cuanto|costo|precio|tarifa|tiempo|plazo|hacen|realizan|envian|entregan|cubren|cobertura)\b/.test(normalized) ||
    message.includes('?') || normalized.split(' ').length <= 3
}

export function extractTrainingDate(message) {
  const monthName = '(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)'
  const weekday = '(?:lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo)'
  const patterns = [
    new RegExp(`\\b(\\d{1,2}\\s+de\\s+${monthName}(?:\\s+de\\s+\\d{4})?)\\b`, 'i'),
    /\b(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\b/i,
    /\b(\d{1,2}-\d{1,2}-\d{2,4})\b/i,
    new RegExp(`\\b((?:el\\s+)?(?:pr[oó]ximo\\s+)?${weekday})\\b`, 'i'),
    /\b(hoy|ma[ñn]ana|pasado\s+ma[ñn]ana)\b/i,
  ]

  for (const pattern of patterns) {
    const value = message.match(pattern)?.[1]
    if (value) return value.trim()
  }
  return ''
}

export function extractTrainingTime(message) {
  const exactTime = message.match(/\b(?:a\s+las?\s+)?(\d{1,2}(?::\d{2})?\s*(?:a\.?\s*m\.?|p\.?\s*m\.?))\b/i)?.[1]
  if (exactTime) return exactTime.trim()

  return message.match(/\b(?:en\s+la\s+)?(ma[ñn]ana|tarde|noche|jornada\s+de\s+la\s+ma[ñn]ana|jornada\s+de\s+la\s+tarde)\b/i)?.[1]?.trim() ?? ''
}

export function isValidAttendeeAnswer(message) {
  const match = message.match(/\b(\d+)\s*(?:personas?|participantes?|asistentes?)\b/i)
  return Boolean(match && Number(match[1]) > 0)
}

export function parseDilutionMlPerLiter(dilution) {
  const match = String(dilution ?? '').match(/(?:limpieza\s+media[^\d]*)?(\d+(?:[.,]\d+)?)\s*ml[^\d]{0,30}(?:1\s*)?(?:l|litro)/i)
  if (!match) return null
  const value = Number(match[1].replace(',', '.'))
  return Number.isFinite(value) && value > 0 ? value : null
}

export function parsePresentationMilliliters(presentation) {
  const normalized = normalize(presentation).replace(/\s/g, '')
  const valueMatch = normalized.match(/\d+(?:[.,]\d+)?/)
  if (!valueMatch) return null
  const rawValue = valueMatch[0]
  const numericValue = Number(rawValue.includes('.') && /cc|ml/.test(normalized) ? rawValue.replace('.', '') : rawValue.replace(',', '.'))
  if (!Number.isFinite(numericValue) || numericValue <= 0) return null
  if (/galones?|gls?/.test(normalized)) return numericValue * 3785.41
  if (/litros?|lts?|lt\b/.test(normalized)) return numericValue * 1000
  if (/cc|ml/.test(normalized)) return numericValue
  return null
}
