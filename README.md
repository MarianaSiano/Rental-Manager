# Rental Manager

Este é um sistema de gerenciamento de aluguel de produtos parados, contruído com React (frontend) e Node.js/Express (Backend), utilizando SQLite para persistência de dados.

## Como rodar o projeto na sua máquina local

Siga os passos abaixo para configurar e executar o projeto.

### 1. Pré-requisitos

Certifique-se de ter o **Node.js** (versão 18 ou superior) instalado na sua máquina. Você pode baixar em [nodejs.org](https://nodejs.org/).

### 2. Instalação das Dependências

Abra o terminal na pasta raiz do projeto e execute o sequinte comando para instalar todas as bibliotecas necessárias (incluindo o `node_modules`):

```bash
npm install
```

### 3. Executando o Projeto em Modo de Desenvolvimento

Para iniciar o servidor de backend e o frontend simultaneamente, utilize o comando:

```bash
npm run dev
```

O projeto estará disponível em: [http://localhost:3000](http://localhost:3000)

### 4. Estrutura do Projeto

- `server.ts`: O servidor backend Express que gerencia as rotas da API e a conexão com o banco de dados SQLite;
- `database.sqlite`: Arquivo criado automaticamente pelo servidor para armazenar os dados de forma persistente;
- `src/App.tsx`: O componente principal do frontend;
- `src/types.ts`: Definições de tipos TypeScript para usuários, jalecos e aluguéis.

### 5. Funcionalidades

- **Login Simulado:** Escolha entre "Aluno" ou "Admin";
- **Aluguel:** Alunos podem alugar jalecos por duas horas;
- **Pagamento:** Controle de sinal de 50% na retirada e 50% na devolução;
- **Persistência:** Os dados são salvos no arquivo `database.sqlite`, então não serão perdidos ao reiniciar o servidor.