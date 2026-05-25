# Testes Automatizados

Este projeto inclui uma suite completa de testes usando Jest e React Testing Library.

## Estrutura de Testes

Os testes estão organizados em `__tests__/`:

### `__tests__/lib/`
- **schemas.test.ts** - Testes para validação de schemas Zod (30+ testes)
  - Valida entrada de dados para nomes, marcas, modelos, carros
  - Testa conversão de tipos (strings para números)
  - Verifica mensagens de erro
  - Valida campos obrigatórios

- **carro-store.test.ts** - Testes para o store Zustand de carros
  - Fetch de dados com sucesso e com erro
  - CRUD de carros (Create, Read, Update, Delete)
  - Manipulação de estado e loading
  - Tratamento de erros

- **marca-store.test.ts** - Testes para o store Zustand de marcas (novo)
  - Operações CRUD de marcas
  - Fetch de marcas
  - Adição, atualização e remoção de marcas

- **modelo-store.test.ts** - Testes para o store Zustand de modelos (novo)
  - Operações CRUD de modelos
  - Fetch de modelos com relacionamento de marca
  - Adição, atualização e remoção de modelos

### `__tests__/components/`
- **DataGrid.test.tsx** - Testes do componente DataGrid
  - Renderização de tabela
  - Seleção de linhas
  - Filtragem e busca
  - Ordenação
  - Ações customizadas
  - Formatação de células

## Rodar Testes

### Todos os testes
```bash
npm test
```

### Modo watch (reexecuta ao salvar)
```bash
npm run test:watch
```

### Com cobertura
```bash
npm run test:coverage
```

### Teste específico
```bash
npm test -- schemas.test.ts
```

### Parar após primeira falha
```bash
npm test -- --bail
```

## Cobertura de Testes

Áreas cobertas:
- ✅ Validação de schemas Zod (nomes, marcas, modelos, carros)
- ✅ Operações CRUD nos stores (Zustand):
  - Carros Store
  - Marcas Store (novo)
  - Modelos Store (novo)
- ✅ Componentes React (renderização, interação, filtragem)
  - DataGrid (renderização, seleção, filtragem, ações)

**Total: 68 testes passando** ✅

## Configuração

- **jest.config.js** - Configuração do Jest
- **jest.setup.js** - Setup global (imports de bibliotecas)
- **package.json** - Scripts de teste

## Adicionando Novos Testes

1. Crie um arquivo `.test.ts` ou `.test.tsx` em `__tests__/`
2. Importe dependências necessárias
3. Use `describe` e `it` para organizar testes
4. Execute `npm test` para validar

## Exemplo de Teste

```typescript
describe('Feature X', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve fazer Y', () => {
    // Arrange
    const input = { /* ... */ };
    
    // Act
    const result = functionX(input);
    
    // Assert
    expect(result).toBeDefined();
  });
});
```

## Boas Práticas

### Para Stores Zustand
- Sempre resete o estado entre testes no `beforeEach`
- Use `renderHook` para testar hooks do Zustand
- Mocke `fetch` globalmente para testes de API

### Para Componentes React
- Use `render` do React Testing Library
- Prefira queries por acessibilidade (byRole, byText)
- Mocke callbacks que recebem parâmetros complexos

### Para Validação
- Teste casos de sucesso e erro
- Valide conversão de tipos
- Verifique mensagens de erro específicas
