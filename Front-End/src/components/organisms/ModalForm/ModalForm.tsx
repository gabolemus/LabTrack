import React, { useEffect, useState } from "react";
import "./ModalForm.scss";

/** Interface for ModalForm props */
interface ModalFormProps {
  show: boolean;
  handleClose: () => void;
  onAccept?: () => void;
  title?: string;
  body: string | JSX.Element;
  buttonText?: string;
  primaryBtnText?: string;
  primaryBtnClass?: string;
}

const ModalForm = ({
  show,
  handleClose,
  onAccept,
  title,
  body,
  primaryBtnText,
  primaryBtnClass,
}: ModalFormProps) => {
  useEffect(() => {
    if (show) {
      // Calculate scrollbar width
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Prevent scrolling and compensate for scrollbar width
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      // Re-enable scrolling and remove padding compensation
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0";
    }
    return () => {
      // Clean up by restoring the original styles
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0";
    };
  }, [show]);

  const handleAccept = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAccept) {
      onAccept();
    }
    handleClose();
  };

  return (
    <div>
      {show && (
        <div
          className="modal"
          tabIndex={-1}
          role="dialog"
          style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-overlay" onClick={handleClose} />
              <div className="modal-header">
                <h5 className="modal-title">{title || "Modal Form"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                {typeof body === "string" ? (
                  <div dangerouslySetInnerHTML={{ __html: body }} />
                ) : (
                  body
                )}
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handleClose}>
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    className={`btn ${primaryBtnClass || "btn-primary"}`}
                    onClick={handleAccept}>
                    {primaryBtnText || "Aceptar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalForm;
