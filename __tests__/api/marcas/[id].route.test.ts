import { GET, PUT, DELETE } from '@/app/api/marcas/[id]/route';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    marca: {
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
  return new Request('http://localhost/api/marcas/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('GET /api/marcas/[id]', () => {
  it('retorna a marca com status 200', async () => {
    const marca = { id: 1, nome: 'Toyota' };
    (mockPrisma.marca.findUnique as jest.Mock).mockResolvedValue(marca);

    const response = await GET(new Request('http://localhost'), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(marca);
  });

  it('retorna 404 quando marca não existe', async () => {
    (mockPrisma.marca.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await GET(new Request('http://localhost'), makeContext('99'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Marca não encontrada' });
  });

  it('retorna 400 para id inválido', async () => {
    const response = await GET(new Request('http://localhost'), makeContext('abc'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('retorna 500 em erro do banco', async () => {
    (mockPrisma.marca.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));

    const response = await GET(new Request('http://localhost'), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Erro interno' });
  });
});

describe('PUT /api/marcas/[id]', () => {
  it('atualiza a marca e retorna 200', async () => {
    const marcaAtualizada = { id: 1, nome: 'Toyota Novo' };
    (mockPrisma.marca.update as jest.Mock).mockResolvedValue(marcaAtualizada);

    const response = await PUT(makePutRequest({ nome: 'Toyota Novo' }), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(marcaAtualizada);
  });

  it('retorna 400 quando nome está ausente', async () => {
    const response = await PUT(makePutRequest({}), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Nome é obrigatório');
  });

  it('retorna 400 para id inválido', async () => {
    const response = await PUT(makePutRequest({ nome: 'X' }), makeContext('0'));
    const data = await response.json();

    expect(response.status).toBe(400);
  });

  it('retorna 404 quando marca não existe (P2025)', async () => {
    (mockPrisma.marca.update as jest.Mock).mockRejectedValue({ code: 'P2025' });

    const response = await PUT(makePutRequest({ nome: 'X' }), makeContext('99'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Marca não encontrada' });
  });

  it('retorna 409 quando nome já está em uso (P2002)', async () => {
    (mockPrisma.marca.update as jest.Mock).mockRejectedValue({ code: 'P2002' });

    const response = await PUT(makePutRequest({ nome: 'Honda' }), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toEqual({ error: 'Nome já em uso' });
  });

  it('retorna 500 em erro genérico', async () => {
    (mockPrisma.marca.update as jest.Mock).mockRejectedValue(new Error('DB error'));

    const response = await PUT(makePutRequest({ nome: 'X' }), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Erro interno' });
  });
});

describe('DELETE /api/marcas/[id]', () => {
  it('deleta a marca e retorna { success: true }', async () => {
    (mockPrisma.carro.count as jest.Mock).mockResolvedValue(0);
    (mockPrisma.marca.delete as jest.Mock).mockResolvedValue({ id: 1, nome: 'Toyota' });

    const response = await DELETE(new Request('http://localhost'), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });
  });

  it('retorna 409 quando marca possui carros vinculados', async () => {
    (mockPrisma.carro.count as jest.Mock).mockResolvedValue(3);

    const response = await DELETE(new Request('http://localhost'), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toEqual({ error: 'Marca possui carros vinculados' });
  });

  it('retorna 404 quando marca não existe (P2025)', async () => {
    (mockPrisma.carro.count as jest.Mock).mockResolvedValue(0);
    (mockPrisma.marca.delete as jest.Mock).mockRejectedValue({ code: 'P2025' });

    const response = await DELETE(new Request('http://localhost'), makeContext('99'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Marca não encontrada' });
  });

  it('retorna 400 para id inválido', async () => {
    const response = await DELETE(new Request('http://localhost'), makeContext('-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
  });

  it('retorna 500 em erro genérico', async () => {
    (mockPrisma.carro.count as jest.Mock).mockResolvedValue(0);
    (mockPrisma.marca.delete as jest.Mock).mockRejectedValue(new Error('DB error'));

    const response = await DELETE(new Request('http://localhost'), makeContext('1'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Erro interno' });
  });
});
