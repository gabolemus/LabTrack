import React, { useEffect, useState } from "react";
import { Equipment, fetchEquipmentData } from "../EquipmentList/equipment";
import EquipmentImgView from "../EquipmentImgView/EquipmentImgView";
import { BE_URL, areObjectsEqual, timestampToDate } from "../../../utils/utils";
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
  const [device, setDevice] = useState<Partial<Equipment>>(
    {} as Partial<Equipment>
  );
  const [updatedDevice, setUpdatedDevice] = useState<Partial<Equipment>>(
    {} as Partial<Equipment>
  );
  const [currDocName, setCurrDocName] = useState("");
  const [currDocLink, setCurrDocLink] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
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

        // Add the "delete" field to the images
        if (data.images && data.images.length > 0) {
          data.images = data.images.map((image) => ({
            ...image,
            delete: false,
            new: false,
          }));
        }

        setDevice(data);
        setRequestedDevice({
          _id: data._id,
          name: data.name,
          quantity: Math.min(data.quantity, 1),
        });
        // Copy the values of the device by value, not by reference
        setUpdatedDevice(JSON.parse(JSON.stringify(data)));

        // Get the manufacturers
        const manufacturersData = await getAllManufacturers();
        setManufacturers(manufacturersData);

        // Select the first image as the initially selected image
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].url);
        } else {
          setSelectedImage(null);
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

  const getDeviceStatusClassName = (status: string) => {
    if (status === undefined) {
      return "unknown";
    } else {
      return status.toLowerCase().replace(" ", "-");
    }
  };

  /** Undoes any changes made to the device */
  const discardChanges = () => {
    const prevDevice: Partial<Equipment> = JSON.parse(JSON.stringify(device));
    if (prevDevice.images && prevDevice.images.length > 0) {
      prevDevice.images = prevDevice.images.map((image) => ({
        ...image,
        delete: false,
        new: false,
      }));
    }
    setUpdatedDevice(prevDevice);
    setImages(null);
    const fileInput = document.getElementById("images") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    if (device.images && device.images.length > 0) {
      setSelectedImage(device.images[0].url);
    } else {
      setSelectedImage(null);
    }
  };

  /** Component for the update buttons */
  const UpdateButtons = (className: string) => (
    <div
      className={`d-flex justify-content-between align-items-center${className}`}>
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
  const updateDevice = async (device: Partial<Equipment>) => {
    // TODO: update this to also change the images
    // TODO: add a new history entry when an update is done

    try {
      // Images paths to be deleted
      const imagesToDelete: Array<string> = [];
      if (device.images) {
        for (const image of device.images) {
          if (image.delete) {
            imagesToDelete.push(image.url);
          }
        }
      }
      if (imagesToDelete.length > 0) {
        axios.delete(`${BE_URL}/images/delete`, {
          data: {
            imagePaths: imagesToDelete,
          },
        });
      }

      // Remove the image paths from the device objcect
      const updatedDeviceNoImages = JSON.parse(JSON.stringify(device));
      if (updatedDeviceNoImages.images) {
        updatedDeviceNoImages.images = (
          updatedDeviceNoImages.images as any[]
        ).filter((image) => !image.delete);
      }

      // Upload the new images
      let newImages = device.images?.filter((image) => image.new);
      const formData = new FormData();
      formData.append("manufacturer", device.manufacturer ?? "");
      formData.append("device", device.name ?? "");
      for (const element of images ?? []) {
        formData.append("images", element);
      }
      if (newImages && newImages.length > 0) {
        const newImagesRes = await axios.post(
          `${BE_URL}/images/upload?imgType=device`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // Update `newImages` with the paths of the new images
        newImages = newImages.map((image, index) => ({
          ...image,
          url: newImagesRes.data.imagePaths[index],
        }));
      }

      // Remove the images whose `url` start with "blob:"
      updatedDeviceNoImages.images = (
        updatedDeviceNoImages.images as any[]
      ).filter((image) => !image.url.startsWith("blob:"));

      // Append the `newImages` to the `updatedDeviceNoImages`
      if (newImages && newImages.length > 0) {
        if (updatedDeviceNoImages.images) {
          updatedDeviceNoImages.images = [
            ...(updatedDeviceNoImages.images ?? []),
            ...newImages,
          ];
        } else {
          updatedDeviceNoImages.images = newImages;
        }
      }

      const response = await axios.put(
        `${BE_URL}/device?id=${device._id}`,
        updatedDeviceNoImages
      );
      const data = response.data;
      setShowModal(true);

      if (response.status === 200 && data.success) {
        if (device.images) {
          for (const image of device.images) {
            image.delete = false;
            image.new = false;
          }
        }
        setImages(null);
        const fileInput = document.getElementById("images") as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
        if (data.device.images && data.device.images.length > 0) {
          setSelectedImage(data.device.images[0].url);
        } else {
          setSelectedImage(null);
        }
        setDevice(data.device);
        setUpdatedDevice(JSON.parse(JSON.stringify(data.device)));
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
            Ha ocurrido un error al intentar actualizar el equipo.
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

  /**
   * Adds the new images to the formData
   * @param event Event that triggered the function
   */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const fileList = event.target.files;
      setImages(fileList);

      // Add the images to the updated device
      const newImages = Array.from(fileList).map((file) => ({
        url: URL.createObjectURL(file),
        caption: "",
        new: true,
      }));
      setUpdatedDevice({
        ...updatedDevice,
        images: [...(updatedDevice.images ?? []), ...newImages],
      });

      setSelectedImage(newImages[0].url);
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
      <div className="form-card card equipment-card">
        <div className="equipment-detail mb-3">
          {allowUpdate ? (
            <>
              {UpdateButtons(" mb-4")}
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
            equipment={updatedDevice}
            updateEquipment={setUpdatedDevice}
            selectedImage={selectedImage}
            handleImageClick={(image) => setSelectedImage(image)}
            showDeleteButton={allowUpdate}
          />
          {device.images && <hr className="divider" />}
          {allowUpdate && (
            <>
              <label htmlFor="newEquipmentImages">Nuevas Imágenes</label>
              <input
                type="file"
                accept="image/*"
                className="form-control mb-5 img-file-uploader"
                id="images"
                multiple
                placeholder="Seleccionar imágenes"
                onChange={handleImageChange}
              />
              {images && images.length > 0 && (
                <div className="row">
                  {Array.from(images).map((image, index) => (
                    <div className="col-3" key={index}>
                      <div className="card">
                        <img
                          src={URL.createObjectURL(image)}
                          className="card-img-top"
                          alt="..."
                        />
                        <div className="card-body">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Título de la imagen"
                            onChange={(e) => {
                              const newImages = updatedDevice.images ?? [];
                              newImages[
                                index + (device.images ?? []).length
                              ].caption = e.target.value;
                              setUpdatedDevice({
                                ...updatedDevice,
                                images: newImages,
                              });
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-danger mt-2"
                            onClick={() => {
                              const newImages = updatedDevice.images ?? [];
                              newImages.splice(
                                index + (device.images ?? []).length,
                                1
                              );
                              setUpdatedDevice({
                                ...updatedDevice,
                                images: newImages,
                              });

                              const oldImages = Array.from(images);
                              oldImages.splice(index, 1);
                              const dataTransfer = new DataTransfer();
                              for (const file of oldImages) {
                                dataTransfer.items.add(file);
                              }
                              setImages(dataTransfer.files);

                              const fileInput = document.getElementById(
                                "images"
                              ) as HTMLInputElement;
                              if (fileInput) {
                                if (oldImages.length === 0) {
                                  fileInput.value = "";
                                } else {
                                  fileInput.files = dataTransfer.files;
                                }
                              }
                            }}>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <hr className="divider mt-3" />
            </>
          )}
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
                            device.quantity ?? 1
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
                          parsedRequestedDevices[
                            requestedDeviceIndex
                          ].quantity = requestedDevice.quantity;
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
                              El equipo fue agregado correctamente a la
                              solicitud.
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
            {allowUpdate ? (
              <div className="mb-5">
                <label htmlFor="documentation">Documentación</label>
                <table
                  className="table table-bordered table-hover"
                  id="documentation-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Enlace</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {updatedDevice.documentation &&
                      updatedDevice.documentation.map((link, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nombre"
                              value={link.name}
                              onChange={(e) => {
                                const newDocumentation =
                                  updatedDevice.documentation ?? [];
                                newDocumentation[index].name = e.target.value;
                                setUpdatedDevice({
                                  ...updatedDevice,
                                  documentation: newDocumentation,
                                });
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enlace"
                              value={link.url}
                              onChange={(e) => {
                                const newDocumentation =
                                  updatedDevice.documentation ?? [];
                                newDocumentation[index].url = e.target.value;
                                setUpdatedDevice({
                                  ...updatedDevice,
                                  documentation: newDocumentation,
                                });
                              }}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() => {
                                const newDocumentation =
                                  updatedDevice.documentation
                                    ? updatedDevice.documentation.filter(
                                        (l) => l.name !== link.name
                                      )
                                    : [];
                                setUpdatedDevice({
                                  ...updatedDevice,
                                  documentation: newDocumentation,
                                });
                              }}>
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    <tr>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nombre"
                          value={currDocName}
                          onChange={(e) => setCurrDocName(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enlace"
                          value={currDocLink}
                          onChange={(e) => setCurrDocLink(e.target.value)}
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          disabled={currDocName === "" || currDocLink === ""}
                          onClick={() => {
                            const newDocumentation =
                              updatedDevice.documentation ?? [];
                            newDocumentation.push({
                              name: currDocName,
                              url: currDocLink,
                            });
                            setUpdatedDevice({
                              ...updatedDevice,
                              documentation: newDocumentation,
                            });
                            setCurrDocName("");
                            setCurrDocLink("");
                          }}>
                          Agregar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : device.documentation ? (
              <>
                <p>Enlaces de documentación: </p>
                <ul className="mb-4">
                  {device.documentation.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mb-4">
                No hay enlaces de documentación disponibles
              </p>
            )}
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
              <p className="mb-4">No se ha utilizado en ningún proyecto</p>
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
                <div
                  className={`equipment-status status-${getDeviceStatusClassName(
                    device.status ?? ""
                  )}`}>
                  {getDeviceStatus(device.status ?? "")}
                </div>
              )}
            </div>
            <div className="last-checked">
              <h3>Última Actualización</h3>
              <p>{timestampToDate(device.updatedAt ?? "")}</p>
            </div>
            {device.configuration && (
              <div className="configuration">
                <h3>Configuration</h3>
                <p className="equipment-notes">{device.configuration}</p>
              </div>
            )}
            {allowUpdate && UpdateButtons(" mt-4")}
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loader loading={loading} />
  );
};

export default EquipmentDetail;
