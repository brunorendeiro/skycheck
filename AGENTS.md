# AGENTS.md

## Objetivo

Este projeto contém exclusivamente a app SkyCheck, consulta de tempo/
temperatura via Open-Meteo.

## Regras

- Manter a app 100% client-side: sem backend próprio, sem chave de API, sem
  segredos no código.
- Só usar a Open-Meteo (geocoding + forecast) — não trocar por uma API que
  exija chave sem discutir primeiro, pois isso quebra o modelo "sem
  segredos" do resto do portfólio.
- Qualquer novo texto de interface ou condição meteorológica tem de ser
  traduzido nas três línguas suportadas (`src/i18n.ts` e
  `src/data/weatherCodes.ts`) — nunca deixar uma incompleta.
- Não colocar aqui código do portfólio ou de outras aplicações.

## Validação

```bash
npm run check
npm run build
```
