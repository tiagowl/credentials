# Relatório de Usabilidade — Credentials Vault

**Projeto:** Gerenciador de Credenciais Pessoal  
**Data:** 2026-05-26  
**Agente:** UX Designer  
**Tipo:** Avaliação heurística + cenários de teste planejados  
**Base:** Wireframes e protótipos documentados

---

## 1. Resumo Executivo

Este relatório consolida a **avaliação heurística** do design proposto e define **cenários de teste de usabilidade** para validação com o stakeholder (usuário único). O design foi avaliado contra as 10 heurísticas de Nielsen e os requisitos de usabilidade do Product Owner.

### Resultado geral

| Dimensão | Score (1-5) | Status |
|----------|-------------|--------|
| Eficiência (velocidade) | 4.5 | ✅ Aprovado com ressalvas |
| Aprendibilidade | 4.5 | ✅ Aprovado |
| Segurança percebida | 4.0 | ✅ Aprovado |
| Estética e profissionalismo | 4.5 | ✅ Aprovado |
| Acessibilidade | 4.0 | ⚠️ Validar em implementação |
| Mobile | 4.0 | ⚠️ Validar em device real |

**Veredicto:** Design aprovado para implementação (Release 0.5 → 1.5), com testes formais recomendados após Sprint 2.

---

## 2. Metodologia

| Método | Aplicação |
|--------|-----------|
| **Heuristic Evaluation** | 10 heurísticas de Nielsen |
| **Cognitive Walkthrough** | 5 tarefas críticas |
| **Task Analysis** | Métricas de tempo/cliques |
| **Accessibility Review** | WCAG 2.1 AA checklist |
| **Responsive Review** | 3 breakpoints |

> Testes com usuário real (N=1, stakeholder) planejados pós-MVP Sprint 2.

---

## 3. Avaliação Heurística (Nielsen)

| # | Heurística | Score | Observações |
|---|------------|-------|-------------|
| H1 | Visibilidade do status | 4/5 | Toast copy OK; falta progress em import longo |
| H2 | Correspondência sistema-mundo | 5/5 | Ícones de apps, linguagem natural pt-BR |
| H3 | Controle e liberdade | 4/5 | Cancelar em modals; falta undo delete |
| H4 | Consistência e padrões | 5/5 | Chakra UI garante consistência |
| H5 | Prevenção de erros | 4/5 | Confirmação delete; CSV export warning |
| H6 | Reconhecimento vs recall | 5/5 | Ícones, favoritos, busca — mínima memória |
| H7 | Flexibilidade e eficiência | 4/5 | Atalhos Ctrl+K, Ctrl+H; falta keyboard nav completa na lista |
| H8 | Design estético e minimalista | 5/5 | Single-user, sem clutter enterprise |
| H9 | Recuperação de erros | 3/5 | Mensagens claras; sem recuperação senha mestra (by design) |
| H10 | Ajuda e documentação | 3/5 | Dicas inline no empty state; sem help center |

**Média:** 4.2/5

### Problemas identificados (por severidade)

| ID | Severidade | Problema | Recomendação | Sprint |
|----|------------|----------|--------------|--------|
| UX-01 | Baixa | Sem undo após excluir | Toast com "Desfazer" (5s) | 3 |
| UX-02 | Média | Keyboard nav entre cards incompleta | Arrow keys entre cards + Enter copy | 2 |
| UX-03 | Baixa | Import longo sem progress | Progress bar determinada | 5 |
| UX-04 | Média | Senha mestra irrecuperável pode frustrar | Modal educativo no setup + reminder export | 1 |
| UX-05 | Baixa | Sem tour guiado | Opcional: tooltip tour no 1º acesso | 3 |

---

## 4. Cenários de Teste (Task Scenarios)

### TS-01: Onboarding completo

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Criar vault e 1ª credencial |
| **Stories** | US-001, US-005, US-017 |
| **Steps** | 1. Acessar app 2. Criar senha mestra 3. Adicionar YouTube 4. Copiar senha |
| **Success criteria** | Completo em ≤ 60 segundos |
| **Métricas** | Tempo total, erros, cliques |

**Resultado esperado (heuristic):** ✅ 4-5 cliques, ~45s para usuário tech

---

### TS-02: Copiar senha do Facebook (uso diário)

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Encontrar e copiar senha |
| **Stories** | US-015, US-017 |
| **Steps** | 1. Login 2. Buscar "facebook" 3. Copiar senha |
| **Success criteria** | ≤ 5 segundos após login |
| **Métricas** | Task time, cliques |

**Resultado esperado:** ✅ 2 cliques (busca + copy), ~3s

---

### TS-03: Identificar senhas fracas

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Encontrar e corrigir senha fraca |
| **Stories** | US-026, US-027, US-028 |
| **Steps** | 1. Ver widget health 2. Abrir lista fracas 3. Melhorar 1 senha |
| **Success criteria** | Fluxo completado sem confusão |
| **Métricas** | Task time, satisfação (1-5) |

**Resultado esperado:** ✅ Fluxo claro com CTA "Melhorar"

