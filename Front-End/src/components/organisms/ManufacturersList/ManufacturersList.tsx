import React, { useEffect, useState } from "react";
import { Manufacturer, getAllManufacturers } from "./manufacturers";
import Loader from "../../molecules/Loader/Loader";
import ModalForm from "../ModalForm/ModalForm";
import "./ManufacturersList.scss";
import axios from "axios";

const ManufacturersList = () => {
  const [manufacturers, setManufacturers] = useState<Array<Manufacturer>>([]);
  const [loading, setloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [modalCallback, setModalCallback] = useState<() => void>(() => {});
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState(<></>);
  const [modalBtnText, setModalBtnText] = useState("");
  const [modalBtnClass, setModalBtnClass] = useState("");

  useEffect(() => {
    (async () => {
      setloading(true);
      const manufacturers = await getAllManufacturers();
      setManufacturers(manufacturers);
      setloading(false);
    })();
  }, []);

  /** Attempt to add a new manufacturer to the database. */
  const addManufacturer = async (name: string) => {
    if (name !== "") {
      try {
        const response = await axios.post(
          "http://localhost:8080/manufacturer",
          { name }
        );
        setShowModal(true);

        if (response.status === 201 && response.data.success) {
          setManufacturers((prev) => [...prev, response.data.newmanufacturer]);
          setModalTitle("Manufacturador agregado");
          setModalBody(
            <p className="fs-6">
              El manufacturador {response.data.newmanufacturer.name} ha sido
              agregado exitosamente.
            </p>
          );
          setModalBtnText("Aceptar");
          setModalBtnClass("btn-primary");
          setModalCallback(() => () => {
            setShowModal(false);
          });
        }
      } catch (error) {
        let msg = (
          <>
            <p className="fs-6">
              Ocurrió un error al agregar el manufacturador.
            </p>
            <p className="fs-6">Por favor, inténalo de nuevo más tarde.</p>
          </>
        );

        if (axios.isAxiosError(error)) {
          const { response } = error;

          if (response?.data.error === "ENFORCE_UNIQUE_FIELD") {
            msg = (
              <>
                <p className="fs-6">
                  Un manufacturador con el nombre {name} ya existe.
                </p>
                <p className="fs-6">Por favor, ingrese un nombre diferente.</p>
              </>
            );
          }
        }

        setShowModal(true);
        setModalTitle("Error");
        setModalBody(msg);
        setModalBtnText("Aceptar");
        setModalBtnClass("btn-primary");
        setModalCallback(() => () => {
          setShowModal(false);
        });
      }
    }
  };

  /** Displays the modal for the creation of a new manufacturer. */
  const handleAddManufacturer = () => {
    setShowModal(true);
    setModalTitle("Nuevo manufacturador");
    setModalBody(
      <div className="mb-4">
        <label htmlFor="manufacturer-name" className="mb-2">
          Nombre
        </label>
        <input
          type="text"
          name="manufacturer-name"
          id="manufacturer-name"
          className="form-control"
          placeholder="Nombre del manufacturador"
          required
          onChange={(e) => {
            const newManufacturer = e.target.value;
            setModalCallback(() => () => {
              addManufacturer(newManufacturer);
            });
          }}
        />
      </div>
    );
    setModalBtnText("Agregar");
    setModalBtnClass("btn-success");
    setModalCallback(() => () => {
      addManufacturer("");
    });
  };

  return loading ? (
    <Loader loading={loading} />
  ) : (
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
      <h1>Manufacturadores</h1>
      <button className="btn btn-primary mb-4" onClick={handleAddManufacturer}>
        Agregar nuevo manufacturador
      </button>
      <div className="manufacturers-table">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Número</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {manufacturers.map((manufacturer, index) => (
              <tr key={manufacturer._id}>
                <td>{index + 1}</td>
                <td>{manufacturer.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManufacturersList;
