import { create } from 'zustand';
import type { Modelo } from '../types';

interface ModeloStoreState {
  modelos: Modelo[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  addModelo: (nome: string, marcaId: number) => Promise<Modelo>;
  updateModelo: (id: number, nome: string, marcaId: number) => Promise<void>;
  removeModelo: (id: number) => Promise<void>;
}

export async function fetchModelos() {
  const res = await fetch('/api/modelos');
  if (!res.ok) throw new Error('Erro ao buscar modelos');
  return res.json();
}

export async function apiCreateModelo(data: { nome: string; marcaId: number }) {
  const res = await fetch('/api/modelos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiUpdateModelo(id: number, data: { nome: string; marcaId: number }) {
  const res = await fetch(`/api/modelos/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiDeleteModelo(id: number) {
  const res = await fetch(`/api/modelos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const useModeloStore = create<ModeloStoreState>((set) => ({
  modelos: [],
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const modelos = await fetchModelos();
      set({ modelos });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : String(err) });
    } finally {
      set({ loading: false });
    }
  },
  addModelo: async (nome, marcaId) => {
    set({ loading: true, error: null });
    try {
      const modelo = await apiCreateModelo({ nome, marcaId });
      set((state) => ({ modelos: [...state.modelos, modelo] }));
      return modelo;
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : String(err) });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  updateModelo: async (id, nome, marcaId) => {
    set({ loading: true, error: null });
    try {
      const modelo = await apiUpdateModelo(id, { nome, marcaId });
      set((state) => ({ modelos: state.modelos.map((item) => (item.id === id ? modelo : item)) }));
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : String(err) });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  removeModelo: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiDeleteModelo(id);
      set((state) => ({ modelos: state.modelos.filter((item) => item.id !== id) }));
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : String(err) });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
