# Wireframes — Lista de Credenciais

**Telas:** Lista completa · Busca · Filtros  
**Stories:** US-015, US-016, US-017, US-018, US-019, US-024, US-025

---

## WF-07: Lista de Credenciais

**Rota:** `/credentials`

### Desktop — Grid View

```
┌──────────┬──────────────────────────────────────────────────────────┐
│ Sidebar  │ [🔍 Buscar credenciais...________] [+ Nova] [≡ Lista|Grid]│
│          ├──────────────────────────────────────────────────────────┤
│          │ Filtros: [Todos▾] [Social] [Streaming] [Email] [+]       │
│          │          App:[____] User:[____] Email:[____] [Limpar]    │
│          │                                                          │
│          │  24 credenciais                                          │
│          │                                                          │
│          │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│          │  │[YT] YouTube★│ │[FB] Facebook│ │[X] Twitter  │         │
│          │  │ Social      │ │ Social      │ │ Social      │         │
│          │  │─────────────│ │─────────────│ │─────────────│         │
│          │  │user [📋]    │ │user [📋]    │ │user [📋]    │         │
│          │  │email [📋]   │ │email [📋]   │ │email [📋]   │         │
│          │  │pass  [👁][📋]│ │pass  [👁][📋]│ │pass  [👁][📋]│         │
│          │  │[Editar][🗑] │ │[Editar][🗑] │ │[Editar][🗑] │         │
│          │  └─────────────┘ └─────────────┘ └─────────────┘         │
│          │  ┌─────────────┐ ┌─────────────┐ ...                    │
│          │  │[N] Netflix  │ │[G] Gmail    │                        │
│          │  └─────────────┘ └─────────────┘                        │
└──────────┴──────────────────────────────────────────────────────────┘
```

### Mobile — List View

```
┌─────────────────────────┐
│ [←] Credenciais    [+]  │
│ [🔍 Buscar...]          │
│ [Todos▾][Social][+]     │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │[YT] YouTube      [★]│ │
│ │ tiago@yt.com        │ │
│ │ ••••••••  [👁][📋] │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │[FB] Facebook     [☆]│ │
│ │ ...                 │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ [🏠] [🔑] [➕] [⚙️]     │
└─────────────────────────┘
```

---

## WF-08: Busca Ativa

**Trigger:** Usuário digita no campo de busca global

```
┌──────────────────────────────────────────────────────────┐
│ [🔍 yout________________________________] [✕ limpar]     │
├──────────────────────────────────────────────────────────┤
│ 2 resultados para "yout"                                 │
│                                                          │
│ ┌─────────────┐ ┌─────────────┐                          │
│ │[YT] YouTube │ │[YT] YouTube │  ← highlight "yout"      │
│ │  Music ★   │ │  TV         │                          │
│ └─────────────┘ └─────────────┘                          │
└──────────────────────────────────────────────────────────┘
```

**Especificações:**
- Debounce 300ms
- Highlight termo buscado em appName, username, email
- Empty: "Nenhuma credencial encontrada para 'xyz'"
- Atalho: `Ctrl+K` ou `/` foca busca

---

## WF-09: Copy Feedback (Toast)

```
                              ┌─────────────────────┐
                              │ ✓ Senha copiada     │  ← bottom-right D
                              └─────────────────────┘      bottom-center M

Card após copy:
│ pass  [✓][📋] │  ← ícone check verde por 2s
```

---

## WF-10: Panic Mode (US-033)

**Trigger:** `Ctrl+H`

```
Todas senhas → (••••••••) imediatamente
Todos toggles → oculto
Opcional: overlay escuro com "Vault oculto — clique para desbloquear"
```

---

## Hierarquia de Informação (Card)

| Prioridade | Elemento | Tamanho |
|------------|----------|---------|
| 1 | Ícone do app | 40px avatar |
| 2 | Nome do app | heading.sm |
| 3 | Botão copy senha | icon 44px touch |
| 4 | Username / email | body.sm + copy |
| 5 | Categoria badge | badge sm |
| 6 | Ações editar/excluir | ghost buttons |
