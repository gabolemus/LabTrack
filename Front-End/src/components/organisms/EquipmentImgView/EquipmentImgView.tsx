import React from "react";
import { Equipment } from "../EquipmentList/equipment";

import "./EquipmentImgView.scss";

/** Interface for EquipmentImgView props */
interface EquipmentImgViewProps {
  equipment: Equipment;
  selectedImage: string | null;
  handleImageClick: (image: string) => void;
}

const EquipmentImgView = ({
  equipment,
  selectedImage,
  handleImageClick,
}: EquipmentImgViewProps) => {
  return (
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
                }`}
                onClick={() => handleImageClick(image.url)}
              />
            ))}
        </div>
      </div>
      <div className="main-equipment-img">
        {selectedImage && (
          <img
            src={selectedImage}
            alt={equipment.name}
            className="img-fluid main-image"
          />
        )}
      </div>
    </div>
  );
};

export default EquipmentImgView;
