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

  const handleAddCaseta = () => {
    setCasetas([...casetas, { nombre: "", total: 0 }]);
  };

  const handleAddGastoNoContemplado = () => {
    setGastosNoContemplados([
      ...gastosNoContemplados,
      { concepto: "", monto: 0 },
    ]);
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text(`Factura de Gasto de Viaje`, 20, 10);
    doc.text(`Conductor: ${conductor}`, 20, 20);
    doc.text(`Fecha de Inicio: ${fechaInicio.toLocaleDateString()}`, 20, 30);
    doc.text(`Origen: ${origen}`, 20, 40);
    doc.text(`Destino: ${destino}`, 20, 50);
    doc.text(`Carga: ${carga}`, 20, 60);
    doc.text(`Kilos: ${kilos}`, 20, 70);
    doc.text(`Precio por Tonelada: ${precioTonelada}`, 20, 80);
    doc.text(`Dinero para Gastos: ${dineroGastos}`, 20, 90);
    doc.text(`Entregador de Gastos: ${entregadorGastos}`, 20, 100);

    let yPosition = 110;
    casetas.forEach((caseta, index) => {
      doc.text(
        `Caseta ${index + 1}: ${caseta.nombre} - ${caseta.total}`,
        20,
        yPosition
      );
      yPosition += 10;
    });

    gastosNoContemplados.forEach((gasto, index) => {
      doc.text(
        `Gasto No Contemplado ${index + 1}: ${gasto.concepto} - ${gasto.monto}`,
        20,
        yPosition
      );
      yPosition += 10;
    });

    const totalCasetas = casetas.reduce((sum, caseta) => sum + caseta.total, 0);
    const totalGastosNoContemplados = gastosNoContemplados.reduce(
      (sum, gasto) => sum + gasto.monto,
      0
    );
    const total = totalCasetas + totalGastosNoContemplados;

    doc.text(`Total Casetas: ${totalCasetas}`, 20, yPosition);
    yPosition += 10;
    doc.text(
      `Total Gastos No Contemplados: ${totalGastosNoContemplados}`,
      20,
      yPosition
    );
    yPosition += 10;
    doc.text(`Total: ${total}`, 20, yPosition);

    doc.save("Factura_Gasto_Viaje.pdf");
  };

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

  return (
    <div className="factura-container">
      <h1>Factura de Gasto por Viaje</h1>

      <div className="factura-input">
        <label>Conductor: </label>
        <select
          value={conductor}
          onChange={(e) => setConductor(e.target.value)}
        >
          {conductores.map((conductor, index) => (
            <option key={index} value={conductor}>
              {conductor}
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
          selected={fechaInicio} // Aquí vinculamos la fecha desde el estado
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
