export interface ItemRoleta {
  id: string;
  texto: string;
  peso: number; // Porcentagem de chance (0 a 100)
  cor: string;  // Hexadecimal da cor do fatia
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
