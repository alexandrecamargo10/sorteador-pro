import type { ItemRoleta, EsquemaCores } from '../types/roleta';

// Esquemas de cores pré-definidos para as fatias da roleta
export const ESQUEMAS_CORES: EsquemaCores[] = [
  {
    id: 'vibrante',
    nome: '🌈 Vibrante Neon',
    cores: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f43f5e']
  },
  {
    id: 'luxo',
    nome: '👑 Luxo & Ouro',
    cores: ['#d97706', '#b45309', '#f59e0b', '#78350f', '#451a03', '#fef08a', '#ca8a04', '#92400e']
  },
  {
    id: 'pastel',
    nome: '🎨 Pastel Soft',
    cores: ['#93c5fd', '#c084fc', '#f472b6', '#fcd34d', '#6ee7b7', '#a5f3fc', '#a7f3d0', '#fbcfe8']
  },
  {
    id: 'synthwave',
    nome: '🕹️ Synthwave 80s',
    cores: ['#ff007f', '#7928ca', '#00dfd8', '#ff4e50', '#f9d423', '#00f2fe', '#4facfe', '#ff0844']
  },
  {
    id: 'natureza',
    nome: '🌿 Natureza & Menta',
    cores: ['#059669', '#10b981', '#34d399', '#0d9488', '#14b8a6', '#84cc16', '#65a30d', '#047857']
  }
];

// Itens iniciais padrão
export const ITENS_PADRAO_ROLETA: ItemRoleta[] = [
  { id: '1', texto: '🎁 Vale Compras R$ 100', peso: 25, cor: '#3b82f6' },
  { id: '2', texto: '🍕 Pizza Grátis', peso: 25, cor: '#8b5cf6' },
  { id: '3', texto: '☕ Cafezinho Especial', peso: 25, cor: '#ec4899' },
  { id: '4', texto: '⭐ 50% de Desconto', peso: 25, cor: '#f59e0b' },
];

/**
 * Recalcula as porcentagens dos itens para que fiquem exatamente iguais (Porcentagem Justa).
 */
export const aplicarPorcentagemJusta = (itens: ItemRoleta[]): ItemRoleta[] => {
  if (itens.length === 0) return [];
  const percentualExato = 100 / itens.length;
  // Arredonda para 1 casa decimal para exibição amigável
  const percentualFormatado = Number(percentualExato.toFixed(1));

  return itens.map(item => ({
    ...item,
    peso: percentualFormatado
  }));
};

/**
 * Seleciona um item da roleta usando probabilidade ponderada baseada no campo 'peso'.
 */
export const sortearItemRoleta = (itens: ItemRoleta[]): { itemVencedor: ItemRoleta; indiceVencedor: number } => {
  if (itens.length === 0) {
    throw new Error('A roleta deve conter pelo menos um item para ser sorteada.');
  }

  const pesoTotal = itens.reduce((soma, item) => soma + Math.max(0, item.peso), 0);

  // Se a soma de todos os pesos for 0, sorteia com probabilidades iguais
  if (pesoTotal <= 0) {
    const indiceSorteado = Math.floor(Math.random() * itens.length);
    return { itemVencedor: itens[indiceSorteado], indiceVencedor: indiceSorteado };
  }

  const pontoSorteado = Math.random() * pesoTotal;
  let acumulador = 0;

  for (let i = 0; i < itens.length; i++) {
    acumulador += Math.max(0, itens[i].peso);
    if (pontoSorteado <= acumulador) {
      return { itemVencedor: itens[i], indiceVencedor: i };
    }
  }

  // Fallback de segurança para o último item
  const ultimoIndice = itens.length - 1;
  return { itemVencedor: itens[ultimoIndice], indiceVencedor: ultimoIndice };
};

/**
 * Aplica um esquema de cores aos itens da roleta em sequência.
 */
export const aplicarEsquemaCores = (itens: ItemRoleta[], esquemaId: string): ItemRoleta[] => {
  const esquema = ESQUEMAS_CORES.find(e => e.id === esquemaId) || ESQUEMAS_CORES[0];
  return itens.map((item, index) => ({
    ...item,
    cor: esquema.cores[index % esquema.cores.length]
  }));
};

// Singleton para o AudioContext do Web Audio API (geração de sons nativos offline)
let audioCtx: AudioContext | null = null;

const obterAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Toca um som sintético de clique/catraca ao girar a roleta.
 */
export const tocarSomCliqueSintetizado = () => {
  try {
    const ctx = obterAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Silencioso se o áudio não for suportado pelo navegador
  }
};

/**
 * Toca uma vinheta alegre sintética de vitória ao finalizar o giro.
 */
export const tocarSomVitoriaSintetizado = () => {
  try {
    const ctx = obterAudioContext();
    if (!ctx) return;

    const notas = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notas.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);

      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.3);
    });
  } catch {
    // Silencioso se não suportado
  }
};
