# Rental Manager (React + Node)

Este é um sistema completo e versátil de **gerenciamento de aluguéis multisuporte**, projetado para controlar a reserva e devolução de qualquer tipo de item, como **jalecos, tecnologia e materiais diversos** . O projeto utiliza uma pilha moderna com **React** no frontend e **Node.js/Express** no backend, com persistência real em **SQLite**.

## 🚀 Tecnologias e Frameworks

### Frontend (React.js)

- **Vite:** Ferramenta de build ultra-rápida para o React;
- **Tailwind CSS:** Estilização moderna e responsiva via classes utilitárias;
- **Lucide React:** Biblioteca de ícones versátil para interfaces limpas;
- **Motion:** Biblioteca para animações fluidas e transições de estado.

### Backend (Node.js)

- **Express:** Framework para criação de rotas e APIs robustas;
- **SQLite:** Banco de dados relacional leve que armazena dados localmente (`database`);
- **Nodemailer:** Automação de lembretes por e-mail para devolução de itens;
- **TSX:** Executor de TypeScrit para rodar o código do servidor sem compilação prévia.

## 🛠️ Guia: Como Estruturar uma Aplicação Full-Stack

Este projeto foi construído do zero seguindo as melhores práticas de integração:

### 1. Inicializar o Ambiente Node

Crie seu diretório e inicie o projeto:

```bash
npm init -y
```

### 2. Configurar o Frontend (Vite + React)

```bash
npm install vite @vitejs/plugin-react -D
npm install react react-dom
```

### 3. Configurar o Backend e Banco de Dados

```bash
npm install express sqlite3 sqlite nodemailer
npm install tsx @types/express @types/nodemailer @types/node -D
```

### 4. Integração

Diferente de rodar dois servidores separados, este projeto usa o **Vite como Middleware** dentro do Express. Isso permite que um único processo gerencie a API e sirva os arquivos estáticos do frontend.