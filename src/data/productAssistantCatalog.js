const genericProductWords = new Set(['naval', 'producto', 'productos', 'detergente', 'limpiador', 'liquido', 'liquida', 'para', 'de', 'y'])

const productAliasesByName = {
  Desengrasante: ['el desengrasante', 'desengrasante naval', 'desengrasante industrial'],
  'Detergente Multicocina': ['multicocina', 'detergente de cocina', 'jabon multicocina'],
  'Detergente Limpiador Multiusos': ['multiusos', 'limpiador multiusos', 'detergente multiusos'],
  'Limpia Vidrios': ['limpiavidrios', 'limpia vidrio', 'limpiador de vidrios'],
  'Des-Oxi Desincrustante': ['des oxi', 'desoxi', 'desincrustante'],
  'Jabón Líquido para Manos y Cuerpo': ['jabon de manos', 'jabon para manos', 'jabon manos y cuerpo'],
  'Shampoo de Alfombras': ['shampoo alfombras', 'champu de alfombras', 'limpiador de alfombras'],
  'Neutralizador de Olores': ['neutralizador', 'neutralizador de olor'],
  'Removedor de Ceras': ['removedor', 'removedor de cera'],
  'Sellador de Superficies': ['sellador', 'sellador de pisos'],
  'Lustra Muebles': ['lustramuebles', 'lustra muebles'],
  'Alcohol Industrial 70%': ['alcohol industrial', 'alcohol 70', 'alcohol al 70'],
  'Alcohol Etílico 96%': ['alcohol etilico', 'alcohol 96', 'alcohol al 96'],
  'Blanqueador 2.7% y 3.7%': ['blanqueador 2.7', 'blanqueador 3.7', 'blanqueador corriente'],
  'Blanqueador 5.25%': ['blanqueador 5.25', 'blanqueador al 5.25'],
  'Hipoclorito 13%': ['hipoclorito 13', 'hipoclorito al 13'],
  'Hipoclorito 15%': ['hipoclorito 15', 'hipoclorito al 15'],
  'Cera Polimérica': ['cera polimerica'],
  'Cera Emulsionada': ['cera emulsionada', 'cera emulsion'],
  'Multipropósito K': ['multiproposito k', 'multi proposito k'],
  Biovarsol: ['bio varsol'],
}

export function normalizeAssistantText(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9.%]+/g, ' ').replace(/\s+/g, ' ').trim()
}

const unique = (values) => [...new Set(values.filter(Boolean))]

function getAutomaticAliases(name) {
  const normalizedName = normalizeAssistantText(name)
  const meaningfulName = normalizedName.split(' ').filter((word) => !genericProductWords.has(word)).join(' ')
  return unique([normalizedName, meaningfulName])
}

export function buildProductAssistantCatalog(catalogProducts) {
  return catalogProducts.map(({ product, family }) => ({
    name: product.name,
    aliases: unique([...getAutomaticAliases(product.name), ...(productAliasesByName[product.name] ?? []).map(normalizeAssistantText)]),
    productUrl: `/${product.slug}`,
    technicalSheetUrl: product.technicalSheetHref || '',
    safetySheetUrl: product.safetySheetHref || '',
    summary: product.summary || '',
    dilution: product.dilution || '',
    safetySummary: product.safetySummary || '',
    presentations: product.presentations || [],
    category: family?.eyebrow || product.category || '',
    b2bUse: product.b2bUse || '',
  }))
}

function levenshteinDistance(left, right) {
  if (left === right) return 0
  if (!left.length) return right.length
  if (!right.length) return left.length
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex]
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(current[rightIndex - 1] + 1, previous[rightIndex] + 1, previous[rightIndex - 1] + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1))
    }
    previous.splice(0, previous.length, ...current)
  }
  return previous[right.length]
}

function aliasMatchesMessage(alias, normalizedMessage) {
  if (alias.length >= 4 && normalizedMessage.includes(alias)) return true
  const messageWords = normalizedMessage.split(' ')
  if (!alias.includes(' ') && alias.endsWith('r') && messageWords.includes(alias.slice(0, -1))) return false
  return alias.split(' ').every((aliasWord) => messageWords.some((messageWord) => {
    const allowedDistance = aliasWord.length >= 8 ? 2 : aliasWord.length >= 5 ? 1 : 0
    return levenshteinDistance(aliasWord, messageWord) <= allowedDistance
  }))
}

export function findAssistantProduct(message, productCatalog) {
  const normalizedMessage = normalizeAssistantText(message)
  return productCatalog
    .map((product) => ({ product, matchingAlias: product.aliases.filter((alias) => aliasMatchesMessage(alias, normalizedMessage)).sort((a, b) => b.length - a.length)[0] }))
    .filter(({ matchingAlias }) => matchingAlias)
    .sort((a, b) => b.matchingAlias.length - a.matchingAlias.length)[0]?.product ?? null
}

