# 🧱 Backend NestJS - Desafio Técnico Devnology

Este é o backend desenvolvido com **NestJS** para o desafio técnico da **Devnology**, com foco em:

- Unificação de produtos de múltiplos fornecedores (APIs externas);
- Registro de pedidos no banco de dados;
- Autenticação segura com JWT;
- Integração com PostgreSQL (via Neon) usando Prisma ORM;
- Organização modular e escalável para futuros recursos como checkout real com Stripe;
- Deploy funcional em produção via **Railway**;
- Versionamento de releases com `standard-version`.

---

## 🚀 Tecnologias Utilizadas

- **NestJS** (framework principal)
- **Prisma ORM** (modelagem e acesso a dados)
- **PostgreSQL** (Neon como banco em nuvem)
- **Axios** (integração com fornecedores externos)
- **JWT + bcrypt** (autenticação segura)
- **TypeScript** (tipagem robusta)
- **dotenv** (variáveis de ambiente)
- **Railway** (deploy automático com GitHub)
- **standard-version** (versionamento semântico de releases)

---

## 📂 Estrutura do Projeto

```
backend-in8-nest/
├── src/
│   ├── auth/          # Autenticação (JWT, login, registro, guard)
│   ├── products/      # Produtos unificados (fetch externo)
│   ├── orders/        # Registro de pedidos
│   ├── checkout/      # Mock de integração de pagamento
│   ├── image/         # Proxy de imagens externas
│   ├── prisma/        # PrismaService (client wrapper)
│   └── main.ts        # Bootstrap da aplicação Nest
├── prisma/
│   └── schema.prisma  # Modelo de dados Prisma
├── .env               # Variáveis de ambiente
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

Retorna todos os produtos unificados (br + eu). Suporta busca e filtros.

### `GET /api/products/:id`

Retorna detalhes de um produto específico.

### 🔗 Parâmetros de Query disponíveis:

| Parâmetro     | Tipo    | Descrição                                                                                                               | Opcional |
| ------------- | ------- | ----------------------------------------------------------------------------------------------------------------------- | -------- |
| `query`       | string  | Texto para busca nos campos `name`, `description`, `material`, `adjective`, `provider`. Pode conter múltiplas palavras. | ✅       |
| `provider`    | string  | Filtra por fornecedor. Valores: `br` ou `eu`.                                                                           | ✅       |
| `hasDiscount` | boolean | Filtra produtos que tenham (`true`) ou não (`false`) desconto.                                                          | ✅       |

### 🔍 Exemplos práticos:

- `GET /api/products?query=Granite Pizza`
- `GET /api/products?provider=eu`
- `GET /api/products?hasDiscount=true`
- `GET /api/products?query=Plastic Shoes&provider=br&hasDiscount=true`

---

## 🖼️ Proxy de Imagens

### `GET /api/images/proxy`

Serve imagens externas via proxy.  
**Query param:** `url` (obrigatório)

Exemplo:

```
/api/images/proxy?url=https://loremflickr.com/640/480/city
```

---

## 🧾 Pedidos

### `GET /api/orders`

Lista pedidos (protegido com JWT).

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

Mock de checkout.

```json
{
  "orderId": 1,
  "amount": 250.75
}
```

---

## ⚙️ Como Rodar Localmente

```bash
git clone https://github.com/4snt/backend-in8-nest.git
cd backend-in8-nest

npm install
npx prisma generate
npx prisma db push

npm run start:dev
```

---

## ☁️ Deploy em Produção

Deploy feito na Railway.  
🔗 https://backend-in8-nest-production.up.railway.app

---

## 🔐 Proteção de Rotas

JWT via header:

```
Authorization: Bearer <token>
```

---

## 👨‍💻 Autor

Desenvolvido por **Murilo Santiago** como parte do desafio técnico Fullstack da **Devnology**.
