# Stack Tecnológica — Credentials Vault

**Projeto:** Gerenciador de Credenciais Pessoal  
**Data:** 2026-05-26  
**Agente:** Arquiteto de Software

---

## 1. Resumo da Stack

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| Runtime | Node.js | ≥ 20 LTS |
| Linguagem | TypeScript | ≥ 5.4 |
| Framework | Next.js (App Router) | ≥ 14.x |
| UI Library | React | ≥ 18.x |
| Componentes UI | Chakra UI | v3 |
| ORM | Prisma | ≥ 5.x |
| Banco (dev) | SQLite | via Prisma |
| Banco (prod) | PostgreSQL | ≥ 15 |
| Validação | Zod | ≥ 3.x |
| Auth/Crypto | Node crypto + argon2 | nativo |
| Testes | Vitest + Playwright | latest |
| Lint/Format | ESLint + Prettier | latest |

---

## 2. Justificativa por Camada

### 2.1 Next.js (App Router)

**Por quê:**
- Fullstack unificado (frontend + API Routes) — ideal para dev solo
- App Router com layouts aninhados (auth group)
- Middleware nativo para guard de rotas
- SSR/SSG para performance inicial
- Suporte PWA via next-pwa ou manual service worker
- Deploy simplificado (Vercel)

**Alternativas descartadas:**
| Alternativa | Motivo descarte |
|-------------|-----------------|
| Vite + Express separado | Mais boilerplate, 2 deploys |
| Remix | Menor ecossistema Chakra |
| Nuxt | Stack definida como React |

### 2.2 Chakra UI v3

**Por quê:**
- Requisito obrigatório do Product Owner
- Componentes acessíveis (WCAG AA)
- Dark mode nativo
- Design tokens customizáveis
- Responsive props (`base`, `md`, `lg`)

**Dependências:**
```json
{
  "@chakra-ui/react": "^3.x",
  "@emotion/react": "^11.x",
  "next-themes": "^0.3.x"
}
```

### 2.3 Prisma ORM

**Por quê:**
- Requisito obrigatório do Product Owner
- Type-safe queries
- Migrations versionadas
- Suporte SQLite (dev) e PostgreSQL (prod) com mesmo schema
- Prisma Client auto-generated

**Alternativas descartadas:**
| Alternativa | Motivo |
|-------------|--------|
| Drizzle | PO especificou Prisma |
| Raw SQL | Sem type safety |
| TypeORM | DX inferior ao Prisma |

### 2.4 SQLite / PostgreSQL

| Ambiente | Banco | Motivo |
|----------|-------|--------|
| Development | SQLite | Zero config, arquivo local |
| Production | PostgreSQL | Robusto, free tier (Neon/Supabase) |
| Test | SQLite in-memory | Velocidade |

**Schema provider Prisma:**
```prisma
datasource db {
  provider = "postgresql" // ou "sqlite" via env
  url      = env("DATABASE_URL")
}
```

---

## 3. Dependências Completas

### 3.1 Production

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@chakra-ui/react": "^3.0.0",
    "@emotion/react": "^11.13.0",
    "next-themes": "^0.3.0",
    "@prisma/client": "^5.20.0",
    "zod": "^3.23.0",
    "argon2": "^0.41.0",
    "lucide-react": "^0.460.0",
    "date-fns": "^4.1.0"
  }
}
```

### 3.2 Development

```json
{
  "devDependencies": {
    "typescript": "^5.6.0",
    "prisma": "^5.20.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "vitest": "^2.1.0",
    "@playwright/test": "^1.48.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.3.0"
  }
}
```

---

## 4. Segurança — Bibliotecas e Algoritmos

| Função | Biblioteca/Algoritmo | Config |
|--------|---------------------|--------|
| Hash senha mestra | `argon2` (Argon2id) | memory: 64MB, iterations: 3, parallelism: 4 |
| Derivação vault key | PBKDF2-SHA256 | 100.000 iterations, 32 bytes |
| Criptografia campos | AES-256-GCM | IV 12 bytes random por campo |
| Sessão | httpOnly cookie | `SameSite=Strict`, `Secure` (prod) |
| Rate limiting | In-memory / `@upstash/ratelimit` | 5 req/min login |
| Validação input | Zod schemas | Todas API routes |

### Variáveis de ambiente

```env
# .env.example
DATABASE_URL="file:./dev.db"
SESSION_SECRET="random-32-char-minimum-secret"
ENCRYPTION_SALT="random-salt-for-pbkdf2"
NODE_ENV="development"
```

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | Sim | Connection string Prisma |
| `SESSION_SECRET` | Sim | Assinar cookies de sessão |
| `ENCRYPTION_SALT` | Sim | Salt fixo para PBKDF2 (backup/restore) |
| `NODE_ENV` | Sim | development / production |

---

## 5. Estrutura de Pastas do Projeto

```
credentials-vault/
├── app/                          # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── setup/
│   ├── login/
│   ├── (authenticated)/
│   └── api/
├── src/
│   ├── components/               # UI components
│   │   ├── layout/
│   │   ├── credentials/
│   │   ├── dashboard/
│   │   └── ui/                   # Primitives Chakra wrappers
│   ├── hooks/                    # useAuth, useCredentials, useSearch
│   ├── services/                 # Business logic
│   │   ├── auth.service.ts
│   │   ├── credential.service.ts
│   │   ├── crypto.service.ts
│   │   ├── health.service.ts
│   │   └── export.service.ts
│   ├── repositories/             # Prisma data access
│   ├── lib/                      # Utilities
│   │   ├── prisma.ts
│   │   ├── session.ts
│   │   └── validators/
│   ├── types/                    # TypeScript types
│   └── constants/                # Enums, config
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── manifest.json             # PWA
│   └── icons/
├── middleware.ts                 # Auth guard
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## 6. Schema Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

