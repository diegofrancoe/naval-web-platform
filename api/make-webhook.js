function extractWebhookReply(payload) {
  if (typeof payload === "string") {
    const trimmedPayload = payload.trim()

    if (trimmedPayload.startsWith("{") || trimmedPayload.startsWith("[")) {
      try {
        return extractWebhookReply(JSON.parse(trimmedPayload))
      } catch {
        return payload
      }
    }

    return payload
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const reply = extractWebhookReply(item)
      if (reply) return reply
    }
    return ""
  }
  if (!payload || typeof payload !== "object") return ""

  return (
    extractWebhookReply(payload.reply) ||
    extractWebhookReply(payload.message) ||
    extractWebhookReply(payload.answer) ||
    extractWebhookReply(payload.text) ||
    extractWebhookReply(payload.body?.reply) ||
    extractWebhookReply(payload.body?.message) ||
    extractWebhookReply(payload.body?.answer) ||
    extractWebhookReply(payload.body?.text) ||
    extractWebhookReply(payload.Body?.reply) ||
    extractWebhookReply(payload.Body?.message) ||
    extractWebhookReply(payload.Body?.answer) ||
    extractWebhookReply(payload.Body?.text) ||
    extractWebhookReply(payload.data?.reply) ||
    extractWebhookReply(payload.data?.message) ||
    extractWebhookReply(payload.data?.answer) ||
    extractWebhookReply(payload.data?.text) ||
    extractWebhookReply(payload.output?.reply) ||
    extractWebhookReply(payload.output?.message) ||
    extractWebhookReply(payload.output?.answer) ||
    extractWebhookReply(payload.output?.text) ||
    extractWebhookReply(payload.response?.reply) ||
    extractWebhookReply(payload.response?.message) ||
    extractWebhookReply(payload.response?.answer) ||
    extractWebhookReply(payload.response?.text) ||
    ""
  )
}

function isTechnicalWebhookAck(reply) {
  return /^(?:accepted|ok|success)$/i.test(String(reply ?? "").trim())
}

function buildFallbackReply(requestType) {
  if (requestType === "quote") {
    return "Gracias, recibimos tu solicitud de cotización. El equipo comercial de Naval revisará la información y te contactará por el canal que compartiste."
  }

  if (requestType === "complaint") {
    return "Gracias por contarnos lo ocurrido. Registramos tu solicitud para que el equipo de servicio al cliente pueda revisarla y darte respuesta."
  }

  if (requestType === "human") {
    return "Perfecto. Para conectarte con un asesor humano, indícame tu nombre, ciudad, teléfono, correo electrónico y motivo de contacto."
  }

  return "Gracias, recibimos tu mensaje. El equipo Naval revisará tu solicitud y te dará respuesta lo antes posible."
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const webhookUrl = process.env.MAKE_WEBHOOK_URL

  if (!webhookUrl) {
    return response.status(500).json({ error: 'MAKE_WEBHOOK_URL is not configured' })
  }

  try {
    const makeResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.body ?? {}),
    })

    const responseText = await makeResponse.text()
    let makePayload = {}

    if (responseText) {
      try {
        makePayload = JSON.parse(responseText)
      } catch {
        makePayload = responseText
      }
    }

    const extractedReply = extractWebhookReply(makePayload)
    const reply = extractedReply && !isTechnicalWebhookAck(extractedReply)
      ? extractedReply
      : buildFallbackReply(request.body?.requestType)
    const data =
      makePayload && typeof makePayload === 'object' && !Array.isArray(makePayload)
        ? { ...makePayload, reply }
        : { reply }

    if (!makeResponse.ok) {
      return response.status(502).json({
        error: 'Make webhook rejected the request',
        ...data,
      })
    }

    return response.status(200).json(data)
  } catch {
    return response.status(502).json({ error: 'Could not reach Make webhook' })
  }
}
