import { useEffect, useMemo, useRef, useState } from 'react'
import {
  buildProductAssistantCatalog,
  findAssistantProduct,
  getProductAssistantResponse,
  getProductRecommendationResponse,
  normalizeAssistantText,
} from './data/productAssistantCatalog'
import {
  extractDailySolutionLiters,
  extractOperationSize,
  extractTrainingDate,
  extractTrainingTime,
  extractUsageFrequency,
  hasProductPackageQuantity,
  isAffirmativeAnswer,
  isAmbiguousProductInterest,
  isGenericProductReference,
  isDeliveryInformationRequest,
  isValidAttendeeAnswer,
  isValidAddressAnswer,
  isValidCityAnswer,
  parseDilutionMlPerLiter,
  parsePresentationMilliliters,
  wantsQuantityHelp,
} from './data/chatbotWorkflow'
import { getDeliveryAssistantResponse, shouldContinueDeliveryInquiry } from './data/deliveryAssistant'
import brandImage from './assets/naval.png'
import kitchenHeroImage from './assets/optimized/cocina-hero-fast.jpg'
import shopHeroVideo from './assets/video-tienda.mp4'
import cleaningHeroImage from './assets/optimized/limpieza-hero-fast.jpg'
import multiusosHeroImage from './assets/optimized/multiusos-hero-fast.jpg'
import limpiezaGeneralImage from './assets/optimized/limpiezageneral-fast.jpg'
import lavanderiaImage from './assets/optimized/lavanderia3-fast.jpg'
import desinfeccionImage from './assets/optimized/desinfeccion1-fast.jpg'
import pisosImage from './assets/optimized/pisos-fast.jpg'
import multicocinaImage from './assets/catalog-optimized/multicocina.jpg'
import desengrasanteImage from './assets/catalog-optimized/desengrasante.jpg'
import limpiezaGeneralProductImage from './assets/optimized/limpiezageneral1-fast.jpg'
import limpiezaGeneralProductAltImage from './assets/catalog-optimized/ENVASE 1.900-AMBIENTADOR TUTTI.jpg'
import productHeroVideo from './assets/video-producto.mp4'
const lineasHeroImage = kitchenHeroImage
const pedidoHeroImage = cleaningHeroImage
import factorySeoImage from './assets/optimized/quienes1-fast.jpg'
import aboutImageSecondary from './assets/optimized/somos1-fast.jpg'
import aboutHeroVideo from './assets/hero-about.mp4'
import aboutClientsImage from './assets/productos.png'
import hotelSectorImage from './assets/optimized/hotel-fast.jpg'
import kitchenSectorImage from './assets/optimized/cocinas-fast.jpg'
import laundrySectorImage from './assets/optimized/lavanderias-fast.jpg'
import restaurantSectorImage from './assets/optimized/restaurante-fast.jpg'
import gymSectorImage from './assets/optimized/gym-fast.jpg'
import homeSectorImage from './assets/optimized/hogar-fast.jpg'
import schoolSectorImage from './assets/optimized/colegio-fast.jpg'
import residentialSectorImage from './assets/optimized/conjunto-fast.jpg'
import businessSectorImage from './assets/optimized/empresarial-fast.jpg'
import modernoLogo from './assets/moderno.png'
import angloColombianoLogo from './assets/anglocolombiano.png'
import ovanteLogo from './assets/ovante.png'
import ofixLogo from './assets/ofix.png'
import provexpressLogo from './assets/provexpress.png'
import edexaLogo from './assets/edexa.png'
import surtitodoLogo from './assets/surtitodo.png'
import alliedLogo from './assets/allied.png'
import cachivachesLogo from './assets/cachivaches.png'
import lepasteLogo from './assets/lepaste.png'
import campestreLogo from './assets/campestre.png'
import brasaLogo from './assets/brasa.png'
import suministrosLogo from './assets/suministros.png'
import sancarlosLogo from './assets/sancarlos.png'
import venturaLogo from './assets/ventura1.png'
import cerrosLogo from './assets/cerros.png'
import sealIcon04 from './assets/NAVAL_ICONS-04.png'
import sealIcon08 from './assets/NAVAL_ICONS-08.png'
import sealIcon12 from './assets/NAVAL_ICONS-12.png'
import exampleImage1 from './assets/optimized/ejemplo1-fast.jpg'
import exampleImage2 from './assets/optimized/ejemplo2-fast.jpg'
import exampleImage3 from './assets/optimized/ejemplo3-fast.jpg'
import exampleImage4 from './assets/optimized/ejemplo4-fast.jpg'
import exampleImage5 from './assets/optimized/ejemplo5-fast.jpg'
import exampleImage6 from './assets/optimized/ejemplo6-fast.jpg'
import exampleImage7 from './assets/optimized/ejemplo7-fast.jpg'
import exampleImage8 from './assets/optimized/ejemplo8-fast.jpg'
import exampleImage9 from './assets/optimized/ejemplo9-fast.jpg'
import trainingImage1 from './assets/optimized/capacitaciones1-fast.jpg'
import trainingImage2 from './assets/optimized/capacitaciones2-fast.jpg'
import trainingImage3 from './assets/optimized/capacitaciones3-fast.jpg'

const aboutHeroVideoSrc = `${aboutHeroVideo}?v=20260622-play-once`

const assetModules = import.meta.glob(
  [
    './assets/catalog-optimized/*5G*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*ALCOHOL*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*AMBIENTADOR*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*BIOVARSOL*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*BLANQUEADOR*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*CERA*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*CHAMPU*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*CREMA*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*CREOLINA*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*DESENGRASANTE*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*DES-OXI*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*ENVASE*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*GALON*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*HIPOCLORITO*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*JABON*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*LIMPIABRILLO*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*LIMPIADOR*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*LIMPIAVIDRIOS*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*LUSTRAMUEBLES*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*MULTICOCINA*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*NEUTRALIZADOR*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*REMOVEDOR*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*SELLADOR*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*SELLANTE*.{png,jpg,jpeg,webp}',
    './assets/catalog-optimized/*SILICONA*.{png,jpg,jpeg,webp}',
  ],
  { eager: true, import: 'default' },
)

const actions = [
  {
    title: 'Quiénes somos',
    key: 'quienes-somos',
    href: '/',
  },
  {
    title: 'Productos',
    key: 'lineas',
    href: '/productos',
  },
  {
    title: 'Preguntas frecuentes',
    key: 'preguntas',
    href: '/preguntas-frecuentes',
  },
  {
    title: 'Tienda',
    key: 'pedido',
    href: '/tienda',
  },
]

const exampleImages = [
  { src: exampleImage1, alt: 'Ejemplo 1 de trabajos realizados' },
  { src: exampleImage2, alt: 'Ejemplo 2 de trabajos realizados' },
  { src: exampleImage3, alt: 'Ejemplo 3 de trabajos realizados' },
  { src: exampleImage4, alt: 'Ejemplo 4 de trabajos realizados' },
  { src: exampleImage5, alt: 'Ejemplo 5 de trabajos realizados' },
  { src: exampleImage6, alt: 'Ejemplo 6 de trabajos realizados' },
  { src: exampleImage7, alt: 'Ejemplo 7 de trabajos realizados' },
  { src: exampleImage8, alt: 'Ejemplo 8 de trabajos realizados' },
  { src: exampleImage9, alt: 'Ejemplo 9 de trabajos realizados' },
]

const whatsappHref = 'https://wa.me/573203428815'
const whatsappContactHref =
  'https://wa.me/573203428815?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20productos%20Naval.'
const emailContactHref =
  'mailto:servicioalcliente@productosnaval.com?subject=Solicitud%20de%20informaci%C3%B3n%20-%20Naval&body=Hola%2C%20quiero%20recibir%20informaci%C3%B3n%20sobre%20su%20portafolio.'
const makeWebhookEndpoint = import.meta.env.VITE_MAKE_WEBHOOK_ENDPOINT || '/api/make-webhook'
const cookieConsentStorageKey = 'naval-cookie-consent'
const chatbotSessionStorageKey = 'naval-chatbot-session-id'
const chatbotSessionActivityStorageKey = 'naval-chatbot-session-last-activity'
const chatbotConversationStorageKey = 'naval-chatbot-conversation-v2'
const chatbotSessionInactivityLimit = 24 * 60 * 60 * 1000
const siteUrl = 'https://www.productosnaval.com'
const brandName = 'Productos NAVAL'
const localBusinessPhone = '+57 320 342 8815'

const chatbotQuotePrompt =
  'Hola, quiero solicitar una cotización institucional para soluciones de limpieza profesional. ¿Me pueden ayudar a elegir productos y presentaciones para mi empresa?'
const chatbotTrainingPrompt =
  'Hola, quiero solicitar una capacitación sobre uso, dosificación y aplicación de productos Naval para mi empresa.'
const chatbotAdvisorPrompt =
  'Hola, necesito asesoría comercial de NAVAL. ¿Me pueden ayudar a elegir los productos adecuados para mi empresa?'

function getProductQuotePrompt(productName) {
  return `Hola, quiero cotizar ${productName} para mi empresa.`
}

function getLineQuotePrompt(lineName) {
  return `Hola, quiero solicitar una cotización para la línea ${lineName}. ¿Me pueden recomendar productos, presentaciones y cantidades para mi operación?`
}

function getSectorQuotePrompt(sectorName) {
  return `Hola, quiero solicitar una cotización para el sector ${sectorName}. ¿Me pueden recomendar productos NAVAL adecuados para esta operación?`
}

function openNavalChatbot(message) {
  const normalizedMessage = typeof message === 'string' ? message.trim() : ''

  window.__navalPendingChatbotMessage = normalizedMessage
  window.dispatchEvent(
    new CustomEvent('naval:open-chatbot', {
      detail: normalizedMessage ? { message: normalizedMessage } : undefined,
    }),
  )
}

function useReliableHeroVideo({ loop = false, playbackRate = 1, holdLastFrame = false } = {}) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current

    if (!video) return undefined

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.autoplay = true
    video.controls = false
    video.loop = loop
    video.playbackRate = playbackRate
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.setAttribute('x5-playsinline', '')
    video.removeAttribute('controls')

    const playVideo = () => {
      if (document.hidden || (holdLastFrame && video.ended)) return
      video.play().catch(() => {})
    }

    const holdVideo = () => {
      if (holdLastFrame) video.pause()
    }

    const onVisibilityChange = () => {
      if (!document.hidden) playVideo()
    }

    video.load()
    const frameId = window.requestAnimationFrame(playVideo)
    const startupPlayTimers = [120, 420, 900].map((delay) => window.setTimeout(playVideo, delay))
    video.addEventListener('loadedmetadata', playVideo)
    video.addEventListener('loadeddata', playVideo)
    video.addEventListener('canplaythrough', playVideo)
    video.addEventListener('canplay', playVideo)
    video.addEventListener('ended', holdVideo)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.cancelAnimationFrame(frameId)
      startupPlayTimers.forEach((timerId) => window.clearTimeout(timerId))
      video.removeEventListener('loadedmetadata', playVideo)
      video.removeEventListener('loadeddata', playVideo)
      video.removeEventListener('canplaythrough', playVideo)
      video.removeEventListener('canplay', playVideo)
      video.removeEventListener('ended', holdVideo)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  })

  return videoRef
}

