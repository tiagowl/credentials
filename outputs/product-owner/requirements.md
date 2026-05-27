# Documentação de Requisitos — Gerenciador de Credenciais Pessoal

**Projeto:** Credentials Vault  
**Data:** 2026-05-26  
**Agente:** Product Owner  
**Versão:** 1.0

---

## 1. Visão do Produto

### 1.1 Objetivo de Negócio

Desenvolver um sistema web **intuitivo, moderno, bonito e profissional** para armazenar e recuperar credenciais de login de diversos aplicativos (YouTube, Facebook, Twitter, email, bancos, etc.), substituindo planilhas e blocos de notas inseguros.

### 1.2 Problema a Resolver

O usuário possui dezenas de contas digitais com credenciais distintas, mas não possui um local centralizado, seguro e agradável de consultar. Soluções existentes são complexas demais (enterprise) ou visualmente pobres.

### 1.3 Métricas de Sucesso

| Métrica | Target |
|---------|--------|
| Tempo para encontrar credencial | < 5 segundos |
| Cliques para copiar senha | 1 clique |
| Satisfação visual (autoavaliação) | ≥ 8/10 |
| Uso consistente | 30+ dias consecutivos |
| Senhas com indicador de força | 100% das credenciais |

---

## 2. Stakeholders e Usuários

### 2.1 Stakeholder Principal

| Papel | Descrição |
|-------|-----------|
| **Product Owner / Usuário** | Único usuário do sistema; define prioridades e valida entregas |

### 2.2 Personas

#### Persona 1: Tiago — Usuário Principal

| Atributo | Detalhe |
|----------|---------|
| **Perfil** | Desenvolvedor, uso pessoal |
| **Idade** | 25-40 anos |
| **Contexto** | Múltiplas contas em apps sociais, streaming, email e SaaS |
| **Objetivos** | Encontrar credenciais rapidamente; manter senhas organizadas e seguras |
| **Frustrações** | Planilhas inseguras; password managers feios ou complexos |
| **Comportamento** | Acessa via desktop e mobile; valoriza estética e velocidade |
| **Tech literacy** | Alta — confortável com web apps |

#### Persona 2: Tiago Mobile — Mesmo usuário em contexto mobile

| Atributo | Detalhe |
|----------|---------|
| **Contexto** | Precisa copiar credencial no celular enquanto faz login em outro app |
| **Necessidade** | Interface touch-friendly, layout responsivo, copy rápido |
| **Dispositivos** | Smartphone (320px+), tablet (768px+) |

---

## 3. Jornada do Usuário

### 3.1 Jornada: Primeiro Acesso (Onboarding)

```
Descoberta → Configuração → Primeira Credencial → Uso Diário
     │              │                │                  │
  Abre app     Define senha      Adiciona YouTube    Busca e copia
  no browser   mestra (1x)       como teste          quando precisa
```

| Etapa | Ação | Touchpoint | Emoção |
|-------|------|------------|--------|
| 1 | Acessa URL do app | Tela de login | Curiosidade |
| 2 | Cria senha mestra | Formulário setup | Confiança |
| 3 | Vê dashboard vazio | Dashboard | Orientação |
| 4 | Adiciona 1ª credencial | Modal/form CRUD | Satisfação |
| 5 | Copia senha com 1 clique | Card credencial | Encantamento |

### 3.2 Jornada: Uso Diário

```
Preciso logar → Abro vault → Busco app → Copio credencial → Colo no serviço
```

| Etapa | Tempo Target | Feature |
|-------|--------------|---------|
| Abrir e autenticar | < 3 seg | Senha mestra + sessão |
| Encontrar credencial | < 2 seg | Busca global / favoritos |
| Copiar campo | < 1 seg | Copy 1-clique |

### 3.3 Jornada: Manutenção do Vault

```
Revisar saúde → Identificar senhas fracas → Regenerar → Exportar backup
```

---

## 4. Escopo Funcional

