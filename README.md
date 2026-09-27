# NAVAL — AI Business Ecosystem

Ecosistema digital B2B de Productos Naval que combina plataforma web, catálogo, asistente comercial y automatización; el ERP operativo relacionado continúa en desarrollo privado.

## Objetivo

Ofrecer una experiencia web centralizada para consultar productos y documentos técnicos, conocer las soluciones de Naval y enviar solicitudes comerciales desde el catálogo, la tienda o el asistente del sitio.

## Funcionalidades implementadas

- Sitio corporativo con información de marca, sectores atendidos, líneas de producto y referencias visuales.
- Catálogo navegable con familias, productos, presentaciones e imágenes.
- Páginas individuales de producto con acceso a fichas técnicas y de seguridad públicas.
- Tienda orientada a preparar solicitudes de cotización; no procesa pagos directamente.
- Carrito y formularios comerciales.
- Asistente de producto basado en el catálogo incluido en el frontend, con tolerancia a errores ortográficos, recomendaciones, usos, diluciones, presentaciones y documentos.
- Chat comercial con contexto entre mensajes y recorridos guiados, dato por dato, para cotizaciones, capacitaciones, quejas, agendamientos y transferencia a atención humana.
- Función serverless que actúa como intermediaria entre el navegador y Make, con respuestas útiles aunque la automatización externa esté temporalmente fuera de servicio.
- Respaldo opcional mediante la API de Responses de OpenAI para preguntas abiertas; las claves permanecen únicamente en el servidor.
- Rutas por producto y sector, redirecciones compatibles con la estructura actual y fallback de SPA.
- Metadatos SEO, `robots.txt`, manifiesto web y generación automática del sitemap durante el build.

## Stack

- React 19
- React DOM 19
- Vite 7
- JavaScript y JSX
- CSS
- Función serverless en JavaScript
- Make como integración externa opcional
- Configuración de rutas SPA compatible con Vercel

## Arquitectura

- `src/main.jsx` monta la aplicación React.
- `src/App.jsx` contiene las vistas, navegación, catálogo, tienda y chat comercial.
- `src/data/productAssistantCatalog.js` construye las respuestas del asistente usando el catálogo local.
- `src/styles.css` contiene los estilos globales y responsivos.
- `src/assets/` contiene imágenes y videos importados por Vite; el catálogo de productos usa carga dinámica.
- `public/` contiene iconos, manifiesto, archivos SEO y documentos públicos enlazados desde los productos.
- `api/make-webhook.js` reenvía solicitudes al webhook de Make sin exponer su URL al navegador.
- `scripts/generate-sitemap.mjs` genera `public/sitemap.xml` antes de compilar.
- `vercel.json` conserva redirecciones, cabeceras y el fallback de rutas.

La aplicación no incluye base de datos ni CRM propio. La automatización comercial, el almacenamiento de leads y las notificaciones dependen del flujo externo que se configure fuera de este repositorio.

## Requisitos

- Node.js 20.19 o superior, o Node.js 22.12 o superior
- npm 10 o superior

## Instalación

```bash
npm install
cp .env.example .env.local
npm run dev
```

Vite mostrará la dirección local en la terminal.

## Variables de entorno

| Variable | Entorno | Uso |
| --- | --- | --- |
| `MAKE_WEBHOOK_URL` | Servidor | URL privada del webhook de Make utilizada por la función serverless. |
| `OPENAI_API_KEY` | Servidor, opcional | Activa el respaldo para preguntas abiertas mediante la API de Responses cuando Make falla. |
| `OPENAI_MODEL` | Servidor, opcional | Modelo usado por el respaldo de OpenAI. Valor predeterminado: `gpt-4.1-mini`. |
| `VITE_MAKE_WEBHOOK_ENDPOINT` | Navegador, opcional | Sobrescribe la ruta pública usada por el frontend. Si está vacía, se usa `/api/make-webhook`. |

`MAKE_WEBHOOK_URL` y `OPENAI_API_KEY` no deben exponerse al navegador. Toda variable con prefijo `VITE_` forma parte del bundle público y no puede contener secretos, tokens ni credenciales.

El chat completa primero cada solicitud comercial dentro de la conversación y la envía a Make únicamente cuando ya tiene los datos necesarios. Si Make falla, responde con el respaldo de OpenAI para preguntas generales o con una guía local. Los enlaces de navegación y documentos se muestran cuando el cliente solicita verlos; el enlace de WhatsApp solo aparece cuando pide explícitamente hablar con una persona. Nunca confirma que una solicitud fue registrada cuando el webhook no pudo recibirla.

## Scripts

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: genera el sitemap y compila la aplicación en `dist/`.
- `npm run preview`: sirve localmente el build generado.

## Build

```bash
npm run build
```

El resultado se genera en `dist/`, carpeta excluida del control de versiones.

## Estado actual

El sitio corporativo, catálogo, fichas públicas, tienda de cotización, asistente local, chat comercial y proxy serverless están implementados. Para operar la automatización comercial en un entorno real se debe configurar de forma segura el webhook externo y validar el tratamiento de los datos recibidos.

Este es el README inicial del repositorio independiente. La documentación operativa detallada, mejoras funcionales y cambios de infraestructura se gestionarán posteriormente mediante ramas, commits y pull requests.
