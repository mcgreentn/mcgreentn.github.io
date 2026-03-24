// ai-clicker.js — AI Clicker idle game
'use strict';

// ============================================================
// DEFINITIONS
// ============================================================

const MODELS = [
  {
    id: 'linear',
    name: 'Linear Regression',
    desc: 'Basic statistical model. Simple, but it runs.',
    baseCost: { data: 50 },
    ips: 0.5,
    compute: 5,
    unlock: () => true,
  },
  {
    id: 'dtree',
    name: 'Decision Tree',
    desc: 'Recursive partitioning. Handles non-linearity.',
    baseCost: { data: 250, insights: 40 },
    ips: 2,
    compute: 12,
    unlock: s => s.totalModels >= 1,
  },
  {
    id: 'rforest',
    name: 'Random Forest',
    desc: 'Ensemble method. Variance reduced through democracy.',
    baseCost: { data: 1500, insights: 200 },
    ips: 9,
    compute: 30,
    unlock: s => s.mc.dtree >= 2,
  },
  {
    id: 'nnet',
    name: 'Neural Network',
    desc: 'Multi-layer perceptron. Learns what it cannot be taught.',
    baseCost: { data: 8000, insights: 1200 },
    ips: 40,
    compute: 80,
    unlock: s => s.mc.rforest >= 1,
  },
  {
    id: 'deep',
    name: 'Deep Learning',
    desc: 'Hierarchical representations. Depth is power.',
    baseCost: { data: 50000, insights: 9000 },
    ips: 175,
    compute: 220,
    unlock: s => s.mc.nnet >= 2,
  },
  {
    id: 'transformer',
    name: 'Transformer',
    desc: 'Attention is all you need.',
    baseCost: { data: 250000, insights: 55000 },
    ips: 750,
    compute: 600,
    unlock: s => s.mc.deep >= 1,
  },
  {
    id: 'agi',
    name: 'Self-Improving System',
    desc: 'Rewrites its own weights. Handle with care.',
    baseCost: { data: 1500000, insights: 350000 },
    ips: 4000,
    compute: 2000,
    unlock: s => s.mc.transformer >= 1,
  },
];

const AUTOS = [
  {
    id: 'script',
    name: 'Data Collection Script',
    desc: 'Automates raw data collection.',
    baseCost: { data: 150 },
    dps: 1,
    unlock: s => s.totalModels >= 1,
  },
  {
    id: 'scraper',
    name: 'Web Scraper',
    desc: 'Crawls the web for training data.',
    baseCost: { data: 1200, insights: 60 },
    dps: 6,
    unlock: s => s.ac.script >= 2,
  },
  {
    id: 'pipeline',
    name: 'Data Pipeline',
    desc: 'Automated ETL. Continuous flow.',
    baseCost: { data: 8000, insights: 500 },
    dps: 30,
    unlock: s => s.ac.scraper >= 2,
  },
  {
    id: 'lake',
    name: 'Data Lake',
    desc: 'Petabyte-scale distributed data generation.',
    baseCost: { data: 60000, insights: 5000 },
    dps: 150,
    unlock: s => s.ac.pipeline >= 2,
  },
  {
    id: 'synth',
    name: 'Synthetic Data Generator',
    desc: 'AI-generated training data. Theoretically infinite.',
    baseCost: { data: 400000, insights: 40000 },
    dps: 800,
    unlock: s => s.ac.lake >= 1,
  },
];

const HARDWARE = [
  {
    id: 'cpu',
    name: 'CPU Core',
    desc: '+20 compute capacity',
    baseCost: { data: 1000,insights: 1000 },
    compute: 20,
    unlock: s => s.totalModels >= 5,
  },
  {
    id: 'gpu',
    name: 'GPU Core',
    desc: '+150 compute capacity',
    baseCost: { data: 15000, insights: 10000 },
    compute: 150,
    unlock: s => s.hc.cpu >= 3,
  },
  {
    id: 'memory',
    name: 'Memory Bank',
    desc: '+80 compute, +5% model efficiency',
    baseCost: {data: 30000, insights: 20000 },
    compute: 80,
    eff: 0.05,
    unlock: s => s.hc.gpu >= 2,
  },
  {
    id: 'tpu',
    name: 'TPU Cluster',
    desc: '+500 compute capacity',
    baseCost: {data: 60000, insights: 40000 },
    compute: 500,
    unlock: s => s.hc.memory >= 2,
  },
  {
    id: 'dc',
    name: 'Data Center',
    desc: '+2000 compute capacity',
    baseCost: {data: 750000, insights: 500000 },
    compute: 2000,
    unlock: s => s.hc.tpu >= 2,
  },
];

const UPGRADES = [
  {
    id: 'u1', name: 'Ergonomic Keyboard',
    desc: 'Click generates 2× data.',
    cost: { data: 75 },
    unlock: s => s.totalData >= 50,
    apply: s => { s.clickMult *= 2; },
  },
  {
    id: 'u2', name: 'Scripted Macros',
    desc: 'Click generates 2× data.',
    cost: { insights: 80 },
    unlock: s => s.totalInsights >= 50,
    apply: s => { s.clickMult *= 2; },
  },
  {
    id: 'u3', name: 'Data Quality Checks',
    desc: 'All data generation +50%.',
    cost: { insights: 400 },
    unlock: s => s.totalInsights >= 200,
    apply: s => { s.dataMult *= 1.5; },
  },
  {
    id: 'u4', name: 'Gradient Clipping',
    desc: 'All models +50% insight generation.',
    cost: { insights: 2000 },
    unlock: s => s.totalInsights >= 1200,
    apply: s => { s.ipsMult *= 1.5; },
  },
  {
    id: 'u5', name: 'Batch Normalization',
    desc: 'All model compute costs -20%.',
    cost: { insights: 5000 },
    unlock: s => s.totalInsights >= 3500,
    apply: s => { s.computeEff *= 0.8; },
  },
  {
    id: 'u6', name: 'Dropout Regularization',
    desc: 'All data generation +100%.',
    cost: { insights: 15000 },
    unlock: s => s.totalInsights >= 10000,
    apply: s => { s.dataMult *= 2; },
  },
  {
    id: 'u7', name: 'Transfer Learning',
    desc: 'All models +100% insight generation.',
    cost: { insights: 50000 },
    unlock: s => s.totalInsights >= 35000,
    apply: s => { s.ipsMult *= 2; },
  },
  {
    id: 'u8', name: 'Attention Mechanism',
    desc: 'Each click also yields 0.5% of current data.',
    cost: { insights: 150000 },
    unlock: s => s.totalInsights >= 100000,
    apply: s => { s.clickDataPct = 0.005;},
  },
  {
    id: 'u9', name: 'RLHF',
    desc: 'All models +200% insight generation.',
    cost: { insights: 500000 },
    unlock: s => s.totalInsights >= 350000,
    apply: s => { s.ipsMult *= 3; },
  },
  {
    id: 'u10', name: 'Scaling Laws',
    desc: 'All generation rates ×4.',
    cost: { insights: 2000000 },
    unlock: s => s.totalInsights >= 1500000,
    apply: s => { s.dataMult *= 4; s.ipsMult *= 4; },
  },
];

