import React, { useEffect, useState } from "react";
import ModalForm from "../ModalForm/ModalForm";
import Loader from "../../molecules/Loader/Loader";
import { Equipment } from "../EquipmentList/equipment";
import axios from "axios";
import "./NewInquiryForm.scss";
import { Link, useNavigate } from "react-router-dom";
import {
  BE_URL,
  shortDateToTimestamp,
  timestampToShortDate,
} from "../../../utils/utils";

/** Interface that represents a selected device */
interface SelectedDevice {
  _id: string;
  device: Equipment;
  quantity: number;
}

const NewInquiryForm = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currCourse, setCurrCourse] = useState("");
  const [courses, setCourses] = useState<string[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<SelectedDevice[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [modalCallback, setModalCallback] = useState<() => void>(() => {});
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState(<></>);
  const [modalBtnText, setModalBtnText] = useState("");
  const [modalBtnClass, setModalBtnClass] = useState("");
  const navigation = useNavigate();

  useEffect(() => {
    setLoading(true);

    (async () => {
      const devicesResponse = await axios.get(`${BE_URL}/devices`);

      // Check if requestedDevices are in session storage
      const requestedDevices = sessionStorage.getItem("requestedDevices");
      if (requestedDevices) {
        const parsedRequestedDevices = JSON.parse(requestedDevices);
        const newSelectedDevices: SelectedDevice[] = [];
        for (const requestedDevice of parsedRequestedDevices) {
          const device = devicesResponse.data.devices.find(
            (device: Equipment) => device._id === requestedDevice._id
          );
          if (device) {
            newSelectedDevices.push({
              _id: requestedDevice.id,
              device,
              quantity: requestedDevice.quantity,
            });
          }
        }
        setSelectedDevices(newSelectedDevices);
      }

      setEquipment(devicesResponse.data.devices);
    })();

    setLoading(false);
  }, []);

  /** Checks if the email belongs to the university */
  const isUniversityEmail = (email: string): boolean => {
    return email.endsWith("@unis.edu.gt");
  };

  /** Checks if the email is valid */
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  /** Checks if the form can be submitted */
  const canSubmit = (): boolean => {
    return (
      userName !== "" &&
      userEmail !== "" &&
      projectName !== "" &&
      projectDesc !== "" &&
      startDate !== "" &&
      endDate !== "" &&
      courses.length > 0 &&
      selectedDevices.length > 0
    );
  };

  /** Attempts to submit the form */
  const submitForm = async () => {
    setLoading(true);

    const inquiry = {
      projectName,
      courses,
      description: projectDesc,
      timelapse: {
        start: shortDateToTimestamp(startDate),
        end: shortDateToTimestamp(endDate),
      },
      projectRequester: {
        name: userName,
        email: userEmail,
      },
      devices: selectedDevices.map(({ device, quantity }) => ({
        id: device._id,
        name: device.name,
        quantity,
      })),
      status: "Unconfirmed",
    };

    try {
      const response = await axios.post(
        `${BE_URL}/inquiry`,
        inquiry
      );

      if (response.status === 201 && response.data.success) {
        const confirmationToken = response.data.inquiry.confirmationToken;
        const confirmationEmailData = {
          to: userEmail,
          name: userName,
          project: projectName,
          description: projectDesc,
          devices: selectedDevices.map(({ device, quantity }) => ({
            name: device.name,
            quantity,
          })),
          courses,
          timelapse: {
            start: shortDateToTimestamp(startDate),
            end: shortDateToTimestamp(endDate),
          },
          acceptURL: `http://localhost:3000/confirm-request/${confirmationToken}`,
        };

        const confirmationEmailResponse = await axios.post(
          `${BE_URL}/mailer/send-inquiry-confirmation-email`,
          confirmationEmailData
        );

        if (
          confirmationEmailResponse.status === 200 &&
          confirmationEmailResponse.data.success
        ) {
          sessionStorage.removeItem("requestedDevices");
          setUserName("");
          setUserEmail("");
          setProjectName("");
          setProjectDesc("");
          setStartDate("");
          setEndDate("");
          setCourses([]);
          setSelectedDevices([]);
          setModalTitle("Solicitud enviada");
          setModalBody(
            <>
              <p className="fs-6">Su solicitud ha sido enviada con éxito.</p>
              <p className="fs-6">
                Por favor, revise su correo electrónico para confirmar su
                solicitud.
              </p>
            </>
          );
          setModalBtnText("Entendido");
          setModalBtnClass("btn-success");
          setModalCallback(() => () => {
            setShowModal(false);
            navigation("/inquiries");
          });
          setShowModal(true);
        } else {
          setModalTitle("Error");
          setModalBody(
            <>
              <p className="fs-6">Hubo un error al enviar su solicitud.</p>
              <p className="fs-6">Por favor, intente de nuevo más tarde.</p>
            </>
          );
          setModalBtnText("Entendido");
          setModalBtnClass("btn-primary");
          setModalCallback(() => () => {
            setShowModal(false);
            setUserName("");
            setUserEmail("");
            setProjectName("");
            setProjectDesc("");
            setStartDate("");
            setEndDate("");
            setCourses([]);
            setSelectedDevices([]);
          });
          setShowModal(true);
        }
      } else {
        setModalTitle("Error");
        setModalBody(
          <>
            <p className="fs-6">Hubo un error al enviar su solicitud.</p>
            <p className="fs-6">Por favor, intente de nuevo más tarde.</p>
          </>
        );
        setModalBtnText("Entendido");
        setModalBtnClass("btn-primary");
        setModalCallback(() => () => {
          setShowModal(false);
          setUserName("");
          setUserEmail("");
          setProjectName("");
          setProjectDesc("");
          setStartDate("");
          setEndDate("");
          setCourses([]);
          setSelectedDevices([]);
        });
        setShowModal(true);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  /** Attempts to submit the form */
  const attemptSubmit = () => {
    if (!isValidEmail(userEmail)) {
      setModalTitle("Error");
      setModalBody(
        <>
          <p className="fs-6">El correo electrónico ingresado no es válido.</p>
          <p className="fs-6">
            Por favor, ingrese un correo electrónico válido.
          </p>
        </>
      );
      setModalBtnText("Entendido");
      setModalBtnClass("btn-success");
      setModalCallback(() => () => {
        setShowModal(false);
        const input = document.getElementById("email") as HTMLInputElement;
        input.focus();
      });
      setShowModal(true);
    } else if (!isUniversityEmail(userEmail)) {
      setModalTitle("Error");
      setModalBody(
        <>
          <p className="fs-6">
            El correo electrónico ingresado no pertenece a la universidad.
          </p>
          <p className="fs-6">
            Por favor, ingrese su correo electrónico institucional.
          </p>
        </>
      );
      setModalBtnText("Entendido");
      setModalBtnClass("btn-success");
      setModalCallback(() => () => {
        setShowModal(false);
        const input = document.getElementById("email") as HTMLInputElement;
        input.focus();
      });
      setShowModal(true);
    } else {
      setModalTitle("Confirmar envío");
      setModalBody(
        <>
          <p className="fs-6">
            ¿Está seguro de que desea enviar una solicitud con los siguientes
            datos?
          </p>
          <p className="fs-6">
            <strong>Nombre:</strong> {userName}
          </p>
          <p className="fs-6">
            <strong>Correo electrónico:</strong> {userEmail}
          </p>
          <p className="fs-6">
            <strong>Nombre del proyecto:</strong> {projectName}
          </p>
          <p className="fs-6">
            <strong>Descripción del proyecto:</strong> {projectDesc}
          </p>
          <p className="fs-6">
            <strong>Período:</strong> {timestampToShortDate(startDate)} -{" "}
            {timestampToShortDate(endDate)}
          </p>
          <p className="fs-6">
            <strong>Clases:</strong> {courses.join(", ")}
          </p>
          <p className="fs-6">
            <strong>Dispositivos:</strong>
          </p>
          <ul>
            {selectedDevices.map(({ device, quantity }) => (
              <li key={device._id} className="fs-6">
                {device.name} ({quantity})
              </li>
            ))}
          </ul>
        </>
      );
      setModalBtnText("Enviar");
      setModalBtnClass("btn-success");
      setModalCallback(() => () => {
        submitForm();
      });
      setShowModal(true);
    }
  };

  return !loading ? (
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
      <h1>Nueva solicitud de proyecto</h1>
      <div className="form-card card">
        <form className="form" id="newInquiryForm">
          <div
            className="form-group mb-3 d-flex justify-content-between"
            id="userData">
            <div className="col-6">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Nombre"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="col-6">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Correo electrónico"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="projectName">Nombre del proyecto</label>
            <input
              type="text"
              className="form-control"
              id="projectName"
              placeholder="Nombre del proyecto"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="projectDesc">Descripción del proyecto</label>
            <textarea
              className="form-control"
              id="projectDesc"
              rows={3}
              placeholder="Descripción del proyecto"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
            />
          </div>
          <div
            className="form-group mb-3 d-flex justify-content-between"
            id="projectDates">
            <div className="col-6">
              <label htmlFor="startDate">Fecha de inicio</label>
              <input
                type="date"
                className="form-control"
                id="startDate"
                placeholder="Fecha de inicio"
                min={new Date().toISOString().split("T")[0]}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (e.target.value === "") {
                    setEndDate("");
                  }
                }}
              />
            </div>
            <div className="col-6">
              <label htmlFor="endDate">Fecha de finalización</label>
              <input
                type="date"
                className="form-control"
                id="endDate"
                placeholder="Fecha de finalización"
                min={startDate}
                value={endDate}
                disabled={startDate === ""}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-4" id="projectClasses">
            <label htmlFor="classes">Clases</label>
            <div className="col-10">
              <input
                type="text"
                className="form-control"
                id="classes"
                placeholder="Nombre de la clase"
                onChange={(e) => setCurrCourse(e.target.value)}
              />
            </div>
            <div className="col-2">
              <button
                type="button"
                className="btn btn-primary w-100"
                disabled={currCourse === ""}
                onClick={() => {
                  const newClasses = [...courses];
                  newClasses.push(currCourse);
                  setCourses(newClasses);
                  setCurrCourse("");

                  // Clear input
                  const input = document.getElementById(
                    "classes"
                  ) as HTMLInputElement;
                  input.value = "";
                }}>
                Agregar
              </button>
            </div>
          </div>
          {courses.length > 0 && (
            <table className="table mb-4">
              <thead>
                <tr>
                  <th scope="col">Clase</th>
                  <th scope="col">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((currClass, index) => (
                  <tr key={index}>
                    <td>{currClass}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          const newClasses = [...courses];
                          newClasses.splice(index, 1);
                          setCourses(newClasses);
                        }}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <hr />
          <div className="form-group mb-3">
            <label htmlFor="selectedDevices">Dispositivos</label>
            <div className="container" id="selectedDevicesContainer">
              <table className="table table-responsive">
                <thead>
                  <tr>
                    <th scope="col">Seleccionar</th>
                    <th scope="col">Dispositivo</th>
                    <th scope="col">Cantidad Disponible</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((device) => (
                    <tr key={device._id}>
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input device-checkbox"
                          id="selectedDevices"
                          checked={
                            selectedDevices.findIndex(
                              (selectedDevice) =>
                                selectedDevice.device._id === device._id
                            ) !== -1
                          }
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            if (isChecked) {
                              const newSelectedDevices = [...selectedDevices];
                              newSelectedDevices.push({
                                _id: device._id,
                                device,
                                quantity: 1,
                              });
                              setSelectedDevices(newSelectedDevices);
                            } else {
                              const newSelectedDevices = [...selectedDevices];
                              const index = newSelectedDevices.findIndex(
                                (selectedDevice) =>
                                  selectedDevice.device._id === device._id
                              );
                              newSelectedDevices.splice(index, 1);
                              setSelectedDevices(newSelectedDevices);
                            }
                          }}
                        />
                      </td>
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
          </div>
          {selectedDevices.length > 0 && (
            <table className="table mb-4">
              <thead>
                <tr>
                  <th scope="col">Dispositivo</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {selectedDevices.map(({ device }, index) => (
                  <tr key={device._id}>
                    <td>{device.name}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        max={device.quantity}
                        step="1"
                        id="quantity"
                        placeholder="Cantidad"
                        value={selectedDevices[index].quantity}
                        onChange={(e) => {
                          const newSelectedDevices = [...selectedDevices];
                          newSelectedDevices[index].quantity = Number(
                            e.target.value
                          );
                          setSelectedDevices(newSelectedDevices);
                        }}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          const newSelectedDevices = [...selectedDevices];
                          newSelectedDevices.splice(index, 1);
                          setSelectedDevices(newSelectedDevices);

                          // Toggle the checkbox corresponding to the device
                          const checkboxes =
                            document.getElementsByClassName("device-checkbox");
                          for (const element of checkboxes) {
                            const checkbox = element as HTMLInputElement;
                            if (
                              checkbox.id === "selectedDevices" &&
                              checkbox.checked &&
                              checkbox.parentElement?.parentElement
                                ?.parentElement?.parentElement
                            ) {
                              checkbox.checked = false;
                            }
                          }

                          // Remove from session storage
                          const requestedDevices =
                            sessionStorage.getItem("requestedDevices");
                          if (requestedDevices) {
                            const parsedRequestedDevices = JSON.parse(
                              requestedDevices
                            );
                            const newRequestedDevices = parsedRequestedDevices.filter(
                              (requestedDevice: SelectedDevice) =>
                                requestedDevice._id !== device._id
                            );
                            sessionStorage.setItem(
                              "requestedDevices",
                              JSON.stringify(newRequestedDevices)
                            );
                          }
                        }}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button
            type="button"
            className="btn btn-primary w-100"
            disabled={!canSubmit()}
            onClick={attemptSubmit}>
            Enviar solicitud
          </button>
        </form>
      </div>
    </>
  ) : (
    <Loader loading={loading} />
  );
};

export default NewInquiryForm;
