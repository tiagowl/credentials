# Critérios de Aceitação — Gerenciador de Credenciais Pessoal

**Projeto:** Credentials Vault  
**Data:** 2026-05-26  
**Agente:** Product Owner  
**Stack:** Next.js · Prisma · Chakra UI v3

---

## EPIC-01: Autenticação e Segurança

### US-001: Configurar senha mestra no primeiro acesso

**Cenários de sucesso:**
- [ ] Ao acessar o app pela primeira vez (vault vazio), sou redirecionado para tela de setup
- [ ] Formulário exige senha mestra com mínimo 8 caracteres
- [ ] Formulário exige confirmação de senha (deve ser igual)
- [ ] Indicador visual de força da senha mestra é exibido
- [ ] Após submit, hash é salvo via API Route (`POST /api/vault/setup`) com Prisma
- [ ] Sou redirecionado ao dashboard após setup bem-sucedido

**Casos extremos:**
- [ ] Senhas diferentes na confirmação → mensagem de erro clara
- [ ] Senha com menos de 8 caracteres → validação impede submit
- [ ] Tentativa de setup quando vault já existe → redireciona para login

**Validações:**
- [ ] Senha mestra nunca armazenada em plain text (apenas hash Argon2/bcrypt)
- [ ] Funciona em desktop, tablet e mobile

---

### US-002: Fazer login com senha mestra

**Cenários de sucesso:**
- [ ] Tela de login exibida quando vault já configurado
- [ ] Login bem-sucedido com senha correta → redireciona ao dashboard
- [ ] Sessão criada via cookie httpOnly ou JWT seguro
- [ ] API Route `POST /api/auth/login` valida hash com Prisma

**Casos extremos:**
- [ ] Senha incorreta → mensagem "Senha incorreta" sem revelar se vault existe
- [ ] 5 tentativas falhas → bloqueio temporário (rate limiting, 5 min)
- [ ] Campo vazio → validação impede submit

**Validações:**
- [ ] Rotas protegidas redirecionam para login se sessão inválida
- [ ] Layout responsivo com Chakra UI FormControl

---

### US-003: Bloquear vault manualmente

**Cenários de sucesso:**
- [ ] Botão "Bloquear" visível no header em todas as páginas autenticadas
- [ ] Atalho `Ctrl+L` bloqueia vault instantaneamente
- [ ] Após bloqueio, redireciona para tela de login (sessão invalidada)

**Casos extremos:**
- [ ] Bloqueio durante edição de credencial → dados não salvos são perdidos (com aviso se dirty)

---

### US-004: Sessão expirar por inatividade

**Cenários de sucesso:**
- [ ] Após 15 minutos sem interação, sessão expira automaticamente
- [ ] Modal de aviso 1 minuto antes da expiração com opção "Continuar"
- [ ] Timeout configurável em settings (5, 15, 30, 60 min)

**Casos extremos:**
- [ ] Múltiplas abas abertas → inatividade em todas dispara logout
- [ ] Atividade em qualquer aba reseta timer

---

## EPIC-02: CRUD de Credenciais

### US-005: Criar nova credencial

**Cenários de sucesso:**
- [ ] Botão "Nova Credencial" abre modal/form com campos: appName*, username, email, password*
- [ ] Submit chama `POST /api/credentials` via Prisma
- [ ] Senha criptografada antes de persistir no banco
- [ ] Toast de sucesso "Credencial criada"
- [ ] Lista atualizada sem reload completo

**Casos extremos:**
- [ ] appName vazio → erro de validação
- [ ] password vazio → erro de validação
- [ ] appName duplicado → permitido (mesmo app, contas diferentes)
- [ ] Caracteres especiais em todos os campos → salvos corretamente

**Validações:**
- [ ] Form responsivo: modal em desktop, drawer/fullscreen em mobile
- [ ] Chakra UI Input com type="password" por padrão

---

### US-006: Editar credencial existente

**Cenários de sucesso:**
- [ ] Clicar em credencial abre form preenchido com dados atuais
- [ ] Submit chama `PUT /api/credentials/[id]`
- [ ] Toast "Credencial atualizada"
- [ ] `updatedAt` atualizado no banco

**Casos extremos:**
- [ ] Credencial inexistente (ID inválido) → 404 com mensagem amigável
- [ ] Cancelar edição → nenhuma alteração persistida

---

### US-007: Excluir credencial

**Cenários de sucesso:**
- [ ] Botão excluir abre AlertDialog de confirmação (Chakra UI)
- [ ] Confirmar chama `DELETE /api/credentials/[id]`
- [ ] Toast "Credencial excluída"
- [ ] Item removido da lista

**Casos extremos:**
- [ ] Cancelar confirmação → nada excluído
- [ ] Excluir credencial favorita → removida de favoritos também

