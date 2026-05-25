import { renderHook, act } from '@testing-library/react';
import { useModeloStore } from '../../lib/stores/modelo-store';

// Mock fetch globally
global.fetch = jest.fn();

describe('Modelo Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state before each test
    const { result } = renderHook(() => useModeloStore());
    act(() => {
      result.current.modelos = [];
      result.current.loading = false;
      result.current.error = null;
    });
  });

  describe('fetch', () => {
    it('deve buscar modelos com sucesso', async () => {
      const mockModelos = [
        { id: 1, nome: 'Civic', marca: 'Honda', marcaId: 1 },
        { id: 2, nome: 'Corolla', marca: 'Toyota', marcaId: 2 },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockModelos,
      });

      const { result } = renderHook(() => useModeloStore());

      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.modelos).toEqual(mockModelos);
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('deve definir erro quando fetch falha', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Erro ao buscar',
      });

      const { result } = renderHook(() => useModeloStore());

      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.modelos).toEqual([]);
      expect(result.current.error).toBeDefined();
      expect(result.current.loading).toBe(false);
    });
  });

  describe('addModelo', () => {
    it('deve adicionar modelo com sucesso', async () => {
      const newModelo = {
        id: 1,
        nome: 'Civic',
        marca: 'Honda',
        marcaId: 1,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => newModelo,
      });

      const { result } = renderHook(() => useModeloStore());

      await act(async () => {
        const modelo = await result.current.addModelo('Civic', 1);
        expect(modelo).toEqual(newModelo);
      });

      expect(result.current.modelos).toContainEqual(newModelo);
      expect(result.current.error).toBeNull();
    });

    it('deve lançar erro quando addModelo falha', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Erro ao criar modelo',
      });

      const { result } = renderHook(() => useModeloStore());

      await expect(
        act(async () => {
          await result.current.addModelo('Civic', 1);
        }),
      ).rejects.toThrow();
    });
  });

  describe('updateModelo', () => {
    it('deve atualizar modelo com sucesso', async () => {
      const modelo = { id: 1, nome: 'Civic', marca: 'Honda', marcaId: 1 };

      const { result } = renderHook(() => useModeloStore());

      act(() => {
        result.current.modelos = [modelo];
      });

      const updatedModelo = { id: 1, nome: 'Civic 2024', marca: 'Honda', marcaId: 1 };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedModelo,
      });

      await act(async () => {
        await result.current.updateModelo(1, 'Civic 2024', 1);
      });

      expect(result.current.modelos[0]).toEqual(updatedModelo);
      expect(result.current.error).toBeNull();
    });

    it('deve lançar erro quando updateModelo falha', async () => {
      const { result } = renderHook(() => useModeloStore());

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Erro ao atualizar',
      });

      await expect(
        act(async () => {
          await result.current.updateModelo(1, 'Civic 2024', 1);
        }),
      ).rejects.toThrow();
    });
  });

  describe('removeModelo', () => {
    it('deve remover modelo com sucesso', async () => {
      const modelo = { id: 1, nome: 'Civic', marca: 'Honda', marcaId: 1 };

      const { result } = renderHook(() => useModeloStore());

      act(() => {
        result.current.modelos = [modelo];
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await act(async () => {
        await result.current.removeModelo(1);
      });

      expect(result.current.modelos).toHaveLength(0);
      expect(result.current.error).toBeNull();
    });

    it('deve lançar erro quando removeModelo falha', async () => {
      const { result } = renderHook(() => useModeloStore());

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Erro ao deletar',
      });

      await expect(
        act(async () => {
          await result.current.removeModelo(1);
        }),
      ).rejects.toThrow();
    });
  });
});
