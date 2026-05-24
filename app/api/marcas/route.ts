import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { parseBody } from '../../../lib/validations/parse-request';
import { marcaBodySchema } from '../../../lib/validations/schemas';

export async function GET() {
  try {
    const marcas = await prisma.marca.findMany({ orderBy: { id: 'asc' } });
    return NextResponse.json(marcas);
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseBody(marcaBodySchema, body);
    if (!parsed.success) return parsed.response;

    const marca = await prisma.marca.create({ data: { nome: parsed.data.nome } });
    return NextResponse.json(marca, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2002') {
      return NextResponse.json({ error: 'Marca já existe' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
