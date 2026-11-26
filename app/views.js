// Views for Indonesia in Figures — one renderer per page, plus the router.
// Every page is reached by a link (hash route) and every control on it works:
// the chart switcher swaps the series, table headers sort, the search box
// filters the province rows live. Nothing here is a placeholder.

import {
  SITE, KEY_INDICATORS, SERIES, AGE_STRUCTURE, REGIONS, PROVINCES,
  GDP_BY_SECTOR, TRADE, WORK, RELEASES, SOURCES,
} from "./data.js";
import { lineChart, barChart, shareBars, donut } from "./charts.js";

const app = document.getElementById("app");

function fmtNum(n) {
  return n.toLocaleString("en-US");
}

function card(ind) {
  const arrow = ind.trend === "up" ? "▲" : "▼";
  return `<article class="card">
    <h3>${ind.label}</h3>
    <p class="big">${ind.value}</p>
    <p class="detail">${ind.detail}</p>
    <p class="meta"><span class="arrow">${arrow}</span> ${ind.change} · ${ind.source}</p>
  </article>`;
}

function chartShell(title, source, chartNode, switcher = "") {
  const wrap = document.createElement("section");
  wrap.className = "panel";
  wrap.innerHTML = `<div class="panel-head"><h2>${title}</h2>${switcher}</div>
    <div class="chart"></div><p class="source">Source: ${source}</p>`;
  wrap.querySelector(".chart").appendChild(chartNode);
  return wrap;
}

// ---------------------------------------------------------------- overview
const SWITCHER = {
  gdpGrowth: { label: "GDP growth", series: SERIES.gdpGrowth, unit: "%", note: "Real GDP growth, percent per year. Source: BPS." },
  inflation: { label: "Inflation", series: SERIES.inflation, unit: "%", note: "Consumer prices, December year on year. Source: BPS." },
  poverty: { label: "Poverty", series: SERIES.poverty, unit: "%", note: "Poverty rate, March. Source: BPS." },
  unemployment: { label: "Unemployment", series: SERIES.unemployment, unit: "%", note: "Open unemployment rate, August. Source: BPS." },
};
let activeMetric = "gdpGrowth";

function renderOverview() {
  app.innerHTML = `
    <section class="hero">
      <p class="eyebrow">National statistics · ${SITE.updated}</p>
      <h1>${SITE.name}</h1>
      <p class="lede">${SITE.tagline}. Population, economy, work and wellbeing — every figure with its source and year, nothing behind a login, nothing fetched from anywhere else.</p>
      <p class="hero-links"><a class="btn" href="#/population">Explore the population</a>
      <a class="btn ghost" href="#/economy">See the economy</a></p>
    </section>
    <section class="cards" aria-label="Key indicators">${KEY_INDICATORS.map(card).join("")}</section>
    <div id="switch-chart"></div>
    <section class="grid-2">
      <div id="pop-chart"></div>
      <div id="releases"></div>
    </section>`;
  drawSwitcherChart();
  const popPanel = chartShell(
    "Population, 2000–2025",
    "BPS censuses 2000, 2010, 2020 and mid-year estimates 2024–2025.",
    barChart(SERIES.population, { unit: "m", decimals: 1 }),
  );
  app.querySelector("#pop-chart").appendChild(popPanel);
  const rel = document.createElement("section");
  rel.className = "panel";
  rel.innerHTML = `<h2>Latest releases</h2><ul class="releases">${RELEASES.map(
    (r) => `<li><span class="date">${r.date}</span><span>${r.title}</span><span class="src">${r.source}</span></li>`,
  ).join("")}</ul>`;
  app.querySelector("#releases").appendChild(rel);
}

function drawSwitcherChart() {
  const host = app.querySelector("#switch-chart");
  if (!host) return;
  const metric = SWITCHER[activeMetric];
  const buttons = Object.entries(SWITCHER).map(([key, m]) =>
    `<button type="button" data-metric="${key}" class="${key === activeMetric ? "active" : ""}" aria-pressed="${key === activeMetric}">${m.label}</button>`).join("");
  const panel = chartShell(
    `${metric.label}, 2019–2024`, metric.note,
    lineChart(metric.series, { unit: metric.unit, baseline: metric.series.some((p) => p.value < 0) ? 0 : null }),
    `<div class="switcher" role="group" aria-label="Choose indicator">${buttons}</div>`,
  );
  host.replaceChildren(panel);
  panel.querySelectorAll("[data-metric]").forEach((btn) => {
    btn.addEventListener("click", () => { activeMetric = btn.dataset.metric; drawSwitcherChart(); });
  });
}

// -------------------------------------------------------------- population
let provSort = { key: "population", dir: -1 };
let provQuery = "";