function ChatbotCtaButton({ className, children, ariaLabel, chatbotMessage, eventName = 'request_quote' }) {
  return (
    <button
      type="button"
      className={className}
      data-chatbot-message={chatbotMessage || undefined}
      data-event={eventName}
      onClick={() => openNavalChatbot(chatbotMessage)}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
const localBusinessEmail = 'servicioalcliente@productosnaval.com'
const defaultSeoKeywords = [
  'productos de limpieza profesional',
  'productos de limpieza industrial',
  'productos de aseo profesional',
  'productos biodegradables',
  'limpieza institucional',
  'limpieza empresarial',
  'desinfección profesional',
  'mantenimiento de superficies',
  'productos para limpieza industrial',
  'productos de limpieza Colombia',
  'productos de limpieza Bogotá',
  'proveedor de productos de limpieza',
  'productos para empresas',
  'productos para hoteles',
  'productos para restaurantes',
].join(', ')

const pageContent = {
  'quienes-somos': {
    eyebrow: 'Limpieza profesional',
    title: 'Expertos en limpieza profesional',
    heroTitlePrimary: 'EXPERTOS',
    heroTitleSecondary: 'EN LIMPIEZA',
    intro:
      'Naval nace para elevar la categoría de higiene profesional en el mercado B2B. Combinamos productos de limpieza profesional, desempeño y una lectura comercial clara para hoteles, restaurantes, distribuidores y operaciones institucionales.',
    seoTitle: 'Productos Naval',
    seoDescription:
      'Conoce a Naval: una marca de limpieza profesional para empresas, distribuidores y operaciones institucionales que buscan imagen premium, consistencia y respaldo B2B.',
    seoIntro:
      'Acompañamos empresas con soluciones profesionales de higiene, mantenimiento y operación institucional.',
    metrics: [
      {
        value: '+1000',
        label: 'empresas',
        description: 'Empresas y distribuidores que utilizan soluciones de limpieza especilizada Naval.',
      },
      {
        value: '35 años',
        label: 'trayectoria',
        description: 'Trayectoria en limpieza institucional, higiene y mantenimiento profesional para empresas.',
      },
      {
        value: 'B2B',
        label: 'soluciones',
        description: 'Soluciones B2B para hoteles, restaurantes, oficinas y operaciones institucionales.',
      },
    ],
    aboutSection: {
      id: 'detalle',
      eyebrow: 'Quiénes somos',
      title: 'Limpieza Profesional Confiable',
      paragraphs: [
        'Naval desarrolla soluciones de limpieza profesional para restaurantes, hoteles, colegios, oficinas y distribuidores que necesitan procesos de higiene eficientes y operación constante.',
        'Creamos productos de limpieza industrial, desinfección institucional y mantenimiento profesional enfocados en operaciones B2B, consumo recurrente y necesidades empresariales reales.',
      ],
      tags: ['Operación diaria', 'Distribución B2B', 'Limpieza institucional', 'Soluciones empresariales'],
      bullets: [
        'Productos para hoteles, restaurantes, colegios y empresas.',
        'Soluciones diseñadas para limpieza institucional y operación diaria.',
        'Presentaciones industriales para recompra y distribución constante.',
        'Soporte comercial para empresas y distribuidores B2B.',
      ],
      image: factorySeoImage,
      imageAlt: 'Equipo y entorno visual de Naval en su sección de quiénes somos',
      imageLabel: 'Espacio para imagen institucional / equipo / planta',
      sideNote:
        'Marca colombiana enfocada en limpieza profesional e higiene empresarial.',
    },
    clientsSection: {
      eyebrow: 'Con quién trabajamos',
      title: 'Empresas y sectores que trabajan con NAVAL',
      intro:
        'Trabajamos con restaurantes, colegios, distribuidores, empresas e instituciones que requieren soluciones de limpieza profesional, higiene institucional y abastecimiento B2B confiable para su operación diaria.',
      groups: [
        { type: 'image', label: 'Ovante', image: ovanteLogo, featured: true },
        { type: 'image', label: 'Moderno', image: modernoLogo },
        { type: 'image', label: 'Anglo Colombiano', image: angloColombianoLogo },
        { type: 'image', label: 'Suministros', image: suministrosLogo, size: 'large' },
        { type: 'image', label: 'Ofix', image: ofixLogo },
        { type: 'image', label: 'Provexpress', image: provexpressLogo },
        { type: 'image', label: 'Edexa', image: edexaLogo },
        { type: 'image', label: 'Surtitodo', image: surtitodoLogo },
        { type: 'image', label: 'Allied', image: alliedLogo },
        { type: 'image', label: 'Cachivaches', image: cachivachesLogo },
        { type: 'image', label: 'Le Paste', image: lepasteLogo },
        { type: 'image', label: 'Campestre', image: campestreLogo },
        { type: 'image', label: 'Brasa', image: brasaLogo },
        { type: 'image', label: 'San Carlos', image: sancarlosLogo },
        { type: 'image', label: 'Ventura', image: venturaLogo },
        { type: 'image', label: 'Cerros', image: cerrosLogo },
      ],
    },
    processSection: {
      eyebrow: 'Cómo trabajamos',
      title: 'Implementación estratégica de limpieza profesional para empresas y operaciones B2B',
      intro: [
        'En Naval estructuramos procesos de limpieza profesional según el tipo de operación, frecuencia de uso, nivel de tráfico y necesidades reales de mantenimiento institucional. Trabajamos con empresas que requieren soluciones eficientes para higiene y operación diaria.',
        'Nuestro enfoque integra evaluación técnica, recomendación de productos industriales y acompañamiento comercial para optimizar abastecimiento, reposición y control operativo mediante soluciones de limpieza institucional adaptadas a cada entorno empresarial.',
      ],
      steps: [
        {
          index: '01',
          title: 'Diagnóstico operativo',
          text: 'Evaluamos consumo, superficies y necesidades operativas de cada espacio.',
        },
        {
          index: '02',
          title: 'Capacitación técnica',
          text: 'Capacitamos equipos para correcta aplicación y manejo de productos.',
        },
        {
          index: '03',
          title: 'Implementación eficiente',
          text: 'Utilizamos productos biodegradables y soluciones profesionales de alta calidad.',
        },
        {
          index: '04',
          title: 'Soporte empresarial',
          text: 'Transportamos y abastecemos pedidos según necesidades de cada operación.',
        },
      ],
      note: 'Soluciones orientadas a limpieza institucional, mantenimiento profesional y operaciones eficientes.',
    },
    valuesSection: {
      eyebrow: 'Valores',
      title: 'Espacios limpios, operación segura y respaldo técnico.',
      intro:
        'Soluciones de limpieza profesional e higiene institucional para empresas, con criterios técnicos de desempeño, continuidad operativa y cumplimiento sanitario cuando aplica.',
      values: [
        {
          title: 'Higiene profesional',
          icon: 'health',
          text: 'Productos formulados para apoyar rutinas de limpieza, desinfección y mantenimiento institucional.',
        },
        {
          title: 'Eficiencia',
          icon: 'efficiency',
          text: 'Soluciones pensadas para mantener un excelente rendimiento y continuidad operativa.',
        },
        {
          title: 'Respaldo técnico',
          icon: 'technical',
          text: 'Portafolio profesional enfocado en B2B, solución en limpieza, desempeño e INVIMA cuando aplica.',
        },
        {
          title: 'Confianza',
          icon: 'trust',
          text: 'La higiene profesional mejora experiencia, seguridad y percepción empresarial.',
        },
      ],
    },
    sealsSection: {
      eyebrow: 'Sellos de calidad',
      title: 'Respaldo para operaciones que necesitan consistencia.',
      intro:
        'Una marca pensada para compras empresariales, uso recurrente y rutinas donde la limpieza profesional debe sostenerse todos los días.',
      seals: [
        { title: 'Calidad controlada', icon: sealIcon04 },
        { title: 'Atención B2B', icon: sealIcon08 },
        { title: 'Continuidad de abastecimiento', icon: sealIcon12 },
      ],
    },
    footerSection: {
      eyebrow: 'Naval',
      title: 'Limpieza profesional para empresas que exigen más que un producto funcional.',
      text:
        'Base de footer lista para contacto comercial, ciudad, WhatsApp, correo, horario, links de portafolio y mensaje legal. Dejamos un texto editorial para mantener la estética premium mientras definimos el cierre final.',
      columns: [
        {
          title: 'Limpieza profesional',
          items: [
            { label: 'Productos y soluciones de limpieza profesional para hogares, empresas y espacios institucionales.', href: '/' },
            { label: 'Tratamiento de datos', href: '/politica-tratamiento-datos' },
            { label: 'Términos y condiciones', href: '/terminos-condiciones' },
          ],
        },
        {
          title: 'Líneas de producto',
          items: [
            { label: 'Limpieza general', href: '/productos/limpieza-general' },
            { label: 'Pisos y superficies', href: '/productos/pisos-y-superficies' },
            { label: 'Lavandería', href: '/productos/lavanderia' },
            { label: 'Higiene y desinfección', href: '/productos/higiene-y-desinfeccion' },
          ],
        },
        {
          title: 'Atención y cotizaciones',
          items: [
            { label: 'servicioalcliente@productosnaval.com', href: emailContactHref },
            { label: 'Asesoría por WhatsApp', href: whatsappContactHref, external: true },
            { label: 'Bogotá, Colombia', href: 'https://www.google.com/maps/search/?api=1&query=Bogot%C3%A1%2C%20Colombia', external: true },
          ],
        },
      ],
    },
    sections: [
      {
        title: 'Nuestra visión',
        text: 'Queremos que los productos de limpieza dejen de verse como un commodity y se conviertan en una decisión estratégica para negocios que cuidan percepción, experiencia y estándar.',
      },
      {
        title: 'Nuestro lenguaje',
        text: 'Naval habla con una estética pulida, una narrativa clara y una promesa simple: limpieza efectiva, presentación superior y orden comercial para crecer en cuentas B2B.',
      },
      {
        title: 'Cómo trabajamos',
        text: 'Diseñamos propuestas que pueden vivir bien en venta directa, distribución, catálogo institucional o introducción a cadenas, con una presencia visual mucho más robusta que el promedio del sector.',
      },
    ],
  },
  lineas: {
    eyebrow: 'Catálogo',
    title: 'Catálogo',
    intro:
      'Explora el portafolio Naval para empresas, hoteles, restaurantes e instituciones: aseo general, cuidado de pisos, lavandería y sanitización.',
    seoTitle: 'Líneas de Productos de Limpieza Profesional | NAVAL',
    seoDescription:
      'Líneas de productos NAVAL para limpieza general, desinfección profesional, lavandería y mantenimiento de superficies en empresas, hoteles y restaurantes.',
    seoKeywords:
      'higiene institucional, desinfección B2B, aseo profesional, lavandería institucional, mantenimiento de pisos, Naval Colombia',
    heroTitle: 'Productos de limpieza profesional para empresas e instituciones.',
    heroIntro:
      'Líneas de limpieza profesional, desinfección y mantenimiento diseñadas para operación empresarial, consumo institucional y uso diario en espacios de alto tráfico.',
    heroImage: lineasHeroImage,
    heroImageAlt: 'Presentación visual de líneas de producto Naval',
    featureTag: 'Catálogo B2B',
    featureTitle: 'Una arquitectura de línea pensada para operación diaria, compras institucionales y distribución.',
    featureText:
      'Cada familia agrupa soluciones de limpieza profesional con función operativa clara, lectura comercial rápida y aplicación real en espacios comerciales e institucionales.',
    metrics: [
      { value: '4', label: 'líneas estratégicas' },
      { value: '+30', label: 'productos en portafolio' },
      { value: 'B2B', label: 'enfoque operativo' },
    ],
    highlights: [
      {
        eyebrow: 'Lectura rápida',
        title: 'Clasificación por necesidad',
        text: 'Cada línea agrupa productos de limpieza y desinfección profesional según el frente operativo que el cliente necesita resolver.',
      },
      {
        eyebrow: 'Uso comercial',
        title: 'Base para cotizar mejor',
        text: 'La estructura sirve para fichas, listas técnicas, muestras, canal institucional y distribución.',
      },
    ],
    checklist: [
      'Clasificación alineada con el documento de dilución y dosificación Naval.',
      'Productos organizados por frente de uso y necesidad operativa real.',
      'Lectura útil para compras, supervisión, ama de llaves, mantenimiento y distribución.',
      'Presentaciones pensadas para operación diaria, reposición y compra empresarial.',
    ],
    sectors: [
      {
        title: 'Hotelero',
        text: 'Habitaciones, baños, zonas comunes y presentación diaria.',
        image: hotelSectorImage,
        imageAlt: 'Productos Naval para operación hotelera',
        href: '/sectores/hoteles',
      },
      {
        title: 'Colegios',
        text: 'Aulas, baños, cafeterías y zonas de alto tránsito.',
        image: schoolSectorImage,
        imageAlt: 'Soluciones Naval para colegios e instituciones educativas',
        href: '/sectores/colegios',
      },
      {
        title: 'Cocinas',
        text: 'Superficies, grasa, utensilios y rutinas de alto volumen.',
        image: kitchenSectorImage,
        imageAlt: 'Limpieza Naval para cocinas industriales',
        href: '/sectores/cocinas',
      },
      {
        title: 'Lavandería',
        text: 'Textiles, blancos, suavizado y procesos repetibles.',
        image: laundrySectorImage,
        imageAlt: 'Productos Naval para lavandería profesional',
        href: '/sectores/lavanderia',
      },
      {
        title: 'Conjunto residencial',
        text: 'Recepciones, zonas comunes, shut y mantenimiento diario.',
        image: residentialSectorImage,
        imageAlt: 'Limpieza Naval para conjuntos residenciales',
        href: '/sectores/conjuntos-residenciales',
      },
      {
        title: 'Hogar',
        text: 'Cocina, baños, vidrios, aromas y limpieza diaria en casa.',
        image: homeSectorImage,
        imageAlt: 'Productos Naval para limpieza del hogar',
        href: '/sectores/hogar',
      },
      {
        title: 'Empresarial',
        text: 'Oficinas, baños, salas y continuidad operativa.',
        image: businessSectorImage,
        imageAlt: 'Soluciones Naval para empresas',
        href: '/sectores/empresas',
      },
      {
        title: 'Restaurante',
        text: 'Cocina, comedor, baños y experiencia del cliente.',
        image: restaurantSectorImage,
        imageAlt: 'Productos Naval para restaurantes',
        href: '/sectores/restaurantes',
      },
      {
        title: 'Gym',
        text: 'Máquinas, vestieres, olores y superficies de contacto.',
        image: gymSectorImage,
        imageAlt: 'Soluciones Naval para gimnasios',
        href: '/sectores/gimnasios',
      },
    ],
    productFamilies: [
      {
        id: 'limpieza-general',
        eyebrow: 'Limpieza General',
        cardTitle: 'Limpieza general',
        cardText: 'Productos de limpieza general para mantener superficies, baños, cocinas y áreas de trabajo',
        cardCta: 'Ver línea de producto',
        title: 'Limpieza general para cocina, superficies, baños y rutinas de presentación diaria.',
        intro:
          'Productos diseñados para operaciones que requieren limpieza eficiente, presentación impecable y mantenimiento constante en espacios comerciales e institucionales.',
        image: limpiezaGeneralImage,
        imageAlt: 'Línea de limpieza general Naval',
        products: [
          {
            name: 'Detergente Multicocina',
            subtitle: 'Con color rojo y sin color',
            summary: 'Detergente líquido para lavado y desengrase en utensilios, loza, cristalería, cubiertos, campanas, mesones, pisos y superficies de cocina.',
            b2bUse: 'Cocinas industriales, restaurantes, casinos, hoteles y centros de producción que requieren una solución versátil para rutina e inmersión.',
            dilution: 'Rutina diaria: 50 ml por litro. Inmersión: 100 ml por litro. Limpieza profunda: 300 ml por litro.',
          },
          {
            name: 'Detergente Limpiador Multiusos',
            subtitle: 'Floral y sin fragancia',
            summary: 'Limpiador líquido para pisos, paredes, mesones, baños, escaleras, techos, gabinetes, duchas y otras superficies lavables.',
            b2bUse: 'Ideal para aseo institucional, oficinas, retail, hotelería y mantenimiento general de áreas interiores.',
            dilution: 'Limpieza media: 10 ml por litro. Limpieza profunda: 20 ml por litro. Choque: 300 ml por litro.',
          },
          {
            name: 'Desengrasante',
            summary: 'Desarrollado para remover grasas animales, vegetales, aceites y suciedad pesada sobre paredes, pisos, equipos, metales y superficies de cocina.',
            b2bUse: 'Recomendado para cocinas, plantas, cuartos técnicos y operaciones con grasa adherida o suciedad industrial.',
            dilution: 'Limpieza media: 10 ml por litro. Limpieza profunda: 50 ml por litro. También puede usarse puro según superficie.',
          },
          {
            name: 'Jabón Líquido Avena',
            subtitle: 'Fragancia avena',
            summary: 'Jabón líquido para manos y cuerpo con pH balanceado, agentes humectantes y fragancia avena para lavado frecuente.',
            b2bUse: 'Útil para baños institucionales, vestieres, hotelería, clínicas, oficinas y puntos de atención al público.',
            dilution: 'Rutina diaria: 300 ml por litro según recipiente o dispensador. También puede usarse puro.',
          },
          {
            name: 'Jabón Líquido Manzana',
            subtitle: 'Fragancia manzana',
            summary: 'Jabón líquido para manos y cuerpo con pH balanceado, agentes humectantes y fragancia manzana para lavado frecuente.',
            b2bUse: 'Útil para baños institucionales, vestieres, hotelería, clínicas, oficinas y puntos de atención al público.',
            dilution: 'Rutina diaria: 300 ml por litro según recipiente o dispensador. También puede usarse puro.',
          },
          {
            name: 'Jabón Líquido Sin Fragancia',
            subtitle: 'Sin fragancia',
            summary: 'Jabón líquido para manos y cuerpo con pH balanceado y agentes humectantes, pensado para operaciones que prefieren una opción sin fragancia.',
            b2bUse: 'Útil para baños institucionales, vestieres, clínicas, oficinas y puntos donde se busca una experiencia neutra.',
            dilution: 'Rutina diaria: 300 ml por litro según recipiente o dispensador. También puede usarse puro.',
          },
          {
            name: 'Jabón Líquido Canela',
            subtitle: 'Fragancia canela',
            summary: 'Jabón líquido para manos y cuerpo con pH balanceado, agentes humectantes y fragancia canela para lavado frecuente.',
            b2bUse: 'Útil para baños institucionales, vestieres, hotelería, oficinas y puntos de atención al público.',
            dilution: 'Rutina diaria: 300 ml por litro según recipiente o dispensador. También puede usarse puro.',
          },
          {
            name: 'Des-Oxi Desincrustante',
            subtitle: 'Desmanchador',
            summary: 'Especial para remover manchas de óxido e incrustaciones en pisos, sanitarios, tinas, senderos, superficies minerales y metálicas.',
            b2bUse: 'Pensado para mantenimiento correctivo en baños, zonas húmedas, parqueaderos y superficies con mancha mineral.',
            dilution: 'Limpieza media: 100 ml por litro. Limpieza profunda: uso puro según superficie.',
          },
          {
            name: 'Limpia Vidrios',
            summary: 'Limpiador y desengrasante profesional para cristales, espejos, lámparas, ventanas y superficies similares.',
            b2bUse: 'Ideal para fachadas interiores, housekeeping, mantenimiento locativo y acabados de presentación.',
            dilution: 'Limpieza media: 100 ml por litro. Limpieza profunda: uso puro según superficie.',
          },
          {
            name: 'Ambientador Limón',
            subtitle: 'Fragancia limón',
            summary: 'Aromatizador con fragancia cítrica para espacios cerrados y superficies que aporta sensación de frescura y limpieza.',
            b2bUse: 'Apoya percepción de limpieza en recepciones, baños, habitaciones, oficinas y zonas de atención al cliente.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
          {
            name: 'Ambientador Lavanda',
            subtitle: 'Fragancia lavanda',
            summary: 'Aromatizador profesional con fragancia lavanda para espacios cerrados, superficies, habitaciones y zonas comunes.',
            b2bUse: 'Ideal para habitaciones, baños, oficinas, recepciones y zonas donde se busca una experiencia aromática suave.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
          {
            name: 'Ambientador Canela',
            subtitle: 'Fragancia canela',
            summary: 'Aromatizador con fragancia canela para espacios cerrados y superficies que aporta una sensación cálida y agradable.',
            b2bUse: 'Útil para recepciones, zonas comunes, baños, oficinas y espacios comerciales con alto tránsito.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
          {
            name: 'Ambientador Tutti Frutti',
            subtitle: 'Fragancia tutti frutti',
            summary: 'Aromatizador con fragancia frutal para espacios cerrados y superficies que aporta frescura y recordación olfativa.',
            b2bUse: 'Recomendado para baños, zonas comunes, puntos de atención y espacios donde se busca una fragancia más expresiva.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
          {
            name: 'Ambientador Mar Fresco',
            subtitle: 'Fragancia mar fresco',
            summary: 'Aromatizador con fragancia marina para espacios cerrados y superficies que aporta una sensación limpia y ligera.',
            b2bUse: 'Adecuado para habitaciones, baños, pasillos, oficinas y zonas de atención al público.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
          {
            name: 'Ambientador Floral',
            subtitle: 'Fragancia floral',
            summary: 'Aromatizador con fragancia floral para espacios cerrados y superficies que aporta una sensación fresca y agradable.',
            b2bUse: 'Apoya presentación y experiencia en baños, recepciones, oficinas, habitaciones y zonas comunes.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
          {
            name: 'Shampoo de Alfombras',
            summary: 'Producto de limpieza profunda para alfombras, tapetes, cortinas, forros y tapicerías con manchas y malos olores.',
            b2bUse: 'Recomendado para hotelería, oficinas, auditorios, salas de espera y mantenimiento de textiles decorativos.',
            dilution: 'Limpieza media: 10 ml por litro. Limpieza profunda: 20 ml por litro. También puede usarse puro.',
          },
          {
            name: 'Biovarsol',
            subtitle: 'Desmanchador',
            summary: 'Limpiador especial para remover manchas y suciedad fuerte en plástico, vinilo, cerámica, madera, cuero, fórmica y metal.',
            b2bUse: 'Aplica para mantenimiento puntual de superficies duras, mobiliario y piezas con alto nivel de suciedad adherida.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
          {
            name: 'Crema Limpiadora',
            summary:
              'Ideal para brillar, desengrasar y proteger superficies y artículos de aluminio y acero inoxidable. No contiene abrasivos, por lo que no raya las superficies y deja un agradable aroma.',
            b2bUse:
              'Recomendada para cocinas, restaurantes, hoteles, oficinas y mantenimiento de superficies metálicas de presentación.',
            dilution: 'Aplicar puro con paño o esponja suave. Retirar y pulir según superficie.',
          },
          {
            name: 'Multipropósito K',
            subtitle: 'Desengrasante',
            summary: 'Alternativa desengrasante para remover grasas, aceites y suciedad compleja en cocina, industria y superficies técnicas.',
            b2bUse: 'Conveniente para operaciones con necesidad de ataque focalizado sobre grasa industrial o suciedad pesada.',
            presentations: ['1.900 CC', '3.800 CC', '5 GALONES'],
            dilution: 'Limpieza media: 100 ml por litro. Limpieza profunda: uso puro según superficie.',
          },
        ],
      },
      {
        id: 'lavanderia',
        eyebrow: 'Lavandería',
        cardTitle: 'Lavandería',
        cardText: 'Soluciones para lavandería institucional, textiles, blancos y operación hotelera recurrente.',
        cardCta: 'Ver línea de producto',
        title: 'Lavandería para textiles, blancos institucionales y procesos de lavado con repetibilidad.',
        intro:
          'Esta línea responde a procesos de lavado donde importan rendimiento, cuidado del textil, control de olor y consistencia entre ciclos. Está pensada para lavanderías institucionales, hoteleras y operaciones de alto volumen.',
        image: lavanderiaImage,
        imageAlt: 'Línea de lavandería Naval',
        products: [
          {
            name: 'Detergente Navazul',
            summary: 'Detergente para limpieza profunda de textiles, útil en aguas duras y cargas con suciedad pesada y malos olores.',
            b2bUse: 'Apto para lavanderías de hotel, institucionales, clínicas, restaurantes y centros con alto recambio de ropa.',
            dilution: 'Carga media: 40 a 60 ml. Carga grande o industrial: 80 a 120 ml. Rutina diaria en superficies: 20 ml por litro.',
          },
          {
            name: 'Suavizante Textil',
            summary: 'Neutraliza cargas residuales del detergente y deja la ropa más suave, fresca y con aroma perdurable.',
            b2bUse: 'Ideal para blancos de hotelería, mantelería, uniformes, toallas y prendas donde la experiencia final importa.',
            dilution: 'Carga media: 50 a 80 ml. Carga grande o industrial: 80 a 100 ml. Ajustable al gusto y proceso.',
          },
          {
            name: 'Blanqueador Oxigenado Activo',
            subtitle: 'Percarbonato de sodio',
            summary: 'Agente limpiador, blanqueador y desmanchador para ropa blanca y superficies, con perfil más versátil que el cloro.',
            b2bUse: 'Recomendado para lavandería de blancos, remojo previo y procesos donde se necesita desmanchar sin castigar tanto el textil.',
            dilution: 'Lavado normal: 15 a 30 g. Ropa muy sucia: 30 a 45 g. Carga completa: hasta 60 g. Mejor desempeño entre 40°C y 60°C.',
          },
        ],
      },
      {
        id: 'desinfeccion',
        eyebrow: 'Higiene y desinfección',
        cardTitle: 'Higiene y desinfección',
        cardText: 'Productos de desinfección profesional para superficies, zonas comunes y operación institucional.',
        cardCta: 'Ver línea de producto',
        title: 'Desinfección para superficies, control microbiológico y manejo de olores en operación profesional.',
        intro:
          'Soluciones de higiene profesional orientadas a espacios que exigen control, protección y limpieza constante en rutinas comerciales e institucionales.',
        image: desinfeccionImage,
        imageAlt: 'Línea de desinfección Naval',
        products: [
          {
            name: 'Limpiador Desinfectante',
            subtitle: 'Amonio cuaternario',
            summary: 'Limpia y desinfecta pisos, baños y superficies lavables, ayudando a controlar bacterias y gérmenes.',
            b2bUse: 'Útil para hotelería, oficinas, instituciones educativas, comercio y zonas de servicios sanitarios.',
            dilution: 'Limpieza media: 20 ml por litro. Limpieza profunda: 100 ml por litro. También puede usarse puro.',
          },
          {
            name: 'Neutralizador de Olores',
            subtitle: 'Citronela',
            summary: 'Neutraliza olores fuertes y apoya desinfección de superficies con residuos orgánicos o carga bacteriana.',
            b2bUse: 'Especial para shuts de basura, ascensores, zonas con orina animal, cuartos de residuos y puntos con olor persistente.',
            dilution: 'Limpieza media: 100 ml por litro. Limpieza profunda: uso puro según superficie.',
          },
          {
            name: 'Blanqueador 2.7% y 3.7%',
            summary: 'Desinfectante alcalino a base de hipoclorito de sodio con poder bactericida y blanqueador.',
            b2bUse: 'Funciona para sanitización general, baños, superficies lavables y rutinas de apoyo sanitario.',
            dilution: 'Limpieza media: 10 ml por litro. Limpieza profunda: 15 ml por litro. También puede usarse puro.',
          },
          {
            name: 'Blanqueador 5.25%',
            summary: 'Versión de mayor concentración para procesos de desinfección y blanqueo más exigentes.',
            b2bUse: 'Adecuado para operaciones que requieren respuesta más fuerte en lavado sanitario y blanqueo controlado.',
            dilution: 'Limpieza media: 5 ml por litro. Limpieza profunda: 10 ml por litro. También puede usarse puro.',
          },
          {
            name: 'Hipoclorito 13%',
            summary: 'Solución de alto poder oxidante, blanqueador y desinfectante para aplicaciones profesionales.',
            b2bUse: 'Pensado para procesos especializados donde se necesita concentración superior y control técnico de uso.',
            dilution: 'Limpieza media: 10 ml por litro. Limpieza profunda: uso puro según superficie.',
          },
          {
            name: 'Hipoclorito 15%',
            summary: 'Hipoclorito de alta concentración para desinfección y blanqueo de superficies en escenarios de alta exigencia.',
            b2bUse: 'Conveniente para aplicaciones industriales o protocolos con necesidad de mayor carga desinfectante.',
            dilution: 'Limpieza media: 10 ml por litro. Limpieza profunda: uso puro según superficie.',
          },
          {
            name: 'Alcohol Industrial 70%',
            summary: 'Solución lista para limpieza y desinfección de superficies de uso general.',
            b2bUse: 'Útil para estaciones rápidas de limpieza, equipos, superficies de contacto y rutinas de apoyo sanitario.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
          {
            name: 'Alcohol Etílico 96%',
            summary: 'Alcohol de uso profesional para preparación de soluciones y desinfección rápida.',
            b2bUse: 'Ideal para entornos técnicos y operativos donde se requiere un insumo base para procesos controlados.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
          {
            name: 'Creolina',
            summary: 'Producto de uso industrial para desinfección y desodorización en superficies con alta carga de bacterias y olores fuertes.',
            b2bUse: 'Apto para bodegas de reciclaje, shuts de basura y áreas con exigencia extrema de control microbiológico.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
        ],
      },
      {
        id: 'pisos-superficies',
        eyebrow: 'Pisos y superficies',
        cardTitle: 'Pisos y superficies',
        cardText: 'Productos para recuperación, mantenimiento y limpieza profesional de superficies.',
        cardCta: 'Ver línea de producto',
        title: 'Tratamiento y mantenimiento para pisos, acero, mobiliario y superficies que deben conservar apariencia.',
        intro:
          'Procesos especializados para recuperación, mantenimiento y conservación de superficies de alto tráfico donde la apariencia comunica orden, cuidado y nivel profesional.',
        image: pisosImage,
        imageAlt: 'Línea de tratamiento y mantenimiento de pisos y superficies Naval',
        products: [
          {
            name: 'Removedor de Ceras',
            summary: 'Removedor concentrado para atacar ceras envejecidas, polímeros deteriorados y capas acumuladas en pisos tratados.',
            b2bUse: 'Etapa previa en programas de restauración, recuperación o cambio de sistema de mantenimiento de pisos.',
            dilution: 'Limpieza media: 100 ml por litro. Limpieza profunda: uso puro según superficie y tiempo de acción.',
          },
          {
            name: 'Cera Polimérica',
            subtitle: 'Auto brillante',
            summary: 'Emulsión de polímeros que protege, embellece y da brillo con alta resistencia al tráfico y sin exigir pulido constante.',
            b2bUse: 'Recomendada para baldosa, vinilo, granito, mármol sellado y concreto pulido en operaciones de alto tránsito.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
          {
            name: 'Cera Brillo',
            subtitle: 'Mantenedor',
            summary: 'Restaura el desgaste de ceras y selladores, protegiendo superficies y sosteniendo su apariencia.',
            b2bUse: 'Aporta mantenimiento periódico en pisos institucionales que ya trabajan con sistemas poliméricos.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
          {
            name: 'Cera Emulsionada',
            summary: 'Producto para mantenimiento, protección y brillo de pisos que requieren acabado con máquina.',
            b2bUse: 'Adecuada para granito sellado, tableta, baldosa, vinilo y pisos sintéticos con rutinas de brillo mecánico.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
          {
            name: 'Limpiabrillo',
            subtitle: 'Mantenedor ligero',
            summary: 'Limpia, protege y da brillo en una sola aplicación, ayudando a sostener el acabado diario de diferentes pisos.',
            b2bUse: 'Ideal para mantenimiento liviano en hotelería, oficinas, retail y superficies donde importa la apariencia diaria.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
          {
            name: 'Sellador de Superficies',
            summary: 'Genera una película protectora y duradera con buena resistencia al tráfico en pisos porosos y lisos.',
            b2bUse: 'Funciona como base técnica para sistemas de mantenimiento donde se busca reducir desgaste y frecuencia de intervención.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
          {
            name: 'Lustrador de Acero Inoxidable',
            summary: 'Lustra, protege y mejora apariencia de acero inoxidable y aluminio sin rayar la superficie.',
            b2bUse: 'Pensado para ascensores, divisiones, mesones, neveras, dispensadores, sillas y pasamanos.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
            presentations: ['1.900 CC', '3.800 CC', '5 GALONES'],
          },
          {
            name: 'Lustra Muebles',
            summary: 'Aporta limpieza, mantenimiento y brillo a muebles y superficies en madera o materiales similares.',
            b2bUse: 'Útil para recepción, oficinas, habitaciones, salas y mobiliario de uso institucional o comercial.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
          {
            name: 'Silicona',
            summary: 'Mantiene y recupera apariencia en superficies plásticas, carcasas negras y piezas que requieren una película protectora brillante.',
            b2bUse: 'Aplica en muebles plásticos, equipos de oficina, patas de escritorio y mobiliario con acabado sintético.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
          {
            name: 'Varsol',
            summary: 'Disolvente industrial para limpieza, desengrase y dilución de grasas, aceites y pinturas.',
            b2bUse: 'Complementa tareas técnicas y de mantenimiento correctivo en ambientes industriales y talleres.',
            dilution: 'Uso puro. No se mezcla ni se diluye.',
          },
        ],
      },
    ],
  },
  preguntas: {
    eyebrow: 'PREGUNTAS FRECUENTES',
    title: 'Preguntas frecuentes sobre productos y soluciones de limpieza',
    intro:
      'Resuelve dudas sobre productos de limpieza profesional, compras online, atención empresarial y soluciones para distintos espacios.',
    seoTitle: 'Preguntas frecuentes sobre productos de limpieza | Naval',
    seoDescription:
      'Resolvemos dudas frecuentes sobre productos de limpieza, desengrasantes, detergentes, fichas técnicas, uso, cobertura y atención de Naval.',
    heroImage: null,
    heroImageAlt: null,
    featureTag: 'Confianza comercial',
    featureTitle: 'Una estructura pensada para resolver objeciones y acelerar decisiones.',
    featureText:
      'Las preguntas frecuentes se convierten en una herramienta de venta: explican el foco B2B, ordenan expectativas y reducen dudas en el proceso comercial.',
    metrics: [
      { value: 'FAQ', label: 'en formato comercial' },
      { value: 'Menos', label: 'fricción en contacto' },
      { value: 'Más', label: 'claridad de compra' },
    ],
    highlights: [
      {
        eyebrow: 'Soporte',
        title: 'Respuestas útiles',
        text: 'El contenido aclara alcance, propuesta y posibilidades sin complicar al usuario.',
      },
      {
        eyebrow: 'Conversión',
        title: 'Decisión más rápida',
        text: 'Menos dudas significa una conversación comercial más directa y mejor enfocada.',
      },
    ],
    checklist: [
      'Resuelve preguntas de operación y compra.',
      'Alinea expectativas desde el primer contacto.',
      'Fortalece credibilidad de la marca.',
      'Ayuda a convertir interés en oportunidad.',
    ],
    sections: [
      {
        title: '¿Dónde comprar productos de limpieza profesional NAVAL en Colombia?',
        text: 'Puedes comprar productos NAVAL directamente desde nuestra tienda online, solicitar atención personalizada por WhatsApp o recibir asesoría comercial según el tipo de producto y presentación que necesites.',
      },
      {
        title: '¿Qué tipo de productos de limpieza ofrece NAVAL?',
        text: 'El catálogo incluye desengrasantes, jabones líquidos, ambientadores, limpiavidrios, productos para pisos, soluciones de lavandería y alternativas para limpieza y mantenimiento diario.',
      },
      {
        title: '¿Cómo elegir el producto de limpieza adecuado?',
        text: 'Cada producto está diseñado para un uso específico. Puedes revisar las categorías, aplicaciones y recomendaciones de uso o solicitar asesoría para encontrar la mejor solución según la superficie y necesidad.',
      },
      {
        title: '¿NAVAL vende productos al por mayor o institucionales?',
        text: 'Sí. Ofrecemos atención para pedidos por volumen, reposición recurrente, distribuidores y solicitudes institucionales según disponibilidad y presentación.',
      },
      {
        title: '¿Se pueden solicitar cotizaciones o asesoría comercial?',
        text: 'Sí. Puedes contactar al equipo NAVAL para recibir orientación sobre productos, cantidades, disponibilidad, aplicaciones y recomendaciones según tu necesidad.',
      },
    ],
    worksSection: {
      eyebrow: 'NUESTROS TRABAJOS',
      title: 'Resultados reales en limpieza y desinfección',
      intro:
        'Casos y soluciones reales de limpieza profesional, mantenimiento de superficies y aplicación de productos para empresas, hogares y espacios comerciales.',
      images: [
        {
          label: 'Desgaste operativo',
          title: 'Superficie afectada por acumulación y desgaste operativo',
          image: exampleImage1,
          alt: 'Antes de limpieza profesional en superficie industrial con suciedad adherida',
        },
        {
          label: 'Acabado recuperado',
          title: 'Superficie recuperada con acabado profesional',
          image: exampleImage2,
          alt: 'Después de limpieza profesional con superficie recuperada y acabado limpio',
        },
        {
          label: 'Rutina diaria',
          title: 'Aplicación profesional en rutina operativa',
          image: exampleImage3,
          alt: 'Aplicación de producto de limpieza profesional en mantenimiento de superficies',
        },
        {
          label: 'Limpieza uniforme',
          title: 'Resultado visual limpio y uniforme',
          image: exampleImage4,
          alt: 'Resultado de producto profesional aplicado para recuperar limpieza y presentación',
        },
      ],
    },
      trainingSection: {
        eyebrow: 'CAPACITACIONES',
        title: 'Formación técnica y certificación para limpieza profesional',
        intro:
          'Capacitamos equipos operativos, supervisores y personal de aseo en el uso seguro, dosificación y aplicación correcta de productos de limpieza profesional para mejorar resultados, reducir desperdicio y fortalecer los protocolos de operación.',
        bottomText:
          'Naval realiza capacitación para empresas, instituciones y equipos de aseo. Nuestros programas de formación ayudan a mejorar la productividad del personal, optimizar el uso de productos químicos, reducir errores de aplicación y fortalecer los protocolos de limpieza profesional. Al finalizar, los participantes reciben certificación técnica de asistencia.',
        seoText:
          'Capacitación técnica en limpieza profesional para empresas e instituciones: uso correcto de productos, dosificación, aplicación segura, almacenamiento, rotulación, EPP, fichas de seguridad, Sistema Globalmente Armonizado y protocolos de aseo para equipos operativos.',
        highlights: [
        {
          title: 'Uso correcto, dosificación y aplicación',
          text: 'Aprende a seleccionar el producto adecuado, interpretar etiquetas, preparar diluciones correctas y aplicar cada solución según el área, la frecuencia de limpieza y el tipo de suciedad.',
        },
        {
          title: 'Seguridad química y manejo responsable',
          text: 'Capacitación en hojas de seguridad (SDS), Sistema Globalmente Armonizado (SGA), pictogramas, compatibilidad química, almacenamiento seguro, rotulación de envases y uso correcto de elementos de protección personal.',
        },
        {
          title: 'Protocolos y buenas prácticas operativas',
          text: 'Implementación de rutinas de limpieza, desinfección y mantenimiento para mejorar la seguridad, la eficiencia operativa y la estandarización de procesos en empresas e instituciones.',
        },
      ],
      images: [
        {
          label: '1',
          title: 'Aplicación correcta',
          caption: 'Uso seguro de productos',
          image: trainingImage1,
          alt: 'Capacitación Naval sobre aplicación segura de productos de limpieza profesional',
        },
        {
          label: '2',
          title: 'Dosificación y seguridad',
          caption: 'Menor desperdicio y mejores resultados',
          image: trainingImage2,
          alt: 'Capacitación técnica Naval sobre dosificación de productos de limpieza en operación',
        },
        {
          label: '3',
          title: 'Certificación técnica',
          caption: 'Personal capacitado y certificado',
          image: trainingImage3,
          alt: 'Certificación técnica Naval para equipos de aseo en instituciones y empresas',
        },
      ],
    },
    happyClientsSection: {
      eyebrow: 'Por qué NAVAL',
      title: 'Comentarios de clientes que confían en Naval.',
      intro:
        'Opiniones y experiencias de clientes que utilizan nuestros productos de limpieza profesional en su operación diaria.',
      comments: [
        {
          name: 'Brasa Restaurante',
          logo: brasaLogo,
          sector: 'Restaurante',
          text: 'Nos ha funcionado muy bien para mantener las cocinas y zonas de servicio limpias durante toda la operación. También nos gusta que las presentaciones duran bastante.',
        },
        {
          name: 'Ovante Distribuciones',
          logo: ovanteLogo,
          sector: 'Distribuciones',
          text: 'El portafolio tiene buena rotación porque hay productos para diferentes tipos de clientes y necesidades. Además las presentaciones son prácticas para distribuir.',
        },
        {
          name: 'Gimnasio Moderno',
          logo: modernoLogo,
          sector: 'Colegio',
          text: 'Nos ha servido para mantener una limpieza constante en diferentes espacios del colegio y facilitar la reposición de productos durante el mes.',
        },
      ],
    },
  },
  pedido: {
    eyebrow: 'Tienda',
    title: 'Tienda Hogar Naval',
    intro:
      'Próximamente tendremos una experiencia de compra especializada para el hogar.',
    seoTitle: 'Tienda Hogar Naval | Productos de limpieza para el hogar',
    seoDescription:
      'Muy pronto podrás comprar productos de limpieza Naval para el hogar desde nuestra tienda especializada.',
    heroImage: pedidoHeroImage,
    heroImageAlt: 'Visual de pedido y conversión comercial Naval',
    featureTag: 'Conversión',
    featureTitle: 'Un espacio de contacto diseñado para abrir conversaciones comerciales reales.',
    featureText:
      'La estructura prioriza claridad, agilidad y lectura de negocio para que un prospecto pueda avanzar rápido hacia pedido, cotización o muestra.',
    metrics: [
      { value: 'Directo', label: 'camino a contacto' },
      { value: 'B2B', label: 'enfoque de atención' },
      { value: 'Claro', label: 'brief comercial' },
    ],
    highlights: [
      {
        eyebrow: 'Pedidos',
        title: 'Solicitud mejor orientada',
        text: 'La marca puede capturar contexto, necesidad y volumen desde el primer mensaje.',
      },
      {
        eyebrow: 'Seguimiento',
        title: 'Contacto con intención',
        text: 'El objetivo es pasar de interés visual a conversación comercial concreta.',
      },
    ],
    checklist: [
      'Ruta simple para pedidos, muestras o cotizaciones.',
      'Espacio listo para WhatsApp o formulario comercial.',
      'Mensaje alineado con canal institucional y reventa.',
      'Conversión cuidada sin perder tono premium.',
    ],
    sections: [
      {
        title: 'Pedido institucional',
        text: 'Cuéntanos qué tipo de operación manejas, volumen estimado y categorías de interés para construir una propuesta más precisa.',
      },
      {
        title: 'Distribución o reventa',
        text: 'Si buscas una línea con mejor presencia para tu portafolio, Naval puede estructurarse como una marca más competitiva para canal profesional.',
      },
      {
        title: 'Contacto directo',
        text: 'Podemos dejar aquí un formulario, un WhatsApp comercial o una ruta de atención para compras, muestras y desarrollo de cuentas.',
      },
    ],
  },
  guias: {
    eyebrow: 'GUÍAS Y RECURSOS',
    title: 'Guías y recursos de limpieza profesional',
    intro:
      'Recomendaciones prácticas para elegir, aplicar y mantener rutinas de limpieza profesional con productos Naval.',
    seoTitle: 'Guías de limpieza profesional | Naval',
    seoDescription:
      'Guías, recomendaciones y recursos sobre limpieza profesional, mantenimiento de superficies y aplicación de productos Naval.',
    noIndex: true,
    heroImage: cleaningHeroImage,
    heroImageAlt: 'Guías de limpieza profesional Naval para mantenimiento de superficies',
    featureTag: 'Recursos',
    featureTitle: 'Contenido útil para tomar mejores decisiones de limpieza.',
    featureText:
      'Esta página reúne criterios de selección, aplicación y mantenimiento para equipos de aseo, compradores institucionales y operaciones comerciales.',
    metrics: [
      { value: 'Guías', label: 'de aplicación' },
      { value: 'Uso', label: 'por superficie' },
      { value: 'Naval', label: 'como respaldo' },
    ],
    highlights: [
      {
        eyebrow: 'Selección',
        title: 'Elegir por necesidad',
        text: 'Identifica si necesitas desengrase, desinfección, mantenimiento de pisos, lavandería o limpieza general.',
      },
      {
        eyebrow: 'Aplicación',
        title: 'Uso responsable',
        text: 'Consulta recomendaciones generales y revisa siempre la ficha técnica o de seguridad cuando aplique.',
      },
    ],
    checklist: [
      'Guías básicas para limpieza profesional.',
      'Recomendaciones por tipo de superficie.',
      'Acceso rápido a productos y asesoría.',
      'Contenido preparado para crecer con artículos y casos de uso.',
    ],
    sections: [
      {
        title: 'Cómo elegir un producto de limpieza profesional',
        text: 'Define primero la superficie, el tipo de suciedad, la frecuencia de uso y el nivel de riesgo operativo. Con esa información es más fácil elegir entre detergentes, desengrasantes, desinfectantes o productos de mantenimiento.',
      },
      {
        title: 'Mantenimiento de superficies y pisos',
        text: 'Los pisos, vidrios, muebles y zonas de alto tráfico necesitan productos compatibles con el material y una rutina clara de aplicación para conservar apariencia y seguridad.',
      },
      {
        title: 'Uso de fichas técnicas y de seguridad',
        text: 'Antes de aplicar productos químicos, revisa recomendaciones de uso, dilución, elementos de protección personal, almacenamiento y compatibilidad con otras sustancias.',
      },
    ],
  },
  contacto: {
    eyebrow: 'CONTACTO',
    title: 'Contacto Naval',
    intro:
      'Solicita cotización, asesoría comercial o información sobre productos de limpieza institucional e industrial.',
    seoTitle: 'Contacto Naval | Solicita asesoría en productos de limpieza',
    seoDescription:
      'Contacta a Naval para solicitar cotización, asesoría comercial o información sobre productos de limpieza institucional e industrial en Bogotá y municipios aledaños.',
    noIndex: true,
    heroImage: factorySeoImage,
    heroImageAlt: 'Asesoría comercial Naval para productos de limpieza profesional',
    featureTag: 'Asesoría comercial',
    featureTitle: 'Un canal directo para resolver necesidades de limpieza profesional.',
    featureText:
      'Cuéntanos qué tipo de operación manejas, qué productos necesitas y en qué ciudad estás para orientar mejor tu cotización.',
    metrics: [
      { value: 'Bogotá', label: 'y municipios aledaños' },
      { value: 'WhatsApp', label: 'atención comercial' },
      { value: 'Cotiza', label: 'según tu operación' },
    ],
    highlights: [
      {
        eyebrow: 'WhatsApp',
        title: 'Respuesta comercial',
        text: 'Escríbenos para recibir orientación sobre productos, presentaciones, disponibilidad y cotización.',
      },
      {
        eyebrow: 'Cobertura',
        title: 'Bogotá y municipios aledaños',
        text: 'Atendemos empresas, instituciones, distribuidores y operaciones que requieren reposición o asesoría.',
      },
    ],
    checklist: [
      'WhatsApp comercial para asesoría rápida.',
      'Correo para solicitudes formales y cotizaciones.',
      'Cobertura en Bogotá y municipios aledaños.',
      'CTA directo para iniciar una cotización.',
    ],
    sections: [
      {
        title: 'WhatsApp',
        text: 'Escríbenos al WhatsApp comercial para solicitar asesoría, disponibilidad de productos o apoyo con una cotización.',
      },
      {
        title: 'Correo electrónico',
        text: 'Envía solicitudes formales a servicioalcliente@productosnaval.com con ciudad, producto de interés, cantidad estimada y datos de contacto.',
      },
      {
        title: 'Cotización y asesoría',
        text: 'Si no sabes qué producto elegir, el equipo Naval puede ayudarte a seleccionar una solución según superficie, frecuencia de uso, tipo de suciedad y presentación requerida.',
      },
    ],
  },
  'politica-tratamiento-datos': {
    eyebrow: 'Legal',
    title: 'Política de tratamiento de datos',
    intro:
      'Esta política explica cómo Productos Naval recopila, usa, conserva y protege los datos personales entregados por clientes, aliados, proveedores y visitantes del sitio.',
    seoTitle: 'Política de Tratamiento de Datos | Productos Naval',
    seoDescription:
      'Consulta la política de tratamiento de datos personales de Productos Naval para atención comercial, solicitudes, compras, cotizaciones y comunicaciones.',
    footerSection: null,
    legalSections: [
      {
        title: 'Responsable del tratamiento',
        text:
          'Productos Naval actúa como responsable del tratamiento de los datos personales recolectados por medio del sitio web, canales comerciales, WhatsApp, correo electrónico, formularios y solicitudes de cotización.',
      },
      {
        title: 'Datos que podemos solicitar',
        text:
          'Podemos recolectar nombre, empresa, teléfono, correo electrónico, ciudad, dirección de entrega, productos de interés, historial de solicitudes y comentarios enviados voluntariamente por el usuario.',
      },
      {
        title: 'Finalidades del tratamiento',
        text:
          'Usamos la información para preparar cotizaciones, confirmar disponibilidad, coordinar entregas, responder solicitudes, prestar servicio al cliente, enviar comunicaciones comerciales relacionadas con Naval y mejorar la experiencia del sitio.',
      },
      {
        title: 'Derechos del titular',
        text:
          'El titular puede conocer, actualizar, rectificar, solicitar prueba de autorización, pedir información sobre el uso de sus datos, revocar la autorización o solicitar la supresión cuando sea procedente según la normativa aplicable.',
      },
      {
        title: 'Canal de atención',
        text:
          'Para ejercer derechos sobre datos personales o realizar consultas, el titular puede escribir a servicioalcliente@productosnaval.com indicando su nombre, documento o datos de contacto y el detalle de la solicitud.',
      },
      {
        title: 'Conservación y seguridad',
        text:
          'La información se conserva durante el tiempo necesario para cumplir las finalidades informadas y obligaciones comerciales o legales. Naval aplica medidas razonables para proteger la información frente a acceso, uso o divulgación no autorizada.',
      },
    ],
  },
  'terminos-condiciones': {
    eyebrow: 'Legal',
    title: 'Términos y condiciones',
    intro:
      'Estos términos regulan el uso del sitio web de Productos Naval, la consulta del catálogo, las solicitudes de cotización, el uso del carrito y el contacto comercial.',
    seoTitle: 'Términos y Condiciones | Productos Naval',
    seoDescription:
      'Conoce los términos y condiciones de uso del sitio Productos Naval, catálogo, cotizaciones, disponibilidad, pagos y solicitudes por WhatsApp.',
    footerSection: null,
    legalSections: [
      {
        title: 'Uso del sitio',
        text:
          'El contenido del sitio está orientado a informar sobre productos de limpieza Naval, facilitar solicitudes de cotización y apoyar el contacto comercial. El usuario se compromete a entregar información veraz y usar el sitio de manera legítima.',
      },
      {
        title: 'Catálogo, imágenes y presentaciones',
        text:
          'Las imágenes, descripciones, presentaciones y textos del catálogo son referenciales y pueden actualizarse. La disponibilidad final de productos, tamaños y cantidades será confirmada por el equipo comercial antes del despacho.',
      },
      {
        title: 'Precios, pagos y cotizaciones',
        text:
          'Los valores indicados como por cotizar o por confirmar no constituyen una oferta definitiva. El precio final, impuestos, descuentos, transporte y condiciones de pago se validan según ciudad, disponibilidad, presentación y volumen solicitado.',
      },
      {
        title: 'Transporte y entregas',
        text:
          'Las condiciones de transporte dependen de la ciudad, presentación y cantidad solicitada. Cuando aplique transporte aparte, el equipo comercial lo informará antes de confirmar el pedido.',
      },
      {
        title: 'Solicitudes por WhatsApp',
        text:
          'Al enviar una solicitud por WhatsApp, el usuario autoriza a Productos Naval a contactarlo para responder, cotizar, confirmar disponibilidad, coordinar compra o resolver dudas sobre los productos seleccionados.',
      },
      {
        title: 'Propiedad intelectual',
        text:
          'La marca Naval, textos, imágenes, estructura visual y contenido del sitio pertenecen a sus titulares o se usan con autorización. No se permite copiar, reproducir o explotar el contenido sin autorización previa.',
      },
    ],
  },
}

const lineasProductOrder = ['limpieza-general', 'pisos-superficies', 'lavanderia', 'desinfeccion']
const productImageByName = {
  'Detergente Multicocina': multicocinaImage,
  'Detergente Limpiador Multiusos': limpiezaGeneralProductImage,
  Desengrasante: desengrasanteImage,
  Ambientador: limpiezaGeneralProductAltImage,
}
const productDilutionDataByName = {
  'Detergente Multicocina': {
    summary: 'Solución concentrada para cocinas profesionales que necesitan lavado eficiente, control de grasa y alto rendimiento en rutinas diarias de restaurantes, hoteles, casinos y servicios de alimentación.',
    dilution: [
      'Para rutina diaria: 50 ml/Pto a 1 parte de agua según recipiente o dispensador.',
      'Para inmersión: 100 ml/Pto a 1 L de agua según poceta.',
      'Para limpieza profunda: 300 ml/Pto a 1 L de agua.',
    ],
    safetySummary: 'Producto no inflamable. Evitar contacto con ojos y piel, no ingerir y no mezclar con otros productos.',
  },
  'Detergente Limpiador Multiusos': {
    summary: 'Detergente líquido recomendado para el lavado de todo tipo de superficies como pisos, paredes, mesones, baños, escaleras, automóviles, techos, gabinetes y duchas.',
    dilution: 'Limpieza media: 10 ml/Pto a 1 L de agua. Limpieza profunda: 20 ml/Pto a 1 L de agua. Limpieza más profunda: 300 ml/Pto a 1 L de agua.',
  },
  Desengrasante: {
    summary: 'Producto diseñado para eliminar grasas de origen animal, vegetal y derivadas del petróleo, grasas alquitranadas, aceites naturales y suciedad pesada en paredes, pisos, techos, puertas, equipos de cocina, maquinaria, plásticos, metales, cauchos sintéticos y utensilios.',
    dilution: 'Limpieza media: 10 ml/Pto a 1 L de agua. Limpieza profunda: 50 ml/Pto a 1 L de agua. También puede usarse puro según superficie.',
  },
  'Jabón Líquido para Manos y Cuerpo': {
    summary: 'Jabón líquido para manos y cuerpo con pH balanceado para todo tipo de piel. Deja sensación de suavidad y aroma, elaborado con agentes humectantes.',
    dilution: 'Para rutina diaria: 300 ml/Pto a 1 parte de agua según recipiente o dispensador. También puede usarse puro según reenvase o dispensador.',
  },
  'Jabón Líquido Avena': {
    summary: 'Jabón líquido para manos y cuerpo con pH balanceado, agentes humectantes y fragancia avena.',
    dilution: 'Para rutina diaria: 300 ml/Pto a 1 parte de agua según recipiente o dispensador. También puede usarse puro según reenvase o dispensador.',
  },
  'Jabón Líquido Manzana': {
    summary: 'Jabón líquido para manos y cuerpo con pH balanceado, agentes humectantes y fragancia manzana.',
    dilution: 'Para rutina diaria: 300 ml/Pto a 1 parte de agua según recipiente o dispensador. También puede usarse puro según reenvase o dispensador.',
  },
  'Jabón Líquido Sin Fragancia': {
    summary: 'Jabón líquido para manos y cuerpo con pH balanceado y agentes humectantes, en versión sin fragancia.',
    dilution: 'Para rutina diaria: 300 ml/Pto a 1 parte de agua según recipiente o dispensador. También puede usarse puro según reenvase o dispensador.',
  },
  'Jabón Líquido Canela': {
    summary: 'Jabón líquido para manos y cuerpo con pH balanceado, agentes humectantes y fragancia canela.',
    dilution: 'Para rutina diaria: 300 ml/Pto a 1 parte de agua según recipiente o dispensador. También puede usarse puro según reenvase o dispensador.',
  },
  'Des-Oxi Desincrustante': {
    summary: 'Producto especial para remover manchas de óxido en superficies minerales, sintéticas y metálicas como paredes, tinas, pisos, sanitarios, senderos con lama, parqueaderos y láminas de hierro o acero.',
    dilution: 'Limpieza media: 100 ml/Pto a 1 L de agua. Limpieza profunda: uso puro según superficie.',
  },
  'Limpia Vidrios': {
    summary: 'Limpiador y desengrasante profesional para cristales, espejos, lámparas, ventanas, parabrisas de automóviles y superficies similares.',
    dilution: 'Limpieza media: 100 ml/Pto a 1 L de agua. Limpieza profunda: uso puro según superficie.',
  },
  Ambientador: {
    summary: 'No aplicar en zonas que entren en contacto directo con alimentos.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  'Ambientador Limón': {
    summary: 'No aplicar en zonas que entren en contacto directo con alimentos.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  'Ambientador Lavanda': {
    summary: 'No aplicar en zonas que entren en contacto directo con alimentos.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  'Ambientador Canela': {
    summary: 'No aplicar en zonas que entren en contacto directo con alimentos.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  'Ambientador Tutti Frutti': {
    summary: 'No aplicar en zonas que entren en contacto directo con alimentos.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  'Ambientador Mar Fresco': {
    summary: 'No aplicar en zonas que entren en contacto directo con alimentos.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  'Ambientador Floral': {
    summary: 'No aplicar en zonas que entren en contacto directo con alimentos.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  'Shampoo de Alfombras': {
    summary: 'Producto de limpieza profunda especial para eliminar suciedad, manchas y malos olores en alfombras, tapetes, cortinas, forros y tapicerías.',
    dilution: 'Limpieza media: 10 ml/Pto a 1 L de agua. Limpieza profunda: 20 ml/Pto a 1 L de agua. También puede usarse puro según superficie.',
  },
  Biovarsol: {
    summary: 'Producto especial para quitar manchas, con agentes limpiadores y desengrasantes que ayudan a eliminar suciedad fuerte en plástico, vinilo, cerámica, madera, cuero, fórmica y metal.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  'Crema Limpiadora': {
    summary:
      'Ideal para brillar, desengrasar y proteger superficies y artículos de aluminio y acero inoxidable. No contiene abrasivos, por lo que no raya las superficies y deja un agradable aroma.',
    dilution: 'Aplicar puro con paño o esponja suave. Retirar residuos y pulir hasta obtener brillo según superficie.',
  },
  'Multipropósito K': {
    summary: 'Producto diseñado para eliminar grasas de origen animal, vegetal y derivadas del petróleo, grasas alquitranadas, aceites naturales y suciedad pesada en superficies de cocina, industria, plásticos, metales y cauchos sintéticos.',
    dilution: 'Limpieza media: 100 ml/Pto a 1 L de agua. Limpieza profunda: uso puro según superficie.',
  },
  'Detergente Navazul': {
    summary: 'Detergente para limpieza profunda de textiles y superficies, especial para aguas duras. Ayuda a remover suciedad pesada, manchas y malos olores sin maltratar la ropa.',
    dilution: [
      'Lavadora, carga media de 5-6 kg: 40-60 ml.',
      'Lavadora, carga grande de 20 kg: 100-120 ml.',
      'Superficies, limpieza diaria: 20 ml por 1 L de agua.',
      'Superficies, limpieza profunda: 30 ml por 1 L de agua.',
    ],
  },
  'Suavizante Textil': {
    summary: 'Suavizante textil que neutraliza las cargas negativas que los detergentes dejan sobre las prendas, proporcionando suavidad y aroma perdurable.',
    dilution: [
      'Lavadora, carga media de 5-6 kg: 50-80 ml.',
      'Lavadora, carga grande de 20 kg: 80-100 ml.',
    ],
  },
  'Blanqueador Oxigenado Activo': {
    summary: 'Agente limpiador y blanqueador para desmanchar, blanquear textiles y superficies, y apoyar desinfección. Es una alternativa ecológica y versátil para sustituir productos con cloro en muchas tareas.',
    dilution: '',
  },
  'Limpiador Desinfectante': {
    summary: 'Producto para limpieza y desinfección diaria de pisos, baños y superficies lavables con amonio cuaternario. Ayuda a dejar las áreas libres de gérmenes y bacterias.',
    dilution: 'Limpieza media: 20 ml/Pto a 1 L de agua. Limpieza profunda: 100 ml/Pto a 1 L de agua. También puede usarse puro según superficie.',
  },
  'Neutralizador de Olores': {
    summary: 'Producto especializado para neutralizar olores y desinfectar superficies como shuts de basura, ascensores, zonas con orina animal y lugares con olores fuertes.',
    dilution: 'Limpieza media: 100 ml/Pto a 1 L de agua. Limpieza profunda: uso puro según superficie.',
  },
  'Blanqueador 2.7% y 3.7%': {
    summary: 'Desinfectante alcalino a base de hipoclorito de sodio con poder blanqueador y bactericida.',
    dilution: [
      'Utensilios y equipos: 6-8 ml por 1 L de agua; tiempo de acción de 5-10 minutos.',
      'Paredes, techos y pisos: 10-15 ml por 1 L de agua; tiempo de acción de 10-15 minutos.',
      'Superficies y ambiente: 9 ml por 1 L de agua; tiempo de acción de 10-15 minutos.',
    ],
  },
  'Blanqueador 5.25%': {
    summary: 'Desinfectante alcalino a base de hipoclorito de sodio de mayor concentración, con poder blanqueador y bactericida.',
    dilution: [
      'Utensilios y equipos: 2-4 ml por 1 L de agua; tiempo de acción de 5-10 minutos.',
      'Paredes, techos y pisos: 4-6 ml por 1 L de agua; tiempo de acción de 10-15 minutos.',
      'Superficies: 4 ml por 1 L de agua; tiempo de acción de 10-15 minutos.',
    ],
  },
  'Hipoclorito 13%': {
    summary: 'Solución acuosa con alto poder blanqueador y desinfectante por su poder oxidante. Presenta olor característico penetrante e irritante.',
    dilution: [
      'Utensilios y equipos: 2-4 ml por 1 L de agua; tiempo de acción de 5-10 minutos.',
      'Paredes, techos y pisos: 4-6 ml por 1 L de agua; tiempo de acción de 10-15 minutos.',
      'Superficies: 4 ml por 1 L de agua; tiempo de acción de 10-15 minutos.',
    ],
  },
  'Hipoclorito 15%': {
    summary: 'Solución acuosa de alta concentración con poder blanqueador y desinfectante por su poder oxidante. Presenta olor característico penetrante e irritante.',
    dilution: [
      'Utensilios y equipos: 2-4 ml por 1 L de agua; tiempo de acción de 5-10 minutos.',
      'Paredes, techos y pisos: 4-6 ml por 1 L de agua; tiempo de acción de 10-15 minutos.',
      'Superficies: 4 ml por 1 L de agua; tiempo de acción de 10-15 minutos.',
    ],
  },
  'Alcohol Industrial 70%': {
    summary: 'Alcohol utilizado para la limpieza y desinfección de superficies en general.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  'Alcohol Etílico 96%': {
    summary: 'Alcohol etílico indicado para uso profesional, preparación de soluciones y desinfección rápida.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  Creolina: {
    summary: 'Producto de uso industrial para desinfección y desodorización, de color oscuro y olor fuerte, con alta capacidad para eliminar microorganismos en superficies con alta concentración de bacterias.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  'Removedor de Ceras': {
    summary: 'Removedor de alta concentración elaborado con tensoactivos y agentes que actúan sobre resinas acrílicas y polímeros envejecidos para limpiar a fondo superficies tratadas.',
    dilution: 'Limpieza media: 100 ml/Pto a 1 L de agua. Limpieza profunda: uso puro según superficie y tiempo de acción.',
  },
  'Cera Polimérica': {
    summary: 'Emulsión de polímeros que genera una capa protectora, embellece y da brillo sin necesidad de pulido constante en baldosa, vinilo, granito, mármol sellado y concreto pulido.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  'Cera Brillo': {
    summary: 'Mantenedor de ceras y selladores poliméricos que restaura el desgaste y ayuda a conservar las superficies en óptimas condiciones.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  'Cera Emulsionada': {
    summary: 'Producto para mantenimiento, protección y brillo de pisos. Es antideslizante, no grasoso y deja una película resistente al medio ambiente.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  Limpiabrillo: {
    summary: 'Producto líquido multifuncional con agentes limpiadores y abrillantadores para limpiar, proteger y dar brillo en una sola aplicación.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  'Sellador de Superficies': {
    summary: 'Emulsión de polímeros que genera una película protectora y duradera, dando acabado resistente a pisos porosos y lisos.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  'Lustrador de Acero Inoxidable': {
    summary: 'Producto ideal para lustrar, brillar y proteger superficies y artículos de acero inoxidable y aluminio sin rayar.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  'Lustra Muebles': {
    summary: 'Producto para limpieza y mantenimiento de superficies, dejando una película resistente, brillante y con agradable fragancia en muebles, escritorios, bibliotecas, mesas, archivadores y paredes en madera.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  Silicona: {
    summary: 'Producto para limpieza y mantenimiento de superficies con carcasa negra, muebles plásticos, patas de escritorios, mesas plásticas y equipos de oficina.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
  Varsol: {
    summary: 'Disolvente industrial derivado del petróleo, diseñado para limpieza, desengrase y dilución de sustancias grasas, aceites y pinturas.',
    dilution: 'Uso puro. No se mezcla ni se diluye con agua u otras sustancias.',
  },
}

const productDocumentLinksByName = {
  'Alcohol Etílico 96%': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/alcohol-etilico-96-ficha-tecnica.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/alcohol-etilico-96-ficha-seguridad.pdf',
  },
  'Alcohol Industrial 70%': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/alcohol-industrial-70-ficha-tecnica.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/alcohol-industrial-70-ficha-seguridad.pdf',
  },
  'Ambientador Limón': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/8 FT AMBIENTADOR.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/7 FDS AMBIENTADOR.pdf',
  },
  'Ambientador Lavanda': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/8 FT AMBIENTADOR.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/7 FDS AMBIENTADOR.pdf',
  },
  'Ambientador Canela': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/8 FT AMBIENTADOR.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/7 FDS AMBIENTADOR.pdf',
  },
  'Ambientador Tutti Frutti': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/8 FT AMBIENTADOR.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/7 FDS AMBIENTADOR.pdf',
  },
  'Ambientador Mar Fresco': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/8 FT AMBIENTADOR.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/7 FDS AMBIENTADOR.pdf',
  },
  'Ambientador Floral': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/8 FT AMBIENTADOR.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/7 FDS AMBIENTADOR.pdf',
  },
  Biovarsol: {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/10 FT BIOVARSOL NAVAL.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/9 FDS BIOVARSOL.pdf',
  },
  'Blanqueador 2.7% y 3.7%': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/blanqueador-27-37-ficha-tecnica.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/blanqueador-27-37-ficha-seguridad.pdf',
  },
  'Blanqueador 5.25%': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/14 FT BLANQUEADOR AL 5.25.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/13 FDS BLANQUEADOR AL 5.25.pdf',
  },
  'Cera Brillo': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/18  FT CERA BRILLO.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/17 FDS CERA BRILLO.pdf',
  },
  'Cera Emulsionada': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/20 FT CERA EMULSIONADA.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/19 FDS CERA EMULSIONADA.pdf',
  },
  'Cera Polimérica': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/22 FT CERA POLIMERICA.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/21 FDS CERA POLIMERICA.pdf',
  },
  'Shampoo de Alfombras': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/24 FT SHAMPOO ALFOMBRAS.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/23 FDS SHAMPOO ALFOMBRAS.pdf',
  },
  'Crema Limpiadora': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/26 FT LUSTRADOR DE ACERO INOXIDABLE.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/25 FDS LUSTRADOR DE ACERO INOXIDABLE.pdf',
  },
  'Lustrador de Acero Inoxidable': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/26 FT LUSTRADOR DE ACERO INOXIDABLE.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/25 FDS LUSTRADOR DE ACERO INOXIDABLE.pdf',
  },
  Creolina: {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/30 FTCREOLINA.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/27 FDS CREOLINA.pdf',
  },
  Desengrasante: {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/30 FT DESENGRASANTE (1).pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/29 FDS DESENGRASANTE.pdf',
  },
  'Des-Oxi Desincrustante': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/32 FT DES-OXI DESINCRUSTANTE.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/31 FDS DES-OXI Desincrustante.pdf',
  },
  'Hipoclorito 13%': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/hipoclorito-13-ficha-tecnica.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/hipoclorito-13-ficha-seguridad.pdf',
  },
  'Hipoclorito 15%': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/hipoclorito-15-ficha-tecnica.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/hipoclorito-15-ficha-seguridad.pdf',
  },
  'Jabón Líquido Avena': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/40 FT JABON PARA MANOS Y CUERPO.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/39 FDS JABON PARA MANOS Y CUERPO.pdf',
  },
  'Jabón Líquido Manzana': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/40 FT JABON PARA MANOS Y CUERPO.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/39 FDS JABON PARA MANOS Y CUERPO.pdf',
  },
  'Jabón Líquido Sin Fragancia': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/40 FT JABON PARA MANOS Y CUERPO.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/39 FDS JABON PARA MANOS Y CUERPO.pdf',
  },
  'Jabón Líquido Canela': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/40 FT JABON PARA MANOS Y CUERPO.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/39 FDS JABON PARA MANOS Y CUERPO.pdf',
  },
  'Detergente Navazul': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/42 FT NAVAZUL.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/41 FDS NAVAZUL.pdf',
  },
  Limpiabrillo: {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/44 FT LIMPIABRILLO.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/43 FDS LIMPIABRILLO.pdf',
  },
  'Limpiador Desinfectante': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/46 FT LIMPIADOR DESINFECTANTE (1).pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/45 FDS LIMPIADOR  DESINFECTANTE.pdf',
  },
  'Detergente Limpiador Multiusos': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/48 FT DETERGENTE LIMPIADOR MULTIUSOS.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/47 FDS DETERGENTE LIMPIADOR MULTIUSOS.pdf',
  },
  'Limpia Vidrios': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/50  FT LIMPIAVIDRIOS.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/49 FDS LIMPIAVIDRIOS.pdf',
  },
  'Lustra Muebles': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/52 FT LUSTRA MUEBLES.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/51 FDS LUSTRA MUEBLES.pdf',
  },
  'Detergente Multicocina': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/54 FT MULTICOCINA.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/53 FDS MULTICOCINA1.pdf',
  },
  'Neutralizador de Olores': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/56 FT NEUTRALIZADOR DESINFECTANTE.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/55 FDS NEUTRALIZADOR  DESINFECTANTE.pdf',
  },
  'Removedor de Ceras': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/58 FT REMOVEDOR DE CERAS.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/57 FDS REMOVEDOR DE CERAS.pdf',
  },
  'Sellador de Superficies': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/60 FT SELLADOR.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/59 FDS SELLADOR.pdf',
  },
  Silicona: {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/63 FT SILICONA FORMATO.pdf',
    safetySheetHref: '/fichas-tecnicas/tecnicas/64 FDS SILICONA.pdf',
  },
  'Suavizante Textil': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/66 FT SUAVIZANTE TEXTIL.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/65 FDS SUAVIZANTE TEXTIL.pdf',
  },
  'Multipropósito K': {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/68 FT MULTIPROPÓSITO K.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/68 FDS MULTIPROPOSITO-K.pdf',
  },
  Varsol: {
    technicalSheetHref: '/fichas-tecnicas/tecnicas/91 FT VARSOL NAVAL.pdf',
    safetySheetHref: '/fichas-tecnicas/seguridad/90 FDS VARSOL.pdf',
  },
}

