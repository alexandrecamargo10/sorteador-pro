# 🏆 Sorteador Pro - Sorteios Inteligentes & Offline

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

O **Sorteador Pro** é uma aplicação web moderna, rápida e resiliente, focada em entregar sorteios aleatórios com uma experiência visual cinematográfica.

---

## 🛠️ Parte 1: Necessidades e Tecnologias

### Por que este projeto existe?
Este software foi desenvolvido para resolver problemas críticos em eventos e dinâmicas:
- **Resiliência Offline:** Uma das maiores necessidades era que a ferramenta funcionasse em locais sem qualquer acesso à internet (subsolos, centros de convenções isolados ou eventos externos). Uma vez carregado, o Sorteador Pro não depende de servidores externos para processar os nomes.
- **Segurança de Dados:** Os nomes inseridos não são enviados para nenhum banco de dados externo; tudo acontece na memória local do navegador.
- **Identidade Visual (White Label):** A capacidade de alterar o logotipo permite que a ferramenta seja personalizada para diferentes marcas em segundos.

### Tecnologias
- **React + TypeScript:** Para uma interface reativa e código livre de erros de tipagem.
- **Tailwind CSS:** Para estilização rápida, garantindo que o app seja leve.
- **Vite:** O motor de construção que permite uma compilação ultra-otimizada.

---

## 📖 Parte 2: Guia do Usuário

1. **Inserção:** Digite os nomes na caixa de texto.
2. **Preparação:** Clique em **"Preparar Sorteio"** (isso organiza a lista na memória).
3. **Sorteio:** Escolha a quantidade de ganhadores e clique no botão principal.
4. **Customização:** Passe o mouse no ícone superior para trocar o logo pela imagem da sua empresa.

---

## 💻 Parte 3: Como executar para Desenvolvimento

Se você é um desenvolvedor e quer modificar o código:

1. **Clonar:** `git clone https://github.com/seu-usuario/sorteador-pro.git`
2. **Instalar:** `npm install` (requer Node.js instalado)
3. **Rodar:** `npm run dev`
4. **Acessar:** `http://localhost:5173` no navegador.

---

## 📦 Parte 4: Como Compilar para Uso Permanente (Sem CMD)

Se você quer gerar uma versão que pode ser levada em um **Pen Drive** e aberta em qualquer computador sem precisar instalar nada ou digitar comandos, siga este passo a passo:

### 1. Gerar o Pacote de Distribuição
No terminal do seu projeto, execute o comando:
`npm run build`

### 2. O que acontece agora?
O Vite criará uma pasta chamada dist na raiz do seu projeto.

Esta pasta contém tudo o que o site precisa: HTML, CSS e JavaScript otimizados.

Ela é o produto final.