export function getProductAssistantResponse(message, productCatalog) {
  const normalizedMessage = normalizeAssistantText(message)
  const requestsSafetySheet = /\b(?:ficha|hoja|documento)\s+(?:de\s+)?seguridad\b|\bfds\b/.test(normalizedMessage)
  const requestsTechnicalSheet = !requestsSafetySheet && (
    /\b(?:ficha|hoja|documento)\s+(?:tecnica|del producto)\b/.test(normalizedMessage) ||
    /\bficha\s+(?:del?|sobre)\b/.test(normalizedMessage) ||
    /\bficha\s+[a-z0-9]/.test(normalizedMessage)
  )
  const requestsProductInfo = /\b(?:producto|informacion|conocer|consultar|ver)\b/.test(normalizedMessage)
  const requestsDilution = /\b(?:dilu(?:ir|yo|ye|yes|imos|yen)|dilucion|diluciones|dosificar|dosificacion|dosis|preparar|mezcla|mezclar|cuanto uso|cuanta agua)\b/.test(normalizedMessage)
  const requestsUse = /\b(?:para que sirve|como se usa|como usar|uso|usos|aplicacion|aplicar|sirve para|recomendado para)\b/.test(normalizedMessage)
  const requestsPresentations = /\b(?:presentacion|presentaciones|tamano|tamanos|contenido|envase|galon|litros|500 cc|1900 cc|3800 cc|20 l)\b/.test(normalizedMessage)
  const requestsSafetyAdvice = /\b(?:seguro|seguridad|precaucion|precauciones|riesgo|riesgos|proteccion|epp|ingerir|ojos|piel)\b/.test(normalizedMessage)
  const product = findAssistantProduct(message, productCatalog)

  if (!product && !requestsTechnicalSheet && !requestsSafetySheet && !requestsProductInfo && !requestsDilution && !requestsUse && !requestsPresentations && !requestsSafetyAdvice) return null
  if (!product) return { text: 'Puedo ayudarte a encontrar un producto o sus fichas. Escríbeme el nombre del producto que necesitas.', actions: [{ label: 'Ver todos los productos', href: '/productos/todos' }] }

  if (requestsTechnicalSheet || requestsSafetySheet) {
    const actions = []
    if (requestsTechnicalSheet && product.technicalSheetUrl) actions.push({ label: 'Ver ficha técnica', href: product.technicalSheetUrl, external: true })
    if (requestsSafetySheet && product.safetySheetUrl) actions.push({ label: 'Ver ficha de seguridad', href: product.safetySheetUrl, external: true })
    actions.push({ label: 'Ver producto', href: product.productUrl })
    const documentName = requestsTechnicalSheet && requestsSafetySheet ? 'las fichas técnica y de seguridad' : requestsSafetySheet ? 'la ficha de seguridad' : 'la ficha técnica'
    const hasRequestedDocument = requestsTechnicalSheet ? Boolean(product.technicalSheetUrl) : Boolean(product.safetySheetUrl)
    return {
      text: hasRequestedDocument ? `Claro. Aquí puedes consultar ${documentName} de ${product.name} Naval. También puedes revisar la información completa del producto.` : `Encontré ${product.name}, pero el documento solicitado todavía no está disponible en el sitio. Puedes consultar la información completa del producto.`,
      actions,
    }
  }

  if (requestsDilution) {
    const dilutionItems = (Array.isArray(product.dilution)
      ? product.dilution
      : String(product.dilution || '').split(/(?<=\.)\s+(?=[A-ZÁÉÍÓÚÑ])/))
      .map((item) => item.trim())
      .filter(Boolean)
    const dilution = dilutionItems.join('\n• ')
    return {
      text: dilution
        ? `Dosificación de ${product.name}\n\n• ${dilution}\n\nImportante:\n• Valida siempre la etiqueta y la ficha técnica.\n• No mezcles productos químicos entre sí.`
        : `La dosificación de ${product.name} debe confirmarse en la etiqueta o con asesoría técnica, porque puede variar según la superficie y el nivel de suciedad.`,
      actions: [
        ...(product.technicalSheetUrl ? [{ label: 'Ver ficha técnica', href: product.technicalSheetUrl, external: true }] : []),
        { label: 'Ver producto', href: product.productUrl },
      ],
    }
  }

  if (requestsPresentations) {
    const presentationText = product.presentations.length ? product.presentations.join(', ') : 'por confirmar con el equipo comercial'
    return {
      text: `${product.name} está disponible en estas presentaciones publicadas: ${presentationText}. La disponibilidad final se confirma al cotizar.`,
      actions: [{ label: 'Ver producto', href: product.productUrl }],
    }
  }

  if (requestsSafetyAdvice) {
    return {
      text: product.safetySummary || `Para usar ${product.name}, sigue la etiqueta, utiliza los elementos de protección indicados, evita el contacto con ojos y no lo mezcles con otros productos.`,
      actions: [
        ...(product.safetySheetUrl ? [{ label: 'Ver ficha de seguridad', href: product.safetySheetUrl, external: true }] : []),
        { label: 'Ver producto', href: product.productUrl },
      ],
    }
  }

  if (requestsUse || requestsProductInfo) {
    return {
      text: product.summary || `Puedes consultar los usos, presentaciones y documentos disponibles de ${product.name} en su página de producto.`,
      actions: [{ label: 'Ver producto', href: product.productUrl }],
    }
  }

  return { text: `Claro. Aquí puedes consultar la información completa de ${product.name} Naval.`, actions: [{ label: 'Ver producto', href: product.productUrl }] }
}

