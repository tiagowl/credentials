# Guia de Desenvolvimento — Credentials Vault

**Projeto:** Gerenciador de Credenciais Pessoal  
**Data:** 2026-05-26  
**Agente:** Arquiteto de Software

---

## 1. Introdução

Este guia define convenções, workflows e boas práticas para desenvolvimento do Credentials Vault. Destina-se aos agentes **frontend-dev** e **backend-dev** (fullstack via Next.js).

---

## 2. Setup do Ambiente

### 2.1 Pré-requisitos

- Node.js ≥ 20 LTS
- npm ≥ 10 ou pnpm ≥ 8
- Git

### 2.2 Instalação

```bash
# Clone e instale
git clone <repo-url> credentials-vault
cd credentials-vault
npm install

# Configure ambiente
cp .env.example .env
# Edite DATABASE_URL, SESSION_SECRET, ENCRYPTION_SALT

# Banco de dados
npx prisma migrate dev
npx prisma generate

# Desenvolvimento
npm run dev
```

### 2.3 Scripts npm

| Script | Comando | Descrição |
|--------|---------|-----------|
| `dev` | `next dev` | Servidor desenvolvimento |
| `build` | `next build` | Build produção |
| `start` | `next start` | Servidor produção |
| `lint` | `eslint . --ext .ts,.tsx` | Lint |
| `format` | `prettier --write .` | Format |
| `test` | `vitest run` | Testes unit/integration |
| `test:e2e` | `playwright test` | Testes E2E |
| `db:migrate` | `prisma migrate dev` | Migrations |
| `db:studio` | `prisma studio` | GUI banco |

---

## 3. Convenções de Nomenclatura

### 3.1 Arquivos e Pastas

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes React | PascalCase.tsx | `CredentialCard.tsx` |
| Hooks | camelCase com `use` | `useCredentials.ts` |
| Services | camelCase + `.service.ts` | `auth.service.ts` |
| Repositories | camelCase + `.repository.ts` | `credential.repository.ts` |
| Validators | camelCase + `.schema.ts` | `credential.schema.ts` |
| Types | camelCase + `.types.ts` | `credential.types.ts` |
| API Routes | kebab-case folders | `app/api/vault/health/route.ts` |
| Constants | SCREAMING_SNAKE | `MAX_LOGIN_ATTEMPTS` |

### 3.2 Código TypeScript

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| Interfaces | PascalCase | `Credential`, `CreateCredentialDto` |
| Types | PascalCase | `Category`, `Theme` |
| Enums | PascalCase | `Category.SOCIAL` |
| Functions | camelCase | `calculatePasswordStrength()` |
| Constants | SCREAMING_SNAKE | `SESSION_COOKIE_NAME` |
| React components | PascalCase | `function CredentialCard()` |
| Event handlers | `handle` + Action | `handleCopyPassword()` |

### 3.3 Banco de Dados (Prisma)

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| Models | PascalCase singular | `Credential`, `VaultConfig` |
| Fields | camelCase | `appName`, `passwordEnc` |
| Enums | PascalCase | `Category`, `Theme` |
| Relations | camelCase | `passwordHistory` |

---

## 4. Estrutura de um Feature (Exemplo: CRUD Credential)

```
1. Schema Zod          → src/lib/validators/credential.schema.ts
2. Types               → src/types/credential.types.ts
3. Repository          → src/repositories/credential.repository.ts
4. Service             → src/services/credential.service.ts
5. API Route           → app/api/credentials/route.ts
6. Hook                → src/hooks/useCredentials.ts
7. Components          → src/components/credentials/
8. Page                → app/(authenticated)/credentials/page.tsx
9. Tests               → src/services/__tests__/credential.service.test.ts
```

### Checklist por feature

- [ ] Zod schema com mensagens pt-BR
- [ ] Service com lógica de negócio
- [ ] API route com auth guard
- [ ] Error handling padronizado
- [ ] Componentes responsivos (3 breakpoints)
- [ ] Loading / empty / error states
- [ ] Toast feedback
- [ ] Testes unitários do service
- [ ] Critérios de aceitação PO validados

---

## 5. Git Workflow

### 5.1 Branches

| Branch | Uso |
|--------|-----|
| `main` | Produção estável |
| `develop` | Integração |
| `feature/US-XXX-descricao` | Features |
| `fix/descricao` | Bug fixes |

### 5.2 Commits (Conventional Commits)

```
feat(credentials): add copy to clipboard button
fix(auth): rate limit login attempts
refactor(crypto): extract encryption to service
test(health): add password strength calculation tests
docs(arch): update API routes documentation
```

### 5.3 PR Checklist

- [ ] Lint passa
- [ ] Testes passam
- [ ] Build passa
- [ ] Responsivo testado
- [ ] Dark mode testado
- [ ] Sem secrets commitados

---

## 6. Segurança — Checklist Dev

- [ ] Nunca logar senhas ou vault keys
- [ ] Nunca commitar `.env`
- [ ] `SESSION_SECRET` ≥ 32 chars random
- [ ] Cookies: `httpOnly`, `secure` (prod), `sameSite: strict`
- [ ] Validar **todos** inputs com Zod
- [ ] Sanitizar outputs (React escapa por default)
- [ ] Rate limit em `/api/auth/login`
- [ ] HTTPS-only em produção
- [ ] Dependências auditadas (`npm audit`)

---

## 7. Decisões Arquiteturais (ADRs)

### ADR-001: Monolito Next.js Fullstack

| Campo | Detalhe |
|-------|---------|
| **Status** | Aceito |
| **Contexto** | Projeto single-user, dev solo, sem necessidade de escala |
| **Decisão** | Next.js App Router com API Routes integradas |
| **Consequências** | (+) Simplicidade, deploy único, DX excelente. (−) Acoplamento front/back no mesmo repo (aceitável) |

