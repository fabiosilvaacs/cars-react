import { create } from 'zustand';
import type { Modelo } from '../types';
import {
  fetchModelos,
  createModelo,
  updateModelo as apiUpdateModelo,
  deleteModelo as apiDeleteModelo,
} from '../api';

interface ModeloStoreState {
  modelos: Modelo[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  addModelo: (nome: string, marcaId: number) => Promise<Modelo>;
  updateModelo: (id: number, nome: string, marcaId: number) => Promise<void>;
  removeModelo: (id: number) => Promise<void>;
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
      const modelo = await createModelo({ nome, marcaId });
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
