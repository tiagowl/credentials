# Feature Suggestions — Gerenciador de Credenciais Pessoal

**Projeto:** Sistema web para armazenamento pessoal de credenciais de login  
**Público-alvo:** Uso pessoal (single user)  
**Data:** 2026-05-26  
**Agente:** Feature Suggester

---

## Resumo Executivo

Com base nas diretrizes fornecidas — sistema web intuitivo, moderno, bonito e profissional para lembrar credenciais de aplicativos como YouTube, Facebook e Twitter — este documento apresenta **18 features** organizadas em quatro categorias, com avaliação de impacto, complexidade e prioridade.

**Estado atual do produto:**
- CRUD de credenciais (nome do app, usuário, email, senha)
- Filtros por nome de usuário, email e nome do aplicativo
- Gerador de senha ao salvar

---

## 🌟 Features Core (Essenciais)

Funcionalidades fundamentais para paridade competitiva e uso diário confortável.

---


### 2. Busca Global Instantânea

| Campo | Detalhe |
|-------|---------|
| **Descrição** | Campo de busca único que filtra em tempo real por nome do app, usuário, email ou URL associada — complementando os filtros existentes com experiência mais fluida. |
| **Benefício ao usuário** | Encontra qualquer credencial em segundos, mesmo com dezenas de registros. |
| **Impacto no negócio** | Alto |
| **Complexidade** | Baixa |
| **Prioridade** | P1 |

**Pontuação (1-5):** Atratividade 5 | Impacto 5 | Viabilidade 5 | Inovação 2

---

### 3. Copiar com Um Clique

| Campo | Detalhe |
|-------|---------|
| **Descrição** | Botões dedicados para copiar usuário, email ou senha individualmente, com feedback visual (toast) e auto-limpeza do clipboard após 30 segundos (opcional). |
| **Benefício ao usuário** | Elimina seleção manual e erros ao colar credenciais. |
| **Impacto no negócio** | Alto |
| **Complexidade** | Baixa |
| **Prioridade** | P1 |

**Pontuação (1-5):** Atratividade 5 | Impacto 5 | Viabilidade 5 | Inovação 2

---

### 4. Visualização Segura de Senha

| Campo | Detalhe |
|-------|---------|
| **Descrição** | Senhas ocultas por padrão com toggle show/hide, indicador de força da senha e histórico de alterações (opcional). |
| **Benefício ao usuário** | Privacidade visual em ambientes compartilhados e consciência sobre qualidade das senhas. |
| **Impacto no negócio** | Alto |
| **Complexidade** | Baixa |
| **Prioridade** | P1 |

**Pontuação (1-5):** Atratividade 4 | Impacto 4 | Viabilidade 5 | Inovação 2

---


---

### 6. Autenticação com Senha Mestra

| Campo | Detalhe |
|-------|---------|
| **Descrição** | Tela de login com senha mestra para proteger o vault. Sessão com timeout configurável e opção de bloqueio manual. |
| **Benefício ao usuário** | Camada essencial de segurança para dados sensíveis armazenados localmente ou em nuvem. |
| **Impacto no negócio** | Alto |
| **Complexidade** | Média |
| **Prioridade** | P1 |

**Pontuação (1-5):** Atratividade 4 | Impacto 5 | Viabilidade 4 | Inovação 2

---

## 🚀 Features Diferenciadoras

Funcionalidades que elevam a experiência acima de uma planilha ou bloco de notas.

---

### 7. Ícones e Branding Automático dos Apps

| Campo | Detalhe |
|-------|---------|
| **Descrição** | Detecção automática do logo/favicon do serviço (via Clearbit, Google Favicon ou biblioteca local) ao digitar o nome do app. Cards visuais com identidade de marca. |
| **Benefício ao usuário** | Interface bonita e reconhecível — credenciais identificadas visualmente em milissegundos. |
| **Impacto no negócio** | Alto |
| **Complexidade** | Média |
| **Prioridade** | P1 |

**Pontuação (1-5):** Atratividade 5 | Impacto 4 | Viabilidade 4 | Inovação 4

---

### 8. Modo Escuro e Temas Personalizáveis

| Campo | Detalhe |
|-------|---------|
| **Descrição** | Toggle dark/light mode com transição suave, respeitando preferência do sistema. Paleta de cores profissional com opção de accent color. |
| **Benefício ao usuário** | Conforto visual e sensação de produto moderno e polido. |
| **Impacto no negócio** | Médio |
| **Complexidade** | Baixa |
| **Prioridade** | P1 |

**Pontuação (1-5):** Atratividade 5 | Impacto 3 | Viabilidade 5 | Inovação 3

---

### 9. Avaliador de Saúde das Senhas

