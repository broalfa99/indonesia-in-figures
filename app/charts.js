// Charts for Indonesia in Figures — small SVG builders, no library.
// Every chart is drawn from the data in data.js and labelled in the page,
// so the numbers a visitor reads in a chart are the numbers in the table too.

const NS = "http://www.w3.org/2000/svg";
const INK = "#0f2a2e";
const MUTED = "#5c6f72";
const GRID = "#dfe7e6";
const TEAL = "#0e7c7b";
const AMBER = "#e8a317";
const ROSE = "#c2452d";

function el(tag, attrs = {}, text = null) {
  const node = document.createElementNS(NS, tag);
  for (const [key, val] of Object.entries(attrs)) node.setAttribute(key, val);
  if (text !== null) node.textContent = text;
  return node;
}

function fmt(value, decimals = 2) {
  return value.toFixed(decimals).replace(/\.00$/, "");
}

// A line chart with labelled points. `series` is [{year, value}], `unit` is
// the suffix shown after each value (for example "%").
export function lineChart(series, { width = 640, height = 260, unit = "%", color = TEAL, baseline = null } = {}) {
  const padL = 44, padR = 14, padT = 18, padB = 30;
  const values = series.map((p) => p.value);
  let lo = Math.min(...values), hi = Math.max(...values);
  if (baseline !== null) { lo = Math.min(lo, baseline); hi = Math.max(hi, baseline); }
  if (lo === hi) { lo -= 1; hi += 1; }
  const span = hi - lo;
  lo -= span * 0.12; hi += span * 0.12;
  const innerW = width - padL - padR, innerH = height - padT - padB;
  const x = (i) => padL + (innerW * i) / (series.length - 1);
  const y = (v) => padT + innerH - ((v - lo) / (hi - lo)) * innerH;

  const svg = el("svg", { viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": "Line chart" });
  // Gridlines with value labels.
  const ticks = 4;
  for (let t = 0; t <= ticks; t++) {
    const v = lo + ((hi - lo) * t) / ticks;
    const gy = y(v);
    svg.appendChild(el("line", { x1: padL, y1: gy, x2: width - padR, y2: gy, stroke: GRID, "stroke-width": 1 }));
    svg.appendChild(el("text", { x: padL - 8, y: gy + 4, "text-anchor": "end", "font-size": 11, fill: MUTED }, fmt(v)));
  }
  if (baseline !== null) {
    svg.appendChild(el("line", { x1: padL, y1: y(baseline), x2: width - padR, y2: y(baseline), stroke: ROSE, "stroke-width": 1, "stroke-dasharray": "5 4" }));
  }
  const points = series.map((p, i) => `${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  svg.appendChild(el("polyline", { points, fill: "none", stroke: color, "stroke-width": 2.5, "stroke-linejoin": "round", "stroke-linecap": "round" }));
  series.forEach((p, i) => {
    svg.appendChild(el("circle", { cx: x(i), cy: y(p.value), r: 4, fill: "#fff", stroke: color, "stroke-width": 2 }));
    const lx = Math.max(26, Math.min(width - 26, x(i)));
    svg.appendChild(el("text", { x: lx, y: y(p.value) - 10, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: INK }, `${fmt(p.value)}${unit}`));
    svg.appendChild(el("text", { x: x(i), y: height - 8, "text-anchor": "middle", "font-size": 11, fill: MUTED }, String(p.year)));
  });
  return svg;
}

// A vertical bar chart. `unit` is appended to the value label of each bar.
export function barChart(series, { width = 640, height = 260, unit = "", color = TEAL, decimals = 1 } = {}) {
  const padL = 44, padR = 14, padT = 26, padB = 30;
  const values = series.map((p) => p.value);
  const hi = Math.max(...values) * 1.12;
  const lo = Math.min(0, ...values) * 1.1;
  const innerW = width - padL - padR, innerH = height - padT - padB;
  const slot = innerW / series.length;
  const y = (v) => padT + innerH - ((v - lo) / (hi - lo)) * innerH;

  const svg = el("svg", { viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": "Bar chart" });
  for (let t = 0; t <= 4; t++) {
    const v = lo + ((hi - lo) * t) / 4;
    const gy = y(v);
    svg.appendChild(el("line", { x1: padL, y1: gy, x2: width - padR, y2: gy, stroke: GRID, "stroke-width": 1 }));
    svg.appendChild(el("text", { x: padL - 8, y: gy + 4, "text-anchor": "end", "font-size": 11, fill: MUTED }, fmt(v, 0)));
  }
  series.forEach((p, i) => {
    const barW = Math.min(64, slot * 0.62);
    const bx = padL + slot * i + (slot - barW) / 2;
    const by = y(Math.max(p.value, 0));
    const bh = Math.abs(y(p.value) - y(0));
    svg.appendChild(el("rect", { x: bx, y: by, width: barW, height: Math.max(bh, 1), rx: 3, fill: p.value < 0 ? ROSE : color }));
    svg.appendChild(el("text", { x: bx + barW / 2, y: by - 8, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: INK }, `${fmt(p.value, decimals)}${unit}`));
    svg.appendChild(el("text", { x: bx + barW / 2, y: height - 8, "text-anchor": "middle", "font-size": 11, fill: MUTED }, String(p.year)));
  });
  return svg;
}

// Horizontal bars for shares (age structure, GDP by sector, regions).
// `rows` is [{label, share}] where share is a percent of the whole.
export function shareBars(rows, { width = 640, barH = 26, gap = 14, color = TEAL } = {}) {
  const padL = 190, padR = 58;
  const height = rows.length * (barH + gap) + 8;
  const max = Math.max(...rows.map((r) => r.share));
  const svg = el("svg", { viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": "Share chart" });
  rows.forEach((r, i) => {
    const y = 8 + i * (barH + gap);
    const w = ((width - padL - padR) * r.share) / (max * 1.05);
    svg.appendChild(el("text", { x: padL - 10, y: y + barH / 2 + 4, "text-anchor": "end", "font-size": 12, fill: INK }, r.label));
    svg.appendChild(el("rect", { x: padL, y, width: Math.max(w, 2), height: barH, rx: 4, fill: i === 0 ? AMBER : color }));
    svg.appendChild(el("text", { x: padL + w + 8, y: y + barH / 2 + 4, "font-size": 12, "font-weight": 700, fill: INK }, `${fmt(r.share, 1)}%`));
  });
  return svg;
}

// A compact donut for a two-or-three-way split; the legend is HTML, not SVG.
export function donut(rows, { size = 180, thickness = 30 } = {}) {
  const total = rows.reduce((sum, r) => sum + r.share, 0);
  const r = (size - thickness) / 2;
  const cx = size / 2, cy = size / 2;
  const colors = [TEAL, AMBER, "#3a9e8f"];
  const svg = el("svg", { viewBox: `0 0 ${size} ${size}`, role: "img", "aria-label": "Donut chart" });
  let offset = 25; // start at the top
  rows.forEach((row, i) => {
    const frac = row.share / total;
    const circle = el("circle", {
      cx, cy, r, fill: "none", stroke: colors[i % colors.length], "stroke-width": thickness,
      "stroke-dasharray": `${frac * 2 * Math.PI * r} ${(1 - frac) * 2 * Math.PI * r}`,
      "stroke-dashoffset": -offset * 2 * Math.PI * r / 100, transform: `rotate(-90 ${cx} ${cy})`,
    });
    svg.appendChild(circle);
    offset += frac * 100;
  });
  const label = el("text", { x: cx, y: cy - 4, "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: INK }, "100%");
  const sub = el("text", { x: cx, y: cy + 16, "text-anchor": "middle", "font-size": 11, fill: MUTED }, "of GDP");
  svg.appendChild(label);
  svg.appendChild(sub);
  return svg;
}
