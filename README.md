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

# 🗂️ ProductService – ID Normalizer

## 🏷️ O que é?

O ID Normalizer é uma convenção implementada no `ProductService` para garantir que todos os produtos tenham um identificador único e padronizado, independentemente do fornecedor (BR ou EU).

## 🎯 Formato do ID

O ID segue o padrão:

```
<PROVIDER>-<ID>
```

- `PROVIDER`: indica a origem do produto, podendo ser:
  - `BR` → Produtos do fornecedor brasileiro.
  - `EU` → Produtos do fornecedor europeu.
- `ID`: é o identificador original do produto, vindo da API de cada fornecedor.

## 🧠 Exemplos práticos

| Fornecedor | ID Original | ID Normalizado |
| ---------- | ----------- | -------------- |
| Brasil     | 1           | BR-1           |
| Europa     | 42          | EU-42          |
| Brasil     | 99          | BR-99          |

## 🔧 Uso interno

- ✅ Todos os métodos do `ProductService` recebem e retornam produtos com o ID no formato normalizado (`BR-1`, `EU-42`, etc.).
- ✅ Métodos como `findAll()` e `findOne()` utilizam esse padrão tanto na resposta quanto no parâmetro de entrada.
- ✅ O método `parseProductId()` é utilizado para quebrar o ID e determinar:
  - De qual fornecedor (`provider`) vem.
  - Qual é o ID original (`rawId`) a ser consultado na API externa.

## 🔍 Funcionamento

### 🔗 Exemplo de requisição:

`GET /api/products/BR-5` → retorna o produto `id=5` do fornecedor do Brasil.  
`GET /api/products/EU-20` → retorna o produto `id=20` do fornecedor da Europa.

## Por que usar?

- ✅ Evita conflitos de IDs entre fornecedores diferentes.
- ✅ Facilita integrações, filtros, buscas e navegação.
- ✅ Deixa claro na API de onde vem cada produto.
- ✅ Melhora a manutenção e a escalabilidade do sistema.

## 📜 Exemplo de resposta no GET `/api/products`

```json
{
  "id": "BR-5",
  "name": "Awesome Steel Pizza",
  "description": "Boston's most advanced compression wear technology increases muscle oxygenation...",
  "category": "Small",
  "price": 32.0,
  "images": ["https://seu-backend.com/api/images/awesome-steel-pizza.png"],
  "provider": "br",
  "hasDiscount": false,
  "discountValue": 0
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
