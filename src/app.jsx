import { useState } from "react";

const _fontLink = document.createElement("link");
_fontLink.rel = "stylesheet";
_fontLink.href = "https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@700;900&display=swap";
document.head.appendChild(_fontLink);

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycby4Na_66YM7RghIhARzcw1hAdhWRU73b-zoK8l0dEuwk173JOcfW11pdiihtKF_jWED/exec";

const COR = { laranja: "#FF4800", marrom: "#4D2000", fundo: "#111", card: "#1a1a1a", texto: "#F2F2F2", sub: "#aaa" };
const FONT = "'Asap Condensed', sans-serif";

const SALGADOS = [
  { id: "coxinha_frango",    nome: "Coxinha Frango",       preco: 4.00, cmv: 0.72 },
  { id: "coxinha_carne",     nome: "Coxinha Carne",        preco: 4.00, cmv: 0.98 },
  { id: "coxinha_queijo",    nome: "Coxinha Queijo",       preco: 4.00, cmv: 1.07 },
  { id: "coxinha_calabresa", nome: "Coxinha Calabresa",    preco: 4.00, cmv: 0.99 },
  { id: "coxinha_bacon",     nome: "Coxinha Fr/Bacon",     preco: 4.00, cmv: 0.90 },
  { id: "travesseiro",       nome: "Travesseiro Queijo",   preco: 4.00, cmv: 1.11 },
  { id: "enrolado_salsicha", nome: "Enrolado Salsicha",    preco: 4.00, cmv: 0.85 },
  { id: "enrolado_presunto", nome: "Enrolado Pres/Queijo", preco: 4.00, cmv: 1.12 },
  { id: "kibe",              nome: "Kibe",                 preco: 4.00, cmv: 0.36 },
];

const BEBIDAS = [
  { id: "suco_maquina", nome: "Suco Maquina",    preco: 2.00,  cmv: 0.80 },
  { id: "agua_sg",      nome: "Agua s/ Gas",      preco: 3.50,  cmv: 0.98 },
  { id: "agua_cg",      nome: "Agua c/ Gas",      preco: 3.50,  cmv: 1.15 },
  { id: "coca_200",     nome: "Coca 200ml",        preco: 4.50,  cmv: 1.63 },
  { id: "coca_350",     nome: "Coca 350ml",        preco: 7.00,  cmv: 3.32 },
  { id: "coca_ks",      nome: "Coca KS 250ml",     preco: 6.00,  cmv: 3.32 },
  { id: "coca_2l",      nome: "Coca 2L",           preco: 18.00, cmv: 9.80 },
  { id: "fanta_200",    nome: "Fanta 200ml",       preco: 4.50,  cmv: 1.51 },
  { id: "fanta_2l",     nome: "Fanta 2L",          preco: 18.00, cmv: 8.02 },
  { id: "sprite_200",   nome: "Sprite 200ml",      preco: 4.50,  cmv: 1.51 },
  { id: "guarana_350",  nome: "Guarana 350ml",     preco: 7.00,  cmv: 3.33 },
  { id: "guarana_2l",   nome: "Guarana 2L",        preco: 18.00, cmv: 7.99 },
  { id: "ouro_250",     nome: "Ouro Verde 250ml",  preco: 4.00,  cmv: 1.63 },
  { id: "ouro_2l",      nome: "Ouro Verde 2L",     preco: 12.00, cmv: 5.50 },
];

const DOCES = [
  { id: "brig_unit",  nome: "Brigadeiro",   preco: 2.00,  cmv: 0.22 },
  { id: "ninho_unit", nome: "Ninho",        preco: 2.00,  cmv: 0.20 },
  { id: "casad_unit", nome: "Casadinho",    preco: 2.00,  cmv: 0.19 },
  { id: "prest_unit", nome: "Prestigio",    preco: 2.00,  cmv: 0.20 },
  { id: "beij_unit",  nome: "Beijinho",     preco: 2.00,  cmv: 0.19 },
  { id: "kit6",       nome: "Kit 6 Doces",  preco: 10.00, cmv: 1.19 },
  { id: "kit15",      nome: "Kit 15 Doces", preco: 25.00, cmv: 2.97 },
  { id: "halls",      nome: "Halls",        preco: 2.50,  cmv: 1.22 },
  { id: "trident",    nome: "Trident",      preco: 3.00,  cmv: 1.82 },
  { id: "pao_mel",    nome: "Pao de Mel",   preco: 10.00, cmv: 4.30 },
];

const TODOS = [...SALGADOS, ...BEBIDAS, ...DOCES];

