
import { useState } from "react";

const _fontLink = document.createElement("link");
_fontLink.rel = "stylesheet";
_fontLink.href = "https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@700;900&display=swap";
document.head.appendChild(_fontLink);

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby4Na_66YM7RghIhARzcw1hAdhWRU73b-zoK8l0dEuwk173JOcfW11pdiihtKF_jWED/exec";

const COR = { laranja: "#FF4800", marrom: "#4D2000", fundo: "#111", card: "#1a1a1a", texto: "#F2F2F2", sub: "#aaa" };
const FONT = "'Asap Condensed', sans-serif";
const fmt = (v) => `R$ ${Number(v).toFixed(2).replace(".", ",")}`;

const SALGADOS = [
  { id: "coxinha_frango",    nome: "Coxinha Frango",       preco: 4.00, cmv: 0.72, tipo: "salgado" },
  { id: "coxinha_carne",     nome: "Coxinha Carne",        preco: 4.00, cmv: 0.98, tipo: "salgado" },
  { id: "coxinha_queijo",    nome: "Coxinha Queijo",       preco: 4.00, cmv: 1.07, tipo: "salgado" },
  { id: "coxinha_calabresa", nome: "Coxinha Calabresa",    preco: 4.00, cmv: 0.99, tipo: "salgado" },
  { id: "coxinha_bacon",     nome: "Coxinha Fr/Bacon",     preco: 4.00, cmv: 0.90, tipo: "salgado" },
  { id: "travesseiro",       nome: "Travesseiro Queijo",   preco: 4.00, cmv: 1.11, tipo: "salgado" },
  { id: "enrolado_salsicha", nome: "Enrolado Salsicha",    preco: 4.00, cmv: 0.85, tipo: "salgado" },
  { id: "enrolado_presunto", nome: "Enrolado Pres/Queijo", preco: 4.00, cmv: 1.12, tipo: "salgado" },
  { id: "kibe",              nome: "Kibe",                 preco: 4.00, cmv: 0.36, tipo: "salgado" },
];

const BEBIDAS = [
  { id: "suco_maquina",  nome: "Suco Máquina",      preco: 2.00,  cmv: 0.28, tipo: "bebida" },
  { id: "agua_sg",       nome: "Água s/ Gás",        preco: 3.50,  cmv: 0.98, tipo: "bebida" },
  { id: "agua_cg",       nome: "Água c/ Gás",        preco: 3.50,  cmv: 1.15, tipo: "bebida" },
  { id: "coca_200",      nome: "Coca 200ml",         preco: 4.00,  cmv: 1.63, tipo: "bebida" },
  { id: "coca_350",      nome: "Coca 350ml",         preco: 6.00,  cmv: 3.32, tipo: "bebida" },
  { id: "coca_ks",       nome: "Coca KS 250ml",      preco: 5.00,  cmv: 3.32, tipo: "bebida" },
  { id: "coca_2l",       nome: "Coca 2L",            preco: 16.00, cmv: 9.80, tipo: "bebida" },
  { id: "fanta_200",     nome: "Fanta 200ml",        preco: 4.00,  cmv: 1.51, tipo: "bebida" },
  { id: "fanta_2l",      nome: "Fanta 2L",           preco: 16.00, cmv: 8.02, tipo: "bebida" },
  { id: "sprite_200",    nome: "Sprite 200ml",       preco: 4.00,  cmv: 1.51, tipo: "bebida" },
  { id: "guarana_350",   nome: "Guaraná 350ml",      preco: 6.00,  cmv: 3.33, tipo: "bebida" },
  { id: "guarana_2l",    nome: "Guaraná 2L",         preco: 16.00, cmv: 7.99, tipo: "bebida" },
  { id: "ouro_250",      nome: "Ouro Verde 250ml",   preco: 3.00,  cmv: 1.63, tipo: "bebida" },
  { id: "ouro_2l",       nome: "Ouro Verde 2L",      preco: 12.00, cmv: 5.50, tipo: "bebida" },
];

