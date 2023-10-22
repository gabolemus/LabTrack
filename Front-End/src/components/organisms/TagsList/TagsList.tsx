import React, { useEffect, useState } from "react";
import { ITag, getAllTags } from "./tag";
import Loader from "../../molecules/Loader/Loader";
import ModalForm from "../ModalForm/ModalForm";
import "./TagsList.scss";
import axios from "axios";
import { BE_URL, areArraysEqual } from "../../../utils/utils";

const TagsList = () => {
  const [tags, setTags] = useState<ITag[]>([]);
  const [updatedTags, setUpdatedTags] = useState<ITag[]>([]);
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
      const tags = await getAllTags();
      setTags(tags);
      setUpdatedTags(tags);
      setloading(false);
    })();
  }, []);

  /** Attempt to add a new tag to the database. */
  const addTag = async (name: string) => {
    if (name !== "") {
      try {
        const response = await axios.post(`${BE_URL}/tag`, { name });
        setShowModal(true);

        if (response.status === 201 && response.data.success) {
          setTags((prev) => [...prev, response.data.newtag]);
          setModalTitle("Etiqueta agregada");
          setModalBody(
            <p className="fs-6">
              La etiqueta {response.data.newtag.name} ha sido agregada
              exitosamente.
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
              Ocurrió un error al agregar la etiqueta.
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
                  Una etiqueta con el nombre {name} ya existe.
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

  /** Displays the modal for the creation of a new tag. */
  const handleAddTag = () => {
    setShowModal(true);
    setModalTitle("Nueva etiqueta");
    setModalBody(
      <div className="mb-4">
        <label htmlFor="etiqueta-name" className="mb-2">
          Nombre
        </label>
        <input
          type="text"
          name="etiqueta-name"
          id="etiqueta-name"
          className="form-control"
          placeholder="Nombre de la etiqueta"
          required
          onChange={(e) => {
            const newTag = e.target.value;
            setModalCallback(() => () => {
              addTag(newTag);
            });
          }}
        />
      </div>
    );
    setModalBtnText("Agregar");
    setModalBtnClass("btn-success");
    setModalCallback(() => () => {
      addTag("");
    });
  };

  /** Updates the state of the potentially new tags. */
  const updateTags = (tag: ITag) => {
    const index = updatedTags.findIndex((m) => m._id === tag._id);

    if (index === -1) {
      setUpdatedTags((prev) => [...prev, tag]);
    } else {
      const newTags = [...updatedTags];
      newTags[index] = tag;
      setUpdatedTags(newTags);
    }
  };

  /** Undoes the changes made to the tags. */
  const discardChanges = () => {
    setUpdatedTags(tags);

    document
      .querySelectorAll<HTMLInputElement>(".tags-table input")
      .forEach((input, index) => {
        input.value = tags[index].name;
      });
  };

  /** Attempts to update the tags in bulk. */
  const updateTagsInBulk = async () => {
    try {
      const response = await axios.put(`${BE_URL}/tags`, {
        tags: updatedTags,
      });
      console.log(updatedTags);
      console.log(response.data);
      setShowModal(true);

      if (response.status === 200 && response.data.success) {
        setTags(updatedTags);
        setModalTitle("Etiquetas actualizados");
        setModalBody(
          <p className="fs-6">
            Las etiquetas han sido actualizados exitosamente.
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
          <p className="fs-6">Ocurrió un error al agregar la etiqueta.</p>
          <p className="fs-6">Por favor, inténalo de nuevo más tarde.</p>
        </>
      );

      if (axios.isAxiosError(error)) {
        const { response } = error;

        if (response?.data.error === "ENFORCE_UNIQUE_FIELD") {
          msg = (
            <>
              <p className="fs-6">
                Por favor, asegúrese de que los nombres de las etiquetas
                sean únicos.
              </p>
              <p className="fs-6">
                Ya existe una etiqueta con el nombre{" "}
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
   * Checks if the tags names are equal to the updated tags
   * and if there are any empty names in the updated tags.
   */
  const canUpdateTags = () =>
    areArraysEqual(tags, updatedTags) ||
    updatedTags.some((tag) => tag.name === "");

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
      <h1>Etiquetas</h1>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-success tags-btn"
          onClick={handleAddTag}>
          Agregar nueva etiqueta
        </button>
        <button
          className="btn btn-primary tags-btn"
          disabled={canUpdateTags()}
          onClick={updateTagsInBulk}>
          Actualizar etiquetas
        </button>
        <button
          className="btn btn-danger tags-btn"
          disabled={areArraysEqual(tags, updatedTags)}
          onClick={discardChanges}>
          Descartar cambios
        </button>
      </div>
      <div className="tags-table">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Número</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag, index) => (
              <tr key={tag._id}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="text"
                    className="form-control tag-name"
                    defaultValue={tag.name}
                    onChange={(e) => {
                      const newtag = {
                        ...tag,
                        name: e.target.value,
                      };
                      updateTags(newtag);
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

export default TagsList;
