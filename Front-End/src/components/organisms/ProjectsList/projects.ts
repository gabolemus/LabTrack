// This file contains the type definitions for the Project component.

/** Type definition for the equipment used in a project */
type EquipmentUsed = {
  id: string;
  name: string;
  quantity: number;
  path: string;
};

/** Project type definition */
export type Project = {
  id: string;
  name: string;
  description: string;
  lead: string;
  startDate: string;
  dueDate: string;
  active: boolean;
  notes: string;
  equipmentUsed: EquipmentUsed[];
};

/** Sample project data */
export const sampleProjectData = [
  {
    id: "proyecto-1",
    name: "Proyecto 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae eros quis nisl aliquam aliquet. Sed euismod, nisl vitae aliquam aliquet, nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl. Sed vitae eros quis nisl aliquam aliquet. Sed euismod, nisl vitae aliquam aliquet, nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl.",
    lead: "John Doe",
    startDate: "2023-01-02",
    dueDate: "2023-06-15",
    active: false,
    notes:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae eros quis nisl aliquam aliquet. Sed euismod, nisl vitae aliquam aliquet, nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl. Sed vitae eros quis nisl aliquam aliquet. Sed euismod, nisl vitae aliquam aliquet, nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl.",
    equipmentUsed: [
      {
        id: "cisco-catalyst-9400-series-switch",
        name: "Cisco Catalyst 9400 Series Switch",
        quantity: 2,
        path: "/equipment/cisco-catalyst-9400-series-switch",
      },
      {
        id: "cisco-catalyst-9300-series-switch",
        name: "Cisco Catalyst 9300 Series Switch",
        quantity: 1,
        path: "/equipment/cisco-catalyst-9300-series-switch",
      },
    ],
  },
  {
    id: "proyecto-2",
    name: "Proyecto 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae eros quis nisl aliquam aliquet. Sed euismod, nisl vitae aliquam aliquet, nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl. Sed vitae eros quis nisl aliquam aliquet. Sed euismod, nisl vitae aliquam aliquet, nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl.",
    lead: "Jane Smith",
    startDate: "2023-01-01",
    dueDate: "2023-12-31",
    active: true,
    notes:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae eros quis nisl aliquam aliquet. Sed euismod, nisl vitae aliquam aliquet, nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl. Sed vitae eros quis nisl aliquam aliquet. Sed euismod, nisl vitae aliquam aliquet, nisl nisl aliquam nisl, vitae aliquam nisl nisl vitae nisl.",
    equipmentUsed: [
      {
        id: "oceanstor-dorado-3000-v6",
        name: "OceanStor Dorado 3000 V6",
        quantity: 1,
        path: "/equipment/oceanstor-dorado-3000-v6",
      },
    ],
  },
];

/** Fetches equipment data from the server */
export const fetchProject = async (id: string): Promise<Project> => {
  // TODO: Implement fetch from server

  // Right now, we just return the item that matches the id
  return new Promise((resolve, reject) => {
    const item = sampleProjectData.find((item) => item.id === id);
    if (item) {
      resolve(item);
    } else {
      reject(new Error("Item not found"));
    }
  });
};
