<p align="center"><img src="docs/naval-brand-header.svg" alt="NAVAL" width="100%"></p>

# NAVAL — B2B Web Platform

**Product discovery · commercial assistant · technical content · workflow automation**

[Live website](https://www.productosnaval.com/) · [Case study](https://www.diegofrancoe.com/proyectos/naval)

NAVAL is the public B2B platform for Productos Naval. It helps institutional and business customers discover professional-cleaning products, review technical information, prepare quote requests and interact with a commercial assistant. The operational ERP is developed separately and remains private.

## Highlights

- Responsive corporate and B2B product experience.
- Catalog with product families, presentations, images and technical documents.
- Product and sector pages with SEO metadata and generated sitemap.
- Quote-oriented cart and commercial forms; no direct payment processing.
- Commercial chatbot with conversation context and guided flows.
- Product knowledge for recommendations, uses, presentations and documentation.
- Serverless API boundary for Make and OpenAI integrations.
- Graceful local fallback when external automation is unavailable.

## Architecture

~~~mermaid
flowchart LR
 C[Customer] --> W[React + Vite website]
 W --> CAT[Product catalog]
 W --> CHAT[Commercial assistant]
 CHAT --> K[Product knowledge]
 CHAT --> API[Serverless API]
 API --> M[Make automation]
 API --> O[OpenAI fallback]
 M --> N[Commercial workflows]
 ERP[Private NAVAL ERP] -. separate system .-> W
~~~

## Stack

React 19 · Vite 7 · JavaScript / JSX · CSS · Vercel Functions · Make · OpenAI Responses API · Vercel

## Run locally

~~~bash
npm install
cp .env.example .env.local
npm run dev
~~~

Make and OpenAI credentials remain server-side and are configured outside the repository.

## Project structure

~~~text
src/        UI, catalog, product data and assistant
api/        Serverless integration boundary
public/     Technical documents, SEO and public assets
scripts/    Sitemap and automation utilities
~~~

**Production:** https://www.productosnaval.com/

Built by **Diego Franco**.
