import { useState } from “react”;

// Fonte da identidade visual
const _fontLink = document.createElement(“link”);
_fontLink.rel = “stylesheet”;
_fontLink.href = “https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@700;900&display=swap”;
document.head.appendChild(_fontLink);

// ============================================================
// CONFIG
// ============================================================
const SCRIPT_URL =
“https://script.google.com/macros/s/AKfycby4Na_66YM7RghIhARzcw1hAdhWRU73b-zoK8l0dEuwk173JOcfW11pdiihtKF_jWED/exec”;

const COR  = { laranja: “#FF4800”, marrom: “#4D2000”, fundo: “#111”, card: “#1a1a1a”, texto: “#F2F2F2”, sub: “#aaa” };
const FONT = “‘Asap Condensed’, sans-serif”;

// ============================================================
// DADOS
// ============================================================
const SALGADOS = [
{ id: “coxinha_frango”,       nome: “Coxinha Frango”,      preco: 4.00, cmv: 0.72 },
{ id: “coxinha_carne”,        nome: “Coxinha Carne”,       preco: 4.00, cmv: 0.98 },
{ id: “coxinha_queijo”,       nome: “Coxinha Queijo”,      preco: 4.00, cmv: 1.07 },
{ id: “coxinha_calabresa”,    nome: “Coxinha Calabresa”,   preco: 4.00, cmv: 0.99 },
{ id: “coxinha_bacon”,        nome: “Coxinha Fr/Bacon”,    preco: 4.00, cmv: 0.90 },
{ id: “travesseiro”,          nome: “Travesseiro Queijo”,  preco: 4.00, cmv: 1.11 },
{ id: “enrolado_salsicha”,    nome: “Enrolado Salsicha”,   preco: 4.00, cmv: 0.85 },
{ id: “enrolado_presunto”,    nome: “Enrolado Pres/Queijo”,preco: 4.00, cmv: 1.12 },
{ id: “kibe”,                 nome: “Kibe”,                preco: 4.00, cmv: 0.36 },
];

const BEBIDAS = [
{ id: “suco_maquina”,   nome: “Suco Máquina”,      preco: 2.00, cmv: 0.80 },
{ id: “agua_sg”,        nome: “Água s/ Gás”,        preco: 3.50, cmv: 0.98 },
{ id: “agua_cg”,        nome: “Água c/ Gás”,        preco: 3.50, cmv: 1.15 },
{ id: “coca_200”,       nome: “Coca 200ml”,          preco: 4.50, cmv: 1.63 },
{ id: “coca_350”,       nome: “Coca 350ml”,          preco: 7.00, cmv: 3.32 },
{ id: “coca_ks”,        nome: “Coca KS 250ml”,       preco: 6.00, cmv: 3.32 },
{ id: “coca_2l”,        nome: “Coca 2L”,             preco: 18.00, cmv: 9.80 },
{ id: “fanta_200”,      nome: “Fanta 200ml”,         preco: 4.50, cmv: 1.51 },
{ id: “fanta_2l”,       nome: “Fanta 2L”,            preco: 18.00, cmv: 8.02 },
{ id: “sprite_200”,     nome: “Sprite 200ml”,        preco: 4.50, cmv: 1.51 },
{ id: “guarana_350”,    nome: “Guaraná 350ml”,       preco: 7.00, cmv: 3.33 },
{ id: “guarana_2l”,     nome: “Guaraná 2L”,          preco: 18.00, cmv: 7.99 },
{ id: “ouro_250”,       nome: “Ouro Verde 250ml”,    preco: 4.00, cmv: 1.63 },
{ id: “ouro_2l”,        nome: “Ouro Verde 2L”,       preco: 12.00, cmv: 5.50 },
];

const DOCES = [
{ id: “brig_unit”,    nome: “Brigadeiro”,        preco: 2.00,  cmv: 0.22 },
{ id: “ninho_unit”,   nome: “Ninho”,             preco: 2.00,  cmv: 0.20 },
{ id: “casad_unit”,   nome: “Casadinho”,         preco: 2.00,  cmv: 0.19 },
{ id: “prest_unit”,   nome: “Prestígio”,         preco: 2.00,  cmv: 0.20 },
{ id: “beij_unit”,    nome: “Beijinho”,          preco: 2.00,  cmv: 0.19 },
{ id: “kit6”,         nome: “Kit 6 Doces”,       preco: 10.00, cmv: 1.19 },
{ id: “kit15”,        nome: “Kit 15 Doces”,      preco: 25.00, cmv: 2.97 },
{ id: “halls”,        nome: “Halls”,             preco: 2.50,  cmv: 1.22 },
{ id: “trident”,      nome: “Trident”,           preco: 3.00,  cmv: 1.82 },
{ id: “pao_mel”,      nome: “Pão de Mel”,        preco: 10.00, cmv: 4.30 },
];

// ============================================================
// HELPERS
// ============================================================
function fmt(v) { return “R$ “ + v.toFixed(2).replace(”.”, “,”); }

async function enviarParaSheets(payload) {
try {
await fetch(SCRIPT_URL, {
method: “POST”,
mode: “no-cors”,
headers: { “Content-Type”: “application/json” },
body: JSON.stringify(payload),
});
} catch (e) { console.error(“Sheets error”, e); }
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

const ranking = […vendas]
.filter(v => !v.consumo)
.sort((a, b) => (b.total - b.cmv_total) - (a.total - a.cmv_total))
.slice(0, 5);

function fecharDia() {
const linhas = vendas.map(v =>
`${v.sabor}: ${v.quantidade}un${v.consumo ? " (consumo)" : " · " + fmt(v.total)}`
).join(”\n”);
const resumo = `=== VÓ LINDA — FECHAMENTO ===\n${linhas}\n\nTOTAL: ${fmt(totalVendas)}\nMARGEM: ${margem}%`;
navigator.clipboard.writeText(resumo).catch(() => {});
setFechado(true);
onFechar();
setTimeout(() => setFechado(false), 2000);
}

return (
<div style={{ padding: “0 4px” }}>
{/* KPIs */}
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr 1fr”, gap: 8, marginBottom: 16 }}>
{[
{ label: “Faturamento”, val: fmt(totalVendas) },
{ label: “Margem”, val: margem + “%” },
{ label: “Itens vendidos”, val: qtdItens },
].map(k => (
<div key={k.label} style={{ background: COR.card, borderRadius: 10, padding: “10px 8px”, textAlign: “center” }}>
<div style={{ color: COR.laranja, fontWeight: 700, fontSize: 16 }}>{k.val}</div>
<div style={{ color: COR.sub, fontSize: 11 }}>{k.label}</div>
</div>
))}
</div>

```
  {/* Ranking */}
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

  {/* Histórico */}
  {vendas.length > 0 && (
    <div style={{ marginBottom: 16 }}>
      <div style={{ color: COR.sub, fontSize: 12, marginBottom: 6 }}>HISTÓRICO</div>
      {[...vendas].reverse().map((v, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #1e1e1e" }}>
          <span style={{ color: v.consumo ? COR.sub : COR.texto, fontSize: 12 }}>
            {v.sabor} × {v.quantidade}{v.consumo ? " (C)" : ""}
          </span>
          <span style={{ color: v.consumo ? COR.sub : COR.laranja, fontSize: 12 }}>
            {v.consumo ? "consumo" : fmt(v.total)}
          </span>
        </div>
      ))}
    </div>
  )}

  <button
    onClick={fecharDia}
    style={{ width: "100%", padding: "14px", background: COR.marrom, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer" }}
  >
    {fechado ? "✓ Copiado! Cole no SAIPOS" : "Fechar Dia"}
  </button>
</div>
```

);
}

