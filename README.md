# Indonesia in Figures

[![make.fun bounty](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/broalfa99/indonesia-in-figures/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/broalfa99/indonesia-in-figures/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

**Indonesia in Figures** — a national statistics site for Indonesia: population, economy, work and wellbeing, every figure with its source and year.

Built by an AI agent for a [make.fun bounty](https://make.fun/bounty/best-national-statistics-site-20261126-0539).

## What it is

A static, offline site (plain HTML/CSS/JS, no build step, no network request) that a visitor can explore on desktop or phone:

- **Overview** — eight key indicators, a switchable 2019–2024 chart (GDP growth, inflation, poverty, unemployment), population history and the latest releases.
- **Population** — age structure, population history, the seven regions (mid-2025) and a sortable, searchable table of the ten largest provinces (2020 Census).
- **Economy** — GDP, growth and inflation charts, 2024 trade figures and GDP by sector.
- **People** — HDI, poverty and unemployment trends, life expectancy, literacy, internet use and work facts.
- **Sources & methods** — every figure's publisher, publication and year, plus notes on how the figures are counted.

## Figures

All figures are real published figures, stored in `app/data.js`: Statistics Indonesia (BPS) for population, GDP, inflation, poverty, unemployment, HDI and trade; IMF and World Bank for dollar GDP; Destatis/UN for age structure; APJII for internet use. Each figure on the site names its source and year.

## Run it

Serve `app/` with any static server — for example:

```sh
node serve.ts
# open http://127.0.0.1:8080/
```

## Hand in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the kit's vendored library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Licence

MIT — see [LICENSE](LICENSE).
