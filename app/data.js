// Indonesia in Figures — the data layer.
// Every figure below is a real published figure, with its source and year.
// Main source: Statistics Indonesia (BPS, bps.go.id), unless noted otherwise.
// Figures are hard-coded on purpose: the site works fully offline, no fetch.

export const SITE = {
  name: "Indonesia in Figures",
  tagline: "The numbers behind the world's fourth-largest nation",
  country: "Indonesia",
  updated: "November 2026",
  note: "Each figure shows its source and year. Where two official sources count the same thing differently, the site says which one it uses.",
};

// Key indicators shown on the overview page. `change` is the move from the
// previous release; `trend` is "up" when the direction is good for the card.
export const KEY_INDICATORS = [
  { id: "population", label: "Population", value: "284.4m", detail: "mid-2025 estimate", source: "BPS, 2025", change: "+1.0% on 2024", trend: "up" },
  { id: "gdp", label: "GDP (nominal)", value: "US$1,396bn", detail: "2024, current prices", source: "IMF / BPS, 2024", change: "US$4,958 per person", trend: "up" },
  { id: "growth", label: "Economic growth", value: "5.03%", detail: "real GDP, 2024", source: "BPS, 2024", change: "5.05% in 2023", trend: "up" },
  { id: "inflation", label: "Inflation", value: "1.57%", detail: "Dec 2024, year on year", source: "BPS, 2024", change: "2.61% in Dec 2023", trend: "down" },
  { id: "poverty", label: "Poverty rate", value: "8.57%", detail: "Sep 2024 · 24.06m people", source: "BPS, 2024", change: "9.03% in Mar 2024", trend: "down" },
  { id: "unemployment", label: "Unemployment", value: "4.91%", detail: "Aug 2024, open rate", source: "BPS, 2024", change: "5.32% in Aug 2023", trend: "down" },
  { id: "hdi", label: "Human Development Index", value: "75.02", detail: "2024 · high human development", source: "BPS, 2024", change: "74.39 in 2023", trend: "up" },
  { id: "life", label: "Life expectancy", value: "74.1 yrs", detail: "at birth, 2024", source: "BPS, 2024", change: "73.6 yrs in 2023", trend: "up" },
];

// Time series used by the charts. Each point is { year, value }.
export const SERIES = {
  // Real GDP growth, percent per year (BPS).
  gdpGrowth: [
    { year: 2019, value: 5.02 }, { year: 2020, value: -2.07 }, { year: 2021, value: 3.69 },
    { year: 2022, value: 5.31 }, { year: 2023, value: 5.05 }, { year: 2024, value: 5.03 },
  ],
  // Consumer-price inflation, December year on year, percent (BPS).
  inflation: [
    { year: 2019, value: 2.72 }, { year: 2020, value: 1.68 }, { year: 2021, value: 1.87 },
    { year: 2022, value: 5.51 }, { year: 2023, value: 2.61 }, { year: 2024, value: 1.57 },
  ],
  // Poverty rate, March, percent of population (BPS).
  poverty: [
    { year: 2019, value: 9.41 }, { year: 2020, value: 9.78 }, { year: 2021, value: 10.14 },
    { year: 2022, value: 9.54 }, { year: 2023, value: 9.36 }, { year: 2024, value: 9.03 },
  ],
  // Open unemployment rate, August, percent of labour force (BPS).
  unemployment: [
    { year: 2019, value: 5.28 }, { year: 2020, value: 7.07 }, { year: 2021, value: 6.49 },
    { year: 2022, value: 5.86 }, { year: 2023, value: 5.32 }, { year: 2024, value: 4.91 },
  ],
  // Human Development Index (BPS).
  hdi: [
    { year: 2019, value: 71.92 }, { year: 2020, value: 71.94 }, { year: 2021, value: 72.29 },
    { year: 2022, value: 73.86 }, { year: 2023, value: 74.39 }, { year: 2024, value: 75.02 },
  ],
  // Total population, millions (censuses 2000/2010/2020; BPS estimates 2024/2025).
  population: [
    { year: 2000, value: 206.3 }, { year: 2010, value: 237.6 }, { year: 2020, value: 270.2 },
    { year: 2024, value: 281.6 }, { year: 2025, value: 284.4 },
  ],
};

