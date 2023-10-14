// This file contains the type definitions for the Inquiries component.

import axios from "axios";

/** Enum that defines the possible inquiry statuses */
export enum InquiryStatus {
  UNCONFIRMED = "Unconfirmed",
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

/** Project timelapse interface */
interface ITimelapse {
  start: Date;
  end: Date;
}

/** Inquiry interface */
export interface IInquiry {
  _id: string;
  projectRequester: IProjectRequester;
  devices: IDeviceInquiry[];
  projectName: string;
  courses: string[];
  description: string;
  timelapse: ITimelapse;
  status: InquiryStatus;
}

/** Gets the inquiries filtered by the given name and status */
export const getFilteredInquiries = async (
  name: string,
  status: InquiryStatus
): Promise<Array<IInquiry>> => {
  try {
    const nameQuery = name ? `&projectName=${name}` : "";
    const response = await axios.get(
      `http://localhost:8080/inquiries/filtered?status=${status}${nameQuery}`
    );
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

/** Get the state to show the requests based on the URL params */
export const getShowState = (requestStatus: string | null): InquiryStatus => {
  // If there is no status in the URL, show the pending requests
  if (!requestStatus) {
    return InquiryStatus.PENDING;
  }

  switch (requestStatus) {
    case "Pending":
      return InquiryStatus.PENDING;
    case "Accepted":
      return InquiryStatus.ACCEPTED;
    case "Rejected":
      return InquiryStatus.REJECTED;
    default:
      return InquiryStatus.PENDING;
  }
};