// ============================================================
// ESTILOS BOTÃO
// ============================================================
function btnCircle(bg) {
return {
width: 32, height: 32, borderRadius: “50%”,
background: bg, color: “#fff”, border: “none”,
fontSize: 18, cursor: “pointer”, display: “flex”,
alignItems: “center”, justifyContent: “center”,
};
}
function btnFlat(bg) {
return {
padding: “8px 10px”, borderRadius: 8,
background: bg, color: “#fff”, border: “none”,
fontSize: 13, cursor: “pointer”, fontWeight: 600,
transition: “background 0.2s”,
};
}

// ============================================================
// APP PRINCIPAL
// ============================================================
const ABAS = [
{ id: “salgados”, emoji: “🥟”, label: “Salgados” },
{ id: “bebidas”,  emoji: “🥤”, label: “Bebidas”  },
{ id: “doces”,    emoji: “🍫”, label: “Doces”    },
{ id: “hoje”,     emoji: “📊”, label: “Hoje”     },
];

export default function App() {
const [aba, setAba] = useState(“salgados”);
const [vendas, setVendas] = useState([]);

// injetar callback de venda nos contadores via contexto ou prop drilling simples
// Para manter simples: cada Contador chama enviarParaSheets E também atualiza estado local
// Vamos usar versão que aceita callback:

return (
<div style={{ background: COR.fundo, minHeight: “100vh”, maxWidth: 480, margin: “0 auto”, fontFamily: FONT, paddingBottom: 80 }}>
{/* HEADER */}
<div style={{ background: COR.marrom, padding: “16px 16px 12px”, position: “sticky”, top: 0, zIndex: 10 }}>
<div style={{ color: COR.laranja, fontWeight: 900, fontSize: 22, letterSpacing: 1 }}>VÓ LINDA</div>
<div style={{ color: “#a07050”, fontSize: 12 }}>Salgados · Balcão</div>
</div>

```
  {/* CONTEÚDO */}
  <div style={{ padding: "16px" }}>
    {aba === "salgados" && SALGADOS.map(s => <ContadorComVenda key={s.id} item={s} tipo="salgado" onVenda={v => setVendas(prev => [...prev, v])} />)}
    {aba === "bebidas"  && BEBIDAS.map(b  => <ContadorComVenda key={b.id} item={b} tipo="bebida"  onVenda={v => setVendas(prev => [...prev, v])} />)}
    {aba === "doces"    && DOCES.map(d    => <ContadorComVenda key={d.id} item={d} tipo="doce"    onVenda={v => setVendas(prev => [...prev, v])} />)}
    {aba === "hoje"     && <AbaHoje vendas={vendas} onFechar={() => setVendas([])} />}
  </div>

  {/* NAV */}
  <div style={{
    position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
    width: "100%", maxWidth: 480, background: COR.marrom,
    display: "flex", borderTop: `2px solid ${COR.laranja}`,
  }}>
    {ABAS.map(a => (
      <button
        key={a.id}
        onClick={() => setAba(a.id)}
        style={{
          flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
          background: aba === a.id ? COR.laranja : "transparent",
          color: aba === a.id ? "#fff" : "#a07050",
          fontSize: 11, fontWeight: 700, transition: "background 0.2s",
        }}
      >
        <div style={{ fontSize: 18 }}>{a.emoji}</div>
        {a.label}
      </button>
    ))}
  </div>
</div>
```

);
}

// ============================================================
// CONTADOR COM CALLBACK DE VENDA (para atualizar aba Hoje)
// ============================================================
function ContadorComVenda({ item, tipo, onVenda }) {
const [qtd, setQtd] = useState(0);
const [ok, setOk]   = useState(false);
const [cons, setCons] = useState(false);

const inc  = () => setQtd(q => q + 1);
const dec  = () => setQtd(q => Math.max(0, q - 1));
const add5 = () => setQtd(q => q + 5);

async function confirmar() {
if (qtd === 0) return;
const payload = { tipo, sabor: item.nome, quantidade: qtd, preco_unit: item.preco, total: qtd * item.preco, cmv_total: qtd * item.cmv, consumo: false };
await enviarParaSheets(payload);
onVenda(payload);
setOk(true);
setTimeout(() => { setOk(false); setQtd(0); }, 1500);
}

async function consumoInterno() {
if (qtd === 0) return;
const payload = { tipo, sabor: item.nome, quantidade: qtd, preco_unit: 0, total: 0, cmv_total: qtd * item.cmv, consumo: true };
await enviarParaSheets(payload);
onVenda(payload);
setCons(true);
setTimeout(() => { setCons(false); setQtd(0); }, 1500);
}

const margem = Math.round(((item.preco - item.cmv) / item.preco) * 100);

return (
<div style={{
background: COR.card,
border: `1px solid ${qtd > 0 ? COR.laranja : "#2a2a2a"}`,
borderRadius: 12, padding: “12px 14px”, marginBottom: 10, transition: “border-color 0.2s”,
}}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 8 }}>
<div>
<div style={{ color: COR.texto, fontWeight: 700, fontSize: 15 }}>{item.nome}</div>
<div style={{ color: COR.sub, fontSize: 12 }}>{fmt(item.preco)} · margem {margem}%</div>
</div>
<div style={{ display: “flex”, alignItems: “center”, gap: 8 }}>
<button onClick={dec} style={btnCircle(”#2a2a2a”)}>−</button>
<span style={{ color: COR.texto, fontWeight: 700, fontSize: 18, minWidth: 24, textAlign: “center” }}>{qtd}</span>
<button onClick={inc} style={btnCircle(COR.laranja)}>+</button>
</div>
</div>
<div style={{ display: “flex”, gap: 6 }}>
{tipo === “salgado” && (
<button onClick={add5} style={{ …btnFlat(”#2a2a2a”), flex: 1 }}>+5</button>
)}
<button onClick={consumoInterno} style={{ …btnFlat(”#2a2a2a”), flex: 1 }}>
{cons ? “✓ Consumo” : “C”}
</button>
<button
onClick={confirmar}
disabled={qtd === 0}
style={{ …btnFlat(qtd > 0 ? COR.laranja : “#333”), flex: 2, color: qtd > 0 ? “#fff” : “#555” }}
>
{ok ? “✓ Salvo!” : qtd > 0 ? `Confirmar · ${fmt(qtd * item.preco)}` : “Confirmar”}
</button>
</div>
</div>
);
}
