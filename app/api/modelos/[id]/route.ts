import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { parseBody, parseId } from '../../../../lib/validations/parse-request';
import { modeloBodySchema } from '../../../../lib/validations/schemas';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const parsedId = parseId(params.id);
    if (!parsedId.success) return parsedId.response;

    const modelo = await prisma.modelo.findUnique({
      where: { id: parsedId.data },
      include: { marca: true },
    });
    if (!modelo) return NextResponse.json({ error: 'Modelo não encontrado' }, { status: 404 });
    return NextResponse.json({ ...modelo, marca: modelo.marca.nome });
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
    const parsed = parseBody(modeloBodySchema, body);
    if (!parsed.success) return parsed.response;

    const modelo = await prisma.modelo.update({
      where: { id: parsedId.data },
      data: { nome: parsed.data.nome, marcaId: parsed.data.marcaId },
      include: { marca: true },
    });
    return NextResponse.json({ ...modelo, marca: modelo.marca.nome });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2025') {
      return NextResponse.json({ error: 'Modelo não encontrado' }, { status: 404 });
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

    const vinculos = await prisma.carro.count({ where: { modeloId: parsedId.data } });
    if (vinculos > 0) {
      return NextResponse.json({ error: 'Modelo possui carros vinculados' }, { status: 409 });
    }
    await prisma.modelo.delete({ where: { id: parsedId.data } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2025') {
      return NextResponse.json({ error: 'Modelo não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
