import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { parseBody } from '../../../lib/validations/parse-request';
import { carroCreateSchema } from '../../../lib/validations/schemas';

export async function GET() {
  try {
    const carros = await prisma.carro.findMany({
      orderBy: { id: 'asc' },
      include: {
        modelo: { select: { nome: true } },
        marca: { select: { nome: true } },
      },
    });
    return NextResponse.json(
      carros.map((carro) => ({ ...carro, modelo: carro.modelo.nome, marca: carro.marca.nome })),
    );
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseBody(carroCreateSchema, body);
    if (!parsed.success) return parsed.response;

    const { modeloId, ano, combustivel, numPortas, cor, valor } = parsed.data;

    const modelo = await prisma.modelo.findUnique({
      where: { id: modeloId },
      include: { marca: true },
    });
    if (!modelo) return NextResponse.json({ error: 'Modelo não encontrado' }, { status: 404 });

    const carro = await prisma.carro.create({
      data: {
        modeloId,
        ano,
        marcaId: modelo.marcaId,
        combustivel,
        numPortas,
        cor,
        valor,
      },
      include: {
        modelo: { select: { nome: true } },
        marca: { select: { nome: true } },
      },
    });
    return NextResponse.json({ ...carro, modelo: carro.modelo.nome, marca: carro.marca.nome }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
