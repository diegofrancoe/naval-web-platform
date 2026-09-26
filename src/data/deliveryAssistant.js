const normalize = (value) => String(value ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/\s+/g, ' ')
  .trim()

export const deliveryPolicy = {
  bogota: { minimum: 300000, feeMin: 20000, feeMax: 30000, days: '2 a 5 días hábiles' },
  nearby: { minimum: 900000, feeMin: 60000, feeMax: 80000, days: '2 días hábiles' },
}

const money = (value) => new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
}).format(value)

export function extractDeliverySubtotal(message) {
  const normalized = normalize(message)
  if (/\b(?:con iva|iva incluido|incluye iva)\b/.test(normalized)) return { needsPretax: true }

  const match = message.match(/(?:\$\s*|\b(?:valor|pedido|compra|subtotal|presupuesto|son|serian|tengo|unos?)\s+(?:es\s+)?(?:de\s+)?)(\d{1,3}(?:[.,]\d{3})+|\d{4,9}|\d{1,3}\s*(?:mil|millones?))(?:\s*(?:pesos|cop))?/i)
    || message.match(/^\s*(\d{1,3}(?:[.,]\d{3})+|\d{4,9}|\d{1,3}\s*(?:mil|millones?))(?:\s*(?:pesos|cop|antes de iva))?\s*[.!]?\s*$/i)
  if (!match) return null

  const raw = normalize(match[1])
  const number = Number(raw.replace(/\s*(?:mil|millones?)$/, '').replace(/[.,]/g, ''))
  const multiplier = /millones?$/.test(raw) ? 1000000 : /mil$/.test(raw) ? 1000 : 1
  const amount = number * multiplier
  return Number.isFinite(amount) && amount > 0 ? { amount } : null
}

function getZone(message) {
  const normalized = normalize(message)
  if (/\bbogota\b/.test(normalized)) return 'bogota'
  if (/\b(?:municipio|municipios|aledano|aledanos)\b/.test(normalized)) return 'nearby'
  return ''
}

function getTopic(message) {
  const normalized = normalize(message)
  if (/\b(?:cuanto|costo|precio|tarifa|flete|pedido minimo|gratis|gratuito|valor|pagar|domicilio)\b/.test(normalized)) return 'cost'
  if (/\b(?:cuando|tiempo|plazo|dias|demora|llega|tarda|horario|3 pm|3 p m|15 ?00)\b/.test(normalized)) return 'time'
  if (/\b(?:cobertura|cubren|llegan|envian|entregan|donde)\b/.test(normalized)) return 'coverage'
  return ''
}

function getMunicipality(message) {
  const match = message.match(/\b(?:municipio\s+de|en|hacia)\s+([a-záéíóúñü]{3,}(?:\s+[a-záéíóúñü]{3,})?)\b/i)
  return match?.[1]?.trim() || ''
}

function isPickupRequest(message) {
  return /\b(?:recoger|recogida|retiro|retirar|bodega)\b/.test(normalize(message))
}

export function shouldContinueDeliveryInquiry(message, inquiry) {
  if (!inquiry) return false
  const normalized = normalize(message)
  if (getZone(message) || isPickupRequest(message) || extractDeliverySubtotal(message)) return true
  if (/\b(?:flete|entrega|envio|domicilio|pedido minimo|transporte|cuanto falta|cuando llega|tiempo|plazo|cobertura|costo|precio|tarifa|horario)\b/.test(normalized)) return true
  if (['zone', 'municipality'].includes(inquiry.phase) && /^[a-záéíóúñü]+(?:\s+[a-záéíóúñü]+){0,2}$/i.test(message.trim())) return true
  if (inquiry.phase === 'subtotal' && /^(?:no se|no lo se|aun no se|no tengo el valor|no se cuanto|todavia no se)$/i.test(normalized)) return true
  return false
}