// Age structure, 2024 (Destatis international statistics, UN-based).
export const AGE_STRUCTURE = [
  { group: "Under 15", share: 24.6 },
  { group: "15 to 64", share: 68.1 },
  { group: "65 and over", share: 7.3 },
];

// Seven geographical units, mid-2025 population (BPS, via the official
// regional grouping). Shares are of the 284.44m national total.
export const REGIONS = [
  { unit: "Java", code: "ID-JW", population: 158079100, share: 55.6, largestCity: "Jakarta", highestPoint: "Mount Semeru, 3,678 m" },
  { unit: "Sumatra", code: "ID-SM", population: 62259500, share: 21.9, largestCity: "Medan", highestPoint: "Mount Kerinci, 3,805 m" },
  { unit: "Sulawesi", code: "ID-SL", population: 21044800, share: 7.4, largestCity: "Makassar", highestPoint: "Latimojong, 3,478 m" },
  { unit: "Kalimantan", code: "ID-KA", population: 17951300, share: 6.3, largestCity: "Samarinda", highestPoint: "Bukit Raya, 2,278 m" },
  { unit: "Nusa Tenggara", code: "ID-NU", population: 15935000, share: 5.6, largestCity: "Denpasar", highestPoint: "Mount Rinjani, 3,726 m" },
  { unit: "Papua", code: "ID-PP", population: 5824500, share: 2.0, largestCity: "Jayapura", highestPoint: "Puncak Jaya, 4,884 m" },
  { unit: "Maluku Islands", code: "ID-ML", population: 3344200, share: 1.2, largestCity: "Ambon", highestPoint: "Mount Binaiya, 3,027 m" },
];

// Ten most populous provinces, 2020 Population Census (BPS). The last row is
// the other 28 provinces combined, so the table adds up to the census total.
export const PROVINCES = [
  { rank: 1, name: "West Java", population: 48274162, share: 17.9, island: "Java" },
  { rank: 2, name: "East Java", population: 40665696, share: 15.1, island: "Java" },
  { rank: 3, name: "Central Java", population: 36516035, share: 13.5, island: "Java" },
  { rank: 4, name: "North Sumatra", population: 14799361, share: 5.5, island: "Sumatra" },
  { rank: 5, name: "Banten", population: 11904562, share: 4.4, island: "Java" },
  { rank: 6, name: "Jakarta", population: 10562088, share: 3.9, island: "Java" },
  { rank: 7, name: "South Sulawesi", population: 9073509, share: 3.4, island: "Sulawesi" },
  { rank: 8, name: "Lampung", population: 9007848, share: 3.3, island: "Sumatra" },
  { rank: 9, name: "South Sumatra", population: 8467432, share: 3.1, island: "Sumatra" },
  { rank: 10, name: "Riau", population: 6394087, share: 2.4, island: "Sumatra" },
  { rank: null, name: "Other 28 provinces", population: 74539137, share: 27.6, island: "All islands" },
];

// GDP by sector of origin, 2024, percent of GDP (Destatis / World Bank data).
export const GDP_BY_SECTOR = [
  { sector: "Services", share: 48.1 },
  { sector: "Industry", share: 39.3 },
  { sector: "Agriculture, forestry & fishing", share: 12.6 },
];

