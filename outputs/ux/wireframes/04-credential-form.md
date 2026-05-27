# Wireframes — Formulário de Credencial

**Telas:** Criar · Editar · Campos customizáveis  
**Stories:** US-005 a US-011, US-009, US-034

---

## WF-11: Nova Credencial (Modal Desktop / Drawer Mobile)

**Trigger:** Botão "+ Nova" em qualquer página

### Desktop — Dialog

```
┌─────────────────────────────────────────────────────────┐
│  Nova credencial                                   [✕]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────┐  Nome do aplicativo *                           │
│  │ YT │  [YouTube________________________]              │  ← ícone live preview
│  └────┘                                                 │
│                                                         │
│  Categoria                                              │
│  [Redes Sociais ▾]                                      │
│                                                         │
│  URL (opcional)                                         │
│  [https://youtube.com________________]                  │
│                                                         │
│  Usuário                                                │
│  [________________________________]                     │
│                                                         │
│  Email                                                  │
│  [________________________________]                     │
│                                                         │
│  Senha *                                                │
│  [________________________________] [👁] [🎲 Gerar]     │
│  ██████████░░░░  Excelente                              │
│                                                         │
│  ── Campos adicionais ────────────── [+ Adicionar]      │
│                                                         │
│  ☐ Adicionar aos favoritos                              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│              [ Cancelar ]  [ Salvar credencial ]        │
└─────────────────────────────────────────────────────────┘
```

### Mobile — Drawer (bottom sheet)

```
┌─────────────────────────┐
│ ─── (handle)            │
│ Nova credencial    [✕]  │
├─────────────────────────┤
│ (scrollable form)       │
│ ...mesmos campos...     │
│                         │
├─────────────────────────┤
│ [ Salvar credencial ]   │  ← sticky footer
└─────────────────────────┘
```

---

## WF-12: Gerador de Senha (expandido)

**Trigger:** Botão "🎲 Gerar"

```
│  Senha *                                                │
│  [Xk9#mP2$vL5@nQ8!________________] [👁] [🎲]           │
│  ████████████████████  Excelente                        │
│                                                         │
│  ┌─ Opções do gerador ─────────────────────────────┐   │
│  │ Comprimento: [16] ───●────────── [32]           │   │
│  │ ☑ Maiúsculas  ☑ Minúsculas  ☑ Números  ☑ Símbolos│   │
│  │                        [ Regenerar ]            │   │
│  └─────────────────────────────────────────────────┘   │
```

---

## WF-13: Campos Customizáveis (US-009)

**Trigger:** "+ Adicionar campo"

```
│  ── Campos adicionais ─────────────────────────────────  │
│                                                         │
│  URL do painel                                          │
│  [https://studio.youtube.com____]              [🗑]     │
│                                                         │
│  Notas                                                  │
│  [Conta principal de conteúdo___]              [🗑]     │
│  [_______________________________]                      │
│                                                         │
│  PIN                                                    │
│  [____]                                        [🗑]     │
│                                                         │
│  [+ Adicionar campo ▾]  → URL | Notas | PIN | Backup 2FA | Texto │
```

---

## WF-14: Editar Credencial

Igual WF-11 com:
- Título: "Editar credencial"
- Campos preenchidos
- Seção histórico (US-034):

```
│  ── Histórico de senha ───────────────────────────────  │
│  │ • Alterada em 15/03/2026 — score 85               │  │
│  │ • Alterada em 02/01/2026 — score 40               │  │
```

---

## WF-15: Confirmar Exclusão

```
┌─────────────────────────────────────────┐
│  ⚠ Excluir credencial?                  │
│                                         │
│  YouTube será removido permanentemente. │
│  Esta ação não pode ser desfeita.       │
│                                         │
│  [ Cancelar ]  [ Excluir ]              │  ← Excluir = vermelho
└─────────────────────────────────────────┘
```

---

## Validações Inline

| Campo | Regra | Mensagem |
|-------|-------|----------|
| appName | obrigatório | "Nome do app é obrigatório" |
| password | obrigatório | "Senha é obrigatória" |
| email | formato email | "Email inválido" |
| url | formato URL | "URL inválida" |

---

## Fluxo

```
[+ Nova] → Modal/Drawer → Preencher → [Salvar] → Toast "Criada" → Lista atualizada
Card [Editar] → Modal preenchido → [Salvar] → Toast "Atualizada"
Card [Excluir] → AlertDialog → [Confirmar] → Toast "Excluída"
```
