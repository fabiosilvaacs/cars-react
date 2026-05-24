import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { parseBody, parseId } from '../../../../lib/validations/parse-request';
import { marcaBodySchema } from '../../../../lib/validations/schemas';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const parsedId = parseId(params.id);
    if (!parsedId.success) return parsedId.response;

    const marca = await prisma.marca.findUnique({ where: { id: parsedId.data } });
    if (!marca) return NextResponse.json({ error: 'Marca não encontrada' }, { status: 404 });
    return NextResponse.json(marca);
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const parsedId = parseId(params.id);
    if (!parsedId.success) return parsedId.response;

    const body = await request.json();
    const parsed = parseBody(marcaBodySchema, body);
    if (!parsed.success) return parsed.response;

    const marca = await prisma.marca.update({
      where: { id: parsedId.data },
      data: { nome: parsed.data.nome },
    });
    return NextResponse.json(marca);
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2025') {
      return NextResponse.json({ error: 'Marca não encontrada' }, { status: 404 });
    }
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2002') {
      return NextResponse.json({ error: 'Nome já em uso' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const parsedId = parseId(params.id);
    if (!parsedId.success) return parsedId.response;

    const vinculos = await prisma.carro.count({ where: { marcaId: parsedId.data } });
    if (vinculos > 0) {
      return NextResponse.json({ error: 'Marca possui carros vinculados' }, { status: 409 });
    }
    await prisma.marca.delete({ where: { id: parsedId.data } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2025') {
      return NextResponse.json({ error: 'Marca não encontrada' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