const DOCES = [
  { id: "brigadeiro",  nome: "Brigadeiro",     preco: 2.00,  cmv: 0.22, tipo: "doce" },
  { id: "ninho",       nome: "Ninho",          preco: 2.00,  cmv: 0.20, tipo: "doce" },
  { id: "casadinho",   nome: "Casadinho",      preco: 2.00,  cmv: 0.19, tipo: "doce" },
  { id: "prestigio",   nome: "Prestígio",      preco: 2.00,  cmv: 0.20, tipo: "doce" },
  { id: "beijinho",    nome: "Beijinho",       preco: 2.00,  cmv: 0.19, tipo: "doce" },
  { id: "kit6",        nome: "Kit 6 Doces",    preco: 10.00, cmv: 1.19, tipo: "doce" },
  { id: "kit15",       nome: "Kit 15 Doces",   preco: 25.00, cmv: 2.97, tipo: "doce" },
  { id: "halls",       nome: "Halls",          preco: 2.50,  cmv: 1.22, tipo: "doce" },
  { id: "trident",     nome: "Trident",        preco: 3.00,  cmv: 1.82, tipo: "doce" },
  { id: "pao_de_mel",  nome: "Pão de Mel",     preco: 8.00,  cmv: 4.30, tipo: "doce" },
];

async function enviarParaSheets(payload) {
  try {
    await fetch(SCRIPT_URL, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) { console.error("Erro ao enviar ao Sheets:", e); }
}

const btnCircle = (bg) => ({
  width: 32, height: 32, borderRadius: 16, border: "none",
  background: bg, color: "#fff", fontWeight: 700, fontSize: 18,
  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
});
const btnFlat = (bg, extra = {}) => ({
  border: "none", borderRadius: 8, padding: "8px 0", background: bg,
  color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
  fontFamily: FONT, letterSpacing: 0.5, transition: "opacity 0.15s", ...extra,
});

function ItemCard({ item, onAddCarrinho, onConsumido }) {
  const [qtd, setQtd] = useState(0);
  const [msg, setMsg] = useState(null);
  const inc = () => setQtd((q) => q + 1);
  const dec = () => setQtd((q) => Math.max(0, q - 1));

  function adicionarAoCarrinho() {
    if (qtd === 0) return;
    onAddCarrinho({ item, qtd });
    setMsg("adicionado"); setQtd(0);
    setTimeout(() => setMsg(null), 1500);
  }

  async function registrarConsumo() {
    if (qtd === 0) return;
    const payload = { tipo: "consumo", sabor: item.nome, categoria: item.tipo, quantidade: qtd, preco_unit: 0, total: 0, cmv_total: qtd * item.cmv, consumo: true, timestamp: new Date().toISOString() };
    await enviarParaSheets(payload);
    onConsumido(payload);
    setMsg("consumo"); setQtd(0);
    setTimeout(() => setMsg(null), 1500);
  }

  const temQtd = qtd > 0;
  const corBorda = msg === "consumo" ? "#888" : msg === "adicionado" ? COR.laranja : temQtd ? COR.laranja : "#2a2a2a";

  return (
    <div style={{ background: COR.card, border: `1px solid ${corBorda}`, borderRadius: 12, padding: "12px 14px", marginBottom: 10, transition: "border-color 0.2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <div style={{ color: COR.texto, fontWeight: 700, fontSize: 15, fontFamily: FONT }}>{item.nome}</div>
          <div style={{ color: COR.sub, fontSize: 12 }}>{fmt(item.preco)}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={dec} style={btnCircle("#2a2a2a")}>−</button>
          <span style={{ color: COR.texto, fontWeight: 700, fontSize: 18, minWidth: 24, textAlign: "center" }}>{qtd}</span>
          <button onClick={inc} style={btnCircle(COR.laranja)}>+</button>
        </div>
      </div>
      {msg ? (
        <div style={{ textAlign: "center", padding: "8px 0", borderRadius: 8, background: msg === "consumo" ? "#2a2a2a" : "#1a3a00", color: msg === "consumo" ? COR.sub : "#7fff00", fontWeight: 700, fontSize: 13, fontFamily: FONT }}>
          {msg === "consumo" ? "✓ Consumo registrado" : "✓ Adicionado ao carrinho"}
        </div>
      ) : (
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={registrarConsumo} disabled={!temQtd} style={btnFlat(temQtd ? "#3a3a3a" : "#222", { flex: 1, color: temQtd ? "#ccc" : "#555", fontSize: 12 })}>C</button>
          <button onClick={adicionarAoCarrinho} disabled={!temQtd} style={btnFlat(temQtd ? COR.laranja : "#333", { flex: 3, color: temQtd ? "#fff" : "#555" })}>
            {temQtd ? `+ Carrinho · ${fmt(qtd * item.preco)}` : "Selecione a quantidade"}
          </button>
        </div>
      )}
    </div>
  );
}

function CarrinhoBar({ carrinho, onConfirmar, onLimpar }) {
  const total      = carrinho.reduce((s, i) => s + i.item.preco * i.qtd, 0);
  const totalItens = carrinho.reduce((s, i) => s + i.qtd, 0);
  if (carrinho.length === 0) return null;
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: COR.marrom, padding: "12px 16px", display: "flex", gap: 8, zIndex: 100, boxShadow: "0 -4px 20px rgba(0,0,0,0.6)" }}>
      <button onClick={onLimpar} style={btnFlat("#1a0a00", { flex: 1, color: "#aaa", fontSize: 12 })}>Cancelar</button>
      <button onClick={onConfirmar} style={btnFlat(COR.laranja, { flex: 3, fontSize: 15 })}>
        {totalItens} {totalItens === 1 ? "item" : "itens"} · Confirmar {fmt(total)}
      </button>
    </div>
  );
}

