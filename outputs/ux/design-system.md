# Design System — Credentials Vault

**Projeto:** Gerenciador de Credenciais Pessoal  
**Data:** 2026-05-26  
**Agente:** UX Designer  
**Stack UI:** Chakra UI v3 · Next.js

---

## 1. Visão Geral

Design system alinhado ao Chakra UI v3, priorizando **clareza, segurança percebida e estética premium** para um vault pessoal single-user.

### Objetivos

- Consistência visual entre todas as telas
- Implementação direta com tokens Chakra
- Suporte a light/dark mode nativo
- Acessibilidade WCAG AA
- Responsividade desktop / tablet / mobile

---

## 2. Fundamentos

### 2.1 Paleta de Cores

#### Modo Claro (Light)

| Token | Hex | Uso |
|-------|-----|-----|
| `bg.canvas` | `#F7F8FA` | Fundo da aplicação |
| `bg.surface` | `#FFFFFF` | Cards, modals, sidebar |
| `bg.subtle` | `#EDF2F7` | Hover, zebra rows |
| `text.primary` | `#1A202C` | Títulos, corpo |
| `text.secondary` | `#718096` | Labels, hints |
| `text.muted` | `#A0AEC0` | Placeholders |
| `border.default` | `#E2E8F0` | Bordas de cards/inputs |
| `brand.primary` | `#3182CE` | Botões primários, links |
| `brand.primary.hover` | `#2B6CB0` | Hover primário |
| `semantic.success` | `#38A169` | Copy ok, senha forte |
| `semantic.warning` | `#D69E2E` | Senha média, alertas |
| `semantic.error` | `#E53E3E` | Erros, senha fraca |
| `semantic.info` | `#3182CE` | Informações |

#### Modo Escuro (Dark)

| Token | Hex | Uso |
|-------|-----|-----|
| `bg.canvas` | `#0D1117` | Fundo da aplicação |
| `bg.surface` | `#161B22` | Cards, modals |
| `bg.subtle` | `#21262D` | Hover |
| `text.primary` | `#F0F6FC` | Títulos, corpo |
| `text.secondary` | `#8B949E` | Labels |
| `border.default` | `#30363D` | Bordas |
| `brand.primary` | `#58A6FF` | Ações primárias |

#### Accent Colors (personalizáveis — US-022)

Presets sugeridos: `blue` (default), `purple`, `teal`, `orange`, `pink`, `green`

### 2.2 Tipografia

| Token | Font | Size | Weight | Uso |
|-------|------|------|--------|-----|
| `heading.xl` | Inter | 30px / 1.2 | 700 | Título de página |
| `heading.lg` | Inter | 24px / 1.25 | 600 | Seções |
| `heading.md` | Inter | 20px / 1.3 | 600 | Card titles |
| `heading.sm` | Inter | 16px / 1.4 | 600 | Subsections |
| `body.lg` | Inter | 16px / 1.5 | 400 | Corpo principal |
| `body.md` | Inter | 14px / 1.5 | 400 | Labels, campos |
| `body.sm` | Inter | 12px / 1.4 | 400 | Hints, timestamps |
| `mono` | JetBrains Mono | 14px | 400 | Senhas, códigos |

**Font stack Chakra:**
```tsx
fonts: {
  heading: `'Inter', sans-serif`,
  body: `'Inter', sans-serif`,
  mono: `'JetBrains Mono', monospace`,
}
```

### 2.3 Espaçamento

Base unit: **4px** (Chakra space scale)

| Token | Valor | Uso |
|-------|-------|-----|
| `space.1` | 4px | Gaps mínimos |
| `space.2` | 8px | Entre ícone e texto |
| `space.3` | 12px | Padding interno compacto |
| `space.4` | 16px | Padding padrão de cards |
| `space.6` | 24px | Entre cards no grid |
| `space.8` | 32px | Seções de página |
| `space.12` | 48px | Margens de página desktop |

### 2.4 Bordas e Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `radius.sm` | 6px | Inputs, badges |
| `radius.md` | 8px | Botões |
| `radius.lg` | 12px | Cards |
| `radius.xl` | 16px | Modals |
| `radius.full` | 9999px | Avatares de app |
| `shadow.sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards light |
| `shadow.md` | `0 4px 12px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `shadow.card` | `0 1px 3px rgba(0,0,0,0.12)` | Credential cards |

### 2.5 Breakpoints

