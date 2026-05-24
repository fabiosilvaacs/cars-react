'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FieldError from './FieldError';
import type { Carro, Marca, Modelo } from '../../lib/types';
import {
  carroCreateSchema,
  marcaBodySchema,
  modeloBodySchema,
  type CarroFormInput,
  type CarroFormValues,
  type NomeFormValues,
  type ModeloFormInput,
  type ModeloFormValues,
} from '../../lib/validations/schemas';

type View = 'carros' | 'marcas' | 'modelos';

type EntityFormProps = {
  view: View;
  editing: Carro | Marca | Modelo | null;
  marcas: Marca[];
  modelos: Modelo[];
  onSubmit: (data: CarroFormValues | NomeFormValues | ModeloFormValues) => void | Promise<void>;
};

function inputClass(hasError: boolean) {
  return `w-full rounded border px-3 py-2${hasError ? ' border-red-500' : ''}`;
}

function NomeForm({
  editing,
  onSubmit,
}: {
  editing: Marca | Modelo | null;
  onSubmit: (data: NomeFormValues) => void | Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NomeFormValues>({
    resolver: zodResolver(marcaBodySchema),
    defaultValues: { nome: editing?.nome ?? '' },
  });

  useEffect(() => {
    reset({ nome: editing?.nome ?? '' });
  }, [editing, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-slate-700">
          Nome
        </label>
        <input
          id="nome"
          className={inputClass(Boolean(errors.nome))}
          {...register('nome')}
        />
        <FieldError message={errors.nome?.message} />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded bg-sky-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {editing ? 'Salvar' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
}

function ModeloForm({
  editing,
  marcas,
  onSubmit,
}: {
  editing: Modelo | null;
  marcas: Marca[];
  onSubmit: (data: ModeloFormValues) => void | Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ModeloFormInput, unknown, ModeloFormValues>({
    resolver: zodResolver(modeloBodySchema),
    defaultValues: { nome: editing?.nome ?? '', marcaId: editing?.marcaId ?? '' },
  });

  const marcaId = watch('marcaId');

  useEffect(() => {
    reset({ nome: editing?.nome ?? '', marcaId: editing?.marcaId ?? '' });
  }, [editing, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="modelo-nome" className="block text-sm font-medium text-slate-700">
          Nome
        </label>
        <input
          id="modelo-nome"
          className={inputClass(Boolean(errors.nome))}
          {...register('nome')}
        />
        <FieldError message={errors.nome?.message} />
      </div>
      <div>
        <label htmlFor="modelo-marca" className="block text-sm font-medium text-slate-700">
          Marca
        </label>
        <select id="modelo-marca" className={inputClass(Boolean(errors.marcaId))} {...register('marcaId')}>
          <option value="">Selecione</option>
          {marcas.map((marca) => (
            <option key={marca.id} value={marca.id}>
              {marca.nome}
            </option>
          ))}
        </select>
        <FieldError message={errors.marcaId?.message} />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded bg-sky-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {editing ? 'Salvar' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
}

function CarroForm({
  editing,
  marcas,
  modelos,
  onSubmit,
}: {
  editing: Carro | null;
  marcas: Marca[];
  modelos: Modelo[];
  onSubmit: (data: CarroFormValues) => void | Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CarroFormInput, unknown, CarroFormValues>({
    resolver: zodResolver(carroCreateSchema),
    defaultValues: {
      modeloId: editing?.modeloId ?? '',
      ano: editing?.ano ?? '',
      combustivel: editing?.combustivel ?? '',
      numPortas: editing?.numPortas ?? '',
      cor: editing?.cor ?? '',
      valor: editing?.valor ?? '',
    },
  });

  const modeloId = watch('modeloId');
  const selectedModelo = modelos.find((m) => m.id === Number(modeloId));
  const selectedMarca = selectedModelo ? marcas.find((m) => m.id === selectedModelo.marcaId) : null;

  useEffect(() => {
    reset({
      modeloId: editing?.modeloId ?? '',
      ano: editing?.ano ?? '',
      combustivel: editing?.combustivel ?? '',
      numPortas: editing?.numPortas ?? '',
      cor: editing?.cor ?? '',
      valor: editing?.valor ?? '',
    });
  }, [editing, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {editing && (
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-slate-700">
            ID
          </label>
          <input
            id="id"
            type="number"
            value={editing.id}
            disabled
            className="w-full rounded border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600 cursor-not-allowed"
          />
        </div>
      )}
      <div>
        <label htmlFor="modeloId" className="block text-sm font-medium text-slate-700">
          Modelo
        </label>
        <select id="modeloId" className={inputClass(Boolean(errors.modeloId))} {...register('modeloId')}>
          <option value="">Selecione</option>
          {modelos.map((modelo) => (
            <option key={modelo.id} value={modelo.id}>
              {modelo.nome}
            </option>
          ))}
        </select>
        <FieldError message={errors.modeloId?.message} />
      </div>
      <div>
        <label htmlFor="ano" className="block text-sm font-medium text-slate-700">
          Ano
        </label>
        <input
          id="ano"
          type="number"
          className={inputClass(Boolean(errors.ano))}
          {...register('ano')}
        />
        <FieldError message={errors.ano?.message} />
      </div>
      <div>
        <label htmlFor="marca" className="block text-sm font-medium text-slate-700">
          Marca
        </label>
        <input
          id="marca"
          type="text"
          value={selectedMarca?.nome ?? ''}
          disabled
          className="w-full rounded border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600 cursor-not-allowed"
        />
      </div>
      <div>
        <label htmlFor="combustivel" className="block text-sm font-medium text-slate-700">
          Combustível
        </label>
        <input
          id="combustivel"
          type="text"
          placeholder="Ex: Gasolina, Óleo Diesel"
          className={inputClass(Boolean(errors.combustivel))}
          {...register('combustivel')}
        />
        <FieldError message={errors.combustivel?.message} />
      </div>
      <div>
        <label htmlFor="numPortas" className="block text-sm font-medium text-slate-700">
          Número de Portas
        </label>
        <input
          id="numPortas"
          type="number"
          className={inputClass(Boolean(errors.numPortas))}
          {...register('numPortas')}
        />
        <FieldError message={errors.numPortas?.message} />
      </div>
      <div>
        <label htmlFor="cor" className="block text-sm font-medium text-slate-700">
          Cor
        </label>
        <input
          id="cor"
          type="text"
          className={inputClass(Boolean(errors.cor))}
          {...register('cor')}
        />
        <FieldError message={errors.cor?.message} />
      </div>
      <div>
        <label htmlFor="valor" className="block text-sm font-medium text-slate-700">
          Valor (R$)
        </label>
        <input
          id="valor"
          type="number"
          step="0.01"
          className={inputClass(Boolean(errors.valor))}
          {...register('valor')}
        />
        <FieldError message={errors.valor?.message} />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded bg-sky-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {editing ? 'Salvar' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
}

export default function EntityForm({ view, editing, onSubmit, marcas, modelos }: EntityFormProps) {
  if (view === 'carros') {
    return (
      <CarroForm
        editing={editing as Carro | null}
        marcas={marcas}
        modelos={modelos}
        onSubmit={onSubmit as (data: CarroFormValues) => void | Promise<void>}
      />
    );
  }

  if (view === 'modelos') {
    return (
      <ModeloForm
        editing={editing as Modelo | null}
        marcas={marcas}
        onSubmit={onSubmit as (data: ModeloFormValues) => void | Promise<void>}
      />
    );
  }

  return (
    <NomeForm
      editing={editing as Marca | Modelo | null}
      onSubmit={onSubmit as (data: NomeFormValues) => void | Promise<void>}
    />
  );
}