enum Category {
  SOCIAL
  STREAMING
  EMAIL
  BANKING
  WORK
  OTHER
}

enum Theme {
  LIGHT
  DARK
  SYSTEM
}

model VaultConfig {
  id                 String   @id @default(uuid())
  masterPasswordHash String
  encryptionSalt     String
  sessionTimeout     Int      @default(15)
  theme              Theme    @default(SYSTEM)
  accentColor        String   @default("blue")
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model Credential {
  id               String   @id @default(uuid())
  appName          String
  username         String?
  email            String?
  passwordEnc      String   // AES-256-GCM encrypted
  passwordIv       String   // IV for decryption
  url              String?
  category         Category @default(OTHER)
  iconUrl          String?
  isFavorite       Boolean  @default(false)
  customFieldsEnc  String?  // Encrypted JSON
  customFieldsIv   String?
  passwordStrength Int      @default(0)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  passwordHistory  PasswordHistory[]

  @@index([appName])
  @@index([username])
  @@index([email])
  @@index([category])
  @@index([isFavorite])
  @@index([updatedAt])
}

model PasswordHistory {
  id           String     @id @default(uuid())
  credentialId String
  credential   Credential @relation(fields: [credentialId], references: [id], onDelete: Cascade)
  strength     Int
  changedAt    DateTime   @default(now())

  @@index([credentialId])
}
```

---

## 7. Performance

| Requisito | Implementação |
|-----------|---------------|
| FCP < 2s | SSR dashboard, font display swap, code splitting |
| TTI < 3s | Lazy load modals, virtual scroll (500+ items) |
| Busca < 100ms | Index DB + debounce 300ms client |
| 500+ credenciais | Paginação server-side (limit 50) + `@tanstack/react-virtual` |

### Otimizações Next.js

```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react', 'lucide-react'],
  },
}
```

---

## 8. PWA (Release 1.5)

| Componente | Tecnologia |
|------------|------------|
| Manifest | `public/manifest.json` |
| Service Worker | `next-pwa` ou custom SW |
| Offline cache | Workbox strategies |
| Install prompt | `beforeinstallprompt` event |

---

## 9. CI/CD (Recomendado)

```yaml
# .github/workflows/ci.yml (referência)
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx prisma generate
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

---

## 10. Monitoramento (Opcional)

| Ferramenta | Uso | Custo |
|------------|-----|-------|
| Vercel Analytics | Web vitals | Free |
| Sentry | Error tracking | Free tier |
| Prisma logging | Query debug | Dev only |

---

## 11. Matriz de Compatibilidade

| Browser | Versão mínima | Notas |
|---------|---------------|-------|
| Chrome | 90+ | Full support |
| Firefox | 90+ | Full support |
| Safari | 15+ | Clipboard API |
| Edge | 90+ | Full support |
| Mobile Safari | 15+ | PWA install |
| Mobile Chrome | 90+ | PWA install |

---

## 12. Referências

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Chakra UI v3](https://www.chakra-ui.com/docs)
- `outputs/product-owner/requirements.md`
