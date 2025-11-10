import React,
import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

function useCheckAccess() {
  const [authorized, setAuthorized] = React.useState(false);
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    async function check() {
      const userEmail = prompt("Por favor, digite seu e-mail para acesso:");
      if (!userEmail) {
        alert("E-mail é obrigatório para acesso.");
        setChecking(false);
        return;
      }

      const { data, error } = await supabaseClient
        .from('allowed_emails')
        .select('status')
        .eq('email', userEmail.toLowerCase())
        .single();

      if (error || !data || data.status !== 'active') {
        alert("Desculpe, mas você não tem acesso à calculadora.");
        setChecking(false);
        return;
      }

      setAuthorized(true);
      setChecking(false);
    }

    check();
  }, []);

  return { authorized, checking };
}

{ useState } from "react";
import "./style.css";
import "./index.css";
import Footer from "./Footer"; // Importa o Footer

const LOGO_IMG = "/logo_pao3x4.png";

export default function App() {
  const { authorized, checking } = useCheckAccess();

  if (checking) {
    return <div>Carregando...</div>;
  }
  if (!authorized) {
    return <div>Acesso negado.</div>;
  }

  // Aqui segue o código da sua calculadora original:
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#232221]">
      {/* ... restante do seu código ... */}
    </div>
  );
}


  // Estado dos campos
  const [qtdSimples, setQtdSimples] = useState("5");
  const [pesoSimples, setPesoSimples] = useState("500");
  const [perdaSimples, setPerdaSimples] = useState("12");
  const [aguaSimples, setAguaSimples] = useState("70");
  const [fermentoSimples, setFermentoSimples] = useState("20");
  const [salSimples, setSalSimples] = useState("2");

  const [qtdRecheado, setQtdRecheado] = useState("5");
  const [pesoRecheado, setPesoRecheado] = useState("500");
  const [perdaRecheado, setPerdaRecheado] = useState("12");
  const [aguaRecheado, setAguaRecheado] = useState("70");
  const [fermentoRecheado, setFermentoRecheado] = useState("20");
  const [salRecheado, setSalRecheado] = useState("2");
  const [recheio, setRecheio] = useState("30");

  const sanitize = (val) =>
    typeof val === "string"
      ? val.replace(/[^0-9.,]/g, "").replace(",", ".")
      : val;
  const parse = (val) => parseFloat(sanitize(val)) || 0;

  // Cálculos
  const perdaDecimalSimples = parse(perdaSimples) / 100;
  const totalFinalSimples = parse(qtdSimples) * parse(pesoSimples);
  const massaTotalSimples = totalFinalSimples / (1 - perdaDecimalSimples);
  const farinhaSimples =
    massaTotalSimples /
    (1 +
      parse(aguaSimples) / 100 +
      parse(fermentoSimples) / 100 +
      parse(salSimples) / 100);

  const perdaDecimalRecheado = parse(perdaRecheado) / 100;
  const totalFinalRecheado = parse(qtdRecheado) * parse(pesoRecheado);
  const massaTotalRecheado = totalFinalRecheado / (1 - perdaDecimalRecheado);
  const farinhaRecheado =
    massaTotalRecheado /
    (1 +
      parse(aguaRecheado) / 100 +
      parse(fermentoRecheado) / 100 +
      parse(salRecheado) / 100 +
      parse(recheio) / 100);

  // Inputs pequenos com largura fixa (100px)
  const inputProps = (value, setter, min = null, max = null, step = "1") => ({
    type: "text",
    inputMode: "decimal",
    pattern: "[0-9]*[.,]?[0-9]*",
    value,
    onInput: (e) => {
      let v = e.target.value.replace(/[^0-9.,]/g, "");
      setter(v);
    },
    onBlur: (e) => {
      let v = e.target.value.replace(",", ".");
      v = parseFloat(v);
      if (isNaN(v)) v = min !== null ? min : "";
      if (min !== null && v < min) v = min;
      if (max !== null && v > max) v = max;
      setter(v.toString());
    },
    className:
      "border border-gray-300 bg-[#fffbe9] text-[#23201a] rounded px-2 py-1 focus:ring-2 focus:ring-yellow-800 transition text-base",
    style: { width: "100px", marginLeft: "0.5rem" }
  });

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#232221]">
      {/* Cabeçalho com logo centralizado */}
      <div className="w-full flex flex-col items-center pt-7 pb-3">
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "12px"
          }}
        >
          <img
            src={LOGO_IMG}
            alt="Pão 3x4 Brassabröd"
            style={{
              height: "65px",
              maxWidth: "120px",
              width: "auto",
              display: "block",
              margin: 0
            }}
          />
        </div>
        <h1
          className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1 text-center select-none"
          style={{ color: "#62364F" }}
        >
          Calculadora de Massa Brassabröd
        </h1>
        <span className="text-[#62364F] text-base md:text-lg italic mb-1 block font-medium text-center">
          Método fácil, visual e seguro para calcular pão
        </span>
      </div>

      <main className="flex flex-wrap justify-center gap-6 w-full max-w-[900px] px-2 mb-4">
        {/* PÃO SIMPLES */}
        <div className="bg-[#232221] p-5 rounded-2xl shadow-md w-full max-w-[340px] mx-auto mb-5 border border-yellow-200">
          <h2
            className="text-base font-bold text-center mb-3 flex items-center justify-center"
            style={{ color: "#d1d1d1" }}
          >
            <span role="img" aria-label="Pão" className="mr-1">
              🥖
            </span>
            Pão Simples
          </h2>
          <div className="flex flex-col mb-2">
            <div className="flex items-center">
              <label className="mr-2 font-semibold text-[#b0b0b0] w-[130px]">
                Quantidade:
              </label>
              <input {...inputProps(qtdSimples, setQtdSimples)} />
            </div>
          </div>
          <div className="flex flex-col mb-2">
            <div className="flex items-center">
              <label className="mr-2 font-semibold text-[#b0b0b0] w-[130px]">
                Peso final por pão (g):
              </label>
              <input {...inputProps(pesoSimples, setPesoSimples)} />
            </div>
          </div>
          <div className="flex flex-col mb-2">
            <div className="flex items-center">
              <label className="mr-2 font-semibold text-[#b0b0b0] w-[130px]">
                Perda (%):
              </label>
              <input {...inputProps(perdaSimples, setPerdaSimples, 10, 20)} />
            </div>
            <Aviso
              condicao={dentroDaFaixa(parse(perdaSimples), 10, 20)}
              texto="⚠️ Perda fora da faixa ideal (10% - 20%)"
              className="pl-[130px] text-xs text-[#ffc857] font-semibold"
            />
          </div>
          <div className="flex flex-col mb-2">
            <div className="flex items-center">
              <label className="mr-2 font-semibold text-[#b0b0b0] w-[130px]">
                Água (%):
              </label>
              <input {...inputProps(aguaSimples, setAguaSimples, 50, 85)} />
            </div>
            <Aviso
              condicao={dentroDaFaixa(parse(aguaSimples), 50, 85)}
              texto="⚠️ Água fora da faixa ideal (50% - 85%)"
              className="pl-[130px] text-xs text-[#ffc857] font-semibold"
            />
          </div>
          <div className="flex flex-col mb-2">
            <div className="flex items-center">
              <label className="mr-2 font-semibold text-[#b0b0b0] w-[130px]">
                Fermento (%):
              </label>
              <input
                {...inputProps(fermentoSimples, setFermentoSimples, 10, 30)}
              />
            </div>
            <Aviso
              condicao={dentroDaFaixa(parse(fermentoSimples), 10, 30)}
              texto="⚠️ Fermento fora da faixa ideal (10% - 30%)"
              className="pl-[130px] text-xs text-[#ffc857] font-semibold"
            />
          </div>
          <div className="flex flex-col mb-2">
            <div className="flex items-center">
              <label className="mr-2 font-semibold text-[#b0b0b0] w-[130px]">
                Sal (%):
              </label>
              <input
                {...inputProps(salSimples, setSalSimples, 1.5, 2.5, "0.1")}
              />
            </div>
            <Aviso
              condicao={dentroDaFaixa(parse(salSimples), 1.5, 2.5)}
              texto="⚠️ Sal fora da faixa ideal (1.5% - 2.5%)"
              className="pl-[130px] text-xs text-[#ffc857] font-semibold"
            />
          </div>

          <hr className="my-2" />
          <ul className="text-[15px] pl-3 space-y-1" style={{ color: "#fff" }}>
            <li>
              Farinha: <strong>{farinhaSimples.toFixed(0)} g</strong>
            </li>
            <li>
              Água:{" "}
              <strong>
                {(farinhaSimples * parse(aguaSimples) / 100).toFixed(0)} g
              </strong>
            </li>
            <li>
              Fermento:{" "}
              <strong>
                {(farinhaSimples * parse(fermentoSimples) / 100).toFixed(0)} g
              </strong>
            </li>
            <li>
              Sal:{" "}
              <strong>
                {(farinhaSimples * parse(salSimples) / 100).toFixed(0)} g
              </strong>
            </li>
            <li>
              Massa total: <strong>{massaTotalSimples.toFixed(0)} g</strong>
            </li>
            <li>
              <strong>
                Porcione {qtdSimples} pães com{" "}
                {(massaTotalSimples / parse(qtdSimples)).toFixed(0)} g cada
              </strong>
            </li>
          </ul>
        </div>

        {/* PÃO RECHEADO */}
        <div className="bg-[#232221] p-5 rounded-2xl shadow-md w-full max-w-[340px] mx-auto mb-5 border border-yellow-200">
          <h2
            className="text-base font-bold text-center mb-3 flex items-center justify-center"
            style={{ color: "#d1d1d1" }}
          >
            <span role="img" aria-label="Recheio" className="mr-1">
              🧀
            </span>
            Pão Recheado
          </h2>
          {/* Campos Pão Recheado */}
          <div className="flex flex-col mb-2">
            <div className="flex items-center">
              <label className="mr-2 font-semibold text-[#b0b0b0] w-[130px]">
                Quantidade:
              </label>
              <input {...inputProps(qtdRecheado, setQtdRecheado)} />
            </div>
          </div>
          <div className="flex flex-col mb-2">
            <div className="flex items-center">
              <label className="mr-2 font-semibold text-[#b0b0b0] w-[130px]">
                Peso final por pão (g):
              </label>
              <input {...inputProps(pesoRecheado, setPesoRecheado)} />
            </div>
          </div>
          <div className="flex flex-col mb-2">
            <div className="flex items-center">
              <label className="mr-2 font-semibold text-[#b0b0b0] w-[130px]">
                Perda (%):
              </label>
              <input {...inputProps(perdaRecheado, setPerdaRecheado, 10, 20)} />
            </div>
            <Aviso
              condicao={dentroDaFaixa(parse(perdaRecheado), 10, 20)}
              texto="⚠️ Perda fora da faixa ideal (10% - 20%)"
              className="pl-[130px] text-xs text-[#ffc857] font-semibold"
            />
          </div>
          <div className="flex flex-col mb-2">
            <div className="flex items-center">
              <label className="mr-2 font-semibold text-[#b0b0b0] w-[130px]">
                Água (%):
              </label>
              <input {...inputProps(aguaRecheado, setAguaRecheado, 50, 85)} />
            </div>
            <Aviso
              condicao={dentroDaFaixa(parse(aguaRecheado), 50, 85)}
              texto="⚠️ Água fora da faixa ideal (50% - 85%)"
              className="pl-[130px] text-xs text-[#ffc857] font-semibold"
            />
          </div>
          <div className="flex flex-col mb-2">
            <div className="flex items-center">
              <label className="mr-2 font-semibold text-[#b0b0b0] w-[130px]">
                Fermento (%):
              </label>
              <input
                {...inputProps(fermentoRecheado, setFermentoRecheado, 10, 30)}
              />
            </div>
            <Aviso
              condicao={dentroDaFaixa(parse(fermentoRecheado), 10, 30)}
              texto="⚠️ Fermento fora da faixa ideal (10% - 30%)"
              className="pl-[130px] text-xs text-[#ffc857] font-semibold"
            />
          </div>
          <div className="flex flex-col mb-2">
            <div className="flex items-center">
              <label className="mr-2 font-semibold text-[#b0b0b0] w-[130px]">
                Sal (%):
              </label>
              <input
                {...inputProps(salRecheado, setSalRecheado, 1.5, 2.5, "0.1")}
              />
            </div>
            <Aviso
              condicao={dentroDaFaixa(parse(salRecheado), 1.5, 2.5)}
              texto="⚠️ Sal fora da faixa ideal (1.5% - 2.5%)"
              className="pl-[130px] text-xs text-[#ffc857] font-semibold"
            />
          </div>
          <div className="flex flex-col mb-2">
            <div className="flex items-center">
              <label className="mr-2 font-semibold text-[#b0b0b0] w-[130px]">
                Recheio (%):
              </label>
              <input {...inputProps(recheio, setRecheio, 10, 30)} />
            </div>
            <Aviso
              condicao={dentroDaFaixa(parse(recheio), 10, 30)}
              texto="⚠️ Recheio fora da faixa ideal (10% - 30%)"
              className="pl-[130px] text-xs text-[#ffc857] font-semibold"
            />
          </div>

          <hr className="my-2" />
          <ul className="text-[15px] pl-3 space-y-1" style={{ color: "#fff" }}>
            <li>
              Farinha: <strong>{farinhaRecheado.toFixed(0)} g</strong>
            </li>
            <li>
              Água:{" "}
              <strong>
                {(farinhaRecheado * parse(aguaRecheado) / 100).toFixed(0)} g
              </strong>
            </li>
            <li>
              Fermento:{" "}
              <strong>
                {(farinhaRecheado * parse(fermentoRecheado) / 100).toFixed(0)} g
              </strong>
            </li>
            <li>
              Sal:{" "}
              <strong>
                {(farinhaRecheado * parse(salRecheado) / 100).toFixed(0)} g
              </strong>
            </li>
            <li>
              Recheio:{" "}
              <strong>
                {(farinhaRecheado * parse(recheio) / 100).toFixed(0)} g
              </strong>
            </li>
            <li>
              Massa total: <strong>{massaTotalRecheado.toFixed(0)} g</strong>
            </li>
            <li>
              <strong>
                Porcione {qtdRecheado} pães com{" "}
                {(massaTotalRecheado / parse(qtdRecheado)).toFixed(0)} g cada
              </strong>
            </li>
          </ul>
        </div>
      </main>

      {/* Rodapé com os links das redes sociais */}
      <Footer />
    </div>
  );
}
