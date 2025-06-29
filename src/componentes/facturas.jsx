import React, { useState } from "react";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
import logofactura from "../assets/logosinfondo.png";
import "./Factura.css";

function Factura() {
  const [datos, setDatos] = useState({
    chofer: "",
    fecha: "",
    carga: "",
    toneladas: "",
    precioTonelada: "",
    origen: "",
    destino: "",
    viaticos: "",
    entregadoPor: "",
    casetas: [],
    gastosInesperados: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  const agregarItem = (campo) => {
    setDatos({
      ...datos,
      [campo]: [...datos[campo], {}],
    });
  };

  const actualizarItem = (campo, i, name, value) => {
    const items = [...datos[campo]];
    items[i] = { ...items[i], [name]: value };
    setDatos({ ...datos, [campo]: items });
  };

  const eliminarItem = (campo, i) => {
    const items = [...datos[campo]];
    items.splice(i, 1);
    setDatos({ ...datos, [campo]: items });
  };

  const totalCasetas = datos.casetas.reduce(
    (acc, c) => acc + Number(c.monto || 0),
    0
  );
  const totalInesperados = datos.gastosInesperados.reduce(
    (acc, g) => acc + Number(g.monto || 0),
    0
  );
  const totalGastos = totalCasetas + totalInesperados;
  const totalCarga =
    Number(datos.toneladas || 0) * Number(datos.precioTonelada || 0);
  const diferencia = Number(datos.viaticos || 0) - totalGastos;

  const generarPDF = async () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    // Cargar imagen del logotipo
    const img = new Image();
    img.src = logofactura;
    await new Promise((resolve) => (img.onload = resolve));

    // Logo superior
    doc.addImage(img, "PNG", margin, y, 30, 20);
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Factura de Viaje", 105, y + 10, null, null, "center");
    y += 25;

    // Sección: Datos del viaje
    doc.setFillColor(230, 230, 230); // gris claro
    doc.rect(margin, y, 170, 8, "F");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.text("Datos del viaje", margin + 2, y + 6);
    y += 12;

    doc.setFontSize(11);
    doc.text(`Chofer: ${datos.chofer}`, margin, y);
    doc.text(`Fecha: ${datos.fecha}`, 120, y);
    y += 7;
    doc.text(`Carga: ${datos.carga}`, margin, y);
    doc.text(`Toneladas: ${datos.toneladas}`, 120, y);
    y += 7;
    doc.text(`Precio por tonelada: $${datos.precioTonelada}`, margin, y);
    y += 7;
    doc.text(`Origen: ${datos.origen}`, margin, y);
    doc.text(`Destino: ${datos.destino}`, 120, y);
    y += 7;
    doc.text(`Viáticos entregados: $${datos.viaticos}`, margin, y);
    doc.text(`Entregado por: ${datos.entregadoPor}`, 120, y);
    y += 10;

    // Sección: Casetas
    if (datos.casetas.length > 0) {
      doc.setFillColor(230, 230, 230);
      doc.rect(margin, y, 170, 8, "F");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(13);
      doc.text("Gastos de Casetas", margin + 2, y + 6);
      y += 10;

      doc.setFontSize(11);
      datos.casetas.forEach((caseta, i) => {
        doc.text(
          `${i + 1}. ${caseta.nombre || "Sin nombre"} - $${caseta.monto}`,
          margin + 5,
          y
        );
        y += 6;
      });
      y += 2;
    }

    // Sección: Inesperados
    if (datos.gastosInesperados.length > 0) {
      doc.setFillColor(230, 230, 230);
      doc.rect(margin, y, 170, 8, "F");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(13);
      doc.text("Gastos Inesperados", margin + 2, y + 6);
      y += 10;

      doc.setFontSize(11);
      datos.gastosInesperados.forEach((gasto, i) => {
        doc.text(
          `${i + 1}. ${gasto.concepto || "Sin concepto"} - $${gasto.monto}`,
          margin + 5,
          y
        );
        y += 6;
      });
      y += 2;
    }

    // Resumen
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, y, 170, 8, "F");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.text("Resumen", margin + 2, y + 6);
    y += 10;
    doc.setTextColor(0, 120, 0);
    doc.text(`Total Carga: $${totalCarga}`, margin + 5, y);
    y += 6;
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Total Casetas: $${totalCasetas}`, margin + 5, y);
    y += 6;
    doc.text(`Total Inesperados: $${totalInesperados}`, margin + 5, y);
    y += 6;

    doc.setTextColor(0, 0, 180);
    doc.text(`Total Gastos: $${totalGastos}`, margin + 5, y);
    y += 6;

    doc.setTextColor(0, 0, 0);
    doc.text(`Diferencia con viáticos: $${diferencia}`, margin + 5, y);
    y += 10;

    // Resultado final
    doc.setFontSize(12);
    if (diferencia < 0) {
      doc.setTextColor(200, 0, 0);
      doc.text(`A favor del chofer: $${Math.abs(diferencia)}`, margin + 5, y);
    } else {
      doc.setTextColor(0, 150, 0);
      doc.text(`A favor de Vega Transportes: $${diferencia}`, margin + 5, y);
    }

    // Pie de página con logo y texto
    doc.setDrawColor(200);
    doc.line(margin, 280, 210 - margin, 280);
    doc.addImage(img, "PNG", margin, 282, 15, 10);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      "Gracias por confiar en Vega Transportes",
      105,
      288,
      null,
      null,
      "center"
    );

    doc.save("factura.pdf");
  };

  const limpiarFormulario = () => {
    if (window.confirm("¿Estás seguro de que deseas limpiar el formulario?")) {
      setDatos({
        chofer: "",
        fecha: "",
        carga: "",
        toneladas: "",
        precioTonelada: "",
        origen: "",
        destino: "",
        viaticos: "",
        entregadoPor: "",
        casetas: [],
        gastosInesperados: [],
      });
    }
  };

  return (
    <div className="factura-container" id="factura">
      <div className="logofactura">
        <nav>
          <Link to="/">
            <img
              src={logofactura}
              alt="Mi Logo"
              style={{ cursor: "pointer" }}
            />
          </Link>
        </nav>
      </div>

      <div className="formulario">
        <div className="grid-2">
          <Input
            label="Chofer"
            name="chofer"
            value={datos.chofer}
            onChange={handleChange}
          />
          <Input
            label="Fecha"
            name="fecha"
            type="date"
            value={datos.fecha}
            onChange={handleChange}
          />
        </div>
        <div className="grid-2">
          <Input
            label="Carga"
            name="carga"
            value={datos.carga}
            onChange={handleChange}
          />
          <Input
            label="Toneladas"
            name="toneladas"
            type="number"
            value={datos.toneladas}
            onChange={handleChange}
          />
        </div>
        <div className="grid-2">
          <Input
            label="Precio por tonelada"
            name="precioTonelada"
            type="number"
            value={datos.precioTonelada}
            onChange={handleChange}
          />
          <Input
            label="Origen"
            name="origen"
            value={datos.origen}
            onChange={handleChange}
          />
        </div>
        <Input
          label="Destino"
          name="destino"
          value={datos.destino}
          onChange={handleChange}
        />
        <div className="grid-2">
          <Input
            label="Viáticos entregados"
            name="viaticos"
            type="number"
            value={datos.viaticos}
            onChange={handleChange}
          />
          <Input
            label="Entregado por"
            name="entregadoPor"
            value={datos.entregadoPor}
            onChange={handleChange}
          />
        </div>

        {/* Casetas */}
        <FieldList
          label="Gastos de casetas"
          items={datos.casetas}
          onAdd={() => agregarItem("casetas")}
          onUpdate={(i, campo, valor) =>
            actualizarItem("casetas", i, campo, valor)
          }
          onDelete={(i) => eliminarItem("casetas", i)}
          fields={[
            { name: "nombre", placeholder: "Nombre" },
            { name: "monto", type: "number", placeholder: "Monto" },
          ]}
        />

        {/* Gastos Inesperados */}
        <FieldList
          label="Gastos inesperados"
          items={datos.gastosInesperados}
          onAdd={() => agregarItem("gastosInesperados")}
          onUpdate={(i, campo, valor) =>
            actualizarItem("gastosInesperados", i, campo, valor)
          }
          onDelete={(i) => eliminarItem("gastosInesperados", i)}
          fields={[
            { name: "concepto", placeholder: "Concepto" },
            { name: "monto", type: "number", placeholder: "Monto" },
          ]}
        />

        <div className="factura-botones">
          <button onClick={generarPDF} className="btn btn-green">
            Generar PDF
          </button>
          <button onClick={limpiarFormulario} className="btn btn-red">
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}

// Subcomponentes
const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="input-text"
    />
  </div>
);

const FieldList = ({ label, items, onAdd, onUpdate, onDelete, fields }) => (
  <div className="mb-4">
    <label>{label}</label>
    {items.map((item, i) => (
      <div key={i} className="grid-3">
        {fields.map((f, idx) => (
          <input
            key={idx}
            type={f.type || "text"}
            placeholder={f.placeholder}
            value={item[f.name]}
            onChange={(e) => onUpdate(i, f.name, e.target.value)}
            className="input-text"
          />
        ))}
        <button onClick={() => onDelete(i)} className="btn btn-red">
          X
        </button>
      </div>
    ))}
    <button onClick={onAdd} className="btn btn-green">
      Agregar
    </button>
  </div>
);

export default Factura;