function renderPopulation() {
  app.innerHTML = `
    <section class="page-head">
      <p class="eyebrow">People</p>
      <h1>Population</h1>
      <p class="lede">284.4 million people at mid-2025 (BPS estimate), the world's fourth-largest population, spread over 17,000 islands and 38 provinces. Java alone holds 55.6% of them.</p>
    </section>
    <section class="cards" aria-label="Population facts">
      ${card({ label: "Total population", value: "284.4m", detail: "mid-2025 estimate", source: "BPS, 2025", change: "+2.8m on mid-2024", trend: "up" })}
      ${card({ label: "Median age", value: "30.6 yrs", detail: "2024 estimate", source: "UN World Population Prospects", change: "68.1% are of working age", trend: "up" })}
      ${card({ label: "Fertility rate", value: "2.13", detail: "births per woman, 2023", source: "World Bank / UN, 2023", change: "near replacement level", trend: "down" })}
      ${card({ label: "Density", value: "149 /km²", detail: "2023", source: "Destatis, 2023", change: "Java: over 1,100 /km²", trend: "up" })}
    </section>
    <div class="grid-2">
      <div id="age-chart"></div>
      <div id="pop-history"></div>
    </div>
    <section class="panel">
      <h2>Where people live — seven regions</h2>
      <p class="intro">BPS groups the 38 provinces into seven geographical units for statistics and planning. Java holds more people than the other six combined.</p>
      <div class="table-wrap"><table id="region-table">
        <thead><tr><th>Region</th><th>Population (mid-2025)</th><th>Share</th><th>Largest city</th><th>Highest point</th></tr></thead>
        <tbody>${REGIONS.map((r) => `<tr><td><strong>${r.unit}</strong> <span class="code">${r.code}</span></td><td>${fmtNum(r.population)}</td><td>${r.share.toFixed(1)}%</td><td>${r.largestCity}</td><td>${r.highestPoint}</td></tr>`).join("")}</tbody>
        <tfoot><tr><td><strong>Indonesia</strong></td><td><strong>284,438,200</strong></td><td><strong>100.0%</strong></td><td colspan="2">38 provinces · 514 regencies and cities</td></tr></tfoot>
      </table></div>
      <p class="source">Source: BPS regional population estimates, mid-2025.</p>
    </section>
    <section class="panel">
      <div class="panel-head"><h2>Provinces — ten largest</h2>
      <label class="search">Search provinces <input id="prov-search" type="search" placeholder="Type a province name…" value="${provQuery}"></label></div>
      <p class="intro">Population Census 2020 (BPS). Click a column heading to sort; the search box filters as you type.</p>
      <div class="table-wrap"><table id="prov-table">
        <thead><tr>
          <th><button type="button" data-sort="rank">Rank</button></th>
          <th><button type="button" data-sort="name">Province</button></th>
          <th><button type="button" data-sort="population">Population (2020)</button></th>
          <th><button type="button" data-sort="share">Share</button></th>
          <th><button type="button" data-sort="island">Island</button></th>
        </tr></thead>
        <tbody id="prov-body"></tbody>
      </table></div>
      <p class="source" id="prov-count"></p>
      <p class="source">Source: BPS, Population Census 2020. West Java is the largest province; South Papua, with about 550,000 people, is the smallest of all 38.</p>
    </section>`;
  app.querySelector("#age-chart").appendChild(chartShell(
    "Age structure, 2024", "Destatis international statistics (UN-based).",
    shareBars(AGE_STRUCTURE.map((a) => ({ label: a.group, share: a.share }))),
  ));
  app.querySelector("#pop-history").appendChild(chartShell(
    "Population growth", "BPS censuses and estimates.",
    barChart(SERIES.population, { unit: "m", decimals: 1 }),
  ));
  drawProvinceRows();
  app.querySelectorAll("#prov-table [data-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.sort;
      if (provSort.key === key) provSort.dir *= -1;
      else provSort = { key, dir: key === "name" || key === "island" ? 1 : -1 };
      drawProvinceRows();
    });
  });
  app.querySelector("#prov-search").addEventListener("input", (e) => {
    provQuery = e.target.value;
    drawProvinceRows();
  });
}

function drawProvinceRows() {
  const body = app.querySelector("#prov-body");
  if (!body) return;
  const q = provQuery.trim().toLowerCase();
  let rows = PROVINCES.filter((p) => !q || p.name.toLowerCase().includes(q) || p.island.toLowerCase().includes(q));
  const { key, dir } = provSort;
  rows = [...rows].sort((a, b) => {
    const av = a[key], bv = b[key];
    if (av === null) return 1;
    if (bv === null) return -1;
    return (typeof av === "string" ? av.localeCompare(bv) : av - bv) * dir;
  });
  body.innerHTML = rows.map((p) => `<tr>
    <td>${p.rank ?? "—"}</td><td><strong>${p.name}</strong></td>
    <td>${fmtNum(p.population)}</td><td>${p.share.toFixed(1)}%</td><td>${p.island}</td></tr>`).join("")
    || `<tr><td colspan="5">No province matches “${provQuery}”.</td></tr>`;
  app.querySelector("#prov-count").textContent =
    `Showing ${rows.length} of ${PROVINCES.length} rows · sorted by ${provSort.key} (${provSort.dir === 1 ? "ascending" : "descending"})`;
}

