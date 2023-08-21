import React, { useEffect, useState } from "react";
import { Equipment, sampleEquipmentData } from "./equipment";
import { Link } from "react-router-dom";

import "./EquipmentList.scss";

const EquipmentList = () => {
  const [equipment, setEquipment] = useState(sampleEquipmentData);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchManufacturers, setSearchManufacturers] = useState<string[]>([]);
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Array<Equipment>>(
    []
  );

  // Function to handle the search button click
  const handleSearchClick = () => {
    const newFilteredEquipment = equipment.filter((item) => {
      const nameMatch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const manufacturerMatch =
        searchManufacturers.length === 0 ||
        searchManufacturers.includes(item.manufacturer);
      const tagMatch =
        searchTags.length === 0 ||
        searchTags.some((tag) => item.tags.includes(tag));
      return nameMatch && manufacturerMatch && tagMatch;
    });

    setFilteredEquipment(newFilteredEquipment);
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchClick();
  };

  useEffect(() => {
    // Initialize filtered equipment when the component first loads
    handleSearchClick();
  }, []);

  // Get unique manufacturers and tags for checkboxes
  const manufacturers = [
    ...new Set(equipment.map((item) => item.manufacturer)),
  ];
  const tags = [...new Set(equipment.flatMap((item) => item.tags))];

  return (
    <div>
      <h1>Equipo de Laboratorio</h1>
      <form className="equipment-search-form" onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              id="searchTerm"
              className="form-control equipment-search-btn"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre del equipo"
            />
          </div>
          <div className="col-md-4">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle equipment-manufacturer-dropdown"
                type="button"
                id="manufacturerDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                Fabricante
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="manufacturerDropdown">
                {manufacturers.map((manufacturer) => (
                  <li key={manufacturer}>
                    <a className="dropdown-item" href="#">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={manufacturer}
                          checked={searchManufacturers.includes(manufacturer)}
                          onChange={() =>
                            setSearchManufacturers((prevSelected) => {
                              if (prevSelected.includes(manufacturer)) {
                                return prevSelected.filter(
                                  (manu) => manu !== manufacturer
                                );
                              } else {
                                return [...prevSelected, manufacturer];
                              }
                            })
                          }
                        />
                        <label className="form-check-label">
                          {manufacturer}
                        </label>
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
                className="btn btn-secondary dropdown-toggle equipment-tags-dropdown"
                type="button"
                id="tagsDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                Etiquetas
              </button>
              <ul className="dropdown-menu" aria-labelledby="tagsDropdown">
                {tags.map((tag) => (
                  <li key={tag}>
                    <a className="dropdown-item" href="#">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={tag}
                          checked={searchTags.includes(tag)}
                          onChange={() =>
                            setSearchTags((prevSelected) => {
                              if (prevSelected.includes(tag)) {
                                return prevSelected.filter((t) => t !== tag);
                              } else {
                                return [...prevSelected, tag];
                              }
                            })
                          }
                        />
                        <label className="form-check-label">{tag}</label>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button type="submit" className="btn btn-primary search-btn">
            Buscar
          </button>
        </div>
      </form>
      <div className="equipment-table">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fabricante</th>
              <th>Etiquetas</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipment.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link to={item.path}>{item.name}</Link>
                </td>
                <td>{item.manufacturer}</td>
                <td>{item.tags.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipmentList;
