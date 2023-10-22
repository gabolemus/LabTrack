import React from "react";
import MainPage from "../templates/MainPage/MainPage";
import NewEquipmentForm from "../organisms/NewEquipmentForm/NewEquipmentForm";

const NewEquipment = () => {
  return (
    <MainPage roles={["superAdmin"]}>
      <NewEquipmentForm />
    </MainPage>
  );
};

export default NewEquipment;
