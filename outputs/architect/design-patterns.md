# Padrões de Design — Credentials Vault

**Projeto:** Gerenciador de Credenciais Pessoal  
**Data:** 2026-05-26  
**Agente:** Arquiteto de Software

---

## 1. Visão Geral

Este documento define os padrões arquiteturais e de design aplicados ao Credentials Vault, alinhados à stack Next.js + Prisma + Chakra UI v3 e aos requisitos de segurança single-user.

---

## 2. Padrões Arquiteturais

### 2.1 Layered Architecture (Monolito Modular)

```
┌─────────────────────────────────────┐
│  Presentation (Pages + Components)  │
├─────────────────────────────────────┤
│  API Layer (Route Handlers)         │
├─────────────────────────────────────┤
│  Service Layer (Business Logic)     │
├─────────────────────────────────────┤
│  Repository Layer (Prisma)          │
├─────────────────────────────────────┤
│  Database (SQLite / PostgreSQL)     │
└─────────────────────────────────────┘
```

**Regra:** Pages nunca acessam Prisma diretamente. Fluxo sempre: `Page → API → Service → Repository → DB`.

### 2.2 Route Groups (App Router)

Padrão Next.js para separar rotas autenticadas:

```
app/
├── (public)/          # setup, login — sem layout auth
└── (authenticated)/   # dashboard, credentials — layout com sidebar + guard
```

### 2.3 API-First Internal

Toda mutação de dados passa por API Routes REST, mesmo em Server Components quando aplicável. Benefícios:
- Validação centralizada
- Reutilização pelo PWA offline (sync)
- Testabilidade isolada

---

## 3. Padrões de Segurança

### 3.1 Envelope Encryption

```
Master Password → Vault Key (derived, session-scoped)
Vault Key → encrypt/decrypt sensitive fields per credential
```

Campos criptografados: `password`, `customFields`  
Campos plain (busca): `appName`, `username`, `email`, `category`, `url`

### 3.2 Fail-Secure Session

Middleware rejeita requests sem sessão válida **antes** de qualquer handler:

```typescript
// middleware.ts — pattern
export function middleware(request: NextRequest) {
  const session = getSession(request)
  if (!session && isProtectedRoute(request.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}
```

### 3.3 Rate Limiting (Login)

Pattern **Token Bucket** in-memory para `/api/auth/login`:
- 5 tentativas / 5 minutos por IP
- Resposta 429 com `Retry-After` header

---

## 4. Padrões de Código (Gang of Four aplicados)

### 4.1 Repository Pattern

Abstrai acesso a dados via Prisma:

```typescript
// src/repositories/credential.repository.ts
export class CredentialRepository {
  constructor(private prisma: PrismaClient) {}

  async findMany(filters: CredentialFilters) {
    return this.prisma.credential.findMany({
      where: buildWhereClause(filters),
      orderBy: { updatedAt: 'desc' },
      take: filters.limit ?? 50,
      skip: filters.offset ?? 0,
    })
  }

  async create(data: Prisma.CredentialCreateInput) {
    return this.prisma.credential.create({ data })
  }
}
```

### 4.2 Service Pattern

Encapsula lógica de negócio:

```typescript
// src/services/credential.service.ts
export class CredentialService {
  constructor(
    private repo: CredentialRepository,
    private crypto: CryptoService,
  ) {}

  async create(dto: CreateCredentialDto, vaultKey: Buffer) {
    const strength = calculatePasswordStrength(dto.password)
    const { ciphertext, iv } = this.crypto.encrypt(dto.password, vaultKey)
    
    return this.repo.create({
      appName: dto.appName,
      passwordEnc: ciphertext,
      passwordIv: iv,
      passwordStrength: strength,
      // ...
    })
  }
}
```

### 4.3 Factory Pattern — Session

```typescript
// src/lib/session.ts
export function createSession(vaultKey: Buffer): Session {
  return {
    id: randomUUID(),
    vaultKey, // held server-side only
    expiresAt: Date.now() + timeoutMs,
  }
}
```

