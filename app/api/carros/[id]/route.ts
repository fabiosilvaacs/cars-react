import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { parseBody, parseId } from '../../../../lib/validations/parse-request';
import { carroUpdateSchema } from '../../../../lib/validations/schemas';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const parsedId = parseId(params.id);
    if (!parsedId.success) return parsedId.response;

    const carro = await prisma.carro.findUnique({
      where: { id: parsedId.data },
      include: {
        modelo: { select: { nome: true } },
        marca: { select: { nome: true } },
      },
    });
    if (!carro) return NextResponse.json({ error: 'Carro não encontrado' }, { status: 404 });
    return NextResponse.json({ ...carro, modelo: carro.modelo.nome, marca: carro.marca.nome });
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
    const parsed = parseBody(carroUpdateSchema, body);
    if (!parsed.success) return parsed.response;

    const { modeloId, ano, combustivel, numPortas, cor, valor } = parsed.data;
    if (
      modeloId === undefined &&
      ano === undefined &&
      combustivel === undefined &&
      numPortas === undefined &&
      cor === undefined &&
      valor === undefined
    ) {
      return NextResponse.json({ error: 'Informe ao menos um campo para atualizar' }, { status: 400 });
    }

    if (modeloId !== undefined) {
      const modelo = await prisma.modelo.findUnique({ where: { id: modeloId } });
      if (!modelo) return NextResponse.json({ error: 'Modelo não encontrado' }, { status: 404 });
    }

    const carro = await prisma.carro.update({
      where: { id: parsedId.data },
      data: { modeloId, ano, combustivel, numPortas, cor, valor },
      include: {
        modelo: { select: { nome: true } },
        marca: { select: { nome: true } },
      },
    });
    return NextResponse.json({ ...carro, modelo: carro.modelo.nome, marca: carro.marca.nome });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2025') {
      return NextResponse.json({ error: 'Carro não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const parsedId = parseId(params.id);
    if (!parsedId.success) return parsedId.response;

    await prisma.carro.delete({ where: { id: parsedId.data } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2025') {
      return NextResponse.json({ error: 'Carro não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
