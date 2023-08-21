import React, { useEffect, useState } from "react";
import { Project, fetchProject } from "../ProjectsList/projects";

import "./ProjectDetail.scss";
import { Link } from "react-router-dom";

/** Interface for ProjectDetail props */
interface ProjectDetailProps {
  id: string;
}

const ProjectDetail = ({ id }: ProjectDetailProps) => {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    // Simulate fetching equipment data based on the ID from your data source
    const fetchData = async () => {
      try {
        const project = await fetchProject(id);
        setProject(project);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  if (!project) {
    // Equipment not found by ID
    return (
      <>
        <h1>Error</h1>
        <p>
          El proyecto con ID <b className="equipment-id">{id}</b> no fue
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

  return (
    <div className="equipment-detail mb-5">
      <h1>{project.name}</h1>
      <div className="lead mb-5">
        <h3>Responsable</h3>
        <p>{project.lead}</p>
      </div>
      <div className="status mb-5">
        <h3>Estado</h3>
        <div
          className={`status-indicator${
            project.active ? " status-indicator--active" : ""
          }`}>
          {project.active ? "Activo" : "Inactivo"}
        </div>
      </div>
      <div className="desc mb-5">
        <h2>Descripción</h2>
        <p>{project.description}</p>
      </div>
      <div className="equipment-list mb-5">
        <h2>Equipos</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {project.equipmentUsed.map((equipment) => (
              <tr key={equipment.id}>
                <td>
                  <Link to={`/equipment/${equipment.id}`}>
                    {equipment.name}
                  </Link>
                </td>
                <td>{equipment.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="Línea de tiempo mb-5">
        <h2>Línea de tiempo</h2>
        <p>
          <b>Fecha de inicio:</b> {convertTime(project.startDate)}
          <br />
          <b>Fecha de fin:</b> {convertTime(project.dueDate)}
        </p>
      </div>
      <div className="notes">
        <h3>Notas</h3>
        <p className="equipment-notes">{project.notes}</p>
      </div>
    </div>
  );
};

export default ProjectDetail;
