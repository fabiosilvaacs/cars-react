import { GET, POST } from '@/app/api/marcas/route';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    marca: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

function makeRequest(body?: unknown): Request {
  return new Request('http://localhost/api/marcas', {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe('GET /api/marcas', () => {
  it('retorna lista de marcas com status 200', async () => {
    const marcas = [
      { id: 1, nome: 'Toyota' },
      { id: 2, nome: 'Honda' },
    ];
    (mockPrisma.marca.findMany as jest.Mock).mockResolvedValue(marcas);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(marcas);
  });

  it('retorna 500 quando o banco falha', async () => {
    (mockPrisma.marca.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Erro interno' });
  });
});

describe('POST /api/marcas', () => {
  it('cria uma marca e retorna 201', async () => {
    const novaMarca = { id: 3, nome: 'Fiat' };
    (mockPrisma.marca.create as jest.Mock).mockResolvedValue(novaMarca);

    const response = await POST(makeRequest({ nome: 'Fiat' }));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual(novaMarca);
  });

  it('retorna 400 quando nome está ausente', async () => {
    const response = await POST(makeRequest({}));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Nome é obrigatório');
  });

  it('retorna 400 quando nome é string vazia', async () => {
    const response = await POST(makeRequest({ nome: '   ' }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Nome é obrigatório');
  });

  it('retorna 409 quando marca já existe (P2002)', async () => {
    (mockPrisma.marca.create as jest.Mock).mockRejectedValue({ code: 'P2002' });

    const response = await POST(makeRequest({ nome: 'Toyota' }));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toEqual({ error: 'Marca já existe' });
  });

  it('retorna 500 em erro genérico do banco', async () => {
    (mockPrisma.marca.create as jest.Mock).mockRejectedValue(new Error('DB error'));

    const response = await POST(makeRequest({ nome: 'Toyota' }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Erro interno' });
  });
});
