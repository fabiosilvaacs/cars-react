# API de Carros — React + Next + Prisma + SQLLite + Tailwindcss

CRUD completo para **Marcas**, **Modelos** e **Carros**.

## Decisões Técnicas

* Não se usou o endpoint, mas foi utilizado o seu retorno como padrão para construir os modelos e assim criar um CRUD completo para **Marcas**, **Modelos** e **Carros**, dando ênfase maior no código do que na apresentação visual.

* Ao clicar 1x na linha ela fica seleciona, quando mouse sobre fica em tom diferente e no double click entra em modo de edição.

* Foi usado [Zustand](https://zustand-demo.pmnd.rs/) para gerenciamento de estado global por ser mais clean (menos código) e mais recente.

* Para validação se usou o [React Hook For](https://react-hook-form.com/) e [Zod](https://zod.dev/).
 
* Para facilitar deixei o arquivo Insomnia_v5.yaml para ser importado e fazer os testes dos endpoints.

* Documentação do DataGrid se encontra em DataGrid.md.

* Ao adicionar um item já é selecionado no grid.

## GitHub https://github.com/fabiosilvaacs/cars_fastapi

## Publicação https://cars-fastapi.onrender.com/

## Documentação
Acesse a documentação interativa em: **http://localhost:8000/docs** ou **https://cars-fastapi.onrender.com/docs**

## Instalação
```bash
npm install
```

## Execução
```bash
npm run dev
```

## Testes
```bash
python -m pytest tests/ -v
```

## Prisma Studio (visualizar/editar dados)
```bash
npm run prisma:studio
```

## Prisma - Re-seeding dados (popular banco com dados base)
```bash
npm run prisma:seed
```
