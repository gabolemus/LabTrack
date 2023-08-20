import React from "react";
import { useParams } from "react-router-dom";
import MainPage from "../templates/MainPage/MainPage";

const Projects = () => {
  const { projectId } = useParams();

  return (
    <MainPage>
      <h1>Proyectos</h1>
      <p>Proyecto: {projectId}</p>
      <p>Este es el listado de proyectos.</p>
    </MainPage>
  );
};

export default Projects;
