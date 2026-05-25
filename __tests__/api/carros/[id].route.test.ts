import { GET, PUT, DELETE } from '@/app/api/carros/[id]/route';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    carro: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    modelo: {
      findUnique: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

function makeContext(id: string) {
  return { params: Promise.resolve({ id }) };
}

function makePutRequest(body: unknown): Request {
  return new Request('http://localhost/api/carros/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const carroComRelacoes = {
  id: 1,
  modeloId: 1,
  marcaId: 1,
  ano: 2023,
  combustivel: 'Gasolina',
  numPortas: 4,
  cor: 'Prata',
  valor: 80000,
  createdAt: new Date().toISOString(),
  modelo: { nome: 'Corolla' },
  marca: { nome: 'Toyota' },
};

describe('GET /api/carros/[id]', () => {
  it('retorna o carro com modelo e marca como string', async () => {
    (mockPrisma.carro.findUnique as jest.Mock).mockResolvedValue(carroComRelacoes);

    const response = await GET(new Request('http://localhost'), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.modelo).toBe('Corolla');
    expect(data.marca).toBe('Toyota');
    expect(data.id).toBe(1);
  });

  it('retorna 404 quando carro não existe', async () => {
    (mockPrisma.carro.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await GET(new Request('http://localhost'), makeContext('99'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Carro não encontrado' });
  });

  it('retorna 400 para id inválido (string)', async () => {
    const response = await GET(new Request('http://localhost'), makeContext('abc'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('retorna 400 para id zero', async () => {
    const response = await GET(new Request('http://localhost'), makeContext('0'));
    const data = await response.json();

    expect(response.status).toBe(400);
  });

  it('retorna 500 em erro do banco', async () => {
    (mockPrisma.carro.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));

    const response = await GET(new Request('http://localhost'), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Erro interno' });
  });
});

describe('PUT /api/carros/[id]', () => {
  beforeEach(() => {
    (mockPrisma.modelo.findUnique as jest.Mock).mockResolvedValue({ id: 1, nome: 'Corolla', marcaId: 1 });
    (mockPrisma.carro.update as jest.Mock).mockResolvedValue(carroComRelacoes);
  });

  it('atualiza o carro com campo único e retorna 200', async () => {
    const response = await PUT(makePutRequest({ cor: 'Vermelho' }), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.modelo).toBe('Corolla');
  });

  it('atualiza múltiplos campos e retorna 200', async () => {
    const response = await PUT(makePutRequest({ cor: 'Azul', ano: 2024, valor: 90000 }), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(200);
  });

  it('retorna 400 quando nenhum campo é enviado', async () => {
    const response = await PUT(makePutRequest({}), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'Informe ao menos um campo para atualizar' });
  });

  it('retorna 404 quando modeloId não existe', async () => {
    (mockPrisma.modelo.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await PUT(makePutRequest({ modeloId: 999 }), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Modelo não encontrado' });
  });

  it('retorna 404 quando carro não existe (P2025)', async () => {
    (mockPrisma.carro.update as jest.Mock).mockRejectedValue({ code: 'P2025' });

    const response = await PUT(makePutRequest({ cor: 'Vermelho' }), makeContext('99'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Carro não encontrado' });
  });

  it('retorna 400 para id inválido', async () => {
    const response = await PUT(makePutRequest({ cor: 'Azul' }), makeContext('abc'));
    const data = await response.json();

    expect(response.status).toBe(400);
  });

  it('retorna 500 em erro genérico', async () => {
    (mockPrisma.carro.update as jest.Mock).mockRejectedValue(new Error('DB error'));

    const response = await PUT(makePutRequest({ cor: 'Verde' }), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Erro interno' });
  });
});

describe('DELETE /api/carros/[id]', () => {
  it('deleta o carro e retorna { success: true }', async () => {
    (mockPrisma.carro.delete as jest.Mock).mockResolvedValue(carroComRelacoes);

    const response = await DELETE(new Request('http://localhost'), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });
  });

  it('retorna 404 quando carro não existe (P2025)', async () => {
    (mockPrisma.carro.delete as jest.Mock).mockRejectedValue({ code: 'P2025' });

    const response = await DELETE(new Request('http://localhost'), makeContext('99'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Carro não encontrado' });
  });

  it('retorna 400 para id inválido', async () => {
    const response = await DELETE(new Request('http://localhost'), makeContext('0'));
    const data = await response.json();

    expect(response.status).toBe(400);
  });

  it('retorna 500 em erro genérico', async () => {
    (mockPrisma.carro.delete as jest.Mock).mockRejectedValue(new Error('DB error'));

    const response = await DELETE(new Request('http://localhost'), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Erro interno' });
  });
});
