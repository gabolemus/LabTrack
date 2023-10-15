import React, { useState } from "react";
import "./LoginCard.scss";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../molecules/Loader/Loader";
import ModalForm from "../ModalForm/ModalForm";

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [modalCallback, setModalCallback] = useState<() => void>(() => {});
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState(<></>);
  const [modalBtnText, setModalBtnText] = useState("");
  const [modalBtnClass, setModalBtnClass] = useState("");
  const navigate = useNavigate();

  /** Callback function to check the credentials */
  const checkCredentials = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://20.163.78.89:8080/check-password",
        {
          email,
          password,
        }
      );
      setShowModal(true);
      setLoading(false);

      if (response.status !== 200) {
        setModalTitle("Error");
        setModalBody(<p>Hubo un error al iniciar sesión</p>);
        setModalBtnText("Aceptar");
        setModalBtnClass("btn-primary");
        setModalCallback(() => setShowModal(false));
      }

      if (response.data.success) {
        // Get the user role
        const userData = await axios.get(`http://20.163.78.89:8080/user/${email}`);
        const userInfo = userData.data.user;
        const role =
          userData.data.user.role === "Super Admin" ? "superAdmin" : "admin";

        // Set logged in in the local storage
        localStorage.setItem("logged", "true");
        localStorage.setItem("email", email);
        localStorage.setItem("name", userInfo.name);
        localStorage.setItem("userId", userInfo._id);
        localStorage.setItem("role", role);

        navigate("/");
      } else {
        setModalTitle("Error");
        setModalBody(<p>Correo electrónico o contraseña incorrectos</p>);
        setModalBtnText("Aceptar");
        setModalBtnClass("btn-primary");
        setModalCallback(() => setShowModal(false));
      }
    } catch (error) {
      setLoading(false);

      let msg = (
        <>
          <p className="fs-6">
            Ha ocurrido un error al tratar de iniciar sesión.
          </p>
          <p className="fs-6">Por favor, intente de nuevo más tarde.</p>
        </>
      );

      if (axios.isAxiosError(error)) {
        const { response } = error;

        if (response?.data.error === "INVALID_PASSWORD") {
          msg = (
            <>
              <p className="fs-6">Usuario o contraseña incorrectos.</p>
            </>
          );
        }
      }

      setShowModal(true);
      setModalTitle("Error");
      setModalBody(msg);
      setModalBtnText("Aceptar");
      setModalBtnClass("btn-danger");
      setModalCallback(() => () => {
        setShowModal(false);
      });
    }
  };

  /** Determines if the form can be submitted */
  const canSubmit = () => {
    return email !== "" && password !== "";
  };

  /** Submit the form */
  const submitForm = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      checkCredentials();
    }
  };

  return (
    <>
      <ModalForm
        show={showModal}
        handleClose={() => setShowModal(false)}
        onAccept={modalCallback}
        title={modalTitle}
        body={modalBody}
        primaryBtnText={modalBtnText}
        primaryBtnClass={modalBtnClass}
      />
      <Loader loading={loading} />
      <div className="d-flex justify-content-center align-items-center w-100 h-100 login-card-container">
        <div className="card login-card">
          <div className="card-body">
            <h4 className="card-title my-3 text-center">Iniciar sesión</h4>
            <form className="login-form" onKeyUp={submitForm}>
              <div className="form-group">
                <label htmlFor="email" className="mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="form-control mb-4"
                  id="email"
                  placeholder="Correo electrónico"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control mb-4"
                  id="password"
                  placeholder="Contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-start mb-4">
                <Link
                  className="btn-link forgot-password-link"
                  to="/forgot-password">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  disabled={!canSubmit()}
                  // onClick={() => setShowModal(true)}
                  onClick={checkCredentials}>
                  Iniciar sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginCard;
