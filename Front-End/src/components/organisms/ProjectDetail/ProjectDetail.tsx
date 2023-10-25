import React, { useEffect, useState } from "react";
import { Project, fetchProject } from "../ProjectsList/projects";

import "./ProjectDetail.scss";
import { Link } from "react-router-dom";
import ModalForm from "../ModalForm/ModalForm";
import Loader from "../../molecules/Loader/Loader";
import { BE_URL, areObjectsEqual, timestampToDate } from "../../../utils/utils";
import { ProjectStatuses, getProjectStatus } from "./project";
import ProjectImgView from "../ProjectImgView/ProjectImgView";
import EquipmentHistoryTable from "../../molecules/EquipmentHistoryTable/EquipmentHistoryTable";
import axios from "axios";

/** Interface for ProjectDetail props */
interface ProjectDetailProps {
  /** ID of the project to be shown */
  id: string;
}

const ProjectDetail = ({ id }: ProjectDetailProps) => {
  const [project, setProject] = useState<Partial<Project>>({} as Project);
  const [updatedProject, setUpdatedProject] = useState<Partial<Project>>(
    {} as Project
  );
  const [images, setImages] = useState<FileList | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userType, setUserType] = useState("");
  const [allowUpdate, setAllowUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [modalCallback, setModalCallback] = useState<() => void>(() => {});
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState(<></>);
  const [modalBtnText, setModalBtnText] = useState("");
  const [modalBtnClass, setModalBtnClass] = useState("");

  useEffect(() => {
    // Fetches the project data based on the ID
    const fetchData = async () => {
      try {
        const project = await fetchProject(id);

        // Add the "delete" and "new" fields to the images
        if (project.images && project.images.length > 0) {
          project.images = project.images.map((image) => ({
            ...image,
            delete: false,
            new: false,
          }));
        }

        setProject(project);
        setUpdatedProject(JSON.parse(JSON.stringify(project)));

        if (project.images && project.images.length > 0) {
          setSelectedImage(project.images[0].url);
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

    const user = localStorage.getItem("role");
    setUserType(user ?? "");
    if (user === "superAdmin") {
      setAllowUpdate(true);
    }
  }, [id]);

  /** Undoes any changes made to the project */
  const discardChanges = () => {
    const prevProject: Partial<Project> = JSON.parse(JSON.stringify(project));
    if (prevProject.images && prevProject.images.length > 0) {
      prevProject.images = prevProject.images.map((image) => ({
        ...image,
        delete: false,
        new: false,
      }));
    }
    setUpdatedProject(prevProject);
    setImages(null);
    const fileInput = document.getElementById("images") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    if (project.images && project.images.length > 0) {
      setSelectedImage(project.images[0].url);
    } else {
      setSelectedImage(null);
    }
    const configTextarea = document.getElementById(
      "project-config"
    ) as HTMLTextAreaElement;
    if (configTextarea) {
      configTextarea.value = "";
    }
  };

  /** Modal callback to update the project */
  const updateProject = async (updatedProject: Partial<Project>) => {
    setLoading(true);
    try {
      // Images paths to be deleted
      const imagesToDelete: Array<string> = [];
      if (updatedProject.images) {
        for (const image of updatedProject.images) {
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

      // Remove the image paths from the project objcect
      const updatedProjectNoImages = JSON.parse(JSON.stringify(updatedProject));
      if (updatedProjectNoImages.images) {
        updatedProjectNoImages.images = (
          updatedProjectNoImages.images as any[]
        ).filter((image) => !image.delete);
      }

      // Upload the new images
      let newImages = updatedProject.images?.filter((image) => image.new);
      const formData = new FormData();
      formData.append("project", updatedProject.name ?? "");
      for (const element of images ?? []) {
        formData.append("images", element);
      }
      if (newImages && newImages.length > 0) {
        const newImagesRes = await axios.post(
          `${BE_URL}/images/upload?imgType=project`,
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
      updatedProjectNoImages.images = (
        updatedProjectNoImages.images as any[]
      ).filter((image) => !image.url.startsWith("blob:"));

      // Append the `newImages` to the `updatedProjectNoImages`
      if (newImages && newImages.length > 0) {
        if (updatedProjectNoImages.images) {
          updatedProjectNoImages.images = [
            ...(updatedProjectNoImages.images ?? []),
            ...newImages,
          ];
        } else {
          updatedProjectNoImages.images = newImages;
        }
      }

      // The devices will never be updated at this stage, so, remove this field from the payload
      delete updatedProjectNoImages.devices;

      const response = await axios.put(
        `${BE_URL}/project?id=${updatedProject._id}`,
        updatedProjectNoImages
      );
      const data = response.data;
      setShowModal(true);

      // Record the update as a history entry
      let historyChanges = "";

      // Name change
      if (project.name !== updatedProject.name) {
        historyChanges += `Cambio de nombre de "${project.name}" a "${updatedProject.name}"`;
      }

      // State change
      if (project.status !== updatedProject.status) {
        if (historyChanges !== "") {
          historyChanges += ".<br>";
        }
        historyChanges += `Cambio de estado de "${project.status}" a "${updatedProject.status}"`;
      }

      // HTTP POST request to register the change
      const historyChangeObj = {
        projectID: project._id,
        history: [
          {
            change: "updated",
            description: historyChanges,
            userId: localStorage.getItem("userId"),
          },
        ],
      };
      await axios.post(
        `${BE_URL}/history`,
        historyChangeObj
      );

      const newlyUpdatedProject = await axios.get(
        `${BE_URL}/project?id=${updatedProject._id}`
      );

      if (response.status === 200 && data.success) {
        if (updatedProject.images) {
          for (const image of updatedProject.images) {
            image.delete = false;
            image.new = false;
          }
        }
        setImages(null);
        const fileInput = document.getElementById("images") as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
        if (data.project.images && data.project.images.length > 0) {
          setSelectedImage(data.project.images[0].url);
        } else {
          setSelectedImage(null);
        }
        setProject(newlyUpdatedProject.data.project);
        setUpdatedProject(JSON.parse(JSON.stringify(newlyUpdatedProject.data.project)));
        setModalTitle("Proyecto Actualizado");
        setModalBody(
          <p className="fs-6">El proyecto fue actualizado correctamente.</p>
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
                Un dispositivo con el nombre {updatedProject.name} ya existe.
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

    setLoading(false);
  };

  /** Handles updating the project */
  const handleUpdateProject = () => {
    setShowModal(true);
    setModalTitle("Actualizar Proyecto");
    setModalBody(
      <p className="fs-6 ">
        ¿Estás seguro de que quieres actualizar este proyecto?
      </p>
    );
    setModalBtnText("Actualizar");
    setModalBtnClass("btn-success");
    setModalCallback(() => () => updateProject(updatedProject));
  };

  /**
   * Adds the new images to the formData
   * @param event Event that triggered the function
   */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const fileList = event.target.files;
      setImages(fileList);

      // Add the images to the updated project
      const newImages = Array.from(fileList).map((file) => ({
        url: URL.createObjectURL(file),
        caption: "",
        new: true,
      }));
      setUpdatedProject({
        ...updatedProject,
        images: [...(updatedProject.images ?? []), ...newImages],
      });

      setSelectedImage(newImages[0].url);
    }
  };

  if (!project) {
    // Project not found by ID
    return (
      <>
        <h1>Error</h1>
        <p>
          El proyecto con ID <b className="project-id">{id}</b> no fue
          encontrado.
        </p>
        <Link className="btn btn-primary" to="/projects">
          Ir al listado de proyectos
        </Link>
      </>
    );
  }

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio ",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre ",
  ];

  const convertTime = (time: string) => {
    // YYYY-MM-DD to DD de MM de YYYY
    const date = new Date(time);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} de ${month} de ${year}`;
  };

  /** Component for the update buttons */
  const UpdateButtons = (className: string) => (
    <div
      className={`d-flex justify-content-between align-items-center${className}`}>
      <button
        className="btn btn-primary"
        disabled={areObjectsEqual(project, updatedProject)}
        onClick={handleUpdateProject}
      >
        Actualizar
      </button>
      <button
        className="btn btn-danger"
        disabled={areObjectsEqual(project, updatedProject)}
        onClick={discardChanges}>
        Descartar Cambios
      </button>
    </div>
  );

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
      {project && (
        <div className="form-card card project-card">
          <div className="equipment-detail mb-1">
            {allowUpdate ? (
              <>
                {UpdateButtons(" mb-4")}
                <div className="d-flex justify-content-between align-items-center">
                  <input
                    className="form-control mb-5 project-title-input"
                    type="text"
                    value={updatedProject.name}
                    onChange={(e) =>
                      setUpdatedProject({
                        ...updatedProject,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            ) : (
              <h1>{updatedProject.name}</h1>
            )}
            <ProjectImgView
            className={!allowUpdate ? "mt-5" : ""}
              project={updatedProject}
              updateProject={setUpdatedProject}
              selectedImage={selectedImage}
              handleImageClick={(image) => setSelectedImage(image)}
              showDeleteButton={allowUpdate}
            />
            <hr className="divider" />
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
                                const newImages = updatedProject.images ?? [];
                                newImages[
                                  index + (project.images ?? []).length
                                ].caption = e.target.value;
                                setUpdatedProject({
                                  ...updatedProject,
                                  images: newImages,
                                });
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-danger mt-2"
                              onClick={() => {
                                const newImages = updatedProject.images ?? [];
                                newImages.splice(
                                  index + (project.images ?? []).length,
                                  1
                                );
                                setUpdatedProject({
                                  ...updatedProject,
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
            <div className="d-flex justify-content-between align-items-center mb-5 w-100">
              <div className="lead w-50">
                <h3>Responsable</h3>
                <p>{project.lead?.name}</p>
              </div>
              <div className="status w-50">
                {allowUpdate ? (
                  <>
                    <label htmlFor="manufacturer">Estado</label>
                    <select
                      className="form-control"
                      value={updatedProject.status}
                      onChange={(e) =>
                        setUpdatedProject({
                          ...updatedProject,
                          status: e.target.value,
                        })
                      }>
                      {ProjectStatuses.map((item) => (
                        <option key={item.status} value={item.status}>
                          {getProjectStatus(item.status)}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <h3>Estado</h3>
                    <div
                      className={`status-indicator${
                        project.active ? " status-indicator--active" : ""
                      }`}>
                      {project.active ? "Activo" : "Inactivo"}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="desc mb-5">
              <h2>Descripción</h2>
              {allowUpdate ? (
                <textarea
                  className="form-control"
                  value={updatedProject.description}
                  onChange={(e) =>
                    setUpdatedProject({
                      ...updatedProject,
                      description: e.target.value,
                    })
                  }
                  rows={5}
                />
              ) : (
                <p>{project.description}</p>
              )}
            </div>
            <div className="courses mb-5">
              <h2>Cursos</h2>
              <ul>
                {project.courses?.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            </div>
            <div className="equipment-list mb-5">
              <h2>Equipos</h2>
              <table
                className="table table-bordered table-hover"
                id="project-equipment-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {project.devices?.map((device) => (
                    <tr key={device._id}>
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
            {allowUpdate ? (
              <>
                <label htmlFor="manufacturer">Configuración</label>
                <textarea
                  id="project-config"
                  className="form-control mb-5"
                  placeholder="Configuración del proyecto"
                  value={updatedProject.notes}
                  onChange={(e) => {
                    setUpdatedProject({
                      ...updatedProject,
                      notes: e.target.value,
                    });
                  }}
                  rows={5}
                />
              </>
            ) : (
              <>
                <h2>Configuración</h2>
                <p>{project.notes}</p>
              </>
            )}
            <div className="timeline mb-5">
              <h4>Duración</h4>
              <div className="timeline-row">
                <div className="timeline-block start">
                  <div className="timeline-title">Inicio</div>
                  <div className="timeline-time">
                    {convertTime(project.timelapse?.start ?? "")}
                  </div>
                </div>
                <div className="timeline-connector"></div>
                <div className="timeline-block end">
                  <div className="timeline-title">Fin</div>
                  <div className="timeline-time">
                    {convertTime(project.timelapse?.end ?? "")}
                  </div>
                </div>
              </div>
            </div>
            {project.notes && (
              <div className="notes">
                <h3>Notas</h3>
                <p className="project-notes">{project.notes}</p>
              </div>
            )}
            <div className="last-checked mb-5">
              <h3>Última Actualización</h3>
              <p>{timestampToDate(project.updatedAt ?? "")}</p>
            </div>
            <div className="last-checked">
              <h3>Cambios históricos</h3>
              {project.history && project.history.length > 0 ? (
                <EquipmentHistoryTable
                  historyItems={project.history}
                  showUser={allowUpdate}
                />
              ) : (
                <p className="mb-4">No hay cambios históricos</p>
              )}
            </div>
            {allowUpdate && UpdateButtons(" mt-4")}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetail;
