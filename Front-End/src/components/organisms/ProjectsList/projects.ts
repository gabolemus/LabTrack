// This file contains the type definitions for the Project component.

/** Project type definition */
export type Project = {
  id: string;
  name: string;
  lead: string;
  active: boolean;
};

/** Sample project data */
export const sampleProjectData = [
  {
    id: "proyecto-1",
    name: "Proyecto 1",
    lead: "John Doe",
    active: false,
  },
  {
    id: "proyecto-2",
    name: "Proyecto 2",
    lead: "Jane Smith",
    active: true,
  },
];
