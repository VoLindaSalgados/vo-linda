import { useState } from "react";

const SCRIPT_URL = "COLE_SUA_URL_AQUI";

const COR = {
  laranja: "#FF4800",
  marrom: "#4D2000",
  fundo: "#111",
  card: "#1a1a1a",
  texto: "#F2F2F2",
};

const SALGADOS = [
  { id: "coxinha", nome: "Coxinha", preco: 4, tipo: "salgado" },
  { id: "kibe", nome: "Kibe", preco: 4, tipo: "salgado" },
];

// =============================
// COMPONENTE ESTOQUE
// =============================
function AbaEstoque() {
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [custo, setCusto] = useState("");

  async function enviar() {
    if (!produto || !quantidade || !custo) return;

    const payload = {
      tipo: "estoque",
      itens: [
        {
          produto,
          quantidade: Number(quantidade),
          custo_unit: Number(custo),
        },
      ],
    };

    await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setProduto("");
    setQuantidade("");
    setCusto("");
    alert("Estoque atualizado");
  }

  return (
    <div style={{ padding: 12 }}>
      <h3>Adicionar Estoque</h3>

      <input
        placeholder="Produto"
        value={produto}
        onChange={(e) => setProduto(e.target.value)}
      />
      <br />

      <input
        placeholder="Quantidade"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      />
      <br />

      <input
        placeholder="Custo unitário"
        value={custo}
        onChange={(e) => setCusto(e.target.value)}
      />
      <br />

      <button onClick={enviar}>Salvar</button>
    </div>
  );
}

// =============================
// APP PRINCIPAL
// =============================
export default function App() {
  const [aba, setAba] = useState("salgados");

  const abas = [
    { id: "salgados", label: "🥟 Salgados" },
    { id: "hoje", label: "📊 Hoje" },
    { id: "estoque", label: "📦 Estoque" },
  ];

  return (
    <div style={{ background: COR.fundo, minHeight: "100vh", color: COR.texto }}>
      
      {/* MENU */}
      <div style={{ background: COR.marrom, padding: 12 }}>
        {abas.map((a) => (
          <button
            key={a.id}
            onClick={() => setAba(a.id)}
            style={{ marginRight: 6 }}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* CONTEÚDO */}
      <div style={{ padding: 12 }}>

        {aba === "salgados" &&
          SALGADOS.map((item) => (
            <div key={item.id}>
              {item.nome} - R$ {item.preco}
            </div>
          ))}

        {aba === "estoque" && <AbaEstoque />}

      </div>

    </div>
  );
}