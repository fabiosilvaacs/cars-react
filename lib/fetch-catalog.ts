import { useCarroStore } from './stores/carro-store';
import { useMarcaStore } from './stores/marca-store';
import { useModeloStore } from './stores/modelo-store';

export async function fetchCatalog() {
  await Promise.all([
    useCarroStore.getState().fetch(),
    useMarcaStore.getState().fetch(),
    useModeloStore.getState().fetch(),
  ]);
}
