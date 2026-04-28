import { useState, useEffect, useCallback } from "react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwVTevvISr_WZ3Zr819wGTIS4t_T-qDul_sw6no7tC-l-Dzgtd06OSZ0BuVA-jw6TQB/exec";
const PRECO = 4.00;

const SABORES = [
  { id: "frango", nome: "Coxinha", sub: "Frango", emoji: "🍗", cor: "#f59e0b" },
  { id: "carne", nome: "Coxinha", sub: "Carne", emoji: "🥩", cor: "#ef4444" },
  { id: "queijo", nome: "Coxinha", sub: "Queijo/Milho/Bacon", emoji: "🧀", cor: "#fbbf24" },
  { id: "calabresa", nome: "Coxinha", sub: "Calabresa", emoji: "🌶", cor: "#dc2626" },
  { id: "frango_bacon", nome: "Coxinha", sub: "Frango/Bacon", emoji: "🥓", cor: "#f97316" },
  { id: "travesseiro", nome: "Travesseiro", sub: "Queijo", emoji: "🧇", cor: "#e879f9" },
  { id: "salsicha", nome: "Enrolado", sub: "Salsicha", emoji: "🌭", cor: "#4ade80" },
  { id: "presunto", nome: "Enrolado", sub: "Presunto/Queijo", emoji: "🥪", cor: "#38bdf8" },
  { id: "kibe", nome: "Kibe", sub: "", emoji: "🫓", cor: "#a78bfa" },
];

const CMV = {
  frango: 0.72, carne: 0.98, queijo: 1.07, calabresa: 0.99,
  frango_bacon: 0.90, travesseiro: 1.11, salsicha: 0.85,
  presunto: 1.12, kibe: 0.36,
};
const dataHoje = () => new Date().toISOString().split("T")[0];
const fmtData  = iso => { const [y,m,d] = iso.split("-"); return `${d}/${m}/${y}`; };
const fmtR$    = v => `R$ ${Number(v).toFixed(2)}`;
const vazio    = () => Object.fromEntries(SABORES.map(s => [s.id, 0]));

function metricas(c) {
  const un  = Object.values(c).reduce((a, b) => a + b, 0);
  const rec = un * PRECO;
  const cst = SABORES.reduce((a, s) => a + (c[s.id] || 0) * CMV[s.id], 0);
  const luc = rec - cst;
  const mg  = rec > 0 ? ((luc / rec) * 100).toFixed(1) : "0.0";
  return { un, rec, cst, luc, mg };
}

function semana(iso) {
  const d   = new Date(iso + "T12:00:00");
  const day = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - day);
  const ys  = new Date(d.getFullYear(), 0, 1);
  return `${d.getFullYear()}-S${String(Math.ceil((((d - ys) / 864e5) + 1) / 7)).padStart(2, "0")}`;
}
const mes = iso => iso.slice(0, 7);

function registrosParaHist(registros) {
  const hist = {};
  registros.forEach(r => {
    const data = r.data;
    if (!data) return;
    if (!hist[data]) hist[data] = vazio();
    SABORES.forEach(s => {
      hist[data][s.id] = (hist[data][s.id] || 0) + (Number(r[s.id]) || 0);
    });
  });
  return hist;
}

function agregar(hist, fn) {
  const soma = vazio();
  Object.entries(hist).forEach(([d, c]) => {
    if (fn(d)) SABORES.forEach(s => { soma[s.id] += c[s.id] || 0; });
  });
  return soma;
}
function Kpi({ val, label, cor = "#e2e2f0" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: cor }}>{val}</span>
      <span style={{ fontSize: 10, color: "#555" }}>{label}</span>
    </div>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 24, background: "#1a1a2e" }} />;
}

