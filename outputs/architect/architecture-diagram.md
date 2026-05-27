# Diagramas de Arquitetura — Credentials Vault

**Projeto:** Gerenciador de Credenciais Pessoal  
**Data:** 2026-05-26  
**Agente:** Arquiteto de Software  
**Versão:** 1.0

---

## 1. Visão Geral

Sistema **monolítico fullstack** baseado em Next.js App Router, com API Routes como camada de backend, Prisma ORM para persistência e Chakra UI v3 no frontend. Projetado para **single-user** (sem multi-tenancy), com foco em segurança, simplicidade operacional e baixo custo de infraestrutura.

### Características arquiteturais

| Aspecto | Decisão |
|---------|---------|
| Estilo | Monolito modular (Next.js fullstack) |
| Usuários | Single-user (vault singleton) |
| Deploy | Single container / Vercel / VPS |
| Banco | SQLite (dev) / PostgreSQL (prod) |
| Auth | Senha mestra + sessão httpOnly |
| Criptografia | AES-256-GCM em repouso |

---

## 2. Diagrama de Contexto (C4 — Level 1)

```mermaid
C4Context
    title Contexto do Sistema — Credentials Vault

    Person(user, "Usuário", "Único usuário do vault pessoal")

    System(vault, "Credentials Vault", "Web app para armazenar e recuperar credenciais de login")

    System_Ext(favicon, "Google Favicon API", "Ícones de apps")
    System_Ext(browser, "Browser", "Chrome, Firefox, Safari, Edge")

    Rel(user, vault, "Gerencia credenciais via")
    Rel(vault, browser, "Executa em")
    Rel(vault, favicon, "Busca ícones", "HTTPS")
```

---

## 3. Diagrama de Containers (C4 — Level 2)

```mermaid
C4Container
    title Containers — Credentials Vault

    Person(user, "Usuário")

    Container_Boundary(nextjs, "Next.js Application") {
        Container(web, "Web App", "React + Chakra UI v3", "UI responsiva, PWA")
        Container(api, "API Routes", "Next.js Route Handlers", "REST JSON endpoints")
        Container(services, "Service Layer", "TypeScript", "Lógica de negócio, crypto")
    }

    ContainerDb(db, "Database", "SQLite / PostgreSQL", "Credenciais criptografadas, config")
    Container_Ext(favicon, "Favicon API", "Google", "Logos de apps")

    Rel(user, web, "HTTPS")
    Rel(web, api, "fetch / Server Actions", "JSON")
    Rel(api, services, "Chama")
    Rel(services, db, "Prisma ORM")
    Rel(services, favicon, "HTTP GET")
```

---

## 4. Diagrama de Componentes (C4 — Level 3)

```mermaid
flowchart TB
    subgraph Client["Client (Browser)"]
        Pages["App Router Pages"]
        Components["UI Components"]
        Hooks["Custom Hooks"]
        PWA["Service Worker"]
    end

    subgraph Server["Next.js Server"]
        Middleware["Middleware (auth guard)"]
        API["API Route Handlers"]
        
        subgraph Services["Services"]
            AuthSvc["AuthService"]
            VaultSvc["VaultService"]
            CredSvc["CredentialService"]
            CryptoSvc["CryptoService"]
            HealthSvc["HealthService"]
            ExportSvc["ExportImportService"]
        end
        
        subgraph Repos["Repositories"]
            Prisma["Prisma Client"]
        end
    end

    subgraph External["External"]
        DB[(Database)]
        FaviconAPI["Favicon API"]
    end

    Pages --> Components
    Components --> Hooks
    Hooks --> API
    PWA --> API
    Middleware --> Pages
    Middleware --> API
    API --> AuthSvc
    API --> VaultSvc
    API --> CredSvc
    API --> HealthSvc
    API --> ExportSvc
    AuthSvc --> CryptoSvc
    CredSvc --> CryptoSvc
    ExportSvc --> CryptoSvc
    AuthSvc --> Prisma
    VaultSvc --> Prisma
    CredSvc --> Prisma
    HealthSvc --> Prisma
    ExportSvc --> Prisma
    Prisma --> DB
    CredSvc --> FaviconAPI
```

---

## 5. Fluxo de Dados — Autenticação

