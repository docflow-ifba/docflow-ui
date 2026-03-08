# docflow-ui

Frontend React responsável pelo **dashboard administrativo** e pela **interface de chat** com os editais. Parte da arquitetura DOC:FLOW.

---

## Funcionalidades

- Login com autenticação JWT
- **ADMIN**: dashboard com visão geral, gerenciamento de editais (upload de PDF), organizações e usuários
- **USER**: interface de chat para consultar editais via RAG em tempo real (streaming via WebSocket)
- Exibição de seções `<think>` do modelo de IA separadas da resposta final

---

## Estrutura

```
src/
├── App.tsx                          # Roteamento principal
├── contexts/AuthContext.tsx         # Contexto de autenticação JWT
├── hooks/useSocket.tsx              # Conexão Socket.IO
├── pages/
│   ├── login/LoginPage.tsx
│   └── dashboard/
│       ├── DashboardPage.tsx        # Visão geral (admin)
│       ├── notices/                 # CRUD de editais
│       ├── organizations/           # CRUD de organizações
│       ├── settings/                # Configurações
│       └── chat/                    # Interface de chat (todos os usuários)
└── components/
    └── ui/                          # Componentes shadcn/ui
```

---

## Pré-requisitos

- Node.js 20+
- docflow-query rodando em `http://localhost:3001`

---

## Instalação

```bash
cd docflow-ui
npm install
```

---

## Configuração

Por padrão o frontend aponta para `http://localhost:3001`. Para alterar, ajuste a URL da API em `src/contexts/AuthContext.tsx` e `src/hooks/useSocket.tsx`.

---

## Execução

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

Acesse: `http://localhost:5173`

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| React 19 + Vite | Framework + bundler |
| TypeScript | Tipagem estática |
| Tailwind CSS + shadcn/ui | Estilização (New York style) |
| React Router v7 | Roteamento |
| Socket.IO Client | Chat em tempo real |

---

## Licença

MIT License © 2025
