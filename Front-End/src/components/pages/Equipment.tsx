import React from "react";
import { useParams } from "react-router-dom";
import MainPage from "../templates/MainPage/MainPage";
import EquipmentList from "../organisms/EquipmentList/EquipmentList";
import EquipmentDetail from "../organisms/EquipmentDetail/EquipmentDetail";

const Equipment = () => {
  const { equipmentId } = useParams();

  return (
    <MainPage>
      {equipmentId ? <EquipmentDetail id={equipmentId} /> : <EquipmentList />}
    </MainPage>
  );
};

export default Equipment;
