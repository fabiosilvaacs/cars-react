import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { parseBody } from '../../../lib/validations/parse-request';
import { modeloBodySchema } from '../../../lib/validations/schemas';

interface ModeloComMarca {
  id: number;
  nome: string;
  marcaId: number;
  createdAt: Date;
  marca: { id: number; nome: string; createdAt: Date };
}

export async function GET() {
  try {
    const modelos = await prisma.modelo.findMany({
      include: { marca: true },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(
      (modelos as ModeloComMarca[]).map((m) => ({ ...m, marca: m.marca.nome })),
    );
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseBody(modeloBodySchema, body);
    if (!parsed.success) return parsed.response;

    const modelo = await prisma.modelo.create({
      data: { nome: parsed.data.nome, marcaId: parsed.data.marcaId },
      include: { marca: true },
    });
    return NextResponse.json(
      { ...(modelo as ModeloComMarca), marca: (modelo as ModeloComMarca).marca.nome },
      { status: 201 },
    );
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2002') {
      return NextResponse.json({ error: 'Modelo já existe' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
