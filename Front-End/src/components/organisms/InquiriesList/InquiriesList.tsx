import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  IInquiry,
  InquiryStatus,
  getFilteredInquiries,
  getShowState,
} from "./inquiries";
import "./InquiriesList.scss";
import Loader from "../../molecules/Loader/Loader";

const InquiriesList = () => {
  // URL search params
  const [searchParams, setSearchParams] = useSearchParams();
  const projectName = searchParams.get("projectName");
  const status = searchParams.get("status");

  // Component state
  const [inquiries, setInquiries] = useState<IInquiry[]>([]);
  const [lastSearchTerm, setLastSearchTerm] = useState(projectName ?? "");
  const [currSearchTerm, setCurrSearchTerm] = useState(projectName ?? "");
  const [lastState, setLastState] = useState(status ?? "Pending");
  const [currState, setCurrState] = useState(status ?? "Pending");
  const [showState, setShowState] = useState(getShowState(status));
  const [loading, setLoading] = useState(false);

  /** Handle the form submission */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    filterInquiries();
  };

  useEffect(() => {
    filterInquiries();
  }, []);

  /** Filters inquiries by project name and status */
  const filterInquiries = async (
    projectName: string = currSearchTerm,
    requestShowState: InquiryStatus = showState,
    currentState: string = currState,
    currentSearchTerm: string = currSearchTerm
  ) => {
    setLoading(true);
    const inquiries: Array<IInquiry> = await getFilteredInquiries(
      projectName,
      requestShowState
    );
    setLastState(currentState);
    setInquiries(inquiries);
    setLastSearchTerm(currentSearchTerm);
    setSearchParams({
      ...(currentSearchTerm !== "" && { projectName: currSearchTerm }),
      status: requestShowState,
    });
    setLoading(false);
  };

  /** Determines if a search can be made */
  const canMakeSearch = () =>
    (currSearchTerm !== "" && currSearchTerm !== lastSearchTerm) ||
    currState !== lastState;

  /** Gets the requests status names in Spanish */
  const getStatusName = (status: InquiryStatus) => {
    switch (status) {
      case InquiryStatus.PENDING:
        return "Pendientes";
      case InquiryStatus.ACCEPTED:
        return "Aprobadas";
      case InquiryStatus.REJECTED:
        return "Rechazadas";
      default:
        return "Pendientes";
    }
  };

  return (
    <div>
      <Loader loading={loading} />
      <h1>Solicitudes de Proyecto</h1>
      <form className="inquiry-search-form" onSubmit={handleSubmit}>
        <div className="row mb-3" id="inquiry-search-form">
          <div className="col">
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
                <div className="btn-group dropdown">
                  <button
                    type="button"
                    className="btn btn-secondary dropdown-toggle"
                    data-toggle="dropdown"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    Estado: {getStatusName(showState)}{" "}
                  </button>
                  <div className="dropdown-menu">
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => {
                        setCurrState("Pending");
                        setShowState(InquiryStatus.PENDING);
                      }}>
                      Pendientes
                    </button>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => {
                        setCurrState("Accepted");
                        setShowState(InquiryStatus.ACCEPTED);
                      }}>
                      Aprobados
                    </button>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => {
                        setCurrState("Rejected");
                        setShowState(InquiryStatus.REJECTED);
                      }}>
                      Rechazados
                    </button>
                  </div>
                </div>
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => {
                    // Clear the text input
                    const input = document.querySelector(
                      "#inquiry-search-form input"
                    ) as HTMLInputElement;
                    input.value = "";

                    setLastSearchTerm("");
                    setCurrSearchTerm("");
                    setLastState("Pending");
                    setCurrState("Pending");
                    setShowState(InquiryStatus.PENDING);
                    filterInquiries("", InquiryStatus.PENDING, "Pending", "");
                  }}>
                  Borrar filtros
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={!canMakeSearch()}
                  onClick={
                    canMakeSearch() ? () => filterInquiries() : undefined
                  }>
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="inquiries-table">
        <table className="table table-bordered table-responsive">
          <thead>
            <tr>
              <th>Solicitud</th>
              <th>Responsable</th>
              <th>Correo</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry._id}>
                <td>
                  <Link to={`/inquiries-registry/${inquiry._id}`}>
                    {inquiry.projectName}
                  </Link>
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
