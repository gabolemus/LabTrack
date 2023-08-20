import React from "react";
import { useParams } from "react-router-dom";
import MainPage from "../templates/MainPage/MainPage";

const Equipment = () => {
  const { equipmentId } = useParams();

  return (
    <MainPage>
      <h1>Equipo de Laboratorio</h1>
      <p>Equipo: {equipmentId}</p>
      <p>Este es el listado de equipos de laboratorio.</p>
    </MainPage>
  );
};

export default Equipment;