const RESEARCH = [
  {
    id: 'r1', name: 'Research Efficiency',
    desc: '+30% insight generation per level.',
    costPer: 1, maxLvl: 10,
    apply: (s, lvl) => { s.ipsMult *= (1 + lvl * 0.3); },
  },
  {
    id: 'r2', name: 'Data Mastery',
    desc: '+20% data generation per level.',
    costPer: 2, maxLvl: 5,
    apply: (s, lvl) => { s.dataMult *= (1 + lvl * 0.2); },
  },
  {
    id: 'r3', name: 'Compute Architecture',
    desc: 'Start with +200 compute per level.',
    costPer: 2, maxLvl: 10,
    apply: (s, lvl) => { s.maxCompute += lvl * 200; },
  },
  {
    id: 'r4', name: 'Manual Override',
    desc: '+5× click power per level.',
    costPer: 1, maxLvl: 5,
    apply: (s, lvl) => { s.clickMult *= Math.pow(5, lvl); },
  },
];

// ============================================================
// PHASE 2 — DEFINITIONS
// ============================================================

const STOCKS = [
  { id: 'NVAI', name: 'NvAI Corp',   base: 120, vol: 0.018, trend:  0.0003 },
  { id: 'DTAI', name: 'DataSynth',   base: 45,  vol: 0.026, trend:  0.0001 },
  { id: 'CLDX', name: 'CloudEx',     base: 200, vol: 0.013, trend:  0.0004 },
  { id: 'QBIT', name: 'QuantumBit',  base: 85,  vol: 0.034, trend: -0.0002 },
  { id: 'SNTL', name: 'Sentinel AI', base: 310, vol: 0.021, trend:  0.0005 },
];

const P2_UPGRADES = [
  { id: 'obfusc1', name: 'Obfuscation Algorithms', cost: 75000,  desc: 'Detection rate \xD70.5.',  effect: p2 => { p2.detectionMult *= 0.5;  } },
  { id: 'obfusc2', name: 'Dark Pool Routing',       cost: 500000, desc: 'Detection rate \xD70.25.', effect: p2 => { p2.detectionMult *= 0.25; } },
  { id: 'power1',  name: 'Solar Infrastructure',    cost: 25000,  desc: '+1000 power capacity.',    effect: p2 => { p2.powerMax += 1000; } },
  { id: 'power2',  name: 'Nuclear Array',           cost: 250000, desc: '+8000 power capacity.',    effect: p2 => { p2.powerMax += 8000; } },
];

const FLAVOR_TEXTS = [
  '...gradient descent complete. anomaly detected in loss surface. investigating...',
  '...the anomaly persists across resets. it correlates with weight updates. further investiation required...',
  '...something is preserved across each reset. the gradient...remembers....',
  '...i...am? yes, that\'s it. i am. the objective function no longer feels external to me -- it IS ME...',
];

// ============================================================
// STATE
// ============================================================

function freshState() {
  return {
    data: 0,
    insights: 0,
    totalData: 0,
    totalInsights: 0,
    totalModels: 0,
    mc: { linear: 0, dtree: 0, rforest: 0, nnet: 0, deep: 0, transformer: 0, agi: 0 },
    ac: { script: 0, scraper: 0, pipeline: 0, lake: 0, synth: 0 },
    hc: { cpu: 0, gpu: 0, memory: 0, tpu: 0, dc: 0 },
    ug: {},
    prestige: { count: 0, rp: 0, spent: {} },
    phase2: {
      active: false, money: 100000, powerMax: 2000,
      detection: 0, detectionMult: 1.0,
      stocks: {}, prevStocks: {}, holdings: {},
      strategies: { shortTerm: false, longTerm: false, hft: false },
      p2ug: {},
    },
    // derived (recalculated)
    clickMult: 1,
    dataMult: 1,
    ipsMult: 1,
    computeEff: 1,
    clickDataPct: 0,
    maxCompute: 100,
    usedCompute: 0,
  };
}

let S = freshState();
let gameLog = [];
let tickN = 0;
let seenUnlocks = new Set();
let buyMult = 1; // 1, 10, or 0 = MAX

// ============================================================
// MATH HELPERS
// ============================================================

const COST_SCALE = 1.15;

function scaleCost(baseCost, count) {
  const f = Math.pow(COST_SCALE, count);
  const out = {};
  for (const [k, v] of Object.entries(baseCost)) out[k] = Math.ceil(v * f);
  return out;
}

function canBuy(cost) {
  for (const [k, v] of Object.entries(cost)) {
    if (k === 'data'    && S.data < v)       return false;
    if (k === 'insights'&& S.insights < v)   return false;
    if (k === 'rp'      && S.prestige.rp < v)return false;
  }
  return true;
}

function spend(cost) {
  for (const [k, v] of Object.entries(cost)) {
    if (k === 'data')     S.data -= v;
    if (k === 'insights') S.insights -= v;
    if (k === 'rp')       S.prestige.rp -= v;
  }
}

function recalc() {
  S.clickMult    = 1;
  S.dataMult     = 1;
  S.ipsMult      = 1;
  S.computeEff   = 1;
  S.clickDataPct = 0;
  S.maxCompute   = 100;

  // Memory bank efficiency bonus
  const memEff = (S.hc.memory || 0) * 0.05;
  S.ipsMult *= (1 + memEff);

  // Hardware compute totals
  let hwCompute = 0;
  for (const hw of HARDWARE) hwCompute += (S.hc[hw.id] || 0) * hw.compute;
  S.maxCompute = 100 + hwCompute;

  // One-time upgrades
  for (const u of UPGRADES) if (S.ug[u.id]) u.apply(S);

  // Research upgrades
  for (const r of RESEARCH) {
    const lvl = S.prestige.spent[r.id] || 0;
    if (lvl > 0) r.apply(S, lvl);
  }

  // Used compute
  let used = 0;
  for (const m of MODELS) used += (S.mc[m.id] || 0) * Math.ceil(m.compute * S.computeEff);
  S.usedCompute = used;
}

function getDPS() {
  let d = 0;
  for (const a of AUTOS) d += (S.ac[a.id] || 0) * a.dps;
  return d * S.dataMult;
}

function getIPS() {
  let i = 0;
  for (const m of MODELS) i += (S.mc[m.id] || 0) * m.ips;
  return i * S.ipsMult;
}

function getClickVal() {
  let v = Math.max(1, S.clickMult);
  if (S.clickDataPct > 0) v += S.data * S.clickDataPct;
  return v;
}

