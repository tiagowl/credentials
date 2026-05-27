# Proposta de Valor — Gerenciador de Credenciais Pessoal

**Projeto:** Sistema web para armazenamento pessoal de credenciais  
**Data:** 2026-05-26  
**Agente:** Feature Suggester

---

## Proposta de Valor Central

> **Seu vault pessoal — bonito, rápido e só seu.**
>
> Um gerenciador de credenciais web que combina a experiência visual de um produto premium com a simplicidade de anotar num bloco de notas — criptografado, organizado e projetado para uma pessoa: você.

---

## Elevator Pitch (30 segundos)

Você tem dezenas de contas — YouTube, Facebook, Twitter, email, bancos — e cada uma com usuário e senha diferentes. Planilhas são inseguras. Password managers são feios ou complexos demais.

Este sistema é **seu cofre pessoal na web**: adicione credenciais em segundos, encontre qualquer uma instantaneamente, copie com um clique. Tudo criptografado, tudo bonito, zero complicação.

---

## Mapa de Valor

### Jobs to Be Done (JTBD)

| Quando eu... | Eu quero... | Para que eu possa... |
|--------------|-------------|---------------------|
| Crio conta em novo app | Salvar credenciais rapidamente | Não depender de "esqueci minha senha" |
| Faço login no celular/PC | Encontrar usuário e senha em segundos | Entrar sem frustração |
| Estou em ambiente público | Ocultar senhas da tela | Manter privacidade |
| Esqueço qual email usei | Buscar por app ou usuário | Identificar a conta certa |
| Quero senha forte | Gerar senha segura ao salvar | Proteger minhas contas |
| Preciso trocar de dispositivo | Exportar/importar meu vault | Não perder nada |

### Dores do Usuário (Problem Statement)

| Dor | Intensidade | Como Resolvemos |
|-----|-------------|-----------------|
| "Uso a mesma senha em tudo" | Alta | Gerador + health score |
| "Não lembro qual email cadastrei" | Alta | CRUD com email + busca |
| "Minha planilha no Drive não é segura" | Alta | Criptografia + senha mestra |
| "Password managers são feios/complexos" | Média | Design premium, single-user |
| "Perco tempo procurando credencial" | Alta | Busca instantânea + favoritos |
| "Tenho medo de perder meus dados" | Média | Export/backup criptografado |

---

## Pilares de Valor

### 1. Beleza que Inspira Confiança

**O que é:** Interface moderna com cards visuais, ícones de apps reconhecíveis, dark mode elegante e micro-animações.

**Por que importa:** Ferramentas bonitas são usadas. Ferramentas feias são abandonadas — mesmo quando funcionam.

**Proof points:**
- Logo automático do YouTube, Facebook, Twitter ao cadastrar
- Toggle dark/light com transição suave
- Feedback visual ao copiar (toast animado)
- Layout responsivo impecável

**Concorrente de referência:** 1Password (visual) — mas gratuito e pessoal.

---

### 2. Velocidade Zero-Fricção

**O que é:** Encontrar e copiar qualquer credencial em menos de 5 segundos.

**Por que importa:** Se for mais lento que abrir a planilha, o usuário volta para a planilha.

**Proof points:**
- Busca global instantânea (< 100ms)
- Copiar usuário/email/senha com 1 clique
- Favoritos para apps do dia-a-dia
- Dashboard com acessos recentes

**Concorrente de referência:** Google Password Manager (velocidade) — mas com controle total.

---

### 3. Segurança Sem Complexidade

**O que é:** Criptografia moderna e senha mestra, invisíveis para o usuário no dia a dia.

**Por que importa:** Dados sensíveis exigem proteção real, não a sensação de segurança.

**Proof points:**
- AES-256 via Web Crypto API
- Senha mestra com hash Argon2
- Senhas ocultas por padrão
- Health score alerta senhas fracas
- Export criptografado para backup

**Concorrente de referência:** Bitwarden (segurança) — mas com UX superior.

---

### 4. Simplicidade Single-User

**O que é:** Zero features de compartilhamento, equipe, família ou enterprise. Cada pixel serve você.

**Por que importa:** Password managers comerciais são sobrecarregados com features que um usuário solo nunca usa.

**Proof points:**
- Sem convites, sem permissões, sem planos
- Onboarding: senha mestra → primeira credencial → pronto
- Interface limpa sem menus de administração
- Foco total em CRUD + busca + copy

**Concorrente de referência:** Nenhum — este é o diferencial único.

---

## Matriz de Posicionamento

```
                    SIMPLE
                      ▲
                      │
         Google/Apple │  ★ NOSSO PROJETO
         Password Mgr │    (target)
                      │
    ──────────────────┼──────────────────► SEGURO
                      │
         Planilha/     │     Bitwarden
         Notas        │     KeePass
                      │
                      │     1Password
                      ▼
                    COMPLEXO
```

**Quadrante alvo:** Simples + Seguro — o espaço vazio entre "planilha insegura" e "password manager complexo".

---

## Proposta de Valor por Persona

