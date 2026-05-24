import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpar dados existentes
  await prisma.carro.deleteMany();
  await prisma.modelo.deleteMany();
  await prisma.marca.deleteMany();

  // Criar Marcas
  const fiat = await prisma.marca.create({
    data: { nome: 'Fiat' },
  });

  const volkswagen = await prisma.marca.create({
    data: { nome: 'Volkswagen' },
  });

  const toyota = await prisma.marca.create({
    data: { nome: 'Toyota' },
  });

  const hyundai = await prisma.marca.create({
    data: { nome: 'Hyundai' },
  });

  const chevrolet = await prisma.marca.create({
    data: { nome: 'Chevrolet' },
  });

  // Criar Modelos
  const gol = await prisma.modelo.create({
    data: { nome: 'Gol', marcaId: volkswagen.id },
  });

  const corsa = await prisma.modelo.create({
    data: { nome: 'Corsa', marcaId: chevrolet.id },
  });

  const fiesta = await prisma.modelo.create({
    data: { nome: 'Fiesta', marcaId: fiat.id },
  });

  const uno = await prisma.modelo.create({
    data: { nome: 'Uno', marcaId: fiat.id },
  });

  const hb20 = await prisma.modelo.create({
    data: { nome: 'HB20', marcaId: hyundai.id },
  });

  // Criar Carros
  await prisma.carro.createMany({
    data: [
      {
        modeloId: gol.id,
        ano: 2023,
        marcaId: volkswagen.id,
        combustivel: 'Gasolina',
        numPortas: 4,
        cor: 'Branco',
        valor: 85000,
      },
      {
        modeloId: gol.id,
        ano: 2022,
        marcaId: volkswagen.id,
        combustivel: 'Flex (Etanol)',
        numPortas: 4,
        cor: 'Preto',
        valor: 78000,
      },
      {
        modeloId: corsa.id,
        ano: 2023,
        marcaId: chevrolet.id,
        combustivel: 'Gasolina',
        numPortas: 4,
        cor: 'Cinza',
        valor: 82000,
      },
      {
        modeloId: corsa.id,
        ano: 2021,
        marcaId: chevrolet.id,
        combustivel: 'Flex (Etanol)',
        numPortas: 4,
        cor: 'Vermelho',
        valor: 72000,
      },
      {
        modeloId: fiesta.id,
        ano: 2022,
        marcaId: fiat.id,
        combustivel: 'Gasolina',
        numPortas: 4,
        cor: 'Azul',
        valor: 75000,
      },
      {
        modeloId: uno.id,
        ano: 2023,
        marcaId: fiat.id,
        combustivel: 'Flex (Etanol)',
        numPortas: 2,
        cor: 'Amarelo',
        valor: 68000,
      },
      {
        modeloId: hb20.id,
        ano: 2023,
        marcaId: hyundai.id,
        combustivel: 'Gasolina',
        numPortas: 4,
        cor: 'Branco',
        valor: 88000,
      },
      {
        modeloId: hb20.id,
        ano: 2022,
        marcaId: hyundai.id,
        combustivel: 'Flex (Etanol)',
        numPortas: 4,
        cor: 'Prata',
        valor: 82000,
      },
      {
        modeloId: gol.id,
        ano: 2024,
        marcaId: volkswagen.id,
        combustivel: 'Gasolina',
        numPortas: 4,
        cor: 'Prata',
        valor: 92000,
      },
      {
        modeloId: corsa.id,
        ano: 2023,
        marcaId: chevrolet.id,
        combustivel: 'Flex (Etanol)',
        numPortas: 4,
        cor: 'Verde',
        valor: 81000,
      },
    ],
  });

  console.log('Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
