# Wireframes — Autenticação

**Telas:** Setup (primeiro acesso) · Login · Sessão expirada  
**Stories:** US-001, US-002, US-004

---

## WF-01: Setup — Primeira Senha Mestra

**Rota:** `/setup`  
**Condição:** Vault não configurado (primeiro acesso)

### Desktop / Tablet / Mobile (layout centralizado)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    🔐 Credentials Vault                 │
│                                                         │
│              Crie sua senha mestra                      │
│     Ela protege todas as suas credenciais.              │
│     Leva menos de 1 minuto.                             │
│                                                         │
│     Senha mestra                                        │
│     [________________________________]                  │
│     ████████░░░░  Forte                                 │
│                                                         │
│     Confirmar senha                                     │
│     [________________________________]                  │
│                                                         │
│     ⓘ Anote em local seguro. Não há recuperação.       │
│                                                         │
│              [  Criar Vault  ]                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Especificações:**
- Card centralizado, max-width 400px
- Indicador de força em tempo real (US-011 pattern)
- Botão desabilitado até senhas coincidirem e score ≥ 50
- Após submit → redirect `/dashboard` (empty state)

**Estados:**
| Estado | Comportamento |
|--------|---------------|
| Default | Campos vazios, botão disabled |
| Typing | Strength bar atualiza |
| Error mismatch | "Senhas não coincidem" abaixo confirmar |
| Submitting | Botão loading spinner |
| Success | Redirect dashboard |

---

## WF-02: Login

**Rota:** `/login`  
**Condição:** Vault configurado, sessão inativa

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    🔐 Credentials Vault                 │
│                                                         │
│              Bem-vindo de volta                         │
│                                                         │
│     Senha mestra                                        │
│     [________________________________] [👁]             │
│                                                         │
│     ☐ Lembrar neste dispositivo (opcional)              │
│                                                         │
│              [  Desbloquear Vault  ]                    │
│                                                         │
│     Tentativas restantes: 4                             │  ← após 1 falha
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Especificações:**
- Rate limit: após 5 falhas, bloqueio 5 min + countdown
- Enter no campo = submit
- Link "Esqueci senha" → modal informativo (sem recuperação, sugere backup)

---

## WF-03: Sessão Expirada

**Trigger:** Timeout 15 min (US-004) ou bloqueio manual (US-003)

```
┌─────────────────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← overlay blur
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░┌─────────────────────────────┐░░░░░░░░░░░░░░  │
│  ░░░░░░│  🔒 Sessão expirada          │░░░░░░░░░░░░░░  │
│  ░░░░░░│                             │░░░░░░░░░░░░░░  │
│  ░░░░░░│  Por segurança, insira sua   │░░░░░░░░░░░░░░  │
│  ░░░░░░│  senha mestra novamente.     │░░░░░░░░░░░░░░  │
│  ░░░░░░│                             │░░░░░░░░░░░░░░  │
│  ░░░░░░│  [____senha mestra____]     │░░░░░░░░░░░░░░  │
│  ░░░░░░│                             │░░░░░░░░░░░░░░  │
│  ░░░░░░│  [ Desbloquear ]            │░░░░░░░░░░░░░░  │
│  ░░░░░░└─────────────────────────────┘░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────────────────────────────────┘
```

**Aviso pré-expiração (1 min antes):**
```
┌────────────────────────────────────────┐
│ ⏱ Sessão expira em 1 min  [Continuar]  │  ← toast/banner fixo bottom
└────────────────────────────────────────┘
```

---

## Fluxo de Navegação

```
Primeiro acesso → /setup → /dashboard
Retorno         → /login → /dashboard
Sessão expira   → overlay login (mantém rota atual)
Bloquear (US-003) → /login
```
