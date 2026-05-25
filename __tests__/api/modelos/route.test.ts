import { GET, POST } from '@/app/api/modelos/route';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    modelo: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/modelos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const modeloComMarca = { id: 1, nome: 'Corolla', marcaId: 1, marca: { nome: 'Toyota' } };
const modeloFlat = { id: 1, nome: 'Corolla', marcaId: 1, marca: 'Toyota' };

describe('GET /api/modelos', () => {
  it('retorna lista de modelos com marca como string', async () => {
    (mockPrisma.modelo.findMany as jest.Mock).mockResolvedValue([modeloComMarca]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([modeloFlat]);
  });

  it('retorna lista vazia quando não há modelos', async () => {
    (mockPrisma.modelo.findMany as jest.Mock).mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('retorna 500 em erro do banco', async () => {
    (mockPrisma.modelo.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Erro interno' });
  });
});

describe('POST /api/modelos', () => {
  it('cria um modelo e retorna 201', async () => {
    (mockPrisma.modelo.create as jest.Mock).mockResolvedValue(modeloComMarca);

    const response = await POST(makeRequest({ nome: 'Corolla', marcaId: 1 }));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual(modeloFlat);
  });

  it('retorna 400 quando nome está ausente', async () => {
    const response = await POST(makeRequest({ marcaId: 1 }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Nome é obrigatório');
  });

  it('retorna 400 quando marcaId está ausente', async () => {
    const response = await POST(makeRequest({ nome: 'Corolla' }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('retorna 400 quando marcaId é zero', async () => {
    const response = await POST(makeRequest({ nome: 'Corolla', marcaId: 0 }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('retorna 409 quando modelo já existe (P2002)', async () => {
    (mockPrisma.modelo.create as jest.Mock).mockRejectedValue({ code: 'P2002' });

    const response = await POST(makeRequest({ nome: 'Corolla', marcaId: 1 }));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toEqual({ error: 'Modelo já existe' });
  });

  it('retorna 500 em erro genérico', async () => {
    (mockPrisma.modelo.create as jest.Mock).mockRejectedValue(new Error('DB error'));

    const response = await POST(makeRequest({ nome: 'Corolla', marcaId: 1 }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Erro interno' });
  });
});
