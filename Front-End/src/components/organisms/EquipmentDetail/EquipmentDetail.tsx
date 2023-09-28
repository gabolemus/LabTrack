import React, { useEffect, useState } from "react";
import { Equipment, fetchEquipmentData } from "../EquipmentList/equipment";

import "./EquipmentDetail.scss";
import EquipmentImgView from "../EquipmentImgView/EquipmentImgView";
import EquipmentDocs from "../../molecules/EquipmentDocs/EquipmentDocs";
import { timestampToDate } from "../../../utils/utils";
import { Link } from "react-router-dom";

/** Interface for EquipmentDetail props */
interface EquipmentDetailProps {
  id: string;
}

const EquipmentDetail = ({ id }: EquipmentDetailProps) => {
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    // Simulate fetching equipment data based on the ID from your data source
    const fetchData = async () => {
      try {
        const data = await fetchEquipmentData(id);
        setEquipment(data);

        // Select the first image as the initially selected image
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  if (!equipment) {
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

  return (
    <div className="equipment-detail mb-5">
      <h1>{equipment.name}</h1>
      <EquipmentImgView
        equipment={equipment}
        selectedImage={selectedImage}
        handleImageClick={handleImageClick}
      />
      {equipment.images && <hr className="divider" />}
      <div className="equipment-details">
        <h2>Detalles del Equipo</h2>
        <p>
          <b>Fabricante:</b> {equipment.manufacturer}
        </p>
        <EquipmentDocs equipment={equipment} />
        <hr className="divider" />
        <h2>Proyectos en los que se ha utilizado</h2>
        {equipment.projects && equipment.projects.length > 0 ? (
          <ul className="mb-4">
            {equipment.projects.map((project) => (
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
        {equipment.notes && (
          <div className="notes">
            <h3>Notas</h3>
            <p className="equipment-notes">{equipment.notes}</p>
          </div>
        )}
        <div className="status mb-5">
          <h3>Estado</h3>
          <p>{getDeviceStatus(equipment.status)}</p>
        </div>
        <div className="last-checked mb-5">
          <h3>Última Actualización</h3>
          <p>{timestampToDate(equipment.updatedAt)}</p>
        </div>
        {equipment.configuration && (
          <div className="configuration">
            <h3>Configuration</h3>
            <p className="equipment-notes">{equipment.configuration}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentDetail;
