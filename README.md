# Rental Manager

Este é um sistema de gerenciamento de aluguel multisuporte, construído com React (Frontend) e Node.js/Express (Backend), utilizando SQLite para persistência de dados.

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

- `server.ts`: O servidor backend Express que gerencia as rotas da API e a conexão com o banco de dados SQLite.

- `database.sqlite`: Arquivo criado automaticamente pelo servidor para armazenar os dados de forma persistente.

- `src/App.tsx`: O componente principal do frontend em React.

- `src/types.ts`: Definições de tipos TypeScript para usuários, produtos e aluguéis.

### 5. Funcionalidades

- **Login Simulado**: Escolha entre "Aluno" ou "Admin".

- **Aluguel de Produtos**: Suporta diversos tipos de produtos (EPIs, equipamentos, vestuário).

- **Regras de Devolução Flexíveis**:
  - **Duração Normal**: Aluguéis padrão de 2 horas.
  - **Regra Noturna (19h-21h)**: Aluguéis realizados de Segunda a Quinta à noite devem ser devolvidos no próximo dia útil conforme o **horário configurado** pelo administrador.

- **Painel Administrativo**:
  - **Configurações Gerais**: Admins podem definir o horário padrão de devolução, o local de retirada (ex: Laboratório 102) e o rótulo do semestre vigente.
  - **Gestão de Usuários**: Apenas administradores podem cadastrar novos alunos.

- **Pagamento**: Controle de sinal de 50% na retirada e 50% na devolução.

- **Persistência**: Os dados são salvos no arquivo `database.sqlite`.