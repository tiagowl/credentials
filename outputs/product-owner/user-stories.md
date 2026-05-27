# User Stories — Gerenciador de Credenciais Pessoal

**Projeto:** Credentials Vault  
**Data:** 2026-05-26  
**Agente:** Product Owner  
**Stack:** Next.js · Prisma · Chakra UI v3

---

## Épicos

| Épico | Descrição | Prioridade |
|-------|-----------|------------|
| EPIC-01 | Autenticação e Segurança do Vault | P1 |
| EPIC-02 | CRUD de Credenciais | P1 |
| EPIC-03 | Dashboard e Navegação | P1 |
| EPIC-04 | Busca, Filtros e Copy | P1 |
| EPIC-05 | Experiência Visual e Temas | P1 |
| EPIC-06 | Organização e Categorização | P2 |
| EPIC-07 | Saúde e Qualidade das Senhas | P2 |
| EPIC-08 | Backup, Import e Portabilidade | P2 |
| EPIC-09 | Privacidade e Histórico | P3 |

---

## EPIC-01: Autenticação e Segurança do Vault

### US-001: Configurar senha mestra no primeiro acesso

**Como** usuário do vault  
**Eu quero** definir uma senha mestra na primeira vez que acesso o sistema  
**Para que** apenas eu possa acessar minhas credenciais armazenadas

| Atributo | Valor |
|----------|-------|
| Prioridade | P1 |
| Story Points | 5 |
| Épico | EPIC-01 |
| Dependências | — |

---

### US-002: Fazer login com senha mestra

**Como** usuário do vault  
**Eu quero** inserir minha senha mestra para acessar o sistema  
**Para que** minhas credenciais fiquem protegidas quando não estou usando o app

| Atributo | Valor |
|----------|-------|
| Prioridade | P1 |
| Story Points | 3 |
| Épico | EPIC-01 |
| Dependências | US-001 |

---

### US-003: Bloquear vault manualmente

**Como** usuário do vault  
**Eu quero** bloquear o vault com um clique ou atalho de teclado  
**Para que** ninguém veja minhas credenciais se eu me afastar do computador

| Atributo | Valor |
|----------|-------|
| Prioridade | P2 |
| Story Points | 2 |
| Épico | EPIC-01 |
| Dependências | US-002 |

---

### US-004: Sessão expirar por inatividade

**Como** usuário do vault  
**Eu quero** que a sessão expire automaticamente após período de inatividade  
**Para que** o vault se bloqueie sozinho se eu esquecer de sair

| Atributo | Valor |
|----------|-------|
| Prioridade | P1 |
| Story Points | 3 |
| Épico | EPIC-01 |
| Dependências | US-002 |

---

## EPIC-02: CRUD de Credenciais

### US-005: Criar nova credencial

**Como** usuário do vault  
**Eu quero** adicionar uma credencial com nome do app, usuário, email e senha  
**Para que** eu tenha um registro centralizado de cada conta

| Atributo | Valor |
|----------|-------|
| Prioridade | P1 |
| Story Points | 5 |
| Épico | EPIC-02 |
| Dependências | US-002 |
| Status | Existente — refinar |

---

### US-006: Editar credencial existente

**Como** usuário do vault  
**Eu quero** editar os dados de uma credencial salva  
**Para que** eu possa atualizar senhas ou emails quando mudarem

| Atributo | Valor |
|----------|-------|
| Prioridade | P1 |
| Story Points | 3 |
| Épico | EPIC-02 |
| Dependências | US-005 |
| Status | Existente — refinar |

---

### US-007: Excluir credencial

**Como** usuário do vault  
**Eu quero** excluir uma credencial com confirmação  
**Para que** eu remova contas que não uso mais sem exclusão acidental

| Atributo | Valor |
|----------|-------|
| Prioridade | P1 |
| Story Points | 2 |
| Épico | EPIC-02 |
| Dependências | US-005 |
| Status | Existente — refinar |

