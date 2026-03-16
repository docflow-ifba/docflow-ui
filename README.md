# docflow-ui

Frontend React responsável pelo **dashboard administrativo** e pela **interface de chat** com os editais. Parte da arquitetura DOC:FLOW.

---

## Funcionalidades

- Login com autenticação JWT e validação de formulário
- **ADMIN**: dashboard com visão geral, gerenciamento de editais (upload de PDF), organizações e configurações de perfil/senha
- **USER**: interface de chat para consultar editais via RAG em tempo real (streaming via WebSocket)
- Exibição de seções `<think>` do modelo de IA separadas da resposta final

---

## Estrutura

```
src/
├── App.tsx                          # Roteamento principal
├── main.tsx                         # Bootstrap React + Toaster + ErrorBoundary
├── components/
│   ├── ErrorBoundary.tsx            # Boundary de erros globais (class component)
│   └── ui/                          # Componentes shadcn/ui (New York style)
├── contexts/AuthContext.tsx         # Contexto de autenticação JWT
├── hooks/
│   ├── useSocket.tsx                # Conexão Socket.IO (tipagem genérica)
│   ├── useNotices.ts                # Hook para busca de editais (loading/error/refetch)
│   └── useOrganizations.ts         # Hook para busca de instituições
├── schemas/                         # Schemas de validação Zod
│   ├── login.schema.ts
│   ├── notice.schema.ts
│   ├── organization.schema.ts
│   └── settings.schema.ts
├── pages/
│   ├── login/LoginPage.tsx
│   └── dashboard/
│       ├── DashboardPage.tsx        # Visão geral (admin) — dados ilustrativos
│       ├── notices/                 # CRUD de editais (upload de PDF)
│       ├── organizations/           # CRUD de organizações
│       ├── settings/                # Perfil e alteração de senha
│       └── chat/                    # Interface de chat (todos os usuários)
└── services/                        # Chamadas de API via Axios
```

---

## Pré-requisitos

- Node.js 20+
- docflow-query rodando em `http://localhost:3001` (ou conforme `VITE_API_URL`)

---

## Instalação

```bash
cd docflow-ui
npm install
```

---

## Configuração

Copie o arquivo de exemplo e ajuste conforme necessário:

```bash
cp .env.example .env
```

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3001` | URL base do backend docflow-query |

> Apenas variáveis prefixadas com `VITE_` são expostas ao código cliente pelo Vite.

---

## Execução

```bash
npm run dev       # Servidor de desenvolvimento
npm run build     # Build de produção (TypeScript + Vite)
npm run preview   # Preview do build
npm run lint      # Verificação ESLint
```

Acesse: `http://localhost:5173`

---

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19 | Framework UI |
| Vite | 6 | Bundler + dev server |
| TypeScript | 5.8 | Tipagem estática |
| Tailwind CSS | v4 | Estilização utilitária |
| shadcn/ui | New York | Componentes de UI |
| React Router | v7 | Roteamento SPA |
| react-hook-form | — | Gerenciamento de formulários |
| zod | — | Validação de schemas |
| DOMPurify | — | Sanitização XSS em conteúdo Markdown |
| Socket.IO Client | 4 | Chat em tempo real (streaming) |
| sonner | — | Notificações toast |
| Axios | 1 | Cliente HTTP com interceptor JWT |

---

## Arquitetura de Formulários

Todos os formulários utilizam **react-hook-form** com **zodResolver**. Os schemas de validação ficam centralizados em `src/schemas/`. O componente `Input` do shadcn/ui é compatível com `{...register('campo')}` via spread direto, sem wrappers adicionais.

```tsx
// Exemplo de padrão usado em todos os formulários
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

---

## Licença

MIT License © 2025
