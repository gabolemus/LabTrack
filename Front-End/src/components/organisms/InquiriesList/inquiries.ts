// This file contains the type definitions for the Inquiries component.

import axios from "axios";

/** Enum that defines the possible inquiry statuses */
enum InquiryStatus {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
}

/** Interface for the information of the person whose inquiring about starting a project */
interface IProjectRequester {
  name: string;
  email: string;
}

/** Interface that represents a device inquiry */
interface IDeviceInquiry {
  id: string;
  name: string;
  path: string;
  quantity: number;
}

/** Inquiry interface */
export interface IInquiry {
  _id: string;
  projectRequester: IProjectRequester;
  devices: IDeviceInquiry[];
  projectName: string;
  courses: string[];
  status: InquiryStatus;
}

/** Gets all the inquiries */
export const getInquiries = async (): Promise<Array<IInquiry>> => {
  try {
    const response = await axios.get("http://localhost:8080/inquiries");
    return response.data.inquiries as Array<IInquiry>;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/** Gets a specific inquiry */
export const getInquiry = async (id: string): Promise<IInquiry> => {
  try {
    const response = await axios.get(`http://localhost:8080/inquiry?id=${id}`);
    return response.data.inquiry as IInquiry;
  } catch (error) {
    console.log(error);
    return {} as IInquiry;
  }
};