| Nome | Min-width | Layout |
|------|-----------|--------|
| `base` | 0px | Mobile — single column |
| `md` | 768px | Tablet — sidebar colapsável |
| `lg` | 1024px | Tablet landscape |
| `xl` | 1280px | Desktop — sidebar fixa + grid |

---

## 3. Componentes

### 3.1 Mapeamento Chakra UI v3

| Componente do sistema | Chakra Component | Variantes |
|----------------------|------------------|-----------|
| Button Primary | `Button` | `colorPalette="blue"`, `size="md"` |
| Button Secondary | `Button` | `variant="outline"` |
| Button Ghost | `Button` | `variant="ghost"` |
| Button Icon | `IconButton` | copy, edit, delete, favorite |
| Input Text | `Input` | com `Field` wrapper |
| Input Password | `Input` + toggle | type password/text |
| Search | `Input` + `InputGroup` | ícone lupa à esquerda |
| Card Credencial | `Card` | `Root`, `Header`, `Body`, `Footer` |
| Modal Form | `Dialog` | create/edit credential |
| Drawer Mobile | `Drawer` | form em mobile |
| Toast | `Toaster` | success, error, info |
| Badge Categoria | `Badge` | por categoria com cor |
| Avatar App | `Avatar` | fallback com inicial |
| Progress Strength | `Progress` | senha fraca→forte |
| Alert | `Alert` | confirmação delete |
| Tabs | `Tabs` | filtros de categoria |
| Skeleton | `Skeleton` | loading states |
| Tooltip | `Tooltip` | ações de ícone |
| Switch | `Switch` | dark mode, favorito |

### 3.2 Credential Card

```
┌─────────────────────────────────────┐
│ [Avatar 40px]  YouTube        [★]   │  ← Header: ícone + nome + favorito
│              Redes Sociais          │  ← Badge categoria
├─────────────────────────────────────┤
│ Usuário    tiago.dev          [📋]  │  ← Campo + copy
│ Email      tiago@email.com    [📋]  │
│ Senha      ••••••••••         [👁][📋] │  ← toggle + copy
├─────────────────────────────────────┤
│ [Editar]  [Excluir]                 │  ← Footer actions
└─────────────────────────────────────┘
```

**Especificações:**
- Largura: flex no grid (min 280px desktop)
- Padding: `space.4` (16px)
- Border: 1px `border.default`
- Hover: `bg.subtle` + `shadow.md` transition 150ms

### 3.3 Botão Copy

| Estado | Visual |
|--------|--------|
| Default | Ícone `Copy`, cor `text.secondary` |
| Hover | `brand.primary`, background `bg.subtle` |
| Copied (2s) | Ícone `Check`, cor `semantic.success` |
| Disabled | Opacity 0.4 |

### 3.4 Indicador de Força de Senha

| Score | Cor | Label |
|-------|-----|-------|
| 0-25 | `semantic.error` | Fraca |
| 26-50 | `semantic.warning` | Média |
| 51-75 | `semantic.warning` | Boa |
| 76-100 | `semantic.success` | Excelente |

### 3.5 Vault Health Widget

```
┌──────────────────────────┐
│  🔒 Vault Health         │
│  ████████░░  78/100      │  ← Progress circular ou bar
│  3 senhas fracas         │  ← Link para lista filtrada
│  1 senha reutilizada     │
└──────────────────────────┘
```

---

## 4. Padrões de Layout

### 4.1 Desktop (≥1280px)

```
┌──────────┬────────────────────────────────────────┐
│          │  Header: [Search────────] [🔒][🌙][+]  │
│ Sidebar  ├────────────────────────────────────────┤
│ 240px    │                                        │
│          │  Content Area                          │
│ • Dash   │  ┌────┐ ┌────┐ ┌────┐ ┌────┐         │
│ • Creds  │  │Card│ │Card│ │Card│ │Card│         │
│ • Health │  └────┘ └────┘ └────┘ └────┘         │
│ • Config │                                        │
└──────────┴────────────────────────────────────────┘
```

### 4.2 Mobile (<768px)

```
┌─────────────────────────┐
│ [Search────────────]    │
├─────────────────────────┤
│                         │
│  ┌───────────────────┐  │
│  │ Credential Card   │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ Credential Card   │  │
│  └───────────────────┘  │
├─────────────────────────┤
│ [🏠] [🔑] [➕] [⚙️]     │  ← Bottom navigation
└─────────────────────────┘
```

### 4.3 Tablet (768-1279px)

- Sidebar colapsável (hamburger)
- Grid 2 colunas de cards
- Form em modal centralizado