const defaultProductSafetySummary =
  'Usar según indicaciones de la etiqueta. Evitar contacto con ojos, no ingerir y no mezclar con otros productos.'

const productAssetAliases = {
  'Detergente Multicocina': ['MULTICOCINA'],
  'Detergente Limpiador Multiusos': ['LIMPIADOR MULTI'],
  Desengrasante: ['DESENGRASANTE'],
  'Jabón Líquido para Manos y Cuerpo': ['JABON AVENA', 'JABON MANZANA', 'JABON SIN FRAGANCIA', 'JABON CANELA'],
  'Jabón Líquido Avena': ['JABON AVENA'],
  'Jabón Líquido Manzana': ['JABON MANZANA'],
  'Jabón Líquido Sin Fragancia': ['JABON SIN FRAGANCIA'],
  'Jabón Líquido Canela': ['JABON CANELA'],
  'Des-Oxi Desincrustante': ['DES-OXI'],
  'Limpia Vidrios': ['LIMPIAVIDRIOS'],
  Ambientador: ['AMBIENTADOR'],
  'Ambientador Limón': ['AMBIENTADOR LIMON'],
  'Ambientador Lavanda': ['AMBIENTADOR LAVANDA'],
  'Ambientador Canela': ['AMBIENTADOR CANELA'],
  'Ambientador Tutti Frutti': ['AMBIENTADOR TUTTI'],
  'Ambientador Mar Fresco': ['AMBIENTADOR MAR'],
  'Ambientador Floral': ['AMBIENTADOR FR'],
  'Shampoo de Alfombras': ['CHAMPU'],
  Biovarsol: ['BIOVARSOL'],
  'Crema Limpiadora': ['CREMA LIMPIADORA'],
  'Detergente Navazul': ['NAVAZUL'],
  'Suavizante Textil': ['SUAVIZANTE'],
  'Blanqueador Oxigenado Activo': ['BLANQUEADOR'],
  'Limpiador Desinfectante': ['LIMPIADOR DESINF'],
  'Neutralizador de Olores': ['NEUTRALIZADOR'],
  'Blanqueador 2.7% y 3.7%': ['BLANQUEADOR'],
  'Blanqueador 5.25%': ['BLANQUEADOR'],
  'Hipoclorito 13%': ['HIPOCLORITO'],
  'Hipoclorito 15%': ['HIPOCLORITO'],
  'Alcohol Industrial 70%': ['ALCOHOL INDUSTRIAL', 'ALCOHOL IND'],
  'Alcohol Etílico 96%': ['ALCOHOL INDUSTRIAL', 'ALCOHOL IND'],
  Creolina: ['CREOLINA'],
  'Removedor de Ceras': ['REMOVEDOR'],
  'Cera Polimérica': ['CERA POLIMERICA', 'CERAPOLIMERICA'],
  'Cera Brillo': ['CERA BRILLO'],
  'Cera Emulsionada': ['CERA EMULSIONADA', 'CERA EMULSIONADO', 'CERA EMULS'],
  Limpiabrillo: ['LIMPIABRILLO'],
  'Sellador de Superficies': ['SELLADOR'],
  'Lustra Muebles': ['LUSTRAMUEBLES'],
  Silicona: ['SILICONA'],
  Varsol: ['VARSOL'],
}
const productAssetEntries = Object.entries(assetModules).map(([path, image]) => {
  const filename = path.split('/').pop() ?? ''

  return {
    filename,
    normalizedName: normalizeAssetName(filename),
    image,
    label: getAssetPresentationLabel(filename),
    fragrance: getAssetFragranceLabel(filename),
  }
})

