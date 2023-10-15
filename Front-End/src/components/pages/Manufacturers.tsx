import React from "react";
import MainPage from "../templates/MainPage/MainPage";
import ManufacturersList from "../organisms/ManufacturersList/ManufacturersList";

const Manufacturers = () => {
  return (
    <MainPage roles={["superAdmin"]}>
      <ManufacturersList />
    </MainPage>
  );
};

export default Manufacturers;
