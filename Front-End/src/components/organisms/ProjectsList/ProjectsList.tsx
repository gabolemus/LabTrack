import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Project, getFilteredProjects } from "./projects";

import "./ProjectsList.scss";
import Loader from "../../molecules/Loader/Loader";

const ProjectsList = () => {
  // URL search params
  const [searchParams, setSearchParams] = useSearchParams();
  const projectName = searchParams.get("project");

  // Component state
  const [projects, setProjects] = useState<Project[]>([]);
  const [currSearchTerm, setCurrSearchTerm] = useState(projectName ?? "");
  const [lastSearchTerm, setLastSearchTerm] = useState(projectName ?? "");
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    filterProjects();
  };

  useEffect(() => {
    filterProjects();
  }, []);

  /** Filters projects by name */
  const filterProjects = async (projectName: string = currSearchTerm) => {
    setLoading(true);
    const projectsRes: Array<Project> = await getFilteredProjects(projectName);
    setProjects(projectsRes);
    setLastSearchTerm(currSearchTerm);
    setSearchParams({
      ...(projectName !== "" && { project: currSearchTerm }),
    });
    setLoading(false);
  };

  /** Determines if a search can be made */
  const canMakeSearch = () =>
    currSearchTerm !== "" && currSearchTerm !== lastSearchTerm;

  return (
    <div>
      <Loader loading={loading} />
      <h1>Proyectos</h1>
      <form className="project-search-form" onSubmit={handleSubmit}>
        <div className="row mb-3" id="projectsSearchForm">
          <div className="col px-0">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del proyecto"
                aria-label="Nombre del proyecto"
                aria-describedby="button-addon2"
                onChange={(e) => setCurrSearchTerm(e.target.value)}
              />
              <div className="input-group-append">
                {/* // TODO: add dropdowns for the leads and project state */}
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => {
                    // Clear the text input
                    const input = document.querySelector(
                      "#projectsSearchForm input"
                    ) as HTMLInputElement;
                    input.value = "";

                    setLastSearchTerm("");
                    setCurrSearchTerm("");
                    filterProjects("");
                  }}>
                  Borrar filtros
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={!canMakeSearch()}
                  onClick={
                    canMakeSearch() ? () => filterProjects() : undefined
                  }>
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="project-table">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Proyecto</th>
              <th>Responsable</th>
              <th>Activo</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>
                  <Link to={`/projects${project.path}`}>{project.name}</Link>
                </td>
                <td>{project.lead.name}</td>
                <td>{project.active ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsList;
