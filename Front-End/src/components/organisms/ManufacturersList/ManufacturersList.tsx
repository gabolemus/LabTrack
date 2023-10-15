import React, { useEffect, useState } from "react";
import { Manufacturer, getAllManufacturers } from "./manufacturers";
import Loader from "../../molecules/Loader/Loader";
import ModalForm from "../ModalForm/ModalForm";
import "./ManufacturersList.scss";
import axios from "axios";
import { areArraysEqual } from "../../../utils/utils";

const ManufacturersList = () => {
  const [manufacturers, setManufacturers] = useState<Array<Manufacturer>>([]);
  const [updatedManufacturers, setUpdatedManufacturers] = useState<
    Array<Manufacturer>
  >([]);
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
      setUpdatedManufacturers(manufacturers);
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

  /** Updates the state of the potentially new manufacturers. */
  const updateManufacturers = (manufacturer: Manufacturer) => {
    const index = updatedManufacturers.findIndex(
      (m) => m._id === manufacturer._id
    );

    if (index === -1) {
      setUpdatedManufacturers((prev) => [...prev, manufacturer]);
    } else {
      const newManufacturers = [...updatedManufacturers];
      newManufacturers[index] = manufacturer;
      setUpdatedManufacturers(newManufacturers);
    }
  };

  /** Undoes the changes made to the manufacturers. */
  const discardChanges = () => {
    setUpdatedManufacturers(manufacturers);

    document
      .querySelectorAll<HTMLInputElement>(".manufacturers-table input")
      .forEach((input, index) => {
        input.value = manufacturers[index].name;
      });
  };

  /** Attempts to update the manufacturers in bulk. */
  const updateManufacturersInBulk = async () => {
    try {
      const response = await axios.put("http://localhost:8080/manufacturers", {
        manufacturers: updatedManufacturers,
      });
      setShowModal(true);

      if (response.status === 200 && response.data.success) {
        setManufacturers(updatedManufacturers);
        setModalTitle("Manufacturadores actualizados");
        setModalBody(
          <p className="fs-6">
            Los manufacturadores han sido actualizados exitosamente.
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
          <p className="fs-6">Ocurrió un error al agregar el manufacturador.</p>
          <p className="fs-6">Por favor, inténalo de nuevo más tarde.</p>
        </>
      );

      if (axios.isAxiosError(error)) {
        const { response } = error;

        if (response?.data.error === "ENFORCE_UNIQUE_FIELD") {
          msg = (
            <>
              <p className="fs-6">
                Por favor, asegúrese de que los nombres de los manufacturadores
                sean únicos.
              </p>
              <p className="fs-6">
                Ya existe un manufacturador con el nombre{" "}
                {response.data.nonUniqueName}.
              </p>
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
  };

  /**
   * Checks if the manufacturers names are equal to the updated manufacturers
   * and if there are any empty names in the updated manufacturers.
   */
  const canUpdateManufacturers = () =>
    areArraysEqual(manufacturers, updatedManufacturers) ||
    updatedManufacturers.some((manufacturer) => manufacturer.name === "");

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-success manufacturers-btn"
          onClick={handleAddManufacturer}>
          Agregar nuevo manufacturador
        </button>
        <button
          className="btn btn-primary manufacturers-btn"
          disabled={canUpdateManufacturers()}
          onClick={updateManufacturersInBulk}>
          Actualizar manufacturadores
        </button>
        <button
          className="btn btn-danger manufacturers-btn"
          disabled={areArraysEqual(manufacturers, updatedManufacturers)}
          onClick={discardChanges}>
          Descartar cambios
        </button>
      </div>
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
                <td>
                  <input
                    type="text"
                    className="form-control manufacturer-name"
                    defaultValue={manufacturer.name}
                    onChange={(e) => {
                      const newManufacturer = {
                        ...manufacturer,
                        name: e.target.value,
                      };
                      updateManufacturers(newManufacturer);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManufacturersList;
