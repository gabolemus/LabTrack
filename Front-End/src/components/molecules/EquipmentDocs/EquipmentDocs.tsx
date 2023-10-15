import React from "react";
import { Equipment } from "../../organisms/EquipmentList/equipment";

/** Interface for EquipmentDocs props */
interface EquipmentDocsProps {
  equipment: Equipment;
}

const EquipmentDocs = ({ equipment }: EquipmentDocsProps) => {
  return equipment.documentation ? (
    <>
      <p>Enlaces de documentación: </p>
      <ul className="mb-4">
        {equipment.documentation.map((link, index) => (
          <li key={index}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </>
  ) : (
    <p className="mb-4">No hay enlaces de documentación disponibles</p>
  );
};

export default EquipmentDocs;
