# API de Carros — React + Next + Prisma + SQLLite + Tailwindcss

CRUD completo para **Marcas**, **Modelos** e **Carros**.
Teste para oportunidade como desenvolvedor na [WS Work](https://www.wswork.com.br/).

## Decisões Técnicas

* Mais documentação no TESTING.md e DataGrid.md.

* Não se usou o endpoint conforme descrição da tarefa, mas foi utilizado o seu retorno como padrão para construir os modelos e assim criar um CRUD completo para **Marcas**, **Modelos** e **Carros**, dando ênfase maior no código do que na apresentação visual.

* Ao clicar 1x na linha ela fica selecionada, quando mouse sobre fica em tom diferente e no double click entra em modo de edição.

* Foi usado [Zustand](https://zustand-demo.pmnd.rs/) para gerenciamento de estado global por ser mais clean (menos código) e mais recente.

* Para validação se usou o [React Hook For](https://react-hook-form.com/) e [Zod](https://zod.dev/).
 
* Documentação do DataGrid se encontra em DataGrid.md.

* Ao adicionar um item este já é selecionado / destacado no grid.

## GitHub https://github.com/fabiosilvaacs/cars-react

## Publicação https://cars-react-tau.vercel.app/
> [!NOTE]
> Erro de comunicação com o banco (**somente em produção**), que não consegui resolver a tempo da entrega. 

## Documentação - Swagger
Acesse a documentação interativa em: **http://localhost:3000/api-docs** ou **https://cars-react-tau.vercel.app/api-docs**

## Instalação
```bash
npm install
```

## Execução
```bash
npm run dev
```

## Testes - Jest - detalhes em TESTING.md
> [!NOTE]
> Tem alguns falhando ainda

## Prisma Studio (visualizar/editar dados)
```bash
npm run prisma:studio
```

## Prisma - Re-seeding dados (popular banco com dados base)
```bash
npm run prisma:seed
```