### ADR-002: Metadados Plain + Secrets Encrypted

| Campo | Detalhe |
|-------|---------|
| **Status** | Aceito |
| **Contexto** | Busca instantânea (< 100ms) em appName, username, email |
| **Decisão** | Criptografar apenas password e customFields; metadados em plain text |
| **Consequências** | (+) Busca SQL eficiente com indexes. (−) Metadados visíveis se DB comprometido (mitigado por acesso local/single-user) |

### ADR-003: Argon2id para Senha Mestra

| Campo | Detalhe |
|-------|---------|
| **Status** | Aceito |
| **Contexto** | RNF-SEC-01 exige hash seguro |
| **Decisão** | Argon2id via lib `argon2` |
| **Consequências** | (+) Resistente a GPU attacks. (−) ~200ms por verify (aceitável para login) |

### ADR-004: Sessão Server-Side com httpOnly Cookie

| Campo | Detalhe |
|-------|---------|
| **Status** | Aceito |
| **Contexto** | Vault key precisa ficar server-side para decrypt |
| **Decisão** | Cookie httpOnly com session ID; vault key em store server (Map/Redis) |
| **Consequências** | (+) XSS não expõe vault key. (−) Stateful sessions (aceitável para single-user) |

### ADR-005: SQLite Dev / PostgreSQL Prod

| Campo | Detalhe |
|-------|---------|
| **Status** | Aceito |
| **Contexto** | Zero config local, robustez em produção |
| **Decisão** | Prisma multi-provider via DATABASE_URL |
| **Consequências** | (+) Dev rápido. (−) Testar migrations em ambos ambientes |

### ADR-006: Chakra UI v3 como Design System

| Campo | Detalhe |
|-------|---------|
| **Status** | Aceito |
| **Contexto** | Requisito PO; UX design system definido |
| **Decisão** | Chakra UI v3 com tokens customizados |
| **Consequências** | (+) A11y built-in, dark mode. (−) Bundle size (mitigado com tree shaking) |

### ADR-007: Release 2.0 Cancelada

| Campo | Detalhe |
|-------|---------|
| **Status** | Aceito |
| **Contexto** | TOTP e Autofill extensão fora de escopo |
| **Decisão** | Não implementar WebAuthn, TOTP, browser extension |
| **Consequências** | (+) Escopo reduzido, entrega mais rápida. (−) Sem autofill nativo (copy manual) |

---

## 8. Implementação por Sprint (Referência)

### Sprint 1 — Foundation

```
Prioridade implementação:
1. prisma/schema.prisma + migrate
2. src/services/crypto.service.ts
3. src/services/auth.service.ts
4. app/api/vault/setup + auth/login
5. middleware.ts
6. app/setup + app/login pages
7. src/services/credential.service.ts
8. app/api/credentials CRUD
9. Layout autenticado responsivo
10. CredentialCard + CredentialForm
```

### Sprint 2 — Busca + Copy + Dashboard

```
1. GET /api/credentials?search=
2. Copy clipboard hook
3. Toast system
4. Dashboard page + stats
5. Session timeout hook
6. Password strength indicator
```

### Sprint 3-4 — Visual + Health

```
1. Favicon proxy API
2. Dark mode provider
3. Favoritos
4. Categories + filters
5. Health service + page
6. Animations
```

### Sprint 5-6 — Power Features

```
1. Custom fields (encrypted JSON)
2. Export/import service
3. PWA manifest + service worker
4. Panic mode
5. Password history
```

---

## 9. Code Review Guidelines

### Must-check

1. **Segurança:** inputs validados, secrets criptografados, auth em rotas protegidas
2. **Tipos:** sem `any` desnecessário
3. **Errors:** tratados com padrão ApiError
4. **UI:** 4 estados (loading, empty, error, content)
5. **Responsive:** testado mobile/tablet/desktop
6. **A11y:** labels, focus, contraste

### Nice-to-check

- Performance (memo, lazy load)
- Testes adicionados
- Nomes descritivos
- Sem código comentado/debug

---

## 10. Debugging

| Problema | Ferramenta |
|----------|------------|
| API errors | Network tab + server logs |
| Prisma queries | `DEBUG=prisma:query npm run dev` |
| Session issues | Check cookies Application tab |
| Crypto errors | Unit test CryptoService isolado |
| UI layout | Chakra DevTools + responsive mode |

---

## 11. Deploy

### Vercel (recomendado)

```bash
# vercel.json (opcional)
{
  "framework": "nextjs",
  "buildCommand": "npx prisma generate && next build"
}
```

Env vars na Vercel dashboard: `DATABASE_URL`, `SESSION_SECRET`, `ENCRYPTION_SALT`

### Docker (alternativa)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 12. Referências Cruzadas

| Documento | Conteúdo |
|-----------|----------|
| `architecture-diagram.md` | Diagramas, fluxos, API map |
| `tech-stack.md` | Dependências, schema Prisma |
| `design-patterns.md` | Padrões de código |
| `../product-owner/user-stories.md` | Backlog |
| `../product-owner/acceptance-criteria.md` | DoD |
| `../ux/design-system.md` | Tokens visuais |
| `../ux/wireframes/` | Layouts |

---

## 13. Glossário

| Termo | Definição |
|-------|-----------|
| **Vault** | Conjunto de credenciais protegido por senha mestra |
| **Senha mestra** | Única senha para acessar o vault |
| **Vault Key** | Chave derivada da senha mestra para encrypt/decrypt |
| **Credential** | Registro de login (app + user + password) |
| **Health Score** | Métrica 0-100 de qualidade das senhas |