---

### US-008: Gerar senha segura ao salvar

**Como** usuário do vault  
**Eu quero** gerar uma senha aleatória e segura ao criar/editar credencial  
**Para que** eu use senhas fortes sem precisar inventá-las

| Atributo | Valor |
|----------|-------|
| Prioridade | P1 |
| Story Points | 3 |
| Épico | EPIC-02 |
| Dependências | US-005 |
| Status | Existente — refinar |

---

### US-009: Adicionar campos customizáveis

**Como** usuário do vault  
**Eu quero** adicionar campos extras (URL, notas, PIN, backup codes) a uma credencial  
**Para que** eu armazene informações específicas de cada serviço

| Atributo | Valor |
|----------|-------|
| Prioridade | P2 |
| Story Points | 5 |
| Épico | EPIC-02 |
| Dependências | US-005 |

---

### US-010: Visualizar senha com toggle show/hide

**Como** usuário do vault  
**Eu quero** alternar entre mostrar e ocultar a senha  
**Para que** eu mantenha privacidade visual em ambientes públicos

| Atributo | Valor |
|----------|-------|
| Prioridade | P1 |
| Story Points | 2 |
| Épico | EPIC-02 |
| Dependências | US-005 |

---

### US-011: Ver indicador de força da senha

**Como** usuário do vault  
**Eu quero** ver um indicador visual da força da senha ao criar/editar  
**Para que** eu saiba se minha senha é segura o suficiente

| Atributo | Valor |
|----------|-------|
| Prioridade | P2 |
| Story Points | 3 |
| Épico | EPIC-02 |
| Dependências | US-005, US-008 |

---

## EPIC-03: Dashboard e Navegação

### US-012: Ver dashboard com visão geral

**Como** usuário do vault  
**Eu quero** ver um dashboard com total de credenciais, últimas modificadas e atalhos  
**Para que** eu tenha uma visão rápida do meu vault ao abrir o app

| Atributo | Valor |
|----------|-------|
| Prioridade | P1 |
| Story Points | 5 |
| Épico | EPIC-03 |
| Dependências | US-005 |

---

### US-013: Acessar favoritos rapidamente

**Como** usuário do vault  
**Eu quero** marcar credenciais como favoritas e vê-las em seção dedicada  
**Para que** eu acesse rapidamente apps que uso diariamente (YouTube, Facebook, Twitter)

| Atributo | Valor |
|----------|-------|
| Prioridade | P2 |
| Story Points | 3 |
| Épico | EPIC-03 |
| Dependências | US-012 |

---

### US-014: Navegar responsivamente em desktop, tablet e mobile

**Como** usuário do vault  
**Eu quero** usar o sistema confortavelmente em desktop, tablet e celular  
**Para que** eu acesse minhas credenciais em qualquer dispositivo

| Atributo | Valor |
|----------|-------|
| Prioridade | P1 |
| Story Points | 8 |
| Épico | EPIC-03 |
| Dependências | US-012 |

---

## EPIC-04: Busca, Filtros e Copy

### US-015: Buscar credenciais em tempo real

**Como** usuário do vault  
**Eu quero** buscar credenciais digitando nome do app, usuário ou email  
**Para que** eu encontre qualquer credencial em segundos

| Atributo | Valor |
|----------|-------|
| Prioridade | P1 |
| Story Points | 3 |
| Épico | EPIC-04 |
| Dependências | US-005 |
| Status | Parcial — filtros existentes, evoluir para busca global |

---

### US-016: Filtrar por usuário, email e app

**Como** usuário do vault  
**Eu quero** filtrar a lista por campos específicos  
**Para que** eu refine resultados quando tenho muitas credenciais

| Atributo | Valor |
|----------|-------|
| Prioridade | P1 |
| Story Points | 2 |
| Épico | EPIC-04 |
| Dependências | US-005 |
| Status | Existente — refinar |

