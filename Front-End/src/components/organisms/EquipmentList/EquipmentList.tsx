import React, { useEffect, useState } from "react";
import { Equipment, getAllEquipment, getFilteredEquipment } from "./equipment";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./EquipmentList.scss";
import Loader from "../../molecules/Loader/Loader";
import {
  Manufacturer,
  getAllManufacturers,
} from "../ManufacturersList/manufacturers";

interface DocLink {
  name: string;
  url: string;
}

const EquipmentList = () => {
  // URL search params
  const [searchParams, setSearchParams] = useSearchParams();
  const equipmentName = searchParams.get("equipment");

  // Component state
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [currSearchTerm, setCurrSearchTerm] = useState(equipmentName ?? "");
  const [lastSearchTerm, setLastSearchTerm] = useState(equipmentName ?? "");
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [allowAddNewDevice, setAllowAddNewDevice] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    filterEquipment();
  };

  /** Filters inquiries by project name and status */
  const filterEquipment = async (equipmentName: string = currSearchTerm) => {
    setLoading(true);
    const equipmentRes: Array<Equipment> =
      await getFilteredEquipment(equipmentName);
    setEquipment(equipmentRes);
    setLastSearchTerm(equipmentName);
    setSearchParams({
      ...(equipmentName !== "" && { equipment: currSearchTerm }),
    });
    setLoading(false);
  };

  useEffect(() => {
    const user = localStorage.getItem("role");
    if (user === "superAdmin") {
      setAllowAddNewDevice(true);
    }

    (async () => {
      setLoading(true);

      try {
        // Fetch equipment data from the API
        const devices = await getAllEquipment();
        setEquipment(devices);

        // Get the manufacturers from the API
        const manufacturersResponse = await getAllManufacturers();
        setManufacturers(manufacturersResponse);

        // Initialize filtered equipment when the component first loads
        // handleSearchClick();
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    })();

    filterEquipment();
  }, []);

  /** Determines if a search can be made */
  const canMakeSearch = () =>
    currSearchTerm !== "" && currSearchTerm !== lastSearchTerm;

  return !loading ? (
    <div>
      <Loader loading={loading} />
      {allowAddNewDevice ? (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Equipo de Laboratorio</h1>
          <button className="btn btn-success" onClick={() => navigate("/new-equipment")}>
            Agregar nuevo equipo
          </button>
        </div>
      ) : (
        <h1>Equipo de Laboratorio</h1>
      )}
      <form className="equipment-search-form" onSubmit={handleSubmit}>
        <div className="row mb-3" id="equipmentSearchForm">
          <div className="col px-0">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del equipo"
                aria-label="Nombre del equipo"
                aria-describedby="button-addon2"
                onChange={(e) => setCurrSearchTerm(e.target.value)}
              />
              <div className="input-group-append">
                {/* // TODO: add dropdown to filter by status */}
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => {
                    // Clear the text input
                    const input = document.querySelector(
                      "#equipmentSearchForm input"
                    ) as HTMLInputElement;
                    input.value = "";

                    setLastSearchTerm("");
                    setCurrSearchTerm("");
                    filterEquipment("");
                  }}>
                  Borrar filtros
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={!canMakeSearch()}
                  onClick={
                    canMakeSearch() ? () => filterEquipment() : undefined
                  }>
                  Buscar
                </button>
              </div>
            </div>
          </div>
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
            {equipment.map((item) => (
              <tr key={item._id}>
                <td>
                  <Link to={`/equipment${item.path}`}>{item.name}</Link>
                </td>
                <td>{item.manufacturer}</td>
                <td>{item.tags.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loader loading={loading} />
  );
};

export default EquipmentList;
