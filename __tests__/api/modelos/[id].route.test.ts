import { GET, PUT, DELETE } from '@/app/api/modelos/[id]/route';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    modelo: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    carro: {
      count: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

function makeContext(id: string) {
  return { params: Promise.resolve({ id }) };
}

function makePutRequest(body: unknown): Request {
  return new Request('http://localhost/api/modelos/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const modeloComMarca = { id: 1, nome: 'Corolla', marcaId: 1, marca: { nome: 'Toyota' } };
const modeloFlat = { id: 1, nome: 'Corolla', marcaId: 1, marca: 'Toyota' };

describe('GET /api/modelos/[id]', () => {
  it('retorna o modelo com marca como string', async () => {
    (mockPrisma.modelo.findUnique as jest.Mock).mockResolvedValue(modeloComMarca);

    const response = await GET(new Request('http://localhost'), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(modeloFlat);
  });

  it('retorna 404 quando modelo não existe', async () => {
    (mockPrisma.modelo.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await GET(new Request('http://localhost'), makeContext('99'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Modelo não encontrado' });
  });

  it('retorna 400 para id inválido', async () => {
    const response = await GET(new Request('http://localhost'), makeContext('abc'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('retorna 500 em erro do banco', async () => {
    (mockPrisma.modelo.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));

    const response = await GET(new Request('http://localhost'), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Erro interno' });
  });
});

describe('PUT /api/modelos/[id]', () => {
  it('atualiza o modelo e retorna 200', async () => {
    (mockPrisma.modelo.update as jest.Mock).mockResolvedValue(modeloComMarca);

    const response = await PUT(makePutRequest({ nome: 'Corolla', marcaId: 1 }), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(modeloFlat);
  });

  it('retorna 400 quando nome está ausente', async () => {
    const response = await PUT(makePutRequest({ marcaId: 1 }), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Nome é obrigatório');
  });

  it('retorna 400 para id inválido', async () => {
    const response = await PUT(makePutRequest({ nome: 'X', marcaId: 1 }), makeContext('0'));
    const data = await response.json();

    expect(response.status).toBe(400);
  });

  it('retorna 404 quando modelo não existe (P2025)', async () => {
    (mockPrisma.modelo.update as jest.Mock).mockRejectedValue({ code: 'P2025' });

    const response = await PUT(makePutRequest({ nome: 'X', marcaId: 1 }), makeContext('99'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Modelo não encontrado' });
  });

  it('retorna 409 quando nome já está em uso (P2002)', async () => {
    (mockPrisma.modelo.update as jest.Mock).mockRejectedValue({ code: 'P2002' });

    const response = await PUT(makePutRequest({ nome: 'Civic', marcaId: 1 }), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toEqual({ error: 'Nome já em uso' });
  });

  it('retorna 500 em erro genérico', async () => {
    (mockPrisma.modelo.update as jest.Mock).mockRejectedValue(new Error('DB error'));

    const response = await PUT(makePutRequest({ nome: 'X', marcaId: 1 }), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Erro interno' });
  });
});

describe('DELETE /api/modelos/[id]', () => {
  it('deleta o modelo e retorna { success: true }', async () => {
    (mockPrisma.carro.count as jest.Mock).mockResolvedValue(0);
    (mockPrisma.modelo.delete as jest.Mock).mockResolvedValue(modeloComMarca);

    const response = await DELETE(new Request('http://localhost'), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });
  });

  it('retorna 409 quando modelo possui carros vinculados', async () => {
    (mockPrisma.carro.count as jest.Mock).mockResolvedValue(2);

    const response = await DELETE(new Request('http://localhost'), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toEqual({ error: 'Modelo possui carros vinculados' });
  });

  it('retorna 404 quando modelo não existe (P2025)', async () => {
    (mockPrisma.carro.count as jest.Mock).mockResolvedValue(0);
    (mockPrisma.modelo.delete as jest.Mock).mockRejectedValue({ code: 'P2025' });

    const response = await DELETE(new Request('http://localhost'), makeContext('99'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Modelo não encontrado' });
  });

  it('retorna 400 para id inválido', async () => {
    const response = await DELETE(new Request('http://localhost'), makeContext('-5'));
    const data = await response.json();

    expect(response.status).toBe(400);
  });

  it('retorna 500 em erro genérico', async () => {
    (mockPrisma.carro.count as jest.Mock).mockResolvedValue(0);
    (mockPrisma.modelo.delete as jest.Mock).mockRejectedValue(new Error('DB error'));

    const response = await DELETE(new Request('http://localhost'), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Erro interno' });
  });
});
