// This file contains the app's page routes.

import Admins from "../components/pages/Admins";
import Equipment from "../components/pages/Equipment";
import Home from "../components/pages/Home";
import Information from "../components/pages/Information";
import Inquiries from "../components/pages/Inquiries";
import Login from "../components/pages/Login";
import Manufacturers from "../components/pages/Manufacturers";
import Projects from "../components/pages/Projects";
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

/** Array of pages visible for the inquiries supervisors. */
const inquiriesSupervisorsPages = [
  {
    path: "/inquiries",
    name: "Solicitudes",
    element: <Inquiries />,
  },
];

/** Array of pages visible for the system administrators. */
const systemAdministratorsPages = [
  {
    path: "/admins",
    name: "Administradores",
    element: <Admins />,
  },
  {
    path: "/manufacturers",
    name: "Manufacturadores",
    element: <Manufacturers />,
  },
];

/** Array of the pages visible to all users. */
const allUsersPages = [
  {
    path: "/",
    name: "Inicio",
    element: <Home />,
  },
  {
    path: "/equipment",
    name: "Equipo",
    element: <Equipment />,
  },
  {
    path: "/projects",
    name: "Proyectos",
    element: <Projects />,
  },
  {
    path: "/information",
    name: "Información",
    element: <Information />,
  },
  {
    path: "/login",
    name: "Iniciar sesión",
    element: <Login />,
  },
];

/** Inquiries supervisors pages list. */
const inquiriesSupervisorsPagesList = concatArrays(
  allUsersPages,
  inquiriesSupervisorsPages,
  [
    {
      path: "/inquiries/:inquiryID",
      name: "Solicitudes",
      element: <Inquiries />,
    },
  ]
);

/** Inquiries supervisors pages list for the navbar. */
const inquiriesSupervisorsPagesNavbar = inquiriesSupervisorsPagesList
  .slice(0, 4)
  .concat([
    {
      path: "/inquiries/",
      name: "Solicitudes",
      element: <Inquiries />,
    },
  ]);

/** System administrators pages list. */
const systemAdministratorsPagesList = concatArrays(
  allUsersPages,
  inquiriesSupervisorsPages,
  systemAdministratorsPages,
  [
    {
      path: "/inquiries/:inquiryID",
      name: "Solicitudes",
      element: <Inquiries />,
    },
  ]
);

/** System administrators pages list for the navbar. */
const systemAdministratorsPagesNavbar = systemAdministratorsPagesList.slice(
  0,
  4
).concat([
  {
    path: "/inquiries/",
    name: "Solicitudes",
    element: <Inquiries />,
  },
  {
    path: "/admins",
    name: "Administradores",
    element: <Admins />,
  },
  {
    path: "/manufacturers",
    name: "Manufacturadores",
    element: <Manufacturers />,
  }
]);

/** All users pages list. */
const allUsersPagesList = allUsersPages;

/** All users pages list for the navbar. */
const allUsersPagesNavbar = allUsersPagesList.slice(0, 4);

const all = [
  {
    path: "/",
    name: "Inicio",
    element: <Home />,
  },
  {
    path: "/equipment",
    name: "Equipo",
    element: <Equipment />,
  },
  {
    path: "/projects",
    name: "Proyectos",
    element: <Projects />,
  },
  {
    path: "/information",
    name: "Información",
    element: <Information />,
  },
  {
    path: "/inquiries",
    name: "Solicitudes",
    element: <Inquiries />,
  },
  {
    path: "/admins",
    name: "Administradores",
    element: <Admins />,
  },
  {
    path: "/manufacturers",
    name: "Manufacturadores",
    element: <Manufacturers />,
  },
  {
    path: "/login",
    name: "Iniciar sesión",
    element: <Login />,
  },
  {
    path: "/equipment/:equipmentId",
    name: "Equipo",
    element: <Equipment />,
  },
  {
    path: "/projects/:projectId",
    name: "Proyectos",
    element: <Projects />,
  },
  {
    path: "/inquiries/:inquiryID",
    name: "Solicitudes",
    element: <Inquiries />,
  },
];

/** Object that contains all the pages and those to be rendered in the navbar. */
export const pages = {
  all,
  navbar: all.slice(0, 6),
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
