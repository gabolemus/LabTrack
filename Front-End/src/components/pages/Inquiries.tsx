import React from "react";
import { useParams } from "react-router-dom";
import MainPage from "../templates/MainPage/MainPage";
import InquiryDetail from "../organisms/InquiryDetail/InquiryDetail";
import InquiriesList from "../organisms/InquiriesList/InquiriesList";

const Inquiries = () => {
  const { inquiryID } = useParams();

  return (
    <MainPage roles={["admin", "superAdmin"]}>
      {inquiryID ? <InquiryDetail id={inquiryID} /> : <InquiriesList />}
    </MainPage>
  );
};

export default Inquiries;
