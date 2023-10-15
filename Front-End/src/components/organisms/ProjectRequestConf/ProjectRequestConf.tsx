import React, { useEffect, useState } from "react";
import "./ProjectRequestConf.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Equipment } from "../EquipmentList/equipment";
import ModalForm from "../ModalForm/ModalForm";
import Loader from "../../molecules/Loader/Loader";
import "./ProjectRequestConf.scss";
import { BE_URL, timestampToShortDate } from "../../../utils/utils";

/** Interface to define the props of the component */
interface ProjectRequestProps {
  /** Id of the request to be confirmed */
  requestId: string | undefined;
}

const ProjectRequestConf = ({ requestId }: ProjectRequestProps) => {
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectRequester, setProjectRequester] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [courses, setCourses] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<Partial<Equipment>[]>([]);
  const [projectStatus, setProjectStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [modalCallback, setModalCallback] = useState<() => void>(() => {});
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState(<></>);
  const [modalBtnText, setModalBtnText] = useState("");
  const [modalBtnClass, setModalBtnClass] = useState("");
  const navigation = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const projectRequest = await axios.get(
          `${BE_URL}/inquiry/token/${requestId}`
        );

        if (projectRequest.status === 200 && projectRequest.data.success) {
          const projectData = projectRequest.data.inquiry;
          setProjectStatus(projectData.status);
          setProjectName(projectData.projectName);
          setProjectDesc(projectData.description);
          setProjectRequester(projectData.projectRequester.name);
          setStartDate(projectData.timelapse.start);
          setEndDate(projectData.timelapse.end);
          setCourses(projectData.courses);
          setEquipment(projectData.devices);
        } else {
          navigation("/");
        }
      } catch (error) {
        console.log(error);
      }
    })();

    setLoading(false);
  }, []);

  /** Confirm the project request */
  const confirmProjectRequest = async () => {
    setLoading(true);

    try {
      const requestConfirmation = await axios.put(
        `${BE_URL}/inquiry/confirm`,
        {
          confirmationToken: requestId,
        }
      );

      if (
        requestConfirmation.status === 200 &&
        requestConfirmation.data.success
      ) {
        setLoading(false);
        setShowModal(true);
        setModalTitle("Solicitud de Proyecto Confirmada");
        setModalBody(
          <>
            <p>
              Su solicitud de proyecto ha sido confirmada y ha ingresado al
              sistema.
            </p>
            <p>
              Se le estará notificando por correo electrónico cuando su
              solicitud haya sido revisada.
            </p>
          </>
        );
        setModalBtnText("Aceptar");
        setModalBtnClass("btn-success");
        setModalCallback(() => () => navigation("/"));
      } else {
        setShowModal(true);
        setModalTitle("Error al Confirmar Solicitud de Proyecto");
        setModalBody(
          <p>
            Ha ocurrido un error al confirmar la solicitud del proyecto. Por
            favor, intente nuevamente.
          </p>
        );
        setModalBtnText("Aceptar");
        setModalBtnClass("btn-danger");
        setModalCallback(() => () => setShowModal(false));
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <>
      <ModalForm
        show={showModal}
        handleClose={() => setShowModal(false)}
        onAccept={modalCallback}
        title={modalTitle}
        body={modalBody}
        primaryBtnText={modalBtnText}
        primaryBtnClass={modalBtnClass}
      />
      <Loader loading={loading} />
      <h1>Confirmación de Solicitud de Proyecto</h1>
      <div className="form-card card">
        {projectStatus === "Unconfirmed" ? (
          <form className="form">
            <h3 className="card-title mb-4">Datos del Proyecto</h3>
            <p className="card-project-name">
              <strong>Nombre del Proyecto:</strong> {projectName}
            </p>
            <p className="mb-0">
              <strong>Descripción</strong>
            </p>
            <p className="project-desc mb-3">{projectDesc}</p>
            <p className="mb-0 small-font mb-3">
              <strong className="normal-font-size">Duración:</strong>{" "}
              {timestampToShortDate(startDate)} -{" "}
              {timestampToShortDate(endDate)}
            </p>
            <p className="mb-0">
              <strong>Cursos:</strong>
            </p>
            <ul className="mb-3">
              {courses.map((course) => (
                <li key={course} className="small-font">
                  {course}
                </li>
              ))}
            </ul>
            <p className="mb-0">
              <strong>Equipos:</strong>
            </p>
            <ul className="mb-4">
              {equipment.map((item) => (
                <li key={item.name} className="small-font">
                  {item.name} ({item.quantity})
                </li>
              ))}
            </ul>
            <p className="my-3">
              Estimado(a) <strong>{projectRequester}</strong>, ¿desear confirmar
              la apertura de solicitud de este proyecto?
            </p>
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-success w-100 mt-3"
                onClick={confirmProjectRequest}>
                Confirmar
              </button>
            </div>
          </form>
        ) : (
          // Show that the request has already entered the system and provide a button to navigate to the home page
          <>
            <h3 className="card-title mb-4">
              Solicitud de Proyecto Confirmada
            </h3>
            <p>
              Su solicitud de proyecto ya ha sido confirmada y ha ingresado al
              sistema.
            </p>
            <p>
              Se le estará notificando por correo electrónico cuando su
              solicitud haya sido revisada.
            </p>
            <div className="d-flex justify-content-end">
              <Link to="/" className="btn btn-success w-100 mt-3">
                Aceptar
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProjectRequestConf;