---

## 5. Ícones

**Biblioteca:** Lucide React (ou Chakra Icons)

| Contexto | Ícone |
|----------|-------|
| Dashboard | `LayoutDashboard` |
| Credenciais | `Key` |
| Nova credencial | `Plus` |
| Busca | `Search` |
| Copy | `Copy` / `Check` |
| Show/hide senha | `Eye` / `EyeOff` |
| Favorito | `Star` / `StarOff` |
| Editar | `Pencil` |
| Excluir | `Trash2` |
| Bloquear | `Lock` |
| Tema | `Sun` / `Moon` |
| Export | `Download` |
| Import | `Upload` |
| Health | `Shield` |
| Settings | `Settings` |

**Fallback de app (sem favicon):** Avatar circular com inicial + cor gerada por hash do `appName`

| Letra | Cor de fundo |
|-------|--------------|
| A-D | `#3182CE` |
| E-H | `#805AD5` |
| I-L | `#D53F8C` |
| M-P | `#DD6B20` |
| Q-T | `#38A169` |
| U-Z | `#00B5D8` |

---

## 6. Motion e Microinterações

| Interação | Animação | Duração | Easing |
|-----------|----------|---------|--------|
| Card hover | scale(1.02) + shadow | 150ms | ease-out |
| Copy success | icon morph + toast slide | 200ms | spring |
| Modal open | fade + scale from 0.95 | 200ms | ease-out |
| Toast enter | slide from bottom | 300ms | ease-out |
| Page transition | fade | 150ms | ease |
| Skeleton pulse | opacity pulse | 1.5s | linear loop |
| Theme switch | color transition | 200ms | ease |

**`prefers-reduced-motion`:** desabilitar scale e slide; manter apenas fade instantâneo.

---

## 7. Estados da Interface

### 7.1 Estados Globais

| Estado | Componente | Comportamento |
|--------|------------|---------------|
| Loading | `Skeleton` | Placeholder cards e campos |
| Empty | Ilustração + CTA | "Nenhuma credencial ainda" |
| Error | `Alert` + retry | Mensagem clara + botão |
| Offline (PWA) | Banner top | "Modo offline — dados locais" |

### 7.2 Estados de Formulário

| Estado | Visual |
|--------|--------|
| Default | Border `border.default` |
| Focus | Border `brand.primary`, ring 2px |
| Error | Border `semantic.error`, mensagem abaixo |
| Disabled | Opacity 0.6, cursor not-allowed |

---

## 8. Acessibilidade

| Requisito | Implementação |
|-----------|---------------|
| Contraste texto | ≥ 4.5:1 (AA) — validar em ambos temas |
| Focus visible | `outline: 2px solid brand.primary` |
| Labels | Todo input com `Field.Label` |
| Senha | `aria-label="Senha oculta"` no toggle |
| Copy | `aria-live="polite"` no toast |
| Navegação | Tab order lógico; skip link para conteúdo |
| Modals | Focus trap; Esc fecha |
| Touch | Mínimo 44×44px em mobile |

---

## 9. Tokens Chakra — Configuração Sugerida

```tsx
// theme.ts (referência para frontend-dev)
import { createSystem, defaultConfig } from "@chakra-ui/react"

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#EBF8FF" },
          500: { value: "#3182CE" },
          600: { value: "#2B6CB0" },
        },
      },
      fonts: {
        heading: { value: "Inter, sans-serif" },
        body: { value: "Inter, sans-serif" },
        mono: { value: "JetBrains Mono, monospace" },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          canvas: { value: { base: "{colors.gray.50}", _dark: "#0D1117" } },
          surface: { value: { base: "white", _dark: "#161B22" } },
        },
      },
    },
  },
})
```

---

## 10. Checklist de Implementação

- [ ] Provider Chakra UI v3 no layout root
- [ ] ColorModeProvider (light/dark/system)
- [ ] Font Inter carregada via `next/font`
- [ ] Componentes base: Button, Input, Card, Dialog, Toast
- [ ] CredentialCard composto
- [ ] Responsive grid com `SimpleGrid columns={{ base: 1, md: 2, xl: 4 }}`
- [ ] Tokens semânticos para dark mode
- [ ] Testes de contraste em ambos os modos

---

## 11. Referências

- [Chakra UI v3 Docs](https://www.chakra-ui.com/docs)
- `outputs/product-owner/requirements.md` (RNF-A11Y, breakpoints)
- `outputs/ux/user-research.md` (princípios de design)