### 4.1 In Scope (v1.0 + v1.5)

Features derivadas do output do Feature Suggester, **exceto funcionalidades futuras** (Passkeys, Sync Multi-dispositivo E2E):

| ID | Feature | Prioridade | Status |
|----|---------|------------|--------|
| F-00 | CRUD de credenciais | P1 | Existente |
| F-01 | Filtros por usuário, email, app | P1 | Existente |
| F-02 | Gerador de senha | P1 | Existente |
| F-03 | Autenticação com senha mestra | P1 | Novo |
| F-04 | Criptografia de dados em repouso | P1 | Novo |
| F-05 | Dashboard com visão geral | P1 | Novo |
| F-06 | Busca global instantânea | P1 | Novo |
| F-07 | Copiar com um clique | P1 | Novo |
| F-08 | Visualização segura de senha | P1 | Novo |
| F-09 | Ícones e branding automático | P1 | Novo |
| F-10 | Modo escuro e temas | P1 | Novo |
| F-11 | Categorização por serviço | P2 | Novo |
| F-12 | Avaliador de saúde das senhas | P2 | Novo |
| F-13 | Campos customizáveis | P2 | Novo |
| F-14 | Favoritos e acesso rápido | P2 | Novo |
| F-15 | Exportação e backup | P2 | Novo |
| F-16 | Importação CSV/JSON | P2 | Novo |
| F-17 | Animações e microinterações | P2 | Novo |
| F-18 | Modo privacidade / Panic button | P3 | Novo |
| F-19 | PWA offline-first | P2 | Novo |
| F-20 | Histórico de alterações de senha | P3 | Novo |

### 4.2 Out of Scope

| Feature | Motivo |
|---------|--------|
| Suporte a Passkeys (WebAuthn) | Funcionalidade futura — Fase 4 |
| Sync multi-dispositivo E2E | Funcionalidade futura — Fase 4 |
| Autofill via extensão browser (F-21) | Release 2.0 cancelada |
| Gerador TOTP / 2FA (F-22) | Release 2.0 cancelada |
| Compartilhamento familiar/equipe | Single-user by design |
| SSO / Active Directory | Fora do escopo pessoal |
| Monetização / planos pagos | Projeto pessoal |

---

## 5. Requisitos Não-Funcionais

### 5.1 Stack Tecnológica (Obrigatória)

| Camada | Tecnologia |
|--------|------------|
| Framework | **Next.js** (React) |
| API / Backend | **Next.js API Routes** |
| ORM / Banco | **Prisma ORM** |
| UI / Estilização | **Chakra UI v3** |
| Linguagem | TypeScript |

### 5.2 Responsividade

| Breakpoint | Dispositivo | Requisito |
|------------|-------------|-----------|
| ≥ 1280px | Desktop | Layout com sidebar + grid de cards |
| 768px – 1279px | Tablet | Layout adaptado, sidebar colapsável |
| < 768px | Mobile | Layout single column, navegação bottom ou drawer |

Todos os componentes Chakra UI devem ser testados nos três breakpoints.

### 5.3 Segurança

| Requisito | Detalhe |
|-----------|---------|
| RNF-SEC-01 | Senha mestra com hash Argon2 ou bcrypt |
| RNF-SEC-02 | Credenciais criptografadas em repouso (AES-256) |
| RNF-SEC-03 | Senhas nunca retornadas em plain text na API sem autenticação |
| RNF-SEC-04 | Sessão com timeout configurável (padrão: 15 min) |
| RNF-SEC-05 | HTTPS obrigatório em produção |
| RNF-SEC-06 | Rate limiting na rota de login |

### 5.4 Performance

| Requisito | Target |
|-----------|--------|
| RNF-PERF-01 | Busca com debounce ≤ 300ms, resultados < 100ms |
| RNF-PERF-02 | First Contentful Paint < 2s |
| RNF-PERF-03 | Time to Interactive < 3s |
| RNF-PERF-04 | Suporte a 500+ credenciais sem degradação perceptível |