const productsWithoutImages = new Set(['Varsol'])

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalizeAssetName(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\.[A-Z0-9]+$/, '')
    .replace(/[_().]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getAssetPresentationLabel(filename) {
  const normalizedName = normalizeAssetName(filename)

  if (normalizedName.includes('5G') || normalizedName.includes('5 GAL')) {
    return '5 GALONES'
  }

  if (normalizedName.includes('GALON') || /-G(?:\s|$)/.test(normalizedName)) {
    return '3.800 CC'
  }

  if (normalizedName.includes('1 900') || normalizedName.includes('1900')) {
    return '1.900 CC'
  }

  if (normalizedName.includes('1000')) {
    return '1.000 CC'
  }

  if (normalizedName.includes('500')) {
    return '1.000 CC'
  }

  return null
}

function getAssetFragranceLabel(filename) {
  const normalizedName = normalizeAssetName(filename)

  if (!normalizedName.includes('AMBIENTADOR') && !normalizedName.includes('JABON')) {
    return null
  }

  if (normalizedName.includes('AVENA')) return 'Avena'
  if (normalizedName.includes('MANZANA')) return 'Manzana'
  if (normalizedName.includes('SIN FRAGANCIA')) return 'Sin Fragancia'
  if (normalizedName.includes('LAVANDA')) return 'Lavanda'
  if (normalizedName.includes('LIMON')) return 'Limón'
  if (normalizedName.includes('CANELA')) return 'Canela'
  if (normalizedName.includes('TUTTI')) return 'Tutti Frutti'
  if (normalizedName.includes('MAR')) return 'Mar Fresco'
  if (normalizedName.includes('FR')) return 'Floral'

  return normalizedName.includes('JABON') ? 'Jabón Líquido' : 'Ambientador'
}

function getPresentationWeight(label) {
  if (label === '1.000 CC') return 1
  if (label === '1.900 CC') return 3
  if (label === '3.800 CC') return 4
  if (label === '5 GALONES') return 5
  return 6
}

function getFragranceWeight(fragrance) {
  if (fragrance === 'Avena') return 1
  if (fragrance === 'Manzana') return 2
  if (fragrance === 'Sin Fragancia') return 4
  if (fragrance === 'Lavanda') return 1
  if (fragrance === 'Limón') return 2
  if (fragrance === 'Canela') return 3
  if (fragrance === 'Tutti Frutti') return 4
  if (fragrance === 'Mar Fresco') return 5
  if (fragrance === 'Floral') return 6
  return 7
}

function getProductGallery(product) {
  if (productsWithoutImages.has(product.name)) {
    return []
  }

  const aliases = productAssetAliases[product.name] ?? [product.name]
  const normalizedAliases = aliases.map(normalizeAssetName)
  const matches = productAssetEntries.filter((asset) =>
    asset.label && normalizedAliases.some((alias) => asset.normalizedName.includes(alias)),
  )
  const avena1900Asset =
    product.name === 'Jabón Líquido Avena'
      ? productAssetEntries.find(
          (asset) =>
            asset.normalizedName.includes('ENVASE 1 900') && asset.normalizedName.includes('JABON CANELA'),
        )
      : null
  const galleryMatches = avena1900Asset ? [...matches, avena1900Asset] : matches
  const dedupedMatches = Array.from(new Map(galleryMatches.map((asset) => [asset.filename, asset])).values())

  const orderedMatches = dedupedMatches
    .sort((firstAsset, secondAsset) => {
      const presentationDelta = getPresentationWeight(firstAsset.label) - getPresentationWeight(secondAsset.label)

      if (presentationDelta !== 0) {
        return presentationDelta
      }

      return firstAsset.filename.localeCompare(secondAsset.filename)
    })

  const uniqueAssets = Array.from(new Map(orderedMatches.map((asset) => [asset.label, asset])).values())

  return uniqueAssets
    .map((asset) => ({
      label: product.name === 'Jabón Líquido Avena' &&
        asset.normalizedName.includes('ENVASE 1 900') &&
        asset.normalizedName.includes('JABON CANELA')
        ? '1.900 CC'
        : asset.fragrance && !normalizeAssetName(product.name).includes(normalizeAssetName(asset.fragrance))
        ? `${asset.fragrance} · ${asset.label}`
        : asset.label,
      image: asset.image,
      filename: asset.filename,
    }))
}

function getProductSlug(product) {
  return `producto-${slugify(product.name)}`
}

function getProductPresentations(product) {
  if (product.presentations) {
    return product.presentations
  }

  const gallery = getProductGallery(product)

  if (gallery.length > 0) {
    return Array.from(new Set(gallery.map((item) => item.label)))
  }

  return []
}

function formatProductDilution(dilution) {
  return Array.isArray(dilution) ? dilution.join(' ') : dilution
}

function getProductDilutionItems(dilution) {
  if (Array.isArray(dilution)) {
    return dilution
  }

  if (!dilution) {
    return []
  }

  return dilution
    .split(/(?<=\.)\s+(?=[A-ZÁÉÍÓÚÑ])/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function getProductSafetySummary(product, family) {
  if (product.name === 'Detergente Multicocina') {
    return 'Producto no inflamable. Evitar contacto con ojos y piel, no ingerir y no mezclar con otros productos.'
  }

  if (jabonLiquidoProductNames.includes(product.name)) {
    return 'Producto de higiene personal para uso externo. Evitar contacto con ojos y suspender uso si se presenta irritación.'
  }

  if (ambientadorProductNames.includes(product.name)) {
    return 'Usar en áreas ventiladas. No ingerir, evitar contacto con ojos y no aplicar sobre alimentos ni superficies en contacto directo con alimentos.'
  }

  if (/Alcohol|Varsol|Silicona|Lustrador de Acero/i.test(product.name)) {
    return 'Producto inflamable o de manejo técnico. Mantener lejos de fuentes de calor, usar en áreas ventiladas y evitar contacto con ojos y piel.'
  }

  if (/Hipoclorito|Blanqueador|Creolina|Desinfectante/i.test(product.name)) {
    return 'Usar en áreas ventiladas y con protección básica. No ingerir, evitar contacto con ojos y piel, y no mezclar con ácidos, amoniaco u otros productos.'
  }

  if (/Des-Oxi|Removedor|Biovarsol|Desengrasante|Multipropósito K/i.test(product.name)) {
    return 'Usar guantes durante la aplicación. Evitar contacto con ojos y piel, no ingerir y realizar prueba previa en superficies delicadas.'
  }

  if (/Cera|Sellador|Limpiabrillo/i.test(product.name)) {
    return 'Aplicar sobre superficies limpias y señalizar el área hasta secado. Evitar contacto con ojos, no ingerir y no mezclar con otros productos.'
  }

  if (family.id === 'lavanderia') {
    return 'Manipular según dosificación recomendada. Evitar contacto con ojos, no ingerir y revisar compatibilidad en prendas delicadas.'
  }

  return defaultProductSafetySummary
}

function getCatalogDisplayItems(items) {
  const ambientadorDisplayItem =
    items.find(({ product }) => product.name === 'Ambientador Lavanda') ??
    items.find(({ product }) => ambientadorProductNames.includes(product.name))
  const jabonLiquidoDisplayItem =
    items.find(({ product }) => product.name === 'Jabón Líquido Avena') ??
    items.find(({ product }) => jabonLiquidoProductNames.includes(product.name))

  return items.filter(({ product }) => {
    if (ambientadorProductNames.includes(product.name)) {
      return product.slug === ambientadorDisplayItem?.product.slug
    }

    if (jabonLiquidoProductNames.includes(product.name)) {
      return product.slug === jabonLiquidoDisplayItem?.product.slug
    }

    return true
  })
}

function getCatalogProductTitle(product) {
  if (jabonLiquidoProductNames.includes(product.name)) return 'Jabón para Manos'
  if (product.name === 'Shampoo de Alfombras') return 'Champú de Alfombras'

  return product.name === 'Ambientador Lavanda' ? 'Ambientador' : product.name
}

function getProductDetailTitle(product) {
  if (jabonLiquidoProductNames.includes(product.name)) return 'Jabón para Manos'
  if (product.name === 'Shampoo de Alfombras') return 'Champú de Alfombras'

  return product.name
}

function getCatalogProductSeoNote(product) {
  const sizeCta = 'Viene en varios tamaños. Entra y elige el ideal.'

  if (product.name === 'Ambientador Lavanda') {
    return `Fragancias lavanda, limón, canela, tutti frutti, mar fresco y floral. ${sizeCta}`
  }

  if (product.name === 'Jabón Líquido Sin Fragancia') {
    return `Sin fragancia y fragancias avena, manzana y canela. ${sizeCta}`
  }

  if (product.name === 'Detergente Limpiador Multiusos') {
    return `Versión floral y sin fragancia para superficies. ${sizeCta}`
  }

  if (product.name === 'Detergente Multicocina') {
    return `Disponible con color rojo o sin color. ${sizeCta}`
  }

  if (product.name === 'Lustrador de Acero Inoxidable') {
    return `Para acero inoxidable y aluminio. ${sizeCta}`
  }

  if (product.name === 'Lustra Muebles') {
    return `Para madera y mobiliario institucional. ${sizeCta}`
  }

  return sizeCta
}

function getCatalogProductPresentationLabel(product) {
  const presentations = product.presentations?.filter(Boolean) ?? []
  const compactPresentations = presentations.map((presentation) =>
    presentation
      .replace(/\s*-\s*/g, ', ')
      .replace(/\s*(CC|GALONES|GALON|GALÓN|GLS)\b\.?/gi, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .trim(),
  )

  return compactPresentations.length ? compactPresentations.join(', ') : 'Según disponibilidad'
}

function getCatalogProductFragranceLabel(product) {
  if (product.name === 'Ambientador Lavanda') {
    return 'Lavanda, limón, canela, tutti frutti, mar fresco y floral'
  }

  if (product.name === 'Jabón Líquido Sin Fragancia') {
    return 'Sin fragancia, avena, manzana y canela'
  }

  if (product.name === 'Detergente Limpiador Multiusos') {
    return 'Floral y sin fragancia'
  }

  if (product.subtitle?.toLowerCase().startsWith('fragancia ')) {
    return product.subtitle.replace(/^fragancia\s+/i, '')
  }

  if (product.subtitle?.toLowerCase().includes('sin fragancia')) {
    return 'Sin fragancia'
  }

  return ''
}

function CatalogProductMeta({ product }) {
  const fragrance = getCatalogProductFragranceLabel(product)

  return (
    <div className="catalog-product-card__meta">
      <span>
        <strong>Presentación:</strong> {getCatalogProductPresentationLabel(product)}
      </span>
      {fragrance ? (
        <span>
          <strong>Fragancia:</strong> {fragrance}
        </span>
      ) : null}
      <span>Entra y elige el ideal.</span>
    </div>
  )
}

const shopQuickFilters = [
  { id: 'hogar', label: 'Hogar' },
  { id: 'oficina', label: 'Oficina' },
  { id: 'cocina', label: 'Cocina' },
  { id: 'banos', label: 'Baños' },
  { id: 'pisos', label: 'Pisos' },
  { id: 'desinfeccion', label: 'Desinfección' },
]

function getShopFilterText(product, family) {
  return normalizeAssetName(
    `${product.name} ${product.summary} ${product.category} ${family.eyebrow} ${product.presentations.join(' ')}`,
  ).toLowerCase()
}

function productMatchesShopQuickFilter(product, family, filterId) {
  const text = getShopFilterText(product, family)

  if (filterId === 'hogar') {
    return homeKitProductNameSet.has(product.name)
  }

  if (filterId === 'oficina') {
    return /oficina|oficinas|empresa|institucional|ambientador|limpiavidrios|multiusos|jabon|desinfectante|limpiador|detergente/.test(text)
  }

  if (filterId === 'cocina') {
    return /cocina|multicocina|desengrasante|acero|inoxidable|detergente/.test(text)
  }

  if (filterId === 'banos') {
    return /bano|banos|jabon|hipoclorito|desinfectante|ambientador/.test(text)
  }

  if (filterId === 'pisos') {
    return /piso|pisos|cera|sellador|brillo|removedor|limpiabrillo/.test(text)
  }

  if (filterId === 'desinfeccion') {
    return /desinfeccion|desinfectante|hipoclorito|alcohol|sanitizante/.test(text)
  }

  return true
}

function getShopProductBadges(product, family) {
  const text = getShopFilterText(product, family)
  const badges = []

  if (/hogar|cocina|multicocina|ambientador|jabon|limpia vidrios|limpiavidrios|multiusos|desengrasante|desinfectante|blanqueador|des-oxi|biovarsol|lustra muebles|limpiabrillo|lavanda|fragancia/.test(text)) badges.push('Hogar')
  if (/oficina|oficinas|empresa|institucional|industrial|desengrasante|galon|detergente|limpiador/.test(text)) badges.push('Oficina')
  if (/detergente|jabon|ambientador|limpiavidrios|multiusos|desengrasante/.test(text)) badges.push('Uso frecuente')
  if (/desengrasante|removedor|sellador|cera|hipoclorito|alcohol|des-oxi|inoxidable/.test(text)) badges.push('Alto rendimiento')

  return badges.slice(0, 2)
}

function getProductImageAlt(product, family, presentation) {
  const presentationText = presentation ? ` en presentación ${presentation}` : ''
  const familyText = family?.eyebrow ? ` de la línea ${family.eyebrow}` : ''

  return `${product.name}${presentationText}${familyText}, producto de limpieza profesional NAVAL para empresas en Colombia`
}

function ProductImagePlaceholder({ productName }) {
  return (
    <span
      className="product-image-placeholder"
      role="img"
      aria-label={`Imagen de ${productName} próximamente`}
    >
      <span className="product-image-placeholder__icon" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <path d="M26 8h12v8H26z" />
          <path d="M24 16h16v6c0 2 1 3 3 5 3 3 5 7 5 12v14c0 2-2 3-4 3H20c-2 0-4-1-4-3V39c0-5 2-9 5-12 2-2 3-3 3-5v-6Z" />
          <path d="M21 35h22v14H21z" />
          <path d="m49 10 1.5 3.5L54 15l-3.5 1.5L49 20l-1.5-3.5L44 15l3.5-1.5L49 10Z" />
        </svg>
      </span>
      <strong>Imagen próximamente</strong>
      <small>Estamos preparando la foto de este producto</small>
    </span>
  )
}

function getDefaultCartPresentation(product, preferredPresentation) {
  return preferredPresentation || product.presentations?.[0] || 'Presentación por confirmar'
}

function getCompleteCatalogPresentation(product) {
  return (
    product.presentations?.find((presentation) => /\b3[.]?800\s*cc\b/i.test(presentation)) ||
    product.presentations?.find((presentation) => /\b3800\s*cc\b/i.test(presentation)) ||
    getDefaultCartPresentation(product)
  )
}

function getPreferredCartPresentation(product, presentationPreferences = []) {
  const normalizedPresentations = product.presentations?.map((presentation) => ({
    label: presentation,
    normalizedLabel: normalizePresentationLabel(presentation),
  })) ?? []

  const preferredPresentation = presentationPreferences
    .map((presentation) => normalizePresentationLabel(presentation))
    .map((preferredLabel) =>
      normalizedPresentations.find(
        ({ normalizedLabel }) => normalizedLabel === preferredLabel ||
          normalizedLabel.includes(preferredLabel) ||
          preferredLabel.includes(normalizedLabel),
      ),
    )
    .find(Boolean)

  return preferredPresentation?.label || getDefaultCartPresentation(product)
}

function normalizePresentationLabel(label) {
  return normalizeAssetName(label).replace(/\s+/g, '')
}

const ambientadorProductNames = [
  'Ambientador Limón',
  'Ambientador Lavanda',
  'Ambientador Canela',
  'Ambientador Tutti Frutti',
  'Ambientador Mar Fresco',
  'Ambientador Floral',
]
const ambientadorFragranceProductNames = [
  'Ambientador Limón',
  'Ambientador Lavanda',
  'Ambientador Canela',
  'Ambientador Mar Fresco',
]
const jabonLiquidoProductNames = [
  'Jabón Líquido Avena',
  'Jabón Líquido Manzana',
  'Jabón Líquido Sin Fragancia',
  'Jabón Líquido Canela',
]
const jabonLiquidoFragranceProductNames = [
  'Jabón Líquido Avena',
  'Jabón Líquido Manzana',
  'Jabón Líquido Sin Fragancia',
]

pageContent.lineas.productFamilies = lineasProductOrder
  .map((id) => pageContent.lineas.productFamilies.find((family) => family.id === id))
  .filter(Boolean)

pageContent.lineas.productFamilies.forEach((family) => {
  family.products = family.products
    .map((product) => {
      const gallery = getProductGallery(product)
      const dilutionData = productDilutionDataByName[product.name]
      const documentLinks = productDocumentLinksByName[product.name]

      return {
        ...product,
        ...(dilutionData ?? {}),
        ...(documentLinks ?? {}),
        safetySummary: dilutionData?.safetySummary ?? product.safetySummary ?? getProductSafetySummary(product, family),
        technicalSheetHref: documentLinks?.technicalSheetHref ?? product.technicalSheetHref ?? '',
        safetySheetHref: documentLinks?.safetySheetHref ?? product.safetySheetHref ?? '',
        slug: getProductSlug(product),
        image: product.image ?? gallery[0]?.image ?? productImageByName[product.name],
        gallery,
        category: family.eyebrow,
        presentations: getProductPresentations(product),
      }
    })

  pageContent[`lineas-${family.id}`] = {
    eyebrow: 'Portafolio',
    title: family.eyebrow,
    intro: family.intro,
    seoTitle: `${family.eyebrow} | Productos de limpieza profesional NAVAL`,
    seoDescription: `Conoce productos de ${family.eyebrow.toLowerCase()} NAVAL para limpieza profesional, operación B2B, compras institucionales y distribución en Colombia.`,
    family,
    footerSection: pageContent['quienes-somos'].footerSection,
  }

  family.products.forEach((product) => {
    pageContent[product.slug] = {
      eyebrow: 'Producto',
      title: product.name,
      intro: product.summary,
      seoTitle: `${product.name} | Producto de limpieza profesional NAVAL`,
      seoDescription: `${product.summary} Disponible para empresas, negocios y operaciones institucionales en Colombia.`,
      product,
      family,
      footerSection: pageContent['quienes-somos'].footerSection,
    }
  })
})

const sectorProductNamesByTitle = {
  Hotelero: [
    'Detergente Limpiador Multiusos',
    'Ambientador',
    'Limpia Vidrios',
    'Jabón Líquido para Manos y Cuerpo',
    'Shampoo de Alfombras',
    'Crema Limpiadora',
    'Limpiabrillo',
    'Lustra Muebles',
    'Limpiador Desinfectante',
    'Neutralizador de Olores',
    'Detergente Navazul',
    'Suavizante Textil',
    'Desengrasante',
  ],
  Colegios: [
    'Detergente Limpiador Multiusos',
    'Limpiador Desinfectante',
    'Jabón Líquido para Manos y Cuerpo',
    'Ambientador',
    'Limpia Vidrios',
    'Desengrasante',
    'Neutralizador de Olores',
    'Blanqueador 2.7% y 3.7%',
    'Alcohol Industrial 70%',
    'Cera Polimérica',
    'Limpiabrillo',
    'Des-Oxi Desincrustante',
  ],
  Cocinas: [
    'Detergente Multicocina',
    'Desengrasante',
    'Multipropósito K',
    'Crema Limpiadora',
    'Biovarsol',
    'Limpiador Desinfectante',
    'Alcohol Industrial 70%',
    'Jabón Líquido para Manos y Cuerpo',
    'Limpia Vidrios',
    'Des-Oxi Desincrustante',
  ],
  Lavandería: [
    'Detergente Navazul',
    'Suavizante Textil',
    'Blanqueador Oxigenado Activo',
    'Blanqueador 2.7% y 3.7%',
    'Ambientador',
    'Neutralizador de Olores',
  ],
  'Conjunto residencial': [
    'Detergente Limpiador Multiusos',
    'Limpiador Desinfectante',
    'Neutralizador de Olores',
    'Ambientador',
    'Jabón Líquido para Manos y Cuerpo',
    'Limpia Vidrios',
    'Desengrasante',
    'Creolina',
    'Limpiabrillo',
    'Lustra Muebles',
    'Des-Oxi Desincrustante',
  ],
  Hogar: [
    'Detergente Multicocina',
    'Detergente Limpiador Multiusos',
    'Desengrasante',
    'Limpiador Desinfectante',
    'Limpia Vidrios',
    'Jabón Líquido Avena',
    'Ambientador Lavanda',
    'Blanqueador 2.7% y 3.7%',
    'Des-Oxi Desincrustante',
    'Biovarsol',
    'Crema Limpiadora',
    'Lustra Muebles',
    'Limpiabrillo',
  ],
  Empresarial: [
    'Detergente Limpiador Multiusos',
    'Ambientador',
    'Limpia Vidrios',
    'Jabón Líquido para Manos y Cuerpo',
    'Limpiador Desinfectante',
    'Alcohol Industrial 70%',
    'Shampoo de Alfombras',
    'Crema Limpiadora',
    'Limpiabrillo',
    'Lustra Muebles',
    'Silicona',
    'Lustrador de Acero Inoxidable',
  ],
  Restaurante: [
    'Detergente Multicocina',
    'Desengrasante',
    'Detergente Limpiador Multiusos',
    'Limpiador Desinfectante',
    'Jabón Líquido para Manos y Cuerpo',
    'Ambientador',
    'Limpia Vidrios',
    'Biovarsol',
    'Multipropósito K',
    'Crema Limpiadora',
    'Alcohol Industrial 70%',
    'Blanqueador 2.7% y 3.7%',
  ],
  Gym: [
    'Limpiador Desinfectante',
    'Neutralizador de Olores',
    'Detergente Limpiador Multiusos',
    'Jabón Líquido para Manos y Cuerpo',
    'Alcohol Industrial 70%',
    'Ambientador',
    'Limpia Vidrios',
    'Desengrasante',
    'Cera Polimérica',
    'Limpiabrillo',
  ],
}

const allCatalogProducts = pageContent.lineas.productFamilies.flatMap((family) =>
  family.products.map((product) => ({ product, family })),
)
const productByName = new Map(allCatalogProducts.map(({ product }) => [product.name, product]))
const productAssistantCatalog = buildProductAssistantCatalog(allCatalogProducts).map((assistantProduct) => {
  const catalogItem = allCatalogProducts.find(({ product }) => product.name === assistantProduct.name)
  if (!catalogItem) return assistantProduct

  return {
    ...assistantProduct,
    surfaces: getProductSurfaces(catalogItem.product, catalogItem.family),
    applications: getProductApplications(catalogItem.product, catalogItem.family),
  }
})

const createFocusedLinePage = ({ key, familyId, eyebrow, title, intro, seoTitle, seoDescription, productNames }) => {
  const baseFamily = pageContent.lineas.productFamilies.find((family) => family.id === familyId)
  if (!baseFamily) return

  const products = productNames.map((productName) => productByName.get(productName)).filter(Boolean)
  if (!products.length) return

  const family = {
    ...baseFamily,
    id: key.replace(/^lineas-/, ''),
    eyebrow,
    cardTitle: eyebrow,
    title,
    intro,
    products,
  }

  pageContent[key] = {
    eyebrow: 'Portafolio',
    title: eyebrow,
    intro,
    seoTitle,
    seoDescription,
    family,
    footerSection: pageContent['quienes-somos'].footerSection,
  }
}

createFocusedLinePage({
  key: 'lineas-desengrasantes',
  familyId: 'limpieza-general',
  eyebrow: 'Desengrasantes',
  title: 'Desengrasantes profesionales para grasa pesada, cocinas e industria.',
  intro:
    'Productos Naval enfocados en remover grasa animal, vegetal, aceites y suciedad adherida en cocinas, equipos, pisos, paredes y superficies de trabajo.',
  seoTitle: 'Desengrasantes profesionales | Productos NAVAL',
  seoDescription:
    'Desengrasantes Naval para cocinas profesionales, restaurantes, industria y superficies con grasa pesada. Productos para limpieza profunda y operación diaria.',
  productNames: ['Desengrasante', 'Multipropósito K', 'Detergente Multicocina', 'Biovarsol'],
})

createFocusedLinePage({
  key: 'lineas-detergentes',
  familyId: 'limpieza-general',
  eyebrow: 'Detergentes',
  title: 'Detergentes profesionales para limpieza general, cocina y superficies.',
  intro:
    'Detergentes Naval para rutinas de aseo institucional, lavado de utensilios, limpieza de pisos, baños, paredes y superficies lavables.',
  seoTitle: 'Detergentes profesionales | Productos NAVAL',
  seoDescription:
    'Detergentes Naval para limpieza profesional en empresas, cocinas, colegios, hoteles y restaurantes. Soluciones para superficies, pisos y utensilios.',
  productNames: ['Detergente Multicocina', 'Detergente Limpiador Multiusos', 'Detergente Navazul'],
})

createFocusedLinePage({
  key: 'lineas-limpiavidrios',
  familyId: 'limpieza-general',
  eyebrow: 'Limpiavidrios',
  title: 'Limpiavidrios profesional para cristales, espejos y superficies visibles.',
  intro:
    'Soluciones Naval para limpiar y desengrasar vidrios, espejos, ventanas, lámparas y superficies similares en espacios comerciales e institucionales.',
  seoTitle: 'Limpiavidrios profesional | Productos NAVAL',
  seoDescription:
    'Limpiavidrios Naval para cristales, espejos, ventanas y superficies visibles en hoteles, empresas, restaurantes e instituciones.',
  productNames: ['Limpia Vidrios'],
})

createFocusedLinePage({
  key: 'lineas-ceras',
  familyId: 'pisos-superficies',
  eyebrow: 'Ceras',
  title: 'Ceras profesionales para protección, brillo y mantenimiento de pisos.',
  intro:
    'Ceras y mantenedores Naval para proteger pisos, recuperar brillo, sostener acabados y mejorar la presentación en zonas de alto tráfico.',
  seoTitle: 'Ceras para pisos profesionales | Productos NAVAL',
  seoDescription:
    'Ceras Naval para pisos, brillo, protección y mantenimiento profesional en empresas, hoteles, colegios, conjuntos y superficies de alto tráfico.',
  productNames: ['Cera Polimérica', 'Cera Brillo', 'Cera Emulsionada', 'Limpiabrillo', 'Sellador de Superficies'],
})

const homeKitConfiguration = [
  { productName: 'Detergente Multicocina', presentationPreferences: ['1.900 CC'] },
  { productName: 'Detergente Limpiador Multiusos', presentationPreferences: ['1.900 CC'] },
  { productName: 'Desengrasante', presentationPreferences: ['1.900 CC'] },
  { productName: 'Limpiador Desinfectante', presentationPreferences: ['1.900 CC'] },
  { productName: 'Limpia Vidrios', presentationPreferences: ['1.000 CC'] },
  { productName: 'Jabón Líquido Avena', presentationPreferences: ['1.000 CC'] },
  { productName: 'Ambientador Lavanda', presentationPreferences: ['1.000 CC'] },
  { productName: 'Blanqueador 2.7% y 3.7%', presentationPreferences: ['1.900 CC'] },
  { productName: 'Des-Oxi Desincrustante', presentationPreferences: ['1.900 CC'] },
  { productName: 'Biovarsol', presentationPreferences: ['1.900 CC'] },
  { productName: 'Lustra Muebles', presentationPreferences: ['1.900 CC'] },
  { productName: 'Limpiabrillo', presentationPreferences: ['1.900 CC'] },
]

const homeKitProductNameSet = new Set(homeKitConfiguration.map((item) => item.productName))

const homeKitProductEntries = homeKitConfiguration
  .map(({ productName, presentationPreferences }) => {
    const catalogEntry = allCatalogProducts.find(({ product }) => product.name === productName)

    if (!catalogEntry) return null

    return {
      ...catalogEntry,
      presentation: getPreferredCartPresentation(catalogEntry.product, presentationPreferences),
      shippingIncluded: true,
      bundleType: 'filtro-completo',
      bundleLabel: 'Kit hogar con 20% OFF',
    }
  })
  .filter(Boolean)

allCatalogProducts.forEach(({ product }) => {
  if (ambientadorProductNames.includes(product.name)) {
    product.presentationLinks = ambientadorFragranceProductNames
      .filter((productName) => productName === product.name)
      .concat(ambientadorFragranceProductNames.filter((productName) => productName !== product.name))
      .map((productName) => productByName.get(productName))
      .filter(Boolean)
      .map((ambientadorProduct) => ({
        label: ambientadorProduct.name.replace('Ambientador ', ''),
        href: `/${ambientadorProduct.slug}`,
      }))
  }

  if (jabonLiquidoProductNames.includes(product.name)) {
    product.presentationLinks = jabonLiquidoFragranceProductNames
      .filter((productName) => productName === product.name)
      .concat(jabonLiquidoFragranceProductNames.filter((productName) => productName !== product.name))
      .map((productName) => productByName.get(productName))
      .filter(Boolean)
      .map((jabonProduct) => ({
        label: jabonProduct.name.replace('Jabón Líquido ', ''),
        href: `/${jabonProduct.slug}`,
      }))
  }

  if (product.name === 'Jabón Líquido Avena') {
    product.presentations = ['1.000 CC', '1.900 CC', '3.800 CC', '5 GALONES']
  }
})

pageContent['lineas-todos'] = {
  eyebrow: 'Portafolio',
  title: 'Todos los productos Naval',
  intro:
    'Consulta el portafolio completo de productos Naval para operación diaria, organizado en páginas para facilitar la exploración.',
  seoTitle: 'Todos los Productos Naval | Portafolio B2B',
  seoDescription:
    'Catálogo completo de productos Naval para limpieza profesional, pisos, lavandería, desinfección y operación institucional.',
  allProductsCatalog: true,
  family: {
    id: 'todos-productos',
    eyebrow: 'Todos los productos',
    title: 'Todos los productos Naval',
    intro:
      'Explora todas las referencias disponibles del portafolio Naval para encontrar la solución adecuada por uso, línea o necesidad operativa.',
    products: allCatalogProducts.map(({ product }) => product),
  },
  footerSection: pageContent['quienes-somos'].footerSection,
}

pageContent.lineas.sectors.forEach((sector) => {
  const sectorSlug = `sectores-${slugify(sector.title)}`
  const sectorProducts = (sectorProductNamesByTitle[sector.title] ?? [])
    .flatMap((productName) => {
      if (productName === 'Ambientador') {
        return ambientadorProductNames
      }

      if (productName === 'Jabón Líquido para Manos y Cuerpo') {
        return jabonLiquidoProductNames
      }

      return [productName]
    })
    .map((productName) => productByName.get(productName))
    .filter(Boolean)

  const sectorFamily = {
    id: sectorSlug,
    eyebrow: `Sector ${sector.title}`,
    title: `${sector.title}: productos recomendados para operación diaria.`,
    intro: `${sector.text} Seleccionamos productos que ayudan a resolver limpieza, desinfección, presentación y reposición según las necesidades más comunes del sector.`,
    image: sector.image,
    imageAlt: sector.imageAlt,
    products: sectorProducts,
  }

  sector.href = ({
    'sectores-restaurante': '/sectores/restaurantes',
    'sectores-hotelero': '/sectores/hoteles',
    'sectores-conjunto-residencial': '/sectores/conjuntos-residenciales',
    'sectores-colegios': '/sectores/colegios',
    'sectores-gym': '/sectores/gimnasios',
    'sectores-empresarial': '/sectores/empresas',
    'sectores-cocinas': '/sectores/cocinas',
    'sectores-lavanderia': '/sectores/lavanderia',
    'sectores-hogar': '/sectores/hogar',
  })[sectorSlug] ?? `/${sectorSlug}`
  pageContent[sectorSlug] = {
    eyebrow: 'Sectores',
    title: sector.title,
    intro: sectorFamily.intro,
    seoTitle: `Sector ${sector.title} | Productos Naval`,
    seoDescription: `Productos Naval recomendados para el sector ${sector.title.toLowerCase()}, con soluciones de limpieza profesional, desinfección y mantenimiento operativo.`,
    sector,
    family: sectorFamily,
    footerSection: pageContent['quienes-somos'].footerSection,
  }
})

const routeAliases = {
  '': 'quienes-somos',
  productos: 'lineas',
  sectores: 'lineas',
  contacto: 'contacto',
  blog: 'guias',
  guias: 'guias',
  tienda: 'pedido',
  'preguntas-frecuentes': 'preguntas',
  'productos/todos': 'lineas-todos',
  'productos/limpieza-general': 'lineas-limpieza-general',
  'productos/pisos-y-superficies': 'lineas-pisos-superficies',
  'productos/lavanderia': 'lineas-lavanderia',
  'productos/higiene-y-desinfeccion': 'lineas-desinfeccion',
  'productos/desengrasantes': 'lineas-desengrasantes',
  'productos/detergentes': 'lineas-detergentes',
  'productos/limpiavidrios': 'lineas-limpiavidrios',
  'productos/ceras': 'lineas-ceras',
  'sectores/restaurantes': 'sectores-restaurante',
  'sectores/hoteles': 'sectores-hotelero',
  'sectores/conjuntos-residenciales': 'sectores-conjunto-residencial',
  'sectores/colegios': 'sectores-colegios',
  'sectores/gimnasios': 'sectores-gym',
  'sectores/empresas': 'sectores-empresarial',
  'sectores/cocinas': 'sectores-cocinas',
  'sectores/lavanderia': 'sectores-lavanderia',
  'sectores/hogar': 'sectores-hogar',
}

const primaryPagePathByKey = {
  'quienes-somos': '/',
  lineas: '/productos',
  preguntas: '/preguntas-frecuentes',
  pedido: '/tienda',
  guias: '/guias',
  contacto: '/contacto',
  'lineas-todos': '/productos/todos',
  'lineas-limpieza-general': '/productos/limpieza-general',
  'lineas-pisos-superficies': '/productos/pisos-y-superficies',
  'lineas-lavanderia': '/productos/lavanderia',
  'lineas-desinfeccion': '/productos/higiene-y-desinfeccion',
  'lineas-desengrasantes': '/productos/desengrasantes',
  'lineas-detergentes': '/productos/detergentes',
  'lineas-limpiavidrios': '/productos/limpiavidrios',
  'lineas-ceras': '/productos/ceras',
  'sectores-restaurante': '/sectores/restaurantes',
  'sectores-hotelero': '/sectores/hoteles',
  'sectores-conjunto-residencial': '/sectores/conjuntos-residenciales',
  'sectores-colegios': '/sectores/colegios',
  'sectores-gym': '/sectores/gimnasios',
  'sectores-empresarial': '/sectores/empresas',
  'sectores-cocinas': '/sectores/cocinas',
  'sectores-lavanderia': '/sectores/lavanderia',
  'sectores-hogar': '/sectores/hogar',
}

const sectorSolutionCopyByTitle = {
  Hotelero: {
    title: 'Productos de limpieza profesional para hoteles, habitaciones y housekeeping',
    context: 'Rutinas eficientes para sostener higiene, reposición y una experiencia impecable durante toda la operación.',
    problem: 'El sector hotelero necesita sostener higiene, aroma y apariencia impecable durante toda la operación.',
    needs: ['Limpieza diaria de superficies', 'Aromatización de habitaciones', 'Reposición en baños', 'Mantenimiento de vidrios y textiles'],
    highlight: 'Portafolio pensado para housekeeping, recepción, baños y zonas comunes.',
  },
  Colegios: {
    title: 'Productos de aseo institucional para colegios y zonas de alto tráfico',
    context: 'Apoyo para mantener higiene constante, reposición ordenada y espacios listos para uso diario.',
    problem: 'Los colegios requieren limpieza constante, control sanitario y productos resistentes a rutinas intensivas.',
    needs: ['Baños y aulas', 'Cafeterías y zonas comunes', 'Superficies de contacto', 'Reposición institucional'],
    highlight: 'Productos para rutinas repetibles en espacios con alta circulación diaria.',
  },
  Cocinas: {
    title: 'Productos para limpieza y desengrase de cocinas profesionales',
    context: 'Mayor control de grasa, residuos y mantenimiento operativo sin frenar el ritmo de trabajo.',
    problem: 'Las cocinas necesitan remover grasa, residuos orgánicos y suciedad pesada sin frenar la operación.',
    needs: ['Desengrase operativo', 'Lavado de utensilios', 'Superficies de preparación', 'Apoyo sanitario diario'],
    highlight: 'Base técnica para cocinas, restaurantes, casinos y centros de producción.',
  },
  Lavandería: {
    title: 'Productos para lavandería profesional, blancos y textiles institucionales',
    context: 'Rendimiento, suavidad y consistencia para procesos repetibles con resultados confiables.',
    problem: 'La lavandería requiere rendimiento, control de olor y resultados consistentes entre ciclos.',
    needs: ['Lavado de textiles', 'Cuidado de blancos', 'Control de olor', 'Procesos repetibles'],
    highlight: 'Productos para operación hotelera, institucional y lavanderías de alto volumen.',
  },
  'Conjunto residencial': {
    title: 'Productos de limpieza para conjuntos residenciales y zonas comunes',
    context: 'Orden, control de olores y mantenimiento visible para una convivencia más limpia y cuidada.',
    problem: 'Las zonas residenciales necesitan limpieza visible, control de olores y reposición frecuente.',
    needs: ['Recepciones y pasillos', 'Shuts de basura', 'Vidrios y zonas comunes', 'Baños y puntos de servicio'],
    highlight: 'Selección para administración, mantenimiento locativo y aseo recurrente.',
  },
  Hogar: {
    title: 'Productos de limpieza para hogar, cocina, baños y superficies',
    context: 'Uso práctico, reposición sencilla y resultados visibles para rutinas diarias más eficientes.',
    problem: 'El hogar necesita productos prácticos, claros y eficientes para rutinas de limpieza completas.',
    needs: ['Cocina y grasa', 'Baños y desinfección', 'Vidrios y superficies', 'Aromatización diaria'],
    highlight: 'Kit pensado para resolver las necesidades principales de limpieza en casa.',
  },
  Empresarial: {
    title: 'Productos de limpieza empresarial para oficinas y operación diaria',
    context: 'Presentación constante, higiene confiable y abastecimiento claro para equipos de trabajo.',
    problem: 'Las empresas necesitan mantener espacios presentables, seguros y listos para atención diaria.',
    needs: ['Oficinas y salas', 'Baños institucionales', 'Superficies de contacto', 'Vidrios y mobiliario'],
    highlight: 'Portafolio para operación empresarial, compras recurrentes y reposición controlada.',
  },
  Restaurante: {
    title: 'Productos de limpieza para restaurantes, cocina y comedor',
    context: 'Control de grasa, higiene visible y presentación cuidada para sostener confianza en cada servicio.',
    problem: 'Un restaurante debe controlar grasa, olores, superficies y baños sin perder ritmo operativo.',
    needs: ['Cocina y desengrase', 'Comedor y presentación', 'Baños y reposición', 'Vidrios y áreas visibles'],
    highlight: 'Selección para cocina, servicio, baños y mantenimiento de presentación diaria.',
  },
  Gym: {
    title: 'Productos de limpieza para gimnasios, máquinas y vestieres',
    context: 'Higiene frecuente, control de olores y mantenimiento ágil para experiencias de alto uso.',
    problem: 'Los gimnasios requieren higiene constante, control de olores y limpieza de zonas de contacto frecuente.',
    needs: ['Máquinas y superficies', 'Vestieres y baños', 'Control de olores', 'Pisos y zonas comunes'],
    highlight: 'Productos para rutinas de alto tráfico y percepción constante de limpieza.',
  },
}

const lineSolutionCopyById = {
  'limpieza-general': {
    title: 'Limpieza general profesional para superficies, baños y operación diaria',
    context: 'Versatilidad, eficiencia y reposición sencilla para mantener estándares visibles todos los días.',
    problem: 'Las operaciones necesitan resolver varias tareas de limpieza con productos claros, versátiles y fáciles de reponer.',
    needs: ['Limpieza de superficies', 'Desengrase y cocina', 'Vidrios y presentación', 'Aromas y baños'],
    highlight: 'Línea base para espacios comerciales, institucionales y operación diaria.',
  },
  lavanderia: {
    title: 'Lavandería profesional para textiles, blancos y ciclos institucionales',
    context: 'Cuidado, rendimiento y consistencia para mantener calidad, suavidad y control de olor.',
    problem: 'Los textiles institucionales necesitan limpieza profunda, suavidad, control de olor y consistencia entre ciclos.',
    needs: ['Lavado institucional', 'Cuidado de blancos', 'Suavizado textil', 'Desmanchado controlado'],
    highlight: 'Línea pensada para lavanderías, hotelería, restaurantes e instituciones.',
  },
  desinfeccion: {
    title: 'Desinfección profesional para superficies, baños y control sanitario',
    context: 'Protocolos claros para sostener seguridad, higiene continua y confianza en zonas de uso frecuente.',
    problem: 'Los espacios de alto uso requieren protocolos de higiene constantes y productos adecuados para cada superficie.',
    needs: ['Desinfección diaria', 'Control microbiológico', 'Manejo de olores', 'Superficies de contacto'],
    highlight: 'Línea para áreas sanitarias, operaciones comerciales e instituciones.',
  },
  'pisos-superficies': {
    title: 'Mantenimiento profesional de pisos, superficies y acabados',
    context: 'Protección, brillo y conservación para prolongar acabados y elevar la presentación del espacio.',
    problem: 'Los pisos, vidrios, acero y mobiliario necesitan conservar apariencia profesional pese al tráfico diario.',
    needs: ['Recuperación de pisos', 'Brillo y protección', 'Mantenimiento de acero', 'Cuidado de mobiliario'],
    highlight: 'Línea para superficies de alto tráfico y espacios donde la presentación importa.',
  },
}

pageContent.lineas.sectors.forEach((sector) => {
  const sectorSlug = `sectores-${slugify(sector.title)}`
  const sectorCopy = sectorSolutionCopyByTitle[sector.title]
  const sectorPage = pageContent[sectorSlug]

  if (sectorCopy && sectorPage) {
    sectorPage.seoTitle = `${sectorCopy.title} | Productos NAVAL`
    sectorPage.seoDescription = `${sectorCopy.context} ${sectorCopy.highlight}`
  }
})

pageContent.lineas.productFamilies.forEach((family) => {
  const linePage = pageContent[`lineas-${family.id}`]
  const lineCopy = lineSolutionCopyById[family.id]

  if (lineCopy && linePage) {
    linePage.seoTitle = `${lineCopy.title} | Productos NAVAL`
    linePage.seoDescription = `${lineCopy.context} ${lineCopy.highlight}`
  }
})

function getCatalogSolutionDetails(page, catalogItems, isSectorCatalog) {
  const copy = isSectorCatalog
    ? sectorSolutionCopyByTitle[page.sector.title]
    : lineSolutionCopyById[page.family.id]
  const recommendedProducts = catalogItems
    .slice(0, 4)
    .map(({ product }) => getCatalogProductTitle(product))

  return {
    title: copy?.title ?? `${page.family.eyebrow}: productos de limpieza profesional para operación diaria`,
    context: copy?.context ?? `Soluciones recomendadas para ${page.family.eyebrow.toLowerCase()} y operación profesional.`,
    problem: copy?.problem ?? 'Cada operación necesita productos claros para resolver limpieza, presentación y reposición sin fricción.',
    needs: copy?.needs ?? ['Limpieza profesional', 'Mantenimiento operativo', 'Reposición recurrente', 'Presentación diaria'],
    highlight: copy?.highlight ?? 'Selección pensada para compra B2B, operación diaria y continuidad de uso.',
    image: page.sector?.image ?? page.family.image,
    imageAlt: page.sector?.imageAlt ?? page.family.imageAlt,
    recommendedProducts,
    totalProducts: catalogItems.length,
  }
}

function formatRelatedSectorLabel(sectorName) {
  const sectorLabels = {
    Hotelero: 'Hoteles',
    Restaurante: 'Restaurantes',
  }

  return sectorLabels[sectorName] ?? sectorName
}

function getProductRelatedSectors(product, family) {
  const sectorsByFamily = {
    'limpieza-general': ['Hoteles', 'Restaurantes', 'Hogar', 'Conjunto residencial', 'Colegios', 'Empresarial'],
    lavanderia: ['Hoteles', 'Restaurantes', 'Hogar', 'Conjunto residencial', 'Colegios'],
    desinfeccion: ['Hoteles', 'Restaurantes', 'Hogar', 'Conjunto residencial', 'Colegios', 'Gym', 'Empresarial'],
    'pisos-superficies': ['Hoteles', 'Restaurantes', 'Hogar', 'Conjunto residencial', 'Colegios', 'Gym', 'Empresarial'],
  }

  const matchedSectors = Object.entries(sectorProductNamesByTitle)
    .filter(([, productNames]) =>
      productNames.some((productName) => {
        if (productName === 'Ambientador') {
          return ambientadorProductNames.includes(product.name)
        }

        if (productName === 'Jabón Líquido para Manos y Cuerpo') {
          return jabonLiquidoProductNames.includes(product.name)
        }

        return productName === product.name
      }),
    )
    .map(([sectorName]) => formatRelatedSectorLabel(sectorName))

  return Array.from(new Set([...matchedSectors, ...(sectorsByFamily[family?.id] ?? [])]))
}

function getProductSurfaces(product, family) {
  const surfacesByProduct = {
    'Detergente Multicocina': ['Utensilios', 'Loza', 'Cristalería', 'Cubiertos', 'Campanas', 'Mesones', 'Pisos de cocina'],
    'Detergente Limpiador Multiusos': ['Pisos', 'Paredes', 'Mesones', 'Baños', 'Escaleras', 'Gabinetes', 'Superficies lavables'],
    Desengrasante: ['Paredes', 'Pisos', 'Equipos', 'Metales', 'Superficies con grasa', 'Cocinas'],
    'Des-Oxi Desincrustante': ['Pisos', 'Sanitarios', 'Tinas', 'Senderos', 'Superficies minerales', 'Superficies metálicas'],
    'Limpia Vidrios': ['Vidrios', 'Cristales', 'Espejos', 'Lámparas', 'Ventanas'],
    'Shampoo de Alfombras': ['Alfombras', 'Tapetes', 'Cortinas', 'Forros', 'Tapicerías'],
    Biovarsol: ['Plástico', 'Vinilo', 'Cerámica', 'Madera', 'Cuero', 'Fórmica', 'Metal'],
    'Crema Limpiadora': ['Aluminio', 'Acero inoxidable', 'Mesones', 'Equipos', 'Artículos metálicos', 'Superficies brillantes'],
    'Limpiador Desinfectante': ['Pisos', 'Baños', 'Superficies lavables', 'Zonas sanitarias'],
    'Neutralizador de Olores': ['Shuts de basura', 'Ascensores', 'Zonas con olores fuertes', 'Superficies con residuos orgánicos'],
    'Alcohol Industrial 70%': ['Superficies de contacto', 'Equipos', 'Estaciones de limpieza', 'Áreas de apoyo sanitario'],
    'Alcohol Etílico 96%': ['Superficies de contacto', 'Insumos técnicos', 'Áreas de preparación controlada'],
    Creolina: ['Bodegas', 'Shuts de basura', 'Áreas industriales', 'Superficies con alta carga de olor'],
    'Detergente Navazul': ['Textiles', 'Blancos', 'Uniformes', 'Ropa institucional'],
    'Suavizante Textil': ['Textiles', 'Blancos', 'Toallas', 'Mantelería', 'Uniformes'],
    'Blanqueador Oxigenado Activo': ['Ropa blanca', 'Textiles', 'Superficies lavables'],
    'Cera Polimérica': ['Baldosa', 'Vinilo', 'Granito', 'Mármol sellado', 'Concreto pulido'],
    'Cera Brillo': ['Pisos tratados', 'Ceras', 'Selladores', 'Superficies institucionales'],
    'Cera Emulsionada': ['Granito sellado', 'Tableta', 'Baldosa', 'Vinilo', 'Pisos sintéticos'],
    Limpiabrillo: ['Pisos', 'Baldosa', 'Granito', 'Superficies de presentación diaria'],
    'Sellador de Superficies': ['Pisos porosos', 'Pisos lisos', 'Superficies de alto tráfico'],
    'Lustrador de Acero Inoxidable': ['Acero inoxidable', 'Aluminio', 'Ascensores', 'Mesones', 'Pasamanos'],
    'Lustra Muebles': ['Madera', 'Mobiliario', 'Recepciones', 'Oficinas', 'Habitaciones'],
    Silicona: ['Plásticos', 'Carcasas', 'Mobiliario sintético', 'Piezas negras'],
    Varsol: ['Metales', 'Equipos', 'Superficies técnicas', 'Piezas con grasa o aceite'],
  }

  if (surfacesByProduct[product.name]) return surfacesByProduct[product.name]

  if (ambientadorProductNames.includes(product.name)) {
    return ['Habitaciones', 'Baños', 'Recepciones', 'Oficinas', 'Zonas comunes']
  }

  if (jabonLiquidoProductNames.includes(product.name)) {
    return ['Manos', 'Cuerpo', 'Baños institucionales', 'Dispensadores', 'Vestieres']
  }

  const surfacesByFamily = {
    'limpieza-general': ['Pisos', 'Mesones', 'Baños', 'Cocinas', 'Superficies lavables'],
    lavanderia: ['Textiles', 'Blancos', 'Prendas institucionales'],
    desinfeccion: ['Pisos', 'Baños', 'Superficies lavables', 'Zonas sanitarias'],
    'pisos-superficies': ['Pisos', 'Mobiliario', 'Superficies de alto tráfico'],
  }

  return surfacesByFamily[family.id] ?? ['Superficies de operación profesional']
}

function getProductApplications(product, family) {
  const applicationsByProduct = {
    Desengrasante: ['Remoción de grasa pesada', 'Limpieza de equipos y superficies de cocina', 'Mantenimiento industrial y operativo'],
    'Des-Oxi Desincrustante': ['Remoción de óxido', 'Recuperación de superficies minerales', 'Limpieza puntual de sanitarios, tinas y senderos'],
    'Limpia Vidrios': ['Limpieza de cristales y espejos', 'Mantenimiento de ventanas y lámparas', 'Presentación diaria de áreas visibles'],
    'Shampoo de Alfombras': ['Lavado de alfombras y tapicerías', 'Control de manchas y malos olores', 'Mantenimiento de textiles decorativos'],
    Biovarsol: ['Remoción de manchas difíciles', 'Limpieza de vinilo, cuero, fórmica y metal', 'Apoyo en mantenimiento técnico'],
    'Crema Limpiadora': ['Brillo y protección de aluminio', 'Desengrase de acero inoxidable', 'Mantenimiento de artículos metálicos sin abrasivos'],
    'Multipropósito K': ['Desengrase de superficies técnicas', 'Limpieza de plásticos, metales y cauchos', 'Mantenimiento en cocina e industria'],
    'Detergente Navazul': ['Lavado institucional de textiles', 'Remoción de suciedad pesada', 'Rutinas de lavandería con aguas duras'],
    'Suavizante Textil': ['Suavizado de prendas', 'Acabado de toallas, mantelería y uniformes', 'Cuidado textil institucional'],
    'Blanqueador Oxigenado Activo': ['Blanqueo y desmanchado textil', 'Apoyo en limpieza de superficies lavables', 'Rutinas sin cloro en prendas resistentes'],
    'Limpiador Desinfectante': ['Limpieza y desinfección diaria', 'Control sanitario en baños y pisos', 'Mantenimiento de superficies lavables'],
    'Neutralizador de Olores': ['Neutralización de olores fuertes', 'Desinfección en shuts y ascensores', 'Control de zonas con residuos orgánicos'],
    'Blanqueador 2.7% y 3.7%': ['Desinfección alcalina', 'Blanqueo de superficies resistentes', 'Rutinas sanitarias de mantenimiento'],
    'Blanqueador 5.25%': ['Desinfección de mayor concentración', 'Blanqueo de áreas resistentes', 'Apoyo sanitario profesional'],
    'Hipoclorito 13%': ['Desinfección de alta concentración', 'Tratamiento de superficies resistentes', 'Apoyo en control microbiológico'],
    'Hipoclorito 15%': ['Desinfección intensiva', 'Tratamiento profesional de áreas resistentes', 'Apoyo en protocolos sanitarios'],
    'Alcohol Industrial 70%': ['Desinfección rápida de superficies', 'Limpieza de puntos de contacto', 'Apoyo sanitario operativo'],
    'Alcohol Etílico 96%': ['Preparación de soluciones técnicas', 'Limpieza de superficies compatibles', 'Uso profesional controlado'],
    Creolina: ['Desinfección industrial', 'Control de olores fuertes', 'Mantenimiento de bodegas y áreas de residuos'],
    'Removedor de Ceras': ['Retiro de capas envejecidas', 'Preparación de pisos antes de sellado', 'Limpieza profunda de superficies tratadas'],
    'Cera Polimérica': ['Protección de pisos', 'Acabado brillante institucional', 'Mantenimiento de tráfico medio y alto'],
    'Cera Brillo': ['Restauración de brillo', 'Mantenimiento de ceras y selladores', 'Presentación diaria de pisos tratados'],
    'Cera Emulsionada': ['Protección antideslizante', 'Brillo en pisos sintéticos y baldosa', 'Mantenimiento periódico de pisos'],
    Limpiabrillo: ['Limpieza y brillo en una aplicación', 'Mantenimiento visual de pisos', 'Presentación de áreas de alto tráfico'],
    'Sellador de Superficies': ['Sellado de pisos porosos', 'Protección de superficies de alto tráfico', 'Base para acabados de mantenimiento'],
    'Lustrador de Acero Inoxidable': ['Brillo y protección de acero inoxidable', 'Mantenimiento de ascensores, mesones y pasamanos', 'Presentación de áreas visibles'],
    'Lustra Muebles': ['Limpieza y brillo de madera', 'Mantenimiento de mobiliario institucional', 'Cuidado de oficinas, recepciones y habitaciones'],
    Silicona: ['Renovación de plásticos y piezas negras', 'Mantenimiento de mobiliario sintético', 'Presentación de equipos y superficies técnicas'],
    Varsol: ['Desengrase técnico', 'Limpieza de piezas con aceite o pintura', 'Dilución de sustancias grasas en operación industrial'],
  }

  if (product.name === 'Detergente Multicocina') {
    return ['Lavado de loza y utensilios', 'Desengrase de campanas, mesones y equipos', 'Rutina diaria e inmersión en cocinas profesionales']
  }

  if (product.name === 'Detergente Limpiador Multiusos') {
    return ['Limpieza diaria de superficies lavables', 'Mantenimiento de baños, pisos y mesones', 'Presentación de áreas comerciales e institucionales']
  }

  if (applicationsByProduct[product.name]) {
    return applicationsByProduct[product.name]
  }

  if (ambientadorProductNames.includes(product.name)) {
    return ['Aromatización profesional', 'Presentación de espacios', 'Apoyo a percepción de limpieza']
  }

  if (jabonLiquidoProductNames.includes(product.name)) {
    return ['Higiene de manos', 'Baños institucionales', 'Reposición en dispensadores']
  }

  const applicationsByFamily = {
    'limpieza-general': ['Limpieza diaria', 'Mantenimiento operativo', 'Presentación de áreas comerciales'],
    lavanderia: ['Lavado institucional', 'Cuidado de textiles', 'Procesos repetibles de lavandería'],
    desinfeccion: ['Higiene profesional', 'Control sanitario', 'Rutinas de desinfección'],
    'pisos-superficies': ['Mantenimiento de superficies', 'Recuperación visual', 'Protección de alto tráfico'],
  }

  return applicationsByFamily[family.id] ?? ['Operación profesional', 'Mantenimiento diario']
}

function getProductProtocol(product) {
  const protocolByProduct = {
    'Detergente Limpiador Multiusos': [
      'Preparar la dilución según nivel de suciedad.',
      'Aplicar con paño, mopa, esponja o atomizador sobre la superficie lavable.',
      'Restregar si hay suciedad adherida y retirar residuos.',
      'Enjuagar cuando la superficie lo requiera o dejar secar en limpieza ligera.',
    ],
    Desengrasante: [
      'Preparar la dilución de acuerdo con la carga de grasa o usar puro en suciedad crítica.',
      'Aplicar sobre la superficie fría con paño, esponja, atomizador o herramienta adecuada.',
      'Dejar actuar unos minutos y restregar las zonas con grasa adherida.',
      'Retirar residuos y enjuagar con agua en superficies de cocina o contacto operativo.',
    ],
    'Des-Oxi Desincrustante': [
      'Aplicar en el punto afectado por óxido o incrustación, usando dilución o producto puro según severidad.',
      'Dejar actuar de forma controlada y restregar con herramienta compatible.',
      'Enjuagar con abundante agua y retirar residuos.',
      'Realizar prueba previa en superficies delicadas, metálicas o con acabado especial.',
    ],
    'Limpia Vidrios': [
      'Aplicar la dilución o producto puro sobre vidrio, espejo o cristal compatible.',
      'Distribuir con paño limpio, atomizador o jalador de vidrios.',
      'Retirar exceso y secar para evitar marcas.',
      'No aplicar sobre superficies calientes o bajo sol directo intenso.',
    ],
    'Shampoo de Alfombras': [
      'Aspirar o retirar suciedad suelta antes de iniciar.',
      'Preparar la dilución según nivel de suciedad y aplicar sobre alfombra, tapete o tapicería.',
      'Cepillar o trabajar la espuma de forma uniforme.',
      'Retirar humedad y permitir secado completo antes de habilitar el área.',
    ],
    Biovarsol: [
      'Aplicar puro sobre la mancha o superficie compatible.',
      'Dejar actuar brevemente sin permitir secado excesivo.',
      'Restregar con paño o herramienta adecuada.',
      'Retirar residuos y hacer prueba previa en cuero, madera o acabados delicados.',
    ],
    'Crema Limpiadora': [
      'Aplicar puro sobre aluminio, acero inoxidable o superficie metálica compatible.',
      'Distribuir con paño, esponja suave o fibra no abrasiva.',
      'Frotar de forma uniforme para brillar, desengrasar y proteger.',
      'Retirar exceso y pulir con paño limpio hasta lograr el acabado deseado.',
    ],
    'Multipropósito K': [
      'Preparar la dilución o aplicar puro según nivel de grasa.',
      'Distribuir sobre la superficie con paño, esponja o atomizador.',
      'Dejar actuar y restregar si hay suciedad pesada.',
      'Retirar residuos y enjuagar en superficies que lo requieran.',
    ],
    'Detergente Navazul': [
      'Dosificar 40-60 ml para una carga media de 5-6 kg o 100-120 ml para una carga grande de 20 kg.',
      'Colocar el detergente en el dispensador de la lavadora o mediante dosificador manual.',
      'Para superficies, aplicar la dilución indicada, restregar y enjuagar con agua.',
      'No exceder la dosis; para prendas delicadas usar la dosis mínima.',
    ],
    'Suavizante Textil': [
      'Dosificar 50-80 ml para una carga media de 5-6 kg o 80-100 ml para una carga grande de 20 kg.',
      'Colocar el suavizante en el dispensador o directamente en la lavadora, según el tipo de máquina.',
      'Para prendas delicadas, la ficha técnica recomienda usar la dosis máxima de 100 ml.',
      'No mezclar con productos aniónicos fuertes y conservar en su envase original.',
    ],
    'Limpiador Desinfectante': [
      'Preparar la dilución según rutina de limpieza o desinfección.',
      'Aplicar sobre pisos, baños o superficies lavables previamente libres de exceso de suciedad.',
      'Distribuir con mopa, paño o atomizador y dejar actuar según necesidad operativa.',
      'Dejar secar o retirar exceso en superficies que lo requieran.',
    ],
    'Neutralizador de Olores': [
      'Identificar y retirar la fuente principal del mal olor cuando sea posible.',
      'Aplicar diluido o puro sobre la zona afectada según intensidad.',
      'Distribuir de forma uniforme en shuts, ascensores o superficies compatibles.',
      'Ventilar el área y repetir si la carga de olor persiste.',
    ],
    'Blanqueador 2.7% y 3.7%': [
      'Preparar la dilución específica para utensilios, equipos, paredes, techos, pisos o superficies.',
      'Aplicar sobre la superficie o elemento que se va a desinfectar o blanquear.',
      'Respetar el tiempo de acción de 5-10 o 10-15 minutos indicado para cada aplicación.',
      'Enjuagar cuando aplique y no mezclar con ácidos, amoniaco u otros productos.',
    ],
    'Blanqueador 5.25%': [
      'Preparar la dilución específica para utensilios, equipos, paredes, techos, pisos o superficies.',
      'Aplicar sobre la superficie o elemento que se va a desinfectar o blanquear.',
      'Respetar el tiempo de acción de 5-10 o 10-15 minutos indicado para cada aplicación.',
      'Enjuagar cuando aplique y no mezclar con ácidos, amoniaco u otros productos.',
    ],
    'Hipoclorito 13%': [
      'Preparar la dilución específica para utensilios, equipos, paredes, techos, pisos o superficies.',
      'Aplicar solo sobre superficies resistentes compatibles.',
      'Respetar el tiempo de acción de 5-10 o 10-15 minutos indicado para cada aplicación.',
      'Enjuagar cuando aplique y no mezclar con ácidos, amoniaco u otros productos.',
    ],
    'Hipoclorito 15%': [
      'Preparar la dilución específica para utensilios, equipos, paredes, techos, pisos o superficies.',
      'Aplicar solo sobre superficies resistentes compatibles.',
      'Respetar el tiempo de acción de 5-10 o 10-15 minutos indicado para cada aplicación.',
      'Enjuagar cuando aplique y no mezclar con ácidos, amoniaco u otros productos.',
    ],
    'Alcohol Industrial 70%': [
      'Aplicar puro sobre la superficie compatible y previamente limpia.',
      'Distribuir con paño limpio o atomizador.',
      'Dejar evaporar sin enjuague.',
      'Mantener lejos de calor, chispas o llama durante la aplicación.',
    ],
    'Alcohol Etílico 96%': [
      'Usar puro o como base de preparación técnica según protocolo interno.',
      'Aplicar sobre superficies compatibles con paño limpio o atomizador.',
      'Dejar evaporar completamente.',
      'Mantener lejos de calor, chispas o llama durante la aplicación.',
    ],
    Creolina: [
      'Aplicar en áreas industriales o de residuos según necesidad de desinfección y control de olor.',
      'Distribuir sobre superficies resistentes con herramienta adecuada.',
      'Dejar actuar con ventilación suficiente.',
      'Restringir el uso en áreas sensibles y evitar contacto con alimentos o zonas de preparación.',
    ],
    'Removedor de Ceras': [
      'Aplicar la dilución o producto puro sobre el piso tratado.',
      'Dejar actuar el tiempo necesario para ablandar capas envejecidas.',
      'Restregar con máquina, pad o herramienta adecuada.',
      'Retirar residuos y enjuagar antes de aplicar sellador o nueva cera.',
    ],
    'Cera Polimérica': [
      'Limpiar y secar completamente el piso antes de aplicar.',
      'Aplicar capas delgadas y uniformes con mopa o aplicador limpio.',
      'Dejar secar entre capas según condición ambiental.',
      'Habilitar el tránsito solo cuando el acabado esté seco.',
    ],
    'Cera Brillo': [
      'Limpiar el piso tratado antes de aplicar.',
      'Distribuir una capa ligera y uniforme sobre la superficie.',
      'Dejar secar y brillar según rutina de mantenimiento.',
      'Evitar exceso de producto para prevenir marcas o acumulación.',
    ],
    'Cera Emulsionada': [
      'Aplicar sobre piso limpio y seco.',
      'Distribuir de forma uniforme con mopa o aplicador.',
      'Permitir secado completo antes de tránsito.',
      'Repetir capas solo si el acabado y el nivel de tráfico lo requieren.',
    ],
    Limpiabrillo: [
      'Aplicar puro sobre la superficie limpia o con suciedad ligera.',
      'Distribuir con mopa o paño de forma uniforme.',
      'Dejar secar o brillar según acabado esperado.',
      'Evitar acumulación en esquinas o juntas.',
    ],
    'Sellador de Superficies': [
      'Preparar el piso limpio, seco y libre de ceras antiguas.',
      'Aplicar capas delgadas y uniformes con aplicador limpio.',
      'Dejar secar entre capas.',
      'Habilitar tránsito solo cuando el sellado esté completamente seco.',
    ],
    'Lustrador de Acero Inoxidable': [
      'Limpiar suciedad o grasa superficial antes de lustrar.',
      'Aplicar poca cantidad sobre paño limpio.',
      'Distribuir siguiendo la dirección del acero o acabado.',
      'Retirar exceso y pulir hasta lograr brillo uniforme.',
    ],
    'Lustra Muebles': [
      'Aplicar poca cantidad sobre paño limpio y seco.',
      'Distribuir sobre madera o mobiliario compatible.',
      'Pulir hasta obtener brillo uniforme.',
      'Realizar prueba previa en acabados delicados o porosos.',
    ],
    Silicona: [
      'Limpiar polvo o suciedad de la superficie antes de aplicar.',
      'Aplicar poca cantidad sobre paño o directamente según el área.',
      'Distribuir de forma uniforme sobre plástico o pieza compatible.',
      'Retirar exceso para evitar sensación grasosa.',
    ],
    Varsol: [
      'Aplicar en poca cantidad sobre pieza o superficie compatible.',
      'Dejar actuar brevemente sobre grasa, aceite o pintura.',
      'Retirar con paño o herramienta adecuada.',
      'Usar en área ventilada y lejos de fuentes de ignición.',
    ],
  }

  if (product.name === 'Detergente Multicocina') {
    return [
      'Preparar la dilución según uso: rutina diaria, inmersión o limpieza profunda.',
      'Aplicar sobre esponja, fibra o herramienta adecuada y restregar loza, utensilios, mesones o equipos.',
      'En inmersión, dejar actuar cerca de 5 minutos sobre utensilios sin residuos de alimentos.',
      'Retirar residuos y enjuagar con agua. No mezclar con otros productos.',
    ]
  }

  if (protocolByProduct[product.name]) {
    return protocolByProduct[product.name]
  }

  if (jabonLiquidoProductNames.includes(product.name)) {
    return [
      'Verter en dispensador limpio o usar puro según sistema de reenvase.',
      'Aplicar sobre manos o cuerpo húmedo.',
      'Frotar hasta generar espuma y cubrir la zona de lavado.',
      'Enjuagar con agua y secar.',
    ]
  }

  if (ambientadorProductNames.includes(product.name)) {
    return [
      'Aplicar puro en el ambiente o sobre superficies compatibles.',
      'Atomizar de forma moderada en zonas ventiladas.',
      'Evitar alimentos, textiles delicados y superficies calientes.',
      'Repetir según intensidad de fragancia requerida.',
    ]
  }

  const noDilution = /uso puro|no se mezcla|no se diluye/i.test(formatProductDilution(product.dilution) ?? '')

  if (noDilution) {
    return [
      'Aplicar el producto puro sobre la superficie o zona requerida.',
      'Distribuir de forma uniforme según el tipo de uso.',
      'Realizar prueba previa en un área no visible cuando aplique.',
      'No mezclar con otros productos o sustancias.',
    ]
  }

  return [
    'Preparar la dilución recomendada según nivel de suciedad y tipo de operación.',
    'Aplicar sobre la superficie con paño, mopa, atomizador o herramienta adecuada.',
    'Dejar actuar según necesidad operativa y retirar residuos si corresponde.',
    'Realizar prueba previa en un área no visible cuando aplique.',
  ]
}

function getProductRecommendedUseTitle(product, family) {
  if (family?.id === 'pisos-superficies') {
    return 'Mantenimiento de pisos y superficies'
  }

  if (family?.id === 'desinfeccion') {
    return 'Rutinas de higiene y desinfección'
  }

  if (family?.id === 'lavanderia') {
    return 'Cuidado textil y procesos de lavado'
  }

  if (ambientadorProductNames.includes(product.name)) {
    return 'Aromatización y espacios recomendados'
  }

  if (/jabón|jabon/i.test(product.name)) {
    return 'Puntos de higiene y lavado diario'
  }

  return 'Superficies y rutinas de limpieza'
}

function getProductTechnicalSpecs(product, family) {
  const relatedSectors = getProductRelatedSectors(product, family)
  const surfaces = getProductSurfaces(product, family)
  const applications = getProductApplications(product, family)

  return {
    technicalSheetHref: product.technicalSheetHref,
    safetySheetHref: product.safetySheetHref,
    hasDocumentedUse: Boolean(product.technicalSheetHref && product.safetySheetHref),
    recommendedUseTitle: getProductRecommendedUseTitle(product, family),
    surfaces,
    protocol: getProductProtocol(product),
    applications,
    relatedSectors: relatedSectors.length ? relatedSectors : ['Empresas', 'Operación comercial'],
  }
}

function normalizeHash(hash) {
  return hash.replace(/^#/, '').replace(/^\/+|\/+$/g, '')
}

function getPagePath(pageKey = '') {
  if (!pageKey) return '/'
  if (pageKey.startsWith('/')) return pageKey
  if (pageKey.includes('/')) return `/${pageKey}`
  if (primaryPagePathByKey[pageKey]) return primaryPagePathByKey[pageKey]
  return `/${pageKey}`
}

function getCleanPageUrl(origin, pageKey = '') {
  return `${origin}${getPagePath(pageKey)}`
}

function getRouteFromLocation() {
  const hashRoute = normalizeHash(window.location.hash)
  if (hashRoute) return hashRoute

  const pathnameRoute = window.location.pathname.replace(/^\/+|\/+$/g, '')
  return pathnameRoute
}

function resolveRouteKey(route) {
  const normalizedRoute = normalizeHash(route)
  return routeAliases[normalizedRoute] ?? normalizedRoute
}

function useHashRoute() {
  const [route, setRoute] = useState(getRouteFromLocation)

  useEffect(() => {
    const onRouteChange = () => setRoute(getRouteFromLocation())
    window.addEventListener('popstate', onRouteChange)
    const onHashChange = () => setRoute(getRouteFromLocation())
    window.addEventListener('hashchange', onHashChange)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('popstate', onRouteChange)
    }
  }, [])

  return route
}

function toAbsoluteAssetUrl(origin, assetPath) {
  if (!assetPath) return undefined
  if (/^https?:\/\//i.test(assetPath)) return assetPath
  return `${origin}${assetPath.startsWith('/') ? assetPath : `/${assetPath}`}`
}

function buildLineasStructuredData(origin) {
  const baseUrl = getCleanPageUrl(origin, 'lineas')

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Portafolio B2B Naval',
      url: baseUrl,
      inLanguage: 'es-CO',
      description:
        'Portafolio Naval para higiene institucional, mantenimiento de superficies, lavandería y sanitización en operaciones B2B.',
      publisher: {
        '@type': 'Organization',
        name: 'Naval',
        url: origin,
      },
      mainEntity: {
        '@type': 'ItemList',
        name: 'Frentes de operación Naval',
        itemListElement: pageContent.lineas.productFamilies.map((family, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: family.cardTitle,
          url: getCleanPageUrl(origin, `lineas-${family.id}`),
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Qué líneas maneja Naval para empresas?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Naval organiza su oferta en aseo general, tratamiento de pisos y superficies, lavandería y sanitización para operación B2B.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Para qué sectores está pensado el portafolio?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Está diseñado para hoteles, restaurantes, colegios, conjuntos residenciales, gimnasios, lavanderías y empresas con compras recurrentes.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Naval atiende cotizaciones institucionales?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí. La marca acompaña solicitudes B2B con clasificación por necesidad, presentaciones institucionales y ruta comercial para compras de continuidad.',
          },
        },
      ],
    },
  ]
}

function buildGlobalStructuredData(origin) {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    name: brandName,
    alternateName: 'Naval',
    url: origin,
    email: localBusinessEmail,
    telephone: localBusinessPhone,
    logo: toAbsoluteAssetUrl(origin, brandImage),
    sameAs: [whatsappHref],
    areaServed: [
      { '@type': 'City', name: 'Bogotá' },
      { '@type': 'Country', name: 'Colombia' },
    ],
    knowsAbout: [
      'productos de limpieza profesional',
      'productos de limpieza industrial',
      'limpieza institucional',
      'desinfección profesional',
      'mantenimiento de superficies',
      'productos biodegradables',
    ],
  }

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${origin}/#localbusiness`,
    name: brandName,
    url: origin,
    image: toAbsoluteAssetUrl(origin, brandImage),
    email: localBusinessEmail,
    telephone: localBusinessPhone,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bogotá',
      addressCountry: 'CO',
    },
    areaServed: ['Bogotá', 'Colombia'],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    name: brandName,
    url: origin,
    inLanguage: 'es-CO',
    publisher: { '@id': `${origin}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${origin}/productos?buscar={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const navigation = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: actions.map((action) => action.title),
    url: actions.map((action) => getCleanPageUrl(origin, normalizeHash(action.href))),
  }

  return [organization, localBusiness, website, navigation]
}

function buildBreadcrumbStructuredData(origin, pageKey, page, canonicalKey = pageKey) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: origin,
    },
  ]

  if (pageKey.startsWith('producto-')) {
    items.push(
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Líneas de producto',
        item: getCleanPageUrl(origin, 'lineas'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: page.family?.eyebrow ?? 'Producto',
        item: getCleanPageUrl(origin, `lineas-${page.family?.id}`),
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: page.product?.name ?? page.title,
        item: getCleanPageUrl(origin, canonicalKey),
      },
    )
  } else if (pageKey.startsWith('lineas-')) {
    items.push(
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Líneas de producto',
        item: getCleanPageUrl(origin, 'lineas'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: page.family?.eyebrow ?? page.title,
        item: getCleanPageUrl(origin, canonicalKey),
      },
    )
  } else if (pageKey.startsWith('sectores-')) {
    items.push(
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Sectores',
        item: getCleanPageUrl(origin, 'lineas'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Sector ${page.sector?.title ?? page.title}`,
        item: getCleanPageUrl(origin, canonicalKey),
      },
    )
  } else if (pageKey) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: page.title,
      item: getCleanPageUrl(origin, canonicalKey),
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

