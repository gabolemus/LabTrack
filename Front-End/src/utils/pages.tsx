// This file contains the app's page routes.

import Admins from "../components/pages/Admins";
import ConfirmRequest from "../components/pages/ConfirmRequest";
import Equipment from "../components/pages/Equipment";
import Home from "../components/pages/Home";
import Information from "../components/pages/Information";
import Inquiries from "../components/pages/Inquiries";
import Login from "../components/pages/Login";
import Manufacturers from "../components/pages/Manufacturers";
import NewEquipment from "../components/pages/NewEquipment";
import NewInquiries from "../components/pages/NewInquiry";
import Projects from "../components/pages/Projects";
import Tags from "../components/pages/Tags";
import { concatArrays } from "./utils";

/** Interface for the pages to be shown in the navbar */
export interface Page {
  /** Path of the page */
  path: string;
  /** Name of the page */
  name: string;
  /** Element to be rendered in the page */
  element: JSX.Element;
}

/**
 * Returns a page interface with the given parameters.
 * @param path Path of the page.
 * @param name Name of the page.
 * @param element Element to be rendered in the page.
 */
export const page = (path: string, name: string, element: JSX.Element) => {
  return { path, name, element };
};

/** Array of pages visible for the inquiries supervisors. */
const inquiriesSupervisorsPages = [
  page("/inquiries-registry", "Solicitudes", <Inquiries />),
];

/** Array of pages visible for the system administrators. */
const systemAdministratorsPages = [
  page("/admins", "Administradores", <Admins />),
  page("/manufacturers", "Manufacturadores", <Manufacturers />),
];

/** Array of the pages visible to all users. */
const allUsersPages = [
  page("/", "Inicio", <Home />),
  page("/equipment", "Equipo", <Equipment />),
  page("/projects", "Proyectos", <Projects />),
  page("/inquiries", "Solicitudes", <NewInquiries />),
  page("/information", "Información", <Information />),
  page("/login", "Iniciar sesión", <Login />),
];

/** Inquiries supervisors pages list. */
const inquiriesSupervisorsPagesList = concatArrays(
  allUsersPages,
  inquiriesSupervisorsPages,
  [page("/inquiries-registry/:inquiryID", "Solicitudes", <Inquiries />)]
);

/** Inquiries supervisors pages list for the navbar. */
const inquiriesSupervisorsPagesNavbar = inquiriesSupervisorsPagesList
  .slice(0, 3)
  .concat([page("/inquiries-registry", "Solicitudes", <Inquiries />)]);

/** System administrators pages list. */
const systemAdministratorsPagesList = concatArrays(
  allUsersPages,
  inquiriesSupervisorsPages,
  systemAdministratorsPages,
  [page("/inquiries-registry/:inquiryID", "Solicitudes", <Inquiries />)]
);

/** System administrators pages list for the navbar. */
const systemAdministratorsPagesNavbar = systemAdministratorsPagesList
  .slice(0, 3)
  .concat([
    page("/inquiries-registry", "Solicitudes", <Inquiries />),
    page("/admins", "Administradores", <Admins />),
    page("/manufacturers", "Manufacturadores", <Manufacturers />),
    page("/tags", "Etiquetas", <Tags />),
  ]);

/** All users pages list. */
const allUsersPagesList = allUsersPages;

/** All users pages list for the navbar. */
const allUsersPagesNavbar = allUsersPagesList.slice(0, 5);

const all = [
  page("/", "Inicio", <Home />),
  page("/equipment", "Equipo", <Equipment />),
  page("/projects", "Proyectos", <Projects />),
  page("/information", "Información", <Information />),
  page("/inquiries", "Solicitudes", <NewInquiries />),
  page("/inquiries-registry", "Solicitudes", <Inquiries />),
  page("/admins", "Administradores", <Admins />),
  page("/manufacturers", "Manufacturadores", <Manufacturers />),
  page("/tags", "Etiquetas", <Tags />),
  page("/login", "Iniciar sesión", <Login />),
  page("/equipment/:equipmentId", "Equipo", <Equipment />),
  page("/projects/:projectId", "Proyectos", <Projects />),
  page("/inquiries-registry/:inquiryID", "Solicitudes", <Inquiries />),
  page(
    "/confirm-request/:requestId",
    "Confirmar solicitud",
    <ConfirmRequest />
  ),
  page("/new-equipment", "Nuevo equipo", <NewEquipment />),
];

/** Object that contains all the pages and those to be rendered in the navbar. */
export const pages = {
  all,
  inquiriesSupervisors: {
    pages: inquiriesSupervisorsPagesList,
    navbar: inquiriesSupervisorsPagesNavbar,
  },
  systemAdministrators: {
    pages: systemAdministratorsPagesList,
    navbar: systemAdministratorsPagesNavbar,
  },
  allUsers: {
    pages: allUsersPagesList,
    navbar: allUsersPagesNavbar,
  },
};
