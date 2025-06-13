# 🧱 Backend NestJS - Desafio Técnico Devnology

Este é o backend desenvolvido com **NestJS** para o desafio técnico da **Devnology**, com foco em:

- Unificação de produtos de múltiplos fornecedores (APIs externas);
- Registro de pedidos no banco de dados;
- Autenticação segura com JWT;
- Integração com PostgreSQL (via Neon) usando Prisma ORM;
- Organização modular e escalável para futuros recursos como checkout real com Stripe.

---

## 🚀 Tecnologias Utilizadas

- **NestJS** (framework principal)
- **Prisma ORM** (modelagem e acesso a dados)
- **PostgreSQL** (Neon como banco em nuvem)
- **Axios** (integração com fornecedores externos)
- **JWT + bcrypt** (autenticação segura)
- **TypeScript** (tipagem robusta)
- **dotenv** (variáveis de ambiente)
- **Vercel** (compatível com funções serverless)

---

## 📂 Estrutura do Projeto

```
backend-in8-nest/
├── src/
│   ├── auth/                # Autenticação (JWT, login, registro, guard)
│   ├── products/            # Produtos unificados (fetch externo)
│   ├── orders/              # Registro de pedidos
│   ├── checkout/            # Mock de integração de pagamento
│   ├── prisma/              # PrismaService (client wrapper)
│   └── main.ts              # Bootstrap da aplicação Nest
├── prisma/
│   └── schema.prisma        # Modelo de dados Prisma
├── .env                     # Variáveis de ambiente
├── package.json
└── README.md
```

---

## 🔐 Autenticação

### `POST /api/auth/register`

Registra um novo usuário.

```json
{
  "name": "Murilo",
  "email": "murilo@email.com",
  "password": "123456"
}
```

### `POST /api/auth/login`

Autentica um usuário e retorna o token JWT.

```json
{
  "email": "murilo@email.com",
  "password": "123456"
}
```

---

## 📦 Produtos

### `GET /api/products`

Retorna todos os produtos unificados (br + eu).

### `GET /api/products/:id`

Retorna detalhes de um produto específico.

---

## 🧾 Pedidos

### `GET /api/orders`

Lista os pedidos registrados. **(Protegido por JWT)**

### `POST /api/orders`

Cria um novo pedido.

```json
{
  "userId": 1,
  "amount": 250.75,
  "currency": "BRL",
  "status": "PENDING",
  "paymentIntentId": "pi_demo_123",
  "products": [{ "id": "br-1", "quantity": 2 }],
  "address": {
    "street": "Av. Brasil, 1000",
    "city": "São Paulo"
  }
}
```

---

## 💳 Checkout

### `POST /api/checkout`

Simula a criação de uma sessão de pagamento (exemplo para futura integração com Stripe).

```json
{
  "orderId": 1,
  "amount": 250.75
}
```

---

## ⚙️ Como Rodar Localmente

1. **Clonar o repositório:**

```bash
git clone https://github.com/seu-usuario/backend-in8-nest.git
cd backend-in8-nest
```

2. **Instalar dependências:**

```bash
npm install
```

3. **Gerar o client do Prisma e aplicar o schema:**

```bash
npx prisma generate
npx prisma db push
```

4. **Rodar a aplicação:**

```bash
npm run start:dev
```

---

## ✉️ Observações

- Todas as rotas principais (exceto login e registro) são protegidas por **JWT AuthGuard**;
- Os produtos são mockados via Axios;
- O checkout é simulado — pronto para futura integração com gateways reais.

---

## 👨‍💻 Autor

Desenvolvido por **Murilo Santiago** como parte do desafio técnico Fullstack da **Devnology**.
