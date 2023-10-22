import React, { useEffect, useState } from "react";
import { Equipment, getAllEquipment, getFilteredEquipment } from "./equipment";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./EquipmentList.scss";
import ModalForm from "../ModalForm/ModalForm";
import Loader from "../../molecules/Loader/Loader";
import axios from "axios";
import {
  Manufacturer,
  getAllManufacturers,
} from "../ManufacturersList/manufacturers";
import { BE_URL } from "../../../utils/utils";

interface DocLink {
  name: string;
  url: string;
}

const EquipmentList = () => {
  // URL search params
  const [searchParams, setSearchParams] = useSearchParams();
  const equipmentName = searchParams.get("equipment");

  // Component state
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [currSearchTerm, setCurrSearchTerm] = useState(equipmentName ?? "");
  const [lastSearchTerm, setLastSearchTerm] = useState(equipmentName ?? "");
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [allowAddNewDevice, setAllowAddNewDevice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [modalCallback, setModalCallback] = useState<() => void>(() => {});
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState(<></>);
  const [modalBtnText, setModalBtnText] = useState("");
  const [modalBtnClass, setModalBtnClass] = useState("");
  const [newDocs, setNewDocs] = useState<DocLink[]>([]);
  let newDevice = {} as Equipment;
  let images = {} as FileList;
  const navigate = useNavigate();

  const [testBool, setTestBool] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    quantity: 0,
    status: "Available",
    documentation: [],
    // ... other form fields
  });

  const { name, manufacturer, quantity, status, documentation } = formData;

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    filterEquipment();
  };

  /** Filters inquiries by project name and status */
  const filterEquipment = async (equipmentName: string = currSearchTerm) => {
    setLoading(true);
    const equipmentRes: Array<Equipment> =
      await getFilteredEquipment(equipmentName);
    setEquipment(equipmentRes);
    setLastSearchTerm(equipmentName);
    setSearchParams({
      ...(equipmentName !== "" && { equipment: currSearchTerm }),
    });
    setLoading(false);
  };

  useEffect(() => {
    const user = localStorage.getItem("role");
    if (user === "superAdmin") {
      setAllowAddNewDevice(true);
    }

    (async () => {
      setLoading(true);

      try {
        // Fetch equipment data from the API
        const devices = await getAllEquipment();
        setEquipment(devices);

        // Get the manufacturers from the API
        const manufacturersResponse = await getAllManufacturers();
        setManufacturers(manufacturersResponse);

        // Initialize filtered equipment when the component first loads
        // handleSearchClick();
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    })();

    filterEquipment();
  }, []);

  /** Modal callback to add a new device. */
  const addDevice = async (device: Equipment) => {
    if (!device.status) {
      device = { ...device, status: "Available" };
    }

    if (!device.manufacturer) {
      device = { ...device, manufacturer: manufacturers[0].name };
    }

    const imagePaths = await handleUpload(device.manufacturer, device.name);
    device = { ...device, images: imagePaths };

    try {
      const response = await axios.post(`${BE_URL}/device`, device);
      const data = response.data;
      setShowModal(true);

      if (response.status === 201 && data.success) {
        setEquipment((prev) => [
          ...prev,
          { ...data.newdevice, manufacturer: device.manufacturer },
        ]);
        setModalTitle("Equipo agregado");
        setModalBody(
          <p className="fs-6">
            El equipo {data.newdevice.name} ha sido agregado exitosamente.
          </p>
        );
        setModalBtnText("Aceptar");
        setModalBtnClass("btn-primary");
        setModalCallback(() => () => {
          setShowModal(false);
        });
      }
    } catch (error) {
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
                Si desea modificar la cantidad, diríjase a la página del equipo.
              </p>
              <p className="fs-6">
                De lo contrario, si desea crear un nuevo dispositivo, asegúrese
                que tenga un nombre único.
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

  /** Handles changing the images to be uploaded. */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      images = event.target.files;
    }
  };

  /** Handles uploading the images. */
  const handleUpload = async (
    manufacturer: string,
    device: string
  ): Promise<string[]> => {
    if (images) {
      const formData = new FormData();
      formData.append("manufacturer", manufacturer);
      formData.append("device", device);
      for (const element of images) {
        formData.append("images", element);
      }

      try {
        const response = await axios.post(
          `${BE_URL}/images/upload?imgType=device`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response.data.imagePaths;
      } catch (error) {
        console.log(error);
        return [];
      }
    }

    return [];
  };

  /** Shows the modal with a form to add a new device. */
  const handleAddDevice = () => {
    let newDocumentationName = "";
    let newDocumentationURL = "";

    setShowModal(true);
    setModalTitle("Agregar nuevo dispositivo");
    setModalBody(
      <form className="new-device-form">
        <div className="mb-3">
          <label htmlFor="deviceName" className="form-label">
            Nombre del dispositivo
          </label>
          <input
            type="text"
            className="form-control"
            id="deviceName"
            placeholder="Nombre del dispositivo"
            onChange={(e) => {
              const name = e.target.value;
              newDevice = { ...newDevice, name };
              setModalCallback(() => () => {
                addDevice(newDevice);
              });
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="deviceManufacturer" className="form-label">
            Fabricante
          </label>
          <select
            className="form-select"
            id="deviceManufacturer"
            onChange={(e) => {
              const manufacturer = e.target.value;
              newDevice = { ...newDevice, manufacturer };
              setModalCallback(() => () => {
                addDevice(newDevice);
              });
            }}>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer._id} value={manufacturer.name}>
                {manufacturer.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="deviceQuantity" className="form-label">
            Cantidad
          </label>
          <input
            type="number"
            className="form-control"
            id="deviceQuantity"
            placeholder="Cantidad"
            onChange={(e) => {
              const quantity = parseInt(e.target.value);
              newDevice = { ...newDevice, quantity };
              setModalCallback(() => () => {
                addDevice(newDevice);
              });
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="deviceStatus" className="form-label">
            Estado
          </label>
          <select
            className="form-select"
            id="deviceStatus"
            onChange={(e) => {
              const status = e.target.value;
              newDevice = { ...newDevice, status };
              setModalCallback(() => () => {
                addDevice(newDevice);
              });
            }}>
            <option value="Available">Disponible</option>
            <option value="In Use">En uso</option>
            <option value="In Maintenance">En mantenimiento</option>
            <option value="Broken">Averiado</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="deviceDocumentation" className="form-label">
            Documentación
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="deviceDocumentation"
              placeholder="Nombre"
              onChange={(e) => (newDocumentationName = e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              id="deviceDocumentation"
              placeholder="URL"
              onChange={(e) => (newDocumentationURL = e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => {
                console.log("Clicked!");
                console.log(newDocumentationName);
                console.log(newDocumentationURL);

                if (newDocumentationName && newDocumentationURL) {
                  newDevice = {
                    ...newDevice,
                    documentation: [
                      ...(newDevice.documentation ?? []),
                      {
                        name: newDocumentationName,
                        url: newDocumentationURL,
                      },
                    ],
                  };
                  console.log(newDevice);
                  setNewDocs((prev) => [
                    ...prev,
                    {
                      name: newDocumentationName,
                      url: newDocumentationURL,
                    },
                  ]);
                  console.log(newDocs);
                  setModalCallback(() => () => {
                    addDevice(newDevice);
                  });
                }
              }}>
              Agregar
            </button>
          </div>
        </div>
        {newDocs.length > 0 && (
          <div className="mb-3">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                {newDocs.map((doc) => (
                  <tr key={doc.name}>
                    <td>{doc.name}</td>
                    <td>{doc.url}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="deviceTags" className="form-label">
            Etiquetas
          </label>
          <input
            type="text"
            className="form-control"
            id="deviceTags"
            placeholder="Etiquetas"
            onChange={(e) => {
              const tags = [e.target.value];
              newDevice = { ...newDevice, tags };
              setModalCallback(() => () => {
                addDevice(newDevice);
              });
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="deviceNotes" className="form-label">
            Notas
          </label>
          <textarea
            className="form-control"
            id="deviceNotes"
            rows={3}></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="deviceConfiguration" className="form-label">
            Configuración
          </label>
          <textarea
            className="form-control"
            id="deviceConfiguration"
            rows={3}></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="deviceConfiguration" className="form-label">
            Imágenes
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>
      </form>
    );
    setModalBtnText("Agregar");
    setModalBtnClass("btn-success");
  };

  /** Determines if a search can be made */
  const canMakeSearch = () =>
    currSearchTerm !== "" && currSearchTerm !== lastSearchTerm;

  return !loading ? (
    <div>
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
      {allowAddNewDevice ? (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Equipo de Laboratorio</h1>
          <button className="btn btn-success" onClick={() => navigate("/new-equipment")}>
            Agregar nuevo equipo
          </button>
        </div>
      ) : (
        <h1>Equipo de Laboratorio</h1>
      )}
      <form className="equipment-search-form" onSubmit={handleSubmit}>
        <div className="row mb-3" id="equipmentSearchForm">
          <div className="col px-0">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del equipo"
                aria-label="Nombre del equipo"
                aria-describedby="button-addon2"
                onChange={(e) => setCurrSearchTerm(e.target.value)}
              />
              <div className="input-group-append">
                {/* // TODO: add dropdown to filter by status */}
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => {
                    // Clear the text input
                    const input = document.querySelector(
                      "#equipmentSearchForm input"
                    ) as HTMLInputElement;
                    input.value = "";

                    setLastSearchTerm("");
                    setCurrSearchTerm("");
                    filterEquipment("");
                  }}>
                  Borrar filtros
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={!canMakeSearch()}
                  onClick={
                    canMakeSearch() ? () => filterEquipment() : undefined
                  }>
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="equipment-table">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fabricante</th>
              <th>Etiquetas</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr key={item._id}>
                <td>
                  <Link to={`/equipment${item.path}`}>{item.name}</Link>
                </td>
                <td>{item.manufacturer}</td>
                <td>{item.tags.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loader loading={loading} />
  );
};

export default EquipmentList;
