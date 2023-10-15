import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import { Page } from "../../../utils/pages";

/** Interface for the props of the Navbar component */
interface Props {
  /** Whether to show the login button */
  showLogin: boolean;
  /** Callback to be called when the logout button is clicked */
  logoutCallback: () => void;
  /** Pages to be shown in the navbar */
  pages: Array<Page>;
}

/** Component that renders the navbar */
const Navbar = ({ showLogin, logoutCallback, pages }: Props) => {
  const navigate = useNavigate();

  /** Callback to logout the user */
  const logout = () => {
    localStorage.removeItem("logged");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    logoutCallback();
    navigate("/");
  };

  return (
    <nav id="navbar" className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          LabTrack
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {pages.map((page) => (
              <li className="nav-item" key={page.name}>
                <Link
                  className={`nav-link ${
                    window.location.pathname === page.path ? "active" : ""
                  }`}
                  to={page.path}>
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
          {showLogin ? (
            <Link className="btn btn-outline-primary me-2" to="/login">
              Iniciar sesión
            </Link>
          ) : (
            <button className="btn btn-outline-primary me-2" onClick={logout}>
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
