# 📖 Guia do Usuário: Sorteador Pro

Bem-vindo ao **Sorteador Pro**! Uma aplicação web moderna, rápida e 100% autônoma (*offline-first*), projetada para realizar sorteios transparentes, aleatórios e visualmente atraentes em eventos, transmissões, salas de aula, reuniões e promoções.

---

## 🚀 Como Usar a Aplicação

No topo da página, você encontra a **Navegação por Abas** para alternar entre as duas ferramentas principais:
* 🎯 **Sorteador de Nomes**
* 🎡 **Roleta de Prêmios**

> 💡 **Dica de Personalização:** Clique sobre o ícone ou título no cabeçalho superior para carregar o seu próprio **Logotipo personalizado**.

---

## 🎯 1. Sorteador de Nomes

Esta modalidade é ideal para sortear pessoas a partir de uma lista de participantes.

### Passo a Passo:
1. **Cole a Lista de Nomes:**
   - Na caixa de texto à esquerda, digite ou cole os nomes dos participantes.
   - Você pode separar os nomes por **quebra de linha (Enter)**, **vírgula (,)** ou **ponto e vírgula (;)**.
2. **Carregar Nomes:**
   - Clique em **`CARREGAR NOMES`**. O sistema informará quantos nomes válidos foram identificados e prontos para o sorteio.
3. **Definir Quantidade por Sorteio:**
   - Escolha quantas pessoas devem ser sorteadas por rodada (ex: 1, 2, 5 pessoas).
4. **Realizar o Sorteio:**
   - Clique no grande botão verde **`SORTEAR AGORA`**.
   - O visor principal exibirá uma animação de suspense e revelará os vencedores da rodada.
5. **Sem Repetições:**
   - Cada pessoa sorteada é automaticamente removida da urna disponível para garantir que ninguém ganhe duas vezes na mesma sessão.
6. **Reiniciar:**
   - Para devolver todos os nomes de volta à urna e refazer os sorteios do zero, clique em **`REINICIAR`**.
7. **Histórico:**
   - Todos os nomes sorteados ficam registrados no painel inferior de histórico em ordem cronológica.

---

## 🎡 2. Roleta de Prêmios

Esta modalidade permite criar e girar uma roleta interativa visual de itens ou prêmios com chances configuráveis.

### 🎮 Girando a Roleta (Uso Livre)
* **Qualquer pessoa pode girar:** Não é necessário fazer login nem digitar senha para girar a roleta.
* Clique no botão **`GIRAR ROLETA`**. A roleta girará com animação física e efeito sonoro até parar no item vencedor apontado pelo ponteiro no topo.
* O prêmio sorteado será destacado no visor e adicionado ao histórico.

---

### ⚙️ Painel de Ajustes & Definições

No lado direito (ou abaixo da roleta, no modo Tela Cheia), você encontra o painel de configuração da roleta.

#### 🔒 1. Trava de Proteção por Senha (Modo Admin)
* **Livre / Protegido:** Clique no botão no topo do painel para alternar entre o modo *Livre* (qualquer um pode editar as configurações) e *Protegido* (exige senha de admin para visualizar e editar os ajustes).
* **Bloqueio Automático:** Se a proteção por senha estiver ativa e o painel for minimizado, ao tentar expandi-lo novamente será solicitada a senha de administrador.
* **Senha Padrão Inicial:** `1234`.

#### 🖼️ 2. Exibição & Layout
* **Modo Tela Cheia:** Centraliza a roleta no meio da tela para apresentações em data show ou transmissões ao vivo.
* **Histórico Visível / Oculto:** Permite mostrar ou esconder a lista de prêmios sorteados.

#### ⏱️ 3. Tempo de Giro
* Deslize a barra para definir a duração da rotação da roleta antes de escolher o vencedor (entre **2 e 12 segundos**).

#### 🎨 4. Paletas de Cores Prontas e Cores Individuais
* Escolha entre esquemas visuais prontos (*Vibrante Neon*, *Luxo & Ouro*, *Pastel Soft*, *Synthwave 80s*, *Natureza & Menta*).
* Você também pode clicar na caixinha de cor ao lado de cada item para definir uma cor personalizada.

#### 🎵 5. Sons Personalizados (Opcional)
* Envie seus próprios arquivos de áudio para o **Som de Giro** da roleta e o **Som de Vitória**.
* *(Caso nenhum arquivo seja enviado, o sistema utiliza efeitos sonoros sintéticos nativos 100% offline).*

#### 📊 6. Gerenciamento de Itens e Probabilidades (%)
* **Adicionar / Remover Itens:** Clique em `ADICIONAR NOVO ITEM` ou no ícone da lixeira para gerenciar os itens.
* **Redistribuição Automática de Probabilidade (100%):**
  - Ao alterar o peso/porcentagem (%) de um item, o saldo restante para 100% é dividido igualmente entre todos os outros itens em tempo real.
  - *Exemplo:* Se definir um item com **50%**, os 50% restantes serão automaticamente divididos entre os demais itens.
* **Botão "Porcentagem Justa":** Recalcula a porcentagem para que todos os itens tenham exatamente a mesma chance.

#### 🔑 7. Alterar Senha de Admin
* No final do painel desbloqueado, digite uma nova senha no campo **"Alterar Senha de Admin"** e clique em **`Salvar Senha`**.

---

## 💾 Funcionamento 100% Offline (Modo Pendrive)

O **Sorteador Pro** foi desenvolvido para funcionar sem conexão com a internet. O arquivo compilado (`dist/index.html`) pode ser copiado para um pendrive e executado em qualquer computador clicando duas vezes sobre o arquivo HTML!
