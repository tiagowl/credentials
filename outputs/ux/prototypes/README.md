# Protótipos — Credentials Vault

**Projeto:** Gerenciador de Credenciais Pessoal  
**Data:** 2026-05-26  
**Agente:** UX Designer  
**Fidelidade:** Média-alta (especificação interativa para implementação)

---

## Índice

| Arquivo | Conteúdo |
|---------|----------|
| [interaction-flows.md](./interaction-flows.md) | Fluxos interativos principais |
| [states-and-transitions.md](./states-and-transitions.md) | Estados, transições e feedback |

---

## Escopo dos Protótipos

Protótipos especificados em documento para implementação pelo **frontend-dev** com Next.js + Chakra UI v3. Não inclui arquivos Figma — wireframes ASCII servem como base visual.

### Fluxos prototipados

| ID | Fluxo | Prioridade | Release |
|----|-------|------------|---------|
| PF-01 | Onboarding (setup → 1ª credencial) | P1 | 0.5 |
| PF-02 | Login e desbloqueio | P1 | 0.5 |
| PF-03 | Buscar e copiar credencial | P1 | 0.5 |
| PF-04 | CRUD completo | P1 | 0.5 |
| PF-05 | Dashboard e favoritos | P1-P2 | 1.0 |
| PF-06 | Tema claro/escuro | P1 | 1.0 |
| PF-07 | Vault health e correção | P2 | 1.0 |
| PF-08 | Export / Import | P2 | 1.5 |
| PF-09 | Panic mode | P3 | 1.5 |
| PF-10 | PWA offline | P2 | 1.5 |

---

## Componentes Interativos Chave

| Componente | Interações |
|------------|------------|
| `SearchBar` | type → debounce → filter; Ctrl+K focus; Esc clear |
| `CredentialCard` | copy fields; toggle password; favorite; edit; delete |
| `PasswordField` | show/hide; generate; strength bar |
| `ThemeToggle` | light ↔ dark ↔ system |
| `VaultHealthWidget` | click → navigate /health |
| `ToastSystem` | copy success; save; delete; error |
| `SessionOverlay` | idle timeout → blur + re-auth |

---

## Referências

- `../wireframes/` — layouts base
- `../design-system.md` — tokens e componentes
- `../../product-owner/acceptance-criteria.md` — critérios de validação
