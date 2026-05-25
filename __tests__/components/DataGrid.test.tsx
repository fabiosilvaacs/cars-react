import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataGrid from '../../app/components/DataGrid';

describe('DataGrid Component', () => {
  const mockItems = [
    {
      id: 1,
      name: 'Item 1',
      value: 100,
    },
    {
      id: 2,
      name: 'Item 2',
      value: 200,
    },
    {
      id: 3,
      name: 'Item 3',
      value: 300,
    },
  ];

  const mockColumns = [
    { key: 'id' as const, label: 'ID', sortType: 'numeric' as const },
    { key: 'name' as const, label: 'Name' },
    { key: 'value' as const, label: 'Value', sortType: 'numeric' as const },
  ];

  describe('Rendering', () => {
    it('deve renderizar com sucesso', () => {
      render(<DataGrid items={mockItems} columns={mockColumns} />);
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('deve renderizar todos os itens', () => {
      render(<DataGrid items={mockItems} columns={mockColumns} />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('deve renderizar header das colunas', () => {
      render(<DataGrid items={mockItems} columns={mockColumns} />);
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
    });

    it('deve mostrar mensagem de vazio quando não há itens', () => {
      render(<DataGrid items={[]} columns={mockColumns} />);
      expect(screen.getByText('Nenhum item encontrado.')).toBeInTheDocument();
    });

    it('deve renderizar botão Adicionar quando onAdd é fornecido', () => {
      const onAdd = jest.fn();
      render(
        <DataGrid
          items={mockItems}
          columns={mockColumns}
          onAdd={onAdd}
          addLabel="Novo Item"
        />,
      );
      expect(screen.getByText('Novo Item')).toBeInTheDocument();
    });
  });

  describe('Row Selection', () => {
    it('deve chamar onRowClick quando uma linha é clicada', () => {
      const onRowClick = jest.fn();
      render(
        <DataGrid
          items={mockItems}
          columns={mockColumns}
          onRowClick={onRowClick}
        />,
      );

      const firstRow = screen.getByText('Item 1').closest('tr');
      fireEvent.click(firstRow!);

      expect(onRowClick).toHaveBeenCalledWith(mockItems[0]);
    });

    it('deve highlight a linha selecionada com selectedId', () => {
      const { container } = render(
        <DataGrid
          items={mockItems}
          columns={mockColumns}
          selectedId={1}
        />,
      );

      const rows = container.querySelectorAll('tr');
      const selectedRow = Array.from(rows).find(
        (row) => row.getAttribute('aria-selected') === 'true',
      );

      expect(selectedRow).toBeDefined();
    });

    it('deve chamar onRowDoubleClick quando uma linha é clicada duas vezes', () => {
      const onRowDoubleClick = jest.fn();
      render(
        <DataGrid
          items={mockItems}
          columns={mockColumns}
          onRowDoubleClick={onRowDoubleClick}
        />,
      );

      const firstRow = screen.getByText('Item 1').closest('tr');
      fireEvent.doubleClick(firstRow!);

      expect(onRowDoubleClick).toHaveBeenCalledWith(mockItems[0]);
    });
  });

  describe('Filtering', () => {
    it('deve filtrar itens pelo texto do campo de busca', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          items={mockItems}
          columns={mockColumns}
          filterPlaceholder="Buscar..."
        />,
      );

      const searchInput = screen.getByPlaceholderText('Buscar...');
      await user.type(searchInput, 'Item 1');

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Item 3')).not.toBeInTheDocument();
    });

    it('deve mostrar mensagem de vazio quando nenhum resultado de filtro', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          items={mockItems}
          columns={mockColumns}
          filterPlaceholder="Buscar..."
        />,
      );

      const searchInput = screen.getByPlaceholderText('Buscar...');
      await user.type(searchInput, 'NonExistent');

      expect(screen.getByText('Nenhum item encontrado.')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('deve ter sort padrão quando defaultSort é fornecido', () => {
      render(
        <DataGrid
          items={mockItems}
          columns={mockColumns}
          defaultSort={{ key: 'name', direction: 'asc' }}
        />,
      );

      // Verifica se os itens estão em ordem alfabética
      const nameTexts = screen.getAllByText(/Item [123]/);
      expect(nameTexts[0].textContent).toBe('Item 1');
    });
  });

  describe('Row Actions', () => {
    it('deve renderizar botões de ação quando fornecidos', () => {
      const actions = [
        { label: 'Editar', onClick: jest.fn() },
        { label: 'Deletar', onClick: jest.fn() },
      ];

      render(
        <DataGrid items={mockItems} columns={mockColumns} actions={actions} />,
      );

      expect(screen.getAllByText('Editar')).toHaveLength(mockItems.length);
      expect(screen.getAllByText('Deletar')).toHaveLength(mockItems.length);
    });

    it('deve chamar onClick da ação quando botão é clicado', () => {
      const onEdit = jest.fn();
      const actions = [{ label: 'Editar', onClick: onEdit }];

      render(
        <DataGrid items={mockItems} columns={mockColumns} actions={actions} />,
      );

      const editButtons = screen.getAllByText('Editar');
      fireEvent.click(editButtons[0]);

      expect(onEdit).toHaveBeenCalledWith(mockItems[0]);
    });
  });

  describe('Formatting', () => {
    it('deve aplicar formatação personalizada às células', () => {
      const formattedColumns = [
        { key: 'id' as const, label: 'ID' },
        { key: 'name' as const, label: 'Name' },
        {
          key: 'value' as const,
          label: 'Value',
          format: (value: unknown) => `$${value}`,
        },
      ];

      render(<DataGrid items={mockItems} columns={formattedColumns} />);

      expect(screen.getByText('$100')).toBeInTheDocument();
      expect(screen.getByText('$200')).toBeInTheDocument();
      expect(screen.getByText('$300')).toBeInTheDocument();
    });
  });
});
