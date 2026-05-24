'use client';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DataGrid, { type SortConfig } from './components/DataGrid';
import Modal from './components/Modal';
import EntityForm from './components/EntityForm';
import { fetchCatalog } from '../lib/fetch-catalog';
import { formatDateBR } from '../lib/formatters';
import { useCarroStore } from '../lib/stores/carro-store';
import { useMarcaStore } from '../lib/stores/marca-store';
import { useModeloStore } from '../lib/stores/modelo-store';
import type { Carro, Marca, Modelo } from '../lib/types';
import type { CarroFormValues, NomeFormValues, ModeloFormValues } from '../lib/validations/schemas';

export default function Home(){
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState<'carros'|'marcas'|'modelos'>('carros');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Carro | Marca | Modelo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Carro | Marca | Modelo | null>(null);
  const [deleteType, setDeleteType] = useState<'carro'|'marca'|'modelo' | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const carros = useCarroStore((state) => state.carros);
  const marcas = useMarcaStore((state) => state.marcas);
  const modelos = useModeloStore((state) => state.modelos);
  const loadingCarros = useCarroStore((state) => state.loading);
  const loadingMarcas = useMarcaStore((state) => state.loading);
  const loadingModelos = useModeloStore((state) => state.loading);
  const errorCarros = useCarroStore((state) => state.error);
  const errorMarcas = useMarcaStore((state) => state.error);
  const errorModelos = useModeloStore((state) => state.error);
  const addCarro = useCarroStore((state) => state.addCarro);
  const addMarca = useMarcaStore((state) => state.addMarca);
  const addModelo = useModeloStore((state) => state.addModelo);
  const updateCarro = useCarroStore((state) => state.updateCarro);
  const updateMarca = useMarcaStore((state) => state.updateMarca);
  const updateModelo = useModeloStore((state) => state.updateModelo);
  const removeCarro = useCarroStore((state) => state.removeCarro);
  const removeMarca = useMarcaStore((state) => state.removeMarca);
  const removeModelo = useModeloStore((state) => state.removeModelo);

  const loading = loadingCarros || loadingMarcas || loadingModelos;
  const error = errorCarros ?? errorMarcas ?? errorModelos;

  useEffect(() => {
    void fetchCatalog();
  }, []);

  useEffect(() => {
    setSelectedId(null);
  }, [view]);

  const columns = useMemo(() => {
    if (view === 'carros') {
      return [
        { key: 'id',          label: 'ID',          sortType: 'numeric' as const },
        { key: 'modelo',      label: 'Modelo' },
        { key: 'ano',         label: 'Ano',         sortType: 'numeric' as const },
        { key: 'combustivel', label: 'Combustível' },
        { key: 'numPortas',   label: 'Portas',      sortType: 'numeric' as const },
        { key: 'cor',         label: 'Cor' },
        { key: 'valor',       label: 'Valor',       sortType: 'numeric' as const },
        { key: 'createdAt',   label: 'Criado em',   sortType: 'date' as const,
          format: (value: unknown) => formatDateBR(value as string | Date) },
      ];
    }
    if (view === 'modelos') {
      return [
        { key: 'id',    label: 'ID',    sortType: 'numeric' as const },
        { key: 'nome',  label: 'Nome' },
        { key: 'marca', label: 'Marca' },
      ];
    }
    return [
      { key: 'id',   label: 'ID',   sortType: 'numeric' as const },
      { key: 'nome', label: 'Nome' },
    ];
  }, [view]);

  const defaultSort = useMemo<SortConfig>(
    () =>
      view === 'carros'
        ? { key: 'ano', direction: 'desc' }
        : view === 'modelos'
          ? { key: 'nome', direction: 'asc' }
          : { key: 'nome', direction: 'asc' },
    [view],
  );

  const handleAdd = useCallback(() => {
    setEditing(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((item: Carro | Marca | Modelo) => {
    setEditing(item);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback((item: Carro | Marca | Modelo, type:'carro'|'marca'|'modelo') => {
    setDeleteTarget(item);
    setDeleteType(type);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget || !deleteType) return;
    try {
      if (deleteType === 'carro') {
        await removeCarro(deleteTarget.id);
      } else if (deleteType === 'marca') {
        await removeMarca(deleteTarget.id);
      } else {
        await removeModelo(deleteTarget.id);
      }
    } catch (err:any) {
      alert(err.message || String(err));
    } finally {
      setDeleteTarget(null);
      setDeleteType(null);
    }
  }, [deleteTarget, deleteType, removeCarro, removeMarca, removeModelo]);

  const handleSubmit = useCallback(async (formData: CarroFormValues | NomeFormValues | ModeloFormValues) => {
    try {
      if (view === 'carros') {
        const data = formData as CarroFormValues;
        if (editing?.id) {
          await updateCarro(editing.id, data);
        } else {
          const newCarro = await addCarro(data);
          setSelectedId(newCarro.id);
        }
      } else if (view === 'marcas') {
        const { nome } = formData as NomeFormValues;
        if (editing?.id) {
          await updateMarca(editing.id, nome);
        } else {
          const newMarca = await addMarca(nome);
          setSelectedId(newMarca.id);
        }
      } else {
        const { nome, marcaId } = formData as ModeloFormValues;
        if (editing?.id) {
          await updateModelo(editing.id, nome, marcaId);
        } else {
          const newModelo = await addModelo(nome, marcaId);
          setSelectedId(newModelo.id);
        }
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err:any) {
      alert(err.message || String(err));
    }
  }, [view, editing, addCarro, updateCarro, addMarca, updateMarca, addModelo, updateModelo]);

  return (
    <div className="min-h-screen flex bg-zinc-50">
      <Sidebar collapsed={collapsed} onToggle={()=>setCollapsed((c)=>!c)} view={view} setView={setView} />
      <div className="flex flex-1 flex-col">
        <Topbar title="Gerenciamento de Carros" />
        <main className="flex-1 p-4">
          <div className="mb-4 rounded bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-gray-500">Visão atual</p>
                <h2 className="text-xl font-semibold text-slate-900">{view === 'carros' ? 'Carros' : view === 'marcas' ? 'Marcas' : 'Modelos'}</h2>
              </div>
              <button onClick={handleAdd} className="inline-flex items-center justify-center rounded bg-sky-600 px-4 py-2 text-white shadow-sm hover:bg-sky-700">
                {view === 'carros' ? 'Adicionar Carro' : view === 'marcas' ? 'Adicionar Marca' : 'Adicionar Modelo'}
              </button>
            </div>
          </div>

          {loading && (
            <div role="status" aria-live="polite" className="rounded bg-white p-4 shadow-sm text-slate-600">Carregando dados...</div>
          )}

          {error && (
            <div role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
          )}

          <div className="overflow-x-auto rounded bg-white shadow-sm">
            <DataGrid
              key={view}
              items={view === 'carros' ? carros : view === 'marcas' ? marcas : modelos}
              columns={columns}
              defaultSort={defaultSort}
              groupBy={(view === 'carros' || view === 'modelos') ? 'marca' : undefined}
              groupItemLabel={view === 'carros' ? 'carro' : 'modelo'}
              groupItemLabelPlural={view === 'carros' ? 'carros' : 'modelos'}
              groupFallbackLabel="Sem marca"
              onAdd={handleAdd}
              addLabel={view === 'carros' ? 'Adicionar Carro' : view === 'marcas' ? 'Adicionar Marca' : 'Adicionar Modelo'}
              actions={[
                {
                  label: 'Editar',
                  className: 'cursor-pointer rounded bg-amber-300 px-2 py-1',
                  onClick: handleEdit,
                },
                {
                  label: 'Excluir',
                  className: 'cursor-pointer rounded bg-red-500 px-2 py-1 text-white',
                  onClick: (item) => handleDelete(item, view === 'carros' ? 'carro' : view === 'marcas' ? 'marca' : 'modelo'),
                },
              ]}
              onRowDoubleClick={handleEdit}
              selectedId={selectedId}
            />
          </div>
        </main>
      </div>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Editar' : 'Adicionar'}>
        <EntityForm view={view} editing={editing} onSubmit={handleSubmit} marcas={marcas} modelos={modelos} />
      </Modal>

      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Confirmar exclusão">
        <div>
          <p className="text-sm text-slate-700">Tem certeza que deseja excluir {deleteType === 'carro' ? 'este carro' : deleteType === 'marca' ? 'esta marca' : 'este modelo'}?</p>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setDeleteTarget(null)} className="rounded border px-4 py-2">Cancelar</button>
            <button type="button" onClick={confirmDelete} className="rounded bg-red-600 px-4 py-2 text-white">Excluir</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
