import { z } from 'zod';

const currentYear = new Date().getFullYear();
const maxYear = currentYear + 1;

export const nomeSchema = z.string().trim().min(1, 'Nome é obrigatório');

export const marcaBodySchema = z.object({ nome: nomeSchema });
export const modeloBodySchema = z.object({
  nome: nomeSchema,
  marcaId: z.coerce
    .number({ error: 'Selecione uma marca' })
    .int('Marca inválida')
    .positive('Selecione uma marca'),
});

export const carroCreateSchema = z.object({
  modeloId: z.coerce
    .number({ error: 'Selecione um modelo' })
    .int('Modelo inválido')
    .positive('Selecione um modelo'),
  ano: z.coerce
    .number({ error: 'Ano é obrigatório' })
    .int('Ano deve ser um número inteiro')
    .min(1900, 'Ano deve ser a partir de 1900')
    .max(maxYear, `Ano não pode ser maior que ${maxYear}`),
  combustivel: z.string().trim().min(1, 'Combustível é obrigatório'),
  numPortas: z.coerce
    .number({ error: 'Número de portas é obrigatório' })
    .int('Número de portas deve ser inteiro')
    .positive('Número de portas deve ser maior que zero'),
  cor: z.string().trim().min(1, 'Cor é obrigatória'),
  valor: z.coerce
    .number({ error: 'Valor é obrigatório' })
    .min(0, 'Valor deve ser zero ou positivo'),
});

export const carroUpdateSchema = carroCreateSchema.partial();

export const idParamSchema = z.coerce
  .number({ error: 'ID inválido' })
  .int('ID inválido')
  .positive('ID inválido');

export type NomeFormValues = z.infer<typeof marcaBodySchema>;
export type ModeloFormInput = z.input<typeof modeloBodySchema>;
export type ModeloFormValues = z.infer<typeof modeloBodySchema>;
export type CarroFormInput = z.input<typeof carroCreateSchema>;
export type CarroFormValues = z.infer<typeof carroCreateSchema>;
export type CarroUpdateValues = z.infer<typeof carroUpdateSchema>;