### Persona: Tiago (Usuário Principal)

| Atributo | Detalhe |
|----------|---------|
| **Perfil** | Desenvolvedor/usuário tech, uso pessoal |
| **Apps** | YouTube, Facebook, Twitter, email, diversos SaaS |
| **Frustração** | Credenciais espalhadas, sem organização visual |
| **Desejo** | Sistema intuitivo, moderno, bonito e profissional |
| **Comportamento** | Prefere web app, valoriza estética |

**Value Proposition Canvas:**

| Ganhos (Gains) | Dores (Pains) | Tarefas (Jobs) |
|----------------|---------------|----------------|
| Interface bonita | Planilha insegura | Lembrar credenciais |
| Copiar rápido | Apps feios | Organizar por serviço |
| Senhas fortes | Busca lenta | Gerar senhas seguras |
| Tudo num lugar | Medo de perder dados | Acessar de qualquer browser |
| Dark mode | Complexidade desnecessária | Sentir controle total |

**Proposta específica:**

> "Tiago, imagine abrir uma página web elegante, digitar 'youtube' e em 2 segundos copiar sua senha — com o logo vermelho do YouTube ao lado. Sem planilha, sem app feio, sem mensalidade."

---

## Diferenciais Competitivos (UVP)

| # | Diferencial | Único? | Sustentável? |
|---|-------------|--------|--------------|
| 1 | Design premium para uso pessoal | Sim | Sim — requer taste |
| 2 | Foco 100% single-user | Sim | Sim — decisão de produto |
| 3 | Branding visual automático (social apps) | Parcial | Sim — curadoria de ícones |
| 4 | Gratuito e self-controlled | Parcial | Sim — sem server costs |
| 5 | Onboarding em 60 segundos | Parcial | Sim — simplicidade |

### UVP Statement (Unique Value Proposition)

> Para **pessoas que querem organizar credenciais pessoais** que estão cansadas de **planilhas inseguras ou password managers feios e complexos**, o **[Nome do Projeto]** é um **gerenciador de credenciais web** que oferece **experiência visual premium com simplicidade de bloco de notas**. Diferente de **Bitwarden, 1Password e Google Password Manager**, nosso produto **é projetado exclusivamente para uma pessoa, priorizando beleza e velocidade sobre features enterprise**.

---

## Features que Materializam a Proposta

| Pilar | Features | Fase |
|-------|----------|------|
| Beleza | Ícones automáticos, dark mode, animações | 2 |
| Velocidade | Busca instantânea, copy 1-clique, favoritos | 1 |
| Segurança | Senha mestra, criptografia, health score | 1-2 |
| Simplicidade | Single-user, onboarding zero, dashboard limpo | 1 |

---

## Mensagens-Chave por Canal

| Contexto | Mensagem |
|----------|----------|
| **Headline** | Seu vault pessoal. Bonito, rápido, seguro. |
| **Subheadline** | Organize credenciais de todos os seus apps com a experiência visual que você merece. |
| **CTA** | Adicione sua primeira credencial → |
| **Tagline** | Lembre de tudo. Esqueça a complexidade. |

---

## Anti-Posicionamento (O que NÃO somos)

| Não somos | Por quê |
|-----------|---------|
| Password manager para empresas | Sem SSO, auditoria, admin |
| App de compartilhamento familiar | Single-user by design |
| Substituto do Google/Apple Keychain | Não competimos com OS nativo |
| Planilha glorificada | Segurança real, não cosmetic |
| Clone do 1Password | Gratuito, pessoal, web-first |

---

## Métricas de Valor Entregue

| Métrica | Baseline (hoje) | Target (v1.0) |
|---------|-----------------|---------------|
| Tempo para encontrar credencial | ~30 seg (scroll/filtro) | < 5 seg |
| Cliques para copiar senha | 3+ (selecionar, copiar) | 1 |
| Satisfação visual | 5/10 (CRUD básico) | 9/10 |
| Senhas únicas geradas | Manual | 80%+ via gerador |
| Uso diário | Esporádico | Consistente |
| Medo de perder dados | Alto (sem backup) | Baixo (export) |

---

## Evolução da Proposta de Valor

| Versão | Proposta | Quando |
|--------|----------|--------|
| **v0.5** | "Organize suas credenciais" | Fase 1 — funcional |
| **v1.0** | "Seu vault pessoal — bonito, rápido e seguro" | Fase 2 — polish |
| **v2.0** | "Seu credential manager completo" | Fase 3 — power |
| **v3.0** | "Autenticação simplificada para tudo" | Fase 4 — future |

---

## Conclusão

A proposta de valor deste projeto não compete em **quantidade de features**, mas em **qualidade de experiência para uma pessoa**. Enquanto Bitwarden otimiza para equipes e 1Password cobra por beleza, este produto entrega:

1. **Beleza** — design que dá prazer de usar
2. **Velocidade** — copiar credencial em 1 clique
3. **Segurança** — criptografia invisível
4. **Simplicidade** — zero clutter, 100% focado em você

> **"Lembre de tudo. Esqueça a complexidade."**
