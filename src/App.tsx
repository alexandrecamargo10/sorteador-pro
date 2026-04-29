import React, { useState, useRef } from 'react';
import { filtrarNomes, realizarSorteio } from './utils/logicaSorteador';
import { Trophy, Users, RefreshCcw, ListPlus, LayoutPanelTop } from 'lucide-react';

const App: React.FC = () => {
  const [entrada, setEntrada] = useState('');
  const [todosOsNomes, setTodosOsNomes] = useState<string[]>([]);
  const [disponiveis, setDisponiveis] = useState<string[]>([]);
  const [ganhadoresAtuais, setGanhadoresAtuais] = useState<string[]>([]);
  const [historico, setHistorico] = useState<string[]>([]);
  const [quantidade, setQuantidade] = useState(1);
  const [estaSorteando, setEstaSorteando] = useState(false);
  const [logoPersonalizada, setLogoPersonalizada] = useState<string | null>(null);
  const refEntradaArquivo = useRef<HTMLInputElement>(null);

  // Carrega os nomes digitados para o sistema
  const prepararSorteio = () => {
    const listaLimpa = filtrarNomes(entrada);
    if (listaLimpa.length === 0) return alert("Por favor, insira alguns nomes primeiro!");
    
    setTodosOsNomes(listaLimpa);
    setDisponiveis(listaLimpa);
    setGanhadoresAtuais([]);
    setHistorico([]);
    alert(`${listaLimpa.length} nomes carregados com sucesso!`);
  };

  // Função principal com efeito visual simples de "carregamento"
  const sortear = () => {
    if (disponiveis.length === 0) return alert("Não há mais nomes disponíveis!");
    
    setEstaSorteando(true);
    setGanhadoresAtuais([]);

    // Simula um pequeno delay para criar suspense no grupo
    setTimeout(() => {
      const { ganhadores, restantes } = realizarSorteio(disponiveis, quantidade);
      setGanhadoresAtuais(ganhadores);
      setDisponiveis(restantes);
      setHistorico(prev => [...ganhadores, ...prev]);
      setEstaSorteando(false);
    }, 800);
  };

  const reiniciar = () => {
    setDisponiveis(todosOsNomes);
    setGanhadoresAtuais([]);
    setHistorico([]);
  };

  const tratarMudancaLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivoSelecionado = event.target.files?.[0];

    if (arquivoSelecionado) {
      // Cria um endereço temporário para a imagem que o usuário enviou
      const enderecoImagem = URL.createObjectURL(arquivoSelecionado);
      setLogoPersonalizada(enderecoImagem);
    }
  }

  const abrirEscolhaArquivo = () => {
    // Simula um clique no input de arquivo que está escondido
    refEntradaArquivo.current?.click();
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <header className="mb-12 text-center">
        <div className="relative group/icone flex items-center gap-2">
          {/* Input de arquivo invisível */}
          <input 
            type="file" 
            ref={refEntradaArquivo} 
            onChange={tratarMudancaLogo} 
            accept="image/*" 
            className="hidden" 
          />
          <LayoutPanelTop className="text-blue-500 cursor-pointer hover:text-white transition-colors" onClick={abrirEscolhaArquivo}/> 
          {/* Lógica do Título vs Imagem */}
          {logoPersonalizada ? (
            <img 
              src={logoPersonalizada} 
              alt="Logo do Usuário" 
              className="h-32 w-auto object-contain animate-in fade-in zoom-in duration-500" 
            />
          ) : (
            <h1 className="text-4xl font-black text-white tracking-tighter italic">
              SORTEADOR <span className="text-blue-500">PRO</span>
            </h1>
          )}  
          {/* Tooltip customizada com Tailwind */}
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/icone:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-xl border border-slate-700">
            Alterar Logotipo
          </span>
        </div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: CADASTRO */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-xl">
            <h2 className="flex items-center gap-2 font-bold mb-4 text-slate-200">
              <ListPlus size={20} className="text-blue-400" /> LISTA DE NOMES
            </h2>
            <textarea 
              className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm"
              placeholder="Cole os nomes separados por linha ou vírgula..."
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
            />
            <button 
              onClick={prepararSorteio}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Users size={18} /> CARREGAR NOMES
            </button>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700">
            <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">
              Quantidade por sorteio
            </label>
            <input 
              type="number" 
              min="1" 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xl font-bold text-center"
              value={quantidade}
              onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value)))} // Evita que o usuário digite 0, utilizando o Math.max para comparar o número digitado com 1 e retornando sempre o maior valor. Programação defensiva!
            />
          </div>
        </section>

        {/* COLUNA DIREITA: DISPLAY E SORTEIO */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* VISOR PRINCIPAL */}
          <div className="relative bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] p-12 shadow-2xl min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
            {/* Elementos decorativos de fundo */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            {estaSorteando ? (
              <div className="text-center animate-pulse">
                <RefreshCcw size={80} className="animate-spin text-blue-200 mb-6 mx-auto opacity-50" />
                <h3 className="text-4xl font-bold text-white uppercase tracking-[0.2em]">Sorteando...</h3>
              </div>
            ) : ganhadoresAtuais.length > 0 ? (
              <div className="text-center w-full">
                <Trophy size={60} className="text-yellow-400 mb-4 mx-auto drop-shadow-lg" />
                <p className="text-blue-200 uppercase tracking-widest font-semibold mb-2">Vencedor(es):</p>
                <div className="flex flex-wrap justify-center gap-6">
                  {ganhadoresAtuais.map((nome, i) => (
                    <span key={i} className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-300">
                      {nome}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center opacity-40">
                <Trophy size={100} className="mb-4 mx-auto" />
                <p className="text-2xl font-medium uppercase tracking-widest">Aguardando Início</p>
              </div>
            )}
          </div>

          <button 
            disabled={todosOsNomes.length === 0 || estaSorteando}
            onClick={sortear}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 py-8 rounded-[2rem] text-4xl font-black shadow-xl transition-all active:scale-[0.98] uppercase tracking-tighter"
          >
            {disponiveis.length === 0 && todosOsNomes.length > 0 ? "FIM DO SORTEIO" : "SORTEAR AGORA"}
          </button>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Disponíveis</span>
              <p className="text-3xl font-black">{disponiveis.length} <span className="text-sm font-normal text-slate-500">/ {todosOsNomes.length}</span></p>
            </div>
            <button 
              onClick={reiniciar}
              className="bg-slate-800 hover:bg-slate-700 p-5 rounded-3xl border border-slate-700 flex items-center justify-center gap-3 font-bold transition-all active:scale-95"
            >
              <RefreshCcw size={20} /> REINICIAR
            </button>
          </div>

          {/* HISTÓRICO */}
          <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700 h-64 overflow-hidden flex flex-col">
            <h4 className="text-xs font-black text-slate-500 mb-4 uppercase tracking-[0.2em]">Últimos Ganhadores</h4>
            <div className="overflow-y-auto space-y-2 flex-1 scrollbar-hide">
              {historico.length > 0 ? historico.map((n, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-700/50">
                  <span className="font-bold text-slate-300">{n}</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full font-bold">
                    #{historico.length - i}
                  </span>
                </div>
              )) : <p className="text-center text-slate-600 mt-10 text-sm">Nenhum sorteio realizado ainda.</p>}
            </div>
          </div>
        </section>
      </main>
      <footer className="mt-8 py-2 flex flex-col items-center justify-center w-full border-t border-slate-800/30">
        <p className="text-slate-400 text-sm">
          Desenvolvido por{' '}
          <a 
            href="https://www.linkedin.com/in/alexandrecamargo10/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Alexandre Camargo
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;