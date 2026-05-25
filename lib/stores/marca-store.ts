import { create } from 'zustand';
import type { Marca } from '../types';

interface MarcaStoreState {
  marcas: Marca[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  addMarca: (nome: string) => Promise<Marca>;
  updateMarca: (id: number, nome: string) => Promise<void>;
  removeMarca: (id: number) => Promise<void>;
}

export async function fetchMarcas() {
  const res = await fetch('/api/marcas');
  if (!res.ok) throw new Error('Erro ao buscar marcas');
  return res.json();
}

export async function apiCreateMarca(data: { nome: string }) {
  const res = await fetch('/api/marcas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiUpdateMarca(id: number, data: { nome: string }) {
  const res = await fetch(`/api/marcas/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiDeleteMarca(id: number) {
  const res = await fetch(`/api/marcas/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const useMarcaStore = create<MarcaStoreState>((set) => ({
  marcas: [],
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const marcas = await fetchMarcas();
      set({ marcas });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : String(err) });
    } finally {
      set({ loading: false });
    }
  },
  addMarca: async (nome) => {
    set({ loading: true, error: null });
    try {
    const marca = await apiCreateMarca({ nome });
      set((state) => ({ marcas: [...state.marcas, marca] }));
      return marca;
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : String(err) });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  updateMarca: async (id, nome) => {
    set({ loading: true, error: null });
    try {
      const marca = await apiUpdateMarca(id, { nome });
      set((state) => ({ marcas: state.marcas.map((item) => (item.id === id ? marca : item)) }));
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : String(err) });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  removeMarca: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiDeleteMarca(id);
      set((state) => ({ marcas: state.marcas.filter((item) => item.id !== id) }));
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : String(err) });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
