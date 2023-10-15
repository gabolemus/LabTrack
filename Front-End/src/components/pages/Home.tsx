import React from "react";
import MainPage from "../templates/MainPage/MainPage";

/** Component that render the home page */
const Home = () => {
  return (
    <MainPage>
      <h1>LabTrack</h1>
      <p>
        LabTrack es el sistema de registro y control del equipo del laboratorio
        de electrónica.
      </p>
      <h2>Funcionalidades</h2>
      <ul>
        <li>
          <strong>Visualizacíon del equipo:</strong> permite ver el equipo del
          laboratorio.
        </li>
        <li>
          <strong>Gestión de proyectos:</strong> es posible visualizar los
          detalles de los proyectos realizados en el laboratorio.
        </li>
        <li>
          <strong>Gestión de equipos:</strong> permite visualizar los detalles
          de los equipos del laboratorio.
        </li>
        <li>
          <strong>Solicitud de equipos:</strong> permite solicitar equipos del
          laboratorio para la realización de proyectos.
        </li>
      </ul>
      <p>
        Para aprender más sobre el sistema, puede visitar la sección de{" "}
        <a href="/information">información</a>.
      </p>
    </MainPage>
  );
};

export default Home;
