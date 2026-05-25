import { renderHook, act } from '@testing-library/react';
import { useMarcaStore } from '../../lib/stores/marca-store';

// Mock fetch globally
global.fetch = jest.fn();

describe('Marca Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state before each test
    const { result } = renderHook(() => useMarcaStore());
    act(() => {
      result.current.marcas = [];
      result.current.loading = false;
      result.current.error = null;
    });
  });

  describe('fetch', () => {
    it('deve buscar marcas com sucesso', async () => {
      const mockMarcas = [
        { id: 1, nome: 'Honda' },
        { id: 2, nome: 'Toyota' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMarcas,
      });

      const { result } = renderHook(() => useMarcaStore());

      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.marcas).toEqual(mockMarcas);
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('deve definir erro quando fetch falha', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Erro ao buscar',
      });

      const { result } = renderHook(() => useMarcaStore());

      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.marcas).toEqual([]);
      expect(result.current.error).toBeDefined();
      expect(result.current.loading).toBe(false);
    });
  });

  describe('addMarca', () => {
    it('deve adicionar marca com sucesso', async () => {
      const newMarca = {
        id: 1,
        nome: 'Ford',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => newMarca,
      });

      const { result } = renderHook(() => useMarcaStore());

      await act(async () => {
        const marca = await result.current.addMarca('Ford');
        expect(marca).toEqual(newMarca);
      });

      expect(result.current.marcas).toContainEqual(newMarca);
      expect(result.current.error).toBeNull();
    });

    it('deve lançar erro quando addMarca falha', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Erro ao criar marca',
      });

      const { result } = renderHook(() => useMarcaStore());

      await expect(
        act(async () => {
          await result.current.addMarca('Ford');
        }),
      ).rejects.toThrow();
    });
  });

  describe('updateMarca', () => {
    it('deve atualizar marca com sucesso', async () => {
      const marca = { id: 1, nome: 'Honda' };

      const { result } = renderHook(() => useMarcaStore());

      act(() => {
        result.current.marcas = [marca];
      });

      const updatedMarca = { id: 1, nome: 'Honda Motor' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedMarca,
      });

      await act(async () => {
        await result.current.updateMarca(1, 'Honda Motor');
      });

      expect(result.current.marcas[0]).toEqual(updatedMarca);
      expect(result.current.error).toBeNull();
    });

    it('deve lançar erro quando updateMarca falha', async () => {
      const { result } = renderHook(() => useMarcaStore());

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Erro ao atualizar',
      });

      await expect(
        act(async () => {
          await result.current.updateMarca(1, 'Honda Motor');
        }),
      ).rejects.toThrow();
    });
  });

  describe('removeMarca', () => {
    it('deve remover marca com sucesso', async () => {
      const marca = { id: 1, nome: 'Honda' };

      const { result } = renderHook(() => useMarcaStore());

      act(() => {
        result.current.marcas = [marca];
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await act(async () => {
        await result.current.removeMarca(1);
      });

      expect(result.current.marcas).toHaveLength(0);
      expect(result.current.error).toBeNull();
    });

    it('deve lançar erro quando removeMarca falha', async () => {
      const { result } = renderHook(() => useMarcaStore());

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Erro ao deletar',
      });

      await expect(
        act(async () => {
          await result.current.removeMarca(1);
        }),
      ).rejects.toThrow();
    });
  });
});