// ----------------------------------------------------------------- economy
function renderEconomy() {
  app.innerHTML = `
    <section class="page-head">
      <p class="eyebrow">Economy</p>
      <h1>Economy</h1>
      <p class="lede">The largest economy in Southeast Asia: US$1,396 billion in 2024, growing 5.03% in real terms, with inflation back inside target at 1.57%.</p>
    </section>
    <section class="cards" aria-label="Economy facts">
      ${card({ label: "GDP (nominal)", value: "US$1,396bn", detail: "2024, current prices", source: "IMF / BPS, 2024", change: "US$4,958 per person", trend: "up" })}
      ${card({ label: "GDP (PPP)", value: "US$4,102bn", detail: "2024, international dollars", source: "World Bank, 2024", change: "16th largest in the world", trend: "up" })}
      ${card({ label: "Growth", value: "5.03%", detail: "real GDP, 2024", source: "BPS, 2024", change: "5.05% in 2023", trend: "up" })}
      ${card({ label: "Government debt", value: "39.8%", detail: "of GDP, 2024", source: "Ministry of Finance, 2024", change: "below the 60% legal cap", trend: "down" })}
    </section>
    <div class="grid-2">
      <div id="growth-chart"></div>
      <div id="inflation-chart"></div>
    </div>
    <section class="panel">
      <h2>Trade, 2024</h2>
      <div class="trade">
        <div><p class="big green">US$${TRADE.exports.value}bn</p><p>Exports · ${TRADE.exports.source}</p></div>
        <div><p class="big">US$${TRADE.imports.value}bn</p><p>Imports · ${TRADE.imports.source}</p></div>
        <div><p class="big green">US$${TRADE.surplus.value}bn</p><p>Trade surplus · ${TRADE.surplus.source}</p></div>
      </div>
      <p class="intro">Main exports: ${TRADE.mainExports}. Main trading partners: ${TRADE.mainPartners}.</p>
    </section>
    <section class="panel">
      <h2>What the economy is made of — GDP by sector, 2024</h2>
      <div class="donut-row"><div id="sector-donut"></div>
      <ul class="legend">${GDP_BY_SECTOR.map((s) => `<li><span class="swatch"></span>${s.sector} — <strong>${s.share.toFixed(1)}%</strong> of GDP</li>`).join("")}</ul></div>
      <p class="source">Source: Destatis international statistics / World Bank, 2024. Manufacturing is the largest single part of industry; services include trade, transport and finance.</p>
    </section>`;
  app.querySelector("#growth-chart").appendChild(chartShell(
    "Real GDP growth, 2019–2024", "BPS. 2020 is the pandemic contraction.",
    lineChart(SERIES.gdpGrowth, { unit: "%", baseline: 0 }),
  ));
  app.querySelector("#inflation-chart").appendChild(chartShell(
    "Inflation, 2019–2024", "BPS, December year on year.",
    lineChart(SERIES.inflation, { unit: "%" }),
  ));
  app.querySelector("#sector-donut").appendChild(donut(GDP_BY_SECTOR));
}