function MetricasBox({ c }) {
  const { un, rec, cst, luc, mg } = metricas(c);
  const rows = [
    ["Unidades", `${un} un`, "#e2e2f0"],
    ["Receita bruta", fmtR$(rec), "#4ade80"],
    ["Custo (CMV)", fmtR$(cst), "#fb923c"],
    ["Lucro estimado", fmtR$(luc), "#a78bfa"],
    ["Margem", `${mg}%`, parseFloat(mg) > 70 ? "#4ade80" : "#fb923c"],
  ];
  return (
    <div style={{ marginBottom: 16 }}>
      {rows.map(([l, v, cor]) => (
        <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #0f0f1a" }}>
          <span style={{ color: "#777", fontSize: 13 }}>{l}</span>
          <span style={{ color: cor, fontWeight: 700, fontSize: 14, fontFamily: "'Syne',sans-serif" }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function Ranking({ c }) {
  const { un: total } = metricas(c);
  const itens = SABORES.filter(s => c[s.id] > 0).sort((a, b) => c[b.id] - c[a.id]);
  if (!itens.length) return <p style={{ color: "#333", fontSize: 13, textAlign: "center", padding: "20px 0" }}>Nenhuma venda registrada</p>;
  return (
    <div>
      {itens.map(s => {
        const un  = c[s.id];
        const rec = un * PRECO;
        const luc = rec - un * CMV[s.id];
        const mg  = ((luc / rec) * 100).toFixed(0);
        const pct = total > 0 ? ((un / total) * 100).toFixed(0) : 0;
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #0f0f1a" }}>
            <span style={{ fontSize: 18, width: 26, textAlign: "center" }}>{s.emoji}</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, color: "#ccc", display: "block", marginBottom: 4 }}>{s.nome} {s.sub}</span>
              <div style={{ height: 3, background: "#1a1a2e", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: s.cor, borderRadius: 2 }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
              <span style={{ color: s.cor, fontWeight: 700, fontSize: 13 }}>{un} un</span>
              <span style={{ color: "#555", fontSize: 11 }}>{fmtR$(rec)}</span>
              <span style={{ color: "#4ade80", fontSize: 10 }}>{mg}% mg</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Painel({ titulo, c, onVoltar }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
      <div style={{ background: "#0d0d1a", border: "1px solid #1a1a2e", borderRadius: 14, padding: 16 }}>
        {onVoltar && (
          <button onClick={onVoltar} style={{ background: "none", border: "none", color: "#f59e0b", fontSize: 12, marginBottom: 12, padding: 0 }}>
            ← Voltar
          </button>
        )}
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, marginBottom: 12 }}>{titulo}</div>
        <MetricasBox c={c} />
        <div style={{ fontSize: 10, fontWeight: 600, color: "#444", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Por sabor</div>
        <Ranking c={c} />
      </div>
    </div>
  );
}
const TABS = [
  { id: "venda", label: "⚡ Venda" },
  { id: "semana", label: "📅 Semana" },
  { id: "mes", label: "📆 Mês" },
  { id: "historico", label: "📚 Histórico" },
];

export default function App() {
  const [hist, setHist] = useState({});
  const [carrinho, setCarrinho] = useState(vazio);
  const [view, setView] = useState("venda");
  const [pulso, setPulso] = useState(null);
  const [diaDetalhe, setDiaDetalhe] = useState(null);
  const [status, setStatus] = useState(null);
  const [syncStatus, setSyncStatus] = useState("loading");

  const hoje = dataHoje();

  const fetchHist = useCallback(async () => {
    try {
      const resp = await fetch(SCRIPT_URL);
      const json = await resp.json();
      if (json.ok) {
        setHist(registrosParaHist(json.registros));
        setSyncStatus("ok");
      } else {
        setSyncStatus("err");
      }
    } catch {
      setSyncStatus("err");
    }
  }, []);

  useEffect(() => {
    fetchHist();
    const interval = setInterval(fetchHist, 30000);
    return () => clearInterval(interval);
  }, [fetchHist]);

  const diaHj = hist[hoje] || vazio();
  const { un, rec, mg } = metricas(diaHj);
  const totalCarrinho = Object.values(carrinho).reduce((a, b) => a + b, 0);

  const sw = semana(hoje);
  const ms = mes(hoje);
  const cSw = agregar(hist, d => semana(d) === sw);
  const cMs = agregar(hist, d => mes(d) === ms);

  const diasHist = Object.keys(hist)
    .filter(d => Object.values(hist[d]).some(v => v > 0))
    .sort((a, b) => b.localeCompare(a));

  function tap(id) {
    setCarrinho(p => ({ ...p, [id]: p[id] + 1 }));
    setPulso(id);
    setTimeout(() => setPulso(null), 200);
  }

  function undo(id) {
    if (!carrinho[id]) return;
    setCarrinho(p => ({ ...p, [id]: p[id] - 1 }));
  }

  async function confirmar() {
    if (!totalCarrinho || status === "sending") return;
    setStatus("sending");
    const m = metricas(carrinho);
    const payload = {
      data: hoje,
      total_un: m.un,
      receita: +m.rec.toFixed(2),
      custo: +m.cst.toFixed(2),
      lucro: +m.luc.toFixed(2),
      margem: +m.mg,
      frango: carrinho.frango,
      carne: carrinho.carne,
      queijo: carrinho.queijo,
      calabresa: carrinho.calabresa,
      frango_bacon: carrinho.frango_bacon,
      travesseiro: carrinho.travesseiro,
      salsicha: carrinho.salsicha,
      presunto: carrinho.presunto,
      kibe: carrinho.kibe,
    };
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus("ok");
      setCarrinho(vazio());
      setTimeout(() => { setStatus(null); fetchHist(); }, 2000);
    } catch {
      setStatus("err");
      setTimeout(() => setStatus(null), 4000);
    }
  }
  return (
    <div style={C.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
        body{background:#080810;font-family:'DM Sans',sans-serif}
        button{cursor:pointer;font-family:inherit}
        button:disabled{opacity:.25;cursor:not-allowed}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#222;border-radius:2px}
      `}</style>
      <header style={C.header}>
        <div style={C.htop}>
          <div>
            <div style={C.logo}>VÓ LINDA</div>
            <div style={C.sub}>
              {fmtData(hoje)}
              <span style={{ marginLeft: 6, fontSize: 9, color: syncStatus === "ok" ? "#4ade80" : syncStatus === "err" ? "#ef4444" : "#555" }}>
                {syncStatus === "ok" ? "● online" : syncStatus === "err" ? "● offline" : "● carregando..."}
              </span>
            </div>
          </div>
          <div style={C.kpis}>
            <Kpi val={un} label="un hoje" />
            <Divider />
            <Kpi val={fmtR$(rec)} label="receita" cor="#4ade80" />
            <Divider />
            <Kpi val={`${mg}%`} label="margem" cor="#a78bfa" />
          </div>
        </div>
        <nav style={C.nav}>
          {TABS.map(t => (
            <button key={t.id} style={{ ...C.tab, ...(view === t.id ? C.tabOn : {}) }} onClick={() => { setView(t.id); setDiaDetalhe(null); }}>
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      {view === "venda" && (<>
        {totalCarrinho > 0 && (
          <div style={C.carBar}>
            <span style={C.carTxt}>🛒 {totalCarrinho} un — {fmtR$(totalCarrinho * PRECO)}</span>
            <button style={{ ...C.btnConfirm, opacity: status === "sending" ? .5 : 1 }} onClick={confirmar} disabled={status === "sending"}>
              {status === "sending" ? "⏳" : "✓ Confirmar"}
            </button>
          </div>
        )}
        {status === "ok" && <div style={C.stOk}>✅ Registrado na planilha!</div>}
        {status === "err" && <div style={C.stErr}>❌ Erro — tenta de novo.</div>}
        <div style={C.grid}>
          {SABORES.map(s => {
            const n = carrinho[s.id];
            const diaN = diaHj[s.id] || 0;
            const ativo = pulso === s.id;
            return (
              <div key={s.id} style={{ ...C.card, borderColor: n > 0 ? s.cor : "#1e1e2e", transform: ativo ? "scale(0.93)" : "scale(1)", transition: "transform .15s,border-color .2s" }}>
                <button style={C.tapBtn} onClick={() => tap(s.id)}>
                  <div style={{ ...C.dot, background: s.cor, opacity: n > 0 ? 1 : .2 }} />
                  <div style={{ fontSize: 30, lineHeight: 1 }}>{s.emoji}</div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <span style={C.nome}>{s.nome}</span>
                    {s.sub && <span style={C.subNome}>{s.sub}</span>}
                  </div>
                  <div style={{ ...C.count, color: n > 0 ? s.cor : "#2a2a2a" }}>{n || "·"}</div>
                </button>
                <div style={C.ctrl}>
                  <button style={C.btnMenos} onClick={() => undo(s.id)} disabled={!n}>−</button>
                  <span style={{ fontSize: 10, color: "#444" }}>hoje: {diaN}</span>
                </div>
              </div>
            );
          })}
        </div>
      </>)}
      {view === "semana" && <Painel titulo={`Semana ${sw}`} c={cSw} />}
      {view === "mes" && <Painel titulo={`Mês ${ms}`} c={cMs} />}
      {view === "historico" && !diaDetalhe && (
        <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
          <div style={{ background: "#0d0d1a", border: "1px solid #1a1a2e", borderRadius: 14, padding: 16 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, marginBottom: 12 }}>📚 Histórico</div>
            {syncStatus === "loading" && <p style={{ color: "#555", fontSize: 13, textAlign: "center", padding: 20 }}>Carregando...</p>}
            {!diasHist.length && syncStatus !== "loading" && <p style={{ color: "#333", fontSize: 13, textAlign: "center", padding: 20 }}>Sem registros ainda</p>}
            {diasHist.map(d => {
              const { un, rec } = metricas(hist[d]);
              return (
                <button key={d} onClick={() => setDiaDetalhe(d)} style={{ width: "100%", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #0f0f1a", color: "inherit" }}>
                  <div>
                    <div style={{ color: "#ccc", fontWeight: 600, fontSize: 14 }}>{fmtData(d)}</div>
                    <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>{un} unidades</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#4ade80", fontWeight: 700, fontFamily: "'Syne',sans-serif", fontSize: 14 }}>{fmtR$(rec)}</div>
                    <div style={{ color: "#555", fontSize: 11 }}>→</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {view === "historico" && diaDetalhe && (
        <Painel titulo={fmtData(diaDetalhe)} c={hist[diaDetalhe] || vazio()} onVoltar={() => setDiaDetalhe(null)} />
      )}
    </div>
  );
}

const C = {
  root: { minHeight: "100vh", background: "#080810", color: "#e2e2f0", display: "flex", flexDirection: "column", fontFamily: "'DM Sans',sans-serif", maxWidth: 480, margin: "0 auto" },
  header: { background: "#0d0d1a", borderBottom: "1px solid #1a1a2e", padding: "14px 14px 0", position: "sticky", top: 0, zIndex: 10 },
  htop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  logo: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17, color: "#f59e0b", letterSpacing: 2 },
  sub: { fontSize: 10, color: "#444", marginTop: 2 },
  kpis: { display: "flex", alignItems: "center", gap: 8 },
  nav: { display: "flex" },
  tab: { flex: 1, background: "none", border: "none", color: "#555", padding: "9px 0", fontSize: 11, fontWeight: 600, borderBottom: "2px solid transparent", transition: "all .2s" },
  tabOn: { color: "#f59e0b", borderBottomColor: "#f59e0b" },
  carBar: { background: "#1a1200", borderBottom: "1px solid #f59e0b44", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  carTxt: { color: "#f59e0b", fontWeight: 700, fontSize: 14, fontFamily: "'Syne',sans-serif" },
  btnConfirm: { background: "#f59e0b", border: "none", color: "#000", padding: "8px 18px", borderRadius: 8, fontWeight: 700, fontSize: 13 },
  stOk: { background: "#0a2a0a", borderBottom: "1px solid #4ade8055", color: "#4ade80", padding: "8px 14px", fontSize: 12 },
  stErr: { background: "#2a0a0a", borderBottom: "1px solid #ef444455", color: "#ef4444", padding: "8px 14px", fontSize: 12 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 12, alignContent: "start" },
  card: { background: "#0d0d1a", border: "1px solid #1e1e2e", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" },
  tapBtn: { background: "none", border: "none", color: "#e2e2f0", padding: "14px 14px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: "100%", position: "relative" },
  dot: { position: "absolute", top: 10, right: 10, width: 7, height: 7, borderRadius: "50%" },
  nome: { fontSize: 10, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: .5 },
  subNome: { fontSize: 9, color: "#555" },
  count: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 34, lineHeight: 1, marginTop: 4 },
  ctrl: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px 10px" },
  btnMenos: { background: "#1a1a2e", border: "none", color: "#777", width: 26, height: 26, borderRadius: 7, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" },
};
