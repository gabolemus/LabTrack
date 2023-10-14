import React, { useEffect, useState } from "react";
import { IInquiry, getInquiry } from "../InquiriesList/inquiries";
import { Link } from "react-router-dom";
import "./InquiryDetail.scss";
import ModalForm from "../ModalForm/ModalForm";
import axios from "axios";
import Loader from "../../molecules/Loader/Loader";

/** Interface for ProjectDetail props */
interface InquiryDetailProps {
  /** ID of the project request to be shown */
  id: string;
}

const InquiryDetail = ({ id }: InquiryDetailProps) => {
  const [inquiry, setInquiry] = useState<IInquiry | null>(null);
  const [canApprove, setCanApprove] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [modalCallback, setModalCallback] = useState<() => void>(() => {});
  const [modalBody, setModalBody] = useState("");
  const [modalBtnText, setModalBtnText] = useState("");
  const [modalBtnClass, setModalBtnClass] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const inquiry = await getInquiry(id);
      if (inquiry.status === "Pending") {
        setCanApprove(true);
      }
      console.log(inquiry);
      setInquiry(inquiry);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  if (!inquiry && !loading) {
    // Equipment not found by ID
    return (
      <>
        <h1>Error</h1>
        <p>
          El proyecto con ID <b className="equipment-id">{id}</b> no fue
          encontrado.
        </p>
        <Link className="btn btn-primary" to="/inquiries-registry">
          Ir al listado de solicitudes
        </Link>
      </>
    );
  }

  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio ",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre ",
  ];

  const convertTime = (time: string) => {
    const date = new Date(time);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} de ${month} de ${year}`;
  };

  const handleAccept = () => {
    setShowModal(true);
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

  /** Get the names for the requests status based on the status code */
  const getStatusName = (status: string) => {
    switch (status) {
      case "Pending":
        return "Pendiente";
      case "Accepted":
        return "Aceptado";
      case "Rejected":
        return "Rechazado";
      default:
        return "Desconocido";
    }
  };

  /** Get the corresponding class name based on the status code */
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "status-indicator--pending";
      case "Accepted":
        return "status-indicator--accepted";
      case "Rejected":
        return "status-indicator--rejected";
      default:
        return "";
    }
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
      <Loader loading={loading} />
      {!loading && inquiry && (
        <>
          <h1>{inquiry.projectName}</h1>
          <div className="card project-request-card mb-5">
            <div className="card-body">
              {canApprove && (
                <div className="w-100 mb-5">
                  <div className="d-flex justify-content-center btn-group w-75 mx-auto">
                    <button
                      className="btn btn-success w-100"
                      onClick={handleAccept}>
                      Aprobar
                    </button>
                    <button
                      className="btn btn-danger w-100"
                      onClick={handleReject}>
                      Rechazar
                    </button>
                  </div>
                </div>
              )}
              <div className="w-100 mb-3 d-flex flex-row justify-content-between">
                <div className="w-50 lead">
                  <h3>Responsable</h3>
                  <p>
                    {inquiry.projectRequester.name}{" "}
                    <span className="text-muted">
                      (
                      <Link to={`mailto:${inquiry.projectRequester.email}`}>
                        {inquiry.projectRequester.email}
                      </Link>
                      )
                    </span>
                  </p>
                </div>
                <div className="w-50 status">
                  <h3>Estado</h3>
                  <div
                    className={`status-indicator ${getStatusClass(
                      inquiry.status
                    )}`}>
                    {getStatusName(inquiry.status)}
                  </div>
                </div>
              </div>
              <div className="desc mb-5">
                <h2>Descripción</h2>
                <p>{inquiry.description}</p>
              </div>
              <div className="courses mb-5">
                {/* inquiry.classes is a list of strings */}
                <h2>Cursos</h2>
                <ul>
                  {inquiry.courses.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
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
                          <Link to={`/equipment${device.path}`}>
                            {device.name}
                          </Link>
                        </td>
                        <td>{device.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="timeline">
                <h2>Duración</h2>
                <div className="timeline-row">
                  <div className="timeline-block start">
                    <div className="timeline-title">Inicio</div>
                    <div className="timeline-time">
                      {convertTime(inquiry.timelapse.start.toString())}
                    </div>
                  </div>
                  <div className="timeline-connector"></div>
                  <div className="timeline-block end">
                    <div className="timeline-title">Fin</div>
                    <div className="timeline-time">
                      {convertTime(inquiry.timelapse.end.toString())}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default InquiryDetail;
