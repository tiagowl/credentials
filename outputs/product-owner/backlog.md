# Backlog Priorizado — Gerenciador de Credenciais Pessoal

**Projeto:** Credentials Vault  
**Data:** 2026-05-26  
**Agente:** Product Owner  
**Metodologia:** MoSCoW + Story Points

---

## Legenda de Prioridades

| Prioridade | Significado | Ação |
|------------|-------------|------|
| **P1 — Must Have** | Essencial para MVP/v1.0 | Sprint 1-2 |
| **P2 — Should Have** | Importante, entrega valor significativo | Sprint 3-4 |
| **P3 — Could Have** | Desejável, se houver capacidade | Sprint 5+ |

---

## Visão do Backlog por Release

```
Release 0.5 (MVP+)     Release 1.0 (Polish)    Release 1.5 (Final)
─────────────────      ──────────────────      ─────────────────
Sprint 1-2             Sprint 3-4              Sprint 5-6
Auth + CRUD seguro     Visual + Organização    Backup + PWA
Busca + Copy           Health + Temas          Import + Campos
Dashboard              Categorias + Fav        Custom fields + Panic + Histórico
```

---

## Sprint 1 — Foundation: Segurança e CRUD (2 semanas)

**Objetivo:** Vault protegido com CRUD funcional e responsivo.

| # | ID | User Story | SP | Prioridade | Status |
|---|-----|-----------|-----|------------|--------|
| 1 | US-001 | Configurar senha mestra no primeiro acesso | 5 | P1 | To Do |
| 2 | US-002 | Fazer login com senha mestra | 3 | P1 | To Do |
| 3 | US-004 | Sessão expirar por inatividade | 3 | P1 | To Do |
| 4 | US-005 | Criar nova credencial | 5 | P1 | Refinar |
| 5 | US-006 | Editar credencial existente | 3 | P1 | Refinar |
| 6 | US-007 | Excluir credencial | 2 | P1 | Refinar |
| 7 | US-008 | Gerar senha segura ao salvar | 3 | P1 | Refinar |
| 8 | US-010 | Visualizar senha com toggle show/hide | 2 | P1 | To Do |
| 9 | US-014 | Layout responsivo (desktop/tablet/mobile) | 8 | P1 | To Do |

**Sprint Goal:** Usuário autenticado consegue CRUD completo de credenciais em qualquer dispositivo.

**Total SP:** 34

---

## Sprint 2 — Foundation: Busca, Copy e Dashboard (2 semanas)

**Objetivo:** Encontrar e copiar credenciais em segundos.

| # | ID | User Story | SP | Prioridade | Status |
|---|-----|-----------|-----|------------|--------|
| 1 | US-012 | Dashboard com visão geral | 5 | P1 | To Do |
| 2 | US-015 | Busca global em tempo real | 3 | P1 | To Do |
| 3 | US-016 | Filtrar por usuário, email e app | 2 | P1 | Refinar |
| 4 | US-017 | Copiar com um clique | 3 | P1 | To Do |
| 5 | US-018 | Feedback toast ao copiar | 1 | P2 | To Do |
| 6 | US-003 | Bloquear vault manualmente | 2 | P2 | To Do |
| 7 | US-011 | Indicador de força da senha | 3 | P2 | To Do |

**Sprint Goal:** Usuário encontra e copia credencial em < 5 segundos via dashboard ou busca.

**Total SP:** 19

**Milestone:** Release 0.5 — MVP+ funcional

---

## Sprint 3 — Polish: Visual e Identidade (2 semanas)

**Objetivo:** Interface bonita, moderna e profissional.

| # | ID | User Story | SP | Prioridade | Status |
|---|-----|-----------|-----|------------|--------|
| 1 | US-019 | Ícone automático do app | 5 | P1 | To Do |
| 2 | US-020 | Modo claro/escuro | 3 | P1 | To Do |
| 3 | US-021 | Tema seguindo preferência do sistema | 2 | P2 | To Do |
| 4 | US-023 | Microinterações e animações | 3 | P2 | To Do |
| 5 | US-013 | Favoritos e acesso rápido | 3 | P2 | To Do |