---

### US-017: Copiar usuário, email ou senha com um clique

**Como** usuário do vault  
**Eu quero** copiar qualquer campo da credencial com um botão  
**Para que** eu cole no serviço sem selecionar texto manualmente

| Atributo | Valor |
|----------|-------|
| Prioridade | P1 |
| Story Points | 3 |
| Épico | EPIC-04 |
| Dependências | US-005 |

---

### US-018: Receber feedback ao copiar

**Como** usuário do vault  
**Eu quero** ver confirmação visual (toast) ao copiar um campo  
**Para que** eu saiba que a ação foi bem-sucedida

| Atributo | Valor |
|----------|-------|
| Prioridade | P2 |
| Story Points | 1 |
| Épico | EPIC-04 |
| Dependências | US-017 |

---

## EPIC-05: Experiência Visual e Temas

### US-019: Ver ícone automático do app

**Como** usuário do vault  
**Eu quero** que o logo/favicon do app apareça automaticamente ao cadastrar  
**Para que** eu identifique credenciais visualmente de forma instantânea

| Atributo | Valor |
|----------|-------|
| Prioridade | P1 |
| Story Points | 5 |
| Épico | EPIC-05 |
| Dependências | US-005 |

---

### US-020: Alternar entre modo claro e escuro

**Como** usuário do vault  
**Eu quero** alternar entre tema claro e escuro  
**Para que** eu use o app confortavelmente em qualquer ambiente

| Atributo | Valor |
|----------|-------|
| Prioridade | P1 |
| Story Points | 3 |
| Épico | EPIC-05 |
| Dependências | — |

---

### US-021: Respeitar preferência de tema do sistema

**Como** usuário do vault  
**Eu quero** que o app siga automaticamente o tema do meu sistema operacional  
**Para que** a experiência seja consistente com outros apps

| Atributo | Valor |
|----------|-------|
| Prioridade | P2 |
| Story Points | 2 |
| Épico | EPIC-05 |
| Dependências | US-020 |

---

### US-022: Personalizar cor de destaque

**Como** usuário do vault  
**Eu quero** escolher uma cor de destaque (accent color)  
**Para que** o app reflita meu gosto pessoal

| Atributo | Valor |
|----------|-------|
| Prioridade | P3 |
| Story Points | 2 |
| Épico | EPIC-05 |
| Dependências | US-020 |

---

### US-023: Experienciar microinterações e animações

**Como** usuário do vault  
**Eu quero** transições suaves ao adicionar, editar e copiar credenciais  
**Para que** o app pareça moderno e profissional

| Atributo | Valor |
|----------|-------|
| Prioridade | P2 |
| Story Points | 3 |
| Épico | EPIC-05 |
| Dependências | US-005 |

---

## EPIC-06: Organização e Categorização

### US-024: Categorizar credenciais por tipo de serviço

**Como** usuário do vault  
**Eu quero** atribuir categorias (Redes Sociais, Streaming, Email, Bancos, Trabalho)  
**Para que** eu organize credenciais por contexto de uso

| Atributo | Valor |
|----------|-------|
| Prioridade | P2 |
| Story Points | 5 |
| Épico | EPIC-06 |
| Dependências | US-005 |

---

### US-025: Filtrar credenciais por categoria

**Como** usuário do vault  
**Eu quero** filtrar a lista por categoria  
**Para que** eu veja apenas credenciais de um tipo específico

| Atributo | Valor |
|----------|-------|
| Prioridade | P2 |
| Story Points | 2 |
| Épico | EPIC-06 |
| Dependências | US-024 |

---

## EPIC-07: Saúde e Qualidade das Senhas

### US-026: Ver score de saúde do vault

**Como** usuário do vault  
**Eu quero** ver um painel com score geral de saúde das minhas senhas  
**Para que** eu saiba o quão seguro está meu vault

