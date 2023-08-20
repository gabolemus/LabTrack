// This file contains the app's page routes.

import Equipment from "../components/pages/Equipment";
import Home from "../components/pages/Home";
import Projects from "../components/pages/Projects";

/** Array of objects that contain the path, name, and element to be rendered for each page. */
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
    path: "/equipment/:equipmentId",
    name: "Equipo",
    element: <Equipment />,
  },
  {
    path: "/projects/:projectId",
    name: "Proyectos",
    element: <Projects />,
  },
];

/** Object that contains all the pages and those to be rendered in the navbar. */
export const pages = {
  all,
  navbar: all.slice(0, 3),
  // TODO: add diferent pages in the navbar for each user type
};