---

### US-008: Gerar senha segura ao salvar

**Cenários de sucesso:**
- [ ] Botão "Gerar Senha" no form preenche campo password
- [ ] Senha gerada: mínimo 16 chars, maiúsculas, minúsculas, números, símbolos
- [ ] Opções configuráveis: comprimento (12-32), incluir/excluir símbolos
- [ ] Senha gerada passa no indicador de força (score ≥ 80)

**Casos extremos:**
- [ ] Gerar múltiplas vezes → senhas diferentes a cada clique
- [ ] Copiar senha gerada antes de salvar → funciona via clipboard API

---

### US-009: Adicionar campos customizáveis

**Cenários de sucesso:**
- [ ] Botão "Adicionar campo" no form de credencial
- [ ] Tipos disponíveis: URL, Notas (textarea), PIN, Backup Codes, Texto livre
- [ ] Campos salvos como JSON em `customFields` via Prisma
- [ ] Campos customizados exibidos no card/detalhe da credencial
- [ ] Copy 1-clique funciona em campos customizados

**Casos extremos:**
- [ ] Remover campo customizado → confirmado antes de excluir
- [ ] Máximo 10 campos customizados por credencial
- [ ] Campo URL validado como URL válida

---

### US-010: Visualizar senha com toggle show/hide

**Cenários de sucesso:**
- [ ] Senha oculta (••••••) por padrão em listagem e detalhe
- [ ] Ícone olho alterna visibilidade
- [ ] Estado reseta para oculto ao navegar para outra página

**Casos extremos:**
- [ ] Toggle em mobile funciona com touch ( área mínima 44x44px )
- [ ] Screen reader anuncia "Senha oculta" / "Senha visível"

---

### US-011: Ver indicador de força da senha

**Cenários de sucesso:**
- [ ] Barra colorida (vermelho/amarelo/verde) abaixo do campo password
- [ ] Score calculado: comprimento, variedade de chars, padrões comuns
- [ ] Label textual: "Fraca", "Média", "Forte", "Excelente"
- [ ] Score persistido em `passwordStrength` no banco

**Casos extremos:**
- [ ] Senha "123456" → score ≤ 20, vermelho
- [ ] Senha gerada pelo sistema → score ≥ 80, verde

---

## EPIC-03: Dashboard e Navegação

### US-012: Ver dashboard com visão geral

**Cenários de sucesso:**
- [ ] Dashboard exibe: total de credenciais, adicionadas esta semana, últimas 5 modificadas
- [ ] Atalho "Nova Credencial" proeminente
- [ ] Barra de busca global acessível no topo
- [ ] Layout grid de cards em desktop, lista em mobile

**Casos extremos:**
- [ ] Vault vazio → empty state ilustrado com CTA "Adicione sua primeira credencial"
- [ ] 500+ credenciais → paginação ou virtual scroll sem lag

---

### US-013: Acessar favoritos rapidamente

**Cenários de sucesso:**
- [ ] Ícone estrela em cada card toggle favorito
- [ ] Seção "Favoritos" no dashboard (topo ou sidebar)
- [ ] `isFavorite: true` persistido via Prisma
- [ ] Favoritos aparecem independente de ordenação/filtro

**Casos extremos:**
- [ ] Zero favoritos → seção oculta ou empty state "Marque credenciais como favoritas"
- [ ] Máximo ilimitado de favoritos

---

### US-014: Navegar responsivamente

**Cenários de sucesso:**
- [ ] **Desktop (≥1280px):** Sidebar fixa + grid 3-4 colunas
- [ ] **Tablet (768-1279px):** Sidebar colapsável + grid 2 colunas
- [ ] **Mobile (<768px):** Bottom nav ou hamburger drawer + lista single column
- [ ] Todos os forms e modals adaptados por breakpoint
- [ ] Touch targets ≥ 44px em mobile

**Casos extremos:**
- [ ] Rotação de tela tablet → layout recalcula
- [ ] Zoom 200% → conteúdo permanece usável

**Validações:**
- [ ] Testado em Chrome, Firefox, Safari
- [ ] Chakra UI responsive props (`base`, `md`, `lg`, `xl`)

---

## EPIC-04: Busca, Filtros e Copy

### US-015: Buscar credenciais em tempo real

**Cenários de sucesso:**
- [ ] Input de busca no header, visível em todas as páginas
- [ ] Debounce 300ms, busca em appName, username, email, url
- [ ] Resultados filtrados instantaneamente (< 100ms para 500 items)
- [ ] Highlight do termo buscado nos resultados
- [ ] `GET /api/credentials?search=termo` via Prisma

