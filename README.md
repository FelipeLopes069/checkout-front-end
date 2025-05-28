# Painel de Vendas - Frontend

Frontend do sistema de vendas com painel moderno, controle de produtos e pedidos.

## 🚀 Tecnologias

- Next.js 13+ (App Router)
- React
- Axios
- CSS Puro
- React Icons

## 📦 Instalação

```bash
git clone https://github.com/FelipeLopes069/checkout-front-end.git
cd fcheckout-front-end
npm install
# ou
yarn install
```



## ▶️ Rodando o projeto

```bash
npm run dev
# ou
yarn dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura de Pastas

```
src/
├── app/
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── produtos/
│   ├── pedidos/
│   ├── buy/[uuid]/
│   └── order/[uuid]/
├── api/
├── components/
├── lib/
├── styles/
```

## ✅ Funcionalidades

- Registro e login com JWT
- Painel do vendedor com métricas
- CRUD de produtos com imagem
- Criação de pedidos manuais
- Link público para vendas
- Visualização de pedidos
- Recuperação de senha por e-mail

## ✅ Requisitos

- Node.js 18+
- Backend rodando na porta 5000 (ou outra definida no `.env.local`)