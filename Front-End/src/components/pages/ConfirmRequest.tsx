import React from "react";
import MainPage from "../templates/MainPage/MainPage";
import { useParams } from "react-router-dom";
import ProjectRequestConf from "../organisms/ProjectRequestConf/ProjectRequestConf";

const ConfirmRequest = () => {
  const { requestId } = useParams();

  return (
    <MainPage>
      <ProjectRequestConf requestId={requestId} />
    </MainPage>
  );
};

export default ConfirmRequest;
