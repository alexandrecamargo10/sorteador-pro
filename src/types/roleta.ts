export type ModoSorteioRoleta = 'porcentagem' | 'quantidade';

export interface ItemRoleta {
  id: string;
  texto: string;
  peso: number; // Porcentagem de chance (0 a 100)
  quantidadeSorteios: number; // Quantidade exata de vezes a ser sorteado na sessão
  cor: string;  // Hexadecimal da cor da fatia
}

export interface EsquemaCores {
  id: string;
  nome: string;
  cores: string[];
}

export interface HistoricoRoleta {
  id: string;
  itemTexto: string;
  cor: string;
  dataHora: string;
}
