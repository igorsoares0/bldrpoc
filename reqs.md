# 🧩 Spec-Driven Development — Editor tipo Carrd (Next.js + Zustand)

## 📌 Visão Geral

Este documento define os requisitos e arquitetura de um **editor visual de páginas (landing page builder)** inspirado no Carrd.

O objetivo é construir um **MVP funcional e extensível**, focando inicialmente no **editor + dashboard simples**.

---

# 🎯 Objetivos do Projeto

* Criar um editor visual baseado em árvore (JSON)
* Permitir criação e edição de páginas
* Implementar preview em tempo real
* Ter um dashboard básico de gerenciamento

---

# 🏗️ Arquitetura Geral

## Stack

* Frontend: Next.js (App Router)
* State: Zustand
* Estilo: Tailwind (opcional)
* Persistência: API (mock ou real)

---

# 📂 Estrutura de Pastas

```
/app
  /dashboard
  /editor/[pageId]
  /preview/[pageId]

/editor
  /components
  /store
  /utils
  /types
```

---

# 🧱 MODELO DE DADOS

## Node (estrutura base)

```ts
type Node = {
  id: string
  type: "section" | "text" | "image" | "button"
  props: Record<string, any>
  children?: Node[]
}
```

## Page

```ts
type Page = {
  id: string
  title: string
  slug: string
  content: Node
  published: boolean
  createdAt: string
}
```

---

# 🧠 ESTADO (ZUSTAND)

## Editor Store

```ts
type EditorState = {
  tree: Node
  selectedId: string | null
  viewport: "desktop" | "mobile"

  selectNode: (id: string) => void
  updateNode: (id: string, props: any) => void
  addNode: (parentId: string, node: Node) => void
  deleteNode: (id: string) => void

  setViewport: (v: "desktop" | "mobile") => void
}
```

---

# 🔧 UTILITÁRIOS DE ÁRVORE

## Buscar node

```ts
function getNodeById(tree: Node, id: string): Node | null
```

## Atualizar node

```ts
function updateNodeById(tree: Node, id: string, updater: (node: Node) => Node): Node
```

## Remover node

```ts
function removeNodeById(tree: Node, id: string): Node
```

---

# 🎨 EDITOR

## Componentes principais

### Renderer

Responsável por transformar JSON em UI.

### Selectable

Wrapper que permite seleção de elementos.

### Sidebar

Painel de edição de propriedades.

### Toolbar

Adicionar novos elementos.

---

# 🖼️ RENDERIZAÇÃO

## Regras

* Cada Node vira um componente React
* children são renderizados recursivamente
* props controlam estilo e conteúdo

---

# 🖱️ INTERAÇÕES

## Seleção

* Click em elemento → seleciona
* Destaque visual

## Edição

* Sidebar altera props
* Atualização em tempo real

## Inserção

* Toolbar adiciona elementos ao node selecionado

---

# 📱 RESPONSIVIDADE

## Estado

```ts
viewport: "desktop" | "mobile"
```

## Comportamento

* Renderer adapta estilos
* Preview alternável

---

# 🔄 UNDO / REDO (FASE 2)

Estrutura:

```ts
{
  past: Node[]
  present: Node
  future: Node[]
}
```

---

# 🚫 FORA DO ESCOPO (MVP)

* Drag and drop
* Grid avançado
* Animações
* Templates
* SEO avançado

---

# 🧪 MVP DO EDITOR

## Deve ter

* Render JSON
* Seleção de elemento
* Edição de texto
* Adição de elementos
* Preview

---

# 📊 DASHBOARD

## Objetivo

Interface simples para gerenciar páginas.

---

## 📄 Página: `/dashboard`

### Layout

* Header
* Lista de páginas
* Botão "Nova página"

---

## Componentes

### PageCard

```ts
type PageCardProps = {
  title: string
  slug: string
  published: boolean
}
```

### Ações

* Editar
* Duplicar
* Deletar
* Publicar

---

## Exemplo de UI

```
----------------------------------
| Dashboard                      |
----------------------------------
| [Nova Página]                 |
----------------------------------
| Página 1     | Edit | Delete  |
| Página 2     | Edit | Delete  |
----------------------------------
```

---

## Fluxos

### Criar página

1. Click "Nova Página"
2. Cria Page com conteúdo inicial
3. Redireciona para `/editor/[id]`

---

### Editar página

1. Click "Editar"
2. Abre editor com JSON carregado

---

### Deletar página

1. Click "Delete"
2. Remove do estado/backend

---

# 🔌 API (SIMPLIFICADA)

## Endpoints

### GET /pages

Lista páginas

### POST /pages

Cria página

### GET /pages/:id

Detalhe

### PUT /pages/:id

Atualiza

### DELETE /pages/:id

Remove

---

# 🚀 ROADMAP

## Fase 1 (MVP)

* Dashboard básico
* Editor funcional
* Persistência simples

## Fase 2

* Undo/Redo
* Drag and drop
* Templates

## Fase 3

* Publicação
* Custom domain
* Analytics

---

# 💡 PRINCÍPIOS

* Tudo é um Node
* Estado centralizado
* UI é reflexo do estado
* Operações previsíveis

---

# ✅ CRITÉRIOS DE ACEITAÇÃO

* Usuário consegue criar página
* Usuário consegue editar conteúdo
* Mudanças refletem em tempo real
* Estrutura JSON é persistida
* Dashboard lista páginas corretamente

---

# 🧭 FUTURO

* Sistema de plugins
* Componentes customizados
* Colaboração em tempo real

---

**Fim do Spec**