---

### TS-04: Usar app no celular

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Copiar credencial no mobile |
| **Stories** | US-014, US-017 |
| **Device** | iPhone SE (375px) ou equivalente |
| **Steps** | 1. Abrir PWA/browser 2. Login 3. Buscar 4. Copy |
| **Success criteria** | Touch targets OK, ≤ 10s total |
| **Métricas** | Task time, erros de toque |

**Resultado esperado:** ⚠️ Validar drawer form e bottom nav em device real

---

### TS-05: Exportar backup

| Campo | Detalhe |
|-------|---------|
| **Objetivo** | Exportar vault criptografado |
| **Stories** | US-029 |
| **Steps** | 1. Settings 2. Export 3. Confirmar senha 4. Download |
| **Success criteria** | Arquivo baixado sem ambiguidade |
| **Métricas** | Task time, erros |

**Resultado esperado:** ✅ Fluxo de 2 steps claro

---

## 5. Métricas de Usabilidade (Targets)

| Métrica | Target PO | Design suporta? |
|---------|-----------|-----------------|
| Task success rate | ≥ 95% | ✅ Sim |
| Time on task (copy) | < 5s | ✅ Sim (2 cliques) |
| Error rate | < 5% | ✅ Validações inline |
| SUS Score | ≥ 80 | ⚠️ Testar pós-MVP |
| Cliques para copy | 1 | ✅ Copy inline no card |
| Onboarding time | ≤ 60s | ✅ Fluxo enxuto |

---

## 6. Teste de Acessibilidade (Checklist)

| Critério WCAG | Status design | Notas |
|---------------|---------------|-------|
| 1.1.1 Non-text Content | ✅ | Avatares com alt text (app name) |
| 1.4.3 Contrast | ✅ | Tokens Chakra AA |
| 2.1.1 Keyboard | ⚠️ | Forms OK; lista parcial (UX-02) |
| 2.4.3 Focus Order | ✅ | Tab order definido nos forms |
| 2.4.7 Focus Visible | ✅ | Chakra focus ring |
| 3.3.1 Error Identification | ✅ | Inline errors |
| 4.1.2 Name, Role, Value | ✅ | Chakra aria built-in |

**Ações:** Implementar keyboard nav na grid de cards (Sprint 2).

---

## 7. Teste Responsivo

| Breakpoint | Layout | Issues |
|------------|--------|--------|
| 1440px desktop | Sidebar + grid 4 col | Nenhum |
| 1024px tablet | Sidebar collapse + grid 2 | Nenhum |
| 768px tablet portrait | Drawer nav + list | Validar touch |
| 375px mobile | Bottom nav + drawer form | Validar teclado vs footer |
| 320px mobile | Single column | Testar overflow em cards longos |

---

## 8. Feedback Qualitativo (Projetado)

Com base em personas e heuristic evaluation:

| Aspecto | Feedback esperado |
|---------|-------------------|
| Visual | "Parece app profissional, não planilha" |
| Velocidade | "Copy em 1 clique é o killer feature" |
| Ícones | "Reconheço YouTube/Facebook instantaneamente" |
| Dark mode | "Confortável à noite" |
| Preocupação | "E se esquecer senha mestra?" → mitigar no setup |
| Mobile | "Funciona, mas form poderia ser maior" → drawer full |

---

## 9. Plano de Iteração

| Sprint | Teste | Foco |
|--------|-------|------|
| Sprint 2 | TS-01, TS-02 | Onboarding + copy speed |
| Sprint 4 | TS-03, TS-04 | Health + mobile |
| Sprint 6 | TS-05 | Export + PWA |
| Pós 1.5 | SUS questionnaire | Satisfação geral |

### Critérios de go/no-go para Release 1.0

- [ ] TS-02 completado em < 5s (3 tentativas)
- [ ] TS-01 completado em < 60s
- [ ] Zero issues severidade alta abertos
- [ ] Dark mode sem bugs visuais
- [ ] SUS ≥ 75 (autoavaliação stakeholder)

---

## 10. Conclusões e Próximos Passos

### Pontos fortes do design
1. Copy inline elimina principal fricção de password managers
2. Busca global persistente acelera uso diário
3. Ícones + cards criam identidade visual diferenciada
4. Single-user permite UI limpa sem clutter
5. Chakra UI v3 acelera implementação consistente

### Melhorias prioritárias antes/durante implementação
1. **UX-04:** Educar sobre senha mestra irrecuperável no setup
2. **UX-02:** Keyboard navigation na lista de credenciais
3. **UX-01:** Undo delete (nice-to-have Sprint 3)

### Handoff para frontend-dev
- Wireframes: `outputs/ux/wireframes/`
- Design system: `outputs/ux/design-system.md`
- Interações: `outputs/ux/prototypes/`
- Critérios: `outputs/product-owner/acceptance-criteria.md`

---

## 11. Referências

- Nielsen, J. (1994). *10 Usability Heuristics*
- `outputs/product-owner/requirements.md` (métricas RNF-UX)
- `outputs/ux/user-research.md` (personas e jornadas)
