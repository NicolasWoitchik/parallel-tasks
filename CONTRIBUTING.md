# Contributing to @wtk/parallel-tasks

Obrigado pelo interesse em contribuir para o Parallel Tasks Framework! 🎉

## 📋 Como Contribuir

### Reportando Bugs

Se você encontrou um bug, por favor:

1. **Procure por issues existentes** para verificar se já foi reportado
2. **Crie uma nova issue** se não encontrar nada relacionado
3. **Forneça detalhes** incluindo:
   - Versão do Node.js
   - Versão do framework
   - Código que reproduz o problema
   - Comportamento esperado vs atual
   - Logs de erro (se houver)

### Sugerindo Features

Para sugerir novas funcionalidades:

1. **Verifique o roadmap** no README.md
2. **Abra uma issue** com label `enhancement`
3. **Descreva a funcionalidade** detalhadamente:
   - Problema que resolve
   - Solução proposta
   - Exemplos de uso
   - Impacto na API atual

### Enviando Pull Requests

#### Preparação

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Configure** o ambiente de desenvolvimento

```bash
git clone https://github.com/seu-usuario/parallel-tasks.git
cd parallel-tasks
yarn install
```

#### Desenvolvimento

1. **Crie uma branch** para sua feature/fix:

```bash
git checkout -b feature/nova-funcionalidade
# ou
git checkout -b fix/correcao-bug
```

2. **Faça suas alterações** seguindo os padrões do projeto
3. **Adicione/atualize testes** se necessário
4. **Execute os testes** para garantir que tudo funciona:

```bash
yarn test
yarn lint
yarn build
```

#### Commits

Este projeto usa [Conventional Commits](https://conventionalcommits.org/). Use o formato:

```
type(scope): description

[optional body]

[optional footer]
```

**Tipos permitidos:**

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `style`: Formatação de código (sem mudança lógica)
- `refactor`: Refatoração (sem nova feature ou bug fix)
- `test`: Adição/modificação de testes
- `chore`: Tarefas de manutenção

**Exemplos:**

```
feat(core): add timeout support for tasks
fix(decorator): resolve metadata registration issue
docs(readme): update API documentation
test(parallel-tasks): add error handling tests
```

#### Submissão

1. **Push** sua branch:

```bash
git push origin feature/nova-funcionalidade
```

2. **Abra um Pull Request** com:
   - Título descritivo
   - Descrição detalhada das mudanças
   - Link para issues relacionadas
   - Screenshots (se aplicável)

## 🔧 Setup de Desenvolvimento

### Requisitos

- Node.js >= 18.0.0
- Yarn (recomendado)
- TypeScript >= 5.0.0

### Scripts Úteis

```bash
# Desenvolvimento
yarn dev                 # Executar exemplo
yarn build              # Build completo
yarn build:watch        # Build em modo watch

# Testes
yarn test               # Executar testes
yarn test:watch         # Testes em modo watch
yarn test:coverage      # Coverage report

# Qualidade de código
yarn lint               # Executar linter
yarn lint:fix           # Corrigir problemas automáticos
yarn typecheck          # Verificar tipos

# Limpeza
yarn clean              # Limpar builds
```

### Estrutura do Projeto

```
parallel-tasks/
├── src/                    # Código fonte
│   ├── decorators/         # Decorators (@RegisterTask)
│   ├── interfaces/         # Type definitions
│   ├── utils/              # Service layer
│   ├── __tests__/          # Testes
│   ├── parallel-tasks.ts   # Classe principal
│   └── index.ts            # API pública
├── sample/                 # Exemplos de uso
├── dist/                   # Builds (gerado)
│   ├── cjs/                # CommonJS
│   ├── esm/                # ES Modules
│   └── types/              # Type definitions
├── memory-bank/            # Documentação do projeto
└── .github/                # GitHub workflows
```

## 📝 Padrões de Código

### TypeScript

- **Strict mode** habilitado
- **Explicit return types** em APIs públicas
- **Generic types** sempre que apropriado
- **Interface segregation** - interfaces pequenas e focadas

### Naming Conventions

- **Classes**: PascalCase (`ParallelTasks`)
- **Methods**: camelCase (`execute()`)
- **Constants**: UPPER_SNAKE_CASE (`TASK_REGISTRY`)
- **Files**: kebab-case (`parallel-tasks.ts`)

### Code Style

- **ESLint** com configuração Airbnb
- **2 spaces** para indentação
- **Single quotes** para strings
- **Trailing commas** em objects/arrays
- **Semicolons** obrigatórios

### Testes

- **Jest** como framework de testes
- **AAA pattern** (Arrange, Act, Assert)
- **Descriptive names** para describes e its
- **Mock** apenas quando necessário
- **Coverage** mínimo de 80%

### Documentação

- **JSDoc** para APIs públicas
- **README** atualizado com exemplos
- **CHANGELOG** automático via semantic-release
- **Memory Bank** para contexto de desenvolvimento

## 🚨 Diretrizes Importantes

### Breaking Changes

- **Evite** breaking changes sempre que possível
- Se necessário, documente claramente
- Incremente a major version corretamente
- Forneça migration guide

### Performance

- **Promise.allSettled** para execução paralela
- **Lazy loading** para módulos
- **Minimize** overhead do framework
- **Profile** mudanças que podem impactar performance

### Error Handling

- **Nunca** quebrar outras tasks por erro de uma
- **Return errors** em vez de throw (quando apropriado)
- **Specific error messages** com contexto
- **Graceful degradation** sempre que possível

### Dependencies

- **Minimize** dependências externas
- **Audit** regularmente (npm audit)
- **Pin** versions em major releases
- **Document** breaking changes em dependencies

## 🤝 Processo de Review

### O que esperamos

1. **Code quality** - código limpo e bem estruturado
2. **Tests** - cobertura adequada de testes
3. **Documentation** - documentação atualizada
4. **Backward compatibility** - ou migração clara
5. **Performance** - sem regressões significativas

### O que analisamos

- Funcionalidade implementada corretamente
- Testes cobrindo casos de uso e edge cases
- Código seguindo padrões do projeto
- Documentação clara e atualizada
- Impacto na API existente
- Performance e security implications

## 💬 Dúvidas?

- **Issues**: Para bugs e feature requests
- **Discussions**: Para dúvidas gerais
- **Email**: nicolas@woitchik.com.br (para questões sensíveis)

## 🙏 Reconhecimento

Todos os contribuidores são reconhecidos no README.md e releases notes.

Obrigado por contribuir! 🚀
