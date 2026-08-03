import React, { useState, useRef } from 'react';
import { SorteadorNomes } from './components/SorteadorNomes';
import { RoletaPremios } from './components/RoletaPremios';
import { LayoutPanelTop, Dices, Disc3 } from 'lucide-react';

type Aba = 'nomes' | 'roleta';

const App: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('nomes');
  const [logoPersonalizada, setLogoPersonalizada] = useState<string | null>(null);
  const refEntradaArquivo = useRef<HTMLInputElement>(null);

  const tratarMudancaLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivoSelecionado = event.target.files?.[0];

    if (arquivoSelecionado) {
      const enderecoImagem = URL.createObjectURL(arquivoSelecionado);
      setLogoPersonalizada(enderecoImagem);
    }
  };

  const abrirEscolhaArquivo = () => {
    refEntradaArquivo.current?.click();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* HEADER PRINCIPAL DA APLICAÇÃO */}
      <header className="mb-8 text-center flex flex-col items-center gap-4">
        <div className="relative group/icone flex items-center gap-2">
          {/* Input de arquivo invisível para alterar logo */}
          <input 
            type="file" 
            ref={refEntradaArquivo} 
            onChange={tratarMudancaLogo} 
            accept="image/*" 
            className="hidden" 
          />
          <LayoutPanelTop 
            className="text-blue-500 cursor-pointer hover:text-white transition-colors" 
            onClick={abrirEscolhaArquivo}
          /> 
          
          {logoPersonalizada ? (
            <img 
              src={logoPersonalizada} 
              alt="Logo do Usuário" 
              className="h-28 w-auto object-contain animate-in fade-in zoom-in duration-500 cursor-pointer" 
              onClick={abrirEscolhaArquivo}
            />
          ) : (
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic">
              SORTEADOR <span className="text-blue-500">PRO</span>
            </h1>
          )}  
          
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/icone:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-xl border border-slate-700">
            Alterar Logotipo
          </span>
        </div>

        {/* NAVEGAÇÃO ENTRE ABAS (Sorteador de Nomes vs Roleta de Prêmios) */}
        <nav className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 shadow-lg">
          <button
            onClick={() => setAbaAtiva('nomes')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              abaAtiva === 'nomes'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Dices size={18} />
            <span>Sorteador de Nomes</span>
          </button>

          <button
            onClick={() => setAbaAtiva('roleta')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              abaAtiva === 'roleta'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Disc3 size={18} />
            <span>Roleta de Prêmios</span>
          </button>
        </nav>
      </header>

      {/* CONTEÚDO DA ABA ATIVA */}
      <main className="w-full flex justify-center">
        {abaAtiva === 'nomes' ? (
          <SorteadorNomes />
        ) : (
          <RoletaPremios />
        )}
      </main>

      {/* FOOTER PADRÃO */}
      <footer className="mt-12 py-4 flex flex-col items-center justify-center w-full border-t border-slate-800/30">
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