**Sprint Goal:** Interface visualmente comparável a password manager comercial.

**Total SP:** 16

---

## Sprint 4 — Polish: Organização e Saúde (2 semanas)

**Objetivo:** Vault organizado com consciência de segurança.

| # | ID | User Story | SP | Prioridade | Status |
|---|-----|-----------|-----|------------|--------|
| 1 | US-024 | Categorizar por tipo de serviço | 5 | P2 | To Do |
| 2 | US-025 | Filtrar por categoria | 2 | P2 | To Do |
| 3 | US-026 | Score de saúde do vault | 5 | P2 | To Do |
| 4 | US-027 | Identificar senhas fracas/reutilizadas | 5 | P2 | To Do |
| 5 | US-028 | Regenerar senha do health panel | 3 | P2 | To Do |
| 6 | US-022 | Personalizar cor de destaque | 2 | P3 | To Do |

**Sprint Goal:** Usuário organiza credenciais e monitora saúde do vault.

**Total SP:** 22

**Milestone:** Release 1.0 — Objetivo de produto atingido

---

## Sprint 5 — Power: Campos e Backup (2 semanas)

**Objetivo:** Flexibilidade e segurança dos dados.

| # | ID | User Story | SP | Prioridade | Status |
|---|-----|-----------|-----|------------|--------|
| 1 | US-009 | Campos customizáveis | 5 | P2 | To Do |
| 2 | US-029 | Exportar JSON criptografado | 5 | P2 | To Do |
| 3 | US-031 | Importar JSON/CSV com preview | 8 | P2 | To Do |
| 4 | US-030 | Exportar CSV | 3 | P3 | To Do |

**Sprint Goal:** Usuário exporta, importa e personaliza campos sem perder dados.

**Total SP:** 21

---

## Sprint 6 — Power: PWA e Offline (2 semanas)

**Objetivo:** App instalável e acessível offline.

| # | ID | User Story | SP | Prioridade | Status |
|---|-----|-----------|-----|------------|--------|
| 1 | US-032 | PWA offline-first | 8 | P2 | To Do |
| 2 | US-033 | Modo privacidade (panic button) | 2 | P3 | To Do |
| 3 | US-034 | Histórico de alterações de senha | 5 | P3 | To Do |

**Sprint Goal:** App instalável como PWA com funcionalidade offline.

**Total SP:** 15

**Milestone:** Release 1.5 — Entrega final do produto

---

## Backlog Consolidado (ordenado por prioridade)

