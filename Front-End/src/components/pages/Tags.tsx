import React from "react";
import MainPage from "../templates/MainPage/MainPage";
import TagsList from "../organisms/TagsList/TagsList";

const Tags = () => {
  return (
    <MainPage roles={["superAdmin"]}>
      <TagsList />
    </MainPage>
  );
};

export default Tags;
