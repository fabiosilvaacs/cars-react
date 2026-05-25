import { NextResponse } from 'next/server';
import { createSwaggerSpec } from 'next-swagger-doc';

export async function GET() {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Cars API',
        version: '1.0.0',
        description: 'API para gerenciamento de marcas, modelos e carros',
      },
      tags: [
        { name: 'Marcas', description: 'Operações de marcas' },
        { name: 'Modelos', description: 'Operações de modelos' },
        { name: 'Carros', description: 'Operações de carros' },
      ],
    },
    // also scan our centralized doc file
    extraFilesToScan: ['/lib/swagger-docs'],
  });

  return NextResponse.json(spec);
}
