import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IInquiry, getInquiries } from "./inquiries";

import "./InquiriesList.scss";

const InquiriesList = () => {
  const [inquiries, setInquiries] = useState<Array<IInquiry>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLead, setSearchLead] = useState<string[]>([]);
  const [searchActive, setSearchActive] = useState<string[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Array<IInquiry>>([]);

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    (async () => {
      const inquiries: Array<IInquiry> = await getInquiries();
      setInquiries(inquiries);
      setFilteredInquiries(inquiries);
    })();
  }, []);

  // // Get unique project leads and active for checkboxes
  // const leads = [...new Set(inquiries.map((project) => project.lead))];
  // const active = [...new Set(inquiries.flatMap((project) => project.active))];

  return (
    <div>
      <h1>Solicitudes de Proyecto</h1>
      <form className="project-search-form" onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              id="searchTerm"
              className="form-control project-search-btn"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre del proyecto"
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
                {/* {leads.map((lead) => (
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
                ))} */}
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
                {/* {active.map((active, index) => (
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
                ))} */}
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
              <th>Solicitud</th>
              <th>Responsable</th>
              <th>Correo</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.map((inquiry) => (
              <tr key={inquiry._id}>
                <td>
                  <Link to={`/inquiries-registry/${inquiry._id}`}>{inquiry.projectName}</Link>
                </td>
                <td>{inquiry.projectRequester.name}</td>
                <td>{inquiry.projectRequester.email}</td>
              </tr>
            ))}            
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InquiriesList;
