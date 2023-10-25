import React from "react";
import "./ProjecttImgView.scss";
import { Project } from "../ProjectsList/projects";

/** Interface for ProjectImgView props */
interface ProjectImgViewProps {
  /** Project object */
  project: Partial<Project>;
  /** Callback to update the projectt object */
  updateProject: (project: Partial<Project>) => void;
  /** Currently selected image */
  selectedImage: string | null;
  /** Function to handle image click */
  handleImageClick: (image: string) => void;
  /** HTML class name for the component */
  className?: string;
  /** Whether to show the buttons to delete the image */
  showDeleteButton?: boolean;
}

const ProjectImgView = ({
  project,
  updateProject,
  selectedImage,
  handleImageClick,
  className,
  showDeleteButton,
}: ProjectImgViewProps) => {
  return (
    <div className={`project-img-view${" " + className}`}>
      <div className={`img-container${selectedImage ? " has-image" : ""}`}>
        <div className="project-img">
          <div className="additional-images">
            {project.images &&
              project.images.length > 0 &&
              project.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={project.name}
                  className={`img-fluid additional-image${
                    selectedImage === image.url ? " selected" : ""
                  }${image.delete ? " delete" : ""}${image.new ? " new" : ""}`}
                  onClick={() => handleImageClick(image.url)}
                />
              ))}
          </div>
        </div>
        <div className="main-project-img">
          {selectedImage ? (
            <div className="img-caption">
              <img
                src={selectedImage}
                alt={project.name}
                className={`img-fluid main-image${
                  project.images?.find((image) => image.url === selectedImage)
                    ?.delete
                    ? " delete"
                    : ""
                }${
                  project.images?.find((image) => image.url === selectedImage)
                    ?.new
                    ? " new"
                    : ""
                }`}
              />
              <div className="caption my-3 text-center">
                <p className="mb-0 d-block image-caption">
                  {
                    project.images?.find((image) => image.url === selectedImage)
                      ?.caption
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="img-caption">
              <img
                src="https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg"
                alt="No image"
                className="img-fluid main-image"
              />
              <div className="caption my-3 text-center">
                <p className="mb-0 d-block">
                  No hay imágenes para este proyecto
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {showDeleteButton && (
        <div className="row mb-4">
          <div className="col">
            <button
              className="btn btn-danger w-100"
              disabled={
                project.images?.find((image) => image.url === selectedImage)
                  ?.delete
              }
              onClick={() => {
                const images = project.images?.map((image) => {
                  if (image.url === selectedImage) {
                    image.delete = !image.delete;
                  }
                  return image;
                });
                updateProject({ ...project, images });
              }}>
              Eliminar Imagen
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-secondary w-100"
              disabled={
                !project.images?.find((image) => image.url === selectedImage)
                  ?.delete
              }
              onClick={() => {
                const images = project.images?.map((image) => {
                  if (image.url === selectedImage) {
                    image.delete = !image.delete;
                  }
                  return image;
                });
                updateProject({ ...project, images });
              }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectImgView;