| Rank | ID | User Story | SP | Prioridade | Sprint |
|------|-----|-----------|-----|------------|--------|
| 1 | US-001 | Configurar senha mestra | 5 | P1 | 1 |
| 2 | US-002 | Login com senha mestra | 3 | P1 | 1 |
| 3 | US-004 | Sessão por inatividade | 3 | P1 | 1 |
| 4 | US-005 | Criar credencial | 5 | P1 | 1 |
| 5 | US-006 | Editar credencial | 3 | P1 | 1 |
| 6 | US-007 | Excluir credencial | 2 | P1 | 1 |
| 7 | US-008 | Gerar senha | 3 | P1 | 1 |
| 8 | US-010 | Toggle show/hide senha | 2 | P1 | 1 |
| 9 | US-014 | Layout responsivo | 8 | P1 | 1 |
| 10 | US-012 | Dashboard | 5 | P1 | 2 |
| 11 | US-015 | Busca global | 3 | P1 | 2 |
| 12 | US-016 | Filtros | 2 | P1 | 2 |
| 13 | US-017 | Copy 1-clique | 3 | P1 | 2 |
| 14 | US-019 | Ícones automáticos | 5 | P1 | 3 |
| 15 | US-020 | Dark/light mode | 3 | P1 | 3 |
| 16 | US-003 | Bloquear vault | 2 | P2 | 2 |
| 17 | US-011 | Força da senha | 3 | P2 | 2 |
| 18 | US-018 | Toast ao copiar | 1 | P2 | 2 |
| 19 | US-013 | Favoritos | 3 | P2 | 3 |
| 20 | US-021 | Tema do sistema | 2 | P2 | 3 |
| 21 | US-023 | Animações | 3 | P2 | 3 |
| 22 | US-024 | Categorias | 5 | P2 | 4 |
| 23 | US-025 | Filtro por categoria | 2 | P2 | 4 |
| 24 | US-026 | Health score | 5 | P2 | 4 |
| 25 | US-027 | Senhas fracas | 5 | P2 | 4 |
| 26 | US-028 | Regenerar do health | 3 | P2 | 4 |
| 27 | US-009 | Campos customizáveis | 5 | P2 | 5 |
| 28 | US-029 | Export JSON | 5 | P2 | 5 |
| 29 | US-031 | Import JSON/CSV | 8 | P2 | 5 |
| 30 | US-032 | PWA offline | 8 | P2 | 6 |
| 31 | US-022 | Accent color | 2 | P3 | 4 |
| 32 | US-030 | Export CSV | 3 | P3 | 5 |
| 33 | US-033 | Panic button | 2 | P3 | 6 |
| 34 | US-034 | Histórico senha | 5 | P3 | 6 |

---

## Dependências Críticas

| Story | Depende de | Bloqueia |
|-------|-----------|----------|
| US-002 | US-001 | Todas as stories autenticadas |
| US-005 | US-002 | US-006 a US-034 |
| US-012 | US-005 | US-013 |
| US-017 | US-005 | US-018 |
| US-019 | US-005 | — |
| US-026 | US-005, US-011 | US-027, US-028 |
| US-029 | US-002 | US-031 |
| US-031 | US-029 | — |

---

## Capacidade e Velocity

| Sprint | SP Planejado | Duração | Notas |
|--------|-------------|---------|-------|
| Sprint 1 | 34 | 2 sem | Setup Next.js + Prisma + Chakra incluído |
| Sprint 2 | 19 | 2 sem | — |
| Sprint 3 | 16 | 2 sem | — |
| Sprint 4 | 22 | 2 sem | Release 1.0 |
| Sprint 5 | 21 | 2 sem | — |
| Sprint 6 | 15 | 2 sem | Release 1.5 (final) |

**Velocity estimada:** 15-20 SP/sprint (dev solo)

---

## Definition of Done (DoD)

Uma user story só é considerada **Done** quando:

- [ ] Código implementado em Next.js com TypeScript
- [ ] API Route + Prisma funcionando
- [ ] UI com Chakra UI v3
- [ ] Responsivo em desktop (≥1280px), tablet (768px) e mobile (<768px)
- [ ] Critérios de aceitação validados
- [ ] Sem regressões em features existentes
- [ ] Estados loading/empty/error implementados

---

## Itens Explicitamente Fora do Backlog

| Feature | Motivo |
|---------|--------|
| Passkeys (WebAuthn) | Funcionalidade futura — Fase 4 |
| Sync multi-dispositivo E2E | Funcionalidade futura — Fase 4 |
| Gerador TOTP (2FA) — US-035 | Release 2.0 cancelada |
| Autofill via extensão — US-036 | Release 2.0 cancelada |
| Multi-user / compartilhamento | Fora do escopo single-user |

---

## Notas de Refinamento

1. **Sprint 1** inclui setup inicial do projeto (Next.js App Router, Prisma schema, Chakra UI v3 provider, layout base responsivo)
2. Stories marcadas como **Refinar** já existem parcialmente — foco em integrar com nova stack e critérios de aceitação
3. **US-014** (responsividade) é transversal — deve ser validada em cada sprint, não apenas no Sprint 1
4. Criptografia (F-04) é requisito técnico transversal implementado junto com US-001/US-005 via API Routes