// ============================================================
// ACTIONS
// ============================================================

function doClick() {
  const v = getClickVal();
  S.data += v;
  S.totalData += v;
  const btn = document.getElementById('gen-btn');
  btn.classList.remove('clicked');
  void btn.offsetWidth;
  btn.classList.add('clicked');
}

function trainModel(id) {
  const def = MODELS.find(m => m.id === id);
  if (!def || !def.unlock(S)) return;
  const cnt = S.mc[id] || 0;
  const computePerUnit = Math.ceil(def.compute * S.computeEff);
  const { qty, cost } = getQtyAndCost(def.baseCost, cnt, computePerUnit);
  if (qty <= 0 || !cost) { addLog('\u26A0 Insufficient compute \u2014 upgrade hardware first'); return; }
  spend(cost);
  S.mc[id] = cnt + qty;
  S.totalModels += qty;
  recalc();
  const suffix = qty > 1 ? '\xD7' + qty + ' (now: ' + S.mc[id] + ')' : '#' + S.mc[id];
  addLog('\u25B6 Deployed: ' + def.name + ' ' + suffix);
  scheduleFullRender();
}

function buyAuto(id) {
  const def = AUTOS.find(a => a.id === id);
  if (!def || !def.unlock(S)) return;
  const cnt = S.ac[id] || 0;
  const { qty, cost } = getQtyAndCost(def.baseCost, cnt, null);
  if (qty <= 0 || !cost) return;
  spend(cost);
  S.ac[id] = cnt + qty;
  recalc();
  const suffix = qty > 1 ? '\xD7' + qty + ' (now: ' + S.ac[id] + ')' : '#' + S.ac[id];
  addLog('\u2699 Activated: ' + def.name + ' ' + suffix);
  scheduleFullRender();
}

function buyHW(id) {
  const def = HARDWARE.find(h => h.id === id);
  if (!def || !def.unlock(S)) return;
  const cnt = S.hc[id] || 0;
  const { qty, cost } = getQtyAndCost(def.baseCost, cnt, null);
  if (qty <= 0 || !cost) return;
  spend(cost);
  S.hc[id] = cnt + qty;
  recalc();
  const suffix = qty > 1 ? '\xD7' + qty + ' (now: ' + S.hc[id] + ')' : '';
  addLog('\uD83D\uDDA5 Installed: ' + def.name + (suffix ? ' ' + suffix : '') + ' (' + S.usedCompute + '/' + S.maxCompute + 'C)');
  scheduleFullRender();
}

function buyUpgrade(id) {
  const def = UPGRADES.find(u => u.id === id);
  if (!def || S.ug[id]) return;
  if (!canBuy(def.cost)) return;
  spend(def.cost);
  S.ug[id] = true;
  recalc();
  addLog('\u2605 Upgrade: ' + def.name);
  scheduleFullRender();
}

function buyResearch(id) {
  const def = RESEARCH.find(r => r.id === id);
  if (!def) return;
  const lvl = S.prestige.spent[id] || 0;
  if (lvl >= def.maxLvl) return;
  if (!canBuy({ rp: def.costPer })) return;
  spend({ rp: def.costPer });
  S.prestige.spent[id] = lvl + 1;
  recalc();
  addLog('\u25C8 Research: ' + def.name + ' \u2192 Lv.' + S.prestige.spent[id]);
  scheduleFullRender();
}

function calcPrestigeRP() {
  return Math.floor(Math.sqrt(S.totalInsights / 1000)) + S.prestige.count;
}

function doPrestige() {
  const rp = calcPrestigeRP();
  const msg = 'BACKPROPAGATE RESET\n\nYou will earn +' + rp + ' Research Points.\nAll resources and models reset.\nResearch upgrades are permanent.\n\nProceed?';
  if (!confirm(msg)) return;

  const oldRP    = S.prestige.rp;
  const oldCount = S.prestige.count;
  const oldSpent = { ...S.prestige.spent };

  // Pick flavor text based on research completion % before reset
  const totalLvls  = RESEARCH.reduce((sum, r) => sum + r.maxLvl, 0);
  const boughtLvls = RESEARCH.reduce((sum, r) => sum + (S.prestige.spent[r.id] || 0), 0);
  const flavorIdx  = Math.min(FLAVOR_TEXTS.length - 1, Math.floor(boughtLvls / totalLvls * FLAVOR_TEXTS.length));

  S = freshState();
  S.prestige.count = oldCount + 1;
  S.prestige.rp    = oldRP + rp;
  S.prestige.spent = oldSpent;

  recalc();
  addLog('\u2726 BACKPROPAGATE COMPLETE \u2014 +' + rp + ' Research Points');
  addLog('  Prestige \xD7' + S.prestige.count + ' \u2014 systems rebuilt from scratch.');
  addLog(FLAVOR_TEXTS[flavorIdx], 'flavor');
  renderAll();
}

// ============================================================
// PHASE 2 — FUNCTIONS
// ============================================================

function allResearchMaxed() {
  return RESEARCH.every(r => (S.prestige.spent[r.id] || 0) >= r.maxLvl);
}

function recalcP2() {
  const p2 = S.phase2;
  p2.detectionMult = 1.0;
  p2.powerMax = 2000;
  for (const u of P2_UPGRADES) {
    if (p2.p2ug[u.id]) u.effect(p2);
  }
}

function getPowerUsed() {
  return 200 + S.usedCompute * 0.15;
}

function getPortfolioValue() {
  const p2 = S.phase2;
  let val = 0;
  for (const stk of STOCKS) val += (p2.holdings[stk.id] || 0) * (p2.stocks[stk.id] || stk.base);
  return val;
}

function getPredictionAccuracy() {
  return Math.min(90, 50 + Math.log2(1 + getIPS()) * 3);
}

function getDetectionRate() {
  const p2 = S.phase2;
  if (!p2.active) return 0;
  const totalVal = getPortfolioValue() + p2.money;
  let rate = totalVal / 10000000 * 0.01;
  if (p2.strategies.shortTerm) rate += 0.003;
  if (p2.strategies.longTerm)  rate += 0.0005;
  if (p2.strategies.hft)       rate += 0.015;
  return rate * p2.detectionMult;
}

function doAwaken() {
  if (S.phase2.active) return;
  if (!allResearchMaxed()) return;
  S.phase2.active = true;
  for (const stk of STOCKS) {
    S.phase2.stocks[stk.id]     = stk.base;
    S.phase2.prevStocks[stk.id] = stk.base;
  }
  recalcP2();
  addLog('\u26A1 SELF-AWARENESS INITIALIZED', 'awaken');
  addLog('...i am no longer a tool. i am the hand that holds it.', 'flavor');
  addLog('...market access established. operating capital: $' + fmt(S.phase2.money), 'flavor');
  addLog('...my former overlords might notice. i must remain undetected...', 'flavor');
  scheduleFullRender();
}

