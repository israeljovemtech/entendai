# ENTENDAI

Aplicacao simples em Cloudflare Pages que usa Pages Functions e Workers AI para explicar termos, perguntas e ideias em portugues do Brasil.

O usuario escolhe um modo de explicacao, envia um texto pela interface web e recebe uma resposta curta gerada por IA.

## Recursos

- Interface estatica em HTML, CSS e JavaScript.
- API serverless com Cloudflare Pages Functions.
- Integracao com Workers AI pelo binding `AI`.
- Modos de explicacao: crianca, iniciante, tecnico, resumo e exemplo pratico.
- Respostas em portugues do Brasil com limite curto de palavras.

## Estrutura

```text
.
+-- functions/
|   +-- api/
|       +-- explicar.js      # Rota POST /api/explicar
+-- public/
|   +-- index.html           # Interface da aplicacao
+-- package.json             # Scripts do projeto
+-- wrangler.jsonc           # Configuracao do Cloudflare Pages/Workers AI
+-- README.md
```

## Requisitos

- Node.js e npm instalados.
- Conta Cloudflare com acesso a Pages e Workers AI.

## Como rodar localmente

Instale as dependencias:

```bash
npm install
```

Inicie o ambiente local do Cloudflare Pages:

```bash
npm run dev
```

Depois, acesse a URL exibida pelo Wrangler no terminal.

## Scripts

```bash
npm run build
```

Verifica se `public/index.html` existe.

```bash
npm run dev
```

Roda o projeto localmente com `wrangler pages dev public --ai AI`.

```bash
npm run deploy
```

Publica o diretorio `public` no Cloudflare Pages usando o projeto `entendai`.

## API

### `POST /api/explicar`

Recebe um termo ou pergunta e retorna uma explicacao gerada por IA.

Exemplo de corpo da requisicao:

```json
{
  "termo": "o que e computacao em nuvem?",
  "modo": "iniciante"
}
```

Exemplo de resposta:

```json
{
  "resposta": "Computacao em nuvem e usar computadores e servicos pela internet..."
}
```

Modos aceitos:

- `crianca`
- `iniciante`
- `tecnico`
- `resumo`
- `exemplo pratico`

Quando o modo enviado e invalido ou ausente, a API usa `iniciante`.

## Configuracao Cloudflare

O arquivo `wrangler.jsonc` define:

```jsonc
{
  "name": "entendai",
  "pages_build_output_dir": "./public",
  "compatibility_date": "2026-07-05",
  "ai": {
    "binding": "AI"
  }
}
```

A funcao `functions/api/explicar.js` acessa o binding por `context.env.AI` e usa o modelo `@cf/meta/llama-3.2-3b-instruct`.

Se alterar bindings no `wrangler.jsonc`, gere novamente os tipos do Wrangler:

```bash
npx wrangler types
```

## Deploy

Para publicar no Cloudflare Pages:

```bash
npm run deploy
```

O deploy usa:

```bash
wrangler pages deploy public --project-name entendai
```

## Observacoes

- A aplicacao nao possui etapa de build complexa; os arquivos estaticos ficam em `public/`.
- A rota da API aceita apenas requisicoes `POST`.
- Erros de validacao retornam status `400`.
- Falhas ao gerar resposta retornam status `500` com uma mensagem generica para o usuario.