function tipoDoItem(id) {
  if (SALGADOS.find(s => s.id === id)) return "salgado";
  if (BEBIDAS.find(b => b.id === id)) return "bebida";
  return "doce";
}

function fmt(v) { return "R$ " + v.toFixed(2).replace(".", ","); }

async function enviarParaSheets(payload) {
  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) { console.error("Sheets error", e); }
}

function btnCircle(bg) {
  return { width: 36, height: 36, borderRadius: "50%", background: bg, color: "#fff", border: "none", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 };
}

// ============================================================
// ABA HOJE
// ============================================================
function AbaHoje({ vendas, onFechar }) {
  const [fechado, setFechado] = useState(false);
  const totalVendas = vendas.reduce((s, v) => s + (v.consumo ? 0 : v.total), 0);
  const totalCMV   = vendas.reduce((s, v) => s + v.cmv_total, 0);
  const margem     = totalVendas > 0 ? ((totalVendas - totalCMV) / totalVendas * 100).toFixed(1) : 0;
  const qtdItens   = vendas.reduce((s, v) => s + v.quantidade, 0);
  const ranking = [...vendas].filter(v => !v.consumo).sort((a, b) => (b.total - b.cmv_total) - (a.total - a.cmv_total)).slice(0, 5);

  function fecharDia() {
    const linhas = vendas.map(v => `${v.sabor}: ${v.quantidade}un${v.consumo ? " (consumo)" : " - " + fmt(v.total)}`).join("\n");
    const resumo = `=== VO LINDA - FECHAMENTO ===\n${linhas}\n\nTOTAL: ${fmt(totalVendas)}\nMARGEM: ${margem}%`;
    navigator.clipboard.writeText(resumo).catch(() => {});
    setFechado(true);
    onFechar();
    setTimeout(() => setFechado(false), 2000);
  }

  return (
    <div style={{ padding: "0 4px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[{ label: "Faturamento", val: fmt(totalVendas) }, { label: "Margem", val: margem + "%" }, { label: "Itens", val: qtdItens }].map(k => (
          <div key={k.label} style={{ background: COR.card, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
            <div style={{ color: COR.laranja, fontWeight: 700, fontSize: 16 }}>{k.val}</div>
            <div style={{ color: COR.sub, fontSize: 11 }}>{k.label}</div>
          </div>
        ))}
      </div>
      {ranking.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: COR.sub, fontSize: 12, marginBottom: 6 }}>TOP MARGEM</div>
          {ranking.map((v, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #222" }}>
              <span style={{ color: COR.texto, fontSize: 13 }}>{i + 1}. {v.sabor}</span>
              <span style={{ color: COR.laranja, fontSize: 13, fontWeight: 700 }}>{fmt(v.total - v.cmv_total)}</span>
            </div>
          ))}
        </div>
      )}
      {vendas.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: COR.sub, fontSize: 12, marginBottom: 6 }}>HISTORICO</div>
          {[...vendas].reverse().map((v, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #1e1e1e" }}>
              <span style={{ color: v.consumo ? COR.sub : COR.texto, fontSize: 12 }}>{v.sabor} x {v.quantidade}{v.consumo ? " (C)" : ""}</span>
              <span style={{ color: v.consumo ? COR.sub : COR.laranja, fontSize: 12 }}>{v.consumo ? "consumo" : fmt(v.total)}</span>
            </div>
          ))}
        </div>
      )}
      <button onClick={fecharDia} style={{ width: "100%", padding: "14px", background: COR.marrom, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
        {fechado ? "Copiado! Cole no SAIPOS" : "Fechar Dia"}
      </button>
    </div>
  );
}

// ============================================================
// APP PRINCIPAL
// ============================================================
const ABAS = [
  { id: "salgados", emoji: "🥟", label: "Salgados" },
  { id: "bebidas",  emoji: "🥤", label: "Bebidas"  },
  { id: "doces",    emoji: "🍫", label: "Doces"    },
  { id: "hoje",     emoji: "📊", label: "Hoje"     },
];

