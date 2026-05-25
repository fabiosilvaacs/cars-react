import {
  nomeSchema,
  marcaBodySchema,
  modeloBodySchema,
  carroCreateSchema,
  carroUpdateSchema,
  idParamSchema,
} from '../../lib/validations/schemas';

describe('Validation Schemas', () => {
  describe('nomeSchema', () => {
    it('deve aceitar um nome válido', () => {
      expect(nomeSchema.parse('Ford')).toBe('Ford');
    });

    it('deve rejeitar nome vazio', () => {
      expect(() => nomeSchema.parse('')).toThrow();
    });

    it('deve rejeitar nome com apenas espaços', () => {
      expect(() => nomeSchema.parse('   ')).toThrow();
    });

    it('deve trimmar espaços em branco', () => {
      expect(nomeSchema.parse('  Honda  ')).toBe('Honda');
    });
  });

  describe('marcaBodySchema', () => {
    it('deve validar uma marca com nome válido', () => {
      const result = marcaBodySchema.parse({ nome: 'Toyota' });
      expect(result).toEqual({ nome: 'Toyota' });
    });

    it('deve rejeitar marca sem nome', () => {
      expect(() => marcaBodySchema.parse({})).toThrow();
    });

    it('deve rejeitar marca com nome vazio', () => {
      expect(() => marcaBodySchema.parse({ nome: '' })).toThrow();
    });
  });

  describe('modeloBodySchema', () => {
    it('deve validar um modelo com dados válidos', () => {
      const result = modeloBodySchema.parse({
        nome: 'Civic',
        marcaId: 1,
      });
      expect(result).toEqual({ nome: 'Civic', marcaId: 1 });
    });

    it('deve rejeitar modelo sem nome', () => {
      expect(() => modeloBodySchema.parse({ marcaId: 1 })).toThrow();
    });

    it('deve rejeitar modelo sem marcaId', () => {
      expect(() => modeloBodySchema.parse({ nome: 'Civic' })).toThrow();
    });

    it('deve rejeitar marcaId negativo', () => {
      expect(() =>
        modeloBodySchema.parse({ nome: 'Civic', marcaId: -1 }),
      ).toThrow();
    });

    it('deve converter string para número em marcaId', () => {
      const result = modeloBodySchema.parse({
        nome: 'Civic',
        marcaId: '5',
      });
      expect(result.marcaId).toBe(5);
    });
  });

  describe('carroCreateSchema', () => {
    const validCarro = {
      modeloId: 1,
      ano: 2023,
      combustivel: 'Gasolina',
      numPortas: 4,
      cor: 'Preto',
      valor: 50000,
    };

    it('deve validar um carro com dados válidos', () => {
      const result = carroCreateSchema.parse(validCarro);
      expect(result).toEqual(validCarro);
    });

    it('deve rejeitar carro sem modeloId', () => {
      const { modeloId, ...rest } = validCarro;
      expect(() => carroCreateSchema.parse(rest)).toThrow();
    });

    it('deve rejeitar modeloId negativo', () => {
      expect(() =>
        carroCreateSchema.parse({ ...validCarro, modeloId: -1 }),
      ).toThrow();
    });

    it('deve rejeitar ano não inteiro', () => {
      expect(() =>
        carroCreateSchema.parse({ ...validCarro, ano: 2023.5 }),
      ).toThrow();
    });

    it('deve rejeitar numPortas não positivo', () => {
      expect(() =>
        carroCreateSchema.parse({ ...validCarro, numPortas: 0 }),
      ).toThrow();
    });

    it('deve rejeitar valor negativo', () => {
      expect(() =>
        carroCreateSchema.parse({ ...validCarro, valor: -100 }),
      ).toThrow();
    });

    it('deve aceitar valor zero', () => {
      const result = carroCreateSchema.parse({ ...validCarro, valor: 0 });
      expect(result.valor).toBe(0);
    });

    it('deve converter strings para números', () => {
      const result = carroCreateSchema.parse({
        modeloId: '2',
        ano: '2023',
        combustivel: 'Diesel',
        numPortas: '2',
        cor: 'Branco',
        valor: '45000',
      });
      expect(result.modeloId).toBe(2);
      expect(result.ano).toBe(2023);
      expect(result.numPortas).toBe(2);
      expect(result.valor).toBe(45000);
    });
  });

  describe('carroUpdateSchema', () => {
    it('deve permitir atualizar apenas modeloId', () => {
      const result = carroUpdateSchema.parse({ modeloId: 2 });
      expect(result).toEqual({ modeloId: 2 });
    });

    it('deve permitir atualizar apenas ano', () => {
      const result = carroUpdateSchema.parse({ ano: 2024 });
      expect(result).toEqual({ ano: 2024 });
    });

    it('deve permitir objeto vazio (sem atualizações)', () => {
      const result = carroUpdateSchema.parse({});
      expect(result).toEqual({});
    });

    it('deve permitir atualizar múltiplos campos', () => {
      const result = carroUpdateSchema.parse({
        ano: 2024,
        cor: 'Vermelho',
        valor: 55000,
      });
      expect(result).toEqual({
        ano: 2024,
        cor: 'Vermelho',
        valor: 55000,
      });
    });
  });

  describe('idParamSchema', () => {
    it('deve validar um ID positivo', () => {
      expect(idParamSchema.parse(1)).toBe(1);
    });

    it('deve converter string para número', () => {
      expect(idParamSchema.parse('42')).toBe(42);
    });

    it('deve rejeitar ID zero', () => {
      expect(() => idParamSchema.parse(0)).toThrow();
    });

    it('deve rejeitar ID negativo', () => {
      expect(() => idParamSchema.parse(-5)).toThrow();
    });

    it('deve rejeitar ID não inteiro', () => {
      expect(() => idParamSchema.parse(3.14)).toThrow();
    });
  });
});