**Casos extremos:**
- [ ] Busca vazia → exibe todas credenciais
- [ ] Termo sem resultados → empty state "Nenhuma credencial encontrada"
- [ ] Caracteres especiais e acentos → busca funciona
- [ ] Busca case-insensitive

---

### US-016: Filtrar por usuário, email e app

**Cenários de sucesso:**
- [ ] Filtros dropdown/chips para: appName, username, email
- [ ] Filtros combináveis (AND logic)
- [ ] Botão "Limpar filtros"
- [ ] Filtros persistem durante sessão

**Casos extremos:**
- [ ] Filtro + busca simultâneos → resultados intersectam
- [ ] Valores parciais → match parcial (contains)

---

### US-017: Copiar com um clique

**Cenários de sucesso:**
- [ ] Botões copy ao lado de username, email e password em cada card
- [ ] Clique copia valor para clipboard via Clipboard API
- [ ] Ícone muda temporariamente para check (2 seg)
- [ ] Funciona em HTTPS e localhost

**Casos extremos:**
- [ ] Clipboard API indisponível → fallback com textarea oculto
- [ ] Copiar em mobile → feedback tátil/visual claro

---

### US-018: Receber feedback ao copiar

**Cenários de sucesso:**
- [ ] Toast Chakra UI: "Usuário copiado" / "Email copiado" / "Senha copiada"
- [ ] Toast desaparece após 3 segundos
- [ ] Posição: bottom-right desktop, bottom-center mobile

---

## EPIC-05: Experiência Visual e Temas

### US-019: Ver ícone automático do app

**Cenários de sucesso:**
- [ ] Ao digitar appName, favicon buscado via Google Favicon API
- [ ] Ícone exibido no form (preview) e no card da credencial
- [ ] URL do ícone salva em `iconUrl` via Prisma
- [ ] Fallback: círculo colorido com inicial do app (ex: "Y" para YouTube)

**Casos extremos:**
- [ ] API de favicon indisponível → fallback imediato, sem erro visível
- [ ] App desconhecido → fallback com iniciais
- [ ] appName editado → ícone atualizado

---

### US-020: Alternar modo claro/escuro

**Cenários de sucesso:**
- [ ] Toggle sol/lua no header
- [ ] Tema persiste em localStorage e VaultConfig (Prisma)
- [ ] Transição suave entre temas (CSS transition 200ms)
- [ ] Todos os componentes Chakra UI respeitam colorMode

**Casos extremos:**
- [ ] Primeiro acesso → segue preferência do sistema (US-021)
- [ ] Imagens/ícones legíveis em ambos os temas

---

### US-021: Respeitar preferência do sistema

**Cenários de sucesso:**
- [ ] Opção "Sistema" além de Claro/Escuro
- [ ] `prefers-color-scheme` detectado via `matchMedia`
- [ ] Mudança no OS reflete automaticamente quando "Sistema" selecionado

---

### US-022: Personalizar cor de destaque

**Cenários de sucesso:**
- [ ] Seletor de cor em Settings com 6-8 presets
- [ ] Cor aplicada em buttons, links, badges via Chakra theme
- [ ] Persistida em VaultConfig

---

### US-023: Microinterações e animações

**Cenários de sucesso:**
- [ ] Fade-in ao carregar cards de credenciais
- [ ] Scale animation no botão copy ao clicar
- [ ] Slide-in para modals e drawers
- [ ] Animações respeitam `prefers-reduced-motion`

**Casos extremos:**
- [ ] `prefers-reduced-motion: reduce` → animações desabilitadas

---

## EPIC-06: Organização e Categorização

### US-024: Categorizar credenciais

**Cenários de sucesso:**
- [ ] Select/chip com categorias: Redes Sociais, Streaming, Email, Bancos, Trabalho, Outros
- [ ] Auto-sugestão baseada em appName (ex: "Facebook" → Redes Sociais)
- [ ] Badge colorido da categoria no card
- [ ] Campo `category` persistido via Prisma enum

---

### US-025: Filtrar por categoria

**Cenários de sucesso:**
- [ ] Chips de categoria clicáveis acima da lista
- [ ] Múltiplas categorias selecionáveis
- [ ] Contador por categoria (ex: "Redes Sociais (5)")

---

## EPIC-07: Saúde e Qualidade das Senhas

### US-026: Ver score de saúde do vault

**Cenários de sucesso:**
- [ ] Widget no dashboard: score 0-100 com cor (vermelho/amarelo/verde)
- [ ] Breakdown: % senhas fortes, % únicas, % atualizadas (< 1 ano)
- [ ] API Route `GET /api/vault/health` calcula métricas

---

### US-027: Identificar senhas fracas e reutilizadas

