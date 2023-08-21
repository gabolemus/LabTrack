import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Project, sampleProjectData } from "./projects";

import "./ProjectsList.scss";

const ProjectsList = () => {
  const [projects, setProjects] = useState(sampleProjectData);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLead, setSearchLead] = useState<string[]>([]);
  const [searchActive, setSearchActive] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  // Function to handle the search button click
  const handleSearchClick = () => {
    const newFilteredProjects = projects.filter((project) => {
      const nameMatch = project.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const leadMatch =
        searchLead.length === 0 || searchLead.includes(project.lead);
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
    // Initialize filtered projects when the component first loads
    handleSearchClick();
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
                  <li key={lead}>
                    <a className="dropdown-item" href="#">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={lead}
                          checked={searchLead.includes(lead)}
                          onChange={() =>
                            setSearchLead((prevSelected) => {
                              if (prevSelected.includes(lead)) {
                                return prevSelected.filter((l) => l !== lead);
                              } else {
                                return [...prevSelected, lead];
                              }
                            })
                          }
                        />
                        <label className="form-check-label">{lead}</label>
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
              <th>Project Name</th>
              <th>Project Lead</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id}>
                <td>
                  <Link to={`/projects/${project.id}`}>{project.name}</Link>
                </td>
                <td>{project.lead}</td>
                <td>{project.active ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsList;
