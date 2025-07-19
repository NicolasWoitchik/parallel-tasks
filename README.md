# @wtk/parallel-tasks

[![npm version](https://badge.fury.io/js/@wtk%2Fparallel-tasks.svg)](https://badge.fury.io/js/@wtk%2Fparallel-tasks)
[![Build Status](https://github.com/WTK-Desenvolvimento/parallel-tasks/workflows/Test%20&%20Lint/badge.svg)](https://github.com/WTK-Desenvolvimento/parallel-tasks/actions)
[![Coverage Status](https://codecov.io/gh/WTK-Desenvolvimento/parallel-tasks/branch/main/graph/badge.svg)](https://codecov.io/gh/WTK-Desenvolvimento/parallel-tasks)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)

**Um framework TypeScript para execução paralela de tasks/verificações/rotinas usando decorators e boas práticas.**

## ✨ Features

- 🚀 **Execução Paralela**: Tasks executam simultaneamente usando `Promise.allSettled`
- 🎯 **Decorators Elegantes**: Use `@RegisterTask()` para registrar tasks facilmente
- 📁 **Descoberta Automática**: Carregamento automático via glob patterns
- 🛡️ **Type Safety**: Tipagem forte com generics TypeScript
- 🔄 **Error Handling**: Isolamento de falhas - uma task que falha não afeta outras
- 📦 **Dual Build**: Suporte para CommonJS e ES Modules
- 🧪 **Testado**: Cobertura de testes abrangente

## 🚀 Quick Start

### Instalação

```bash
# npm
npm install @wtk/parallel-tasks

# yarn
yarn add @wtk/parallel-tasks

# pnpm
pnpm add @wtk/parallel-tasks
```

### Exemplo Básico

```typescript
import { ParallelTasks, RegisterTask } from "@wtk/parallel-tasks"

// 1. Crie suas tasks
export class ValidationTasks {
  @RegisterTask("USER_VALIDATION")
  async validateEmail(context: { email: string }): Promise<boolean> {
    // Simular validação de email
    const isValid = context.email.includes("@")
    console.log(`Email ${context.email} is ${isValid ? "valid" : "invalid"}`)
    return isValid
  }

  @RegisterTask("USER_VALIDATION")
  async validateCPF(context: { cpf: string }): Promise<boolean> {
    // Simular validação de CPF
    const isValid = context.cpf.length === 11
    console.log(`CPF ${context.cpf} is ${isValid ? "valid" : "invalid"}`)
    return isValid
  }
}

// 2. Configure e execute
async function main() {
  const parallelTasks = new ParallelTasks({
    tasks: ["./tasks/**/*.task.ts"], // ou classes diretamente
  })

  await parallelTasks.initialize()

  const results = await parallelTasks.execute("USER_VALIDATION", {
    email: "user@example.com",
    cpf: "12345678901",
  })

  console.log("Validation results:", results)
  // Output: [true, true] (ou com erros se alguma task falhar)
}

main()
```

## 📚 Documentação da API

### `ParallelTasks`

A classe principal do framework.

#### Constructor

```typescript
new ParallelTasks(options: IParallelTasksOptions)
```

**Parâmetros:**

- `options.tasks`: Array de classes ou glob patterns para descoberta de tasks

#### Métodos

##### `initialize(): Promise<Function[]>`

Inicializa o framework, descobrindo e carregando todas as tasks.

```typescript
const loadedClasses = await parallelTasks.initialize()
```

##### `execute<T, R>(taskName: string, context: T): Promise<R[]>`

Executa todas as tasks registradas com o nome especificado.

```typescript
const results = await parallelTasks.execute("TASK_NAME", context)
```

**Parâmetros:**

- `taskName`: Nome da task (definido no decorator)
- `context`: Objeto de contexto passado para todas as tasks

**Retorna:** Array com resultados de todas as tasks (sucessos e erros)

### `@RegisterTask(taskName: string)`

Decorator para registrar métodos como tasks executáveis.

```typescript
class MyTasks {
  @RegisterTask("DATA_PROCESSING")
  async processData(context: any): Promise<any> {
    // lógica da task
  }
}
```

## 🎯 Casos de Uso

### 1. Validações Paralelas

```typescript
export class UserValidationTasks {
  @RegisterTask("USER_VALIDATION")
  async validateEmail(user: User): Promise<ValidationResult> {
    // Validar email
    return { field: "email", valid: true }
  }

  @RegisterTask("USER_VALIDATION")
  async validatePhone(user: User): Promise<ValidationResult> {
    // Validar telefone
    return { field: "phone", valid: true }
  }

  @RegisterTask("USER_VALIDATION")
  async validateDocument(user: User): Promise<ValidationResult> {
    // Validar documento
    return { field: "document", valid: false, error: "Invalid format" }
  }
}
```

### 2. Processamento de Dados

```typescript
export class DataProcessingTasks {
  @RegisterTask("TRANSFORM_DATA")
  async convertToJSON(data: RawData): Promise<JsonData> {
    return JSON.parse(data.content)
  }

  @RegisterTask("TRANSFORM_DATA")
  async generateReport(data: RawData): Promise<Report> {
    return { summary: data.summary, timestamp: new Date() }
  }

  @RegisterTask("TRANSFORM_DATA")
  async validateStructure(data: RawData): Promise<ValidationResult> {
    return { valid: data.hasRequiredFields() }
  }
}
```

### 3. Integrações com APIs

```typescript
export class APIIntegrationTasks {
  @RegisterTask("SYNC_DATA")
  async syncWithCRM(payload: SyncPayload): Promise<CRMResponse> {
    // Chamada para CRM
    return await this.crmService.sync(payload)
  }

  @RegisterTask("SYNC_DATA")
  async syncWithERP(payload: SyncPayload): Promise<ERPResponse> {
    // Chamada para ERP
    return await this.erpService.sync(payload)
  }

  @RegisterTask("SYNC_DATA")
  async notifyWebhooks(payload: SyncPayload): Promise<WebhookResponse[]> {
    // Notificar webhooks
    return await this.webhookService.notify(payload)
  }
}
```

## ⚙️ Configuração Avançada

### Descoberta de Tasks

```typescript
const parallelTasks = new ParallelTasks({
  tasks: [
    // Classes diretamente
    UserValidationTasks,
    DataProcessingTasks,

    // Glob patterns
    "./src/tasks/**/*.task.ts",
    "./src/validators/**/*.validator.ts",

    // Paths específicos
    "./src/custom/my-tasks.ts",
  ],
})
```

### Tratamento de Erros

```typescript
const results = await parallelTasks.execute("MY_TASK", context)

// Separar sucessos de erros
const successes = results.filter(result => !(result instanceof Error))
const errors = results.filter(result => result instanceof Error)

console.log(`${successes.length} tasks succeeded`)
console.log(`${errors.length} tasks failed`)

// Processar erros
errors.forEach((error: Error) => {
  console.error("Task failed:", error.message)
})
```

### Tipagem Forte

```typescript
interface UserContext {
  email: string;
  cpf: string;
  name: string;
}

interface ValidationResult {
  field: string;
  valid: boolean;
  error?: string;
}

// Task com tipos específicos
@RegisterTask('VALIDATION')
async validateUser(context: UserContext): Promise<ValidationResult> {
  // TypeScript irá validar os tipos automaticamente
  return {
    field: 'email',
    valid: context.email.includes('@'),
    error: context.email.includes('@') ? undefined : 'Invalid email format'
  };
}

// Execução com tipos
const results = await parallelTasks.execute<UserContext, ValidationResult>(
  'VALIDATION',
  { email: 'user@test.com', cpf: '12345678901', name: 'John' }
);
```

## 🧪 Testes

O framework inclui uma suíte completa de testes:

```bash
# Executar testes
yarn test

# Testes com watch mode
yarn test:watch

# Coverage report
yarn test:coverage
```

## 🔧 Desenvolvimento

### Requisitos

- Node.js >= 18.0.0
- TypeScript >= 5.0.0

### Setup Local

```bash
# Clone o repositório
git clone https://github.com/WTK-Desenvolvimento/parallel-tasks.git
cd parallel-tasks

# Instale dependências
yarn install

# Execute os exemplos
yarn dev

# Build do projeto
yarn build

# Linting
yarn lint
yarn lint:fix
```

### Build

O projeto gera builds duais:

```bash
yarn build
```

Gera:

- `dist/cjs/` - CommonJS build
- `dist/esm/` - ES Modules build
- `dist/types/` - TypeScript definitions

## 🚦 Roadmap

### v0.1.0 (Próximo)

- [ ] Documentação completa da API
- [ ] Mais exemplos de uso
- [ ] Melhor tratamento de erros

### v0.2.0 (Futuro)

- [ ] Timeout configurável por task
- [ ] Sistema de retry automático
- [ ] Task dependencies
- [ ] Performance metrics

### v1.0.0 (Long Term)

- [ ] Plugin system
- [ ] Advanced scheduling
- [ ] Monitoring integrations
- [ ] Web dashboard

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Veja nosso [Contributing Guide](CONTRIBUTING.md) para detalhes.

### Como Contribuir

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Conventional Commits

Este projeto usa [Conventional Commits](https://conventionalcommits.org/) para versionamento automático:

- `feat:` - Nova feature
- `fix:` - Bug fix
- `docs:` - Mudanças na documentação
- `test:` - Adição/modificação de testes
- `refactor:` - Refatoração de código

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Nicolas Woitchik**

- GitHub: [@nicolaswoitchik](https://github.com/nicolaswoitchik)
- Email: nicolas@woitchik.com.br

**WTK Desenvolvimento**

- GitHub: [@WTK-Desenvolvimento](https://github.com/WTK-Desenvolvimento)

## 🙏 Acknowledgments

- Inspirado em frameworks como NestJS e TypeORM
- Comunidade TypeScript pela excelente ecosystem
- Todos os contribuidores que tornaram este projeto possível

---

<p align="center">
  Feito com ❤️ por <a href="https://github.com/WTK-Desenvolvimento">WTK Desenvolvimento</a>
</p>
