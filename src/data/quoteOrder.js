const normalize = (value) => String(value ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/\s+/g, ' ')
  .trim()

const volumePattern = /\b(\d+(?:[.,]\d+)?)\s*(cc|ml|litros?|lts?|galones?)\b/i
const packagePattern = /\b(\d+)\s*(envases?|botellas?|bidones?|canecas?|cajas?|unidades?)\b/i
const spokenCounts = new Map([
  ['un', 1], ['uno', 1], ['una', 1], ['dos', 2], ['tres', 3], ['cuatro', 4], ['cinco', 5],
  ['seis', 6], ['siete', 7], ['ocho', 8], ['nueve', 9], ['diez', 10], ['once', 11],
  ['doce', 12], ['trece', 13], ['catorce', 14], ['quince', 15], ['veinte', 20],
])

export function isQuoteChangeRequest(message) {
  return /\b(?:cambiar|cambio|corrige|corregir|modificar|modifico|ajustar|ajusto|equivoqu[eé]|no\s+es\s+correcto)\b/i.test(message)
}

export function getQuoteChangeTarget(message) {
  const normalized = normalize(message)
  if (/\b(?:cantidad|cuantos|cuantas|envases|botellas|unidades|presentacion|tamano)\b/.test(normalized)) return 'quantity'
  if (/\b(?:producto|productos|referencia|referencias)\b/.test(normalized)) return 'product'
  if (/\b(?:ciudad|entrega|direccion)\b/.test(normalized)) return 'delivery'
  return ''
}

export function parseQuoteQuantity(message, presentations = []) {
  const normalized = normalize(message)
  const productCount = normalized.match(/\b(\d+)\s+productos?\b/)
  const packageMatch = message.match(packagePattern)
  const volumeMatch = message.match(volumePattern)
  const spokenCountMatch = normalized.match(/\b(un|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|veinte)\s+(envases?|botellas?|bidones?|canecas?|cajas?|unidades?|productos?|de\b)/)
  const spokenCount = spokenCountMatch ? spokenCounts.get(spokenCountMatch[1]) : null
  const numbers = [...String(message).matchAll(/\b\d+(?:[.,]\d+)*\b/g)]
    .map((match) => ({ text: match[0], digits: match[0].replace(/\D/g, '') }))
  const knownPresentation = presentations.find((presentation) => {
    const label = normalize(presentation).replace(/\s/g, '')
    const mention = volumeMatch?.[0] ? normalize(volumeMatch[0]).replace(/\s/g, '') : ''
    const presentationNumber = String(presentation).match(/\d+(?:[.,]\d+)*/)?.[0]?.replace(/\D/g, '')
    return Boolean((mention && label === mention) || (
      presentationNumber && numbers.some((number) => number.digits === presentationNumber)
    ))
  })

  if (packageMatch) {
    const unitCount = Number(packageMatch[1])
    const presentation = knownPresentation || volumeMatch?.[0] || ''
    return {
      kind: 'quantity',
      unitCount,
      presentation,
      quantity: `${unitCount} ${packageMatch[2]}${presentation ? ` de ${presentation}` : ''}`,
    }
  }

  if (spokenCount && (knownPresentation || spokenCountMatch[2] !== 'de')) {
    if (/^productos?$/.test(spokenCountMatch[2]) && !knownPresentation) {
      return { kind: 'product-count', count: spokenCount }
    }
    return {
      kind: 'quantity',
      unitCount: spokenCount,
      presentation: knownPresentation || '',
      quantity: `${spokenCount} ${/^productos?$/.test(spokenCountMatch[2]) || spokenCountMatch[2] === 'de' ? 'unidades' : spokenCountMatch[2]}${knownPresentation ? ` de ${knownPresentation}` : ''}`,
    }
  }

  if (knownPresentation && numbers.length >= 2 && numbers[0].digits !== numbers.at(-1).digits) {
    const unitCount = Number(numbers[0].text)
    if (Number.isSafeInteger(unitCount) && unitCount > 0) {
      return {
        kind: 'quantity',
        unitCount,
        presentation: knownPresentation,
        quantity: `${unitCount} unidades de ${knownPresentation}`,
      }
    }
  }

  if (productCount && !volumeMatch) {
    return { kind: 'product-count', count: Number(productCount[1]) }
  }

  if (knownPresentation && numbers.length === 1) {
    return { kind: 'presentation', presentation: knownPresentation }
  }

  if (volumeMatch) {
    return { kind: 'quantity', quantity: `${volumeMatch[1]} ${volumeMatch[2]}`, presentation: '' }
  }

  return { kind: 'unknown' }
}