### 5.5 Acessibilidade

| Requisito | Detalhe |
|-----------|---------|
| RNF-A11Y-01 | Contraste WCAG AA (Chakra UI tokens) |
| RNF-A11Y-02 | Navegação por teclado em todos os formulários |
| RNF-A11Y-03 | Labels e aria-labels em campos sensíveis |
| RNF-A11Y-04 | Focus visible em elementos interativos |

### 5.6 Usabilidade

| Requisito | Detalhe |
|-----------|---------|
| RNF-UX-01 | Onboarding completo em ≤ 60 segundos |
| RNF-UX-02 | Feedback visual (toast) em todas as ações de copy/save/delete |
| RNF-UX-03 | Estados de loading, empty e error em todas as listagens |
| RNF-UX-04 | Confirmação antes de exclusão de credencial |

---

## 6. Modelo de Dados (Conceitual)

### 6.1 Entidade: Credential

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | UUID | Sim | Identificador único |
| appName | String | Sim | Nome do aplicativo/serviço |
| username | String | Não | Nome de usuário |
| email | String | Não | Email associado |
| password | String (encrypted) | Sim | Senha criptografada |
| url | String | Não | URL do serviço |
| category | Enum | Não | Categoria (Social, Streaming, etc.) |
| iconUrl | String | Não | URL do favicon/logo |
| isFavorite | Boolean | Não | Marcado como favorito |
| customFields | JSON | Não | Campos extras dinâmicos |
| passwordStrength | Int | Não | Score 0-100 |
| createdAt | DateTime | Sim | Data de criação |
| updatedAt | DateTime | Sim | Última modificação |

### 6.2 Entidade: VaultConfig

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Config singleton |
| masterPasswordHash | String | Hash da senha mestra |
| sessionTimeout | Int | Minutos (padrão 15) |
| theme | Enum | light / dark / system |
| accentColor | String | Cor de destaque |

### 6.3 Entidade: PasswordHistory (P3)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador |
| credentialId | UUID | FK para Credential |
| changedAt | DateTime | Data da alteração |
| strength | Int | Score na época |

---

## 7. Integrações

| Integração | Uso | Prioridade |
|------------|-----|------------|
| Google Favicon API | Ícones automáticos dos apps | P1 |
| Clearbit Logo API | Fallback para logos | P2 |
| Have I Been Pwned | Verificação de breaches (futuro) | P3 |

---

## 8. Restrições e Premissas

### 8.1 Restrições

- Single-user: sem multi-tenancy ou autenticação OAuth
- Sem orçamento para serviços cloud pagos
- Desenvolvimento solo ou equipe pequena

### 8.2 Premissas

- Usuário acessa via browser moderno (Chrome, Firefox, Safari, Edge)
- Banco de dados relacional disponível (PostgreSQL ou SQLite via Prisma)
- Node.js 18+ para Next.js App Router

---

## 9. Dependências Entre Módulos

```
Senha Mestra ──► Criptografia ──► CRUD Seguro
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
               Dashboard          Busca Global      Copy 1-clique
                    │                 │                 │
                    └────────► Ícones + Temas ◄────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
              Categorias        Favoritos         Health Score
                    │                                   │
                    └────────► Export/Import ◄──────────┘
```

---

## 10. Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Perda de senha mestra | Alta | Crítico | Export reminder + documentação |
| Complexidade de criptografia | Média | Alto | Libs testadas (crypto nativo Node) |
| Chakra UI v3 breaking changes | Baixa | Médio | Fixar versão, testes visuais |
| API de favicons indisponível | Baixa | Baixo | Fallback com iniciais coloridas |

---

## 11. Referências

- `outputs/feature-suggester/feature-suggestions.md`
- `outputs/feature-suggester/feature-roadmap.md`
- `outputs/feature-suggester/value-proposition.md`
- `templates/product-owner-prompt.md`
