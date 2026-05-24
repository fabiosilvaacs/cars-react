export async function fetchMarcas(){
  const res = await fetch('/api/marcas');
  if(!res.ok) throw new Error('Erro ao buscar marcas');
  return res.json();
}

export async function fetchModelos(){
  const res = await fetch('/api/modelos');
  if(!res.ok) throw new Error('Erro ao buscar modelos');
  return res.json();
}

export async function fetchCarros(){
  const res = await fetch('/api/carros');
  if(!res.ok) throw new Error('Erro ao buscar carros');
  return res.json();
}

export async function createMarca(data: { nome: string }){
  const res = await fetch('/api/marcas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateMarca(id: number, data: { nome: string }){
  const res = await fetch(`/api/marcas/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteMarca(id: number){
  const res = await fetch(`/api/marcas/${id}`, { method: 'DELETE' });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createModelo(data: { nome: string; marcaId: number }){
  const res = await fetch('/api/modelos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateModelo(id: number, data: { nome: string; marcaId: number }){
  const res = await fetch(`/api/modelos/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteModelo(id: number){
  const res = await fetch(`/api/modelos/${id}`, { method: 'DELETE' });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createCar(data: { modeloId: number; ano: number; combustivel: string; numPortas: number; cor: string; valor: number }){
  const res = await fetch('/api/carros', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateCar(id: number, data: { modeloId?: number; ano?: number; combustivel?: string; numPortas?: number; cor?: string; valor?: number }){
  const res = await fetch(`/api/carros/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteCar(id: number){
  const res = await fetch(`/api/carros/${id}`, { method: 'DELETE' });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}
