import React, { useEffect, useState } from "react";
import ModalForm from "../ModalForm/ModalForm";
import Loader from "../../molecules/Loader/Loader";
import { Equipment } from "../EquipmentList/equipment";
import axios from "axios";
import "./NewInquiryForm.scss";
import { Link } from "react-router-dom";

/** Interface that represents a selected device */
interface SelectedDevice {
  device: Equipment;
  quantity: number;
}

const NewInquiryForm = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [projectName, setProjectName] = useState("");
  const [currClass, setCurrClass] = useState("");
  const [classes, setClasses] = useState<string[]>([]);
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

  useEffect(() => {
    setLoading(true);

    (async () => {
      const devicesResponse = await axios.get("http://localhost:8080/devices");
      setEquipment(devicesResponse.data.devices);
      console.log(devicesResponse.data.devices);
    })();

    setLoading(false);
  }, []);

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
          <div className="row mb-4" id="projectClasses">
            <label htmlFor="classes">Clases</label>
            <div className="col-10">
              <input
                type="text"
                className="form-control"
                id="classes"
                placeholder="Nombre de la clase"
                onChange={(e) => setCurrClass(e.target.value)}
              />
            </div>
            <div className="col-2">
              <button
                type="button"
                className="btn btn-primary w-100"
                disabled={currClass === ""}
                onClick={() => {
                  const newClasses = [...classes];
                  newClasses.push(currClass);
                  setClasses(newClasses);
                  setCurrClass("");

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
          {classes.length > 0 && (
            <table className="table mb-4">
              <thead>
                <tr>
                  <th scope="col">Clase</th>
                  <th scope="col">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((currClass, index) => (
                  <tr key={index}>
                    <td>{currClass}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          const newClasses = [...classes];
                          newClasses.splice(index, 1);
                          setClasses(newClasses);
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
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            if (isChecked) {
                              const newSelectedDevices = [...selectedDevices];
                              newSelectedDevices.push({
                                device,
                                quantity: 0,
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button type="button" className="btn btn-primary w-100">
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