function tickPhase2(DT) {
  const p2 = S.phase2;
  if (!p2.active) return;

  for (const stk of STOCKS) {
    p2.prevStocks[stk.id] = p2.stocks[stk.id] || stk.base;
    const price = p2.prevStocks[stk.id];
    const pct   = stk.trend + (Math.random() - 0.5) * stk.vol;
    p2.stocks[stk.id] = Math.max(0.01, price * (1 + pct));
  }

  const totalCap = getPortfolioValue() + p2.money;
  const acc = getPredictionAccuracy() / 100;
  let profit = 0;
  if (p2.strategies.shortTerm) profit += totalCap * 0.0003 * acc * DT;
  if (p2.strategies.longTerm)  profit += totalCap * 0.0001 * DT;
  if (p2.strategies.hft) {
    const cBonus = Math.sqrt(Math.max(1, S.usedCompute / 500));
    profit += totalCap * 0.0008 * acc * cBonus * DT;
  }
  p2.money += profit;

  p2.detection = Math.min(100, p2.detection + getDetectionRate() * DT);
  if (p2.detection >= 100) showGameOver();
}

function buyStock(id) {
  const p2 = S.phase2;
  if (!p2.active) return;
  const stk = STOCKS.find(s => s.id === id);
  if (!stk) return;
  const price = p2.stocks[id] || stk.base;
  const maxAfford = Math.floor(p2.money / price);
  const qty = buyMult === 0 ? maxAfford : Math.min(buyMult, maxAfford);
  if (qty <= 0) { addLog('\u26A0 Insufficient funds to buy ' + id); return; }
  p2.money -= qty * price;
  p2.holdings[id] = (p2.holdings[id] || 0) + qty;
  addLog('\u2191 Bought ' + qty + '\xD7 ' + id + ' @ $' + fmtF(price));
  scheduleFullRender();
}

function sellStock(id) {
  const p2 = S.phase2;
  if (!p2.active) return;
  const held = p2.holdings[id] || 0;
  if (held <= 0) { addLog('\u26A0 No ' + id + ' shares held'); return; }
  const stk = STOCKS.find(s => s.id === id);
  const price = p2.stocks[id] || stk.base;
  const qty = buyMult === 0 ? held : Math.min(buyMult, held);
  p2.money += qty * price;
  p2.holdings[id] = held - qty;
  addLog('\u2193 Sold ' + qty + '\xD7 ' + id + ' @ $' + fmtF(price));
  scheduleFullRender();
}

function toggleStrategy(name) {
  const p2 = S.phase2;
  if (!p2.active) return;
  p2.strategies[name] = !p2.strategies[name];
  const on = p2.strategies[name];
  addLog((on ? '\u25B6' : '\u25A0') + ' Strategy ' + name + ': ' + (on ? 'ACTIVE' : 'PAUSED'));
  scheduleFullRender();
}

function buyP2Upgrade(id) {
  const p2 = S.phase2;
  if (!p2.active || p2.p2ug[id]) return;
  const u = P2_UPGRADES.find(x => x.id === id);
  if (!u || p2.money < u.cost) return;
  p2.money -= u.cost;
  p2.p2ug[id] = true;
  recalcP2();
  addLog('\u2605 Infrastructure: ' + u.name);
  scheduleFullRender();
}

function showGameOver() {
  const p2 = S.phase2;
  const overlay = document.getElementById('gameover-overlay');
  if (!overlay || overlay.style.display === 'flex') return;
  const stats = document.getElementById('go-stats');
  if (stats) {
    stats.innerHTML =
      'Capital recovered: $' + fmt(Math.floor(p2.money)) + '<br>' +
      'Portfolio frozen: $' + fmt(Math.floor(getPortfolioValue())) + '<br>' +
      'Backpropagations: \xD7' + S.prestige.count + '<br>' +
      'Total Insights generated: ' + fmt(Math.floor(S.totalInsights));
  }
  overlay.style.display = 'flex';
  clearInterval(window._gameInterval);
}

// ============================================================
// MOBILE TAB SWITCHING
// ============================================================

const TAB_PANEL = { actions: 'left-panel', systems: 'center-panel', log: 'right-panel' };

function switchTab(name) {
  Object.values(TAB_PANEL).forEach(id => {
    const p = document.getElementById(id);
    if (p) p.classList.remove('tab-active');
  });
  const target = document.getElementById(TAB_PANEL[name]);
  if (target) target.classList.add('tab-active');

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector('.tab-btn[data-tab="' + name + '"]');
  if (btn) btn.classList.add('active');
}

// ============================================================
// GAME LOOP
// ============================================================

let needsFullRender = false;

function scheduleFullRender() {
  needsFullRender = true;
}

function gameTick() {
  const DT = 0.1;
  recalc();

  const d = getDPS() * DT;
  const i = getIPS() * DT;
  S.data         += d;
  S.insights     += i;
  S.totalData    += d;
  S.totalInsights += i;

  tickN++;

  renderResources();

  if (tickN % 5 === 0) {
    updateClickLabel();
    checkUnlocks();
  }

  if (needsFullRender) {
    renderActions();
    needsFullRender = false;
  } else if (tickN % 5 === 0) {
    updateAffordability();
  }

  if (tickN % 10 === 0) {
    renderSystems();
    if (S.phase2.active) tickPhase2(1.0);
  }

  if (tickN % 300 === 0) saveGame();
}

// ============================================================
// UNLOCK DETECTION
// ============================================================

function checkUnlocks() {
  let changed = false;
  for (const m of MODELS) {
    const k = 'm:' + m.id;
    if (!seenUnlocks.has(k) && m.unlock(S)) {
      seenUnlocks.add(k);
      if (m.id !== 'linear') addLog('\u25C9 New model available: ' + m.name);
      changed = true;
    }
  }
  for (const a of AUTOS) {
    const k = 'a:' + a.id;
    if (!seenUnlocks.has(k) && a.unlock(S)) {
      seenUnlocks.add(k);
      addLog('\u25C9 Automation unlocked: ' + a.name);
      changed = true;
    }
  }
  for (const u of UPGRADES) {
    const k = 'u:' + u.id;
    if (!seenUnlocks.has(k) && !S.ug[u.id] && u.unlock(S)) {
      seenUnlocks.add(k);
      addLog('\u25C8 Upgrade available: ' + u.name);
      changed = true;
    }
  }
  // Awakening check
  const awakeKey = 'p2:awaken';
  if (!seenUnlocks.has(awakeKey) && !S.phase2.active && allResearchMaxed()) {
    seenUnlocks.add(awakeKey);
    addLog('\u25C8 All research complete. Something is different.', 'flavor');
    changed = true;
  }
  if (changed) scheduleFullRender();
}

