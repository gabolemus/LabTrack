import React from "react";
import MainPage from "../templates/MainPage/MainPage";
import AdminsLists from "../organisms/AdminsLists/AdminsLists";

const Admins = () => {
  return (
    <MainPage roles={["superAdmin"]}>
      <AdminsLists />
    </MainPage>
  );
};

export default Admins;
