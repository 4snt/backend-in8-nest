# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.2](https://github.com/4snt/backend-in8-nest/compare/v0.2.1...v0.2.2) (2025-06-17)


### Bug Fixes

* **tsconfig:** correção ([befb5d9](https://github.com/4snt/backend-in8-nest/commit/befb5d963c5b26b2a4fdfdca9029fe65518ad4c9))

### [0.2.1](https://github.com/4snt/backend-in8-nest/compare/v0.2.0...v0.2.1) (2025-06-17)


### Features

* **deploy:** automatização por github actions do raiway ([77827dd](https://github.com/4snt/backend-in8-nest/commit/77827dddef206ee87135eb634049da27d8e03b7a))

## [0.2.0](https://github.com/4snt/backend-in8-nest/compare/v0.1.1...v0.2.0) (2025-06-17)


### ⚠ BREAKING CHANGES

* **products:** Necessário garantir que a chave PIXABAY_API_KEY esteja configurada no arquivo .env
* **products:** Remove suporte à Pexels API. É necessário adicionar PIXABAY_API_KEY no arquivo .env para funcionamento em produção.

### Features

* **config:** adiciona suporte a cookies e cors dinâmico via .env ([ee67214](https://github.com/4snt/backend-in8-nest/commit/ee67214190dc185ae5f20996f1afeb892b5661a2))
* **image:** create universal image proxy handler ([e86a818](https://github.com/4snt/backend-in8-nest/commit/e86a8189752297afcdc2c6346839c6176f2db8b6))
* **image:** create universal image proxy handler ([caec7d5](https://github.com/4snt/backend-in8-nest/commit/caec7d5a1a8bd811965cf9407607c4096693c484))
* **images:** implementa fallback automático de placeimg.com para loremflickr.com no proxy de imagens ([db3323e](https://github.com/4snt/backend-in8-nest/commit/db3323edc146d54eaaa4033e113b3a1737c1117a))
* **images:** implementa fallback automático de placeimg.com para loremflickr.com no proxy de imagens ([7e27408](https://github.com/4snt/backend-in8-nest/commit/7e2740894b53b1918159a33699ef230e1299f835))
* **images:** implementa fallback automático de placeimg.com para loremflickr.com no proxy de imagens ([d458b2f](https://github.com/4snt/backend-in8-nest/commit/d458b2ffe9b01498ccb03251d087e08e7db4a0a8))
* **payment:** integração com Stripe Checkout e criação do módulo de pagamentos ([342c004](https://github.com/4snt/backend-in8-nest/commit/342c004729c0e381ae8ddeee01c3db5056168370))
* **products:** add random image variation with loremflickr ([e7b173d](https://github.com/4snt/backend-in8-nest/commit/e7b173df36b1c8e51d22d190c16b986af3b6c049))
* **products:** add random image variation with loremflickr ([9babdd2](https://github.com/4snt/backend-in8-nest/commit/9babdd2e1be9c818efd9b8a6d23ba15fd98ad3ef))
* **products:** adicionar filtros avançados e busca textual ([690c08a](https://github.com/4snt/backend-in8-nest/commit/690c08a1b44817eb22a70e2c3aa404d8030c26db))
* **products:** implement image fetch with Pixabay API ([ba136de](https://github.com/4snt/backend-in8-nest/commit/ba136dee2c4ba26341eac13c651858c5f0f624ce))
* **products:** implementa id normalizer e atualiza documentação ([b621734](https://github.com/4snt/backend-in8-nest/commit/b621734cc64b8b97b564348406f8d82d9260a69d))
* **products:** try to generate dockfile new ([72770d1](https://github.com/4snt/backend-in8-nest/commit/72770d1adc971c8ff54d1ff3f770f74143de558a))


### Bug Fixes

* **appmodules:** inclusão do Payment no appmodules ([6f2dce0](https://github.com/4snt/backend-in8-nest/commit/6f2dce09d89206f8e98b0c838bdd9a3c225fdbf2))
* **aut.controller:** corrção da rota me ([95d1643](https://github.com/4snt/backend-in8-nest/commit/95d16430fccffbbcd49f3c57b8a716884abecc59))
* **main:** agora o cors aceita multiplas origens de appurl ([6aa3c8e](https://github.com/4snt/backend-in8-nest/commit/6aa3c8e5f944fe4864a6c9e77cd8cb7e8b1587f0))
* **payment:** corrige erro de tipagem no uso de products como array no Stripe Checkout ([c29002c](https://github.com/4snt/backend-in8-nest/commit/c29002c7b4918140a0f9fbae16f8b0aad014c069))
* **product.service:** normaliza a imagem e passa pelo proxy para o front em nextjs ([f9080cf](https://github.com/4snt/backend-in8-nest/commit/f9080cf2454a1f6d2d95f45845401169b7bd57e7))
* **products:** ajusta normalização dos dados da API brasileira ([c3709ff](https://github.com/4snt/backend-in8-nest/commit/c3709ff64d06f4302cf63a661f046dc8fb247158))
* **proxy:** correção do nome imagecontroller ([3c53184](https://github.com/4snt/backend-in8-nest/commit/3c5318461a2bfa59bcf6e89f909d85cc265b2202))
* **proxy:** handle external image fetch with fallback and error logging ([3c84dfb](https://github.com/4snt/backend-in8-nest/commit/3c84dfb277d8210df3813c9b505d08d56e4cc363))


* **products:** move image processing to helper and clean normalization logic ([26f19c0](https://github.com/4snt/backend-in8-nest/commit/26f19c04ae88ba55e7b629345bb8368d9d1d6c65))

### [0.1.1](https://github.com/4snt/backend-in8-nest/compare/v0.1.0...v0.1.1) (2025-06-13)


### Bug Fixes

* **main, package:** corrijdo parametro start em scripts package.json para funcionamento no raiway ([ee98942](https://github.com/4snt/backend-in8-nest/commit/ee98942edb617a308d5556f8ef935a7d68222ee8))
* **main, package:** corrijdo parametro start em scripts package.json para funcionamento no raiway ([7df6b5c](https://github.com/4snt/backend-in8-nest/commit/7df6b5c89af0c6f6f14da461aaec0949b8ee3ecc))
* **main:** corre"cão dos parametros do server para testar em prod ([c5191a9](https://github.com/4snt/backend-in8-nest/commit/c5191a95e0b2d70545d6ef9cc18246a4aa270af7))
* **main:** correção da tipagem do process env port ([0b2629f](https://github.com/4snt/backend-in8-nest/commit/0b2629fbd0798c6f4f970a9c976f3465a1bb21ab))
* **main:** correção da tipagem do process env port ([139e17d](https://github.com/4snt/backend-in8-nest/commit/139e17dd3fe5c162c1b630ffca1f187428ce38c9))
* **main:** correção da tipagem do process env port ([a3f6d5f](https://github.com/4snt/backend-in8-nest/commit/a3f6d5ff1eb16ca73709ef34220a991414311230))
* **main:** correção da tipagem do process env port ([fe7ac72](https://github.com/4snt/backend-in8-nest/commit/fe7ac724531af38bc3b2b81b172b6cf8973d1d6e))

## [0.1.0](https://github.com/4snt/backend-in8-nest/compare/v0.0.2...v0.1.0) (2025-06-13)


### Bug Fixes

* **modules:** adiciona JwtModule aos módulos de orders e checkout para resolver dependência do AuthGuard ([d86f90b](https://github.com/4snt/backend-in8-nest/commit/d86f90bb80780961bc7ec43dfdcd2e88acc15364))

### [0.0.2](https://github.com/4snt/backend-in8-nest/compare/v1.0.0...v0.0.2) (2025-06-13)
