# 🧱 Backend NestJS - Desafio Técnico Devnology

Este é o backend desenvolvido com **NestJS** para o desafio técnico da **Devnology**, com foco em:

- ✅ Unificação de produtos de múltiplos fornecedores (APIs externas);
- ✅ Registro de pedidos no banco de dados;
- ✅ Autenticação segura com JWT;
- ✅ Integração com PostgreSQL (Neon) usando Prisma ORM;
- ✅ Organização modular e escalável;
- ✅ Deploy funcional em produção via **Railway**;
- ✅ Documentação automática via **Swagger** na rota padrão `/`.

---

## 🚀 Tecnologias Utilizadas

- **NestJS**
- **Prisma ORM**
- **PostgreSQL (Neon)**
- **Axios**
- **JWT + bcrypt**
- **Swagger**
- **TypeScript**
- **dotenv**
- **Railway**
- **standard-version**

---

## 📄 Documentação via Swagger

A documentação está disponível na rota raiz:

🔗 **https://backend-in8-nest-production.up.railway.app**

---

## 📦 Produtos

### 🔥 `GET /api/products`

Retorna todos os produtos unificados (br + eu). Suporta busca e filtros.

### 🔥 `GET /api/products/:id`

Retorna detalhes de um produto específico.

### 🔗 Parâmetros de Query disponíveis:

| Parâmetro     | Tipo    | Descrição                                                                          | Opcional |
| ------------- | ------- | ---------------------------------------------------------------------------------- | -------- |
| `query`       | string  | Busca texto nos campos `name`, `description`, `material`, `adjective`, `provider`. | ✅       |
| `provider`    | string  | Filtra por fornecedor. Valores: `br` ou `eu`.                                      | ✅       |
| `hasDiscount` | boolean | Filtra produtos que tenham (`true`) ou não (`false`) desconto.                     | ✅       |

### 🔍 Exemplos:

- `/api/products?query=Granite Pizza`
- `/api/products?provider=eu`
- `/api/products?hasDiscount=true`

---

## 🏷️ ProductService – ID Normalizer

IDs seguem o padrão `<PROVIDER>-<ID>`, exemplo: `BR-1` ou `EU-20`.

---

## 🖼️ Proxy de Imagens

### `GET /api/images/proxy?url=https://...`

Serve imagens externas via proxy.

---

## 🔐 Autenticação

### `POST /api/auth/register`

```json
{
  "name": "Murilo",
  "email": "murilo@email.com",
  "password": "123456"
}
```

### `POST /api/auth/login`

```json
{
  "email": "murilo@email.com",
  "password": "123456"
}
```

---

## 📜 Pedidos

### `GET /api/orders` → Lista pedidos (JWT)

### `POST /api/orders` → Cria pedido

```json
{
  "userId": 1,
  "amount": 250.75,
  "currency": "BRL",
  "products": [{ "id": "br-1", "quantity": 2 }],
  "address": {
    "line1": "Av. Brasil, 1000",
    "city": "São Paulo",
    "state": "SP",
    "zip": "00000-000",
    "country": "Brasil"
  }
}
```

### `POST /api/orders/:id/payment` → Confirma pagamento

---

## 💳 Checkout (Mock)

### `POST /api/checkout`

```json
{
  "orderId": 1,
  "amount": 250.75
}
```

---

## 🔗 Status dos Pedidos

- `"PENDING"` → Aguardando pagamento
- `"CONFIRMED"` → Confirmado
- `"CANCELLED"` → Cancelado

O backend aceita status em **português**, **inglês** e qualquer **case**.

---

## ⚙️ Rodar Localmente

```bash
git clone https://github.com/4snt/backend-in8-nest.git
cd backend-in8-nest
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

---

## ☁️ Deploy

🔗 Railway: https://backend-in8-nest-production.up.railway.app

---

## 🔐 Header JWT

```
Authorization: Bearer <seu_token_aqui>
```

---

## 👨‍💻 Autor

Desenvolvido por **Murilo Santiago** para o desafio técnico da **Devnology**.