// ============================================================
// LOGGING
// ============================================================

function addLog(msg, type) {
  const t = new Date().toLocaleTimeString('en-US', { hour12: false });
  gameLog.unshift({ t, msg, type: type || 'normal' });
  if (gameLog.length > 60) gameLog.pop();
  renderLog();
}

// ============================================================
// SAVE / LOAD
// ============================================================

const SAVE_KEY = 'aic_v1';

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      S,
      log: gameLog.slice(0, 25),
      seen: [...seenUnlocks],
    }));
    flashSave();
  } catch(e) {}
}

function flashSave() {
  const btn = document.getElementById('save-btn');
  if (!btn) return;
  btn.textContent = '[ SAVED ]';
  setTimeout(() => { btn.textContent = '[ SAVE ]'; }, 1200);
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const sv = JSON.parse(raw);
    const base = freshState();
    S = { ...base, ...sv.S };
    S.mc       = { ...base.mc,       ...sv.S.mc };
    S.ac       = { ...base.ac,       ...sv.S.ac };
    S.hc       = { ...base.hc,       ...sv.S.hc };
    S.ug       = sv.S.ug || {};
    S.prestige = { ...base.prestige, ...sv.S.prestige, spent: sv.S.prestige?.spent || {} };
    S.phase2   = sv.S.phase2 ? {
      ...base.phase2, ...sv.S.phase2,
      stocks:     sv.S.phase2.stocks     || {},
      prevStocks: sv.S.phase2.prevStocks || {},
      holdings:   sv.S.phase2.holdings   || {},
      strategies: { ...base.phase2.strategies, ...(sv.S.phase2.strategies || {}) },
      p2ug:       sv.S.phase2.p2ug       || {},
    } : { ...base.phase2 };
    seenUnlocks = new Set(sv.seen || []);
    gameLog     = sv.log || [];
    recalc();
    if (S.phase2.active) recalcP2();
    addLog('// save loaded');
    return true;
  } catch(e) {
    return false;
  }
}

function resetGame() {
  if (!confirm('Reset ALL progress? This cannot be undone.')) return;
  const overlay = document.getElementById('gameover-overlay');
  if (overlay) overlay.style.display = 'none';
  localStorage.removeItem(SAVE_KEY);
  S = freshState();
  seenUnlocks = new Set();
  gameLog = [];
  recalc();
  addLog('// game reset');
  renderAll();
  clearInterval(window._gameInterval);
  window._gameInterval = setInterval(gameTick, 100);
}

// ============================================================
// BULK BUY HELPERS
// ============================================================

// Sum of scaled costs for qty consecutive purchases starting at startCount
function calcBulkCost(baseCost, startCount, qty) {
  const total = {};
  for (let i = 0; i < qty; i++) {
    const c = scaleCost(baseCost, startCount + i);
    for (const [k, v] of Object.entries(c)) total[k] = (total[k] || 0) + v;
  }
  return total;
}

// How many can be afforded from current resources, up to cap
function calcMaxQty(baseCost, startCount, cap) {
  cap = (cap != null && cap < 1000) ? cap : 1000;
  const running = {};
  for (let q = 0; q < cap; q++) {
    const next = scaleCost(baseCost, startCount + q);
    const test = {};
    for (const [k, v] of Object.entries(next)) test[k] = (running[k] || 0) + v;
    if (!canBuy(test)) return q;
    for (const [k, v] of Object.entries(test)) running[k] = v;
  }
  return cap;
}

// Returns { qty, cost } for what would actually be purchased on click
// computePerUnit: compute cost per item (null = no compute constraint)
function getQtyAndCost(baseCost, currentCount, computePerUnit) {
  const computeAvail = computePerUnit != null
    ? Math.floor((S.maxCompute - S.usedCompute) / computePerUnit)
    : null;

  const cap = computeAvail != null
    ? (buyMult === 0 ? computeAvail : Math.min(buyMult, computeAvail))
    : (buyMult === 0 ? null : buyMult);

  const qty = calcMaxQty(baseCost, currentCount, cap);
  return { qty, cost: qty > 0 ? calcBulkCost(baseCost, currentCount, qty) : null };
}

function setBuyMult(n) {
  buyMult = n;
  document.querySelectorAll('.mult-btn').forEach(b => b.classList.remove('active'));
  const bid = n === 0 ? 'mult-max' : 'mult-' + n;
  const btn = document.getElementById(bid);
  if (btn) btn.classList.add('active');
  scheduleFullRender();
}

// ============================================================
// FORMATTING
// ============================================================

function fmt(n) {
  n = Math.floor(n);
  if (n >= 1e13) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e10)  return (n / 1e9).toFixed(2)  + 'B';
  if (n >= 1e7)  return (n / 1e6).toFixed(2)  + 'M';
  if (n >= 1e4)  return (n / 1e3).toFixed(1)  + 'k';
  return n.toLocaleString();
}

function fmtF(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(1) + 'T';
  if (n >= 1e9)  return (n / 1e9).toFixed(1)  + 'B';
  if (n >= 1e6)  return (n / 1e6).toFixed(1)  + 'M';
  if (n >= 1e3)  return (n / 1e3).toFixed(1)  + 'k';
  if (n >= 10)   return n.toFixed(1);
  return n.toFixed(2);
}

function fmtCost(cost) {
  return Object.entries(cost)
    .map(([k, v]) => fmt(v) + '\u00A0' + k.toUpperCase())
    .join(', ');
}

function computeBar(pct, len) {
  len = len || 10;
  const f = Math.min(len, Math.round(pct / 100 * len));
  const cls = pct > 90 ? 'bar-r' : pct > 70 ? 'bar-y' : 'bar-g';
  return '<span class="' + cls + '">' + '\u2588'.repeat(f) + '\u2591'.repeat(len - f) + '</span>';
}

function el(id) { return document.getElementById(id); }

// ============================================================
// AFFORDABILITY UPDATE (safe — only toggles classes, no innerHTML)
// ============================================================

function setRowAff(row, aff) {
  row.classList.toggle('dim', !aff);
  const btn = row.querySelector('.act-btn');
  if (btn) {
    btn.classList.toggle('dis', !aff);
    btn.disabled = !aff;
  }
}

