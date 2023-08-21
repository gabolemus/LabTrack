// This file contains the type definitions for the Equipment component.

/** Type definition for a documentation link */
export type DocumentationLink = {
  name: string;
  url: string;
};

/** Equipment type definition */
export type Equipment = {
  id: string;
  name: string;
  manufacturer: string;
  tags: string[];
  path: string;
  documentationLinks?: DocumentationLink[];
  images?: string[];
  notes?: string;
  configuration?: string;
  status: string;
  lastUpdated: string;
};

/** Sample equipment data */
export const sampleEquipmentData = [
  {
    id: "oceanstor-dorado-3000-v6",
    name: "OceanStor Dorado 3000 V6",
    manufacturer: "Huawei",
    tags: ["Tag1", "Tag2"],
    path: "/equipment/oceanstor-dorado-3000-v6",
    documentationLinks: [
      {
        name: "Documentación Huawei",
        url: "https://support.huawei.com/enterprise/en/doc/EDOC1100214949",
      },
      {
        name: "Especificaciones técnicas",
        url: "https://de.mti.com/wp-content/uploads/2021/07/Huawei-OceanStor-Dorado-V6-All-Flash-Storage-Systems-Technical-White-Paper.pdf",
      },
      {
        name: "Data Sheet",
        url: "https://www.fks.de/wp-content/uploads/2020/08/Huawei-OceanStor-Dorado-V6-All-Flash-Storage-DataSheet.pdf",
      },
    ],
    images: [
      "https://e.huawei.com/-/mediae/EBG/Images/ProductV2/cloud-computing-dc/storage/all-flash/dorado-3000-v6/dorado-3000-v6.png",
      "https://www.muycomputerpro.com/wp-content/uploads/2019/10/HuaweiOceanDorado-1000x600.jpg",
      "https://cdn.competec.ch/images2/8/4/0/143257048/143257048_xxl3.jpg",
      "https://image.made-in-china.com/202f0j00BEDcrpuRIbzk/Hua-Wei-Oceanstor-Dorado-3000-V6-All-Flash-Storage-System.webp",
    ],
    notes: "Es posible agregar información adicional en el apartado de notas.",
    configuration: "Admin user: admin\nPassword: admin",
    status: "Disponible",
    lastUpdated: "2023-08-01T12:00:00.000Z",
  },
  {
    id: "cisco-catalyst-9400-series-switch",
    name: "Cisco Catalyst 9400 Series Switch",
    manufacturer: "Cisco",
    tags: ["Tag2", "Tag3"],
    path: "/equipment/cisco-catalyst-9400-series-switch",
    status: "Disponible",
    lastUpdated: "2023-08-01T12:00:00.000Z",
  },
  {
    id: "cisco-catalyst-9300-series-switch",
    name: "Cisco Catalyst 9300 Series Switch",
    manufacturer: "Cisco",
    tags: ["Tag3", "Tag4"],
    path: "/equipment/cisco-catalyst-9300-series-switch",
    status: "Disponible",
    lastUpdated: "2023-08-01T12:00:00.000Z",
  },
  {
    id: "soldering-station",
    name: "Soldering Station",
    manufacturer: "Weller",
    tags: ["Tag5", "Tag6"],
    path: "/equipment/soldering-station",
    status: "Disponible",
    lastUpdated: "2023-08-01T12:00:00.000Z",
  },
  {
    id: "spectrum-analyzer",
    name: "Spectrum Analyzer",
    manufacturer: "Rohde & Schwarz",
    tags: ["Tag7", "Tag8"],
    path: "/equipment/spectrum-analyzer",
    status: "Disponible",
    lastUpdated: "2023-08-01T12:00:00.000Z",
  },
  {
    id: "ni-elvis-iii",
    name: "NI ELVIS III",
    manufacturer: "National Instruments",
    tags: ["Tag9", "Tag10"],
    path: "/equipment/ni-elvis-iii",
    status: "Disponible",
    lastUpdated: "2023-08-01T12:00:00.000Z",
  },
  {
    id: "ni-myrio",
    name: "NI myRIO",
    manufacturer: "National Instruments",
    tags: ["Tag11", "Tag12"],
    path: "/equipment/ni-myrio",
    status: "Disponible",
    lastUpdated: "2023-08-01T12:00:00.000Z",
  },
  {
    id: "ni-usb-6008",
    name: "NI USB-6008",
    manufacturer: "National Instruments",
    tags: ["Tag13", "Tag14"],
    path: "/equipment/ni-usb-6008",
    status: "Disponible",
    lastUpdated: "2023-08-01T12:00:00.000Z",
  },
  {
    id: "ni-usb-6009",
    name: "NI USB-6009",
    manufacturer: "National Instruments",
    tags: ["Tag15", "Tag16"],
    path: "/equipment/ni-usb-6009",
    status: "Disponible",
    lastUpdated: "2023-08-01T12:00:00.000Z",
  },
  {
    id: "ni-usb-6211",
    name: "NI USB-6211",
    manufacturer: "National Instruments",
    tags: ["Tag17", "Tag18"],
    path: "/equipment/ni-usb-6211",
    status: "Disponible",
    lastUpdated: "2023-08-01T12:00:00.000Z",
  },
  {
    id: "ni-usb-6212",
    name: "NI USB-6212",
    manufacturer: "National Instruments",
    tags: ["Tag19", "Tag20"],
    path: "/equipment/ni-usb-6212",
    status: "Disponible",
    lastUpdated: "2023-08-01T12:00:00.000Z",
  },
  {
    id: "ni-usb-6218",
    name: "NI USB-6218",
    manufacturer: "National Instruments",
    tags: ["Tag21", "Tag22"],
    path: "/equipment/ni-usb-6218",
    status: "Disponible",
    lastUpdated: "2023-08-01T12:00:00.000Z",
  },
];

/** Fetches equipment data from the server */
export const fetchEquipmentData = async (id: string): Promise<Equipment> => {
  // TODO: Implement fetch from server

  // Right now, we just return the item that matches the id
  return new Promise((resolve, reject) => {
    const item = sampleEquipmentData.find((item) => item.id === id);
    if (item) {
      resolve(item);
    } else {
      reject(new Error("Item not found"));
    }
  });
};
