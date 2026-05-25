import { create } from 'zustand';
import type { Carro } from '../types';

interface CarroStoreState {
  carros: Carro[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  addCarro: (data: {
    modeloId: number;
    ano: number;
    combustivel: string;
    numPortas: number;
    cor: string;
    valor: number;
  }) => Promise<Carro>;
  updateCarro: (
    id: number,
    data: {
      modeloId?: number;
      ano?: number;
      combustivel?: string;
      numPortas?: number;
      cor?: string;
      valor?: number;
    },
  ) => Promise<void>;
  removeCarro: (id: number) => Promise<void>;
}

export async function fetchCarros() {
  const res = await fetch('/api/carros');
  if (!res.ok) throw new Error('Erro ao buscar carros');
  return res.json();
}

export async function apiCreateCarro(data: { modeloId: number; ano: number; combustivel: string; numPortas: number; cor: string; valor: number }) {
  const res = await fetch('/api/carros', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiUpdateCarro(id: number, data: { modeloId?: number; ano?: number; combustivel?: string; numPortas?: number; cor?: string; valor?: number }) {
  const res = await fetch(`/api/carros/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiDeleteCarro(id: number) {
  const res = await fetch(`/api/carros/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const useCarroStore = create<CarroStoreState>((set) => ({
  carros: [],
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const carros = await fetchCarros();
      set({ carros });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : String(err) });
    } finally {
      set({ loading: false });
    }
  },
  addCarro: async (data) => {
    set({ loading: true, error: null });
    try {
      const carro = await apiCreateCarro(data);
      set((state) => ({ carros: [...state.carros, carro] }));
      return carro;
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : String(err) });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  updateCarro: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const carro = await apiUpdateCarro(id, data);
      set((state) => ({ carros: state.carros.map((item) => (item.id === id ? carro : item)) }));
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : String(err) });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  removeCarro: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiDeleteCarro(id);
      set((state) => ({ carros: state.carros.filter((item) => item.id !== id) }));
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : String(err) });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
