<p align="center"><a href="https://www.productosnaval.com/"><img src="docs/readme-hero.svg" alt="NAVAL B2B platform overview" width="100%"></a></p>

NAVAL is a B2B digital platform for a professional cleaning-products company. It combines product discovery, technical documentation, commercial intake and an AI-assisted conversational layer in one public experience.

The project is designed as the customer-facing side of a broader business ecosystem. The website remains independent from the private ERP, while server-side integrations connect the commercial assistant to product context, OpenAI and workflow automation without exposing internal credentials in the browser.

### Core stack
![React](https://img.shields.io/badge/React-252824?style=flat-square&logo=react&logoColor=74CDA7) ![Vite](https://img.shields.io/badge/Vite-252824?style=flat-square&logo=vite&logoColor=74CDA7) ![OpenAI](https://img.shields.io/badge/OpenAI-252824?style=flat-square&logo=openai&logoColor=74CDA7) ![Make](https://img.shields.io/badge/Make-252824?style=flat-square&logo=make&logoColor=74CDA7) ![Vercel](https://img.shields.io/badge/Vercel-252824?style=flat-square&logo=vercel&logoColor=74CDA7)

### What this project demonstrates

- B2B product catalog and technical-content UX
- AI-assisted commercial conversations
- Product-context grounding for customer questions
- Serverless API boundary for external AI and automation services
- Quote-oriented conversational workflows
- SEO and sitemap generation for a structured product catalog
- Separation between a public commercial platform and a private ERP

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

The public site handles discovery and commercial interaction, while sensitive services stay behind the serverless boundary. The assistant can use product knowledge and structured conversational flows to guide customers toward useful answers or quotation requests.

The ERP is intentionally not embedded into the public application. It remains a separate private operational system, currently under development, which allows the website to evolve independently from internal production, purchasing, inventory and finance workflows.

### Technical highlights

**AI assistant.** The conversational layer is designed around product and commercial context rather than a generic chatbot experience. Customer questions can be guided through domain-specific information and escalation paths.

**Server-side integrations.** OpenAI and Make calls are routed through serverless endpoints. API credentials remain outside the client bundle and are not committed to the repository.

**Catalog and technical documents.** Product data and supporting technical content are organized as part of the public experience so the assistant and the UI can point users toward the same commercial knowledge.

**Search and deployment.** The build process generates sitemap data before the production bundle is created, helping maintain discoverability as catalog content grows.

<details><summary><strong>Run locally & repository structure</strong></summary>

~~~bash
npm install
cp .env.example .env.local
npm run dev
~~~

~~~text
src/        UI, catalog, product data and commercial assistant
api/        Serverless integration boundary
public/     Technical documents, SEO assets and public media
scripts/    Sitemap and automation utilities
~~~

Make and OpenAI credentials remain server-side and are not stored in the repository.
</details>

<p align="center"><strong>Production:</strong> https://www.productosnaval.com/</p>