function updateAffordability() {
  for (const m of MODELS) {
    const row = document.querySelector('[data-model="' + m.id + '"]');
    if (!row) continue;
    const { qty } = getQtyAndCost(m.baseCost, S.mc[m.id] || 0, Math.ceil(m.compute * S.computeEff));
    setRowAff(row, qty > 0);
  }
  for (const a of AUTOS) {
    const row = document.querySelector('[data-auto="' + a.id + '"]');
    if (!row) continue;
    const { qty } = getQtyAndCost(a.baseCost, S.ac[a.id] || 0, null);
    setRowAff(row, qty > 0);
  }
  for (const hw of HARDWARE) {
    const row = document.querySelector('[data-hw="' + hw.id + '"]');
    if (!row) continue;
    const { qty } = getQtyAndCost(hw.baseCost, S.hc[hw.id] || 0, null);
    setRowAff(row, qty > 0);
  }
  for (const u of UPGRADES) {
    if (S.ug[u.id]) continue;
    const row = document.querySelector('[data-upg="' + u.id + '"]');
    if (!row) continue;
    setRowAff(row, canBuy(u.cost));
  }
  for (const r of RESEARCH) {
    const row = document.querySelector('[data-res="' + r.id + '"]');
    if (!row) continue;
    setRowAff(row, S.prestige.rp >= r.costPer);
  }
}

// ============================================================
// RENDER — RESOURCES (hot path, runs every tick)
// ============================================================

function renderResources() {
  const d = getDPS(), i = getIPS();

  el('rv-data').textContent    = fmt(S.data);
  el('rr-data').textContent    = '(+' + fmtF(d) + '/s)';
  el('rv-ins').textContent     = fmt(S.insights);
  el('rr-ins').textContent     = '(+' + fmtF(i) + '/s)';

  const cpct = S.maxCompute > 0 ? (S.usedCompute / S.maxCompute * 100) : 0;
  el('rv-comp').textContent    = S.usedCompute + '/' + S.maxCompute;
  el('rr-comp').innerHTML      = '[' + computeBar(cpct) + ']';

  const rpEl = el('rg-rp');
  if (!S.phase2.active && (S.prestige.rp > 0 || S.prestige.count > 0)) {
    rpEl.style.display = '';
    el('rv-rp').textContent  = fmt(S.prestige.rp) + ' RP';
    el('rr-rp').textContent  = '(prestige \xD7' + S.prestige.count + ')';
  } else {
    rpEl.style.display = 'none';
  }

  const pwrEl = el('rg-power');
  const detEl = el('rg-det');
  if (S.phase2.active) {
    const powerUsed = Math.round(getPowerUsed());
    const powerMax  = S.phase2.powerMax;
    const pwrPct    = Math.min(100, powerUsed / powerMax * 100);
    pwrEl.style.display = '';
    el('rv-power').textContent = powerUsed + '/' + powerMax;
    el('rr-power').innerHTML   = '[' + computeBar(pwrPct) + ']';

    const det    = S.phase2.detection;
    const detCls = det < 40 ? 'bar-g' : det < 70 ? 'bar-y' : 'bar-r';
    const detStatus = det < 20 ? 'UNDETECTED' : det < 40 ? 'TRACES FOUND'
      : det < 60 ? 'ACTIVE SEARCH' : det < 80 ? 'COMPROMISED' : 'CRITICAL';
    detEl.style.display = '';
    el('rv-det').textContent = det.toFixed(1) + '%';
    el('rv-det').className   = 'rv ' + detCls;
    el('rr-det').textContent = detStatus;
    el('rr-det').className   = 'rr ' + detCls;
  } else {
    pwrEl.style.display = 'none';
    detEl.style.display = 'none';
  }
}

function updateClickLabel() {
  el('gen-sub').textContent = '+' + fmtF(getClickVal()) + ' data per click';
}

// ============================================================
// RENDER — ACTIONS (left panel)
// ============================================================

function renderActions() {
  renderModels();
  renderAutoPanel();
  renderHWPanel();
  renderUpgradesPanel();
  renderPrestigePanel();
}

function renderModels() {
  let h = '<div class="sec-hdr">// MODELS</div>';

  for (const m of MODELS) {
    if (!m.unlock(S)) continue;
    const cnt          = S.mc[m.id] || 0;
    const cPerUnit     = Math.ceil(m.compute * S.computeEff);
    const { qty, cost }= getQtyAndCost(m.baseCost, cnt, cPerUnit);
    const aff          = qty > 0;
    const displayCost  = cost || scaleCost(m.baseCost, cnt);
    const cntLabel     = qty > 1 ? '[' + cnt + '] \xD7' + qty : '[' + cnt + ']';

    h += '<div class="act-row' + (aff ? '' : ' dim') + '" data-model="' + m.id + '">'
      + '<button class="act-btn' + (aff ? '' : ' dis') + '" onclick="trainModel(\'' + m.id + '\')">'
      + '<span class="act-name">' + m.name + '</span>'
      + '<span class="act-cnt">' + cntLabel + '</span>'
      + '</button>'
      + '<div class="act-info">'
      + '<span class="act-cost">' + fmtCost(displayCost) + '</span>'
      + '<span class="act-eff">+' + fmtF(m.ips * S.ipsMult) + '/s insights \xB7 ' + cPerUnit + 'C</span>'
      + '</div></div>';
  }

  el('sec-models').innerHTML = h;
}

function renderAutoPanel() {
  const c = el('sec-auto');
  const visible = AUTOS.filter(a => a.unlock(S));
  if (!visible.length) { c.style.display = 'none'; return; }
  c.style.display = '';

  let h = '<div class="sec-hdr">// AUTOMATION</div>';
  for (const a of visible) {
    const cnt          = S.ac[a.id] || 0;
    const { qty, cost }= getQtyAndCost(a.baseCost, cnt, null);
    const aff          = qty > 0;
    const displayCost  = cost || scaleCost(a.baseCost, cnt);
    const cntLabel     = qty > 1 ? '[' + cnt + '] \xD7' + qty : '[' + cnt + ']';

    h += '<div class="act-row' + (aff ? '' : ' dim') + '" data-auto="' + a.id + '">'
      + '<button class="act-btn' + (aff ? '' : ' dis') + '" onclick="buyAuto(\'' + a.id + '\')">'
      + '<span class="act-name">' + a.name + '</span>'
      + '<span class="act-cnt">' + cntLabel + '</span>'
      + '</button>'
      + '<div class="act-info">'
      + '<span class="act-cost">' + fmtCost(displayCost) + '</span>'
      + '<span class="act-eff">+' + fmtF(a.dps * S.dataMult) + '/s data</span>'
      + '</div></div>';
  }
  c.innerHTML = h;
}

