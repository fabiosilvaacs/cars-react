import { renderHook, act } from '@testing-library/react';
import { useCarroStore } from '../../lib/stores/carro-store';

// Mock fetch globally
global.fetch = jest.fn();

describe('Carro Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state before each test
    const { result } = renderHook(() => useCarroStore());
    act(() => {
      result.current.carros = [];
      result.current.loading = false;
      result.current.error = null;
    });
  });

  describe('fetch', () => {
    it('deve buscar carros com sucesso', async () => {
      const mockCarros = [
        {
          id: 1,
          modeloId: 1,
          modelo: 'Civic',
          ano: 2023,
          combustivel: 'Gasolina',
          numPortas: 4,
          cor: 'Preto',
          valor: 50000,
          createdAt: new Date(),
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCarros,
      });

      const { result } = renderHook(() => useCarroStore());

      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.carros).toEqual(mockCarros);
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('deve definir erro quando fetch falha', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Erro ao buscar',
      });

      const { result } = renderHook(() => useCarroStore());

      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.carros).toEqual([]);
      expect(result.current.error).toBeDefined();
      expect(result.current.loading).toBe(false);
    });

    it('deve definir loading como true durante fetch', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => [],
                }),
              100,
            ),
          ),
      );

      const { result } = renderHook(() => useCarroStore());

      act(() => {
        void result.current.fetch();
      });

      expect(result.current.loading).toBe(true);
    });
  });

  describe('addCarro', () => {
    it('deve adicionar carro com sucesso', async () => {
      const newCarro = {
        id: 1,
        modeloId: 1,
        modelo: 'Civic',
        ano: 2023,
        combustivel: 'Gasolina',
        numPortas: 4,
        cor: 'Preto',
        valor: 50000,
        createdAt: new Date(),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => newCarro,
      });

      const { result } = renderHook(() => useCarroStore());

      await act(async () => {
        const carro = await result.current.addCarro({
          modeloId: 1,
          ano: 2023,
          combustivel: 'Gasolina',
          numPortas: 4,
          cor: 'Preto',
          valor: 50000,
        });
        expect(carro).toEqual(newCarro);
      });

      expect(result.current.carros).toContainEqual(newCarro);
      expect(result.current.error).toBeNull();
    });

    it('deve lançar erro quando addCarro falha', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Erro ao criar carro',
      });

      const { result } = renderHook(() => useCarroStore());

      await expect(
        act(async () => {
          await result.current.addCarro({
            modeloId: 1,
            ano: 2023,
            combustivel: 'Gasolina',
            numPortas: 4,
            cor: 'Preto',
            valor: 50000,
          });
        }),
      ).rejects.toThrow();
    });
  });

  describe('updateCarro', () => {
    it('deve atualizar carro com sucesso', async () => {
      const carro = {
        id: 1,
        modeloId: 1,
        modelo: 'Civic',
        ano: 2023,
        combustivel: 'Gasolina',
        numPortas: 4,
        cor: 'Preto',
        valor: 50000,
        createdAt: new Date(),
      };

      const { result } = renderHook(() => useCarroStore());

      // Primeiro adiciona um carro ao estado
      act(() => {
        result.current.carros = [carro];
      });

      // Depois atualiza
      const updatedCarro = { ...carro, cor: 'Branco', ano: 2024 };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedCarro,
      });

      await act(async () => {
        await result.current.updateCarro(1, { cor: 'Branco', ano: 2024 });
      });

      expect(result.current.carros[0]).toEqual(updatedCarro);
      expect(result.current.error).toBeNull();
    });

    it('deve lançar erro quando updateCarro falha', async () => {
      const { result } = renderHook(() => useCarroStore());

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Erro ao atualizar',
      });

      await expect(
        act(async () => {
          await result.current.updateCarro(1, { ano: 2024 });
        }),
      ).rejects.toThrow();
    });
  });

  describe('removeCarro', () => {
    it('deve remover carro com sucesso', async () => {
      const carro = {
        id: 1,
        modeloId: 1,
        modelo: 'Civic',
        ano: 2023,
        combustivel: 'Gasolina',
        numPortas: 4,
        cor: 'Preto',
        valor: 50000,
        createdAt: new Date(),
      };

      const { result } = renderHook(() => useCarroStore());

      act(() => {
        result.current.carros = [carro];
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await act(async () => {
        await result.current.removeCarro(1);
      });

      expect(result.current.carros).toHaveLength(0);
      expect(result.current.error).toBeNull();
    });

    it('deve lançar erro quando removeCarro falha', async () => {
      const { result } = renderHook(() => useCarroStore());

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: async () => 'Erro ao deletar',
      });

      await expect(
        act(async () => {
          await result.current.removeCarro(1);
        }),
      ).rejects.toThrow();
    });
  });
});
