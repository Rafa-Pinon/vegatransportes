import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { jsPDF } from "jspdf";
import "react-datepicker/dist/react-datepicker.css";
import "./factura.css";

const Factura = () => {
  const conductores = ["Juan", "Carlos", "Pedro", "Nuevo"];
  const personasAutorizadas = [
    "Persona 1",
    "Persona 2",
    "Persona 3",
    "Persona 4",
  ];

  const [conductor, setConductor] = useState("");
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [carga, setCarga] = useState("");
  const [kilos, setKilos] = useState(0);
  const [precioTonelada, setPrecioTonelada] = useState(0);
  const [dineroGastos, setDineroGastos] = useState(0);
  const [entregadorGastos, setEntregadorGastos] = useState("");
  const [casetas, setCasetas] = useState([{ nombre: "", total: 0 }]);
  const [gastosNoContemplados, setGastosNoContemplados] = useState([
    { concepto: "", monto: 0 },
  ]);
  // Cargar datos guardados al montar el componente
  useEffect(() => {
    const savedData = localStorage.getItem("facturaData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setConductor(parsedData.conductor);
      setFechaInicio(new Date(parsedData.fechaInicio));
      setOrigen(parsedData.origen);
      setDestino(parsedData.destino);
      setCarga(parsedData.carga);
      setKilos(parsedData.kilos);
      setPrecioTonelada(parsedData.precioTonelada);
      setDineroGastos(parsedData.dineroGastos);
      setEntregadorGastos(parsedData.entregadorGastos);
      setCasetas(parsedData.casetas);
      setGastosNoContemplados(parsedData.gastosNoContemplados);
    }
  }, []);
  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    const facturaData = {
      conductor,
      fechaInicio,
      origen,
      destino,
      carga,
      kilos,
      precioTonelada,
      dineroGastos,
      entregadorGastos,
      casetas,
      gastosNoContemplados,
    };
    localStorage.setItem("facturaData", JSON.stringify(facturaData));
  }, [
    conductor,
    fechaInicio,
    origen,
    destino,
    carga,
    kilos,
    precioTonelada,
    dineroGastos,
    entregadorGastos,
    casetas,
    gastosNoContemplados,
  ]);
  const limpiarFormulario = () => {
    if (window.confirm("¿Seguro que quieres limpiar el formulario?")) {
      localStorage.removeItem("facturaData");
      setConductor("");
      setFechaInicio(new Date());
      setOrigen("");
      setDestino("");
      setCarga("");
      setKilos(0);
      setPrecioTonelada(0);
      setDineroGastos(0);
      setEntregadorGastos("");
      setCasetas([{ nombre: "", total: 0 }]);
      setGastosNoContemplados([{ concepto: "", monto: 0 }]);
    }
  };
  const handleAddCaseta = () => {
    setCasetas([...casetas, { nombre: "", total: 0 }]);
  };

  const handleRemoveCaseta = (index) => {
    setCasetas(casetas.filter((_, i) => i !== index));
  };

  const handleAddGastoNoContemplado = () => {
    setGastosNoContemplados([
      ...gastosNoContemplados,
      { concepto: "", monto: 0 },
    ]);
  };

  const handleRemoveGastoNoContemplado = (index) => {
    setGastosNoContemplados(gastosNoContemplados.filter((_, i) => i !== index));
  };

  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 64, 128);
    doc.setFontSize(18);
    doc.text("Factura de Gasto de Viaje", 20, 15);

    doc.setFontSize(12);
    doc.setTextColor(51, 51, 51);
    doc.setFont("helvetica", "normal");

    doc.text(`Conductor: ${conductor}`, 20, 30);
    doc.text(`Fecha de Inicio: ${fechaInicio.toLocaleDateString()}`, 20, 40);
    doc.text(`Origen: ${origen}`, 20, 50);
    doc.text(`Destino: ${destino}`, 20, 60);

    doc.setTextColor(0, 102, 204);
    doc.setFontSize(14);
    doc.text("Casetas:", 20, 75);

    doc.setFontSize(12);
    doc.setTextColor(51, 51, 51);
    let yPosition = 85;

    casetas.forEach((caseta, index) => {
      doc.text(
        `${index + 1}. ${caseta.nombre} - $${caseta.total}`,
        25,
        yPosition
      );
      yPosition += 8;
    });
    doc.setTextColor(0, 102, 204);
    doc.setFontSize(14);
    doc.text("Gastos No Contemplados:", 20, yPosition + 10);

    doc.setFontSize(12);
    doc.setTextColor(51, 51, 51);
    yPosition += 20;

    gastosNoContemplados.forEach((gasto, index) => {
      doc.text(
        `${index + 1}. ${gasto.concepto} - $${gasto.monto}`,
        25,
        yPosition
      );
      yPosition += 8;
    });

    const totalCasetas = casetas.reduce((sum, caseta) => sum + caseta.total, 0);
    const totalGastosNoContemplados = gastosNoContemplados.reduce(
      (sum, gasto) => sum + gasto.monto,
      0
    );
    const total = totalCasetas + totalGastosNoContemplados;

    doc.setTextColor(217, 83, 79);
    doc.setFontSize(14);
    doc.text(
      `Total: $${totalCasetas + totalGastosNoContemplados}`,
      140,
      yPosition + 15
    );

    doc.save("Factura_Gasto_Viaje.pdf");
  };

  return (
    <div className="factura-container">
      <h1>Factura de Gasto por Viaje</h1>

      <div className="factura-input">
        <label>Conductor: </label>
        <select
          value={conductor}
          onChange={(e) => setConductor(e.target.value)}
        >
          {conductores.map((c, index) => (
            <option key={index} value={c}>
              {c}
            </option>
          ))}
        </select>

        {conductor === "Nuevo" && (
          <input
            type="text"
            placeholder="Escribe el nombre del conductor"
            value={conductor} // Vinculado al estado 'conductor'
            onChange={(e) => setConductor(e.target.value)}
          />
        )}
      </div>

      <div className="factura-input">
        <label>Fecha de Inicio:</label>
        <DatePicker
          selected={fechaInicio}
          onChange={(date) => setFechaInicio(date)}
        />
      </div>

      <div className="factura-input">
        <label>Lugar de Origen:</label>
        <input
          type="text"
          value={origen} // Vinculado al estado 'origen'
          onChange={(e) => setOrigen(e.target.value)}
        />
      </div>
      <div className="factura-input">
        <label>Lugar de Destino:</label>
        <input
          type="text"
          value={destino} // Vinculado al estado 'destino'
          onChange={(e) => setDestino(e.target.value)}
        />
      </div>
      {/* aki */}
      <div className="factura-input">
        <label>Carga:</label>
        <input
          type="text"
          value={carga}
          onChange={(e) => setCarga(e.target.value)}
        />
      </div>
      <div className="factura-input">
        <label>Kilos:</label>
        <input
          type="number"
          value={kilos}
          onChange={(e) => setKilos(e.target.value)}
        />
      </div>

      <div className="factura-input">
        <label>Precio por Tonelada:</label>
        <input
          type="number"
          value={precioTonelada}
          onChange={(e) => setPrecioTonelada(e.target.value)}
        />
      </div>

      <div className="factura-input">
        <label>Dinero para Gastos:</label>
        <input
          type="number"
          value={dineroGastos}
          onChange={(e) => setDineroGastos(e.target.value)}
        />
      </div>

      <div className="factura-input">
        <label>Entregador de Gastos:</label>
        <select
          value={entregadorGastos}
          onChange={(e) => setEntregadorGastos(e.target.value)}
        >
          {personasAutorizadas.map((persona, index) => (
            <option key={index} value={persona}>
              {persona}
            </option>
          ))}
        </select>
      </div>

      <div className="factura-section">
        <h3>Casetas</h3>
        {casetas.map((caseta, index) => (
          <div key={index} className="factura-input">
            <input
              type="text"
              placeholder="Nombre de Caseta"
              value={caseta.nombre}
              onChange={(e) => {
                const newCasetas = [...casetas];
                newCasetas[index].nombre = e.target.value;
                setCasetas(newCasetas);
              }}
            />
            <input
              type="number"
              placeholder="Total"
              value={caseta.total}
              onChange={(e) => {
                const newCasetas = [...casetas];
                newCasetas[index].total = parseFloat(e.target.value);
                setCasetas(newCasetas);
              }}
            />
            <button onClick={() => handleRemoveCaseta(index)}>Eliminar</button>
          </div>
        ))}
        <button onClick={handleAddCaseta}>Agregar Caseta</button>
      </div>

      <div className="factura-section">
        <h3>Gastos No Contemplados</h3>
        {gastosNoContemplados.map((gasto, index) => (
          <div key={index} className="factura-input">
            <input
              type="text"
              placeholder="Concepto"
              value={gasto.concepto}
              onChange={(e) => {
                const newGastos = [...gastosNoContemplados];
                newGastos[index].concepto = e.target.value;
                setGastosNoContemplados(newGastos);
              }}
            />
            <input
              type="number"
              placeholder="Monto"
              value={gasto.monto}
              onChange={(e) => {
                const newGastos = [...gastosNoContemplados];
                newGastos[index].monto = parseFloat(e.target.value);
                setGastosNoContemplados(newGastos);
              }}
            />
            <button onClick={() => handleRemoveGastoNoContemplado(index)}>
              Eliminar
            </button>
          </div>
        ))}
        <button onClick={handleAddGastoNoContemplado}>
          Agregar Gasto No Contemplado
        </button>
      </div>

      <div className="buttons">
        <button onClick={generarPDF}>Generar PDF</button>
        <button onClick={limpiarFormulario}>Limpiar Formulario</button>
      </div>
    </div>
  );
};

export default Factura;
