import React, { useEffect, useState } from "react";
import { User, getFilteredUsers } from "./admins";
import Loader from "../../molecules/Loader/Loader";
import ModalForm from "../ModalForm/ModalForm";
import axios from "axios";
import "./AdminsLists.scss";

const AdminsLists = () => {
  const [superAdmins, setSuperAdmins] = useState<Array<User>>([]);
  const [admins, setAdmins] = useState<Array<User>>([]);
  const [loading, setloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [modalCallback, setModalCallback] = useState<() => void>(() => {});
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [modalBtnText, setModalBtnText] = useState("");
  const [modalBtnClass, setModalBtnClass] = useState("");

  useEffect(() => {
    (async () => {
      setloading(true);
      const filteredUsers = await getFilteredUsers();
      setSuperAdmins(filteredUsers["Super Admin"]);
      setAdmins(filteredUsers["Admin"]);
      setloading(false);
    })();
  }, []);

  /** Displays the modal form to create a new admin. */
  const handleCreateAdmin = (role: string) => {
    setModalTitle("Nuevo súper administrador");
    setModalBody(
      `<form id="create-admin-form">
        <div class="mb-3">
          <label for="name" class="form-label">Nombre</label>
          <input type="text" class="form-control" id="name" placeholder="Nombre" required>
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Correo</label>
          <input type="email" class="form-control" id="email" placeholder="Correo" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input type="password" class="form-control" id="password" placeholder="Contraseña" required>
        </div>
      </form>`
    );
    setModalBtnText("Crear");
    setModalBtnClass("btn-success");
    setShowModal(true);
    setModalCallback(() => async () => {
      const form = document.getElementById(
        "create-admin-form"
      ) as HTMLFormElement;
      const userName = (form.elements[0] as HTMLInputElement).value;
      const userEmail = (form.elements[1] as HTMLInputElement).value;
      const userPassword = (form.elements[2] as HTMLInputElement).value;
      if (!(userName === "" || userEmail === "" || userPassword === "")) {
        try {
          setloading(true);
          const response = await axios.post("http://localhost:8080/user", {
            name: userName,
            email: userEmail,
            password: userPassword,
            role,
          });

          if (response.data.success) {
            if (role === "Super Admin") {
              setSuperAdmins((prev) => [
                ...prev,
                {
                  _id: response.data.user._id,
                  name: response.data.user.name,
                  email: response.data.user.email,
                  role: response.data.user.role,
                },
              ]);
            } else {
              setAdmins((prev) => [
                ...prev,
                {
                  _id: response.data.user._id,
                  name: response.data.user.name,
                  email: response.data.user.email,
                  role: response.data.user.role,
                },
              ]);
            }
            setModalTitle("Usuario creado");
            setModalBody(
              `<p class="fs-6 mb-3">El usuario ${userName} ha sido creado exitosamente.</p>`
            );
            setModalBtnText("Aceptar");
            setModalBtnClass("btn-success");
            setModalCallback(() => () => {
              setShowModal(false);
            });
          } else {
            setModalTitle("Error");
            setModalBody(
              `<p class="fs-5 mb-3">No se pudo crear al usuario ${userName}. Por favor, inténtelo de nuevo.</p>`
            );
            setModalBtnText("Aceptar");
            setModalBtnClass("btn-danger");
            setModalCallback(() => () => {
              setShowModal(false);
            });
          }

          setShowModal(false);
          setloading(false);
          setShowModal(true);
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  /** Displays modal form to confirm deletion of an admin. */
  const handleDeleteAdmin = (user: User, role: string) => {
    setModalTitle("Confirmar acción");
    setModalBody(
      `<p class="fs-6 mb-2">¿Estás seguro de que quieres eliminar a este usuario?</p><ul><li><p class="fs-6"><strong>Nombre:</strong> ${user.name}</p></li><li><p class="fs-6"><strong>Correo:</strong> ${user.email}</p></li></ul>`
    );
    setModalBtnText("Eliminar");
    setModalBtnClass("btn-danger");
    setShowModal(true);
    setModalCallback(() => async () => {
      try {
        setloading(true);
        const response = await axios.delete(
          `http://localhost:8080/user?id=${user._id}`
        );

        if (response.data.success) {
          setModalTitle("Usuario eliminado");
          setModalBody(
            `<p class="fs-6 mb-3">El usuario ${user.name} ha sido eliminado exitosamente.</p>`
          );
          setModalBtnText("Aceptar");
          setModalBtnClass("btn-success");
          setModalCallback(() => () => {
            setShowModal(false);
          });
        } else {
          setModalTitle("Error");
          setModalBody(
            `<p class="fs-5 mb-3">No se pudo eliminar al usuario ${user.name}. Por favor, inténtelo de nuevo.</p>`
          );
          setModalBtnText("Aceptar");
          setModalBtnClass("btn-danger");
          setModalCallback(() => () => {
            setShowModal(false);
          });
        }

        setShowModal(false);
        if (role === "Super Admin") {
          setSuperAdmins((prev) => prev.filter((u) => u._id !== user._id));
        } else {
          setAdmins((prev) => prev.filter((u) => u._id !== user._id));
        }
        setloading(false);
        setShowModal(true);
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div>
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
      <h1>Administradores del Sistema</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Súper Admins</h4>
        <button
          className="btn btn-primary"
          onClick={() => handleCreateAdmin("Super Admin")}>
          Agregar nuevo súper administrador
        </button>
      </div>
      <div className="admins-table">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="admins-table-column">Nombre</th>
              <th className="admins-table-column">Correo</th>
              <th className="admins-table-column">¿Eliminar?</th>
            </tr>
          </thead>
          <tbody>
            {superAdmins.map((superAdmin) => (
              <tr key={superAdmin._id}>
                <td>{superAdmin.name}</td>
                <td>
                  <a href={`mailto:${superAdmin.email}`}>{superAdmin.email}</a>
                </td>
                <td>
                  {superAdmin._id !== localStorage.getItem("userId") && (
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        handleDeleteAdmin(superAdmin, "Super Admin")
                      }>
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <hr className="my-5" />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Admins</h4>
        <button
          className="btn btn-primary"
          onClick={() => handleCreateAdmin("Admin")}>
          Agregar nuevo administrador
        </button>
      </div>
      <div className="admins-table">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="admins-table-column">Nombre</th>
              <th className="admins-table-column">Correo</th>
              <th className="admins-table-column">¿Eliminar?</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td>{admin.name}</td>
                <td>
                  <a href={`mailto:${admin.email}`}>{admin.email}</a>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteAdmin(admin, "Admin")}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminsLists;
