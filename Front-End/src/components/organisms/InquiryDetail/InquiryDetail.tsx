import React, { useEffect, useState } from "react";
import { IInquiry, getInquiry } from "../InquiriesList/inquiries";
import { Link, useNavigate } from "react-router-dom";
import "./InquiryDetail.scss";
import ModalForm from "../ModalForm/ModalForm";
import axios from "axios";
import Loader from "../../molecules/Loader/Loader";
import { BE_URL } from "../../../utils/utils";

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
  const [modalTitle, setModalTitle] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [modalCallback, setModalCallback] = useState<() => void>(() => {});
  const [modalBody, setModalBody] = useState(<></>);
  const [modalBtnText, setModalBtnText] = useState("");
  const [modalBtnClass, setModalBtnClass] = useState("");
  const navigate = useNavigate();

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

  const convertTimeWithHour = (time: string) => {
    const date = new Date(time);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    let seconds = date.getSeconds().toString();

    // Pad the seconds with a 0 if it's less than 10
    if (parseInt(seconds) < 10) {
      seconds = `0${seconds}`;
    }

    return `${day} de ${month} de ${year} a las ${hour}:${minutes}:${seconds}`;
  };

  const handleAccept = () => {
    setShowModal(true);
    setModalTitle("Confirmar Aprobación");
    setModalBtnText("Aceptar");
    setModalBtnClass("btn-success");
    setModalBody(
      <p className="fs-normal mb-4">
        ¿Está seguro de que quiere aceptar esta solicitud de proyecto?
      </p>
    );
    setModalCallback(() => async () => {
      if (inquiry === null) return;
      setLoading(true);

      try {
        await axios.put(`${BE_URL}/inquiry?id=${id}`, {
          status: "Accepted",
          modifiedByUserId: localStorage.getItem("userId"),
        });

        const newProject = {
          name: inquiry.projectName,
          courses: inquiry.courses,
          description: inquiry.description,
          lead: { ...inquiry.projectRequester },
          timelapse: inquiry.timelapse,
          status: "Not Started",
          devices: inquiry.devices.map((device) => ({
            id: device.id,
            quantity: device.quantity,
          })),
        };

        const newProjectDoc = await axios.post(
          `${BE_URL}/project`,
          newProject
        );

        const newProjectEmail = {
          to: inquiry.projectRequester.email,
          name: inquiry.projectRequester.name,
          project: inquiry.projectName,
          description: inquiry.description,
          devices: inquiry.devices.map((device) => ({
            name: device.name,
            quantity: device.quantity,
          })),
          timelapse: inquiry.timelapse,
          reason: "projectOpening",
          approved: true,
          projectPath: newProjectDoc.data.newproject.path,
        };

        await axios.post(
          `${BE_URL}/mailer/send-project-opening-notification-email`,
          newProjectEmail
        );

        setShowModal(true);
        setModalTitle("Solicitud de Proyecto Aceptada");
        setModalBody(
          <>
            <p className="fs-normal mb-4">
              La solicitud de proyecto fue aceptada exitosamente.
            </p>
            <p className="fs-normal mb-4">
              Se ha enviado un correo electrónico a{" "}
              <b>{inquiry.projectRequester.email}</b> con la información del
              proyecto.
            </p>
          </>
        );
        setModalBtnClass("btn-success");
        setModalBtnText("Aceptar");
        setModalCallback(() => () => {
          navigate("/inquiries-registry");
        });
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    });
  };

  const handleReject = () => {
    let reason = "";
    setShowModal(true);
    setModalTitle("Establecer Motivo de Rechazo");
    setModalBtnText("Rechazar Solicitud");
    setModalBtnClass("btn-danger");
    setModalBody(
      <>
        <p className="fs-normal mb-4">
          ¿Está seguro de que quiere rechazar esta solicitud de proyecto?
        </p>
        <label htmlFor="rejection-reason" className="form-label">
          Motivo de rechazo
        </label>
        <textarea
          className="form-control request-rejection-reason mb-5"
          id="rejection-reason"
          placeholder="Escriba el motivo de rechazo de la solicitud..."
          onChange={(e) => (reason = e.target.value)}
        />
      </>
    );

    setModalCallback(() => async () => {
      if (inquiry === null) return;
      setLoading(true);

      try {
        await axios.put(`${BE_URL}/inquiry?id=${id}`, {
          status: "Rejected",
          modifiedByUserId: localStorage.getItem("userId"),
        });

        const newProjectEmail = {
          to: inquiry.projectRequester.email,
          name: inquiry.projectRequester.name,
          project: inquiry.projectName,
          description: inquiry.description,
          devices: inquiry.devices.map((device) => ({
            name: device.name,
            quantity: device.quantity,
          })),
          timelapse: inquiry.timelapse,
          reason,
          approved: false,
        };

        await axios.post(
          `${BE_URL}/mailer/send-project-opening-notification-email`,
          newProjectEmail
        );

        setShowModal(true);
        setModalTitle("Solicitud de Proyecto Rechazada");
        setModalBody(
          <>
            <p className="fs-normal mb-4">
              La solicitud de proyecto fue rechazada exitosamente.
            </p>
            <p className="fs-normal mb-4">
              Se ha enviado un correo electrónico a{" "}
              <b>{inquiry.projectRequester.email}</b> con la información del
              proyecto.
            </p>
          </>
        );
        setModalBtnClass("btn-success");
        setModalBtnText("Aceptar");
        setModalCallback(() => () => {
          navigate("/inquiries-registry");
        });
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
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
        title={modalTitle}
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
                <>
                  <div className="w-100 mb-5 mt-3">
                    <div className="d-flex justify-content-center btn-group w-100 mx-auto">
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
                  <hr className="separator mb-5" />
                </>
              )}
              <div className="w-100 mb-3 d-flex flex-row justify-content-between">
                <div className="w-50 lead">
                  <h4>Responsable</h4>
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
                  <h4>Estado</h4>
                  <div
                    className={`status-indicator ${getStatusClass(
                      inquiry.status
                    )}`}>
                    {getStatusName(inquiry.status)}
                  </div>
                </div>
              </div>
              <div className="desc mb-5">
                <h4>Descripción</h4>
                <p>{inquiry.description}</p>
              </div>
              <div className="courses mb-5">
                <h4>Cursos</h4>
                <ul>
                  {inquiry.courses.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </div>
              <div className="equipment-list mb-5">
                <h4>Equipos</h4>
                <table
                  className="table table-bordered table-hover"
                  id="request-equipment-table">
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
              <div className="timeline mb-5">
                <h4>Duración</h4>
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
              <hr className="separator mb-5" />
              <div className="w-50 created-at">
                <h4>Fecha de creación de la solicitud</h4>
                <p>{convertTimeWithHour(inquiry.createdAt.toString())}</p>
              </div>
              {inquiry.status !== "Pending" && (
                <>
                  <hr className="separator mb-5 mt-5" />
                  <div className="w-100 mb-3 d-flex flex-row justify-content-between">
                    {inquiry.modifiedBy && (
                      <div className="w-50 created-at">
                        <h4>
                          {inquiry.status === "Accepted"
                            ? "Aprobado"
                            : "Rechazado"}{" "}
                          por
                        </h4>
                        <p>
                          {inquiry.modifiedBy.name}{" "}
                          <span className="text-muted">
                            (
                            <Link to={`mailto:${inquiry.modifiedBy.email}`}>
                              {inquiry.modifiedBy.email}
                            </Link>
                            )
                          </span>
                        </p>
                      </div>
                    )}
                    <div className="w-50 created-at">
                      <h4>
                        Fecha de{" "}
                        {inquiry.status === "Accepted"
                          ? "aceptación"
                          : "rechazo"}
                      </h4>
                      <p>{convertTimeWithHour(inquiry.updatedAt.toString())}</p>
                    </div>
                  </div>
                </>
              )}
              {canApprove && (
                <>
                  <hr className="separator mt-5" />
                  <div className="w-100 mt-5">
                    <div className="d-flex justify-content-center btn-group w-100 mx-auto">
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
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default InquiryDetail;