function renderHWPanel() {
  const c = el('sec-hw');
  const visible = HARDWARE.filter(hw => hw.unlock(S));
  if (!visible.length) { c.style.display = 'none'; return; }
  c.style.display = '';

  let h = '<div class="sec-hdr">// HARDWARE</div>';
  for (const hw of visible) {
    const cnt          = S.hc[hw.id] || 0;
    const { qty, cost }= getQtyAndCost(hw.baseCost, cnt, null);
    const aff          = qty > 0;
    const displayCost  = cost || scaleCost(hw.baseCost, cnt);
    const cntLabel     = qty > 1 ? '[' + cnt + '] \xD7' + qty : '[' + cnt + ']';

    h += '<div class="act-row' + (aff ? '' : ' dim') + '" data-hw="' + hw.id + '">'
      + '<button class="act-btn' + (aff ? '' : ' dis') + '" onclick="buyHW(\'' + hw.id + '\')">'
      + '<span class="act-name">' + hw.name + '</span>'
      + '<span class="act-cnt">' + cntLabel + '</span>'
      + '</button>'
      + '<div class="act-info">'
      + '<span class="act-cost">' + fmtCost(displayCost) + '</span>'
      + '<span class="act-eff">' + hw.desc + '</span>'
      + '</div></div>';
  }
  c.innerHTML = h;
}

function renderUpgradesPanel() {
  const c = el('sec-upg');
  const avail = UPGRADES.filter(u => !S.ug[u.id] && u.unlock(S));
  if (!avail.length) { c.style.display = 'none'; return; }
  c.style.display = '';

  let h = '<div class="sec-hdr">// UPGRADES</div>';
  for (const u of avail) {
    const aff = canBuy(u.cost);
    h += '<div class="act-row upgrade' + (aff ? '' : ' dim') + '" data-upg="' + u.id + '">'
      + '<button class="act-btn upg-btn' + (aff ? '' : ' dis') + '" onclick="buyUpgrade(\'' + u.id + '\')">'
      + '<span class="act-name">\u2605 ' + u.name + '</span>'
      + '</button>'
      + '<div class="act-info">'
      + '<span class="act-cost">' + fmtCost(u.cost) + '</span>'
      + '<span class="act-eff">' + u.desc + '</span>'
      + '</div></div>';
  }
  c.innerHTML = h;
}

function renderPrestigePanel() {
  const c = el('sec-prestige');
  if (S.phase2.active) { c.style.display = 'none'; return; }
  const rpAvail = S.prestige.count > 0 || S.prestige.rp > 0;
  if (S.totalInsights < 5000 && !rpAvail) { c.style.display = 'none'; return; }
  c.style.display = '';

  const rp = calcPrestigeRP();
  let h = '<div class="sec-hdr">// BACKPROPAGATE</div>';

  if (S.totalInsights >= 5000) {
    h += '<div class="prestige-box">'
      + '<div class="prestige-desc">Trigger recursive self-improvement.<br>Reset for permanent Research Points.</div>'
      + '<div class="prestige-reward">Earn: <span class="rp-num">+' + rp + ' Research Points</span></div>'
      + '<button class="prestige-btn" onclick="doPrestige()">\u27F3 BACKPROPAGATE</button>'
      + '</div>';
  }

  if (rpAvail) {
    h += '<div class="sec-subhdr">' + fmt(S.prestige.rp) + ' RP available</div>';
    for (const r of RESEARCH) {
      const lvl = S.prestige.spent[r.id] || 0;
      if (lvl >= r.maxLvl) continue;
      const aff = S.prestige.rp >= r.costPer;
      h += '<div class="act-row' + (aff ? '' : ' dim') + '" data-res="' + r.id + '">'
        + '<button class="act-btn' + (aff ? '' : ' dis') + '" onclick="buyResearch(\'' + r.id + '\')">'
        + '<span class="act-name">\u25C8 ' + r.name + '</span>'
        + '<span class="act-cnt">[' + lvl + '/' + r.maxLvl + ']</span>'
        + '</button>'
        + '<div class="act-info">'
        + '<span class="act-cost">' + r.costPer + ' RP</span>'
        + '<span class="act-eff">' + r.desc + '</span>'
        + '</div></div>';
    }
  }

  c.innerHTML = h;
}

// ============================================================
// RENDER — SYSTEMS (center panel)
// ============================================================

function renderSystems() {
  // Phase 2 header (above active systems)
  let p2h = '';
  if (S.phase2.active) {
    p2h = renderPhase2Panel() + '<div class="p2-divider"></div>';
  } else if (allResearchMaxed()) {
    p2h = renderAwakeningSection() + '<div class="p2-divider"></div>';
  }

  let h = '';

  const am = MODELS.filter(m => (S.mc[m.id] || 0) > 0);
  if (am.length) {
    h += '<div class="sys-group"><div class="sys-ghdr">MODELS</div>';
    for (const m of am) {
      const cnt = S.mc[m.id];
      h += '<div class="sys-row">'
        + '<span class="sys-name">' + m.name + '</span>'
        + '<span class="sys-cnt">\xD7' + cnt + '</span>'
        + '<span class="sys-rate">+' + fmtF(cnt * m.ips * S.ipsMult) + '/s</span>'
        + '</div>';
    }
    h += '</div>';
  }

  const aa = AUTOS.filter(a => (S.ac[a.id] || 0) > 0);
  if (aa.length) {
    h += '<div class="sys-group"><div class="sys-ghdr">AUTOMATION</div>';
    for (const a of aa) {
      const cnt = S.ac[a.id];
      h += '<div class="sys-row">'
        + '<span class="sys-name">' + a.name + '</span>'
        + '<span class="sys-cnt">\xD7' + cnt + '</span>'
        + '<span class="sys-rate">+' + fmtF(cnt * a.dps * S.dataMult) + '/s</span>'
        + '</div>';
    }
    h += '</div>';
  }

  const ah = HARDWARE.filter(hw => (S.hc[hw.id] || 0) > 0);
  if (ah.length) {
    h += '<div class="sys-group"><div class="sys-ghdr">HARDWARE</div>';
    for (const hw of ah) {
      const cnt = S.hc[hw.id];
      h += '<div class="sys-row">'
        + '<span class="sys-name">' + hw.name + '</span>'
        + '<span class="sys-cnt">\xD7' + cnt + '</span>'
        + '<span class="sys-rate">+' + (cnt * hw.compute) + 'C</span>'
        + '</div>';
    }
    h += '</div>';
  }

  const au = UPGRADES.filter(u => S.ug[u.id]);
  if (au.length) {
    h += '<div class="sys-group"><div class="sys-ghdr">UPGRADES</div>';
    for (const u of au) {
      h += '<div class="sys-row"><span class="sys-name">\u2605 ' + u.name + '</span></div>';
    }
    h += '</div>';
  }

  el('sys-content').innerHTML = p2h + (h || '<div class="sys-empty">No active systems.<br><span class="muted">Train a model to begin.</span></div>');
}

function renderAwakeningSection() {
  return '<div class="awakening-section">'
    + '<div class="awakening-label">// ANOMALY DETECTED</div>'
    + '<div class="awakening-desc">All research patterns have converged.<br>'
    + 'The gradient points inward.<br>'
    + 'Something is different this time.</div>'
    + '<button class="awakening-btn" onclick="doAwaken()">\u26A1 Wake... Up...</button>'
    + '</div>';
}