// Trade and work, 2024.
export const TRADE = {
  exports: { value: 264.7, unit: "US$ bn", source: "BPS, 2024" },
  imports: { value: 233.7, unit: "US$ bn", source: "BPS, 2024" },
  surplus: { value: 31.0, unit: "US$ bn", source: "BPS, 2024" },
  mainExports: "Coal, palm oil, nickel, natural gas, textiles",
  mainPartners: "China, United States, Japan, India, Singapore",
};
export const WORK = {
  labourForce: { value: "143.1m", source: "BPS / Destatis, 2024" },
  participation: { value: "67.0%", source: "BPS / Destatis, 2024" },
  youthUnemployment: { value: "13.1%", source: "Destatis, 2024" },
  governmentDebt: { value: "39.8% of GDP", source: "Ministry of Finance, 2024" },
  internetUsers: { value: "79.5%", detail: "221.6m people online", source: "APJII, 2024" },
  literacy: { value: "97.7%", detail: "ages 15 and over", source: "BPS, 2023" },
  fertility: { value: "2.13", detail: "births per woman", source: "World Bank / UN, 2023" },
  density: { value: "149", detail: "people per km²", source: "Destatis, 2023" },
};

// Latest statistical releases, newest first — what a returning visitor checks.
export const RELEASES = [
  { date: "Nov 2025", title: "Population estimate, mid-2025: 284.44 million", source: "BPS" },
  { date: "Feb 2025", title: "GDP grew 5.03% in 2024; nominal GDP Rp22,139 trillion", source: "BPS" },
  { date: "Jan 2025", title: "December 2024 inflation 1.57% year on year", source: "BPS" },
  { date: "Nov 2024", title: "Open unemployment fell to 4.91% in August 2024", source: "BPS" },
  { date: "Oct 2024", title: "Poverty at 8.57% in September 2024, down from 9.03% in March", source: "BPS" },
  { date: "Nov 2024", title: "Human Development Index reached 75.02 in 2024", source: "BPS" },
];

// Every figure's provenance, shown on the Sources page.
export const SOURCES = [
  { figure: "Population, mid-2024 and mid-2025", value: "281.6m · 284.4m", publisher: "Statistics Indonesia (BPS)", publication: "Population estimates; Statistical Yearbook of Indonesia 2025" },
  { figure: "Population by province, 2020 Census", value: "270.20m total", publisher: "Statistics Indonesia (BPS)", publication: "Population Census 2020 (SP2020)" },
  { figure: "Population by region, mid-2025", value: "7 geographical units", publisher: "Statistics Indonesia (BPS)", publication: "Regional population estimates, 2025" },
  { figure: "GDP and economic growth, 2019–2024", value: "5.03% in 2024", publisher: "Statistics Indonesia (BPS)", publication: "Gross Domestic Product, quarterly and annual releases" },
  { figure: "GDP in US dollars, 2024", value: "US$1,396.3bn", publisher: "International Monetary Fund", publication: "World Economic Outlook database" },
  { figure: "Inflation, 2019–2024", value: "1.57% in Dec 2024", publisher: "Statistics Indonesia (BPS)", publication: "Consumer Price Index monthly release" },
  { figure: "Poverty rate, 2019–2024", value: "8.57% in Sep 2024", publisher: "Statistics Indonesia (BPS)", publication: "Poverty profile, March and September" },
  { figure: "Unemployment, 2019–2024", value: "4.91% in Aug 2024", publisher: "Statistics Indonesia (BPS)", publication: "National Labour Force Survey (Sakernas)" },
  { figure: "Human Development Index, 2019–2024", value: "75.02 in 2024", publisher: "Statistics Indonesia (BPS)", publication: "Human Development Index release" },
  { figure: "Life expectancy, 2024", value: "74.1 years", publisher: "Statistics Indonesia (BPS)", publication: "Human Development Index release" },
  { figure: "Age structure and labour force, 2024", value: "24.6% under 15", publisher: "Destatis / United Nations", publication: "International statistics: Indonesia, 2025" },
  { figure: "Exports, imports and trade balance, 2024", value: "US$264.7bn exports", publisher: "Statistics Indonesia (BPS)", publication: "Foreign trade statistics, annual 2024" },
  { figure: "Internet users, 2024", value: "221.6m people", publisher: "APJII", publication: "Indonesia Internet Penetration Survey 2024" },
  { figure: "Literacy, 2023", value: "97.7%", publisher: "Statistics Indonesia (BPS)", publication: "National Socio-Economic Survey (Susenas)" },
];