const recommendationRules = [
  {
    pattern: /\b(?:marmol|marmoles)\b/,
    names: ['Cera Polimérica'],
    intro: 'Naval tiene una opción específica para proteger y dar brillo al mármol sellado:',
    reasons: { 'Cera Polimérica': 'genera una capa protectora y un acabado brillante en mármol sellado' },
    question: 'Antes de recomendar el proceso completo, ¿el mármol está sellado y buscas limpieza diaria o recuperar brillo?',
  },
  {
    pattern: /\b(?:grasa|grasoso|desengrasar|campana|horno|estufa|cocina)\b/,
    names: ['Desengrasante', 'Detergente Multicocina'],
    reasons: {
      Desengrasante: 'para grasa pesada en equipos, pisos y superficies de cocina',
      'Detergente Multicocina': 'para lavado diario de utensilios, loza, campanas y mesones',
    },
    question: '¿La grasa es de mantenimiento diario o está muy acumulada?',
  },
  { pattern: /\b(?:vidrio|vidrios|ventana|ventanas|espejo|espejos|cristal|cristales)\b/, names: ['Limpia Vidrios'], question: '¿Cuántos ventanales o qué tamaño aproximado de área limpias y con qué frecuencia?' },
  { pattern: /\b(?:alfombra|alfombras|tapete|tapetes|tapiceria|tapicerias)\b/, names: ['Shampoo de Alfombras'], question: '¿Necesitas limpieza rutinaria o tratar manchas y olores fuertes?' },
  { pattern: /\b(?:mal olor|malos olores|orina|basura|shut|neutralizar olor)\b/, names: ['Neutralizador de Olores'], question: '¿En qué área está el olor y qué tamaño aproximado tiene?' },
  { pattern: /\b(?:lavanderia|lavadora|ropa|textil|textiles)\b/, names: ['Detergente Navazul', 'Suavizante Textil'], question: '¿Cuántos kilos o cargas lavan por día y qué tipo de prendas manejan?' },
  {
    pattern: /\b(?:bano|banos|sanitario|sanitarios|inodoro|inodoros|ducha|duchas|desinfectar|desinfeccion|bacterias|germenes)\b/,
    names: ['Limpiador Desinfectante', 'Detergente Limpiador Multiusos'],
    reasons: {
      'Limpiador Desinfectante': 'para limpiar y desinfectar pisos, baños y superficies lavables',
      'Detergente Limpiador Multiusos': 'para la suciedad general de pisos, paredes, mesones y duchas',
    },
    question: '¿Tu prioridad es limpieza diaria, desinfección o remover sarro e incrustaciones?',
  },
  { pattern: /\b(?:oxido|incrustacion|sarro|lama)\b/, names: ['Des-Oxi Desincrustante'], question: '¿En qué superficie está la incrustación y qué tan extendida se encuentra?' },
  { pattern: /\b(?:brillo|abrillantar|proteger piso|pisos opacos)\b/, names: ['Limpiabrillo', 'Cera Polimérica'], question: '¿Qué material tiene el piso y está actualmente sellado o encerado?' },
  { pattern: /\b(?:manos|lavamanos|jabon corporal|sin fragancia)\b/, names: ['Jabón Líquido para Manos y Cuerpo', 'Jabón Líquido Sin Fragancia'], question: '¿Cuántos dispensadores o usuarios atenderías aproximadamente?' },
  { pattern: /\b(?:muebles|madera|escritorios)\b/, names: ['Lustra Muebles'], question: '¿Cuántos muebles o qué área aproximada mantienes y con qué frecuencia?' },
]

export function getProductRecommendationResponse(message, productCatalog) {
  const normalizedMessage = normalizeAssistantText(message)
  const asksForRecommendation = /\b(?:que producto|cual producto|recomienda|recomiendan|recomendacion|necesito limpiar|quiero limpiar|necesito lavar|quiero lavar|necesito productos|busco productos|productos para|sirve para|puedo usar)\b/.test(normalizedMessage)
  const matchingRule = recommendationRules.find(({ pattern }) => pattern.test(normalizedMessage))

  if (!matchingRule || (!asksForRecommendation && normalizedMessage.split(' ').length < 2)) return null

  const products = matchingRule.names
    .map((name) => productCatalog.find((product) => product.name === name))
    .filter(Boolean)

  if (!products.length) return null

  const productLines = products.map((product) => {
    const reason = matchingRule.reasons?.[product.name] || product.summary
    return `• ${product.name}${reason ? `: ${reason.replace(/\.$/, '')}` : ''}.`
  })
  return {
    text: `${matchingRule.intro || 'Para esa necesidad, estas son las opciones Naval más relevantes:'}\n\n${productLines.join('\n')}\n\n${matchingRule.question || '¿Qué tamaño tiene el área y con qué frecuencia realizas esta limpieza?'}`,
    actions: products.map((product) => ({ label: `Ver ${product.name}`, href: product.productUrl })),
  }
}
