<p align="center"><img src="docs/naval-brand-header.svg" alt="NAVAL" width="420"></p>

<h1 align="center">NAVAL — Business Digital Ecosystem</h1>
<p align="center"><strong>B2B product platform · AI commercial assistant · technical content · workflow automation</strong></p>
<p align="center"><a href="https://www.productosnaval.com/"><strong>Live website</strong></a> · <a href="https://www.diegofrancoe.com/proyectos/naval"><strong>Case study</strong></a></p>

NAVAL helps institutional and business customers discover professional-cleaning products, review technical information, prepare quote requests and interact with a commercial assistant. The operational ERP is developed separately and remains private.

| Product catalog | AI commercial assistant | Technical documents | Workflow automation |
|---|---|---|---|
| Families, products and presentations | Guided commercial conversations | Public technical and safety files | Make + serverless integrations |

### Tech stack
![React](https://img.shields.io/badge/React-20232A?logo=react) ![Vite](https://img.shields.io/badge/Vite-20232A?logo=vite) ![OpenAI](https://img.shields.io/badge/OpenAI-20232A?logo=openai) ![Make](https://img.shields.io/badge/Make-20232A?logo=make) ![Vercel](https://img.shields.io/badge/Vercel-20232A?logo=vercel)

### Architecture
~~~mermaid
flowchart LR
 C[Customer] --> W[React + Vite]
 W --> CAT[Catalog]
 W --> CHAT[Commercial assistant]
 CHAT --> K[Product knowledge]
 CHAT --> API[Serverless API]
 API --> M[Make]
 API --> O[OpenAI fallback]
 ERP[Private ERP] -. separate .-> W
~~~

<details><summary><strong>Run locally & repository structure</strong></summary>

~~~bash
npm install
cp .env.example .env.local
npm run dev
~~~

~~~text
src/        UI, catalog, product data and assistant
api/        Serverless integration boundary
public/     Technical documents, SEO and assets
scripts/    Sitemap and automation utilities
~~~

Make and OpenAI credentials remain server-side and are not stored in the repository.
</details>

<p align="center"><strong>Production:</strong> https://www.productosnaval.com/</p>
