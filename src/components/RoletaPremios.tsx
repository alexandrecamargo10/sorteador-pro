import React, { useState, useRef } from 'react';
import type { ItemRoleta, HistoricoRoleta } from '../types/roleta';
import { 
  ITENS_PADRAO_ROLETA, 
  ESQUEMAS_CORES, 
  aplicarPorcentagemJusta, 
  sortearItemRoleta, 
  aplicarEsquemaCores,
  tocarSomCliqueSintetizado,
  tocarSomVitoriaSintetizado 
} from '../utils/logicaRoleta';
import { RoletaCanvas } from './RoletaCanvas';
import { 
  Settings, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  RefreshCcw, 
  Trophy, 
  Volume2, 
  Palette, 
  Scale, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Upload
} from 'lucide-react';

export const RoletaPremios: React.FC = () => {
  // Estados da Roleta
  const [itens, setItens] = useState<ItemRoleta[]>(ITENS_PADRAO_ROLETA);
  const [tempoGiro, setTempoGiro] = useState<number>(5); // segundos
  const [anguloAtual, setAnguloAtual] = useState<number>(0);
  const [estaGirando, setEstaGirando] = useState<boolean>(false);
  const [vencedorAtual, setVencedorAtual] = useState<ItemRoleta | null>(null);
  const [historico, setHistorico] = useState<HistoricoRoleta[]>([]);

  // Estados de Customização de Cores
  const [esquemaSelecionado, setEsquemaSelecionado] = useState<string>('vibrante');

  // Estados de Áudio Customizado (Fallback para Web Audio API)
  const [audioGiroUrl, setAudioGiroUrl] = useState<string | null>(null);
  const [audioVitoriaUrl, setAudioVitoriaUrl] = useState<string | null>(null);
  const refAudioGiroInput = useRef<HTMLInputElement>(null);
  const refAudioVitoriaInput = useRef<HTMLInputElement>(null);
  const audioGiroElementRef = useRef<HTMLAudioElement | null>(null);

  // Estados de Proteção Admin e Painel
  const [painelAberto, setPainelAberto] = useState<boolean>(true);
  const [protegidoPorSenha, setProtegidoPorSenha] = useState<boolean>(false);
  const [senhaAdmin, setSenhaAdmin] = useState<string>('1234');
  const [senhaInformada, setSenhaInformada] = useState<string>('');
  const [adminAutenticado, setAdminAutenticado] = useState<boolean>(false);
  const [erroSenha, setErroSenha] = useState<string>('');

  // -------------------------------------------------------------
  // LÓGICA DE GIRO DA ROLETA
  // -------------------------------------------------------------
  const girarRoleta = () => {
    if (estaGirando || itens.length === 0) return;

    setEstaGirando(true);
    setVencedorAtual(null);

    // 1. Determina o vencedor por probabilidade ponderada
    const { itemVencedor, indiceVencedor } = sortearItemRoleta(itens);

    // 2. Cálculo dos Ângulos para alinhar com o Ponteiro no Topo (270° ou -90° radianos => 1.5 * Math.PI)
    const totalFatias = itens.length;
    const anguloPorFatia = (2 * Math.PI) / totalFatias;

    // O centro do segmento vencedor deve ficar em (1.5 * Math.PI)
    const anguloCentroFatia = (indiceVencedor + 0.5) * anguloPorFatia;
    
    // N voltas completas de rotação para criar o efeito contínuo
    const voltasCompletas = 6 + Math.floor(Math.random() * 4); 
    const anguloAlvoRelativo = (1.5 * Math.PI) - anguloCentroFatia;
    
    // Normaliza para garantir giro sempre no sentido horário
    const deltaAngulo = (voltasCompletas * 2 * Math.PI) + (anguloAlvoRelativo - (anguloAtual % (2 * Math.PI)));

    // Configuração do Áudio de Giro
    if (audioGiroUrl) {
      if (!audioGiroElementRef.current) {
        audioGiroElementRef.current = new Audio(audioGiroUrl);
      }
      audioGiroElementRef.current.currentTime = 0;
      audioGiroElementRef.current.play().catch(() => {});
    }

    const duracaoMs = tempoGiro * 1000;
    const inicioTempo = performance.now();
    let ultimoIndiceSom = -1;

    // Animação com Easing (Out-Cubic)
    const animar = (agora: number) => {
      const decorrido = agora - inicioTempo;
      const progresso = Math.min(1, decorrido / duracaoMs);

      // Função de desaceleração suave (Ease Out)
      const easeOut = 1 - Math.pow(1 - progresso, 3);
      const anguloFrame = anguloAtual + deltaAngulo * easeOut;

      setAnguloAtual(anguloFrame);

      // Toca som de clique a cada passagem de fatia caso não haja áudio customizado
      if (!audioGiroUrl) {
        const fatiaAtualIndex = Math.floor((((1.5 * Math.PI - anguloFrame) % (2 * Math.PI) + (2 * Math.PI)) % (2 * Math.PI)) / anguloPorFatia);
        if (fatiaAtualIndex !== ultimoIndiceSom) {
          ultimoIndiceSom = fatiaAtualIndex;
          tocarSomCliqueSintetizado();
        }
      }

      if (progresso < 1) {
        requestAnimationFrame(animar);
      } else {
        // Fim do giro!
        setEstaGirando(false);
        setVencedorAtual(itemVencedor);

        // Para áudio de giro customizado se estiver tocando
        if (audioGiroElementRef.current) {
          audioGiroElementRef.current.pause();
        }

        // Toca som de vitória
        if (audioVitoriaUrl) {
          const audioVitoria = new Audio(audioVitoriaUrl);
          audioVitoria.play().catch(() => {});
        } else {
          tocarSomVitoriaSintetizado();
        }

        // Registra no histórico
        const novoRegistro: HistoricoRoleta = {
          id: Date.now().toString(),
          itemTexto: itemVencedor.texto,
          cor: itemVencedor.cor,
          dataHora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setHistorico(prev => [novoRegistro, ...prev]);
      }
    };

    requestAnimationFrame(animar);
  };

  // -------------------------------------------------------------
  // GERENCIAMENTO DE ITENS E CONFIGURAÇÕES
  // -------------------------------------------------------------
  const adicionarItem = () => {
    const novoId = Date.now().toString();
    const novoItem: ItemRoleta = {
      id: novoId,
      texto: `Item ${itens.length + 1}`,
      peso: 10,
      cor: '#3b82f6'
    };
    const novaLista = [...itens, novoItem];
    setItens(aplicarPorcentagemJusta(novaLista));
  };

  const removerItem = (id: string) => {
    if (itens.length <= 1) {
      alert('A roleta deve possuir ao menos 1 item!');
      return;
    }
    const novaLista = itens.filter(item => item.id !== id);
    setItens(aplicarPorcentagemJusta(novaLista));
  };

  const atualizarItem = (id: string, campo: keyof ItemRoleta, valor: string | number) => {
    setItens(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [campo]: valor };
      }
      return item;
    }));
  };

  const handlePorcentagemJusta = () => {
    setItens(aplicarPorcentagemJusta(itens));
  };

  const handleMudarEsquemaCores = (esquemaId: string) => {
    setEsquemaSelecionado(esquemaId);
    setItens(aplicarEsquemaCores(itens, esquemaId));
  };

  // Upload de Áudio Customizado
  const handleUploadAudioGiro = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioGiroUrl(url);
      audioGiroElementRef.current = null;
    }
  };

  const handleUploadAudioVitoria = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioVitoriaUrl(url);
    }
  };

  // Autenticação Admin
  const validarSenhaAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (senhaInformada === senhaAdmin) {
      setAdminAutenticado(true);
      setErroSenha('');
    } else {
      setErroSenha('Senha incorreta! Verifique e tente novamente.');
    }
  };

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">

      {/* ========================================================= */}
      {/* COLUNA ESQUERDA: ROLETA E SORTEIO (Livre para qualquer um) */}
      {/* ========================================================= */}
      <section className="lg:col-span-7 flex flex-col items-center gap-6">
        
        {/* CONTAINER DA ROLETA */}
        <div className="relative w-full bg-slate-800/50 p-6 md:p-8 rounded-[2.5rem] border border-slate-700 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
          
          <RoletaCanvas 
            itens={itens} 
            anguloAtual={anguloAtual} 
            estaGirando={estaGirando} 
          />

          {/* Anúncio do Vencedor */}
          {vencedorAtual && !estaGirando && (
            <div className="mt-6 w-full text-center bg-slate-900/90 p-5 rounded-2xl border border-yellow-500/50 shadow-2xl animate-in fade-in zoom-in duration-300">
              <Trophy size={36} className="text-yellow-400 mx-auto mb-1 animate-bounce" />
              <span className="text-xs uppercase font-bold tracking-widest text-yellow-400">Ganhador Selecionado!</span>
              <h3 className="text-2xl md:text-3xl font-black text-white mt-1 drop-shadow-md">
                {vencedorAtual.texto}
              </h3>
            </div>
          )}
        </div>

        {/* BOTÃO GIRAR ROLETA (Sem login/senha necessário) */}
        <button
          disabled={estaGirando || itens.length === 0}
          onClick={girarRoleta}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 py-6 rounded-[2rem] text-3xl font-black shadow-xl transition-all active:scale-[0.98] uppercase tracking-tighter text-white flex items-center justify-center gap-3 cursor-pointer"
        >
          <RefreshCcw className={`${estaGirando ? 'animate-spin' : ''}`} size={32} />
          {estaGirando ? 'GIRANDO ROLETA...' : 'GIRAR ROLETA'}
        </button>

        {/* HISTÓRICO DE GANHADORES DA ROLETA */}
        <div className="w-full bg-slate-800/30 p-6 rounded-3xl border border-slate-700 h-60 flex flex-col">
          <h4 className="text-xs font-black text-slate-400 mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
            <Trophy size={16} className="text-yellow-400" /> HISTÓRICO DE PRÊMIOS SORTEADOS
          </h4>
          <div className="overflow-y-auto space-y-2 flex-1 scrollbar-hide">
            {historico.length > 0 ? (
              historico.map((h) => (
                <div key={h.id} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: h.cor }} />
                    <span className="font-bold text-slate-200">{h.itemTexto}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{h.dataHora}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 mt-8 text-sm">Nenhum prêmio sorteado na roleta ainda.</p>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* COLUNA DIREITA: PAINEL DE CONFIGURAÇÃO & REGRAS ADMIN    */}
      {/* ========================================================= */}
      <section className="lg:col-span-5 space-y-6">
        <div className="bg-slate-800/50 rounded-3xl border border-slate-700 shadow-xl overflow-hidden">
          
          {/* CABEÇALHO DO PAINEL DE CONFIGURAÇÃO */}
          <div className="p-5 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings size={20} className="text-blue-400" />
              <h2 className="font-bold text-slate-200 uppercase tracking-wider text-sm">Ajustes & Definições</h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Botão para alternar trava por senha */}
              <button 
                onClick={() => setProtegidoPorSenha(!protegidoPorSenha)}
                className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
                  protegidoPorSenha ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-700 text-slate-400 border-slate-600'
                }`}
                title={protegidoPorSenha ? "Proteção por senha ATIVADA" : "Ativar proteção por senha"}
              >
                {protegidoPorSenha ? <Lock size={14} /> : <Unlock size={14} />}
                {protegidoPorSenha ? 'Protegido' : 'Livre'}
              </button>

              {/* Botão para Minimizar / Expandir */}
              <button 
                onClick={() => setPainelAberto(!painelAberto)}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
              >
                {painelAberto ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          {/* CONTEÚDO DO PAINEL (Respeita trava por senha e minimização) */}
          {painelAberto && (
            <div className="p-6 space-y-6">

              {/* TELA DE SOLICITAÇÃO DE SENHA (Se estiver protegido e não autenticado) */}
              {protegidoPorSenha && !adminAutenticado ? (
                <form onSubmit={validarSenhaAdmin} className="space-y-4 py-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 mb-2">
                    <Lock size={24} />
                  </div>
                  <h3 className="font-bold text-slate-200 text-lg">Acesso Restrito ao Admin</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    As configurações de probabilidade, áudio e itens estão protegidas por senha.
                  </p>
                  
                  <input
                    type="password"
                    placeholder="Digite a senha..."
                    value={senhaInformada}
                    onChange={(e) => setSenhaInformada(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-center text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  {erroSenha && <p className="text-xs text-rose-400 font-bold">{erroSenha}</p>}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all"
                  >
                    DESBLOQUEAR CONFIGURAÇÕES
                  </button>
                  <p className="text-[10px] text-slate-500 italic">Dica: A senha padrão inicial é "1234"</p>
                </form>
              ) : (
                /* PAINEL LIBERADO DE AJUSTES */
                <div className="space-y-6">

                  {/* 1. TEMPO DE GIRO DA ROLETA */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2">
                      <Clock size={16} className="text-blue-400" /> Tempo de Giro: <span className="text-white text-sm font-black">{tempoGiro}s</span>
                    </label>
                    <input 
                      type="range"
                      min="2"
                      max="12"
                      value={tempoGiro}
                      onChange={(e) => setTempoGiro(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>Rápido (2s)</span>
                      <span>Médio (5s)</span>
                      <span>Longo (12s)</span>
                    </div>
                  </div>

                  {/* 2. ESQUEMAS DE CORES PRONTOS */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
                      <Palette size={16} className="text-purple-400" /> Paletas de Cores Prontas
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ESQUEMAS_CORES.map((e) => (
                        <button
                          key={e.id}
                          onClick={() => handleMudarEsquemaCores(e.id)}
                          className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                            esquemaSelecionado === e.id 
                              ? 'bg-blue-600/20 border-blue-500 text-white' 
                              : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:bg-slate-900'
                          }`}
                        >
                          <span>{e.nome}</span>
                          <div className="flex -space-x-1">
                            {e.cores.slice(0, 4).map((c, i) => (
                              <span key={i} className="w-3 h-3 rounded-full border border-slate-800" style={{ backgroundColor: c }} />
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. AUDIOS CUSTOMIZADOS (OPCIONAL) */}
                  <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-700/60 space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Volume2 size={16} className="text-emerald-400" /> Sons Personalizados (Opcional)
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Som de Giro */}
                      <div>
                        <input 
                          type="file" 
                          ref={refAudioGiroInput} 
                          onChange={handleUploadAudioGiro} 
                          accept="audio/*" 
                          className="hidden" 
                        />
                        <button 
                          onClick={() => refAudioGiroInput.current?.click()}
                          className="w-full bg-slate-800 hover:bg-slate-700 p-2.5 rounded-xl border border-slate-700 text-slate-300 flex items-center justify-center gap-2 transition-all"
                        >
                          <Upload size={14} className="text-blue-400" />
                          <span className="truncate">{audioGiroUrl ? "Giro Carregado" : "Som de Giro"}</span>
                        </button>
                      </div>

                      {/* Som de Vitória */}
                      <div>
                        <input 
                          type="file" 
                          ref={refAudioVitoriaInput} 
                          onChange={handleUploadAudioVitoria} 
                          accept="audio/*" 
                          className="hidden" 
                        />
                        <button 
                          onClick={() => refAudioVitoriaInput.current?.click()}
                          className="w-full bg-slate-800 hover:bg-slate-700 p-2.5 rounded-xl border border-slate-700 text-slate-300 flex items-center justify-center gap-2 transition-all"
                        >
                          <Upload size={14} className="text-emerald-400" />
                          <span className="truncate">{audioVitoriaUrl ? "Vitória Carregado" : "Som de Vitória"}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 4. GERENCIAMENTO DE ITENS E PORCENTAGEM JUSTA */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Itens na Roleta ({itens.length})
                      </label>
                      <button
                        onClick={handlePorcentagemJusta}
                        className="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                        title="Iguala a porcentagem de chance para todos os itens da roleta"
                      >
                        <Scale size={14} /> Porcentagem Justa
                      </button>
                    </div>

                    {/* LISTA DE ITENS */}
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-hide">
                      {itens.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                          {/* Cor do Item */}
                          <input
                            type="color"
                            value={item.cor}
                            onChange={(e) => atualizarItem(item.id, 'cor', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                            title="Escolher cor personalizada para este item"
                          />

                          {/* Nome do Item */}
                          <input
                            type="text"
                            value={item.texto}
                            onChange={(e) => atualizarItem(item.id, 'texto', e.target.value)}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder={`Item ${index + 1}`}
                          />

                          {/* Probabilidade (%) */}
                          <div className="flex items-center gap-1 bg-slate-800 px-2 py-1.5 rounded-lg border border-slate-700 w-24">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={item.peso}
                              onChange={(e) => atualizarItem(item.id, 'peso', Math.max(0, Number(e.target.value)))}
                              className="w-full bg-transparent text-right font-bold text-xs text-emerald-400 outline-none"
                            />
                            <span className="text-xs text-slate-400 font-bold">%</span>
                          </div>

                          {/* Botão Excluir */}
                          <button
                            onClick={() => removerItem(item.id)}
                            className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Remover este item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Botão Adicionar Novo Item */}
                    <button
                      onClick={adicionarItem}
                      className="w-full bg-slate-800 hover:bg-slate-700 border border-dashed border-slate-600 text-slate-300 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs transition-all"
                    >
                      <Plus size={16} /> ADICIONAR NOVO ITEM
                    </button>
                  </div>

                  {/* AJUSTE DE SENHA DO ADMIN */}
                  {protegidoPorSenha && (
                    <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                      <span>Senha de Proteção Ativa:</span>
                      <input 
                        type="text" 
                        value={senhaAdmin} 
                        onChange={(e) => setSenhaAdmin(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-mono text-white text-xs w-24"
                      />
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>
      </section>

    </div>
  );
};
