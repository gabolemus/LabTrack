import React from "react";
import { Equipment } from "../EquipmentList/equipment";

import "./EquipmentImgView.scss";

/** Interface for EquipmentImgView props */
interface EquipmentImgViewProps {
  /** Equipment object */
  equipment: Partial<Equipment>;
  /** Callback to update the equipment object */
  updateEquipment: (equipment: Partial<Equipment>) => void;
  /** Currently selected image */
  selectedImage: string | null;
  /** Function to handle image click */
  handleImageClick: (image: string) => void;
  /** Whether to show the buttons to delete the image */
  showDeleteButton?: boolean;
}

const EquipmentImgView = ({
  equipment,
  updateEquipment,
  selectedImage,
  handleImageClick,
  showDeleteButton,
}: EquipmentImgViewProps) => {
  return (
    <div className="equipment-img-view">
      <div className={`img-container${selectedImage ? " has-image" : ""}`}>
        <div className="equipment-img">
          <div className="additional-images">
            {equipment.images &&
              equipment.images.length > 0 &&
              equipment.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={equipment.name}
                  className={`img-fluid additional-image${
                    selectedImage === image.url ? " selected" : ""
                  }${image.delete ? " delete" : ""}${image.new ? " new" : ""}`}
                  onClick={() => handleImageClick(image.url)}
                />
              ))}
          </div>
        </div>
        <div className="main-equipment-img">
          {selectedImage ? (
            <div className="img-caption">
              <img
                src={selectedImage}
                alt={equipment.name}
                className={`img-fluid main-image${
                  equipment.images?.find((image) => image.url === selectedImage)
                    ?.delete
                    ? " delete"
                    : ""
                }${
                  equipment.images?.find((image) => image.url === selectedImage)
                    ?.new
                    ? " new"
                    : ""
                }`}
              />
              <div className="caption my-3 text-center">
                <p className="mb-0 d-block image-caption">
                  {
                    equipment.images?.find(
                      (image) => image.url === selectedImage
                    )?.caption
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
                <p className="mb-0 d-block">No hay imágenes para este equipo</p>
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
                equipment.images?.find((image) => image.url === selectedImage)
                  ?.delete
              }
              onClick={() => {
                const images = equipment.images?.map((image) => {
                  if (image.url === selectedImage) {
                    image.delete = !image.delete;
                  }
                  return image;
                });
                updateEquipment({ ...equipment, images });
              }}>
              Eliminar Imagen
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-secondary w-100"
              disabled={
                !equipment.images?.find((image) => image.url === selectedImage)
                  ?.delete
              }
              onClick={() => {
                const images = equipment.images?.map((image) => {
                  if (image.url === selectedImage) {
                    image.delete = !image.delete;
                  }
                  return image;
                });
                updateEquipment({ ...equipment, images });
              }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentImgView;
