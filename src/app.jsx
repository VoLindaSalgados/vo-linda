import { useState, useEffect, useCallback, memo } from "react";

// ============================================================
// CONFIG
// ============================================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby4Na_66YM7RghIhARzcw1hAdhWRU73b-zoK8l0dEuwk173JOcfW11pdiihtKF_jWED/exec";

const COR = { laranja: "#FF4800", marrom: "#4D2000", fundo: "#111", card: "#1a1a1a", texto: "#F2F2F2", sub: "#aaa" };
const fmt = (v) => `R$ ${Number(v).toFixed(2).replace(".", ",")}`;

// ============================================================
// FONT
// ============================================================
function useFont() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@700;900&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ============================================================
// ENVIO
// ============================================================
async function enviarParaSheets(payload) {
  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
}

// ============================================================
// DADOS (EXEMPLO)
// ============================================================
const SALGADOS = [
  { id: "coxinha", nome: "Coxinha", preco: 4, cmv: 1, tipo: "salgado" },
  { id: "kibe", nome: "Kibe", preco: 4, cmv: 0.5, tipo: "salgado" },
];

// ============================================================
// ITEM CARD
// ============================================================
const ItemCard = memo(function ItemCard({ item, onAddCarrinho, modoRapido }) {
  const [qtd, setQtd] = useState(0);

  function adicionar(q = qtd) {
    if (q === 0) return;
    onAddCarrinho({ item, qtd: q });
    setQtd(0);
  }

  return (
    <div style={{ background: COR.card, padding: 12, marginBottom: 10, borderRadius: 10 }}>
      
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 700 }}>{item.nome}</div>
          <div style={{ color: COR.sub }}>{fmt(item.preco)}</div>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setQtd((q) => Math.max(0, q - 1))}>-</button>
          <span>{qtd}</span>
          <button onClick={() => setQtd((q) => q + 1)}>+</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        
        <button onClick={() => adicionar(1)} style={{ flex: 1 }}>
          +1
        </button>

        <button onClick={() => adicionar()} style={{ flex: 3 }}>
          {qtd > 0 ? `Adicionar ${fmt(qtd * item.preco)}` : "Qtd"}
        </button>

      </div>
    </div>
  );
});

// ============================================================
// APP
// ============================================================
export default function App() {
  useFont();

  const [modoRapido, setModoRapido] = useState(true);
  const [carrinho, setCarrinho] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const addCarrinho = useCallback(({ item, qtd }) => {
    setCarrinho((prev) => {
      const i = prev.findIndex((p) => p.item.id === item.id);
      if (i >= 0) {
        const novo = [...prev];
        novo[i].qtd += qtd;
        return novo;
      }
      return [...prev, { item, qtd }];
    });
  }, []);

  // ============================================================
  // ENVIO EM LOTE (V3)
  // ============================================================
  async function confirmarPedido() {
    if (!carrinho.length) return;

    const pedido_id = String(Date.now());
    const timestamp = new Date().toISOString();

    const itens = carrinho.map(({ item, qtd }) => ({
      tipo: item.tipo,
      sabor: item.nome,
      quantidade: qtd,
      preco_unit: item.preco,
      total: item.preco * qtd,
      cmv_total: item.cmv * qtd,
      consumo: false
    }));

    const payload = {
      pedido_id,
      timestamp,
      itens
    };

    try {
      await enviarParaSheets(payload);

      setPedidos((prev) => [...prev, ...itens]);
      setCarrinho([]);

    } catch {
      alert("Erro ao enviar");
    }
  }

  const total = carrinho.reduce((s, i) => s + i.item.preco * i.qtd, 0);

  return (
    <div style={{ background: "#111", minHeight: "100vh", paddingBottom: 80 }}>

      {/* HEADER */}
      <div style={{ background: COR.marrom, padding: 12 }}>
        <div style={{ color: COR.laranja, fontWeight: 900 }}>VÓ LINDA</div>

        <button onClick={() => setModoRapido((v) => !v)}>
          ⚡ {modoRapido ? "Rápido" : "Normal"}
        </button>
      </div>

      {/* ITENS */}
      <div style={{ padding: 12 }}>
        {SALGADOS.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onAddCarrinho={addCarrinho}
            modoRapido={modoRapido}
          />
        ))}
      </div>

      {/* CARRINHO */}
      {carrinho.length > 0 && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: COR.marrom,
          padding: 12,
          display: "flex",
          gap: 8
        }}>
          <button onClick={() => setCarrinho([])}>Cancelar</button>

          <button onClick={confirmarPedido}>
            Confirmar {fmt(total)}
          </button>
        </div>
      )}
    </div>
  );
}
