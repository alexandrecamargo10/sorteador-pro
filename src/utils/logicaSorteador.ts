/**
 * Limpa o texto de entrada e transforma em um array de nomes.
 * Aceita nomes separados por vírgula ou uma pessoa por linha.
 */
export const filtrarNomes = (textoBruto: string): string[] => {
  return textoBruto
    .split(/[\n,;]+/) // Divide por quebra de linha ou vírgula
    .map(nome => nome.trim()) // Remove espaços em branco nas pontas
    .filter(nome => nome.length > 0); // Remove linhas vazias
};

/**
 * Lógica matemática para selecionar nomes aleatórios sem repetição.
 */
export const realizarSorteio = (disponiveis: string[], quantidade: number) => {
  const urna = [...disponiveis];
  const ganhadores: string[] = [];

  for (let i = 0; i < quantidade; i++) {
    if (urna.length === 0) break;
    
    // Gera um índice aleatório baseado no tamanho atual da urna
    const indice = Math.floor(Math.random() * urna.length);
    
    // Remove o ganhador da urna para que ele não ganhe duas vezes
    const [escolhido] = urna.splice(indice, 1);
    ganhadores.push(escolhido);
  }

  return { ganhadores, restantes: urna };
};