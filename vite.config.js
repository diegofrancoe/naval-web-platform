import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import makeWebhookHandler from './api/make-webhook.js'

const MAX_LOCAL_API_BODY_SIZE = 128 * 1024

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(payload))
}

function createLocalApiResponse(response) {
  return {
    setHeader: response.setHeader.bind(response),
    status(statusCode) {
      response.statusCode = statusCode
      return this
    },
    json(payload) {
      sendJson(response, response.statusCode || 200, payload)
      return payload
    },
  }
}

function navalLocalApi() {
  return {
    name: 'naval-local-api',
    configureServer(server) {
      server.middlewares.use('/api/make-webhook', (request, response) => {
        let rawBody = ''
        let bodyTooLarge = false

        request.setEncoding('utf8')
        request.on('data', (chunk) => {
          rawBody += chunk
          if (rawBody.length > MAX_LOCAL_API_BODY_SIZE) bodyTooLarge = true
        })
        request.on('end', async () => {
          if (bodyTooLarge) {
            sendJson(response, 413, { error: 'Request body is too large' })
            return
          }

          let body = {}
          try {
            body = rawBody ? JSON.parse(rawBody) : {}
          } catch {
            sendJson(response, 400, { error: 'Invalid JSON body' })
            return
          }

          try {
            await makeWebhookHandler({ method: request.method, body }, createLocalApiResponse(response))
          } catch (error) {
            server.config.logger.error(`Local chatbot API failed: ${error?.message ?? 'Unknown error'}`)
            if (!response.writableEnded) sendJson(response, 500, { error: 'Chatbot service failed' })
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['MAKE_WEBHOOK_URL', 'OPENAI_API_KEY', 'OPENAI_MODEL']) {
    if (env[key]) process.env[key] = env[key]
  }

  return {
    plugins: [react(), navalLocalApi()],
  }
})
