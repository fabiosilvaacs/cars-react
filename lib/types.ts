export interface Marca {
  id: number;
  nome: string;
}

export interface Modelo {
  id: number;
  nome: string;
  marcaId: number;
  marca?: string;
}

export interface Carro {
  id: number;
  modelo: string;
  marca: string;
  modeloId: number;
  ano: number;
  marcaId: number;
  combustivel: string;
  numPortas: number;
  cor: string;
  valor: number;
  createdAt: string;
}
