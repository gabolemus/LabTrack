import React, { useEffect, useState } from "react";
import { Equipment, fetchEquipmentData } from "../EquipmentList/equipment";
import EquipmentImgView from "../EquipmentImgView/EquipmentImgView";
import EquipmentDocs from "../../molecules/EquipmentDocs/EquipmentDocs";
import { areObjectsEqual, timestampToDate } from "../../../utils/utils";
import { Link } from "react-router-dom";
import "./EquipmentDetail.scss";
import Loader from "../../molecules/Loader/Loader";
import ModalForm from "../ModalForm/ModalForm";
import {
  Manufacturer,
  getAllManufacturers,
} from "../ManufacturersList/manufacturers";
import axios from "axios";

/** Interface for EquipmentDetail props */
interface EquipmentDetailProps {
  /** Device ID */
  id: string;
}

const EquipmentDetail = ({ id }: EquipmentDetailProps) => {
  const [userType, setUserType] = useState("");
  const [device, setDevice] = useState<Equipment>({} as Equipment);
  const [updatedDevice, setUpdatedDevice] = useState<Equipment>(
    {} as Equipment
  );
  const [manufacturers, setManufacturers] = useState<Array<Manufacturer>>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [allowUpdate, setAllowUpdate] = useState(false);
  const [requestedDevice, setRequestedDevice] = useState<Partial<Equipment>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [modalCallback, setModalCallback] = useState<() => void>(() => {});
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState(<></>);
  const [modalBtnText, setModalBtnText] = useState("");
  const [modalBtnClass, setModalBtnClass] = useState("");

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    const user = localStorage.getItem("role");
    setUserType(user || "");
    if (user === "superAdmin") {
      setAllowUpdate(true);
    }

    // Simulate fetching equipment data based on the ID from your data source
    const fetchData = async () => {
      try {
        // Get the equipment
        const data = await fetchEquipmentData(id);
        setDevice(data);
        setRequestedDevice({
          _id: data._id,
          name: data.name,
          quantity: Math.min(data.quantity, 1),
        });
        setUpdatedDevice(data);

        // Get the manufacturers
        const manufacturersData = await getAllManufacturers();
        setManufacturers(manufacturersData);

        // Select the first image as the initially selected image
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    setLoading(true);
    fetchData();
    setLoading(false);
  }, [id]);

  if (!device) {
    // Equipment not found by ID
    return (
      <>
        <h1>Error</h1>
        <p>
          El equipo con ID <b className="equipment-id">{id}</b> no fue
          encontrado.
        </p>
        <Link className="btn btn-primary" to="/equipment">
          Ir al listado de equipos
        </Link>
      </>
    );
  }

  const handleImageClick = (image: string) => {
    // Set the clicked image as the selected main image
    setSelectedImage(image);
  };

  const getDeviceStatus = (status: string) => {
    switch (status) {
      case "Available":
        return "Disponible";
      case "In Use":
        return "En uso";
      case "In Maintenance":
        return "En mantenimiento";
      case "Broken":
        return "Dañado";
      default:
        return "Desconocido";
    }
  };

  /** Undoes any changes made to the device */
  const discardChanges = () => {
    setUpdatedDevice(device);
  };

  /** Component for the update buttons */
  const UpdateButtons = () => (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <button
        className="btn btn-primary"
        disabled={areObjectsEqual(device, updatedDevice)}
        onClick={handleUpdateDevice}>
        Actualizar
      </button>
      <button
        className="btn btn-danger"
        disabled={areObjectsEqual(device, updatedDevice)}
        onClick={discardChanges}>
        Descartar Cambios
      </button>
    </div>
  );

  /** Modal callback to update the device */
  const updateDevice = async (device: Equipment) => {
    // Decode the images URLs before sending the request as they are encoded in the BE
    if (device.images) {
      device.images = device.images.map((image) => decodeURIComponent(image));
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/device?id=${device._id}`,
        device
      );
      const data = response.data;
      setShowModal(true);

      if (response.status === 200 && data.success) {
        setDevice(data.device);
        setUpdatedDevice(data.device);
        setModalTitle("Equipo Actualizado");
        setModalBody(
          <p className="fs-6">El equipo fue actualizado correctamente.</p>
        );
        setModalBtnText("Aceptar");
        setModalBtnClass("btn-success");
        setModalCallback(() => () => {
          setShowModal(false);
        });
      }
    } catch (error) {
      console.error(error);

      let msg = (
        <>
          <p className="fs-6">
            Ha ocurrido un error al intentar agregar el equipo.
          </p>
          <p className="fs-6">Por favor, intente de nuevo más tarde.</p>
        </>
      );

      if (axios.isAxiosError(error)) {
        const { response } = error;

        if (response?.data.error === "ENFORCE_UNIQUE_FIELD") {
          msg = (
            <>
              <p className="fs-6">
                Un dispositivo con el nombre {device.name} ya existe.
              </p>
              <p className="fs-6">
                Por favor, ingrese un nombre diferente para el dispositivo.
              </p>
            </>
          );
        }
      }

      setModalTitle("Error");
      setModalBody(msg);
      setModalBtnText("Aceptar");
      setModalBtnClass("btn-danger");
      setModalCallback(() => () => {
        setShowModal(false);
      });
    }
  };

  /** Handles updating the device */
  const handleUpdateDevice = () => {
    setShowModal(true);
    setModalTitle("Actualizar Equipo");
    setModalBody(
      <p className="fs-6 ">
        ¿Estás seguro de que quieres actualizar este equipo?
      </p>
    );
    setModalBtnText("Actualizar");
    setModalBtnClass("btn-success");
    setModalCallback(() => () => updateDevice(updatedDevice));
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
      <div className="equipment-detail mb-5">
        {allowUpdate ? (
          <>
            <UpdateButtons />
            <div className="d-flex justify-content-between align-items-center">
              <input
                className="form-control mb-5 device-title-input"
                type="text"
                value={updatedDevice.name}
                onChange={(e) =>
                  setUpdatedDevice({ ...updatedDevice, name: e.target.value })
                }
              />
            </div>
          </>
        ) : (
          <h1>{device.name}</h1>
        )}
        <EquipmentImgView
          equipment={device}
          selectedImage={selectedImage}
          handleImageClick={handleImageClick}
        />
        {device.images && <hr className="divider" />}
        <div className="equipment-details">
          {!allowUpdate && userType !== "admin" && (
            <>
              <h2>Agregar a la solicitud</h2>
              <label htmlFor="equipmentAmount">Cantidad</label>
              <div
                className="form-group mb-5 d-flex justify-content-between w-100"
                id="requestedEquipment">
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control"
                    id="equipmentAmount"
                    placeholder="Cantidad por solicitar"
                    min="1"
                    step="1"
                    max={device.quantity}
                    value={requestedDevice.quantity}
                    onChange={(e) => {
                      setRequestedDevice({
                        ...requestedDevice,
                        quantity: Math.min(
                          parseInt(e.target.value),
                          device.quantity
                        ),
                      });
                    }}
                  />
                </div>
                <div className="col-6">
                  <button
                    className="btn btn-primary"
                    disabled={requestedDevice.quantity === 0}
                    onClick={() => {
                      const requestedDevices =
                        sessionStorage.getItem("requestedDevices");
                      const parsedRequestedDevices = requestedDevices
                        ? JSON.parse(requestedDevices)
                        : [];
                      const requestedDeviceIndex =
                        parsedRequestedDevices.findIndex(
                          (device: Equipment) =>
                            device._id === requestedDevice._id
                        );
                      if (requestedDeviceIndex !== -1) {
                        parsedRequestedDevices[requestedDeviceIndex].quantity =
                          requestedDevice.quantity;
                      } else {
                        parsedRequestedDevices.push(requestedDevice);
                      }
                      sessionStorage.setItem(
                        "requestedDevices",
                        JSON.stringify(parsedRequestedDevices)
                      );

                      setShowModal(true);
                      setModalTitle("Equipo Agregado");
                      setModalBody(
                        <>
                          <p className="fs-6">
                            El equipo fue agregado correctamente a la solicitud.
                          </p>
                          <p className="fs-6">
                            Cuando desee realizar su solicitud, diríjase al
                            apartado de{" "}
                            <Link to="/inquiries">solicitudes</Link>.
                          </p>
                        </>
                      );
                      setModalBtnText("Aceptar");
                      setModalBtnClass("btn-success");
                      setModalCallback(() => () => {
                        setShowModal(false);
                      });
                    }}>
                    Agregar a la solicitud
                  </button>
                </div>
              </div>
              <hr className="divider" />
            </>
          )}
          <h2>Detalles del Equipo</h2>
          {allowUpdate ? (
            <div className="mb-5">
              <label htmlFor="manufacturer">Fabricante</label>
              <select
                className="form-control mb-5"
                value={updatedDevice.manufacturer}
                onChange={(e) => {
                  setUpdatedDevice({
                    ...updatedDevice,
                    manufacturer: e.target.value,
                  });
                }}>
                {manufacturers.map((manufacturer) => (
                  <option key={manufacturer._id} value={manufacturer.name}>
                    {manufacturer.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p>
              <b>Fabricante:</b> {device.manufacturer}
            </p>
          )}
          <EquipmentDocs equipment={device} />
          <hr className="divider" />
          <h2>Proyectos en los que se ha utilizado</h2>
          {device.projects && device.projects.length > 0 ? (
            <ul className="mb-4">
              {device.projects.map((project) => (
                <li key={project.name}>
                  <Link to={`/projects${project.path}`}>{project.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No se ha utilizado en ningún proyecto</p>
          )}
          <hr className="divider" />
          <h2>Información Adicional</h2>
          {device.notes && (
            <div className="notes">
              <h3>Notas</h3>
              <p className="equipment-notes">{device.notes}</p>
            </div>
          )}
          <div className="status mb-5">
            <h3>Estado</h3>
            {allowUpdate ? (
              <select
                className="form-select"
                id="deviceStatus"
                value={updatedDevice.status}
                onChange={(e) => {
                  setUpdatedDevice({
                    ...updatedDevice,
                    status: e.target.value,
                  });
                }}>
                <option value="Available">Disponible</option>
                <option value="In Use">En uso</option>
                <option value="In Maintenance">En mantenimiento</option>
                <option value="Broken">Averiado</option>
              </select>
            ) : (
              <p>{getDeviceStatus(device.status)}</p>
            )}
          </div>
          <div className="last-checked mb-5">
            <h3>Última Actualización</h3>
            <p>{timestampToDate(device.updatedAt)}</p>
          </div>
          {device.configuration && (
            <div className="configuration">
              <h3>Configuration</h3>
              <p className="equipment-notes">{device.configuration}</p>
            </div>
          )}
          {allowUpdate && <UpdateButtons />}
        </div>
      </div>
    </>
  ) : (
    <Loader loading={loading} />
  );
};

export default EquipmentDetail;