function buildProductStructuredData(origin, pageKey, page) {
  if (!page.product) return null

  const imageUrls = (page.product.gallery?.length ? page.product.gallery : [{ image: page.product.image }])
    .map((item) => toAbsoluteAssetUrl(origin, item.image))
    .filter(Boolean)
  const technicalSpecs = getProductTechnicalSpecs(page.product, page.family)

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: page.product.name,
    image: imageUrls,
    description: page.product.summary,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    category: page.family?.eyebrow,
    sku: page.product.slug,
    url: getCleanPageUrl(origin, pageKey),
    offers: {
      '@type': 'Offer',
      url: getCleanPageUrl(origin, pageKey),
      priceCurrency: 'COP',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@id': `${origin}/#organization`,
      },
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Presentaciones',
        value: page.product.presentations?.join(', '),
      },
      {
        '@type': 'PropertyValue',
        name: 'Superficies recomendadas',
        value: technicalSpecs.surfaces?.join(', '),
      },
      {
        '@type': 'PropertyValue',
        name: 'Sectores relacionados',
        value: technicalSpecs.relatedSectors?.join(', '),
      },
      {
        '@type': 'PropertyValue',
        name: 'Dilución o dosificación',
        value: formatProductDilution(page.product.dilution),
      },
      {
        '@type': 'PropertyValue',
        name: 'Aplicaciones profesionales',
        value: technicalSpecs.applications?.join(', '),
      },
      {
        '@type': 'PropertyValue',
        name: 'Ficha técnica PDF',
        value: technicalSpecs.technicalSheetHref ? `${origin}${technicalSpecs.technicalSheetHref}` : null,
      },
      {
        '@type': 'PropertyValue',
        name: 'Ficha de datos de seguridad PDF',
        value: technicalSpecs.safetySheetHref ? `${origin}${technicalSpecs.safetySheetHref}` : null,
      },
    ].filter((item) => item.value),
  }
}

function buildFaqStructuredData(page) {
  if (!page.sections?.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.sections.map((item) => ({
      '@type': 'Question',
      name: item.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.text,
      },
    })),
  }
}

function buildWebPageStructuredData(origin, pageKey, page) {
  return {
    '@context': 'https://schema.org',
    '@type': pageKey.startsWith('producto-') ? 'ItemPage' : 'WebPage',
    '@id': `${getCleanPageUrl(origin, pageKey)}#webpage`,
    name: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.intro,
    url: getCleanPageUrl(origin, pageKey),
    inLanguage: 'es-CO',
    isPartOf: { '@id': `${origin}/#website` },
    about: { '@id': `${origin}/#organization` },
  }
}

function usePageSeo({ pageKey = '', title, description, keywords, structuredData, image, noIndex = false }) {
  useEffect(() => {
    document.title = title

    const upsertMeta = (name, content, attribute = 'name') => {
      let element = document.head.querySelector(`meta[${attribute}="${name}"]`)

      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }

      element.setAttribute('content', content)
    }

    const origin = window.location.origin.includes('localhost') ? siteUrl : window.location.origin
    const canonicalUrl = getCleanPageUrl(origin, pageKey)
    const sharingImage = toAbsoluteAssetUrl(origin, image || brandImage)

    upsertMeta('description', description)
    upsertMeta('robots', noIndex ? 'noindex,follow' : 'index,follow,max-image-preview:large')
    upsertMeta('author', brandName)
    upsertMeta('theme-color', '#2f438f')
    upsertMeta('keywords', keywords || defaultSeoKeywords)
    upsertMeta('og:title', title, 'property')
    upsertMeta('og:description', description, 'property')
    upsertMeta('og:type', 'website', 'property')
    upsertMeta('og:locale', 'es_CO', 'property')
    upsertMeta('og:site_name', brandName, 'property')
    upsertMeta('og:url', canonicalUrl, 'property')
    upsertMeta('og:image', sharingImage, 'property')
    upsertMeta('twitter:card', 'summary_large_image')
    upsertMeta('twitter:title', title, 'name')
    upsertMeta('twitter:description', description, 'name')
    upsertMeta('twitter:image', sharingImage, 'name')

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)

    document.documentElement.setAttribute('lang', 'es-CO')

    const existingJsonLd = document.head.querySelector('script[data-page-schema="true"]')
    if (existingJsonLd) {
      existingJsonLd.remove()
    }

    const schemaGraph = [
      ...buildGlobalStructuredData(origin),
      ...(Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : []),
    ]

    if (schemaGraph.length) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.pageSchema = 'true'
      script.textContent = JSON.stringify(schemaGraph)
      document.head.appendChild(script)
    }
  }, [description, image, keywords, noIndex, pageKey, structuredData, title])
}

function getAnimatedMetricConfig(value) {
  if (/^\+\d+$/.test(value)) {
    return {
      target: Number.parseInt(value.slice(1), 10),
      prefix: '',
      suffix: '',
    }
  }

  if (/^\d+\s+años$/.test(value)) {
    return {
      target: Number.parseInt(value, 10),
      prefix: '',
      suffix: ' años',
    }
  }

  return null
}

function AnimatedMetricValue({ value, animate }) {
  const config = useMemo(() => getAnimatedMetricConfig(value), [value])
  const [displayValue, setDisplayValue] = useState(() => (config ? 1 : value))

  useEffect(() => {
    setDisplayValue(config ? 1 : value)
  }, [config, value])

  useEffect(() => {
    if (!config || !animate) {
      return
    }

    const duration = config.target > 100 ? 1800 : 1400
    const startValue = 1
    const startTime = performance.now()
    let frameId = 0

    const tick = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = 1 - (1 - progress) ** 3
      const nextValue = Math.round(startValue + (config.target - startValue) * easedProgress)

      setDisplayValue(nextValue)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frameId)
  }, [animate, config])

  if (!config) {
    return value
  }

  return `${config.prefix}${displayValue}${config.suffix}`
}

function RotatingExamplesTrack() {
  const [startIndex, setStartIndex] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setStartIndex((current) => (current + 1) % exampleImages.length)
    }, 6000)

    return () => window.clearInterval(intervalId)
  }, [startIndex])

  const visibleImages = Array.from({ length: 3 }, (_, offset) => {
    return exampleImages[(startIndex + offset) % exampleImages.length]
  })

  return (
    <div className="about-video-banner__track" aria-label="Carrusel de casos y resultados">
      {visibleImages.map((image, index) => (
        <div key={`${image.alt}-${index}`} className="about-video-banner__card">
          <img src={image.src} alt={image.alt} className="about-video-banner__image" loading="lazy" decoding="async" />
        </div>
      ))}
    </div>
  )
}

function ValueIcon({ icon }) {
  const commonProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  if (icon === 'health') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path {...commonProps} d="M24 36s-10-5.9-10-14.1C14 17 17.1 14 21 14c1.8 0 3.6.8 5 2.2 1.4-1.4 3.2-2.2 5-2.2 3.9 0 7 3 7 7.9C38 30.1 28 36 28 36h-4Z" />
        <path {...commonProps} d="M18.5 25h4l2-4 2.5 8 2-4h4.5" />
      </svg>
    )
  }

  if (icon === 'efficiency') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle {...commonProps} cx="24" cy="24" r="15" />
        <path {...commonProps} d="M24 14v10l6 4" />
        <path {...commonProps} d="M13 24h-2.5" />
        <path {...commonProps} d="M37.5 24H35" />
        <path {...commonProps} d="M24 13V10.5" />
        <path {...commonProps} d="M24 37.5V35" />
      </svg>
    )
  }

  if (icon === 'technical') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path {...commonProps} d="M24 8 35 13v8c0 8-4.7 13.2-11 16-6.3-2.8-11-8-11-16v-8L24 8Z" />
        <path {...commonProps} d="m19.5 24 3 3 6-7" />
      </svg>
    )
  }

  if (icon === 'trust') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle {...commonProps} cx="24" cy="20" r="11.5" />
        <path {...commonProps} d="m24 13.8 2.4 4.8 5.4.8-3.9 3.7.9 5.2-4.8-2.5-4.8 2.5.9-5.2-3.9-3.7 5.4-.8 2.4-4.8Z" />
        <path {...commonProps} d="M18.5 30.2 15.8 40l8.2-5.3" />
        <path {...commonProps} d="M29.5 30.2 32.2 40 24 34.7" />
      </svg>
    )
  }
}

