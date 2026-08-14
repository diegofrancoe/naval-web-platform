import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const siteUrl = 'https://www.productosnaval.com'

const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const staticRoutes = [
  '',
  'productos',
  'productos/todos',
  'preguntas-frecuentes',
  'tienda',
  'productos/limpieza-general',
  'productos/pisos-y-superficies',
  'productos/lavanderia',
  'productos/higiene-y-desinfeccion',
  'productos/desengrasantes',
  'productos/detergentes',
  'productos/limpiavidrios',
  'productos/ceras',
]

const sectors = [
  'hoteles',
  'colegios',
  'cocinas',
  'lavanderia',
  'conjuntos-residenciales',
  'gimnasios',
  'restaurantes',
]

const products = [
  'Detergente Multicocina',
  'Detergente Limpiador Multiusos',
  'Desengrasante',
  'Jabón Líquido Avena',
  'Jabón Líquido Manzana',
  'Jabón Líquido Sin Fragancia',
  'Jabón Líquido Canela',
  'Des-Oxi Desincrustante',
  'Limpia Vidrios',
  'Ambientador Limón',
  'Ambientador Lavanda',
  'Ambientador Canela',
  'Ambientador Tutti Frutti',
  'Ambientador Mar Fresco',
  'Ambientador Floral',
  'Shampoo de Alfombras',
  'Biovarsol',
  'Multipropósito K',
  'Detergente Navazul',
  'Suavizante Textil',
  'Blanqueador Oxigenado Activo',
  'Limpiador Desinfectante',
  'Neutralizador de Olores',
  'Blanqueador 2.7% y 3.7%',
  'Blanqueador 5.25%',
  'Hipoclorito 13%',
  'Hipoclorito 15%',
  'Alcohol Industrial 70%',
  'Alcohol Etílico 96%',
  'Creolina',
  'Removedor de Ceras',
  'Cera Polimérica',
  'Cera Brillo',
  'Cera Emulsionada',
  'Limpiabrillo',
  'Sellador de Superficies',
  'Lustrador de Acero Inoxidable',
  'Lustra Muebles',
  'Silicona',
  'Varsol',
]

const routes = [
  ...staticRoutes,
  ...sectors.map((sector) => `sectores/${sector}`),
  ...products.map((product) => `producto-${slugify(product)}`),
]

const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Bogota',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date())
const urls = routes
  .map((route) => {
    const loc = route ? `${siteUrl}/${route}` : `${siteUrl}/`
    const priority = route === '' ? '1.0' : route.startsWith('producto-') ? '0.8' : '0.7'

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
  })
  .join('\n')

mkdirSync(resolve(rootDir, 'public'), { recursive: true })
writeFileSync(
  resolve(rootDir, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
)