**Cenários de sucesso:**
- [ ] Lista filtrada de credenciais com score < 50
- [ ] Lista de senhas duplicadas (hash match)
- [ ] Link direto para editar cada credencial problemática

---

### US-028: Regenerar senha do health panel

**Cenários de sucesso:**
- [ ] Botão "Melhorar" ao lado de cada credencial fraca
- [ ] Abre form de edição com senha gerada pre-preenchida
- [ ] Após salvar, score do vault recalculado

---

## EPIC-08: Backup, Import e Portabilidade

### US-029: Exportar JSON criptografado

**Cenários de sucesso:**
- [ ] Botão "Exportar" em Settings
- [ ] Solicita senha mestra para confirmar
- [ ] Download de arquivo `.vault.json` criptografado (AES-256)
- [ ] Arquivo contém todas credenciais + metadata

**Casos extremos:**
- [ ] Senha mestra incorreta → export cancelado
- [ ] Vault vazio → aviso "Nada para exportar"

---

### US-030: Exportar CSV

**Cenários de sucesso:**
- [ ] Opção CSV com AlertDialog avisando riscos de segurança
- [ ] Senhas em plain text no CSV (usuário confirma explicitamente)
- [ ] Download de `.vault.csv`

---

### US-031: Importar JSON/CSV

**Cenários de sucesso:**
- [ ] Upload de arquivo via input file
- [ ] Preview tabular dos dados antes de importar
- [ ] Opções: merge (adicionar) ou replace (substituir tudo)
- [ ] Relatório pós-import: X criadas, Y ignoradas, Z erros
- [ ] JSON criptografado requer senha mestra

**Casos extremos:**
- [ ] Formato inválido → erro claro
- [ ] Duplicatas → opção skip ou overwrite
- [ ] Arquivo > 5MB → aviso de performance

---

### US-032: PWA offline-first

**Cenários de sucesso:**
- [ ] manifest.json configurado (nome, ícones, theme_color)
- [ ] Service Worker cacheia assets estáticos
- [ ] Credenciais consultáveis offline (IndexedDB ou cache API)
- [ ] Prompt "Instalar app" em browsers compatíveis
- [ ] Ícone na home screen mobile

**Casos extremos:**
- [ ] Offline → CRUD funciona localmente, sync ao reconectar (se aplicável)
- [ ] Safari iOS → Add to Home Screen funcional

---

## EPIC-09: Privacidade e Histórico

### US-033: Modo privacidade (panic button)

**Cenários de sucesso:**
- [ ] Atalho `Ctrl+H` oculta todas senhas visíveis instantaneamente
- [ ] Todas toggles de show/hide resetam para oculto
- [ ] Overlay escuro opcional com mensagem "Vault oculto"

---

### US-034: Histórico de alterações de senha

**Cenários de sucesso:**
- [ ] Timeline no detalhe da credencial: "Senha alterada em DD/MM/YYYY"
- [ ] Registro criado via Prisma PasswordHistory a cada update de password
- [ ] Exibe score na época da alteração

---

## Fora de Escopo (Release 2.0 cancelada)

As stories **US-035** (TOTP 2FA) e **US-036** (Autofill via extensão) não possuem critérios de aceitação ativos — foram removidas do backlog.

---

## Critérios Transversais (aplicam a TODAS as stories)

| Critério | Descrição |
|----------|-----------|
| **Stack** | Next.js App Router + API Routes + Prisma + Chakra UI v3 |
| **Responsividade** | Funcional em desktop, tablet e mobile |
| **Acessibilidade** | WCAG AA, keyboard navigation, aria-labels |
| **Estados UI** | Loading skeleton, empty state, error boundary |
| **Segurança** | Dados sensíveis criptografados; HTTPS em produção |
| **i18n** | Textos em português (pt-BR) |
| **Performance** | Sem layout shift; lazy load de ícones |

---

## Matriz de Rastreabilidade

| User Story | Requisito (requirements.md) | Feature (feature-suggester) |
|------------|----------------------------|----------------------------|
| US-001 a US-004 | RNF-SEC-01 a 06, F-03, F-04 | #6 Autenticação |
| US-005 a US-011 | F-00, F-02, F-08, F-10 | CRUD + Visualização |
| US-012 a US-014 | F-05, RNF-UX | #1 Dashboard |
| US-015 a US-018 | F-06, F-07 | #2 Busca, #3 Copy |
| US-019 a US-023 | F-09, F-10, F-17 | #7 Ícones, #8 Temas |
| US-024 a US-025 | F-11 | #5 Categorização |
| US-026 a US-028 | F-12 | #9 Health Score |
| US-029 a US-031 | F-15, F-16 | Export/Import |
| US-032 | F-19 | PWA |
| US-033 | F-18 | Panic Button |
| US-034 | F-20 | Histórico |
