import { useState } from "react";

// Fonte da identidade visual
const _fontLink = document.createElement("link");
_fontLink.rel = "stylesheet";
_fontLink.href = "https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@700;900&display=swap";
document.head.appendChild(_fontLink);

// ============================================================
// CONFIG
// ============================================================
const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycby4Na_66YM7RghIhARzcw1hAdhWRU73b-zoK8l0dEuwk173JOcfW11pdiihtKF_jWED/exec";

const COR = { laranja: "#FF4800", marrom: "#4D2000", fundo: "#111", card: "#1a1a1a", texto: "#F2F2F2", sub: "#aaa" };
const FONT = "'Asap Condensed', sans-serif";
const fmt = (v) => `R$ ${Number(v).toFixed(2).replace(".", ",")}`;

// ============================================================
// DADOS
// ============================================================
const SALGADOS = [
{ id: "coxinha_frango", nome: "Coxinha Frango", preco: 4.00, cmv: 0.72, tipo: "salgado" },
{ id: "kibe", nome: "Kibe", preco: 4.00, cmv: 0.36, tipo: "salgado" },
];

// ============================================================
// ENVIO
// ============================================================
async function enviarParaSheets(payload) {
  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error(e);
  }
}

// ============================================================
// ITEM
// ============================================================
function ItemCard({ item, onAddCarrinho }) {
  const [qtd, setQtd] = useState(0);

  return (
    <div style={{ background: COR.card, padding: 12, marginBottom: 10 }}>
      <div>{item.nome}</div>

      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={() => setQtd(q => Math.max(0, q - 1))}>-</button>
        <span>{qtd}</span>
        <button onClick={() => setQtd(q => q + 1)}>+</button>
      </div>

      <button onClick={() => onAddCarrinho({ item, qtd })}>
        Adicionar
      </button>
    </div>
  );
}

// ============================================================
// APP
// ============================================================
export default function App() {
  const [aba, setAba] = useState("salgados");
  const [carrinho, setCarrinho] = useState([]);

  function addCarrinho({ item, qtd }) {
    setCarrinho(prev => [...prev, { item, qtd }]);
  }

  async function confirmarPedido() {
    const itens = carrinho.map(c => ({
      tipo: c.item.tipo,
      sabor: c.item.nome,
      quantidade: c.qtd,
      preco_unit: c.item.preco,
      total: c.item.preco * c.qtd,
      cmv_total: c.item.cmv * c.qtd,
      consumo: false
    }));

    await enviarParaSheets({ itens });

    setCarrinho([]);
  }

  return (
    <div style={{ background: "#111", minHeight: "100vh" }}>

      {/* MENU */}
      <div>
        <button onClick={() => setAba("salgados")}>Salgados</button>
      </div>

      {/* ITENS */}
      {aba === "salgados" && SALGADOS.map(item => (
        <ItemCard key={item.id} item={item} onAddCarrinho={addCarrinho} />
      ))}

      {/* CARRINHO */}
      {carrinho.length > 0 && (
        <button onClick={confirmarPedido}>
          Confirmar
        </button>
      )}

    </div>
  );
}