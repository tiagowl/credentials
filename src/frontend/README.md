# Credentials Vault — Frontend + Backend

Aplicação fullstack Next.js para gerenciamento pessoal de credenciais.

## Stack

- Next.js 14 (App Router)
- Chakra UI v3
- Prisma ORM + PostgreSQL (Neon)
- TypeScript

## Setup com Neon

1. Crie um projeto em [Neon](https://neon.tech) e copie as connection strings.
2. No Neon Console, use:
   - **Pooled connection** → `DATABASE_URL` (host com `-pooler`)
   - **Direct connection** → `DIRECT_URL` (host sem `-pooler`, para migrations)

```bash
cd src/frontend
cp .env.example .env
# Preencha DATABASE_URL, DIRECT_URL, SESSION_SECRET e ENCRYPTION_SALT

npm install
npm run db:migrate    # cria tabelas no Neon (recomendado)
# ou: npm run db:push  # sync rápido sem histórico de migration

npm run db:seed
npm run dev
```

Acesse: http://localhost:3000

### Script: usuário winkellandi

Para criar `winkellandi123@gmail.com` e vincular todas as credenciais (preservando o salt de criptografia atual):

```bash
npm run db:sql:winkellandi
```

Ou execute `prisma/scripts/link-user-winkellandi.sql` no SQL Editor do Neon.

### Multi-usuário

Cada pessoa cria sua conta em `/register` (email + senha mestra). O login fica em `/login` com link **“Criar conta gratuita”**.

### Conta existente (migração)

Se você já tinha um vault antes da versão multi-usuário:

1. Rode: `npm run db:migrate:deploy`
2. Se não tinha email, o sistema gera `legacy-{id}@vault.local` — defina um email real em **Minha conta**
3. Entre com email + a **mesma senha mestra** de antes

### Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string pooled (runtime da app) |
| `DIRECT_URL` | Connection string direta (migrations / `db push`) |
| `SESSION_SECRET` | Segredo da sessão (32+ caracteres aleatórios) |
| `ENCRYPTION_SALT` | Salt fixo do PBKDF2 (não altere após criar o vault) |

## Dados de teste (seed)

| Campo | Valor |
|-------|-------|
| Senha mestra | mV9#Qx2!Lt7$Wr4@Nz8*Hp1^Dc6&Ka3? |
| Salt (seed) | `credentials-vault-seed-salt-2026` |
| Credenciais | 8 apps (YouTube, Facebook, Twitter, etc.) |

Para o seed funcionar com dados pré-criptografados, defina no `.env`:

```env
ENCRYPTION_SALT="credentials-vault-seed-salt-2026"
```

```bash
npm run db:seed          # Recomendado — popula via TypeScript
# ou execute prisma/seed.sql no SQL Editor do Neon
```

## Features implementadas

### Sprint 1-2 (Release 0.5)
- Cadastro (email + senha mestra) e login
- Perfil: dados pessoais, alterar senha mestra, logout
- Setup senha mestra + login (contas antigas sem email)
- CRUD credenciais criptografadas
- Busca global + filtros
- Copy 1-clique + toast
- Dashboard
- Layout responsivo (desktop/tablet/mobile)
- Sessão com timeout
- Gerador de senha + indicador de força

### Sprint 3-4 (Release 1.0)
- Ícones automáticos (favicon)
- Dark/light/system theme
- Favoritos
- Categorias + filtros
- Vault Health score
- Animações nos cards

### Sprint 5-6 (Release 1.5)
- Campos customizáveis
- Export JSON criptografado / CSV
- Import merge/replace
- PWA (manifest + service worker)
- Panic mode (Ctrl+H)
- Histórico de senhas
- Bloqueio manual (Ctrl+L)

## Atalhos

| Atalho | Ação |
|--------|------|
| Ctrl+K / / | Focar busca |
| Ctrl+H | Ocultar senhas (panic) |
| Ctrl+L | Bloquear vault |

## Estrutura

```
src/frontend/
├── app/                 # Pages + API Routes
├── src/components/      # UI components
├── src/services/        # Business logic
├── src/lib/             # Crypto, session, validators
└── prisma/              # Schema + migrations + seed
```
