import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Project, getProjects } from "./projects";

import "./ProjectsList.scss";

const ProjectsList = () => {
  const [projects, setProjects] = useState<Array<Project>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLead, setSearchLead] = useState<string[]>([]);
  const [searchActive, setSearchActive] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Array<Project>>([]);

  // Function to handle the search button click
  const handleSearchClick = () => {
    const newFilteredProjects = projects.filter((project) => {
      const nameMatch = project.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const leadMatch =
        searchLead.length === 0 || searchLead.includes(project.lead.name);
      const activeMatch =
        searchActive.length === 0 ||
        searchActive.includes(project.active ? "true" : "false");
      return nameMatch && leadMatch && activeMatch;
    });

    setFilteredProjects(newFilteredProjects);
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchClick();
  };

  useEffect(() => {
    (async () => {
      const projects: Array<Project> = await getProjects();
      setProjects(projects);
      setFilteredProjects(projects);

      // Initialize filtered projects when the component first loads
      // handleSearchClick();  // TODO: implement project filtering
    })();
  }, []);

  // Get unique project leads and active for checkboxes
  const leads = [...new Set(projects.map((project) => project.lead))];
  const active = [...new Set(projects.flatMap((project) => project.active))];

  return (
    <div>
      <h1>Proyectos</h1>
      <form className="project-search-form" onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              id="searchTerm"
              className="form-control project-search-btn"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Project Name"
            />
          </div>
          <div className="col-md-4">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle project-lead-dropdown"
                type="button"
                id="manufacturerDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                Responsable
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="manufacturerDropdown">
                {leads.map((lead) => (
                  <li key={lead.name}>
                    <a className="dropdown-item" href="#">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={lead.name}
                          checked={searchLead.includes(lead.name)}
                          onChange={() =>
                            setSearchLead((prevSelected) => {
                              if (prevSelected.includes(lead.name)) {
                                return prevSelected.filter(
                                  (l) => l !== lead.name
                                );
                              } else {
                                return [...prevSelected, lead.name];
                              }
                            })
                          }
                        />
                        <label className="form-check-label">{lead.name}</label>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle project-active-dropdown"
                type="button"
                id="tagsDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                Activo
              </button>
              <ul className="dropdown-menu" aria-labelledby="tagsDropdown">
                {active.map((active, index) => (
                  <li key={index}>
                    <a className="dropdown-item" href="#">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={active ? "true" : "false"}
                          checked={searchActive.includes(String(active))}
                          onChange={() =>
                            setSearchActive((prevSelected) => {
                              if (prevSelected.includes(String(active))) {
                                return prevSelected.filter(
                                  (a) => a !== String(active)
                                );
                              } else {
                                return [...prevSelected, String(active)];
                              }
                            })
                          }
                        />
                        <label className="form-check-label">
                          {active ? "Sí" : "No"}
                        </label>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button type="submit" className="btn btn-primary search-btn">
            Search
          </button>
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
            {filteredProjects.map((project) => (
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
