# SkyCheck

App de tempo/temperatura para qualquer localização, usando a API pública e
gratuita da [Open-Meteo](https://open-meteo.com/) — sem chave de API, sem
conta, sem backend próprio.

## Ideia

- Pesquisa de cidade (geocoding) ou botão "usar a minha localização"
  (Geolocation API do browser).
- Tempo atual (temperatura, sensação térmica, humidade, vento) e previsão
  para os próximos 5 dias.
- Toggle °C / °F.
- Pesquisas recentes guardadas localmente para acesso rápido.
- Interface disponível em português (PT-PT), inglês e alemão — inclui os
  nomes das condições meteorológicas (`src/data/weatherCodes.ts`).
- 100% client-side: os pedidos à Open-Meteo são feitos diretamente do
  browser, sem servidor próprio nem chave secreta a proteger.

## Porque Open-Meteo

Ao contrário da maioria das APIs de tempo, a Open-Meteo não exige registo
nem chave de API — o que permite manter esta app como as outras do
portfólio: sem backend e sem segredos expostos no código do browser.

## Executar

```bash
npm install
npm run dev
```

Abrir <http://127.0.0.1:5178>.

## Validar

```bash
npm run check
npm run build
```

## Ideias para evoluir

- Gráfico horário de temperatura para o dia atual.
- Alertas visuais para condições extremas (ex. tempestade, calor).
- Comparar o tempo de duas localizações lado a lado.
- Modo PWA para consulta rápida offline da última localização vista.

O README deve ser atualizado quando o conceito, as funcionalidades ou as
prioridades mudarem.

## Nota técnica — Google Analytics

O Analytics só é carregado depois de o utilizador aceitar os cookies. A função
`gtag` deve enviar o objeto nativo `arguments` para `dataLayer`:

```js
function gtag() {
  dataLayer.push(arguments)
}
```

Não substituir por `dataLayer.push(args)` com um rest parameter (`...args`):
apesar de o script da Google carregar, o comando `config` e o `page_view` podem
não ser processados.