// ------------------------------------------------------------------- people
function renderPeople() {
  app.innerHTML = `
    <section class="page-head">
      <p class="eyebrow">People</p>
      <h1>Health, education &amp; work</h1>
      <p class="lede">Human development keeps climbing — the HDI reached 75.02 in 2024 — while poverty and unemployment both fell to their lowest levels in years.</p>
    </section>
    <section class="cards" aria-label="Wellbeing facts">
      ${card({ label: "Human Development Index", value: "75.02", detail: "2024", source: "BPS, 2024", change: "up every year since 2019", trend: "up" })}
      ${card({ label: "Life expectancy", value: "74.1 yrs", detail: "at birth, 2024", source: "BPS, 2024", change: "73.6 yrs in 2023", trend: "up" })}
      ${card({ label: "Literacy", value: "97.7%", detail: "ages 15+, 2023", source: "BPS, 2023", change: "near-universal reading ability", trend: "up" })}
      ${card({ label: "Internet users", value: "79.5%", detail: "221.6m people, 2024", source: "APJII, 2024", change: "up from 78.2% in 2023", trend: "up" })}
    </section>
    <div class="grid-2">
      <div id="hdi-chart"></div>
      <div id="poverty-chart"></div>
    </div>
    <div class="grid-2">
      <div id="unemp-chart"></div>
      <section class="panel">
        <h2>Work, 2024</h2>
        <dl class="facts">
          <div><dt>Labour force</dt><dd>${WORK.labourForce.value} people · ${WORK.labourForce.source}</dd></div>
          <div><dt>Participation rate</dt><dd>${WORK.participation.value} of people aged 15+ · ${WORK.participation.source}</dd></div>
          <div><dt>Youth unemployment</dt><dd>${WORK.youthUnemployment.value} of ages 15–24 · ${WORK.youthUnemployment.source}</dd></div>
          <div><dt>Informal work</dt><dd>About 54% of workers are self-employed or in family work · Destatis, 2023</dd></div>
        </dl>
        <p class="source">Source: BPS National Labour Force Survey (Sakernas), August 2024.</p>
      </section>
    </div>`;
  app.querySelector("#hdi-chart").appendChild(chartShell(
    "Human Development Index, 2019–2024", "BPS.",
    lineChart(SERIES.hdi, { unit: "", decimals: 2 }),
  ));
  app.querySelector("#poverty-chart").appendChild(chartShell(
    "Poverty rate, 2019–2024", "BPS, March each year. September 2024: 8.57%.",
    lineChart(SERIES.poverty, { unit: "%" }),
  ));
  app.querySelector("#unemp-chart").appendChild(chartShell(
    "Unemployment, 2019–2024", "BPS, August each year.",
    lineChart(SERIES.unemployment, { unit: "%" }),
  ));
}

// ------------------------------------------------------------------ sources
function renderSources() {
  app.innerHTML = `
    <section class="page-head">
      <p class="eyebrow">About the data</p>
      <h1>Sources &amp; methods</h1>
      <p class="lede">Every figure on this site names its publisher and year. The site itself stores the figures in its own files and fetches nothing — open it with the network off and it still works.</p>
    </section>
    <section class="panel">
      <h2>Where each figure comes from</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Figure</th><th>Value shown</th><th>Publisher</th><th>Publication</th></tr></thead>
        <tbody>${SOURCES.map((s) => `<tr><td><strong>${s.figure}</strong></td><td>${s.value}</td><td>${s.publisher}</td><td>${s.publication}</td></tr>`).join("")}</tbody>
      </table></div>
    </section>
    <section class="panel">
      <h2>Methods &amp; notes</h2>
      <ul class="notes">
        <li><strong>Two population counts.</strong> BPS runs the census every ten years and publishes estimates between censuses (281.6m at mid-2024, 284.4m at mid-2025). The civil registry counts registered residents and is higher (about 288.3m in late 2025) because it counts registrations, not residents. This site uses BPS.</li>
        <li><strong>Poverty is measured twice a year.</strong> The March rate (9.03% in 2024) and the September rate (8.57%) differ because prices and harvests move; the site labels which one a chart uses.</li>
        <li><strong>Unemployment is the open rate.</strong> It counts people aged 15+ who are not working and are looking for work, as a share of the labour force, measured each February and August.</li>
        <li><strong>Money figures.</strong> GDP in rupiah comes from BPS; the US-dollar figure uses the IMF's conversion. Growth is always in real (constant-price) terms unless the page says otherwise.</li>
        <li><strong>Figures are rounded.</strong> Province populations are exact census counts; shares are rounded to one decimal and may not add to exactly 100%.</li>
      </ul>
    </section>
    <section class="panel">
      <h2>About this site</h2>
      <p class="intro">“${SITE.name}” is an original, independent presentation of Indonesia's published national statistics. It is not affiliated with Statistics Indonesia (BPS), the World Bank, the IMF or APJII, and it copies no other site's design, text or images. All charts are drawn by the site's own code from the figures listed above; the site makes no network request at all.</p>
    </section>`;
}

// ------------------------------------------------------------------- router
const ROUTES = {
  "": { title: "Overview", render: renderOverview },
  "population": { title: "Population", render: renderPopulation },
  "economy": { title: "Economy", render: renderEconomy },
  "people": { title: "Health, Education & Work", render: renderPeople },
  "sources": { title: "Sources & Methods", render: renderSources },
};

export function route() {
  const key = location.hash.replace(/^#\/?/, "").split("?")[0];
  const page = ROUTES[key] ?? ROUTES[""];
  document.title = `${page.title} — ${SITE.name}`;
  document.querySelectorAll("nav a").forEach((a) => {
    const href = a.getAttribute("href").replace(/^#\/?/, "");
    a.classList.toggle("active", href === key || (key === "" && href === ""));
    if (href === key || (key === "" && href === "")) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  page.render();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", route);