| Atributo | Valor |
|----------|-------|
| Prioridade | P2 |
| Story Points | 5 |
| Épico | EPIC-07 |
| Dependências | US-005, US-011 |

---

### US-027: Identificar senhas fracas e reutilizadas

**Como** usuário do vault  
**Eu quero** ver lista de credenciais com senhas fracas ou duplicadas  
**Para que** eu saiba quais preciso melhorar

| Atributo | Valor |
|----------|-------|
| Prioridade | P2 |
| Story Points | 5 |
| Épico | EPIC-07 |
| Dependências | US-026 |

---

### US-028: Regenerar senha a partir do health panel

**Como** usuário do vault  
**Eu quero** acessar o gerador de senha direto do painel de saúde  
**Para que** eu corrija senhas fracas rapidamente

| Atributo | Valor |
|----------|-------|
| Prioridade | P2 |
| Story Points | 3 |
| Épico | EPIC-07 |
| Dependências | US-027, US-008 |

---

## EPIC-08: Backup, Import e Portabilidade

### US-029: Exportar vault em JSON criptografado

**Como** usuário do vault  
**Eu quero** exportar todas as credenciais em arquivo JSON criptografado  
**Para que** eu tenha backup seguro dos meus dados

| Atributo | Valor |
|----------|-------|
| Prioridade | P2 |
| Story Points | 5 |
| Épico | EPIC-08 |
| Dependências | US-002 |

---

### US-030: Exportar vault em CSV

**Como** usuário do vault  
**Eu quero** exportar credenciais em CSV (com aviso de segurança)  
**Para que** eu possa migrar ou analisar dados em planilha

| Atributo | Valor |
|----------|-------|
| Prioridade | P3 |
| Story Points | 3 |
| Épico | EPIC-08 |
| Dependências | US-029 |

---

### US-031: Importar credenciais de JSON/CSV

**Como** usuário do vault  
**Eu quero** importar credenciais de arquivo JSON ou CSV com preview  
**Para que** eu migre dados de outras fontes sem perder informações

| Atributo | Valor |
|----------|-------|
| Prioridade | P2 |
| Story Points | 8 |
| Épico | EPIC-08 |
| Dependências | US-029 |

---

### US-032: Usar app offline como PWA

**Como** usuário do vault  
**Eu quero** instalar o app como PWA e consultar credenciais offline  
**Para que** eu acesse dados mesmo sem conexão

| Atributo | Valor |
|----------|-------|
| Prioridade | P2 |
| Story Points | 8 |
| Épico | EPIC-08 |
| Dependências | US-005 |

---

## EPIC-09: Privacidade e Histórico

### US-033: Ativar modo privacidade (panic button)

**Como** usuário do vault  
**Eu quero** ocultar instantaneamente todas as senhas visíveis com atalho  
**Para que** ninguém veja meus dados em ambientes públicos

| Atributo | Valor |
|----------|-------|
| Prioridade | P3 |
| Story Points | 2 |
| Épico | EPIC-09 |
| Dependências | US-010 |

---

### US-034: Ver histórico de alterações de senha

**Como** usuário do vault  
**Eu quero** ver quando a senha de uma credencial foi alterada  
**Para que** eu saiba há quanto tempo não atualizo determinada conta

| Atributo | Valor |
|----------|-------|
| Prioridade | P3 |
| Story Points | 5 |
| Épico | EPIC-09 |
| Dependências | US-006 |

---

## Fora de Escopo (Release 2.0 cancelada)

As user stories abaixo **não serão implementadas**, conforme decisão de escopo:

### ~~US-035: Gerar códigos TOTP (2FA) integrados~~ — Cancelada

### ~~US-036: Autofill via extensão de browser~~ — Cancelada

---

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de User Stories (em escopo) | 34 |
| P1 (Must Have) | 18 |
| P2 (Should Have) | 13 |
| P3 (Could Have) | 3 |
| Total Story Points | ~121 |
| Fora de escopo | US-035, US-036 |