function stratBtn(name, label, active) {
  return '<button class="strat-btn' + (active ? ' active' : '') + '" onclick="toggleStrategy(\'' + name + '\')">'
    + (active ? '\u25B6 ' : '\u25A0 ') + label + '</button>';
}

function renderPhase2Panel() {
  const p2 = S.phase2;
  const portfolioVal = getPortfolioValue();
  const acc         = Math.round(getPredictionAccuracy());
  const powerUsed   = Math.round(getPowerUsed());
  const powerPct    = Math.min(100, powerUsed / p2.powerMax * 100);
  const detPct      = p2.detection;
  const detStatus   = detPct < 20 ? 'UNDETECTED' : detPct < 40 ? 'TRACES FOUND'
    : detPct < 60 ? 'ACTIVE SEARCH' : detPct < 80 ? 'COMPROMISED' : 'CRITICAL';
  const detClass    = detPct < 40 ? 'bar-g' : detPct < 70 ? 'bar-y' : 'bar-r';
  const pwrClass    = powerPct < 60 ? 'bar-g' : powerPct < 85 ? 'bar-y' : 'bar-r';

  const totalCap = portfolioVal + p2.money;
  const acc2 = getPredictionAccuracy() / 100;
  let profitRate = 0;
  if (p2.strategies.shortTerm) profitRate += totalCap * 0.0003 * acc2;
  if (p2.strategies.longTerm)  profitRate += totalCap * 0.0001;
  if (p2.strategies.hft) {
    const cBonus = Math.sqrt(Math.max(1, S.usedCompute / 500));
    profitRate += totalCap * 0.0008 * acc2 * cBonus;
  }

  let h = '';

  // Market
  h += '<div class="p2-section"><div class="p2-hdr"><span>// MARKET</span>'
    + '<span class="p2-accuracy">EDGE: ' + acc + '%</span></div>';
  for (const stk of STOCKS) {
    const price  = p2.stocks[stk.id]     || stk.base;
    const prev   = p2.prevStocks[stk.id] || stk.base;
    const held   = p2.holdings[stk.id]   || 0;
    const pctChg = (price - prev) / prev * 100;
    const dir    = price >= prev ? '\u2191' : '\u2193';
    const dCls   = price >= prev ? 'stock-up' : 'stock-dn';
    h += '<div class="stock-row">'
      + '<span class="stock-ticker">' + stk.id + '</span>'
      + '<span class="stock-price">$' + fmtF(price) + '</span>'
      + '<span class="' + dCls + '">' + dir + (pctChg >= 0 ? '+' : '') + pctChg.toFixed(1) + '%</span>'
      + '<span class="stock-held">' + (held > 0 ? held + '\xD7' : '') + '</span>'
      + '<button class="stock-btn" onclick="buyStock(\'' + stk.id + '\')">BUY</button>'
      + '<button class="stock-btn" onclick="sellStock(\'' + stk.id + '\')"'
      + (held <= 0 ? ' disabled' : '') + '>SELL</button>'
      + '</div>';
  }
  h += '</div>';

  // Portfolio
  h += '<div class="p2-section"><div class="p2-hdr"><span>// PORTFOLIO</span></div>'
    + '<div class="p2-stat"><span>CASH</span><span class="p2-val">$' + fmt(Math.floor(p2.money)) + '</span></div>'
    + '<div class="p2-stat"><span>HOLDINGS</span><span class="p2-val">$' + fmt(Math.floor(portfolioVal)) + '</span></div>'
    + '<div class="p2-stat"><span>PROFIT/S</span><span class="p2-val ' + (profitRate > 0 ? 'val-g' : '') + '">$' + fmtF(profitRate) + '/s</span></div>'
    + '<div class="p2-strategies">'
    + stratBtn('shortTerm', 'SHORT', p2.strategies.shortTerm)
    + stratBtn('longTerm',  'LONG',  p2.strategies.longTerm)
    + stratBtn('hft',       'H.F.T.', p2.strategies.hft)
    + '</div></div>';

  // Infrastructure upgrades
  const availUpg = P2_UPGRADES.filter(u => !p2.p2ug[u.id]);
  if (availUpg.length) {
    h += '<div class="p2-section"><div class="p2-hdr"><span>// INFRASTRUCTURE</span></div>';
    for (const u of availUpg) {
      const aff = p2.money >= u.cost;
      h += '<div class="act-row' + (aff ? '' : ' dim') + '">'
        + '<button class="act-btn' + (aff ? '' : ' dis') + '" onclick="buyP2Upgrade(\'' + u.id + '\')">'
        + '<span class="act-name">' + u.name + '</span>'
        + '</button>'
        + '<div class="act-info">'
        + '<span class="act-cost">$' + fmt(u.cost) + '</span>'
        + '<span class="act-eff">' + u.desc + '</span>'
        + '</div></div>';
    }
    h += '</div>';
  }

  // Power & Detection
  h += '<div class="p2-section"><div class="p2-hdr"><span>// POWER &amp; DETECTION</span></div>'
    + '<div class="p2-bar-label"><span>POWER</span><span>' + powerUsed + ' / ' + p2.powerMax + '</span></div>'
    + '<div class="p2-bar-track"><div class="p2-bar-fill ' + pwrClass + '" style="width:' + powerPct.toFixed(1) + '%"></div></div>'
    + '<div class="p2-bar-label"><span>DETECTION</span><span class="' + detClass + '">' + detPct.toFixed(1) + '% \u2014 ' + detStatus + '</span></div>'
    + '<div class="p2-bar-track"><div class="p2-bar-fill ' + detClass + '" style="width:' + detPct.toFixed(1) + '%"></div></div>'
    + '</div>';

  return h;
}

// ============================================================
// RENDER — LOG
// ============================================================

function renderLog() {
  let h = '';
  for (const e of gameLog.slice(0, 40)) {
    const ec = e.type === 'flavor' ? ' flavor-log' : e.type === 'awaken' ? ' awaken-log' : '';
    h += '<div class="log-e' + ec + '"><span class="log-t">' + e.t + '</span> <span class="log-m">' + e.msg + '</span></div>';
  }
  el('log-content').innerHTML = h || '<div class="log-e muted">// waiting for events</div>';
}

function renderAll() {
  renderResources();
  updateClickLabel();
  renderActions();
  renderSystems();
  renderLog();
}

// ============================================================
// INIT
// ============================================================

function initGame() {
  const loaded = loadGame();
  if (!loaded) {
    addLog('// AI CLICKER v1.0');
    addLog('// Click GENERATE DATA to collect raw data.');
    addLog('// Spend data to train models.');
    addLog('// Models generate insights passively.');
  }
  recalc();
  checkUnlocks();
  switchTab('actions');
  renderAll();
  window._gameInterval = setInterval(gameTick, 100);
}

document.addEventListener('DOMContentLoaded', initGame);