| Campo | Detalhe |
|-------|---------|
| **Descrição** | Painel que analisa senhas fracas, reutilizadas ou antigas. Score geral do vault e sugestões de melhoria com acesso ao gerador existente. |
| **Benefício ao usuário** | Consciência proativa sobre segurança sem complexidade técnica. |
| **Impacto no negócio** | Alto |
| **Complexidade** | Média |
| **Prioridade** | P2 |

**Pontuação (1-5):** Atratividade 4 | Impacto 5 | Viabilidade 4 | Inovação 4

---

### 10. Campos Customizáveis por Credencial

| Campo | Detalhe |
|-------|---------|
| **Descrição** | Além dos campos fixos, permitir adicionar campos extras (URL, notas, pergunta de segurança, PIN, 2FA backup codes) por registro. |
| **Benefício ao usuário** | Flexibilidade para serviços com requisitos diferentes (bancos, VPNs, APIs). |
| **Impacto no negócio** | Médio |
| **Complexidade** | Média |
| **Prioridade** | P2 |

**Pontuação (1-5):** Atratividade 4 | Impacto 4 | Viabilidade 3 | Inovação 3

---

## 💎 Features Premium/Wow

Elementos que encantam e elevam o produto a experiência memorável.

## 🔮 Features Futuras

Visão de longo prazo e tecnologias emergentes.

---

### 17. Suporte a Passkeys

| Campo | Detalhe |
|-------|---------|
| **Descrição** | Armazenar e gerenciar passkeys (WebAuthn/FIDO2) junto com senhas tradicionais, preparando o vault para autenticação passwordless. |
| **Benefício ao usuário** | Compatibilidade com o futuro da autenticação (tendência dominante em 2026). |
| **Impacto no negócio** | Médio |
| **Complexidade** | Alta |
| **Prioridade** | P3 |

**Pontuação (1-5):** Atratividade 3 | Impacto 4 | Viabilidade 2 | Inovação 5

---

### 18. Sincronização Multi-dispositivo com Criptografia E2E

| Campo | Detalhe |
|-------|---------|
| **Descrição** | Sync entre desktop e mobile com criptografia ponta-a-ponta (zero-knowledge). Servidor não tem acesso aos dados. |
| **Benefício ao usuário** | Acesso às credenciais em qualquer dispositivo com segurança máxima. |
| **Impacto no negócio** | Alto |
| **Complexidade** | Alta |
| **Prioridade** | P3 |

**Pontuação (1-5):** Atratividade 4 | Impacto 5 | Viabilidade 2 | Inovação 4

---

## Matriz de Priorização Consolidada

| Feature | Valor p/ Usuário | Valor p/ Negócio | Esforço | Prioridade |
|---------|------------------|------------------|---------|------------|
| Dashboard com Visão Geral | Alto | Alto | Médio | P1 |
| Busca Global Instantânea | Alto | Alto | Baixo | P1 |
| Copiar com Um Clique | Alto | Alto | Baixo | P1 |
| Visualização Segura de Senha | Alto | Alto | Baixo | P1 |
| Autenticação com Senha Mestra | Alto | Alto | Médio | P1 |
| Ícones e Branding Automático | Alto | Alto | Médio | P1 |
| Modo Escuro e Temas | Alto | Médio | Baixo | P1 |
| Categorização por Serviço | Médio | Médio | Médio | P2 |
| Avaliador de Saúde das Senhas | Alto | Alto | Médio | P2 |
| Campos Customizáveis | Médio | Médio | Médio | P2 |
| Favoritos e Acesso Rápido | Médio | Médio | Baixo | P2 |
| Exportação e Backup | Médio | Alto | Médio | P2 |
| Animações e Microinterações | Alto | Médio | Baixo | P2 |
| Autofill via Extensão | Alto | Alto | Alto | P3 |
| Gerador TOTP (2FA) | Alto | Alto | Alto | P3 |
| Modo Privacidade | Médio | Médio | Baixo | P3 |
| Suporte a Passkeys | Médio | Médio | Alto | P3 |
| Sync Multi-dispositivo E2E | Alto | Alto | Alto | P3 |

---

## Features por Objetivo (Framework AARRR adaptado)

| Objetivo | Features Relevantes |
|----------|---------------------|
| **Ativação** | Dashboard, Busca Global, Copiar 1-clique, Ícones automáticos |
| **Retenção** | Favoritos, Modo Escuro, Avaliador de Saúde, Animações |
| **Referência** | N/A (uso pessoal) — foco em satisfação pessoal |
| **Receita** | N/A (projeto pessoal sem monetização) |

---

## Conclusão

Para um sistema pessoal focado em **intuitividade, beleza e profissionalismo**, as features P1 concentram-se em **UX impecável** (busca, copy, visual) e **identidade visual** (ícones, temas, dashboard). As features P2 agregam **organização e segurança consciente**. As P3 representam evolução para um password manager completo, caso o escopo expanda no futuro.