### 4.4 Strategy Pattern — Export Format

```typescript
interface ExportStrategy {
  export(credentials: Credential[], vaultKey: Buffer): Buffer
}

class EncryptedJsonExport implements ExportStrategy { /* AES vault file */ }
class CsvExport implements ExportStrategy { /* plain CSV with warning */ }

class ExportService {
  export(format: 'json' | 'csv', ...args) {
    const strategy = format === 'json' 
      ? new EncryptedJsonExport() 
      : new CsvExport()
    return strategy.export(...args)
  }
}
```

### 4.5 Observer Pattern — Session Timeout (Client)

```typescript
// hooks/useSessionTimeout.ts
// Observa activity events (mousemove, keydown, click)
// Dispara warning aos 14min, logout aos 15min
```

### 4.6 Composite Pattern — Credential Card

```typescript
// CredentialCard composto de sub-componentes
<CredentialCard>
  <CredentialHeader icon appName favorite />
  <CredentialFields username email password />
  <CredentialActions edit delete />
</CredentialCard>
```

---

## 5. Padrões Frontend (React)

### 5.1 Container / Presentation

| Tipo | Responsabilidade | Exemplo |
|------|------------------|---------|
| **Container** | Data fetching, state, handlers | `CredentialsPageContainer` |
| **Presentation** | Render puro, props | `CredentialCard`, `SearchBar` |

### 5.2 Custom Hooks

| Hook | Responsabilidade |
|------|------------------|
| `useAuth()` | Session state, login, logout, lock |
| `useCredentials(filters)` | Fetch, CRUD, optimistic updates |
| `useSearch()` | Debounced search state |
| `useClipboard()` | Copy with feedback |
| `useSessionTimeout()` | Idle detection |
| `useTheme()` | Chakra colorMode wrapper |

### 5.3 Compound Components (Chakra)

```tsx
<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Backdrop />
  <Dialog.Content>
    <Dialog.Header>Nova credencial</Dialog.Header>
    <Dialog.Body>{children}</Dialog.Body>
    <Dialog.Footer>{actions}</Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

### 5.4 Optimistic UI (Favoritos)

```typescript
// Pattern: update UI → API call → revert on error
const toggleFavorite = async (id: string) => {
  setOptimisticFavorite(id, true)
  try {
    await api.patch(`/credentials/${id}`, { isFavorite: true })
  } catch {
    setOptimisticFavorite(id, false)
    toast.error('Erro ao favoritar')
  }
}
```

---

## 6. Padrões de API

### 6.1 REST Conventions

| Ação | Método | Status Success | Status Error |
|------|--------|----------------|--------------|
| List | GET | 200 | 401, 500 |
| Create | POST | 201 | 400, 401, 409 |
| Read | GET | 200 | 401, 404 |
| Update | PUT/PATCH | 200 | 400, 401, 404 |
| Delete | DELETE | 204 | 401, 404 |

### 6.2 Error Response Pattern

```typescript
// Padrão uniforme de erro
interface ApiError {
  error: {
    code: string        // 'VALIDATION_ERROR' | 'UNAUTHORIZED' | 'NOT_FOUND'
    message: string     // Mensagem user-friendly pt-BR
    details?: unknown   // Zod errors, etc.
  }
}

// Exemplo
{ "error": { "code": "VALIDATION_ERROR", "message": "Nome do app é obrigatório", "details": [...] } }
```

### 6.3 Validation Pattern (Zod)

```typescript
// src/lib/validators/credential.schema.ts
export const createCredentialSchema = z.object({
  appName: z.string().min(1, 'Nome do app é obrigatório'),
  username: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  password: z.string().min(1, 'Senha é obrigatória'),
  category: z.nativeEnum(Category).optional(),
  url: z.string().url('URL inválida').optional().or(z.literal('')),
})