export function getDeliveryAssistantResponse(message, previousInquiry = null) {
  const normalized = normalize(message)
  if (isPickupRequest(message)) {
    return {
      text: 'Si prefieres recoger el pedido, Naval puede coordinarlo cuando haya inventario y se haya acordado previamente. El horario publicado es de 8:00 a. m. a 12:00 m. y de 2:00 p. m. a 4:00 p. m., o el acordado con el comercial. ¿Qué producto y cantidad necesitas recoger?',
      inquiry: { ...(previousInquiry || {}), phase: 'complete' },
    }
  }

  const zone = getZone(message) || previousInquiry?.zone || ''
  const subtotal = extractDeliverySubtotal(message)
  const topic = getTopic(message) || (subtotal?.amount ? 'cost' : '') || previousInquiry?.topic || ''
  if (previousInquiry?.phase === 'municipality' && !getZone(message) && /^[a-záéíóúñü]+(?:\s+[a-záéíóúñü]+){0,2}$/i.test(message.trim())) {
    const city = message.trim()
    return {
      text: `Gracias. Para ${city}, Naval debe confirmar la cobertura exacta antes de comprometer el envío. Mientras tanto puedo orientarte con las condiciones generales de municipios aledaños. ¿Quieres saber el tiempo de entrega o calcular el costo?`,
      inquiry: { ...previousInquiry, city, phase: 'complete' },
    }
  }
  if (!zone && previousInquiry?.phase === 'zone' && /^[a-záéíóúñü]+(?:\s+[a-záéíóúñü]+){0,2}$/i.test(message.trim())) {
    const city = message.trim()
    return {
      text: `Para ${city} aún no tengo una lista oficial que confirme si está dentro de los municipios aledaños cubiertos. ¿Me confirmas si es Bogotá urbana o un municipio aledaño? Si es municipio, registraré ${city} para que Naval valide la cobertura y el flete.`,
      inquiry: { zone: '', city, topic, phase: 'zone' },
    }
  }

  if (!zone) {
    const city = getMunicipality(message)
    return {
      text: city
        ? `No tengo cobertura publicada para ${city}. Naval informa entregas en Bogotá urbana y municipios aledaños; la cobertura específica debe confirmarse. ¿Es un municipio aledaño a Bogotá?`
        : 'Te ayudo con las entregas de Naval en Bogotá y municipios aledaños. ¿A dónde sería el pedido y qué quieres saber: cobertura, tiempo o costo?',
      inquiry: { zone: '', city, topic, phase: 'zone' },
    }
  }

  const policy = deliveryPolicy[zone]
  const place = zone === 'bogota' ? 'Bogotá urbana' : 'municipios aledaños'
  const coverageNote = zone === 'nearby'
    ? ' La cobertura del municipio específico debe confirmarla Naval.'
    : ''
  const timing = `El plazo publicado para ${place} es de ${policy.days}; la fecha exacta depende de la programación y disponibilidad.`
  const cutoff = /\b(?:despues|pasadas|3 pm|3 p m|15 ?00|hoy|manana|cuando llega)\b/.test(normalized)
    ? ' Los pedidos recibidos después de las 3:00 p. m. se tramitan con fecha del siguiente día hábil.'
    : ''

  if (subtotal?.needsPretax) {
    return {
      text: `Para calcular si Naval cubre el flete necesito el valor del pedido antes de IVA. ¿Cuánto suma aproximadamente sin IVA?`,
      inquiry: { ...previousInquiry, zone, topic: 'cost', phase: 'subtotal' },
    }
  }

  const amount = subtotal?.amount ?? previousInquiry?.subtotal
  if (amount != null) {
    const covered = amount >= policy.minimum
    const difference = Math.max(0, policy.minimum - amount)
    const result = covered
      ? `Con un pedido de ${money(amount)} antes de IVA, alcanzas el mínimo de ${money(policy.minimum)} para que Naval cubra el flete en ${place}.`
      : `Con un pedido de ${money(amount)} antes de IVA, te faltan ${money(difference)} para llegar al mínimo de ${money(policy.minimum)} que cubre el flete. Si mantienes ese valor, el domicilio estimado es de ${money(policy.feeMin)} a ${money(policy.feeMax)}.`
    return {
      text: `${result}${coverageNote}${cutoff}\n\nEl costo final se confirma al revisar el pedido. ¿Quieres que te ayude a elegir productos o cantidades para preparar la cotización?`,
      inquiry: { ...previousInquiry, zone, topic: 'cost', subtotal: amount, phase: 'complete' },
    }
  }

  if (/^(?:no se|no lo se|aun no se|no tengo el valor|no se cuanto|todavia no se)$/i.test(normalized)) {
    return {
      text: `No hay problema. Para ${place}, Naval cubre el flete desde ${money(policy.minimum)} antes de IVA.${coverageNote} Dime qué productos buscas y para qué espacio o consumo, y te ayudo a estimar cantidades antes de cotizar.`,
      inquiry: { ...previousInquiry, zone, topic: 'cost', phase: 'complete' },
    }
  }

  if (topic === 'time') {
    return {
      text: `${timing}${cutoff}${coverageNote}\n\n¿Quieres que revisemos también si tu pedido alcanza el mínimo para que Naval cubra el flete?`,
      inquiry: { ...previousInquiry, zone, topic: 'time', phase: 'complete' },
    }
  }

  if (topic === 'coverage') {
    return {
      text: zone === 'bogota'
        ? 'Sí, Naval hace entregas en el área urbana de Bogotá. ¿Quieres saber el tiempo de entrega o calcular el flete según tu pedido?'
        : previousInquiry?.city
          ? `Para ${previousInquiry.city}, Naval debe confirmar la cobertura exacta. ¿Quieres conocer el tiempo publicado para municipios aledaños o calcular el costo estimado del envío?`
          : 'Naval atiende municipios aledaños, pero necesita confirmar la cobertura del municipio concreto. ¿A cuál municipio sería la entrega?',
      inquiry: { ...previousInquiry, zone, topic: 'coverage', phase: zone === 'nearby' && !previousInquiry?.city ? 'municipality' : 'complete' },
    }
  }

  if (!topic) {
    return {
      text: zone === 'bogota'
        ? 'Sí, Naval entrega en el área urbana de Bogotá. ¿Quieres conocer el tiempo de entrega o calcular el costo del domicilio según tu pedido?'
        : previousInquiry?.city
          ? `Para ${previousInquiry.city}, Naval debe confirmar la cobertura exacta. ¿Quieres conocer el tiempo o calcular el costo estimado?`
          : 'Naval entrega en municipios aledaños, sujeto a confirmar la cobertura del municipio específico. ¿Qué municipio es y quieres saber el tiempo o el costo?',
      inquiry: { ...previousInquiry, zone, topic: '', phase: zone === 'nearby' && !previousInquiry?.city ? 'municipality' : 'complete' },
    }
  }

  return {
    text: `En ${place}, Naval cubre el flete desde ${money(policy.minimum)} antes de IVA.${coverageNote} Para calcular si aplica a tu pedido o cuánto costaría el domicilio, ¿cuál es el valor aproximado de la compra antes de IVA?`,
    inquiry: { ...previousInquiry, zone, topic: 'cost', phase: 'subtotal' },
  }
}