```mermaid
sequenceDiagram
    participant U as Usuário
    participant W as Web App
    participant M as Middleware
    participant A as /api/auth/login
    participant AS as AuthService
    participant C as CryptoService
    participant DB as Database

    U->>W: POST senha mestra
    W->>A: { password }
    A->>AS: login(password)
    AS->>DB: get VaultConfig.masterPasswordHash
    AS->>C: verify(password, hash)
    C-->>AS: valid ✓
    AS->>C: deriveKey(password) → vaultKey
    AS->>AS: createSession(vaultKey ref)
    AS-->>A: session token
    A-->>W: Set-Cookie httpOnly + 200
    W-->>U: Redirect /dashboard

    Note over U,DB: Próximas requests incluem cookie de sessão

    U->>W: GET /api/credentials
    W->>M: Request + cookie
    M->>M: validate session
    M->>A: authorized request
    A->>DB: fetch encrypted credentials
    A->>C: decrypt(fields, vaultKey)
    A-->>W: JSON credentials (plaintext in transit over HTTPS)
```

---

## 6. Fluxo de Dados — CRUD Credencial

```mermaid
sequenceDiagram
    participant U as Usuário
    participant W as Web App
    participant A as /api/credentials
    participant CS as CredentialService
    participant CR as CryptoService
    participant DB as Database

    U->>W: Criar credencial (form)
    W->>A: POST { appName, username, email, password }
    A->>A: validate session + Zod schema
    A->>CS: create(dto)
    CS->>CS: calculatePasswordStrength()
    CS->>CR: encrypt(password, vaultKey)
    CS->>DB: prisma.credential.create()
    CS-->>A: credential (decrypted for response)
    A-->>W: 201 Created
    W-->>U: Toast + card render

    U->>W: Buscar "youtube"
    W->>A: GET /api/credentials?search=youtube
    A->>CS: search(query)
    CS->>DB: prisma findMany (appName, username, email contains)
    CS->>CR: decrypt batch
    CS-->>A: filtered results
    A-->>W: 200 JSON array
```

---

## 7. Arquitetura de Segurança

```mermaid
flowchart LR
    subgraph Layers["Camadas de Segurança"]
        L1["HTTPS/TLS"]
        L2["Middleware Auth"]
        L3["Rate Limiting"]
        L4["Input Validation (Zod)"]
        L5["Encryption at Rest"]
        L6["Session Timeout"]
    end

    Request["HTTP Request"] --> L1 --> L2 --> L3 --> L4 --> L5
    L5 --> Response["HTTP Response"]
    L6 -.-> L2
```

### Modelo de criptografia

```
Senha Mestra (usuário)
        │
        ▼ Argon2id hash ──────────► VaultConfig.masterPasswordHash (storage)
        │
        ▼ PBKDF2/Argon2 derive ───► Vault Key (256-bit, em memória/sessão)
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
            encrypt(password)   encrypt(customFields)  encrypt(export)
                    │                   │                   │
                    ▼                   ▼                   ▼
              AES-256-GCM         AES-256-GCM          AES-256-GCM
              (Credential)        (JSON blob)          (.vault.json)
```

**Regras:**
- Senha mestra **nunca** persistida em plain text
- Vault Key **nunca** enviada ao client — descriptografia no server
- Campos sensíveis (`password`, `customFields` com PIN/backup) criptografados
- Metadados (`appName`, `username`, `email`, `category`) em plain text para busca eficiente

---

