import React, { useEffect, useState } from "react";
import { IInquiry, getInquiry } from "../InquiriesList/inquiries";
import { Link } from "react-router-dom";
import "./InquiryDetail.scss";
import ModalForm from "../ModalForm/ModalForm";
import axios from "axios";

/** Interface for ProjectDetail props */
interface InquiryDetailProps {
  id: string;
}

const InquiryDetail = ({ id }: InquiryDetailProps) => {
  const [inquiry, setInquiry] = useState<IInquiry | null>(null);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [modalCallback, setModalCallback] = useState<() => void>(() => {});
  const [modalBody, setModalBody] = useState("");
  const [modalBtnText, setModalBtnText] = useState("");
  const [modalBtnClass, setModalBtnClass] = useState("");

  useEffect(() => {
    // Simulate fetching equipment data based on the ID from your data source
    const fetchData = async () => {
      try {
        const inquiry = await getInquiry(id);
        setInquiry(inquiry);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  if (!inquiry) {
    // Equipment not found by ID
    return (
      <>
        <h1>Error</h1>
        <p>
          El proyecto con ID <b className="equipment-id">{id}</b> no fue
          encontrado.
        </p>
        <Link className="btn btn-primary" to="/projects">
          Ir al listado de proyectos
        </Link>
      </>
    );
  }

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio ",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre ",
  ];

  const convertTime = (time: string) => {
    // YYYY-MM-DD to DD de MM de YYYY
    const date = new Date(time);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} de ${month} de ${year}`;
  };

  const handleAccept = () => {
    setShowModal(true);
    console.log("Aceptado");
    setModalBtnText("Aceptar");
    setModalBtnClass("btn-success");
    setModalBody(
      "¿Está seguro de que quiere aceptar esta solicitud de proyecto?"
    );
    setModalCallback(() => async () => {
      console.log("Acepting inquiry");
      try {
        await axios.put(`http://localhost:8080/inquiry?id=${id}`, {
          status: "Accepted",
        });
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleReject = () => {
    setShowModal(true);
    console.log("Rechazado");
    setModalBtnText("Rechazar");
    setModalBtnClass("btn-danger");
    setModalBody(
      "¿Está seguro de que quiere rechazar esta solicitud de proyecto?"
    );
    setModalCallback(() => async () => {
      try {
        await axios.put(`http://localhost:8080/inquiry?id=${id}`, {
          status: "Rejected",
        });
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <ModalForm
        show={showModal}
        handleClose={handleModalClose}
        onAccept={modalCallback}
        title="Confirmar acción"
        body={modalBody}
        primaryBtnText={modalBtnText}
        primaryBtnClass={modalBtnClass}
      />
      <div className="equipment-detail mb-5">
        <h1>{inquiry.projectName}</h1>
        <div className="w-100 mb-5">
          <div className="d-flex justify-content-center btn-group w-75 mx-auto">
            <button className="btn btn-success w-100" onClick={handleAccept}>
              Aprobar
            </button>
            <button className="btn btn-danger w-100" onClick={handleReject}>
              Rechazar
            </button>
          </div>
        </div>
        <div className="lead mb-5">
          <h3>Responsable</h3>
          <p>{inquiry.projectRequester.name}</p>
        </div>
        <div className="status mb-5">
          <h3>Estado</h3>
          <div
            className={`status-indicator${
              inquiry.status === "Accepted" ? " status-indicator--accepted" : ""
            }`}>
            {inquiry.status === "Accepted"
              ? "Aceptado"
              : inquiry.status === "Rejected"
              ? "Rechazado"
              : "Pendiente"}
          </div>
        </div>
        <div className="desc mb-5">
          <h2>Descripción</h2>
          <p>{inquiry.status}</p>
        </div>
        <div className="equipment-list mb-5">
          <h2>Equipos</h2>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {inquiry.devices.map((device) => (
                <tr key={device.id}>
                  <td>
                    <Link to={`/equipment${device.path}`}>{device.name}</Link>
                  </td>
                  <td>{device.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <div className="Línea de tiempo mb-5">
        <h2>Línea de tiempo</h2>
        <p>
          <b>Fecha de inicio:</b> {convertTime(inquiry)}
          <br />
          <b>Fecha de fin:</b> {convertTime(inquiry.timelapse.end)}
        </p>
      </div> */}
      </div>
    </>
  );
};

export default InquiryDetail;
