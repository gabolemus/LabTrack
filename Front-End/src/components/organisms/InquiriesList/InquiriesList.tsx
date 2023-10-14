import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IInquiry, InquiryStatus, getFilteredInquiries } from "./inquiries";
import "./InquiriesList.scss";
import Loader from "../../molecules/Loader/Loader";

const InquiriesList = () => {
  const [inquiries, setInquiries] = useState<Array<IInquiry>>([]);
  const [lastSearchTerm, setLastSearchTerm] = useState("");
  const [currSearchTerm, setCurrSearchTerm] = useState("");
  const [lastState, setLastState] = useState("Pending");
  const [currState, setCurrState] = useState("Pending");
  const [showPending, setShowPending] = useState(true);
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    filterInquiries();
  };

  useEffect(() => {
    filterInquiries();
  }, []);

  /** Filters inquiries by project name and status */
  const filterInquiries = async () => {
    setLoading(true);
    const inquiries: Array<IInquiry> = await getFilteredInquiries(
      currSearchTerm,
      showPending ? InquiryStatus.PENDING : InquiryStatus.ACCEPTED
    );
    setLastState(currState);
    setInquiries(inquiries);
    setLastSearchTerm(currSearchTerm);
    setLoading(false);
  };

  /** Determines if a search can be made */
  const canMakeSearch = () =>
    (currSearchTerm !== "" && currSearchTerm !== lastSearchTerm) ||
    currState !== lastState;

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
                    Estado: {showPending ? "Pendientes " : "Aprobados "}
                  </button>
                  <div className="dropdown-menu">
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => {
                        setCurrState(showPending ? "Accepted" : "Pending");
                        setShowPending(!showPending);
                      }}>
                      {showPending ? "Aprobados" : "Pendientes"}
                    </button>
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={!canMakeSearch()}
                  onClick={canMakeSearch() ? filterInquiries : undefined}>
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