// Usage in route handler
const parsed = createCredentialSchema.safeParse(body)
if (!parsed.success) return apiError('VALIDATION_ERROR', 400, parsed.error)
```

### 6.4 Route Handler Pattern

```typescript
// app/api/credentials/route.ts
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const filters = parseQueryParams(request)
    const credentials = await credentialService.list(filters, session.vaultKey)
    return NextResponse.json(credentials)
  } catch (error) {
    return handleApiError(error)
  }
}
```

---

## 7. Padrões de Dados

### 7.1 Singleton VaultConfig

Apenas 1 registro `VaultConfig` no banco. Verificação no setup:

```typescript
const existing = await prisma.vaultConfig.findFirst()
if (existing) throw new ConflictError('Vault já configurado')
```

### 7.2 Soft Metadata / Hard Secrets

| Tipo | Storage | Motivo |
|------|---------|--------|
| Metadados buscáveis | Plain text | Performance de search/filter |
| Secrets | AES-256-GCM | Segurança |
| Hash senha mestra | Argon2id | Irreversível |

### 7.3 Password History (Append-Only)

Pattern **Event Sourcing lite** — cada alteração de senha gera registro imutável:

```typescript
await prisma.$transaction([
  prisma.credential.update({ ... }),
  prisma.passwordHistory.create({ credentialId, strength, changedAt: new Date() }),
])
```

---

## 8. Padrões de UI/UX

### 8.1 Loading → Content → Empty → Error

Todo componente de listagem implementa 4 estados:

```tsx
if (isLoading) return <CredentialListSkeleton />
if (error) return <ErrorState onRetry={refetch} />
if (data.length === 0) return <EmptyState onAction={openCreate} />
return <CredentialGrid data={data} />
```

### 8.2 Modal vs Drawer (Responsive)

| Breakpoint | Pattern |
|------------|---------|
| ≥ 768px | `Dialog` (modal centralizado) |
| < 768px | `Drawer` (bottom sheet) |

Hook `useResponsiveDialog()` encapsula a lógica.

### 8.3 Toast Feedback

Toda ação mutativa dispara toast via Chakra Toaster:
- Copy → success 3s
- CRUD → success 3s
- Error → error 5s, dismissable

---

## 9. Padrões de Teste

| Camada | Tipo | Ferramenta | Foco |
|--------|------|------------|------|
| Services | Unit | Vitest | Crypto, health score, validators |
| API Routes | Integration | Vitest + supertest | Auth, CRUD, errors |
| Components | Unit | Vitest + RTL | Render, interactions |
| E2E | E2E | Playwright | Onboarding, copy flow |

### Test Pattern — AAA

```typescript
describe('CredentialService', () => {
  it('should encrypt password on create', async () => {
    // Arrange
    const dto = { appName: 'YouTube', password: 'secret123!' }
    const vaultKey = deriveTestKey()
    
    // Act
    const result = await service.create(dto, vaultKey)
    
    // Assert
    expect(result.passwordEnc).not.toBe(dto.password)
    expect(crypto.decrypt(result.passwordEnc, result.passwordIv, vaultKey))
      .toBe(dto.password)
  })
})
```

---

## 10. Anti-Patterns (Evitar)

| Anti-pattern | Problema | Alternativa |
|--------------|----------|-------------|
| Prisma no componente React | Acoplamento, sem validação | API Route + Service |
| Senha em localStorage | XSS vulnerability | httpOnly session cookie |
| Plain text password no DB | Breach expõe tudo | AES-256-GCM |
| Criptografar appName | Impossibilita busca | Plain text metadados |
| God component 500+ lines | Manutenção | Container/Presentation split |
| any no TypeScript | Bugs silenciosos | Zod + strict types |
| Hover-only actions mobile | Inacessível touch | Ações sempre visíveis |
| Múltiplos VaultConfig | Inconsistência | Singleton pattern |

---

## 11. Referências

- `outputs/architect/architecture-diagram.md`
- `outputs/architect/tech-stack.md`
- `outputs/ux/prototypes/states-and-transitions.md`