function AbaHoje({ pedidos, consumos, onFecharDia }) {
  const totalFaturamento = pedidos.reduce((s, p) => s + p.total, 0);
  const totalCmv         = pedidos.reduce((s, p) => s + p.cmv_total, 0);
  const totalItens       = pedidos.reduce((s, p) => s + p.quantidade, 0);
  const margem           = totalFaturamento > 0 ? ((totalFaturamento - totalCmv) / totalFaturamento) * 100 : 0;
  const pedidosUnicos    = [...new Set(pedidos.map((p) => p.pedido_id).filter(Boolean))];
  const ticketMedio      = pedidosUnicos.length > 0 ? pedidos.filter((p) => p.pedido_id).reduce((s, p) => s + p.total, 0) / pedidosUnicos.length : 0;
  const rankMap = {};
  pedidos.forEach((p) => { if (!rankMap[p.sabor]) rankMap[p.sabor] = { lucro: 0, qtd: 0 }; rankMap[p.sabor].lucro += p.total - p.cmv_total; rankMap[p.sabor].qtd += p.quantidade; });
  const ranking     = Object.entries(rankMap).sort((a, b) => b[1].lucro - a[1].lucro).slice(0, 5);
  const cmvConsumos = consumos.reduce((s, c) => s + (c.cmv_total || 0), 0);
  const kpi = (label, valor, cor = COR.laranja) => (
    <div style={{ background: COR.card, borderRadius: 10, padding: "14px 12px", textAlign: "center", flex: 1 }}>
      <div style={{ color: cor, fontWeight: 900, fontSize: 20, fontFamily: FONT }}>{valor}</div>
      <div style={{ color: COR.sub, fontSize: 11, marginTop: 2 }}>{label}</div>
    </div>
  );
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {kpi("Faturamento", fmt(totalFaturamento))}
        {kpi("Margem", `${margem.toFixed(1)}%`, "#7fff00")}
        {kpi("Ticket Médio", fmt(ticketMedio))}
        {kpi("Itens Vendidos", totalItens, "#aaa")}
      </div>
      {consumos.length > 0 && (
        <div style={{ background: "#1a1a2a", borderRadius: 10, padding: "10px 14px", marginBottom: 12, borderLeft: "3px solid #555" }}>
          <div style={{ color: "#aaa", fontWeight: 700, fontSize: 13, fontFamily: FONT }}>Consumo Interno</div>
          <div style={{ color: COR.sub, fontSize: 12, marginTop: 4 }}>{consumos.length} item{consumos.length !== 1 ? "s" : ""} · CMV: {fmt(cmvConsumos)}</div>
        </div>
      )}
      {ranking.length > 0 && (
        <div style={{ background: COR.card, borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
          <div style={{ color: COR.laranja, fontWeight: 900, fontFamily: FONT, fontSize: 14, marginBottom: 8 }}>TOP MARGEM</div>
          {ranking.map(([nome, dados], i) => (
            <div key={nome} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: COR.texto, fontSize: 13 }}>{i + 1}. {nome}</span>
              <span style={{ color: "#7fff00", fontSize: 13, fontWeight: 700 }}>{fmt(dados.lucro)}</span>
            </div>
          ))}
        </div>
      )}
      {pedidosUnicos.length > 0 && (
        <div style={{ background: COR.card, borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
          <div style={{ color: COR.sub, fontWeight: 700, fontFamily: FONT, fontSize: 13, marginBottom: 8 }}>PEDIDOS DO DIA ({pedidosUnicos.length})</div>
          {pedidosUnicos.slice(-10).reverse().map((pid) => {
            const itens = pedidos.filter((v) => v.pedido_id === pid);
            const totalPed = itens.reduce((s, v) => s + v.total, 0);
            const hora = new Date(Number(pid)).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
            return (
              <div key={pid} style={{ borderBottom: "1px solid #2a2a2a", paddingBottom: 8, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: COR.sub, fontSize: 11 }}>{hora}</span>
                  <span style={{ color: COR.laranja, fontWeight: 700, fontSize: 13 }}>{fmt(totalPed)}</span>
                </div>
                <div style={{ color: "#888", fontSize: 11 }}>{itens.map((it) => `${it.sabor} x${it.quantidade}`).join(" · ")}</div>
              </div>
            );
          })}
        </div>
      )}
      <button onClick={onFecharDia} style={btnFlat("#c70000", { width: "100%", padding: "14px 0", fontSize: 15 })}>Fechar Dia</button>
    </div>
  );
}

export default function App() {
  const [aba, setAba]           = useState("salgados");
  const [carrinho, setCarrinho] = useState([]);
  const [pedidos, setPedidos]   = useState([]);
  const [consumos, setConsumos] = useState([]);

  function addCarrinho({ item, qtd }) {
    setCarrinho((prev) => {
      const idx = prev.findIndex((c) => c.item.id === item.id);
      if (idx >= 0) { const novo = [...prev]; novo[idx] = { ...novo[idx], qtd: novo[idx].qtd + qtd }; return novo; }
      return [...prev, { item, qtd }];
    });
  }

  function registrarConsumo(payload) { setConsumos((prev) => [...prev, payload]); }

  async function confirmarPedido() {
    if (carrinho.length === 0) return;
    const pedido_id = String(Date.now());
    const timestamp = new Date().toISOString();
    const novosItens = [];
    for (const { item, qtd } of carrinho) {
      const payload = { tipo: item.tipo, sabor: item.nome, quantidade: qtd, preco_unit: item.preco, total: item.preco * qtd, cmv_total: item.cmv * qtd, pedido_id, timestamp, consumo: false };
      await enviarParaSheets(payload);
      novosItens.push(payload);
    }
    setPedidos((prev) => [...prev, ...novosItens]);
    setCarrinho([]);
    setAba("salgados");
  }

  function fecharDia() {
    if (!window.confirm("Fechar o dia? O histórico local será limpo.")) return;
    setPedidos([]); setConsumos([]);
  }

  const renderItens = (lista) => lista.map((item) => <ItemCard key={item.id} item={item} onAddCarrinho={addCarrinho} onConsumido={registrarConsumo} />);
  const abas = [{ id: "salgados", label: "🥟 Salgados" }, { id: "bebidas", label: "🥤 Bebidas" }, { id: "doces", label: "🍫 Doces" }, { id: "hoje", label: "📊 Hoje" }];

  return (
    <div style={{ background: COR.fundo, minHeight: "100vh", fontFamily: FONT, color: COR.texto }}>
      <div style={{ background: COR.marrom, padding: "14px 16px 0" }}>
        <div style={{ color: COR.laranja, fontWeight: 900, fontSize: 22, letterSpacing: 1, fontFamily: FONT }}>VÓ LINDA</div>
        <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
          {abas.map((a) => (
            <button key={a.id} onClick={() => setAba(a.id)} style={{ flex: 1, border: "none", padding: "8px 0", background: aba === a.id ? COR.laranja : "transparent", color: aba === a.id ? "#fff" : "#aaa", fontWeight: 700, fontSize: 11, cursor: "pointer", borderRadius: "6px 6px 0 0", fontFamily: FONT, transition: "all 0.15s" }}>{a.label}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: "14px 12px", paddingBottom: carrinho.length > 0 ? 80 : 20 }}>
        {aba === "salgados" && renderItens(SALGADOS)}
        {aba === "bebidas"  && renderItens(BEBIDAS)}
        {aba === "doces"    && renderItens(DOCES)}
        {aba === "hoje"     && <AbaHoje pedidos={pedidos} consumos={consumos} onFecharDia={fecharDia} />}
      </div>
      <CarrinhoBar carrinho={carrinho} onConfirmar={confirmarPedido} onLimpar={() => setCarrinho([])} />
    </div>
  );
}
Exibindo App_v3_3_VoLinda…
