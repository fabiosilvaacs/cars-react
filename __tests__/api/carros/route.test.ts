import { GET, POST } from '@/app/api/carros/route';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    carro: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    modelo: {
      findUnique: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/carros', {
    method: 'POST',
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

const carroFlat = {
  ...carroComRelacoes,
  modelo: 'Corolla',
  marca: 'Toyota',
};

const carroBody = {
  modeloId: 1,
  ano: 2023,
  combustivel: 'Gasolina',
  numPortas: 4,
  cor: 'Prata',
  valor: 80000,
};

describe('GET /api/carros', () => {
  it('retorna lista de carros com modelo e marca como string', async () => {
    (mockPrisma.carro.findMany as jest.Mock).mockResolvedValue([carroComRelacoes]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data[0].modelo).toBe('Corolla');
    expect(data[0].marca).toBe('Toyota');
  });

  it('retorna lista vazia quando não há carros', async () => {
    (mockPrisma.carro.findMany as jest.Mock).mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('retorna 500 em erro do banco', async () => {
    (mockPrisma.carro.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Erro interno' });
  });
});

describe('POST /api/carros', () => {
  beforeEach(() => {
    (mockPrisma.modelo.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      nome: 'Corolla',
      marcaId: 1,
      marca: { nome: 'Toyota' },
    });
    (mockPrisma.carro.create as jest.Mock).mockResolvedValue(carroComRelacoes);
  });

  it('cria um carro e retorna 201', async () => {
    const response = await POST(makeRequest(carroBody));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.modelo).toBe('Corolla');
    expect(data.marca).toBe('Toyota');
  });

  it('retorna 404 quando modelo não existe', async () => {
    (mockPrisma.modelo.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await POST(makeRequest(carroBody));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Modelo não encontrado' });
  });

  it('retorna 400 quando modeloId está ausente', async () => {
    const { modeloId: _, ...semModelo } = carroBody;
    const response = await POST(makeRequest(semModelo));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('retorna 400 quando ano está ausente', async () => {
    const { ano: _, ...semAno } = carroBody;
    const response = await POST(makeRequest(semAno));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('retorna 400 quando numPortas é zero', async () => {
    const response = await POST(makeRequest({ ...carroBody, numPortas: 0 }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('retorna 400 quando valor é negativo', async () => {
    const response = await POST(makeRequest({ ...carroBody, valor: -100 }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('retorna 400 quando combustivel está vazio', async () => {
    const response = await POST(makeRequest({ ...carroBody, combustivel: '' }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Combustível é obrigatório');
  });

  it('retorna 400 quando cor está vazia', async () => {
    const response = await POST(makeRequest({ ...carroBody, cor: '   ' }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Cor é obrigatória');
  });

  it('retorna 500 em erro genérico do banco', async () => {
    (mockPrisma.carro.create as jest.Mock).mockRejectedValue(new Error('DB error'));

    const response = await POST(makeRequest(carroBody));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Erro interno' });
  });
});