export default function App() {
  const [aba, setAba] = useState("salgados");
  const [vendas, setVendas] = useState([]);
  const [carrinho, setCarrinho] = useState({}); // { id: qtd }
  const [confirmando, setConfirmando] = useState(false);
  const [ok, setOk] = useState(false);

  const totalItens = Object.values(carrinho).reduce((s, q) => s + q, 0);
  const totalValor = Object.entries(carrinho).reduce((s, [id, qtd]) => {
    const item = TODOS.find(i => i.id === id);
    return s + (item ? item.preco * qtd : 0);
  }, 0);

  function setQtd(id, qtd) {
    setCarrinho(prev => {
      const next = { ...prev };
      if (qtd <= 0) delete next[id];
      else next[id] = qtd;
      return next;
    });
  }

  async function confirmarPedido() {
    if (totalItens === 0 || confirmando) return;
    setConfirmando(true);
    const itensCarrinho = Object.entries(carrinho);
    for (const [id, qtd] of itensCarrinho) {
      const item = TODOS.find(i => i.id === id);
      if (!item) continue;
      const tipo = tipoDoItem(id);
      const payload = { tipo, sabor: item.nome, quantidade: qtd, preco_unit: item.preco, total: qtd * item.preco, cmv_total: qtd * item.cmv, consumo: false };
      await enviarParaSheets(payload);
      setVendas(prev => [...prev, payload]);
    }
    setCarrinho({});
    setOk(true);
    setConfirmando(false);
    setTimeout(() => { setOk(false); setAba("salgados"); }, 1200);
  }

  const abaAtual = aba;
  const itensDaAba = abaAtual === "salgados" ? SALGADOS : abaAtual === "bebidas" ? BEBIDAS : DOCES;

  return (
    <div style={{ background: COR.fundo, minHeight: "100vh", maxWidth: 480, margin: "0 auto", fontFamily: FONT, paddingBottom: totalItens > 0 ? 130 : 80 }}>
      {/* HEADER */}
      <div style={{ background: COR.marrom, padding: "16px 16px 12px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ color: COR.laranja, fontWeight: 900, fontSize: 22, letterSpacing: 1 }}>VO LINDA</div>
        <div style={{ color: "#a07050", fontSize: 12 }}>Salgados - Balcao</div>
      </div>

      {/* CONTEUDO */}
      <div style={{ padding: "16px" }}>
        {aba !== "hoje" && itensDaAba.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            qtd={carrinho[item.id] || 0}
            isSalgado={aba === "salgados"}
            onChange={qtd => setQtd(item.id, qtd)}
          />
        ))}
        {aba === "hoje" && <AbaHoje vendas={vendas} onFechar={() => setVendas([])} />}
      </div>

      {/* BOTAO CONFIRMAR PEDIDO (flutuante) */}
      {totalItens > 0 && aba !== "hoje" && (
        <div style={{ position: "fixed", bottom: 64, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, padding: "0 16px", zIndex: 20 }}>
          <button
            onClick={confirmarPedido}
            disabled={confirmando}
            style={{ width: "100%", padding: "15px", background: ok ? "#2a7a2a" : COR.laranja, color: "#fff", border: "none", borderRadius: 12, fontWeight: 900, fontSize: 16, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(255,72,0,0.4)" }}
          >
            <span>{ok ? "Salvo!" : `${totalItens} ${totalItens === 1 ? "item" : "itens"}`}</span>
            <span>{ok ? "Proximo cliente" : `Confirmar Pedido - ${fmt(totalValor)}`}</span>
          </button>
        </div>
      )}

      {/* NAV */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: COR.marrom, display: "flex", borderTop: `2px solid ${COR.laranja}` }}>
        {ABAS.map(a => (
          <button key={a.id} onClick={() => setAba(a.id)} style={{ flex: 1, padding: "10px 0", border: "none", cursor: "pointer", background: aba === a.id ? COR.laranja : "transparent", color: aba === a.id ? "#fff" : "#a07050", fontSize: 11, fontWeight: 700 }}>
            <div style={{ fontSize: 18 }}>{a.emoji}</div>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// ITEM CARD — só + e - , sem confirmar individual
// ============================================================
function ItemCard({ item, qtd, isSalgado, onChange }) {
  const margem = Math.round(((item.preco - item.cmv) / item.preco) * 100);
  return (
    <div style={{ background: COR.card, border: `1px solid ${qtd > 0 ? COR.laranja : "#2a2a2a"}`, borderRadius: 12, padding: "12px 14px", marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: COR.texto, fontWeight: 700, fontSize: 15 }}>{item.nome}</div>
          <div style={{ color: COR.sub, fontSize: 12 }}>{fmt(item.preco)} - margem {margem}%</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => onChange(qtd - 1)} style={btnCircle("#2a2a2a")}>-</button>
          <span style={{ color: qtd > 0 ? COR.laranja : COR.texto, fontWeight: 900, fontSize: 20, minWidth: 28, textAlign: "center" }}>{qtd}</span>
          <button onClick={() => onChange(qtd + 1)} style={btnCircle(COR.laranja)}>+</button>
          {isSalgado && (
            <button onClick={() => onChange(qtd + 5)} style={{ ...btnCircle("#333"), width: "auto", borderRadius: 8, padding: "0 10px", fontSize: 13 }}>+5</button>
          )}
        </div>
      </div>
    </div>
  );
}