## 8. Mapa de API Routes

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/api/vault/status` | Não | `{ configured: boolean }` |
| POST | `/api/vault/setup` | Não | Criar senha mestra (1x) |
| POST | `/api/auth/login` | Não | Login com senha mestra |
| POST | `/api/auth/logout` | Sim | Encerrar sessão |
| POST | `/api/auth/lock` | Sim | Bloquear vault |
| GET | `/api/vault/config` | Sim | Config (tema, timeout) |
| PATCH | `/api/vault/config` | Sim | Atualizar config |
| GET | `/api/credentials` | Sim | Listar (+ query params) |
| POST | `/api/credentials` | Sim | Criar credencial |
| GET | `/api/credentials/[id]` | Sim | Detalhe |
| PUT | `/api/credentials/[id]` | Sim | Atualizar |
| DELETE | `/api/credentials/[id]` | Sim | Excluir |
| GET | `/api/vault/health` | Sim | Score de saúde |
| POST | `/api/vault/export` | Sim | Exportar vault |
| POST | `/api/vault/import` | Sim | Importar vault |
| GET | `/api/favicon` | Sim | Proxy favicon (evita CORS) |

### Query params — GET `/api/credentials`

| Param | Tipo | Descrição |
|-------|------|-----------|
| `search` | string | Busca global |
| `appName` | string | Filtro |
| `username` | string | Filtro |
| `email` | string | Filtro |
| `category` | enum | Filtro |
| `favorite` | boolean | Apenas favoritos |
| `sort` | string | `updatedAt`, `appName`, `createdAt` |
| `limit` | number | Paginação |
| `offset` | number | Paginação |

---

## 9. Estrutura de Páginas (App Router)

```
app/
├── layout.tsx              # Root layout + Chakra Provider
├── page.tsx                # Redirect → /dashboard ou /login
├── setup/
│   └── page.tsx            # Primeiro acesso
├── login/
│   └── page.tsx            # Login
├── (authenticated)/        # Route group com layout auth
│   ├── layout.tsx          # Sidebar + header + auth guard
│   ├── dashboard/
│   │   └── page.tsx
│   ├── credentials/
│   │   └── page.tsx
│   ├── health/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
└── api/
    ├── vault/
    ├── auth/
    ├── credentials/
    └── favicon/
```

---

## 10. Diagrama de Deploy

```mermaid
flowchart TB
    subgraph Dev["Desenvolvimento"]
        DevNext["next dev :3000"]
        DevDB["SQLite file"]
        DevNext --> DevDB
    end

    subgraph Prod["Produção (opções)"]
        subgraph OptionA["Opção A: Vercel"]
            Vercel["Vercel Edge/Node"]
            Neon["Neon PostgreSQL"]
            Vercel --> Neon
        end

        subgraph OptionB["Opção B: VPS Docker"]
            Docker["Docker Container"]
            PG["PostgreSQL"]
            Nginx["Nginx + SSL"]
            Nginx --> Docker --> PG
        end
    end

    User["Usuário"] --> Nginx
    User --> Vercel
```

**Recomendação:** Vercel + Neon (free tier) para simplicidade, ou Docker Compose em VPS para controle total.

---

## 11. PWA — Arquitetura Offline (Release 1.5)

```mermaid
flowchart LR
    subgraph Online["Online"]
        SW["Service Worker"]
        Cache["Cache API"]
        API["API Routes"]
        IDB["IndexedDB (optional)"]
    end

    SW --> Cache
    SW --> API
    API --> IDB

    subgraph Offline["Offline"]
        SW2["Service Worker"]
        Cache2["Cached Assets"]
        IDB2["Cached Credentials Read"]
    end

    SW2 --> Cache2
    SW2 --> IDB2
```

**Estratégia:**
- **Assets estáticos:** Cache-first (app shell)
- **API GET credentials:** Network-first, fallback cache (read-only offline)
- **API mutations offline:** Queue in IndexedDB, sync on reconnect (Release 1.5)

---

## 12. Integrações Externas

| Serviço | Direção | Protocolo | Fallback |
|---------|---------|-----------|----------|
| Google Favicon | Server → External | HTTPS GET | Avatar com inicial |
| Clearbit Logo | Server → External | HTTPS GET | Favicon API |

**Proxy interno:** `/api/favicon?domain=youtube.com` — evita CORS no client e centraliza cache.

---

## 13. Limites e Escalabilidade

| Dimensão | Capacidade | Notas |
|----------|------------|-------|
| Usuários | 1 | By design |
| Credenciais | 500+ | Index em appName, username, email |
| Requests/s | ~10 | Uso pessoal |
| Storage | < 10 MB | Texto criptografado |
| Concurrent sessions | 1-3 abas | Shared session cookie |

Não requer microserviços, load balancer ou cache distribuído para o escopo atual.

---

## 14. Referências

- `outputs/product-owner/requirements.md`
- `outputs/product-owner/acceptance-criteria.md`
- `outputs/ux/design-system.md`
