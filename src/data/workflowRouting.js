const workflowStarters = {
  quote: /^\s*(?:📋\s*)?(?:(?:quiero|necesito|deseo)\s+)?(?:(?:solicitar|hacer|pedir)\s+)?(?:una\s+)?(?:cotizaci[oó]n|cotizar)\b/i,
  complaint: /^\s*(?:⚠️\s*)?(?:(?:quiero|necesito|deseo)\s+)?(?:(?:reportar|poner|registrar|hacer)\s+)?(?:un(?:a)?\s+)?(?:queja|reclamo)\b/i,
  training: /^\s*(?:🎓\s*)?(?:(?:quiero|necesito|deseo)\s+)?(?:(?:solicitar|agendar|programar|hacer)\s+)?(?:una\s+)?capacitaci[oó]n(?:es)?\b/i,
}

export function isWorkflowStarter(type, message) {
  return workflowStarters[type]?.test(String(message ?? '')) ?? false
}
