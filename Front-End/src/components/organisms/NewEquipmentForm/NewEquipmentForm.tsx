import React, { useEffect, useState } from "react";
import "./NewEquipmentForm.scss";
import {
  DeviceStatus,
  IDocumentation,
  IImage,
  Tag,
  getManufacturersAndTags,
} from "./equipment";
import ModalForm from "../ModalForm/ModalForm";
import Loader from "../../molecules/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { Manufacturer } from "../ManufacturersList/manufacturers";
import Select from "react-select";
import axios from "axios";
import { BE_URL } from "../../../utils/utils";

const NewEquipmentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    quantity: 1,
    status: DeviceStatus.AVAILABLE,
    documentation: [] as IDocumentation[],
    tags: [] as string[],
    images: [] as IImage[],
  });
  const [manufacturers, setManufacturers] = useState([] as Manufacturer[]);
  const [deviceTags, setDeviceTags] = useState([] as Tag[]);
  const [currDocName, setCurrDocName] = useState("");
  const [currDocLink, setCurrDocLink] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
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
    populateManufacturersAndTags();
  }, []);

  /** Gets and populates the state for the manufacturers and tags */
  const populateManufacturersAndTags = async () => {
    setLoading(true);
    const { manufacturers, tags } = await getManufacturersAndTags();
    setManufacturers(manufacturers);
    setDeviceTags(tags);
    setLoading(false);
  };

  /** Checks if the form can be submitted */
  const canSubmit = (): boolean => {
    return (
      formData.name !== "" &&
      formData.manufacturer !== "" &&
      formData.quantity > 0
    );
  };

  /** Get the name for the equipment status in Spanish */
  const getEquipmentStatus = (status: string) => {
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

  /**
   * Adds the new images to the formData
   * @param event Event that triggered the function
   */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const fileList = event.target.files;
      setImages(fileList);

      // Set the images in the formData
      const newImages = Array.from(fileList).map((file) => ({
        url: URL.createObjectURL(file),
        caption: "",
      }));
      setFormData({
        ...formData,
        images: [...formData.images, ...newImages],
      });
    }
  };

  const getPrettyDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year} a las ${hours}:${minutes}:${seconds}`;
  };

  /** Attempts to submit the form */
  const attemptSubmit = async () => {
    setLoading(true);
    let imgsURLs = [] as IImage[];

    if (images) {
      const imgsformData = new FormData();
      imgsformData.append("manufacturer", formData.manufacturer);
      imgsformData.append("device", formData.name);
      for (const image of images) {
        imgsformData.append("images", image);
      }

      try {
        const imgsUploadRes = await axios.post(
          `${BE_URL}/images/upload?imgType=device`,
          imgsformData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        imgsURLs = formData.images.map((image, index) => ({
          ...image,
          url: imgsUploadRes.data.imagePaths[index],
        }));
      } catch (error) {
        console.log(error);
      }
    }

    const newEquipment = {
      name: formData.name,
      manufacturer: formData.manufacturer,
      quantity: formData.quantity,
      status: formData.status,
      tags: formData.tags,
      documentation: formData.documentation,
      images: imgsURLs,
    };

    try {
      const newEquipmentRes = await axios.post(
        `${BE_URL}/device`,
        newEquipment
      );

      if (newEquipmentRes.status === 201) {
        const currDate = new Date();
        const prettyDate = getPrettyDate(currDate);
        const newEquipmentId = newEquipmentRes.data.newdevice._id;
        const historyCreated = {
          equipmentId: newEquipmentId,
          history: [
            {
              change: "created",
              description: `Se ha creado el equipo ${newEquipment.name} el ${prettyDate}`,
              userId: localStorage.getItem("userId") as string,
            },
          ],
        };

        const historyRes = await axios.post(
          `${BE_URL}/history`,
          historyCreated
        );

        if (historyRes.status === 201) {
          setModalTitle("¡Éxito!");
          setModalBody(
            <p>
              Se ha agregado el nuevo equipo <strong>{formData.name}</strong>{" "}
              satisfactoriamente.
            </p>
          );
          setModalBtnText("Aceptar");
          setModalBtnClass("btn-primary");
          setModalCallback(() => {
            navigation("/equipment");
          });
          setShowModal(true);
        } else {
          setModalTitle("¡Error!");
          setModalBody(
            <p>
              Ha ocurrido un error al agregar el nuevo equipo{" "}
              <strong>{formData.name}</strong>. Por favor, inténtelo de nuevo.
            </p>
          );
          setModalBtnText("Aceptar");
          setModalBtnClass("btn-danger");
          setShowModal(true);
        }
      }
    } catch (error) {
      console.log(error);
      setModalTitle("¡Error!");
      setModalBody(
        <p>
          Ha ocurrido un error al agregar el nuevo equipo{" "}
          <strong>{formData.name}</strong>. Por favor, inténtelo de nuevo.
        </p>
      );
      setModalBtnText("Aceptar");
      setModalBtnClass("btn-danger");
      setShowModal(true);
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
      <h1>Nuevo Equipo</h1>
      <div className="form-card card">
        <form action="" className="form" id="newEquipmentForm">
          <div className="col mb-3">
            <label htmlFor="equipmentName">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="equipmentName"
              placeholder="Nombre del nuevo equipo"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="form-group mb-3 d-flex justify-content-between equipmentData">
            <div className="col-6">
              <label htmlFor="quantity">Cantidad</label>
              <input
                type="number"
                className="form-control"
                id="quantity"
                placeholder="Cantidad de equipos"
                min="1"
                step="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: +e.target.value })
                }
              />
            </div>
            <div className="col-6">
              <label htmlFor="equipmentName">Estado</label>
              <select
                className="form-control"
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as DeviceStatus,
                  })
                }>
                <option disabled value="">
                  Seleccionar estado
                </option>
                {Object.values(DeviceStatus).map((status) => (
                  <option key={status} value={status}>
                    {getEquipmentStatus(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group mb-4 d-flex justify-content-between equipmentData">
            <div className="col-6">
              <label htmlFor="manufacturer">Fabricante</label>
              <select
                className="form-control"
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) =>
                  setFormData({ ...formData, manufacturer: e.target.value })
                }>
                <option value="">Seleccionar fabricante</option>
                {manufacturers.map((manufacturer) => (
                  <option key={manufacturer._id} value={manufacturer.name}>
                    {manufacturer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label htmlFor="tags">Etiquetas</label>
              <Select
                defaultValue={[] as any}
                isMulti
                name="tags"
                placeholder="Seleccionar etiquetas"
                options={deviceTags.map((tag) => ({
                  value: tag.name,
                  label: tag.name,
                }))}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.map((tag) => tag.value),
                  })
                }
              />
            </div>
          </div>
          <div className="form-group mb-4">
            <label htmlFor="documentation">Documentación</label>
            <div className="d-flex justify-content-between align-items-center">
              <div className="col-5 docs-form">
                <input
                  type="text"
                  className="form-control"
                  id="docName"
                  placeholder="Nombre de la documentación"
                  onChange={(e) => setCurrDocName(e.target.value)}
                />
              </div>
              <div className="col-5 docs-form">
                <input
                  type="text"
                  className="form-control"
                  id="docLink"
                  placeholder="Enlace de la documentación"
                  onChange={(e) => setCurrDocLink(e.target.value)}
                />
              </div>
              <div className="col-2 docs-form">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  id="addDocBtn"
                  disabled={currDocName === "" || currDocLink === ""}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      documentation: [
                        ...formData.documentation,
                        {
                          name: currDocName,
                          url: currDocLink,
                        },
                      ],
                    });

                    // Clear the inputs
                    const docNameInput = document.getElementById(
                      "docName"
                    ) as HTMLInputElement;
                    const docLinkInput = document.getElementById(
                      "docLink"
                    ) as HTMLInputElement;
                    docNameInput.value = "";
                    docLinkInput.value = "";

                    // Clear the state
                    setCurrDocName("");
                    setCurrDocLink("");
                  }}>
                  Agregar
                </button>
              </div>
            </div>
            {formData.documentation.length > 0 && (
              <table className="table table-striped table-hover mt-3">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Enlace</th>
                    <th>¿Eliminar?</th>
                  </tr>
                </thead>
                <tbody id="docsTableBody">
                  {formData.documentation.map((doc, index) => (
                    <tr key={index}>
                      <td>{doc.name}</td>
                      <td className="doc-link">
                        <a href={doc.url} target="_blank" rel="noreferrer">
                          {doc.url}
                        </a>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => {
                            const newDocs = formData.documentation.filter(
                              (_, i) => i !== index
                            );
                            setFormData({
                              ...formData,
                              documentation: newDocs,
                            });
                          }}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="form-group mb-4">
            <label htmlFor="images">Imágenes</label>
            <input
              type="file"
              accept="image/*"
              className="form-control mb-3 img-file-uploader"
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
                            const newImages = formData.images;
                            newImages[index].caption = e.target.value;
                            setFormData({
                              ...formData,
                              images: newImages,
                            });
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger mt-2"
                          onClick={() => {
                            const newImages = formData.images.filter(
                              (_, i) => i !== index
                            );
                            setFormData({
                              ...formData,
                              images: newImages,
                            });

                            // Update the images and call setImages
                            // with the new images
                            const updatedImages = Array.from(images);
                            updatedImages.splice(index, 1);

                            // Save updatedImages as a FileList
                            const updatedImagesFileList =
                              updatedImages as unknown as FileList;
                            setImages(updatedImagesFileList);
                          }}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className="btn btn-primary w-100"
            disabled={!canSubmit()}
            onClick={attemptSubmit}>
            Agregar Nuevo Equipo
          </button>
        </form>
      </div>
    </>
  );
};

export default NewEquipmentForm;
