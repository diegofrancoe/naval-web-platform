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
  return catalogProducts.map(({ product }) => ({
    name: product.name,
    aliases: unique([...getAutomaticAliases(product.name), ...(productAliasesByName[product.name] ?? []).map(normalizeAssistantText)]),
    productUrl: `/${product.slug}`,
    technicalSheetUrl: product.technicalSheetHref || '',
    safetySheetUrl: product.safetySheetHref || '',
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
  const product = findAssistantProduct(message, productCatalog)

  if (!product && !requestsTechnicalSheet && !requestsSafetySheet && !requestsProductInfo) return null
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

  return { text: `Claro. Aquí puedes consultar la información completa de ${product.name} Naval.`, actions: [{ label: 'Ver producto', href: product.productUrl }] }
}
