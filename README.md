<p align="center"><a href="https://www.productosnaval.com/"><img src="docs/readme-hero.svg" alt="Project overview" width="100%"></a></p>

NAVAL connects a public B2B product platform with a commercial assistant and workflow automation. Customers can explore products and technical documentation, prepare quote requests and use guided conversational flows, while server-side integrations keep Make and OpenAI credentials outside the browser. The operational ERP remains a separate private system currently under development.

### Core stack
![React](https://img.shields.io/badge/React-252824?style=flat-square&logo=react&logoColor=74CDA7) ![Vite](https://img.shields.io/badge/Vite-252824?style=flat-square&logo=vite&logoColor=74CDA7) ![OpenAI](https://img.shields.io/badge/OpenAI-252824?style=flat-square&logo=openai&logoColor=74CDA7) ![Make](https://img.shields.io/badge/Make-252824?style=flat-square&logo=make&logoColor=74CDA7) ![Vercel](https://img.shields.io/badge/Vercel-252824?style=flat-square&logo=vercel&logoColor=74CDA7)

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
