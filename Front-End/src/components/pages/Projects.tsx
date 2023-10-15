import React from "react";
import { useParams } from "react-router-dom";
import MainPage from "../templates/MainPage/MainPage";
import ProjectsList from "../organisms/ProjectsList/ProjectsList";
import ProjectDetail from "../organisms/ProjectDetail/ProjectDetail";

const Projects = () => {
  const { projectId } = useParams();

  return (
    <MainPage>
      {projectId ? <ProjectDetail id={projectId} /> : <ProjectsList />}
    </MainPage>
  );
};

export default Projects;