function ProductLinesPageSections({ page }) {
  const [activeSectorIndex, setActiveSectorIndex] = useState(0)
  const [isSectorRotationPaused, setIsSectorRotationPaused] = useState(false)
  const sectorCardsPerView = 4

  useEffect(() => {
    if (isSectorRotationPaused) return undefined

    const intervalId = window.setInterval(() => {
      setActiveSectorIndex((currentIndex) => (currentIndex + 1) % page.sectors.length)
    }, 4500)

    return () => window.clearInterval(intervalId)
  }, [isSectorRotationPaused, page.sectors.length])

  const visibleSectors = useMemo(() => {
    return Array.from({ length: Math.min(sectorCardsPerView, page.sectors.length) }, (_, index) => {
      const sectorIndex = (activeSectorIndex + index) % page.sectors.length
      return page.sectors[sectorIndex]
    })
  }, [activeSectorIndex, page.sectors])

  const goToPreviousSector = () => {
    setIsSectorRotationPaused(true)
    setActiveSectorIndex((currentIndex) => (currentIndex - 1 + page.sectors.length) % page.sectors.length)
  }

  const goToNextSector = () => {
    setIsSectorRotationPaused(true)
    setActiveSectorIndex((currentIndex) => (currentIndex + 1) % page.sectors.length)
  }

  return (
    <section id="portafolio" className="product-lines-board" aria-label="Líneas de producto Naval">
      <section id="sectores-soluciones" className="sector-showcase" aria-labelledby="sector-showcase-title">
        <div className="sector-showcase__header">
          <p>Sectores</p>
          <h2 id="sector-showcase-title">Soluciones especializadas para cada sector empresarial</h2>
          <span>
            Naval desarrolla soluciones especializadas en limpieza para hoteles, cocinas industriales, colegios,
            gimnasios, conjuntos residenciales y empresas que requieren higiene constante y mantenimiento eficiente.
          </span>
        </div>

        <div
          className="sector-showcase__carousel"
          aria-label="Sectores atendidos por Naval"
          onMouseEnter={() => setIsSectorRotationPaused(true)}
          onFocusCapture={() => setIsSectorRotationPaused(true)}
        >
          <div className="sector-showcase__tools" aria-label="Controles de sectores">
            <div className="sector-showcase__controls">
              <button type="button" onClick={goToPreviousSector} aria-label="Ver sector anterior">
                ‹
              </button>
              <button type="button" onClick={goToNextSector} aria-label="Ver siguiente sector">
                ›
              </button>
            </div>
          </div>
          <div className="sector-showcase__track">
            {visibleSectors.map((sector, sectorIndex) => (
              <article
                key={`${sector.title}-${sectorIndex}`}
                className="sector-card"
                style={{
                  '--sector-card-image': `url(${sector.image})`,
                }}
              >
                <div className="sector-card__media" role="img" aria-label={sector.imageAlt} />
                <div className="sector-card__body">
                  <div>
                    <p>Sector</p>
                    <h3>{sector.title}</h3>
                    <span>{sector.text}</span>
                  </div>
                  <a href={sector.href}>Explorar soluciones</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div id="lineas-producto" className="product-lines-board__header">
        <p>Líneas de producto</p>
        <h2>Portafolio operativo B2B</h2>
        <p>
          Líneas de limpieza profesional para mantenimiento institucional,
          pisos, superficies, lavandería y desinfección en operaciones
          empresariales.
        </p>
      </div>

      <div className="product-lines-board__grid">
        {page.productFamilies.map((family, index) => (
          <a
            key={family.id}
            className="product-line-card"
            href={getPagePath(`lineas-${family.id}`)}
            id={family.id}
            style={{
              '--product-line-image': `url(${family.image})`,
            }}
            aria-label={`Ver productos de ${family.eyebrow}`}
          >
            <span className="product-line-card__shade" aria-hidden="true" />
            <span className="product-line-card__content">
              <span className="product-line-card__eyebrow">{`Línea ${index + 1}`}</span>
              <strong>{family.cardTitle}</strong>
              <span>{family.cardText}</span>
              <span className="product-line-card__cta">{family.cardCta ?? 'Ver productos'}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

function ProductFamilyDetailSections({ page }) {
  const lineFamilies = pageContent.lineas.productFamilies
  const allProducts = lineFamilies.flatMap((family) => family.products.map((product) => ({ product, family })))
  const sectorItems = pageContent.lineas.sectors ?? []
  const isSectorCatalog = Boolean(page.sector)
  const rawCatalogItems = page.allProductsCatalog
    ? allProducts
    : page.family.products.map((product) => ({ product, family: page.family }))
  const [catalogSearchTerm, setCatalogSearchTerm] = useState('')
  const baseCatalogItems = getCatalogDisplayItems(rawCatalogItems)
  const catalogSearchQuery = normalizeAssetName(catalogSearchTerm)
  const searchCatalogItems = getCatalogDisplayItems(allProducts)
  const catalogItems = catalogSearchQuery
    ? searchCatalogItems.filter(({ product, family }) => {
      const searchableText = normalizeAssetName(
        [
          product.name,
          product.summary,
          product.category,
          family.eyebrow,
          ...(product.presentations ?? []),
        ].filter(Boolean).join(' '),
      )

      return searchableText.includes(catalogSearchQuery)
    })
    : baseCatalogItems
  const productsPerPage = 12
  const totalPages = Math.max(1, Math.ceil(catalogItems.length / productsPerPage))
  const [catalogPage, setCatalogPage] = useState(0)
  const currentPage = Math.min(catalogPage, totalPages - 1)
  const firstProductIndex = currentPage * productsPerPage
  const visibleCatalogItems = catalogItems.slice(firstProductIndex, firstProductIndex + productsPerPage)
  const shownStart = catalogItems.length ? firstProductIndex + 1 : 0
  const shownEnd = firstProductIndex + visibleCatalogItems.length
  const catalogContextLabel = page.allProductsCatalog
    ? 'Todos los productos'
    : catalogSearchQuery
      ? 'Todos los productos'
      : isSectorCatalog
        ? `Productos del Sector ${page.sector.title}`
        : `Productos de ${page.family.eyebrow}`
  const quoteActionLabel = isSectorCatalog ? 'Cotizar sector' : 'Cotizar línea'
  const catalogQuotePrompt = isSectorCatalog
    ? getSectorQuotePrompt(page.sector.title)
    : getLineQuotePrompt(page.family.eyebrow)

  useEffect(() => {
    setCatalogPage(0)
  }, [page.family.id, page.sector?.title, catalogSearchTerm])

  const goToPreviousCatalogPage = () => {
    setCatalogPage((pageIndex) => Math.max(0, pageIndex - 1))
  }

  const goToNextCatalogPage = () => {
    setCatalogPage((pageIndex) => Math.min(totalPages - 1, pageIndex + 1))
  }

  return (
    <section className="product-catalog" id="detalle">
      <aside className="product-catalog__sidebar" aria-label="Filtros de productos">
        <label className="product-catalog__search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m21 21-4.3-4.3" />
            <circle cx="10.8" cy="10.8" r="6.2" />
          </svg>
          <input
            type="search"
            placeholder="Buscar producto"
            aria-label="Buscar producto"
            value={catalogSearchTerm}
            onChange={(event) => setCatalogSearchTerm(event.target.value)}
          />
        </label>

        <div className="product-catalog__featured">
          <a href={getPagePath('lineas-todos')} className={page.allProductsCatalog ? 'product-catalog__nav-link--active' : undefined}>
            Todos los productos
          </a>
        </div>

        <div className="product-catalog__nav-group">
          <h2>Limpieza por líneas</h2>
          <nav aria-label="Líneas de producto">
            {lineFamilies.map((family) => (
              <a
                key={family.id}
                href={getPagePath(`lineas-${family.id}`)}
                className={family.id === page.family.id ? 'product-catalog__nav-link--active' : undefined}
              >
                {family.eyebrow}
              </a>
            ))}
          </nav>
        </div>

        <div className="product-catalog__nav-group">
          <h2>Limpieza por sectores industriales</h2>
          <nav aria-label="Sectores industriales">
            {sectorItems.map((sector) => (
              <a
                key={sector.title}
                href={sector.href}
                className={isSectorCatalog && sector.title === page.sector.title ? 'product-catalog__nav-link--active' : undefined}
              >
                Sector {sector.title}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <div className="product-catalog__main" id="productos-recomendados">
        <div className="product-catalog__main-heading">
          <p className="product-catalog__context">{catalogContextLabel}</p>
	          {!page.allProductsCatalog ? (
	            <ChatbotCtaButton className="product-catalog__quote-link" ariaLabel={`${quoteActionLabel} con el chatbot Naval`} chatbotMessage={catalogQuotePrompt}>
	              <span className="product-catalog__quote-icon" aria-hidden="true">
	                <svg viewBox="0 0 24 24">
	                  <path d="M5 4h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-7.4l-4.8 3.2c-.74.49-1.8-.04-1.8-.93V18A3 3 0 0 1 2 15V7a3 3 0 0 1 3-3Z" />
	                  <path d="M7.5 10.5h9M7.5 13.5h6" />
	                </svg>
	              </span>
	              <span>{quoteActionLabel}</span>
	            </ChatbotCtaButton>
	          ) : null}
        </div>
        <p className="product-catalog__count">
          {catalogItems.length > 0
            ? `Mostrando ${shownStart}-${shownEnd} de ${catalogItems.length} resultados`
            : 'No encontramos productos con ese término.'}
        </p>

        {visibleCatalogItems.length > 0 ? (
          <div className="product-catalog__grid">
            {visibleCatalogItems.map(({ product, family }) => (
            <article key={`${family.id}-${product.slug}`} className="catalog-product-card">
              <a href={getPagePath(product.slug)} className="catalog-product-card__media" aria-label={`Ver ${getCatalogProductTitle(product)}`}>
                {product.image ? (
                  <img src={product.image} alt={getProductImageAlt(product, family)} loading="lazy" decoding="async" />
                ) : (
                  <ProductImagePlaceholder productName={getCatalogProductTitle(product)} />
                )}
              </a>

              <div className="catalog-product-card__body">
                <p>{family.eyebrow}</p>
                <h3>{getCatalogProductTitle(product)}</h3>
                <CatalogProductMeta product={product} />
                <a href={getPagePath(product.slug)}>Ver producto</a>
              </div>
            </article>
            ))}
          </div>
        ) : (
          <div className="product-catalog__empty" role="status">
            <p>Prueba con otro nombre, uso o presentación del producto.</p>
          </div>
        )}

        {totalPages > 1 ? (
          <nav className="product-catalog__pagination" aria-label="Paginación de productos">
            <button
              type="button"
              onClick={goToPreviousCatalogPage}
              disabled={currentPage === 0}
              aria-label="Ver productos anteriores"
            >
              ‹
            </button>
            <span>
              Página {currentPage + 1} de {totalPages}
            </span>
            <button
              type="button"
              onClick={goToNextCatalogPage}
              disabled={currentPage === totalPages - 1}
              aria-label="Ver productos siguientes"
            >
              ›
            </button>
          </nav>
        ) : null}
      </div>
    </section>
  )
}

function ProductDetailSections({ page }) {
  const { product, family } = page
  const technicalSpecs = getProductTechnicalSpecs(product, family)
  const dilutionItems = getProductDilutionItems(product.dilution)
  const gallery = product.gallery?.length
    ? product.gallery
    : product.image
      ? [{ label: product.name, image: product.image, filename: product.name }]
      : []
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0)
  const selectedGalleryItem = gallery[selectedGalleryIndex] ?? gallery[0]

  useEffect(() => {
    setSelectedGalleryIndex(0)
  }, [product.slug])

  const productTitle = getProductDetailTitle(product)

  return (
    <section className="product-detail-page" id="detalle">
      <nav className="sr-only" aria-label="Breadcrumb">
        <a href="/">Inicio</a>
        <a href="/productos">Líneas de producto</a>
        <a href={getPagePath(`lineas-${family.id}`)}>{family.eyebrow}</a>
        <span>{productTitle}</span>
      </nav>
      <div className="product-detail">
        <div className="product-detail__gallery">
          <div className="product-detail__image">
            {selectedGalleryItem?.image ? (
              <img src={selectedGalleryItem.image} alt={getProductImageAlt(product, family, selectedGalleryItem.label)} decoding="async" />
            ) : (
              <ProductImagePlaceholder productName={productTitle} />
            )}
          </div>

          <div className="product-detail__thumbs" aria-label="Presentaciones del producto">
            {gallery.map((item, index) => (
              <button
                key={item.filename}
                type="button"
                className={index === selectedGalleryIndex ? 'is-active' : undefined}
                onClick={() => setSelectedGalleryIndex(index)}
                aria-label={`Ver ${item.label} de ${productTitle}`}
              >
                <img src={item.image} alt={getProductImageAlt(product, family, item.label)} loading="lazy" decoding="async" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <article className="product-detail__content">
          <p className="product-detail__categories">{family.eyebrow}</p>
          <h1>{productTitle}</h1>
          <p className="product-detail__summary">{product.summary}</p>

          <div className="product-detail__block">
            <h2>Presentaciones</h2>
            <ul>
              {product.presentations.map((presentation) => (
                <li key={presentation}>{presentation}</li>
              ))}
            </ul>
          </div>

          {product.presentationLinks?.length ? (
            <div className="product-detail__block">
              <h2>Fragancias</h2>
              <div className="product-detail__presentation-links">
                {product.presentationLinks.map((presentation) => (
                  <a
                    key={presentation.href}
                    href={presentation.href}
                    className={presentation.href === getPagePath(product.slug) ? 'is-active' : undefined}
                  >
                    {presentation.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          <div className="product-detail__notes">
            <div>
              <strong>Superficies</strong>
              <span>{technicalSpecs.surfaces.join(', ')}</span>
            </div>
            <div>
              <strong>Sectores relacionados</strong>
              <span>{technicalSpecs.relatedSectors.join(', ')}</span>
            </div>
            <div>
              <strong>Dilución / dosificación</strong>
              {dilutionItems.length > 0 ? (
                <ul className="product-detail__note-list">
                  {dilutionItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <span>Información de dilución pendiente por ficha técnica.</span>
              )}
            </div>
            <div className="product-detail__actions" aria-label="Documentación y cotización del producto">
              <a
                className={technicalSpecs.technicalSheetHref ? 'product-detail__action product-detail__action--sheet' : 'product-detail__action product-detail__action--sheet product-detail__action--pending'}
                href={technicalSpecs.technicalSheetHref || '#'}
                target={technicalSpecs.technicalSheetHref ? '_blank' : undefined}
                rel={technicalSpecs.technicalSheetHref ? 'noreferrer' : undefined}
                aria-disabled={technicalSpecs.technicalSheetHref ? undefined : 'true'}
                data-event="download_technical_sheet"
                data-product={product.name}
                onClick={technicalSpecs.technicalSheetHref ? undefined : (event) => event.preventDefault()}
              >
                Ficha técnica
              </a>
              <a
                className={technicalSpecs.safetySheetHref ? 'product-detail__action product-detail__action--sheet' : 'product-detail__action product-detail__action--sheet product-detail__action--pending'}
                href={technicalSpecs.safetySheetHref || '#'}
                target={technicalSpecs.safetySheetHref ? '_blank' : undefined}
                rel={technicalSpecs.safetySheetHref ? 'noreferrer' : undefined}
                aria-disabled={technicalSpecs.safetySheetHref ? undefined : 'true'}
                data-event="download_safety_sheet"
                data-product={product.name}
                onClick={technicalSpecs.safetySheetHref ? undefined : (event) => event.preventDefault()}
              >
                Ficha de seguridad
              </a>
              <ChatbotCtaButton
                className="product-detail__action product-detail__action--chatbot"
                ariaLabel={`Solicitar cotización de ${productTitle} con el chatbot Naval`}
                chatbotMessage={getProductQuotePrompt(productTitle)}
              >
                Solicitar cotización
              </ChatbotCtaButton>
            </div>
          </div>
        </article>
      </div>

      <div className="product-detail__technical" aria-labelledby="product-technical-title">
        <div className="product-detail__technical-heading">
          <p className="product-detail__categories">Aplicaciones</p>
          <h2 id="product-technical-title">Aplicaciones y uso profesional de {product.name}</h2>
          <p>
            Indicaciones resumidas a partir de la ficha técnica y la ficha de seguridad disponibles. Consulta siempre los documentos completos antes de usar el producto.
          </p>
        </div>

        <div className="product-detail__technical-grid">
          {technicalSpecs.hasDocumentedUse ? (
            <>
              <article className="product-detail__technical-card product-detail__technical-card--wide">
                <span>Guía de aplicación</span>
                <h3>Modo de uso</h3>
                <ol>
                  {technicalSpecs.protocol.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </article>

              <article className="product-detail__technical-card product-detail__technical-card--wide">
                <span>Usos recomendados</span>
                <h3>{technicalSpecs.recommendedUseTitle}</h3>
                <ul>
                  {technicalSpecs.applications.map((application) => (
                    <li key={application}>{application}</li>
                  ))}
                </ul>
              </article>

              <article className="product-detail__technical-card product-detail__technical-card--wide product-detail__technical-card--full">
                <span>Seguridad</span>
                <h3>Precauciones de manejo</h3>
                <p>{product.safetySummary}</p>
              </article>
            </>
          ) : (
            <article className="product-detail__technical-card product-detail__technical-card--wide product-detail__technical-card--full">
              <span>Documentación</span>
              <h3>Información técnica en actualización</h3>
              <p>
                Las aplicaciones, dosificaciones y precauciones se publicarán cuando estén disponibles la ficha técnica y la ficha de seguridad de este producto.
              </p>
            </article>
          )}
        </div>
      </div>
    </section>
  )
}

function ProductFamilyIntroSections({ page }) {
  const sectorName = page.sector?.title?.toLowerCase()

  return (
    <section className="product-family product-family--intro" id="detalle">
      <div className="product-family__header">
        <p className="interior-hero__eyebrow">{page.family.eyebrow}</p>
        <h2>{page.family.title}</h2>
        <p>{page.family.intro}</p>
      </div>

      {sectorName ? (
        <h3 className="product-family__featured-title">
          Los tres productos más solicitados del sector {sectorName}
        </h3>
      ) : null}

      <div className="product-family__grid">
        {page.family.products.slice(0, 3).map((product) => (
          <a key={product.name} href={getPagePath(product.slug)} className="product-card">
            <div className="product-card__media">
              {product.image ? (
                <img src={product.image} alt={getProductImageAlt(product, page.family)} loading="lazy" decoding="async" />
              ) : (
                <ProductImagePlaceholder productName={product.name} />
              )}
            </div>
            <div className="product-card__body">
              <p className="product-card__eyebrow">{page.family.eyebrow}</p>
              <h3>{product.name}</h3>
            </div>
          </a>
        ))}
      </div>

      {sectorName ? (
        <p className="product-family__catalog-note">
          Además de estos destacados, abajo encuentras todos los productos recomendados para el sector {sectorName}.
        </p>
      ) : null}
    </section>
  )
}

function ProductFamilyFullSections({ page }) {
  return <ProductFamilyDetailSections page={page} />
}

function ProductRouteSections({ page }) {
  return (
    <>
      <ProductDetailSections page={page} />
      <section className="product-catalog product-catalog--related" aria-labelledby="related-products-title">
        <div className="product-catalog__main">
          <header className="related-products__header">
            <p className="related-products__eyebrow">Productos relacionados</p>
            <h2 id="related-products-title">Otros productos de {page.family.eyebrow}</h2>
            <p className="related-products__intro">
              Estas opciones pertenecen a la misma línea y pueden complementar tu proceso de limpieza profesional.
            </p>
          </header>
          <div className="product-catalog__grid">
            {page.family.products
              .filter((product) => product.name !== page.product.name)
              .slice(0, 3)
              .map((product) => (
                <article key={product.name} className="catalog-product-card">
                  <a href={getPagePath(product.slug)} className="catalog-product-card__media" aria-label={`Ver ${product.name}`}>
                    {product.image ? <img src={product.image} alt={getProductImageAlt(product, page.family)} loading="lazy" decoding="async" /> : <ProductImagePlaceholder productName={product.name} />}
                  </a>
                  <div className="catalog-product-card__body">
                    <p>{page.family.eyebrow}</p>
                    <h3>{getCatalogProductTitle(product)}</h3>
                    <CatalogProductMeta product={product} />
                    <a href={getPagePath(product.slug)}>Ver producto</a>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}

function AboutPageSections({ page }) {
  return (
    <>
      <section className="interior-about-seo interior-about-seo--extended" id={page.aboutSection.id}>
        <article className="interior-about-seo__content interior-about-seo__content--aligned">
          <p className="interior-about-seo__eyebrow">{page.aboutSection.eyebrow}</p>
          <h2>{page.aboutSection.title}</h2>
          <div className="about-copy-stack">
            {page.aboutSection.paragraphs.map((paragraph) => (
              <p key={paragraph} className="about-strip__intro about-strip__intro--compact">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="about-clients__groups about-clients__groups--about">
            {page.aboutSection.tags.map((tag) => (
              <span key={tag} className="about-clients__pill">
                {tag}
              </span>
            ))}
          </div>
          <ul className="about-strip__list about-strip__list--about">
            {page.aboutSection.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <span className="interior-about-seo__note">{page.aboutSection.sideNote}</span>
        </article>

        <figure className="interior-about-seo__media interior-about-seo__media--placeholder">
          <img src={page.aboutSection.image} alt={page.aboutSection.imageAlt} className="interior-about-seo__image" loading="lazy" decoding="async" />
        </figure>
      </section>

      <section className="about-seals-strip" aria-label="Sellos de calidad">
        {page.sealsSection.seals.map((seal) => (
          <article key={seal.title} className="about-seals-strip__item">
            <img src={seal.icon} alt={seal.title} className="about-seals-strip__badge-image" loading="lazy" decoding="async" />
          </article>
        ))}
      </section>

      <section className="about-strip about-strip--media-left" aria-labelledby="about-process-title">
        <figure className="about-strip__media">
          <img src={aboutImageSecondary} alt="Operación y procesos Naval" className="about-strip__image" loading="lazy" decoding="async" />
        </figure>

        <div className="about-strip__content">
          <p className="about-strip__eyebrow">{page.processSection.eyebrow}</p>
          <h2 id="about-process-title">{page.processSection.title}</h2>
          <div className="about-strip__intro-stack">
            {(Array.isArray(page.processSection.intro) ? page.processSection.intro : [page.processSection.intro]).map((paragraph) => (
              <p key={paragraph} className="about-strip__intro about-strip__intro--justified">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="about-clients__groups">
            {page.processSection.steps.map((step) => (
              <span key={step.index} className="about-clients__pill">
                {step.title}
              </span>
            ))}
          </div>
          <ul className="about-strip__list">
            {page.processSection.steps.map((step) => (
              <li key={step.index}>{step.text}</li>
            ))}
          </ul>
          {page.processSection.note ? <p className="about-strip__note">{page.processSection.note}</p> : null}
        </div>
      </section>

      <section className="about-strip about-strip--clients-grid" aria-labelledby="about-clients-title">
        <div className="about-strip__heading">
          <p className="about-strip__eyebrow">{page.clientsSection.eyebrow}</p>
          <h2 id="about-clients-title">{page.clientsSection.title}</h2>
          <p className="about-strip__intro">{page.clientsSection.intro}</p>
        </div>

        <div className="about-clients-showcase" aria-label="Marcas y logos de clientes">
          <div className="about-clients-showcase__wall">
            {page.clientsSection.groups.map((group) => (
              <div
                key={group.label}
                className={`about-clients-showcase__logo-slot ${group.type === 'image' ? 'about-clients-showcase__logo-slot--image' : ''} ${group.featured ? 'about-clients-showcase__logo-slot--featured' : ''} ${group.size ? `about-clients-showcase__logo-slot--${group.size}` : ''}`}
              >
                {group.type === 'image' ? (
                  <img
                    src={group.image}
                    alt={group.label}
                    className={`about-clients-showcase__logo-image ${group.featured ? 'about-clients-showcase__logo-image--featured' : ''} ${group.size ? `about-clients-showcase__logo-image--${group.size}` : ''}`}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span>{group.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-strip about-strip--values" aria-labelledby="about-values-title">
        <div className="about-strip__heading about-strip__heading--compact">
          <div className="about-strip__heading-copy">
            <p className="about-strip__eyebrow">{page.valuesSection.eyebrow}</p>
            <h2 id="about-values-title">{page.valuesSection.title}</h2>
          </div>
          <p className="about-strip__intro">{page.valuesSection.intro}</p>
        </div>

        <div className="about-values__grid">
          {page.valuesSection.values.map((value) => (
            <article key={value.title} className="about-values__card">
              <div className="about-values__icon" aria-hidden="true">
                <ValueIcon icon={value.icon} />
              </div>
              <div className="about-values__copy">
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-contact-strip" aria-labelledby="about-contact-title">
        <div className="about-contact-strip__copy">
          <p className="about-strip__eyebrow">Contáctenos</p>
          <h2 id="about-contact-title">Cotizaciones y asesoría para limpieza profesional e higiene institucional.</h2>
          <p className="about-strip__intro">
            Atendemos empresas y distribuidores que buscan procesos de limpieza eficientes, reposición constante y soporte
            profesional.
          </p>
        </div>

	        <div className="about-contact-actions">
	          <div className="about-contact-form__actions">
            <ChatbotCtaButton
              className="about-contact-form__button about-contact-form__button--mail"
              ariaLabel="Hablar con un asesor en el chatbot Naval"
              chatbotMessage={chatbotAdvisorPrompt}
              eventName="request_human_advisor"
            >
	              <span className="about-contact-form__button-icon" aria-hidden="true">
	                <svg viewBox="0 0 24 24">
	                  <path d="M5 4h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-7.4l-4.8 3.2c-.74.49-1.8-.04-1.8-.93V18A3 3 0 0 1 2 15V7a3 3 0 0 1 3-3Z" />
	                  <path d="M7.5 10.5h9M7.5 13.5h6" />
	                </svg>
	              </span>
	              <span>Hablar con un asesor</span>
	            </ChatbotCtaButton>
	          </div>
	        </div>
      </section>
    </>
  )
}

function ResultsShowcaseSection() {
  return (
    <section className="about-video-banner b2b-cta-band" aria-labelledby="b2b-cta-title">
      <div className="b2b-cta-band__content">
        <p className="about-video-banner__eyebrow">Naval B2B</p>
        <h2 id="b2b-cta-title">Soluciones de limpieza listas para operar y escalar</h2>
        <p>
          Acompañamos empresas, hoteles, restaurantes e instituciones con soluciones de limpieza profesional,
          portafolios por sector y abastecimiento eficiente para operación diaria.
        </p>
      </div>

      <div className="b2b-cta-band__panel">
        <div className="b2b-cta-band__points" aria-label="Beneficios para clientes B2B">
          <span>Portafolio por sector</span>
          <span>Cotización institucional</span>
          <span>Presentaciones empresariales</span>
	        </div>
	        <div className="b2b-cta-band__actions">
	          <ChatbotCtaButton className="b2b-cta-band__link b2b-cta-band__link--quote" ariaLabel="Solicitar cotización en el chatbot Naval" chatbotMessage={chatbotQuotePrompt}>
	            <span className="b2b-cta-band__link-icon" aria-hidden="true">
	              <svg viewBox="0 0 24 24">
	                <path d="M5 4h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-7.4l-4.8 3.2c-.74.49-1.8-.04-1.8-.93V18A3 3 0 0 1 2 15V7a3 3 0 0 1 3-3Z" />
	                <path d="M7.5 10.5h9M7.5 13.5h6" />
	              </svg>
	            </span>
	            <span>Solicitar cotización</span>
	          </ChatbotCtaButton>
	        </div>
	      </div>
    </section>
  )
}

function TrainingSection({ trainingSection, sectionId = 'capacitaciones', titleId = 'faq-training-title' }) {
  return (
    <section className="faq-page-section faq-training-section" id={sectionId} aria-labelledby={titleId}>
      <div className="faq-training-layout">
        <div className="faq-page-section__heading faq-training-copy">
          <div className="faq-training-title-block">
            <p className="about-strip__eyebrow">{trainingSection.eyebrow}</p>
            <h2 id={titleId}>{trainingSection.title}</h2>
          </div>
          <div className="faq-training-points" aria-label="Beneficios de las capacitaciones Naval">
            {trainingSection.highlights.map((item) => (
              <article key={item.title} className="faq-training-point">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="faq-training-media-grid" aria-label="Imágenes de capacitaciones técnicas Naval">
          {trainingSection.images.map((item, index) => {
            const highlight = trainingSection.highlights[index]

            return (
              <figure key={item.title} className="faq-training-media">
                <div className="faq-training-media__placeholder">
                  <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
                  {item.label ? <span>{item.label}</span> : null}
                  <strong>
                    {item.title}
                    {item.caption ? <small>{item.caption}</small> : null}
                  </strong>
                  {highlight ? (
                    <div className="faq-training-media__mobile-copy">
                      {item.label ? <span>{item.label}</span> : null}
                      <h3>{highlight.title}</h3>
                      <p>{highlight.text}</p>
                    </div>
                  ) : null}
                </div>
              </figure>
            )
          })}
        </div>
        <div className="faq-training-seo">
          <p>{trainingSection.bottomText ?? trainingSection.intro}</p>
          <div className="faq-training-actions" aria-label="Solicitar capacitación Naval">
            <ChatbotCtaButton
              className="faq-contact-action faq-contact-action--mail"
              ariaLabel="Solicitar capacitación en el chatbot Naval"
              chatbotMessage={chatbotTrainingPrompt}
              eventName="request_training"
            >
              <span className="faq-contact-action__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M5 4h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-7.4l-4.8 3.2c-.74.49-1.8-.04-1.8-.93V18A3 3 0 0 1 2 15V7a3 3 0 0 1 3-3Z" />
                  <path d="M7.5 10.5h9M7.5 13.5h6" />
                </svg>
              </span>
              <span>Solicitar capacitación</span>
            </ChatbotCtaButton>
          </div>
        </div>
      </div>
    </section>
  )
}

function FaqPageSections({ page }) {
  return (
    <>
      <section className="faq-page-section faq-work-section" aria-labelledby="faq-work-title">
        <div className="faq-page-section__heading faq-page-section__heading--split">
          <div>
            <p className="about-strip__eyebrow">{page.worksSection.eyebrow}</p>
            <h2 id="faq-work-title">{page.worksSection.title}</h2>
          </div>
          <p>{page.worksSection.intro}</p>
        </div>

        <div className="faq-work-grid" aria-label="Imágenes de trabajos realizados">
          {page.worksSection.images.map((item) => (
            <article key={item.title} className="faq-work-card">
                  <img src={item.image} alt={item.alt ?? item.title} loading="lazy" decoding="async" />
              <div>
                <span>{item.label}</span>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>

      </section>

      <section className="faq-page-section faq-page-section--intro" id="detalle" aria-labelledby="faq-title">
        <div className="faq-page-section__heading">
          <p className="about-strip__eyebrow">{page.eyebrow}</p>
          <h1 id="faq-title">{page.title}</h1>
          <p>{page.intro}</p>
        </div>

        <div className="faq-list faq-accordion" itemScope itemType="https://schema.org/FAQPage">
          {page.sections.map((item, index) => (
            <details
              key={item.title}
              className="faq-item faq-accordion__item"
              name="naval-faq"
              open={index === 0}
              onToggle={(event) => {
                if (!event.currentTarget.open) return

                document.querySelectorAll('details[name="naval-faq"]').forEach((detail) => {
                  if (detail !== event.currentTarget) detail.removeAttribute('open')
                })
              }}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <summary className="faq-accordion__trigger">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h2 itemProp="name">{item.title}</h2>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div
                id={`faq-answer-${index}`}
                className="faq-accordion__answer"
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p itemProp="text">{item.text}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="faq-contact-panel">
          <p>
            Contáctanos si tienes más preguntas o necesitas asesoría para elegir productos de limpieza profesional,
            presentaciones institucionales o soluciones de aseo para hogares, empresas e industrias.
          </p>
	          <div className="faq-contact-actions" aria-label="Contactar a Naval por chatbot">
            <ChatbotCtaButton
              className="faq-contact-action faq-contact-action--mail faq-contact-action--advisor"
              ariaLabel="Pregúntale a un asesor en el chatbot Naval"
              chatbotMessage={chatbotAdvisorPrompt}
              eventName="request_human_advisor"
            >
	              <span className="faq-contact-action__icon" aria-hidden="true">
	                <svg viewBox="0 0 24 24">
	                  <path d="M5 4h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-7.4l-4.8 3.2c-.74.49-1.8-.04-1.8-.93V18A3 3 0 0 1 2 15V7a3 3 0 0 1 3-3Z" />
	                  <path d="M7.5 10.5h9M7.5 13.5h6" />
	                </svg>
	              </span>
	              <span>Pregúntale a un asesor</span>
	            </ChatbotCtaButton>
	          </div>
	        </div>
      </section>

      <section className="faq-page-section faq-clients-section" aria-labelledby="faq-clients-title">
        <div className="faq-page-section__heading">
          <p className="about-strip__eyebrow">{page.happyClientsSection.eyebrow}</p>
          <h2 id="faq-clients-title">{page.happyClientsSection.title}</h2>
          <p>{page.happyClientsSection.intro}</p>
        </div>

        <div className="faq-testimonials" aria-label="Comentarios de clientes">
          {page.happyClientsSection.comments.map((comment) => (
            <article key={comment.name} className="faq-testimonial-card">
              <div className="faq-testimonial-card__brand">
                <img src={comment.logo} alt={comment.name} loading="lazy" decoding="async" />
              </div>
              <div className="faq-testimonial-card__rating" aria-label="Calificación 5 de 5">
                <span>★★★★★</span>
              </div>
              <p>{comment.text}</p>
              <div>
                <strong>{comment.name}</strong>
                <span>{comment.sector}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

const chatbotQuickPrompts = [
  '📋 Solicitar una cotización',
  '🎓 Capacitaciones',
  '📦 Consultar productos',
  '🧭 Buscar en el sitio',
  '🚚 Información de entregas',
  '⚠️ Reportar una queja',
  '👤 Hablar con un asesor',
]

const complaintKeywords = [
  'queja',
  'reclamo',
  'problema',
  'molesto',
  'mala',
  'mal servicio',
  'demora',
  'no llego',
  'no llegó',
  'dañado',
  'derramado',
  'garantia',
  'garantía',
]

const orderKeywords = [
  'pedido',
  'comprar',
  'compra',
  'cotizar',
  'cotización',
  'cotizacion',
  'precio',
  'pago',
  'unidades',
  'galon',
  'galón',
  'envase',
]

const difficultQuestionKeywords = [
  'ficha',
  'seguridad',
  'dilucion',
  'dilución',
  'mezclar',
  'quimico',
  'químico',
  'alergia',
  'intoxicacion',
  'intoxicación',
  'emergencia',
  'industrial',
  'certificado',
]

function mentionsChatbotTraining(message) {
  return /\b(?:capacitacion|capacitaciones|capacitar|certificacion|certificaciones|formacion|formaciones)\b/.test(normalizeAssistantText(message))
}

const chatbotSectorRules = [
  { pattern: /hotel/i, title: 'Hotelero', label: 'hoteles' },
  { pattern: /restaurante/i, title: 'Restaurante', label: 'restaurantes' },
  { pattern: /colegio/i, title: 'Colegios', label: 'colegios' },
  { pattern: /gimnasio|gym/i, title: 'Gym', label: 'gimnasios' },
  { pattern: /conjunto/i, title: 'Conjunto residencial', label: 'conjuntos residenciales' },
  { pattern: /lavander/i, title: 'Lavandería', label: 'lavanderías' },
  { pattern: /cocina/i, title: 'Cocinas', label: 'cocinas' },
  { pattern: /hogar/i, title: 'Hogar', label: 'hogares' },
  { pattern: /empresa|oficina/i, title: 'Empresarial', label: 'empresas y oficinas' },
]

function wantsHumanChatbotHandoff(message) {
  return /\b(?:(?:hablar|conectar|comunicar|comunicarme|pasar|pasarme|contactar|contactarme)\s+(?:con\s+)?(?:un\s+|una\s+)?(?:humano|persona|asesor|asesora|vendedor|vendedora|comercial|agente|ejecutivo|ejecutiva)|(?:necesito|quiero|busco)\s+(?:un\s+|una\s+)?(?:asesor|asesora|vendedor|vendedora|agente|ejecutivo|ejecutiva|persona|humano)|asesor[ií]a\s+(?:humana|comercial))\b/i.test(message)
}

function getChatbotIntent(message) {
  const normalizedMessage = message.toLowerCase()

  if (isDeliveryInformationRequest(message)) return 'question'
  if (complaintKeywords.some((keyword) => normalizedMessage.includes(keyword))) return 'complaint'
  if (wantsHumanChatbotHandoff(message)) return 'human'
  if (mentionsChatbotTraining(message)) return 'training'
  if (orderKeywords.some((keyword) => normalizedMessage.includes(keyword))) return 'quote'

  return 'question'
}

const chatbotRequestLabels = {
  quote: 'Cotización',
  human: 'Asesor humano',
  complaint: 'Queja',
  training: 'Capacitación',
  question: 'Pregunta',
}

const chatbotRequestPriorities = {
  quote: 'ALTA',
  complaint: 'ALTA',
  training: 'MEDIA',
}

const chatbotFieldStopPattern = String.raw`(?=\s*(?:,|\.|;|\n|\b(?:mi\s+nombre|nombre|me\s+llamo|soy|empresa|compañ[ií]a|negocio|ciudad|direcci[oó]n|direccion|tel[eé]fono|telefono|celular|whatsapp|correo|email|mail|producto|cantidad|motivo)\b|$))`

function cleanChatbotFieldValue(value) {
  return String(value ?? '')
    .replace(/^[\s:=-]+/, '')
    .replace(/[\s,.;]+$/, '')
    .trim()
}

function extractChatbotField(message, patterns) {
  for (const pattern of patterns) {
    const match = message.match(pattern)
    const value = cleanChatbotFieldValue(match?.[1])
    if (value) return value
  }

  return ''
}

function extractChatbotContactData(message) {
  const email = extractChatbotField(message, [
    /\b(?:correo|email|mail)\s*(?:es|:)?\s*([^\s,;]+@[^\s,;]+)/i,
    /([^\s,;]+@[^\s,;]+)/i,
  ])

  const phone = extractChatbotField(message, [
    /\b(?:tel[eé]fono|telefono|celular|whatsapp|wsp)\s*(?:es|:)?\s*([+()\d][+()\d\s.-]{6,})/i,
    /(?:^|\s)(\+?\d[\d\s().-]{7,}\d)(?=\s|$|[,.;])/i,
  ])

  return {
    name: extractChatbotField(message, [
      new RegExp('\\b(?:mi\\s+nombre\\s+es|me\\s+llamo|nombre)\\s*(?:es|:)?\\s*([\\s\\S]*?)' + chatbotFieldStopPattern, 'i'),
      /\bsoy\s+([a-záéíóúñü]+(?:\s+[a-záéíóúñü]+){0,3})(?=\s*(?:,|\.|;|\n|$))/i,
    ]),
    company: extractChatbotField(message, [
      new RegExp('\\b(?:empresa|compañ[ií]a|negocio|restaurante)\\s*(?:es|:)?\\s*([\\s\\S]*?)' + chatbotFieldStopPattern, 'i'),
    ]),
    city: extractChatbotField(message, [
      new RegExp('\\b(?:ciudad)\\s*(?:es|:)?\\s*([\\s\\S]*?)' + chatbotFieldStopPattern, 'i'),
      /\b(?:estoy|queda|entrega|vivo)\s+en\s+([a-záéíóúñü\s-]+?)(?=\s*(?:,|\.|;|\n|$))/i,
    ]),
    address: extractChatbotField(message, [
      new RegExp('\\b(?:direcci[oó]n|direccion|dirección)\\s*(?:es|:)?\\s*([\\s\\S]*?)' + chatbotFieldStopPattern, 'i'),
    ]),
    phone,
    email,
    product: extractChatbotField(message, [
      new RegExp('\\b(?:producto|productos)\\s*(?:es|:)?\\s*([\\s\\S]*?)' + chatbotFieldStopPattern, 'i'),
      /\b(?:cotizar|cotización|cotizacion|pedido|comprar|necesito|quiero)\s+(?:de\s+)?([a-záéíóúñü0-9 .-]+?)(?=\s*(?:,|\.|;|\n|$))/i,
    ]),
    quantity: extractChatbotField(message, [
      new RegExp('\\b(?:cantidad)\\s*(?:es|:)?\\s*([\\s\\S]*?)' + chatbotFieldStopPattern, 'i'),
      /\b(\d+\s*(?:unidades|unidad|galones|gal[oó]n|envases|cajas|litros|l))\b/i,
    ]),
    reason: extractChatbotField(message, [
      new RegExp('\\b(?:motivo(?:\\s+de\\s+contacto)?)\\s*(?:es|:)?\\s*([\\s\\S]*?)' + chatbotFieldStopPattern, 'i'),
    ]),
    sector: extractChatbotField(message, [
      /\b(hotel(?:es)?|restaurante(?:s)?|colegio(?:s)?|gimnasio(?:s)?|gym|empresa(?:s)?|oficina(?:s)?|conjunto(?:s)?(?:\s+residencial(?:es)?)?|lavander[ií]a(?:s)?|cocina(?:s)?|hogar)\b/i,
    ]),
  }
}

function extractChatbotConversationContactData(chatMessages) {
  return chatMessages
    .filter((chatMessage) => chatMessage.from === 'user' && chatMessage.text)
    .reduce(
      (contactData, chatMessage) => {
        const messageContactData = extractChatbotContactData(chatMessage.text)

        return Object.fromEntries(
          Object.keys(contactData).map((field) => [field, messageContactData[field] || contactData[field]]),
        )
      },
      {
        name: '',
        company: '',
        city: '',
        address: '',
        phone: '',
        email: '',
        product: '',
        quantity: '',
        reason: '',
        sector: '',
      },
    )
}

const chatbotWorkflowTypes = new Set(['quote', 'complaint', 'training'])

const chatbotWorkflowStarterPatterns = {
  quote: /^\s*(?:📋\s*)?(?:solicitar|quiero|necesito|deseo)?\s*(?:una\s+)?cotizaci[oó]n\s*[.!]?\s*$/i,
  complaint: /^\s*(?:⚠️\s*)?(?:reportar|poner|quiero|necesito)?\s*(?:una\s+)?(?:queja|reclamo)\s*[.!]?\s*$/i,
  training: /^\s*(?:🎓\s*)?(?:solicitar|quiero|necesito|deseo|agendar|programar)?\s*(?:una\s+)?capacitaci[oó]n(?:es)?\s*[.!]?\s*$/i,
}

const chatbotWorkflowFieldOrder = {
  quote: ['product', 'quantity', 'city', 'address', 'name', 'phone', 'email'],
  complaint: ['reason', 'detailsConfirmed', 'name', 'city', 'phone', 'email', 'submissionConfirmed'],
  training: ['topics', 'company', 'attendees', 'preferredDate', 'preferredTime', 'detailsConfirmed', 'city', 'address', 'name', 'phone', 'email', 'submissionConfirmed'],
}

function createChatbotWorkflow(type) {
  return { type, data: {} }
}

function getChatbotWorkflowFields(workflow) {
  const quoteProductFields = workflow.data.products?.length > 1 ? ['product', 'selectionConfirmed'] : ['product']

  if (workflow.type === 'quote' && workflow.data.needsQuantityHelp) {
    return [...quoteProductFields, 'operationSize', 'usageFrequency', 'solutionVolume', 'quantity', 'quantityConfirmed', 'orderConfirmed', 'city', 'address', 'name', 'phone', 'email', 'submissionConfirmed']
  }

  if (workflow.type === 'quote') {
    return [...quoteProductFields, 'quantity', 'orderConfirmed', 'city', 'address', 'name', 'phone', 'email', 'submissionConfirmed']
  }

  return chatbotWorkflowFieldOrder[workflow.type] ?? []
}

function getChatbotWorkflowMissingField(workflow) {
  return getChatbotWorkflowFields(workflow).find((field) => {
    if (field === 'contact') return !workflow.data.phone && !workflow.data.email
    return !workflow.data[field]
  }) ?? ''
}

function wantsChatbotQuantityEstimate(message) {
  return wantsQuantityHelp(message)
}

function getRecentSingleChatbotProduct(chatMessages) {
  for (let index = chatMessages.length - 1; index >= 0; index -= 1) {
    const normalizedText = normalizeAssistantText(chatMessages[index]?.text ?? '')
    const mentionedProducts = productAssistantCatalog.filter((product) =>
      normalizedText.includes(normalizeAssistantText(product.name)),
    )
    if (mentionedProducts.length === 1) return mentionedProducts[0]
    if (mentionedProducts.length > 1) return null
  }
  return null
}

function getRecentChatbotProducts(chatMessages) {
  for (let index = chatMessages.length - 1; index >= 0; index -= 1) {
    const normalizedText = normalizeAssistantText(chatMessages[index]?.text ?? '')
    const mentionedProducts = productAssistantCatalog.filter((product) =>
      normalizedText.includes(normalizeAssistantText(product.name)),
    )
    if (mentionedProducts.length) return mentionedProducts
  }
  return []
}

function refersToRecentProductSet(message) {
  return /\b(?:esos|esas|estos|estas|todos|todas|los\s+\d+|las\s+\d+|los\s+cuatro|las\s+cuatro)\b/i.test(message)
}

function asksForQuoteSummary(message) {
  return /\b(?:conf[ií]rmame|resumen|cu[aá]ntos?\s+productos|qu[eé]\s+(?:productos?\s+)?ped[ií]|qu[eé]\s+llev[oa]|mi\s+(?:pedido|cotizaci[oó]n)|qu[eé]\s+vas\s+a\s+enviar)\b/i.test(message)
}

function asksForWorkflowSummary(message, type) {
  if (/\b(?:conf[ií]rmame|resumen|qu[eé]\s+(?:datos?|informaci[oó]n)\s+tienes|qu[eé]\s+te\s+dije|qu[eé]\s+vas\s+a\s+enviar)\b/i.test(message)) return true
  if (type === 'quote') return asksForQuoteSummary(message)
  if (type === 'training') return /\b(?:qu[eé]\s+(?:tema|fecha|horario|capacitaci[oó]n)|cu[aá]ntas?\s+personas|mi\s+capacitaci[oó]n)\b/i.test(message)
  if (type === 'complaint') return /\b(?:qu[eé]\s+(?:queja|reclamo|problema)\s+(?:anotaste|registraste|tienes)|mi\s+(?:queja|reclamo))\b/i.test(message)
  return false
}

function getQuoteProductNames(data) {
  if (Array.isArray(data.products) && data.products.length) return data.products
  return data.product ? [data.product] : []
}

function buildQuoteOrderSummary(data, { includeContact = false } = {}) {
  const productNames = getQuoteProductNames(data)
  const lines = [
    'Resumen de la cotización',
    '',
    `Productos (${productNames.length}):`,
    ...productNames.map((productName) => `• ${productName}`),
    data.quantity ? `Cantidad: ${data.quantity}` : 'Cantidad: pendiente por definir',
  ]

  if (includeContact) {
    lines.push(
      '',
      `Ciudad: ${data.city || 'pendiente'}`,
      `Dirección: ${data.address || 'pendiente'}`,
      `Nombre: ${data.name || 'pendiente'}`,
      `Teléfono: ${data.phone || 'pendiente'}`,
      `Correo: ${data.email || 'pendiente'}`,
    )
  }

  return lines.join('\n')
}

function formatQuoteQuantity(message, productCount = 1) {
  const match = message.match(/\b(\d+(?:[.,]\d+)?)\s*(unidades?|envases?|botellas?|bidones?|canecas?|cajas?|galones?|litros?|lts?|cc|ml)\b/i)
  if (!match) return cleanChatbotFieldValue(message)

  const amount = Number(match[1].replace(',', '.'))
  const unit = match[2]
  if (productCount > 1 && /\b(?:cada\s+uno|cada\s+una|cada\s+producto|de\s+cada)\b/i.test(message)) {
    const total = Number.isFinite(amount) ? amount * productCount : ''
    return `${match[1]} ${unit} de cada producto${total ? ` (${total} ${unit} en total)` : ''}`
  }

  return match[0]
}

function getQuotePendingPrompt(field) {
  const prompts = {
    product: 'Indícame qué producto o necesidad deseas cotizar.',
    selectionConfirmed: 'Confirma si deseas incluir esos productos o dime cuál quieres retirar.',
    quantity: 'Indícame la cantidad y presentación que necesitas. Si no la conoces, puedo ayudarte a estimarla.',
    orderConfirmed: 'Confirma si los productos y cantidades del resumen son correctos.',
    city: '¿En qué ciudad necesitas la entrega?',
    address: '¿Cuál es la dirección de entrega?',
    name: '¿A nombre de quién preparamos la cotización?',
    phone: '¿Cuál es tu teléfono de contacto?',
    email: '¿A qué correo enviamos la cotización?',
    submissionConfirmed: 'Confirma si deseas enviar esta solicitud al equipo comercial.',
  }
  return prompts[field] || 'Comparte el dato pendiente para continuar.'
}

function buildTrainingSummary(data, { includeContact = false } = {}) {
  const lines = [
    'Resumen de la capacitación',
    '',
    `Tema: ${data.topics || 'pendiente'}`,
    `Empresa: ${data.company || 'pendiente'}`,
    `Participantes: ${data.attendees || 'pendiente'}`,
    `Fecha preferida: ${data.preferredDate || 'pendiente'}`,
    `Horario preferido: ${data.preferredTime || 'pendiente'}`,
  ]

  if (includeContact) {
    lines.push(
      '',
      `Ciudad: ${data.city || 'pendiente'}`,
      `Dirección: ${data.address || 'pendiente'}`,
      `Nombre: ${data.name || 'pendiente'}`,
      `Teléfono: ${data.phone || 'pendiente'}`,
      `Correo: ${data.email || 'pendiente'}`,
    )
  }

  return lines.join('\n')
}

function buildComplaintSummary(data, { includeContact = false } = {}) {
  const lines = [
    'Resumen de la queja',
    '',
    `Descripción: ${data.reason || 'pendiente'}`,
  ]

  if (data.product) lines.push(`Producto relacionado: ${data.product}`)
  if (data.orderNumber) lines.push(`Pedido o factura: ${data.orderNumber}`)

  if (includeContact) {
    lines.push(
      '',
      `Nombre: ${data.name || 'pendiente'}`,
      `Ciudad: ${data.city || 'pendiente'}`,
      `Teléfono: ${data.phone || 'pendiente'}`,
      `Correo: ${data.email || 'pendiente'}`,
    )
  }

  return lines.join('\n')
}

function buildWorkflowSummary(workflow, options) {
  if (workflow.type === 'quote') return buildQuoteOrderSummary(workflow.data, options)
  if (workflow.type === 'training') return buildTrainingSummary(workflow.data, options)
  if (workflow.type === 'complaint') return buildComplaintSummary(workflow.data, options)
  return ''
}

function getWorkflowPendingPrompt(type, field) {
  if (type === 'quote') return getQuotePendingPrompt(field)

  const promptsByType = {
    training: {
      topics: 'Indícame el producto o tema de la capacitación.',
      company: '¿Cuál es el nombre de la empresa?',
      attendees: '¿Cuántas personas asistirían?',
      preferredDate: '¿Qué fecha prefieren?',
      preferredTime: '¿Qué horario prefieren?',
      detailsConfirmed: 'Confirma si el tema, la empresa, los participantes, la fecha y el horario son correctos.',
      city: '¿En qué ciudad se realizaría?',
      address: '¿Cuál es la dirección de la capacitación?',
      name: '¿Cuál es tu nombre?',
      phone: '¿Cuál es tu teléfono de contacto?',
      email: '¿Cuál es tu correo electrónico?',
      submissionConfirmed: 'Confirma si deseas enviar la solicitud de capacitación.',
    },
    complaint: {
      reason: 'Cuéntame qué ocurrió para registrar correctamente la queja.',
      detailsConfirmed: 'Confirma si la descripción de la queja es correcta.',
      name: '¿Cuál es tu nombre?',
      city: '¿En qué ciudad ocurrió o recibiste el pedido?',
      phone: '¿Cuál es tu teléfono de contacto?',
      email: '¿Cuál es tu correo electrónico?',
      submissionConfirmed: 'Confirma si deseas enviar la queja al equipo de servicio al cliente.',
    },
  }

  return promptsByType[type]?.[field] || 'Comparte el dato pendiente para continuar.'
}

function buildChatbotQuantityEstimate(productName, dailySolutionLiters = 1) {
  const product = findAssistantProduct(productName ?? '', productAssistantCatalog)
  const dilutionText = Array.isArray(product?.dilution) ? product.dilution.join(' ') : product?.dilution
  const dilutionMlPerLiter = parseDilutionMlPerLiter(dilutionText)
  const presentations = (product?.presentations ?? [])
    .map((label) => ({ label, milliliters: parsePresentationMilliliters(label) }))
    .filter(({ milliliters }) => milliliters)
    .sort((left, right) => left.milliliters - right.milliliters)

  if (!product || !dilutionMlPerLiter || !presentations.length || !dailySolutionLiters) return null

  const monthlyConcentrateMl = Math.ceil(dilutionMlPerLiter * dailySolutionLiters * 30)
  const presentation = presentations.find(({ milliliters }) => milliliters >= monthlyConcentrateMl) ?? presentations.at(-1)
  const units = Math.max(1, Math.ceil(monthlyConcentrateMl / presentation.milliliters))
  const estimatedDays = Math.floor((presentation.milliliters * units) / (dilutionMlPerLiter * dailySolutionLiters))

  return {
    dailySolutionLiters,
    dilutionMlPerLiter,
    monthlyConcentrateMl,
    presentation: presentation.label,
    units,
    estimatedDays,
    quantity: `${units} ${units === 1 ? 'envase' : 'envases'} de ${presentation.label}`,
  }
}

function getChatbotProductPresentations(productName) {
  const product = findAssistantProduct(productName ?? '', productAssistantCatalog)
  return product?.presentations?.filter(Boolean) ?? []
}

function getChatbotSectorRecommendation(sector) {
  const rule = chatbotSectorRules.find(({ pattern }) => pattern.test(sector ?? ''))
  if (!rule) return null

  const products = (sectorProductNamesByTitle[rule.title] ?? [])
    .map((productName) => productByName.get(productName))
    .filter(Boolean)
    .slice(0, 4)

  return products.length ? { ...rule, products } : null
}

const chatbotSalesStopWords = new Set([
  'para', 'como', 'quiero', 'necesito', 'producto', 'productos', 'limpiar', 'limpieza', 'usar', 'tengo',
  'hacer', 'sobre', 'donde', 'cual', 'cuanto', 'ayuda', 'ayudar', 'naval', 'esta', 'este', 'estos', 'estas',
])

function buildChatbotCatalogContext(chatMessages) {
  const customerText = chatMessages
    .filter((chatMessage) => chatMessage.from === 'user' && chatMessage.text)
    .slice(-6)
    .map((chatMessage) => chatMessage.text)
    .join(' ')
  const normalizedCustomerText = normalizeAssistantText(customerText)
  const searchTerms = Array.from(new Set(
    normalizedCustomerText
      .split(/\s+/)
      .filter((term) => term.length >= 4 && !chatbotSalesStopWords.has(term)),
  ))
  const sector = extractChatbotConversationContactData(chatMessages).sector
  const sectorProducts = new Set(getChatbotSectorRecommendation(sector)?.products.map((product) => product.name) ?? [])
  const delicateSurface = [
    'acero inoxidable',
    'marmol',
    'granito',
    'madera',
    'cuero',
    'vinilo',
    'aluminio',
  ].find((surface) => normalizedCustomerText.includes(surface))

  const rankedProducts = productAssistantCatalog
    .map((product) => {
      const searchableText = normalizeAssistantText([
        product.name,
        product.category,
        product.summary,
        product.b2bUse,
        ...(product.surfaces ?? []),
        ...(product.applications ?? []),
      ].join(' '))
      const searchableWords = new Set(searchableText.split(/\s+/))
      const matchingTerms = searchTerms.filter((term) => searchableWords.has(term))
      const aliasMatch = product.aliases.some((alias) => normalizedCustomerText.includes(alias))
      const score = matchingTerms.length * 2 + (aliasMatch ? 10 : 0) + (sectorProducts.has(product.name) ? 6 : 0)
      const compatibilityText = normalizeAssistantText([
        product.summary,
        ...(product.surfaces ?? []),
      ].join(' '))
      const hasExplicitDelicateSurface = !delicateSurface || compatibilityText.includes(delicateSurface)
      return { product, score, hasExplicitDelicateSurface }
    })
    .filter(({ score, hasExplicitDelicateSurface }) => score > 0 && hasExplicitDelicateSurface)
    .sort((left, right) => right.score - left.score)
    .slice(0, 7)
    .map(({ product }) => product)

  const fallbackNames = [
    'Detergente Limpiador Multiusos',
    'Limpiador Desinfectante',
    'Desengrasante',
    'Detergente Multicocina',
    'Limpia Vidrios',
    'Cera Polimérica',
  ]
  const relevantProducts = rankedProducts.length
    ? rankedProducts
    : delicateSurface
      ? []
      : fallbackNames.map((name) => productAssistantCatalog.find((product) => product.name === name)).filter(Boolean)

  const productContext = relevantProducts.map((product) => {
    const dilution = (Array.isArray(product.dilution) ? product.dilution : [product.dilution]).filter(Boolean).join(' | ')
    return [
      `Producto: ${product.name}`,
      product.summary && `Uso publicado: ${product.summary}`,
      product.surfaces?.length && `Superficies: ${product.surfaces.join(', ')}`,
      product.applications?.length && `Aplicaciones: ${product.applications.join(', ')}`,
      product.presentations?.length && `Presentaciones: ${product.presentations.join(', ')}`,
      dilution && `Dosificación publicada: ${dilution}`,
      dilution && /uso puro/i.test(dilution) && 'No hay rendimiento por m² publicado: no calcular cantidad desde el área ni inventar frecuencia de reaplicación.',
    ].filter(Boolean).join(' | ')
  })

  return [
    'CONTEXTO COMERCIAL INTERNO DE PRODUCTOS NAVAL',
    'Usa únicamente los productos y datos publicados abajo. No menciones ni recomiendes productos externos.',
    delicateSurface && `Superficie delicada detectada: ${delicateSurface}. La lista ya fue filtrada para incluir solo compatibilidades explícitas del catálogo.`,
    ...productContext,
    'Navegación disponible: catálogo /productos/todos; tienda /tienda; preguntas frecuentes /preguntas-frecuentes; capacitaciones /#lineas-capacitaciones; contacto /contacto.',
  ].join('\n')
}

function updateChatbotWorkflow(workflow, message, chatMessages = []) {
  const data = { ...workflow.data }
  const extractedData = extractChatbotContactData(message)
  const missingField = getChatbotWorkflowMissingField(workflow)
  const normalizedMessage = normalizeAssistantText(message)
  const isStarterMessage = chatbotWorkflowStarterPatterns[workflow.type]?.test(message) ?? false
  const matchedProduct = findAssistantProduct(message, productAssistantCatalog)
  const operationSize = extractOperationSize(message)
  const usageFrequency = extractUsageFrequency(message)
  const dailySolutionLiters = extractDailySolutionLiters(message)
  const hadConfirmedQuantity = Boolean(data.quantityConfirmed)
  const workflowSummaryRequested = asksForWorkflowSummary(message, workflow.type)
  const trainingDate = workflow.type === 'training' ? extractTrainingDate(message) : ''
  const trainingTime = workflow.type === 'training' ? extractTrainingTime(message) : ''
  const correctedTopic = workflow.type === 'training'
    ? extractChatbotField(message, [/\b(?:tema|capacitaci[oó]n)\b\s*(?:(?:es|ser[ií]a|sobre|:)\s+)([\s\S]+)/i])
    : ''
  const correctedComplaint = workflow.type === 'complaint' && missingField === 'detailsConfirmed'
    ? cleanChatbotFieldValue(message.replace(/^\s*(?:no[,.:;]?\s*)?(?:en\s+realidad|corrige|correcci[oó]n|lo\s+que\s+ocurri[oó]\s+fue)?\s*/i, ''))
    : ''
  let validationError = ''

  if (data.city && !isValidCityAnswer(data.city)) delete data.city
  if (data.address && !isValidAddressAnswer(data.address)) delete data.address
  if (data.quantity && !hasProductPackageQuantity(data.quantity) && extractOperationSize(data.quantity)) {
    data.operationSize = data.operationSize || extractOperationSize(data.quantity)
    data.usageFrequency = data.usageFrequency || extractUsageFrequency(data.quantity)
    data.needsQuantityHelp = true
    delete data.quantity
    delete data.quantityConfirmed
  }

  Object.entries(extractedData).forEach(([field, value]) => {
    if (!value || ['product', 'quantity', 'city', 'address'].includes(field)) return
    data[field] = value
  })

  if (workflow.type === 'quote' && missingField === 'product' && refersToRecentProductSet(message)) {
    const recentProducts = getRecentChatbotProducts(chatMessages)
    if (recentProducts.length > 1) {
      data.products = recentProducts.map((product) => product.name)
      data.product = data.products.join(', ')
      delete data.selectionConfirmed
      delete data.orderConfirmed
      delete data.submissionConfirmed
    }
  }
  if (workflow.type === 'quote' && matchedProduct && !data.products?.length) {
    data.product = matchedProduct.name
    data.products = [matchedProduct.name]
    delete data.orderConfirmed
    delete data.submissionConfirmed
  }
  if (workflow.type === 'quote' && !matchedProduct && isGenericProductReference(message)) {
    const recentProduct = getRecentSingleChatbotProduct(chatMessages)
    if (recentProduct) data.product = recentProduct.name
    else validationError = 'ambiguousProduct'
  }
  if (workflow.type === 'training' && matchedProduct && !isStarterMessage) data.product = matchedProduct.name
  if (workflow.type === 'training' && correctedTopic && !isStarterMessage && !workflowSummaryRequested) data.topics = correctedTopic
  if (workflow.type === 'complaint' && matchedProduct && !isStarterMessage) data.product = matchedProduct.name
  if (workflow.type === 'complaint' && correctedComplaint.length >= 8 && !isAffirmativeAnswer(message) && !workflowSummaryRequested) {
    data.reason = correctedComplaint
  }
  if (workflow.type === 'training' && trainingDate && (missingField === 'preferredDate' || /\bfecha\b/i.test(message))) {
    data.preferredDate = trainingDate
  }
  if (workflow.type === 'training' && trainingTime && (missingField === 'preferredTime' || /\b(?:hora|horario)\b/i.test(message))) {
    data.preferredTime = trainingTime
  }

  if (workflow.type === 'quote' && operationSize) data.operationSize = operationSize
  if (workflow.type === 'quote' && usageFrequency) data.usageFrequency = usageFrequency

  if (workflow.type === 'quote' && (wantsChatbotQuantityEstimate(message) || operationSize || usageFrequency) && !hasProductPackageQuantity(message)) {
    data.needsQuantityHelp = true
    if ((missingField === 'city' || missingField === 'address') && !hadConfirmedQuantity) {
      delete data.quantity
      delete data.quantityConfirmed
    }
  }

  if (workflow.type === 'quote' && data.needsQuantityHelp && dailySolutionLiters) {
    data.solutionVolume = `${dailySolutionLiters} L de solución preparada al día`
    data.dailySolutionLiters = dailySolutionLiters
    data.solutionVolumeAssumed = false
    delete data.quantity
    delete data.quantityConfirmed
  } else if (workflow.type === 'quote' && missingField === 'solutionVolume' && wantsChatbotQuantityEstimate(message)) {
    data.solutionVolume = '1 L de solución preparada al día (supuesto inicial)'
    data.dailySolutionLiters = 1
    data.solutionVolumeAssumed = true
  }

  const attendeesMatch = message.match(/\b(\d+\s*(?:personas?|participantes?|asistentes?))\b/i)
  if (attendeesMatch) data.attendees = attendeesMatch[1]

  const orderMatch = message.match(/\b(?:pedido|factura|orden)\s*(?:n[uú]mero|nro\.?|#|:)?\s*([a-z0-9-]{3,})\b/i)
  if (orderMatch) data.orderNumber = orderMatch[1]

  const directAnswer = cleanChatbotFieldValue(message.replace(/^[📋🎓📦🧭🚚⚠️👤]\s*/u, ''))
  const canUseDirectAnswer = !isStarterMessage && !workflowSummaryRequested && directAnswer && normalizedMessage.split(/\s+/).length <= 40

  if (canUseDirectAnswer && missingField) {
    if (missingField === 'product' && !data.product && !extractedData.sector && !isGenericProductReference(message)) data.product = matchedProduct?.name || directAnswer
    if (missingField === 'quantity' && !data.quantity && !data.needsQuantityHelp && hasProductPackageQuantity(message)) {
      data.quantity = formatQuoteQuantity(message, getQuoteProductNames(data).length)
      delete data.orderConfirmed
      delete data.submissionConfirmed
    }
    if (missingField === 'operationSize' && !data.operationSize && operationSize) data.operationSize = operationSize
    if (missingField === 'usageFrequency' && !data.usageFrequency && usageFrequency) data.usageFrequency = usageFrequency
    if (missingField === 'city' && !data.city) {
      if (isValidCityAnswer(message)) data.city = extractedData.city || directAnswer
      else validationError = wantsChatbotQuantityEstimate(message) ? 'cityQuantityMismatch' : 'city'
    }
    if (missingField === 'address' && !data.address) {
      if (isValidAddressAnswer(message)) data.address = extractedData.address || directAnswer
      else validationError = 'address'
    }
    if (missingField === 'name' && !data.name) data.name = directAnswer
    if (missingField === 'phone' && !data.phone) {
      if (/\d{7,}/.test(message.replace(/\D/g, ''))) data.phone = directAnswer
      else validationError = 'phone'
    }
    if (missingField === 'email' && !data.email) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(message.trim())) data.email = directAnswer
      else validationError = 'email'
    }
    if (missingField === 'company' && !data.company) data.company = directAnswer
    if (missingField === 'attendees' && !data.attendees) {
      if (isValidAttendeeAnswer(message)) data.attendees = attendeesMatch?.[1] || directAnswer
      else validationError = 'attendees'
    }
    if (missingField === 'topics' && !data.topics) data.topics = directAnswer
    if (missingField === 'reason' && !data.reason) data.reason = directAnswer
    if (missingField === 'preferredDate' && !data.preferredDate) {
      if (trainingDate) data.preferredDate = trainingDate
      else validationError = 'preferredDate'
    }
    if (missingField === 'preferredTime' && !data.preferredTime) {
      if (trainingTime) data.preferredTime = trainingTime
      else validationError = 'preferredTime'
    }
    if (missingField === 'detailsConfirmed' && isAffirmativeAnswer(message)) data.detailsConfirmed = 'Sí'
    if (missingField === 'selectionConfirmed' && isAffirmativeAnswer(message)) data.selectionConfirmed = 'Sí'
    if (missingField === 'selectionConfirmed' && hasProductPackageQuantity(message)) {
      data.selectionConfirmed = 'Sí (confirmación implícita al indicar cantidades)'
      data.quantity = formatQuoteQuantity(message, getQuoteProductNames(data).length)
      delete data.orderConfirmed
      delete data.submissionConfirmed
    }
    if (missingField === 'quantityConfirmed' && isAffirmativeAnswer(message)) {
      data.quantityConfirmed = 'Sí'
      data.orderConfirmed = 'Sí'
    }
    if (missingField === 'orderConfirmed' && isAffirmativeAnswer(message)) data.orderConfirmed = 'Sí'
    if (missingField === 'submissionConfirmed' && isAffirmativeAnswer(message)) data.submissionConfirmed = 'Sí'
    if (missingField === 'contact' && !data.phone && !data.email) {
      if (/@/.test(message)) data.email = directAnswer
      else if (/\d{7,}/.test(message.replace(/\D/g, ''))) data.phone = directAnswer
    }
  }

  if (workflow.type === 'quote' && !data.needsQuantityHelp && missingField === 'quantity' && directAnswer && !hasProductPackageQuantity(message)) {
    validationError = validationError || 'quantity'
  }

  if (workflow.type === 'quote' && data.needsQuantityHelp && data.operationSize && data.usageFrequency && data.solutionVolume && !data.quantity) {
    const estimate = buildChatbotQuantityEstimate(data.product, data.dailySolutionLiters || 1)
    if (estimate) {
      data.quantityEstimate = estimate
      data.quantity = `${estimate.quantity} (estimación inicial)`
    }
  }

  if (workflow.type === 'quote' && missingField === 'quantityConfirmed' && !isAffirmativeAnswer(message) && !dailySolutionLiters) {
    validationError = 'quantityConfirmation'
  }

  if (workflow.type === 'quote' && ['selectionConfirmed', 'orderConfirmed', 'submissionConfirmed'].includes(missingField) && !data[missingField] && !isAffirmativeAnswer(message)) {
    validationError = `${missingField}Required`
  }

  if (workflow.type !== 'quote' && ['detailsConfirmed', 'submissionConfirmed'].includes(missingField) && !data[missingField] && !isAffirmativeAnswer(message)) {
    validationError = `${missingField}Required`
  }

  if (workflowSummaryRequested) validationError = 'workflowSummary'

  return { ...workflow, data, validationError }
}

function getChatbotWorkflowResponse(workflow) {
  const missingField = getChatbotWorkflowMissingField(workflow)
  const { data, type, validationError } = workflow

  if (!missingField) return null

  if (validationError === 'workflowSummary') {
    return `${buildWorkflowSummary(workflow, { includeContact: true })}\n\nDato pendiente: ${getWorkflowPendingPrompt(type, missingField)}`
  }
  if (validationError === 'city') return 'Todavía no pude reconocer la ciudad y no avanzaré hasta confirmarla. ¿En qué ciudad necesitas continuar la solicitud?'
  if (validationError === 'address') return 'Todavía no tengo una dirección válida. Escríbela con tipo de vía y número, por ejemplo: Carrera 20 # 10-30.'
  if (validationError === 'phone') return 'Ese dato no parece un teléfono. Compárteme un número de contacto de al menos 7 dígitos.'
  if (validationError === 'email') return 'Ese dato no parece un correo completo. Escríbelo en un formato como nombre@empresa.com.'
  if (validationError === 'attendees') return 'Necesito una cantidad aproximada de asistentes, por ejemplo: “20 personas”.'
  if (validationError === 'preferredDate') return 'No pude reconocer una fecha. Puedes responder, por ejemplo: “15 de octubre”, “20/10/2026” o “el próximo martes”.'
  if (validationError === 'preferredTime') return 'No pude reconocer el horario. Puedes responder, por ejemplo: “9:00 a. m.”, “2:30 p. m.” o “en la mañana”.'

  if (type === 'quote') {
    if (validationError === 'ambiguousProduct') return 'Quiero continuar con el producto correcto, pero mencionamos más de una opción. ¿Cuál producto deseas comprar?'
    if (validationError === 'quantity') return 'Ese dato describe tu operación, pero no una cantidad de compra. Puedo estimarla contigo: dime cuántas mesas, metros cuadrados u otras unidades atiendes y con qué frecuencia.'
    if (validationError === 'cityQuantityMismatch') return 'La cantidad ya quedó orientada con la estimación anterior. Esa respuesta no corresponde al dato pendiente y no la guardaré como ciudad. ¿En qué ciudad necesitas la entrega?'
    if (validationError === 'quantityConfirmation') return 'Antes de continuar necesito confirmar la estimación. Puedes responder “sí, me sirve” o indicarme cuántos litros de solución preparan al día para recalcularla.'
    if (validationError === 'selectionConfirmedRequired') return 'Necesito confirmar primero la selección de productos. Responde “sí” para incluirlos todos o dime cuál deseas retirar.'
    if (validationError === 'orderConfirmedRequired') return 'Antes de pedir los datos de entrega necesito confirmar productos y cantidades. Responde “sí” si el resumen es correcto o indícame qué deseas cambiar.'
    if (validationError === 'submissionConfirmedRequired') return 'La solicitud todavía no se ha enviado. Responde “sí, enviar” para confirmarla o indícame qué dato deseas corregir.'
    if (missingField === 'product') {
      const recommendation = getChatbotSectorRecommendation(data.sector)
      if (recommendation) {
        return `Para ${recommendation.label}, normalmente se consideran estas soluciones:\n\n${recommendation.products.map((product) => `• ${product.name}`).join('\n')}\n\n¿Cuál deseas cotizar? También puedes indicarme otra necesidad.`
      }
      return 'Con gusto preparo la cotización. ¿Qué producto necesitas o qué tipo de espacio deseas atender?'
    }
    if (missingField === 'selectionConfirmed') {
      return `${buildQuoteOrderSummary(data)}\n\n¿Confirmas que deseas incluir estos ${getQuoteProductNames(data).length} productos en la cotización?`
    }
    if (missingField === 'quantity') {
      if (getQuoteProductNames(data).length > 1) {
        return `${buildQuoteOrderSummary(data)}\n\nIndícame la cantidad para cada producto. Puedes responder, por ejemplo, “10 galones de cada uno” o especificar una cantidad diferente por producto.`
      }
      const presentations = getChatbotProductPresentations(data.product)
      const presentationText = presentations.length
        ? `\n\nPresentaciones publicadas:\n${presentations.map((presentation) => `• ${presentation}`).join('\n')}`
        : ''
      return `Perfecto, cotizaremos ${data.product}.${presentationText}\n\n¿Qué cantidad y presentación necesitas? Si no lo sabes, dime “ayúdame a estimar” y te guío.`
    }
    if (missingField === 'operationSize') return 'Claro. Para orientarte sin inventar una cantidad, cuéntame el tamaño de tu operación: por ejemplo, metros cuadrados, habitaciones, puestos, empleados o consumo actual.'
    if (missingField === 'usageFrequency') return '¿Con qué frecuencia usarían el producto: diariamente, varias veces por semana o de forma ocasional? El equipo comercial validará contigo la cantidad final.'
    if (missingField === 'solutionVolume') return `Ya tengo ${data.operationSize} y una frecuencia ${data.usageFrequency}. Para convertir la dosificación en una cantidad de compra, ¿cuántos litros de solución preparada usarían al día? Si no lo sabes, responde “no sé” y calcularé un escenario inicial claramente identificado.`
    if (missingField === 'quantityConfirmed' && data.quantityEstimate) {
      const estimate = data.quantityEstimate
      return `Estimación inicial para ${data.operationSize} con uso ${data.usageFrequency}\n\n• Dosificación publicada: ${estimate.dilutionMlPerLiter} ml por 1 L de agua.\n• Supuesto: ${estimate.dailySolutionLiters} L de solución preparada al día.\n• Consumo aproximado: ${estimate.monthlyConcentrateMl} ml de concentrado al mes.\n• Compra inicial sugerida: ${estimate.quantity}.\n• Duración aproximada bajo ese supuesto: ${estimate.estimatedDays} días.\n\nEl equipo comercial validará la cantidad final. ¿Te sirve esta estimación o preparan más de ${estimate.dailySolutionLiters} L al día?`
    }
    if (missingField === 'orderConfirmed') return `${buildQuoteOrderSummary(data)}\n\n¿Confirmas que estos productos y cantidades son correctos antes de continuar con los datos de entrega?`
    if (missingField === 'city') return '¿En qué ciudad necesitas la entrega?'
    if (missingField === 'address') return '¿Cuál es la dirección de entrega? La necesitamos para calcular el transporte.'
    if (missingField === 'name') return '¿A nombre de quién preparamos la cotización?'
    if (missingField === 'phone') return '¿Cuál es tu número de teléfono de contacto?'
    if (missingField === 'email') return '¿A qué correo electrónico debemos enviar la cotización?'
    if (missingField === 'submissionConfirmed') return `${buildQuoteOrderSummary(data, { includeContact: true })}\n\nEsta es la solicitud completa. ¿Confirmas que deseas enviarla al equipo comercial de Naval?`
  }

  if (type === 'complaint') {
    if (validationError === 'detailsConfirmedRequired') return `${buildComplaintSummary(data)}\n\nAntes de continuar necesito confirmar que entendí correctamente la queja. Responde “sí” o indícame qué debo corregir.`
    if (validationError === 'submissionConfirmedRequired') return `${buildComplaintSummary(data, { includeContact: true })}\n\nLa queja todavía no se ha enviado. Responde “sí, enviar” para confirmarla o indícame qué dato deseas corregir.`
    if (missingField === 'reason') return 'Quiero ayudarte a gestionar la queja. Cuéntame brevemente qué ocurrió.'
    if (missingField === 'detailsConfirmed') return `${buildComplaintSummary(data)}\n\n¿Esta descripción representa correctamente lo ocurrido?`
    if (missingField === 'name') return 'Gracias por explicarlo. ¿Cuál es tu nombre?'
    if (missingField === 'city') return '¿En qué ciudad ocurrió o recibiste el pedido?'
    if (missingField === 'phone') return '¿Cuál es tu teléfono de contacto?'
    if (missingField === 'email') return '¿Cuál es tu correo electrónico para dar seguimiento al caso?'
    if (missingField === 'submissionConfirmed') return `${buildComplaintSummary(data, { includeContact: true })}\n\nEsta es la queja completa. ¿Confirmas que deseas enviarla al equipo de servicio al cliente de Naval?`
  }

  if (type === 'training') {
    if (validationError === 'detailsConfirmedRequired') return `${buildTrainingSummary(data)}\n\nAntes de continuar necesito confirmar los datos principales de la capacitación. Responde “sí” o indícame qué dato debemos corregir.`
    if (validationError === 'submissionConfirmedRequired') return `${buildTrainingSummary(data, { includeContact: true })}\n\nLa capacitación todavía no se ha solicitado. Responde “sí, enviar” para confirmarla o indícame qué dato deseas corregir.`
    if (missingField === 'topics') return 'Te ayudo a solicitar la capacitación. ¿Sobre qué producto o tema necesitan formación?'
    if (missingField === 'company') return '¿Cuál es el nombre de la empresa?'
    if (missingField === 'attendees') return '¿Cuántas personas asistirían aproximadamente?'
    if (missingField === 'preferredDate') return '¿Qué fecha o rango de fechas prefieren? La disponibilidad se confirmará muy pronto.'
    if (missingField === 'preferredTime') return '¿Qué horario o franja horaria prefieren?'
    if (missingField === 'detailsConfirmed') return `${buildTrainingSummary(data)}\n\n¿Confirmas que el tema, la empresa, los participantes, la fecha y el horario son correctos?`
    if (missingField === 'city') return '¿En qué ciudad se realizaría?'
    if (missingField === 'address') return '¿Cuál es la dirección donde se realizaría la capacitación?'
    if (missingField === 'name') return '¿Cuál es tu nombre?'
    if (missingField === 'phone') return '¿Cuál es tu teléfono de contacto?'
    if (missingField === 'email') return '¿Cuál es tu correo electrónico?'
    if (missingField === 'submissionConfirmed') return `${buildTrainingSummary(data, { includeContact: true })}\n\nEsta es la solicitud completa. ¿Confirmas que deseas enviarla al equipo de Naval?`
  }

  return 'Cuéntame el dato pendiente para continuar.'
}

function buildChatbotWorkflowSubmission(workflow) {
  const { data, type } = workflow
  const lines = [
    `Tipo de solicitud: ${chatbotRequestLabels[type]}.`,
    `Prioridad: ${chatbotRequestPriorities[type] ?? 'NORMAL'}.`,
  ]
  if (data.requestId) lines.push(`ID de solicitud: ${data.requestId}`)
  const fieldsByType = {
    quote: [['Nombre', 'name'], ['Empresa', 'company'], ['Ciudad', 'city'], ['Dirección', 'address'], ['Teléfono', 'phone'], ['Correo', 'email'], ['Producto', 'product'], ['Cantidad y presentación', 'quantity'], ['Tamaño de la operación', 'operationSize'], ['Frecuencia de uso', 'usageFrequency'], ['Sector', 'sector']],
    complaint: [['Nombre', 'name'], ['Empresa', 'company'], ['Ciudad', 'city'], ['Teléfono', 'phone'], ['Correo', 'email'], ['Pedido o factura', 'orderNumber'], ['Descripción de la queja', 'reason']],
    training: [['Nombre', 'name'], ['Empresa', 'company'], ['Ciudad', 'city'], ['Dirección', 'address'], ['Teléfono', 'phone'], ['Correo', 'email'], ['Asistentes', 'attendees'], ['Tema', 'topics'], ['Fecha preferida', 'preferredDate'], ['Horario preferido', 'preferredTime']],
  }

  for (const [label, field] of fieldsByType[type] ?? []) {
    if (data[field]) lines.push(`${label}: ${data[field]}`)
  }

  return lines.join('\n')
}

function wantsChatbotLinks(message) {
  return /\b(?:ver|verlo|verla|mostrar|mu[eé]strame|abrir|ir\s+a|ll[eé]vame|enlace|link|p[aá]gina|ficha|descargar|navegar|buscar\s+en\s+el\s+sitio|(?:en\s+)?d[oó]nde|d[oó]nde\s+encuentro)\b/i.test(message)
}

function getProductInterestClarificationResponse(message, product) {
  if (!product || !isAmbiguousProductInterest(message)) return null

  return {
    text: `Perfecto, te ayudo con ${product.name}.\n\n¿Quieres ver la información del producto o deseas comprarlo y preparar una cotización? También puedes preguntarme antes por sus usos, dosificación, presentaciones o forma de aplicación.`,
    actions: [
      { label: 'Ver producto', href: product.productUrl },
      { label: 'Quiero comprarlo', message: `Quiero comprar ${product.name}` },
    ],
  }
}

function hideUnrequestedChatbotActions(response, message) {
  if (!response?.actions?.length || wantsChatbotLinks(message) || response.actions.some((action) => action.message)) return response
  const { actions, ...responseWithoutActions } = response
  return responseWithoutActions
}

function hasChatbotHumanHandoffRequest(chatMessages) {
  return chatMessages.some(
    (chatMessage) => chatMessage.from === 'user' && wantsHumanChatbotHandoff(chatMessage.text ?? ''),
  )
}

function isChatbotHandoffInformationComplete(contactData) {
  return Boolean(contactData.name && contactData.city && contactData.phone && contactData.email && contactData.reason)
}

function buildChatbotWhatsappMessage(contactData) {
  const details = [
    ['Nombre', contactData.name],
    ['Empresa', contactData.company],
    ['Ciudad', contactData.city],
    ['Teléfono', contactData.phone],
    ['Correo', contactData.email],
    ['Motivo', contactData.reason],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n')

  return `Hola, quiero continuar mi conversación con un asesor de Naval por WhatsApp.\n\n${details}`
}

function buildChatbotWhatsappFallbackMessage(intent, chatMessages) {
  const conversation = formatChatbotConversationText(chatMessages)
  const label = chatbotRequestLabels[intent] ?? chatbotRequestLabels.question

  return `Hola, necesito ayuda de Productos Naval.\nTipo de solicitud: ${label}.\n\n${conversation}`.slice(0, 3500)
}

function getChatbotRecoveryResponse(intent, chatMessages) {
  const contactData = extractChatbotConversationContactData(chatMessages)
  const mentionedProduct = [...chatMessages]
    .reverse()
    .filter((chatMessage) => chatMessage.from === 'user')
    .map((chatMessage) => findAssistantProduct(chatMessage.text ?? '', productAssistantCatalog))
    .find(Boolean)

  if (intent === 'quote') {
    const requestedProduct = mentionedProduct?.name || contactData.product
    if (!requestedProduct && !contactData.sector) return 'Con gusto te ayudo a cotizar. Cuéntame qué producto necesitas o qué tipo de empresa o área deseas atender.'
    if (!requestedProduct) return `Perfecto, te ayudaré con soluciones para ${contactData.sector}. ¿Qué productos o necesidades específicas quieres incluir en la cotización?`
    if (!contactData.quantity) return `Perfecto, tengo el producto: ${requestedProduct}. ¿Qué cantidad y presentación necesitas?`
    if (!contactData.city) return '¿En qué ciudad necesitas la entrega?'
    if (!contactData.phone && !contactData.email) return 'Compárteme un teléfono o correo para que el equipo comercial pueda enviarte la cotización.'
    return 'Ya tengo la información principal. Enviaré la solicitud al equipo comercial para que prepare la cotización y te responda por el teléfono o correo indicado.'
  }

  if (intent === 'training') {
    return 'Para solicitar una capacitación, compárteme:\n\n• Empresa\n• Ciudad\n• Número aproximado de participantes\n• Temas de interés\n• Teléfono o correo de contacto'
  }

  if (intent === 'complaint') {
    return 'Quiero ayudarte con el caso. Compárteme:\n\n• Qué ocurrió\n• Número de pedido o factura, si lo tienes\n• Ciudad\n• Teléfono o correo de contacto'
  }

  if (intent === 'human') {
    const missingFields = [
      !contactData.name && 'nombre',
      !contactData.city && 'ciudad',
      !contactData.phone && 'teléfono',
      !contactData.email && 'correo',
      !contactData.reason && 'motivo de contacto',
    ].filter(Boolean)

    return missingFields.length
      ? `Para conectarte con un asesor, compárteme: ${missingFields.join(', ')}.`
      : 'Gracias. Puedes continuar ahora por WhatsApp con los datos de esta conversación.'
  }

  return 'Para orientarte bien, dime qué espacio o superficie deseas limpiar y cuál es el problema principal: grasa, sarro, malos olores, desinfección, lavado diario u otro. Te recomendaré opciones y te haré una sola pregunta a la vez.'
}

function getLocalChatbotResponse(message, intent, chatMessages = []) {
  const normalizedMessage = normalizeAssistantText(message)
  const conversationContactData = extractChatbotConversationContactData(chatMessages)
  const normalizedCustomerConversation = normalizeAssistantText(
    chatMessages
      .filter((chatMessage) => chatMessage.from === 'user' && chatMessage.text)
      .map((chatMessage) => chatMessage.text)
      .join(' '),
  )

  if (intent === 'human') {
    const whatsappMessage = buildChatbotWhatsappFallbackMessage(intent, chatMessages)
    return {
      text: 'Claro. Puedes hablar directamente con un asesor de Productos Naval por WhatsApp en el +57 320 342 8815.',
      whatsappUrl: `${whatsappHref}?text=${encodeURIComponent(whatsappMessage)}`,
    }
  }

  if (intent === 'training' && mentionsChatbotTraining(message)) {
    return {
      text: 'Capacitaciones Naval\n\nIncluyen:\n• Selección y uso de productos\n• Dosificación y aplicación segura\n• Almacenamiento y EPP\n• Protocolos de limpieza\n\nPara solicitarla, indícame empresa, ciudad, participantes, temas de interés y un teléfono o correo.',
      actions: [{ label: 'Ver capacitaciones', href: '/#lineas-capacitaciones' }],
    }
  }

  const currentMessageContactData = extractChatbotContactData(message)
  const conversationSectorRule = chatbotSectorRules.find(({ pattern }) => pattern.test(conversationContactData.sector ?? ''))

  if (intent === 'question' && conversationSectorRule?.title === 'Gym' && /\b(?:zonas? comunes?|areas? comunes?|pisos?)\b/.test(normalizedMessage)) {
    return {
      text: 'Para las zonas comunes del gimnasio, te recomiendo comenzar con estas dos opciones:\n\n• Limpiador Desinfectante: para pisos y superficies lavables cuando necesitas limpieza con desinfección.\n• Detergente Limpiador Multiusos: para el mantenimiento diario de pisos, paredes, mesones y escaleras.\n\n¿Tu prioridad es desinfectar superficies de contacto o realizar la limpieza diaria general?',
    }
  }

  if (intent === 'question' && normalizedCustomerConversation.includes('marmol')) {
    if (/\b(?:m2|metros cuadrados|area|superficie)\b/.test(normalizedMessage) && /\b\d+\b/.test(normalizedMessage)) {
      const ceraPolimerica = productByName.get('Cera Polimérica')
      const presentations = getProductPresentations(ceraPolimerica).filter(Boolean)
      return {
        text: `Para ${message.match(/\b\d+[\d.,]*\s*(?:m2|metros cuadrados)?/i)?.[0] || 'esa área'}, la opción Naval publicada para proteger y dar brillo al mármol sellado es Cera Polimérica.\n\nPresentaciones publicadas:\n${presentations.map((presentation) => `• ${presentation}`).join('\n')}\n\nSe usa pura, pero el catálogo no publica rendimiento por m²; por eso no sería responsable inventar una cantidad. ¿Cuánta cera consumen actualmente por aplicación? Si aún no lo saben, puedes decir “quiero cotizar Cera Polimérica” y la cantidad quedará para validación comercial.`,
      }
    }

    if (/\b(?:sellado|sellada|diaria|diario|brillo|proteger|proteccion)\b/.test(normalizedMessage)) {
      return {
        text: 'Para mármol sellado, Cera Polimérica es la opción Naval publicada cuando buscas protección y brillo. El catálogo no declara un limpiador diario específico para mármol, así que no te recomendaré otro producto sin validar su compatibilidad.\n\n¿Quieres proteger y recuperar el brillo con Cera Polimérica, o buscas únicamente retirar la suciedad diaria?',
      }
    }
  }

  if (['question', 'quote'].includes(intent) && currentMessageContactData.sector) {
    const sectorRule = chatbotSectorRules.find(({ pattern }) => pattern.test(currentMessageContactData.sector))
    const recommendedProducts = (sectorProductNamesByTitle[sectorRule?.title] ?? [])
      .slice(0, 5)
      .map((productName) => productByName.get(productName))
      .filter(Boolean)

    if (sectorRule && recommendedProducts.length && (intent === 'question' || !conversationContactData.quantity)) {
      const sectorAreaQuestion = {
        Gym: '¿Qué área quieres atender primero: máquinas, pisos y zonas comunes, baños y vestieres, o control de olores?',
        Restaurante: '¿Qué área quieres atender primero: cocina, comedor, baños o lavado de utensilios?',
        Hotelero: '¿Qué área quieres atender primero: habitaciones, baños, lavandería o zonas comunes?',
      }[sectorRule.title] || '¿Qué área de la operación quieres atender primero?'
      const nextQuestion = intent === 'quote'
        ? '¿Cuáles deseas incluir y en qué cantidades? Si aún no lo sabes, puedo ayudarte a estimarlo.'
        : sectorAreaQuestion
      return {
        text: `Para ${sectorRule.label}, estas son buenas opciones para comenzar:\n\n${recommendedProducts.map((product) => `• ${product.name}`).join('\n')}\n\n${nextQuestion}`,
        actions: recommendedProducts.slice(0, 3).map((product) => ({
          label: `Ver ${product.name}`,
          href: getPagePath(product.slug),
        })),
      }
    }
  }

  if (/^(?:hola|buenos dias|buenas tardes|buenas noches|hey|buenas|saludos)[!. ]*$/.test(normalizedMessage)) {
    return { text: '¡Hola! Soy el Asistente Naval. Cuéntame qué área necesitas limpiar, qué producto buscas o si deseas una cotización.' }
  }

  if (/\b(?:telefono|correo|email|whatsapp|contacto|donde estan|ubicacion)\b/.test(normalizedMessage) && intent === 'question') {
    return {
      text: 'Puedes contactar a Productos Naval por WhatsApp al +57 320 342 8815 o por correo a servicioalcliente@productosnaval.com.',
      actions: [{ label: 'Ver contacto', href: '/contacto' }],
    }
  }

  if (/\b(?:catalogo|portafolio|todos los productos|que venden|que productos tienen)\b/.test(normalizedMessage)) {
    return {
      text: 'El portafolio incluye soluciones para limpieza general, cocinas, pisos y superficies, lavandería, higiene y desinfección. Puedes ver el catálogo completo o decirme qué necesitas limpiar para recomendarte opciones.',
      actions: [{ label: 'Ver catálogo', href: '/productos/todos' }],
    }
  }

  const pageNavigationRules = [
    { pattern: /\b(?:quienes son|quienes somos|conocer naval|sobre naval|empresa naval)\b/, text: 'Aquí puedes conocer la historia, experiencia y enfoque de Productos Naval.', actions: [{ label: 'Ir a quiénes somos', href: '/' }] },
    { pattern: /\b(?:preguntas frecuentes|faq|dudas frecuentes)\b/, text: 'Aquí encuentras respuestas rápidas sobre productos, compras, asesoría y operación.', actions: [{ label: 'Ver preguntas frecuentes', href: '/preguntas-frecuentes' }] },
    { pattern: /\b(?:tienda|carrito|hacer pedido|armar pedido)\b/, text: 'Puedes preparar tu solicitud desde la tienda y enviarla para cotización.', actions: [{ label: 'Ir a la tienda', href: '/tienda' }] },
    { pattern: /\b(?:guias|blog|articulos|consejos de limpieza)\b/, text: 'Puedes consultar las guías de Naval para elegir y usar soluciones de limpieza.', actions: [{ label: 'Ver guías', href: '/guias' }] },
    { pattern: /\b(?:contacto|contactenos|pagina de contacto)\b/, text: 'Aquí encuentras los canales de atención comercial de Productos Naval.', actions: [{ label: 'Ir a contacto', href: '/contacto' }] },
    { pattern: /\b(?:capacitaciones|formacion tecnica|seguridad quimica)\b/, text: 'La sección de capacitaciones explica los temas, beneficios y forma de solicitar formación para tu equipo.', actions: [{ label: 'Ver capacitaciones', href: '/#lineas-capacitaciones' }] },
  ]
  const pageNavigation = pageNavigationRules.find(({ pattern }) => pattern.test(normalizedMessage))
  if (pageNavigation) return { text: pageNavigation.text, actions: pageNavigation.actions }

  if (/\b(?:buscar en el sitio|navegar|navegacion|menu|paginas|a donde puedo ir|ayuda para encontrar)\b/.test(normalizedMessage)) {
    return {
      text: 'Puedo llevarte directamente a la sección que necesitas. Elige una opción o dime el nombre de un producto, documento o tema.',
      actions: [
        { label: 'Productos', href: '/productos/todos' },
        { label: 'Tienda', href: '/tienda' },
        { label: 'Capacitaciones', href: '/#lineas-capacitaciones' },
        { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
        { label: 'Contacto', href: '/contacto' },
      ],
    }
  }

  return null
}

function buildChatbotWebhookPayload(message, requestType, submittedAt) {
  const contactData = extractChatbotContactData(message)

  return {
    source: 'productos-naval-chatbot',
    message,
    submittedAt,
    name: contactData.name,
    company: contactData.company,
    city: contactData.city,
    address: contactData.address,
    phone: contactData.phone,
    email: contactData.email,
    product: contactData.product,
    quantity: contactData.quantity,
    reason: contactData.reason,
    sector: contactData.sector,
    requestType,
    requestLabel: chatbotRequestLabels[requestType] ?? chatbotRequestLabels.question,
    priority: chatbotRequestPriorities[requestType] ?? 'NORMAL',
    handoff: requestType === 'human',
    recommendedChannel: 'crm',
  }
}

function createChatbotRequestId(requestType) {
  const prefix = {
    quote: 'COT',
    complaint: 'QUE',
    training: 'CAP',
  }[requestType] ?? 'SOL'
  const datePart = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  const randomPart = window.crypto?.randomUUID?.().slice(0, 8).toUpperCase() ?? Math.random().toString(36).slice(2, 10).toUpperCase()
  return `NAV-${prefix}-${datePart}-${randomPart}`
}

function normalizeChatbotReplyText(text) {
  return String(text ?? '')
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/^[\s"'`]+/, '')
    .replace(/[\s"'`}]+$/, '')
    .trim()
}

function unwrapReplyText(text) {
  if (typeof text !== "string") return text

  const normalizedText = text.trim()
  const hasReplyKey = normalizedText.includes('"reply"') || normalizedText.includes("'reply'")

  if (!hasReplyKey) return normalizeChatbotReplyText(text)

  try {
    const parsedReply = JSON.parse(normalizedText)
    return typeof parsedReply.reply === "string" ? normalizeChatbotReplyText(parsedReply.reply) : normalizeChatbotReplyText(text)
  } catch {
    const looseMatch = normalizedText.match(/["']reply["']\s*:\s*([\s\S]*?)(?:,\s*["'][^"']+["']\s*:|}\s*$|$)/i)

    if (looseMatch?.[1]) {
      return normalizeChatbotReplyText(looseMatch[1]) || normalizeChatbotReplyText(text)
    }

    const keyMatch = normalizedText.match(/["']reply["']\s*:\s*(["'])/i)

    if (!keyMatch) return normalizeChatbotReplyText(text)

    const quote = keyMatch[1]
    const valueStart = keyMatch.index + keyMatch[0].length
    let value = ""
    let isEscaped = false

    for (let index = valueStart; index < normalizedText.length; index += 1) {
      const character = normalizedText[index]

      if (isEscaped) {
        value += character === "n" ? "\n" : character
        isEscaped = false
        continue
      }

      if (character === "\\") {
        isEscaped = true
        continue
      }

      if (character === quote) break

      value += character
    }

    return normalizeChatbotReplyText(value) || normalizeChatbotReplyText(text)
  }
}

function extractChatbotReply(payload) {
  if (typeof payload === 'string') {
    const trimmedPayload = payload.trim()

    if (trimmedPayload.startsWith('{') || trimmedPayload.startsWith('[')) {
      try {
        return extractChatbotReply(JSON.parse(trimmedPayload))
      } catch {
        return unwrapReplyText(payload)
      }
    }

    return unwrapReplyText(payload)
  }

  if (Array.isArray(payload)) {
    return payload.map(extractChatbotReply).find(Boolean) ?? ""
  }

  if (!payload || typeof payload !== "object") return ""

  return (
    extractChatbotReply(payload.reply) ||
    extractChatbotReply(payload.message) ||
    extractChatbotReply(payload.answer) ||
    extractChatbotReply(payload.text) ||
    extractChatbotReply(payload.body?.reply) ||
    extractChatbotReply(payload.body?.message) ||
    extractChatbotReply(payload.body?.answer) ||
    extractChatbotReply(payload.body?.text) ||
    extractChatbotReply(payload.Body?.reply) ||
    extractChatbotReply(payload.Body?.message) ||
    extractChatbotReply(payload.Body?.answer) ||
    extractChatbotReply(payload.Body?.text) ||
    extractChatbotReply(payload.data?.reply) ||
    extractChatbotReply(payload.data?.message) ||
    extractChatbotReply(payload.data?.answer) ||
    extractChatbotReply(payload.data?.text) ||
    extractChatbotReply(payload.output?.reply) ||
    extractChatbotReply(payload.output?.message) ||
    extractChatbotReply(payload.output?.answer) ||
    extractChatbotReply(payload.output?.text) ||
    extractChatbotReply(payload.response?.reply) ||
    extractChatbotReply(payload.response?.message) ||
    extractChatbotReply(payload.response?.answer) ||
    extractChatbotReply(payload.response?.text) ||
    ""
  )
}

function isTechnicalChatbotAck(reply) {
  return /^(?:accepted|ok|success)$/i.test(String(reply ?? '').trim())
}

function getChatbotFallbackReply(intent) {
  if (intent === 'quote') {
    return 'Gracias, recibimos tu solicitud de cotización. El equipo comercial de Naval revisará la información y te contactará por el canal que compartiste.'
  }

  if (intent === 'complaint') {
    return 'Gracias por contarnos lo ocurrido. Registramos tu solicitud para que el equipo de servicio al cliente pueda revisarla y darte respuesta.'
  }

  if (intent === 'human') {
    return 'Perfecto. Para conectarte con un asesor humano, indícame tu nombre, ciudad, teléfono, correo electrónico y motivo de contacto.'
  }

  return 'Gracias, recibimos tu mensaje. El equipo Naval revisará tu solicitud y te dará respuesta lo antes posible.'
}

function formatChatbotMessagesForWebhook(chatMessages) {
  return chatMessages
    .filter((chatMessage) => !chatMessage.isWriting && chatMessage.text)
    .map((chatMessage) => ({
      role: chatMessage.from === 'user' ? 'user' : 'assistant',
      content: extractChatbotReply(chatMessage.text),
    }))
}

function formatChatbotConversationText(chatMessages) {
  return chatMessages
    .filter((chatMessage) => !chatMessage.isWriting && chatMessage.text)
    .map((chatMessage) => {
      const speaker = chatMessage.from === 'user' ? 'Cliente' : 'Asistente'
      const text = extractChatbotReply(chatMessage.text).trim()

      return text ? `${speaker}: ${text}` : ''
    })
    .filter(Boolean)
    .join('\n')
}

function getInitialChatbotMessages() {
  return [
    {
      from: 'bot',
      text:
        'Hola, soy tu Asistente Naval.\n\n' +
        'Te ayudo a elegir productos del catálogo, comparar opciones y estimar presentaciones o cantidades según tu espacio y frecuencia de uso. También puedo gestionar cotizaciones, capacitaciones, quejas, fichas y navegación por la página.\n\n' +
        'Cuéntame qué necesitas limpiar o qué problema quieres resolver.',
    },
  ]
}

function getStoredChatbotState() {
  if (typeof window === 'undefined') return null

  try {
    const storedState = JSON.parse(window.localStorage.getItem(chatbotConversationStorageKey) || 'null')
    const savedAt = Number(storedState?.savedAt)
    const isExpired = !Number.isFinite(savedAt) || Date.now() - savedAt > chatbotSessionInactivityLimit
    if (isExpired || !Array.isArray(storedState?.messages)) return null

    const messages = storedState.messages
      .filter((chatMessage) => ['user', 'bot'].includes(chatMessage?.from) && typeof chatMessage?.text === 'string')
      .slice(-60)

    const firstCustomerMessage = messages.find((chatMessage) => chatMessage.from === 'user')?.text ?? ''
    const hasTrainingRequest = messages.some((chatMessage) =>
      chatMessage.from === 'user' && chatbotWorkflowStarterPatterns.training.test(chatMessage.text),
    )
    const activeWorkflow = storedState.activeWorkflow?.type === 'training' &&
      isDeliveryInformationRequest(firstCustomerMessage) && !hasTrainingRequest
      ? null
      : storedState.activeWorkflow ?? null

    return messages.length
      ? { messages, activeWorkflow, deliveryInquiry: storedState.deliveryInquiry ?? null }
      : null
  } catch {
    return null
  }
}

function ChatbotMessageContent({ text }) {
  const lines = extractChatbotReply(text).split('\n')
  const blocks = []
  let listItems = []

  const flushList = () => {
    if (!listItems.length) return
    blocks.push({ type: 'list', items: listItems })
    listItems = []
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trim()
    if (!line) {
      flushList()
      return
    }

    const bulletMatch = line.match(/^[•*-]\s+(.+)/)
    if (bulletMatch) {
      listItems.push(bulletMatch[1])
      return
    }

    flushList()
    blocks.push({
      type: /^(?:dosificaci[oó]n|importante|incluye|incluyen|capacitaciones naval|para solicitar|datos necesarios)\b|:$/.test(line.toLowerCase()) ? 'heading' : 'paragraph',
      text: line,
    })
  })
  flushList()

  return (
    <div className="floating-chatbot__message-content">
      {blocks.map((block, index) => {
        if (block.type === 'list') {
          return (
            <ul key={`list-${index}`}>
              {block.items.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}
            </ul>
          )
        }

        if (block.type === 'heading') return <strong key={`heading-${index}`}>{block.text}</strong>
        return <p key={`paragraph-${index}`}>{block.text}</p>
      })}
    </div>
  )
}

function createChatbotSessionId() {
  const randomValue = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `naval-session-${randomValue}`
}

function saveChatbotSession(sessionId) {
  window.localStorage.setItem(chatbotSessionStorageKey, sessionId)
  window.localStorage.setItem(chatbotSessionActivityStorageKey, String(Date.now()))
}

function resetChatbotSessionId() {
  const sessionId = createChatbotSessionId()

  try {
    window.localStorage.removeItem(chatbotSessionStorageKey)
    window.localStorage.removeItem(chatbotSessionActivityStorageKey)
    saveChatbotSession(sessionId)
  } catch {
    return sessionId
  }

  return sessionId
}

function getChatbotSessionId() {
  try {
    const storedSessionId = window.localStorage.getItem(chatbotSessionStorageKey)
    const lastActivity = Number(window.localStorage.getItem(chatbotSessionActivityStorageKey))
    const isExpired =
      !Number.isFinite(lastActivity) ||
      Date.now() - lastActivity > chatbotSessionInactivityLimit

    if (storedSessionId && !isExpired) {
      saveChatbotSession(storedSessionId)
      return storedSessionId
    }

    const sessionId = createChatbotSessionId()
    saveChatbotSession(sessionId)
    return sessionId
  } catch {
    return createChatbotSessionId()
  }
}

async function sendToMake(message, { signal, conversation = [], intent = getChatbotIntent(message), offlineReply = '', workflowData = {} } = {}) {
  const conversationContactData = extractChatbotConversationContactData(conversation)
  const webhookPayload = buildChatbotWebhookPayload(message, intent, new Date().toISOString())
  const hasCompleteHandoff =
    hasChatbotHumanHandoffRequest(conversation) && isChatbotHandoffInformationComplete(conversationContactData)
  const shouldOfferWhatsapp = intent === 'human' && hasChatbotHumanHandoffRequest(conversation)
  const whatsappMessage = buildChatbotWhatsappMessage(conversationContactData)
  const webhookUrl = makeWebhookEndpoint
  const catalogContext = buildChatbotCatalogContext(conversation)
  const conversationText = `${formatChatbotConversationText(conversation)}\n\n${catalogContext}`

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
    body: JSON.stringify({
      sessionId: getChatbotSessionId(),
      ...webhookPayload,
      requestId: workflowData.requestId || createChatbotRequestId(intent),
      name: workflowData.name || webhookPayload.name || conversationContactData.name,
      company: workflowData.company || webhookPayload.company || conversationContactData.company,
      city: workflowData.city || webhookPayload.city || conversationContactData.city,
      address: workflowData.address || webhookPayload.address || conversationContactData.address,
      phone: workflowData.phone || webhookPayload.phone || conversationContactData.phone,
      email: workflowData.email || webhookPayload.email || conversationContactData.email,
      product: workflowData.product || webhookPayload.product || conversationContactData.product,
      quantity: workflowData.quantity || webhookPayload.quantity || conversationContactData.quantity,
      reason: workflowData.reason || webhookPayload.reason || conversationContactData.reason,
      sector: workflowData.sector || webhookPayload.sector || conversationContactData.sector,
      attendees: workflowData.attendees || '',
      trainingTopic: workflowData.topics || '',
      preferredDate: workflowData.preferredDate || '',
      preferredTime: workflowData.preferredTime || '',
      orderNumber: workflowData.orderNumber || '',
      operationSize: workflowData.operationSize || '',
      usageFrequency: workflowData.usageFrequency || '',
      messages: formatChatbotMessagesForWebhook(conversation),
      conversationText,
      catalogContext,
      fallbackMessages: shouldOfferWhatsapp
        ? {
            whatsapp: whatsappMessage,
          }
        : {},
      allowWhatsappButton: shouldOfferWhatsapp,
      page: {
        url: window.location.href,
        path: window.location.pathname,
        userAgent: window.navigator.userAgent,
      },
    }),
  })
  const responseText = await response.text()
  let data = {}

  if (responseText) {
    try {
      data = JSON.parse(responseText)
    } catch {
      data = { reply: responseText }
    }
  }

  const extractedReply = extractChatbotReply(data)
  const reply = extractedReply && !isTechnicalChatbotAck(extractedReply)
    ? extractedReply
    : getChatbotFallbackReply(intent)

  if (!response.ok || typeof reply !== 'string' || !reply.trim()) {
    throw new Error('Respuesta inválida')
  }

  const fallbackWhatsappMessage = buildChatbotWhatsappFallbackMessage(intent, conversation)
  const replyText = data.delivered === false && offlineReply
    ? offlineReply
    : data.delivered === false && ['quote', 'complaint', 'training'].includes(intent)
      ? getChatbotRecoveryResponse(intent, conversation)
      : reply.trim()

  return {
    reply: replyText,
    whatsappUrl: shouldOfferWhatsapp
      ? `${whatsappHref}?text=${encodeURIComponent(hasCompleteHandoff ? whatsappMessage : fallbackWhatsappMessage)}`
      : '',
  }
}

function FloatingChatbot() {
  const initialStoredChatbotStateRef = useRef(null)
  if (initialStoredChatbotStateRef.current === null) {
    initialStoredChatbotStateRef.current = getStoredChatbotState() || { messages: getInitialChatbotMessages(), activeWorkflow: null, deliveryInquiry: null }
  }
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')
  const messagesEndRef = useRef(null)
  const requestAbortControllerRef = useRef(null)
  const requestTimeoutRef = useRef(null)
  const [chatMessages, setChatMessages] = useState(() => initialStoredChatbotStateRef.current.messages)
  const [activeWorkflow, setActiveWorkflow] = useState(() => initialStoredChatbotStateRef.current.activeWorkflow)
  const [deliveryInquiry, setDeliveryInquiry] = useState(() => initialStoredChatbotStateRef.current.deliveryInquiry)
  const hasUserMessages = chatMessages.some((chatMessage) => chatMessage.from === 'user')
  const submitChatbotMessageRef = useRef(null)

  const resetChatbotConversation = ({ closeChat = false } = {}) => {
    requestAbortControllerRef.current?.abort()

    if (requestTimeoutRef.current) {
      window.clearTimeout(requestTimeoutRef.current)
      requestTimeoutRef.current = null
    }

    requestAbortControllerRef.current = null
    resetChatbotSessionId()
    setChatMessages(getInitialChatbotMessages())
    setActiveWorkflow(null)
    setDeliveryInquiry(null)
    setMessage('')
    setStatus('idle')

    if (closeChat) setIsOpen(false)
  }

  useEffect(() => {
    if (!isOpen) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [chatMessages, isOpen])

  useEffect(() => {
    try {
      const messages = chatMessages.filter((chatMessage) => !chatMessage.isWriting).slice(-60)
      window.localStorage.setItem(chatbotConversationStorageKey, JSON.stringify({
        savedAt: Date.now(),
        messages,
        activeWorkflow,
        deliveryInquiry,
      }))
    } catch {
      // La conversación sigue funcionando aunque el navegador bloquee el almacenamiento local.
    }
  }, [activeWorkflow, chatMessages, deliveryInquiry])

  const submitChatbotMessage = async (forcedMessage) => {
    const text = (forcedMessage ?? message).trim()
    if (!text || status === 'loading') return

    const explicitIntent = getChatbotIntent(text)
    const isHumanRequest = explicitIntent === 'human'
    const isCancellation = Boolean(activeWorkflow || deliveryInquiry) && /\b(?:cancelar|cancela|salir|empezar\s+de\s+nuevo)\b/i.test(text)
    const isExplicitWorkflowSwitch = chatbotWorkflowTypes.has(explicitIntent) &&
      explicitIntent !== activeWorkflow?.type &&
      chatbotWorkflowStarterPatterns[explicitIntent]?.test(text)
    const deliveryResponse = !isHumanRequest && !isCancellation && !isExplicitWorkflowSwitch &&
      (isDeliveryInformationRequest(text) || shouldContinueDeliveryInquiry(text, deliveryInquiry))
      ? getDeliveryAssistantResponse(text, deliveryInquiry)
      : null
    setDeliveryInquiry(deliveryResponse?.inquiry ?? null)
    let workflow = isHumanRequest || isCancellation || deliveryResponse
      ? null
      : isExplicitWorkflowSwitch
        ? createChatbotWorkflow(explicitIntent)
        : activeWorkflow || (chatbotWorkflowTypes.has(explicitIntent) ? createChatbotWorkflow(explicitIntent) : null)
    const intent = isHumanRequest ? 'human' : deliveryResponse ? 'question' : workflow?.type || explicitIntent
    let workflowSubmission = ''
    let completedWorkflowData = {}
    let offlineReply = ''
    let workflowResponse = null

    if (isHumanRequest) {
      setActiveWorkflow(null)
    } else if (isCancellation) {
      setActiveWorkflow(null)
      workflowResponse = { text: 'Listo, cancelé el proceso actual. ¿En qué más puedo ayudarte?' }
    } else if (workflow) {
      workflow = updateChatbotWorkflow(workflow, text, chatMessages)
      const nextQuestion = getChatbotWorkflowResponse(workflow)

      if (nextQuestion) {
        setActiveWorkflow(workflow)
        workflowResponse = { text: nextQuestion }
      } else {
        setActiveWorkflow(null)
        workflow = {
          ...workflow,
          data: {
            ...workflow.data,
            requestId: workflow.data.requestId || createChatbotRequestId(workflow.type),
          },
        }
        workflowSubmission = buildChatbotWorkflowSubmission(workflow)
        completedWorkflowData = workflow.data
        offlineReply = 'Ya reuní todos los datos, pero en este momento no pude enviarlos al equipo Naval. La información permanece en esta conversación; intenta enviarla nuevamente más tarde.'
      }
    }

    const currentProduct = findAssistantProduct(text, productAssistantCatalog)
    const recentConversationProduct = currentProduct || getRecentSingleChatbotProduct(chatMessages)
    const contextualProductMessage = currentProduct || !recentConversationProduct
      ? text
      : `${text} ${recentConversationProduct.name}`
    const productRecommendationResponse = intent === 'question' && !workflowResponse
      ? getProductRecommendationResponse(text, productAssistantCatalog)
      : null
    const productInterestClarificationResponse = intent === 'question' && !workflowResponse
      ? getProductInterestClarificationResponse(text, recentConversationProduct)
      : null
    const productAssistantResponse = intent === 'question' && !workflowResponse
      ? getProductAssistantResponse(contextualProductMessage, productAssistantCatalog)
      : null
    const rawLocalAssistantResponse = workflowResponse ||
      (deliveryResponse ? { text: deliveryResponse.text } : null) ||
      productInterestClarificationResponse ||
      productRecommendationResponse ||
      productAssistantResponse ||
      getLocalChatbotResponse(text, intent, [...chatMessages, { from: 'user', text }])
    const localAssistantResponse = hideUnrequestedChatbotActions(rawLocalAssistantResponse, text)
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'conversation_started',
        event_category: 'chatbot',
        intent,
      })
    }
    const writingMessageId = `writing-${Date.now()}`
    const conversationForWebhook = [
      ...chatMessages,
      { from: 'user', text },
    ]

    if (localAssistantResponse) {
      setMessage('')
      setChatMessages((currentMessages) => [
        ...currentMessages,
        { from: 'user', text },
        { from: 'bot', ...localAssistantResponse },
      ])
      setStatus('success')
      return
    }

    setMessage('')
    setStatus('loading')
    setChatMessages((currentMessages) => [
      ...currentMessages,
      { from: 'user', text },
      { id: writingMessageId, from: 'bot', text: 'Escribiendo...', isWriting: true },
    ])

    const abortController = new AbortController()
    const timeoutId = window.setTimeout(() => abortController.abort(), 20000)

    requestAbortControllerRef.current = abortController
    requestTimeoutRef.current = timeoutId

    try {
      const botResponse = await sendToMake(workflowSubmission || text, {
        signal: abortController.signal,
        conversation: conversationForWebhook,
        intent,
        offlineReply,
        workflowData: completedWorkflowData,
      })
      window.clearTimeout(timeoutId)

      if (requestAbortControllerRef.current !== abortController) return

      requestTimeoutRef.current = null
      requestAbortControllerRef.current = null

      setChatMessages((currentMessages) =>
        currentMessages.map((chatMessage) =>
          chatMessage.id === writingMessageId
            ? {
                from: 'bot',
                text: botResponse.reply,
                whatsappUrl: botResponse.whatsappUrl,
              }
            : chatMessage,
        ),
      )
      setStatus('success')
    } catch {
      window.clearTimeout(timeoutId)

      if (requestAbortControllerRef.current !== abortController) return

      requestTimeoutRef.current = null
      requestAbortControllerRef.current = null
      setStatus('error')
      const recoveryText = offlineReply || getChatbotRecoveryResponse(intent, conversationForWebhook)
      const whatsappMessage = buildChatbotWhatsappFallbackMessage(intent, conversationForWebhook)
      setChatMessages((currentMessages) =>
        currentMessages.map((chatMessage) =>
          chatMessage.id === writingMessageId
            ? {
                from: 'bot',
                text: recoveryText,
                whatsappUrl: intent === 'human'
                  ? `${whatsappHref}?text=${encodeURIComponent(whatsappMessage)}`
                  : '',
              }
            : chatMessage,
        ),
      )
    }
  }

  submitChatbotMessageRef.current = submitChatbotMessage

  useEffect(() => {
    getChatbotSessionId()
  }, [])

  useEffect(() => {
    const openChatbot = (event) => {
      const incomingMessage = event.detail?.message || window.__navalPendingChatbotMessage

      setIsOpen(true)

      if (typeof incomingMessage === 'string' && incomingMessage.trim()) {
        window.__navalPendingChatbotMessage = ''
        const messageToSend = incomingMessage.trim()

        window.setTimeout(() => {
          submitChatbotMessageRef.current?.(messageToSend)
        }, 150)
      }
    }
    const resetChatbot = () => resetChatbotConversation()

    window.addEventListener('naval:open-chatbot', openChatbot)
    window.addEventListener('naval:reset-chatbot', resetChatbot)

    return () => {
      window.removeEventListener('naval:open-chatbot', openChatbot)
      window.removeEventListener('naval:reset-chatbot', resetChatbot)
    }
  }, [])

  return (
    <div className={isOpen ? 'floating-chatbot is-open' : 'floating-chatbot'}>
      {isOpen ? (
        <section className="floating-chatbot__panel" aria-label="Chatbot Naval">
          <div className="floating-chatbot__header">
            <div>
              <span>ASISTENTE NAVAL</span>
              <strong>Productos, soporte y asesoría comercial</strong>
            </div>
            <button type="button" onClick={() => resetChatbotConversation()} aria-label="Nueva conversación" title="Nueva conversación">
              +
            </button>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Cerrar chatbot">
              ×
            </button>
          </div>

          <div className="floating-chatbot__messages" aria-live="polite">
            {chatMessages.map((chatMessage, index) => (
              <div
                key={`${chatMessage.from}-${index}-${chatMessage.text}`}
                className={[
                  'floating-chatbot__message',
                  chatMessage.from === 'user' ? 'is-user' : '',
                  chatMessage.isWriting ? 'is-writing' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <ChatbotMessageContent text={chatMessage.text} />
                {chatMessage.actions?.length ? (
                  <div className="floating-chatbot__message-actions">
                    {chatMessage.actions.map((action) => action.message ? (
                      <button
                        key={`${action.label}-${action.message}`}
                        type="button"
                        onClick={() => submitChatbotMessage(action.message)}
                        data-event="chatbot_choice"
                      >
                        {action.label}
                      </button>
                    ) : (
                      <a
                        key={`${action.label}-${action.href}`}
                        href={action.href}
                        target={action.external ? '_blank' : undefined}
                        rel={action.external ? 'noreferrer' : undefined}
                        data-event="chatbot_navigation"
                        data-destination={action.href}
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>
                ) : null}
                {chatMessage.whatsappUrl ? (
                  <a
                    className="floating-chatbot__fallback"
                    href={chatMessage.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-event="click_whatsapp"
                    data-source="chatbot_handoff"
                  >
                    <svg className="floating-chatbot__whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2a9.7 9.7 0 0 0-8.24 14.82L2.5 21.5l4.8-1.25A9.7 9.7 0 1 0 12 2Zm0 17.4a7.65 7.65 0 0 1-3.9-1.06l-.28-.17-2.85.74.76-2.77-.18-.29A7.7 7.7 0 1 1 12 19.4Zm4.22-5.75c-.23-.12-1.36-.67-1.57-.75-.21-.07-.36-.11-.51.12-.15.23-.59.75-.72.9-.13.16-.27.18-.5.06-.23-.11-.97-.36-1.85-1.14a6.94 6.94 0 0 1-1.28-1.59c-.13-.23-.01-.35.1-.47.1-.1.23-.27.34-.4.12-.13.16-.23.23-.38.08-.16.04-.29-.02-.4-.05-.12-.5-1.25-.7-1.7-.18-.45-.37-.39-.51-.4h-.44c-.16 0-.4.06-.62.29-.21.23-.8.8-.8 1.95 0 1.14.82 2.25.94 2.4.11.16 1.63 2.52 3.94 3.53.55.24.98.38 1.31.49.55.17 1.05.15 1.45.09.44-.07 1.36-.56 1.55-1.1.2-.55.2-1.02.14-1.11-.06-.1-.21-.16-.44-.28Z" />
                    </svg>
                    Continuar por WhatsApp
                  </a>
                ) : null}
              </div>
            ))}
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>

          {!hasUserMessages ? (
            <div className="floating-chatbot__quick-actions" aria-label="Acciones rápidas">
              {chatbotQuickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  data-event="conversation_started"
                  data-source="chatbot_quick_action"
                  onClick={() => submitChatbotMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}

          <form
            className="floating-chatbot__form"
            data-event="submit_chatbot_message"
            onSubmit={(event) => {
              event.preventDefault()
              submitChatbotMessage()
            }}
          >
            <label htmlFor="naval-chatbot-message" className="sr-only">
              Escribe tu mensaje
            </label>
	            <textarea
	              id="naval-chatbot-message"
	              value={message}
	              onChange={(event) => setMessage(event.target.value)}
	              onKeyDown={(event) => {
	                if (event.key === 'Enter' && !event.shiftKey) {
	                  event.preventDefault()
	                  submitChatbotMessage()
	                }
	              }}
	              placeholder="Escribe tu pregunta, pedido o queja..."
	              rows="3"
	            />
            <button type="submit" data-event="conversation_started" disabled={!message.trim() || status === 'loading'}>
              {status === 'loading' ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="floating-chatbot__trigger"
        data-event={isOpen ? 'close_chatbot' : 'open_chatbot'}
        aria-label={isOpen ? 'Cerrar chatbot Naval' : 'Abrir chatbot Naval'}
        aria-expanded={isOpen}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false)
            return
          }

          window.dataLayer = window.dataLayer || []
          window.dataLayer.push({ event: 'open_chatbot', event_category: 'chatbot' })
          setIsOpen(true)
        }}
      >
        {isOpen ? (
          <span className="floating-chatbot__close" aria-hidden="true">×</span>
        ) : (
          <>
            <span className="floating-chatbot__label">¿Necesitas asesoría?</span>
            <svg className="floating-chatbot__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 4h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-7.4l-4.8 3.2c-.74.49-1.8-.04-1.8-.93V18A3 3 0 0 1 2 15V7a3 3 0 0 1 3-3Zm0 2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2v2.4L11 16h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5Zm2.5 4.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm4.5 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm4.5 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
            </svg>
          </>
        )}
      </button>
    </div>
  )
}

function FooterItemLabel({ label }) {
  if (!label.includes('@')) return label

  const [localPart, domain] = label.split('@')

  return (
    <>
      {localPart}@
      <br />
      {domain}
    </>
  )
}

function SharedFooter({ footerSection }) {
  return (
    <footer className="about-footer">
      <div className="about-footer__brand-block">
        <img src={brandImage} alt="Naval" className="about-footer__brand-image" loading="lazy" decoding="async" />
        <div className="about-footer__socials" aria-label="Redes sociales">
          <a href="#" aria-label="LinkedIn" className="about-footer__social-link">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A2.02 2.02 0 0 0 3.2 5.03c0 1.11.9 2.02 2.02 2.02a2.02 2.02 0 1 0 .03-4.05ZM20.8 12.8c0-3.46-1.84-5.07-4.3-5.07-1.99 0-2.88 1.1-3.38 1.87V8.5H9.75c.04.73 0 11.5 0 11.5h3.37v-6.42c0-.34.02-.68.13-.92.27-.67.9-1.36 1.95-1.36 1.38 0 1.93 1.02 1.93 2.53V20H20.5v-7.2Z" />
            </svg>
          </a>
          <a href="#" aria-label="Facebook" className="about-footer__social-link">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13.4 20v-6.76h2.27l.34-2.64H13.4V8.92c0-.76.21-1.28 1.3-1.28h1.39V5.28c-.24-.03-1.07-.1-2.03-.1-2.01 0-3.38 1.23-3.38 3.48v1.94H8.4v2.64h2.28V20h2.72Z" />
            </svg>
          </a>
          <a href="#" aria-label="Instagram" className="about-footer__social-link">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.8 3h8.4A4.8 4.8 0 0 1 21 7.8v8.4a4.8 4.8 0 0 1-4.8 4.8H7.8A4.8 4.8 0 0 1 3 16.2V7.8A4.8 4.8 0 0 1 7.8 3Zm0 1.8A3 3 0 0 0 4.8 7.8v8.4a3 3 0 0 0 3 3h8.4a3 3 0 0 0 3-3V7.8a3 3 0 0 0-3-3H7.8Zm8.85 1.35a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1ZM12 7.35A4.65 4.65 0 1 1 7.35 12 4.66 4.66 0 0 1 12 7.35Zm0 1.8A2.85 2.85 0 1 0 14.85 12 2.85 2.85 0 0 0 12 9.15Z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="about-footer__columns">
        {footerSection.columns.map((column) => (
          <div key={column.title} className="about-footer__column">
            <span className="about-footer__column-title">
              {column.title}
            </span>
            <div className="about-footer__column-items">
              {column.items.map((item) => (
                typeof item === 'string' ? (
                  <span key={item}>{item}</span>
                ) : (
                  <a
                    key={item.label}
                    className={item.label.includes('@') ? 'about-footer__column-link--email' : undefined}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noreferrer' : undefined}
                    data-event={item.href?.startsWith('https://wa.me') ? 'click_whatsapp' : item.href?.startsWith('mailto:') ? 'click_email' : undefined}
                    data-source="footer"
                  >
                    <FooterItemLabel label={item.label} />
                  </a>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  )
}

function LegalPageSections({ page }) {
  return (
    <section className="legal-page" aria-labelledby="legal-page-title">
      <div className="legal-page__header">
        <p className="interior-hero__eyebrow">{page.eyebrow}</p>
        <h1 id="legal-page-title" className="legal-page__title">{page.title}</h1>
        <p>{page.intro}</p>
      </div>

      <div className="legal-page__content">
        {page.legalSections.map((section) => (
          <article key={section.title} className="legal-page__section">
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function CookieConsentBanner() {
  const [consentStatus, setConsentStatus] = useState(() => window.localStorage.getItem(cookieConsentStorageKey))

  const updateConsent = (status) => {
    window.localStorage.setItem(cookieConsentStorageKey, status)
    setConsentStatus(status)
  }

  useEffect(() => {
    if (consentStatus) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [consentStatus])

  if (consentStatus) {
    return null
  }

  return (
    <section className="cookie-consent" role="dialog" aria-modal="true" aria-label="Uso de cookies">
      <div className="cookie-consent__panel">
        <div className="cookie-consent__copy">
          <p className="cookie-consent__eyebrow">Privacidad</p>
          <p>
            <strong>Uso de cookies.</strong> Usamos cookies para mejorar la navegación, recordar preferencias y entender cómo se consulta el catálogo NAVAL.
            Para continuar, elige una opción.
          </p>
        </div>
        <div className="cookie-consent__actions" aria-label="Opciones de cookies">
          <button type="button" className="cookie-consent__button cookie-consent__button--ghost" onClick={() => updateConsent('rejected')}>
            Rechazar
          </button>
          <button type="button" className="cookie-consent__button cookie-consent__button--primary" onClick={() => updateConsent('accepted')}>
            Aceptar cookies
          </button>
        </div>
      </div>
    </section>
  )
}

function ShopPageSections() {
  const shopVideoRef = useReliableHeroVideo({ loop: false, holdLastFrame: true })

  return (
    <section className="shop-hero shop-hero--coming-soon" aria-label="Tienda Hogar Naval en construcción">
      <video
        ref={shopVideoRef}
        className="shop-hero__image shop-hero__image--active"
        src={shopHeroVideo}
        preload="auto"
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        aria-hidden="true"
      />
      <div className="shop-hero__cart-cta shop-hero__cart-cta--coming-soon">
        <div className="shop-hero__text-bubble">
          <p className="shop-hero__cart-kicker">Tienda</p>
          <h1>Tienda Hogar Naval</h1>
          <strong>Próximamente</strong>
          <p className="shop-hero__cart-copy">
            Estamos preparando una experiencia de compra especializada para el hogar.
          </p>
        </div>
        <button className="shop-hero__cart-button" type="button" onClick={openNavalChatbot}>
          Hablar con un asesor
        </button>
      </div>
    </section>
  )
}
function InteriorPage({ pageKey, canonicalKey = pageKey }) {
  const page = pageContent[pageKey]
  const isAboutPage = pageKey === 'quienes-somos'
  const isLinesPage = pageKey === 'lineas'
  const isFaqPage = pageKey === 'preguntas'
  const isShopPage = pageKey === 'pedido'
  const isLegalPage = pageKey === 'politica-tratamiento-datos' || pageKey === 'terminos-condiciones'
  const isProductFamilyPage = pageKey.startsWith('lineas-')
  const isSectorPage = pageKey.startsWith('sectores-')
  const isProductPage = pageKey.startsWith('producto-')
  const showResultsShowcase = pageKey === 'lineas'
  const sharedFooterSection = page.footerSection ?? pageContent['quienes-somos'].footerSection
  const statsRef = useRef(null)
  const aboutHeroVideoRef = useReliableHeroVideo({ loop: false, playbackRate: 1.55, holdLastFrame: true })
  const portfolioHeroVideoRef = useReliableHeroVideo({ loop: false, holdLastFrame: true })
  const [animateStats, setAnimateStats] = useState(false)
  const [isInteriorMobileNavOpen, setIsInteriorMobileNavOpen] = useState(false)
  const structuredData = useMemo(() => {
    const origin = window.location.origin.includes('localhost') ? siteUrl : window.location.origin
    const schema = [
      buildWebPageStructuredData(origin, canonicalKey, page),
      buildBreadcrumbStructuredData(origin, pageKey, page, canonicalKey),
    ]

    if (isLinesPage) {
      schema.push(...buildLineasStructuredData(origin))
    }

    if (isFaqPage) {
      const faqSchema = buildFaqStructuredData(page)
      if (faqSchema) schema.push(faqSchema)
    }

    if (isProductPage) {
      const productSchema = buildProductStructuredData(origin, canonicalKey, page)
      if (productSchema) schema.push(productSchema)
    }

    if (isProductFamilyPage || isSectorPage) {
      schema.push({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: page.seoTitle ?? page.title,
        description: page.seoDescription ?? page.intro,
        url: getCleanPageUrl(origin, canonicalKey),
        inLanguage: 'es-CO',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: getCatalogDisplayItems(
            page.family.products.map((product) => ({ product, family: page.family })),
          ).map(({ product }, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: product.name,
            url: getCleanPageUrl(origin, product.slug),
          })),
        },
      })
    }

    return schema
  }, [canonicalKey, isFaqPage, isLinesPage, isProductFamilyPage, isProductPage, isSectorPage, page, pageKey])

  usePageSeo({
    pageKey: canonicalKey,
    title: page.seoTitle ?? 'Naval | Limpieza Profesional B2B',
    description: page.seoDescription ?? page.intro,
    keywords: page.seoKeywords || defaultSeoKeywords,
    structuredData,
    image: page.heroImage || page.product?.image || page.family?.image || brandImage,
    noIndex: page.noIndex,
  })

  const scrollToLineasSectors = (event) => {
    event.preventDefault()
    document.getElementById('sectores-soluciones')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const scrollToProductLines = (event) => {
    event.preventDefault()
    document.getElementById('lineas-producto')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  useEffect(() => {
    if (!isAboutPage || !statsRef.current || animateStats) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return
        }

        setAnimateStats(true)
        observer.disconnect()
      },
      {
        threshold: 0.35,
      },
    )

    observer.observe(statsRef.current)

    return () => observer.disconnect()
  }, [animateStats, isAboutPage])

  return (
    <main
      className={`interior-page ${isAboutPage ? 'interior-page--about' : 'interior-page--flat'} ${isLinesPage ? 'interior-page--lineas' : ''} ${isFaqPage ? 'interior-page--faq' : ''} ${isShopPage ? 'interior-page--shop' : ''} ${isProductPage ? 'interior-page--product' : ''}`}
    >
      <div className="interior-page__backdrop" />
      <header className={`interior-header interior-header--about ${isInteriorMobileNavOpen ? 'is-mobile-nav-open' : ''}`}>
        <button
          type="button"
          className="interior-header__menu-button"
          aria-label={isInteriorMobileNavOpen ? 'Cerrar navegación' : 'Abrir navegación'}
          aria-expanded={isInteriorMobileNavOpen}
          aria-controls="interior-mobile-nav"
          onClick={() => setIsInteriorMobileNavOpen((isOpen) => !isOpen)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <nav
          id="interior-mobile-nav"
          className="interior-mini-nav interior-mini-nav--about"
          aria-label="Navegacion de secciones"
        >
          <div className="interior-mini-nav__links">
            {actions.map((action) => {
              const actionKey = action.key
              const isActive =
                actionKey === pageKey ||
                (actionKey === 'lineas' && (isLinesPage || isProductFamilyPage || isSectorPage || isProductPage))

              return (
                <a
                  key={action.title}
                  href={action.href}
                  className={`interior-mini-nav__link ${isActive ? 'interior-mini-nav__link--active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setIsInteriorMobileNavOpen(false)}
                >
                  {action.title}
                </a>
              )
            })}
          </div>
        </nav>
        <a
          href="/"
          className="interior-header__brand-link interior-header__brand-link--about"
          aria-label="Ir al inicio de Naval"
        >
          <img src={brandImage} alt="Naval" className="interior-header__brand" decoding="async" />
        </a>
      </header>

      {isAboutPage ? (
        <section className="interior-about-hero" aria-labelledby="quienes-somos-title">
          <div className="interior-about-hero__frame">
            <video
              ref={aboutHeroVideoRef}
              className="interior-about-hero__video"
              src={aboutHeroVideoSrc}
              preload="auto"
              autoPlay
              muted
              playsInline
              webkit-playsinline="true"
              x5-playsinline="true"
              disablePictureInPicture
              controlsList="nodownload noplaybackrate noremoteplayback"
              onLoadedMetadata={(event) => {
                event.currentTarget.muted = true
                event.currentTarget.defaultMuted = true
                event.currentTarget.loop = false
                event.currentTarget.playbackRate = 1.55
                event.currentTarget.play().catch(() => {})
              }}
              onEnded={(event) => {
                event.currentTarget.pause()
              }}
              aria-hidden="true"
            />
            <div className="interior-about-hero__overlay">
              <div className="interior-about-hero__content">
                <p className="interior-about-hero__kicker">{page.eyebrow}</p>
                <h1 id="quienes-somos-title" className="interior-about-hero__title">
                  <span className="interior-about-hero__title-primary">{page.heroTitlePrimary ?? page.title}</span>
                  <span className="interior-about-hero__title-secondary">{page.heroTitleSecondary ?? ''}</span>
                </h1>
                <p className="interior-about-hero__subtitle">{page.seoIntro ?? page.intro}</p>
                <div className="interior-about-hero__actions" aria-label="Accesos rápidos Naval">
                  <a href={getPagePath('lineas-todos')} className="interior-about-hero__cta">
                    Ver productos
                  </a>
                  <a href="#lineas-capacitaciones" className="interior-about-hero__cta interior-about-hero__cta--secondary">
                    Capacitaciones
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : isProductPage || isProductFamilyPage || isSectorPage || isFaqPage || isShopPage || isLegalPage ? null : isLinesPage ? (
        <section
          className={`interior-showcase interior-showcase--simple ${isLinesPage ? 'interior-showcase--portfolio' : ''}`}
        >
          <video
            ref={portfolioHeroVideoRef}
            className="portfolio-hero-video"
            src={productHeroVideo}
            preload="auto"
            autoPlay
            muted
            playsInline
            webkit-playsinline="true"
            x5-playsinline="true"
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
            aria-hidden="true"
          />
          <article className="interior-showcase__hero interior-showcase__hero--simple">
            {isLinesPage ? (
              <>
                <p className="interior-hero__eyebrow">{page.eyebrow}</p>
                <h1 className="portfolio-hero-title">{page.heroTitle}</h1>
                <div className="portfolio-hero-links" aria-label="Explorar soluciones del catálogo">
                  <div className="portfolio-hero-links__actions">
                    <a href="#sectores-soluciones" onClick={scrollToLineasSectors}>
                      Por sectores
                    </a>
                    <a href="#lineas-producto" onClick={scrollToProductLines}>
                      Líneas de producto
                    </a>
                    <a href="#lineas-capacitaciones">
                      Capacitaciones
                    </a>
                    <a href={getPagePath('lineas-todos')}>
                      Ver catálogo
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1>{page.title}</h1>
                <p className="interior-hero__intro">{page.intro}</p>
              </>
            )}
            {isLinesPage ? (
              <div className="portfolio-hero-benefits" aria-label="Beneficios del portafolio Naval">
                <span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 4c-7.2.3-12.5 3.4-14.8 8.6C3.8 15.8 4 19.1 4 20c.9 0 4.2.2 7.4-1.2C16.6 16.5 19.7 11.2 20 4Z" />
                    <path d="M4 20c3.2-5.4 7.1-8.9 11.7-10.5" />
                  </svg>
                  Productos biodegradables
                </span>
                <span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3 5 6v5.3c0 4.4 2.9 7.7 7 9.7 4.1-2 7-5.3 7-9.7V6l-7-3Z" />
                    <path d="m9 12 2 2 4-5" />
                  </svg>
                  Máxima eficacia
                </span>
                <span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3v4" />
                    <path d="M12 17v4" />
                    <path d="M3 12h4" />
                    <path d="M17 12h4" />
                    <path d="m5.6 5.6 2.8 2.8" />
                    <path d="m15.6 15.6 2.8 2.8" />
                    <path d="m18.4 5.6-2.8 2.8" />
                    <path d="m8.4 15.6-2.8 2.8" />
                  </svg>
                  Superficies impecables
                </span>
                <span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 11c-1.4-1.5-1.4-3.8 0-5.2 1.5-1.5 3.8-1.2 5 .7 1.2-1.9 3.5-2.2 5-.7 1.4 1.4 1.4 3.7 0 5.2l-5 5-5-5Z" />
                    <path d="M4 14v5" />
                    <path d="M20 14v5" />
                    <path d="M8 19h8" />
                  </svg>
                  Cuidado en cada aplicación
                </span>
              </div>
            ) : null}
            {isProductFamilyPage ? (
              <div className="interior-showcase__actions interior-showcase__actions--simple">
                <a href="/productos" className="interior-button interior-button--ghost">
                  Volver a líneas de producto
                </a>
              </div>
            ) : null}
          </article>
        </section>
      ) : (
        <section className="interior-showcase">
          <article className="interior-showcase__hero">
            {page.heroImage ? (
              <div className="interior-showcase__media">
                <img src={page.heroImage} alt={page.heroImageAlt ?? page.title} className="interior-showcase__media-image" decoding="async" />
              </div>
            ) : null}
            <p className="interior-hero__eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p className="interior-hero__intro">{page.intro}</p>
            <div className="interior-showcase__actions">
              <a href="#detalle" className="interior-button interior-button--primary">
                Ver estructura
              </a>
              <a href="/" className="interior-button interior-button--ghost">
                Volver al inicio
              </a>
            </div>
          </article>

          <aside className="interior-showcase__visual">
            <div className="interior-showcase__panel">
              <p className="interior-showcase__tag">{page.featureTag}</p>
              <h2>{page.featureTitle}</h2>
              <p>{page.featureText}</p>
            </div>

            <div className="interior-showcase__mini-grid">
              {page.highlights.map((item) => (
                <article key={item.title} className="interior-mini-card">
                  <p>{item.eyebrow}</p>
                  <h3>{item.title}</h3>
                  <span>{item.text}</span>
                </article>
              ))}
            </div>
          </aside>
        </section>
      )}

      {!isLinesPage && !isProductFamilyPage && !isSectorPage && !isProductPage && !isFaqPage && !isShopPage && !isLegalPage ? (
        <section ref={statsRef} className="interior-stats">
          {page.metrics.map((metric) => (
            <article key={metric.label} className="interior-stat">
              <strong>
                {metric.value.startsWith('+') ? (
                  <>
                    <span className="interior-stat__prefix">+</span>
                    <AnimatedMetricValue value={metric.value} animate={animateStats} />
                  </>
                ) : (
                  <AnimatedMetricValue value={metric.value} animate={animateStats} />
                )}
              </strong>
              <span>{metric.label}</span>
              {metric.description ? <p>{metric.description}</p> : null}
            </article>
          ))}
        </section>
      ) : null}

      {isAboutPage ? (
        <AboutPageSections page={page} />
      ) : isLegalPage ? (
        <LegalPageSections page={page} />
      ) : pageKey === 'lineas' ? (
        <>
          <ProductLinesPageSections page={page} />
          {showResultsShowcase ? (
            <TrainingSection
              trainingSection={pageContent.preguntas.trainingSection}
              sectionId="lineas-capacitaciones"
              titleId="lineas-training-title"
            />
          ) : null}
        </>
      ) : isFaqPage ? (
        <FaqPageSections page={page} />
      ) : isShopPage ? (
        <ShopPageSections page={page} />
      ) : isProductFamilyPage || isSectorPage ? (
        <ProductFamilyFullSections page={page} />
      ) : isProductPage ? (
        <ProductRouteSections page={page} />
      ) : (
        <>
          <section className="interior-story" id="detalle">
            <article className="interior-story__content">
              <p className="interior-hero__eyebrow">Lectura de página</p>
              <h2>Una composición más editorial, limpia y enfocada en comunicar mejor.</h2>
              <p>
                Esta estructura mezcla jerarquía visual, bloques de confianza y contenido modular para que Naval se sienta
                más contemporánea, mejor presentada y lista para vender con más fuerza.
              </p>
              <ul className="interior-checklist">
                {page.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <aside className="interior-story__aside">
              <div className="interior-story__card interior-story__card--soft">
                <p>Enfoque</p>
                <h3>Marca, orden y claridad comercial</h3>
                <span>Una presentación sobria con lenguaje B2B y composición más premium.</span>
              </div>
              <div className="interior-story__card interior-story__card--accent">
                <p>Resultado</p>
                <h3>Más lectura, más intención, mejor percepción</h3>
                <span>El contenido queda listo para escalar a catálogo, presentación o canal de ventas.</span>
              </div>
            </aside>
          </section>

          <section className="interior-grid">
            {page.sections.map((section) => (
              <article key={section.title} className="interior-card">
                <p className="interior-card__eyebrow">{page.eyebrow}</p>
                <h3>{section.title}</h3>
                <p>{section.text}</p>
              </article>
            ))}
          </section>

          {showResultsShowcase ? <ResultsShowcaseSection /> : null}

          <section className="interior-cta">
            <div className="interior-cta__content">
              <p className="interior-hero__eyebrow">Naval B2B</p>
              <h2>Una experiencia visual y comercial pensada para vender mejor.</h2>
              <span>Una base clara para presentar marca, líneas, preguntas clave y rutas de contacto.</span>
            </div>
            <a href="/" className="interior-cta__link">
              Regresar al hero
            </a>
          </section>
        </>
      )}

      <SharedFooter footerSection={sharedFooterSection} />
    </main>
  )
}

export default function App() {
  const route = useHashRoute()
  const activeRoute = route === 'lineas-capacitaciones' ? 'lineas' : resolveRouteKey(route)
  const routedPageExists = Boolean(activeRoute && pageContent[activeRoute])
  const activePageKey = routedPageExists ? activeRoute : 'quienes-somos'
  const activeCanonicalKey = activePageKey

  useEffect(() => {
    if (route === 'lineas-capacitaciones') {
      const scrollToTraining = () => {
        document.getElementById('lineas-capacitaciones')?.scrollIntoView({ behavior: 'auto', block: 'start' })
      }

      window.requestAnimationFrame(scrollToTraining)
      const timeoutIds = [200, 700, 1400, 2400].map((delay) => window.setTimeout(scrollToTraining, delay))
      return () => timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [activePageKey, route])

  return (
    <>
      <InteriorPage pageKey={activePageKey} canonicalKey={activeCanonicalKey} />
      <CookieConsentBanner />
      <FloatingChatbot />
    </>
  )
}
