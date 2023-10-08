import React, { useEffect, useState } from "react";
import { Equipment, getAllEquipment } from "./equipment";
import { Link } from "react-router-dom";
import "./EquipmentList.scss";
import ModalForm from "../ModalForm/ModalForm";
import Loader from "../../molecules/Loader/Loader";
import axios from "axios";
import {
  Manufacturer,
  getAllManufacturers,
} from "../ManufacturersList/manufacturers";

/** Interface for the EquipmentList component props. */
interface EquipmentListProps {
  /** Whether to allow the user to add new devices. */
  allowAddNewDevice?: boolean;
}

const EquipmentList = ({ allowAddNewDevice }: EquipmentListProps) => {
  const [equipment, setEquipment] = useState<Array<Equipment>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchManufacturers, setSearchManufacturers] = useState<string[]>([]);
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Array<Equipment>>(
    []
  );
  const [manufacturers, setManufacturers] = useState<Array<Manufacturer>>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [modalCallback, setModalCallback] = useState<() => void>(() => {});
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState(<></>);
  const [modalBtnText, setModalBtnText] = useState("");
  const [modalBtnClass, setModalBtnClass] = useState("");
  let newDevice = {} as Equipment;
  let images = {} as FileList;

  // Function to handle the search button click
  const handleSearchClick = () => {
    const newFilteredEquipment = equipment.filter((item) => {
      const nameMatch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const manufacturerMatch =
        searchManufacturers.length === 0 ||
        searchManufacturers.includes(item.manufacturer);
      const tagMatch =
        searchTags.length === 0 ||
        searchTags.some((tag) => item.tags.includes(tag));
      return nameMatch && manufacturerMatch && tagMatch;
    });

    setFilteredEquipment(newFilteredEquipment);
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchClick();
  };

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        // Fetch equipment data from the API
        const devices = await getAllEquipment();
        setEquipment(devices);
        setFilteredEquipment(devices); // TODO: implement filtering

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
  }, []);

  // Get unique manufacturers and tags for checkboxes
  const filteredManufacturers = [
    ...new Set(equipment.map((item) => item.manufacturer)),
  ];
  const filteredTags = [...new Set(equipment.flatMap((item) => item.tags))];

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
      const response = await axios.post("http://localhost:8080/device", device);
      const data = response.data;
      setShowModal(true);

      if (response.status === 201 && data.success) {
        setEquipment((prev) => [
          ...prev,
          { ...data.newdevice, manufacturer: device.manufacturer },
        ]);
        setFilteredEquipment((prev) => [
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
  // Returns an array of strings
  const handleUpload = async (manufacturer: string, device: string): Promise<string[]> => {
    if (images) {
      const formData = new FormData();
      formData.append("manufacturer", manufacturer);
      formData.append("device", device);
      for (const element of images) {
        formData.append("images", element);
      }

      try {
        const response = await axios.post(
          "http://localhost:8080/images/upload?imgType=device",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("ImgUpload", response.data);

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
            />
            <input
              type="text"
              className="form-control"
              id="deviceDocumentation"
              placeholder="URL"
            />
            <button className="btn btn-outline-secondary" type="button">
              Agregar
            </button>
          </div>
        </div>
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
          <button className="btn btn-success" onClick={handleAddDevice}>
            Agregar nuevo equipo
          </button>
        </div>
      ) : (
        <h1>Equipo de Laboratorio</h1>
      )}
      <form className="equipment-search-form" onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              id="searchTerm"
              className="form-control equipment-search-btn"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre del equipo"
            />
          </div>
          <div className="col-md-4">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle equipment-manufacturer-dropdown"
                type="button"
                id="manufacturerDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                Fabricante
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="manufacturerDropdown">
                {filteredManufacturers.map((manufacturer) => (
                  <li key={manufacturer}>
                    <a className="dropdown-item" href="#">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={manufacturer}
                          checked={searchManufacturers.includes(manufacturer)}
                          onChange={() =>
                            setSearchManufacturers((prevSelected) => {
                              if (prevSelected.includes(manufacturer)) {
                                return prevSelected.filter(
                                  (manu) => manu !== manufacturer
                                );
                              } else {
                                return [...prevSelected, manufacturer];
                              }
                            })
                          }
                        />
                        <label className="form-check-label">
                          {manufacturer}
                        </label>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle equipment-tags-dropdown"
                type="button"
                id="tagsDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                Etiquetas
              </button>
              <ul className="dropdown-menu" aria-labelledby="tagsDropdown">
                {filteredTags.map((tag) => (
                  <li key={tag}>
                    <a className="dropdown-item" href="#">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={tag}
                          checked={searchTags.includes(tag)}
                          onChange={() =>
                            setSearchTags((prevSelected) => {
                              if (prevSelected.includes(tag)) {
                                return prevSelected.filter((t) => t !== tag);
                              } else {
                                return [...prevSelected, tag];
                              }
                            })
                          }
                        />
                        <label className="form-check-label">{tag}</label>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button type="submit" className="btn btn-primary search-btn">
            Buscar
          </button>
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
            {filteredEquipment.map((item) => (
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
