// This file contains the type definitions for the Equipment component.

/** Equipment type definition */
export type Equipment = {
  id: string;
  name: string;
  manufacturer: string;
  tags: string[];
  path: string;
};

/** Sample equipment data */
export const sampleEquipmentData = [
  {
    id: "oceanstor-dorado-3000-v6",
    name: "OceanStor Dorado 3000 V6",
    manufacturer: "Huawei",
    tags: ["Tag1", "Tag2"],
    path: "/equipment/oceanstor-dorado-3000-v6",
  },
  {
    id: "cisco-catalyst-9400-series-switch",
    name: "Cisco Catalyst 9400 Series Switch",
    manufacturer: "Cisco",
    tags: ["Tag2", "Tag3"],
    path: "/equipment/cisco-catalyst-9400-series-switch",
  },
  {
    id: "cisco-catalyst-9300-series-switch",
    name: "Cisco Catalyst 9300 Series Switch",
    manufacturer: "Cisco",
    tags: ["Tag3", "Tag4"],
    path: "/equipment/cisco-catalyst-9300-series-switch",
  },
  {
    id: "soldering-station",
    name: "Soldering Station",
    manufacturer: "Weller",
    tags: ["Tag5", "Tag6"],
    path: "/equipment/soldering-station",
  },
  {
    id: "spectrum-analyzer",
    name: "Spectrum Analyzer",
    manufacturer: "Rohde & Schwarz",
    tags: ["Tag7", "Tag8"],
    path: "/equipment/spectrum-analyzer",
  },
  {
    id: "ni-elvis-iii",
    name: "NI ELVIS III",
    manufacturer: "National Instruments",
    tags: ["Tag9", "Tag10"],
    path: "/equipment/ni-elvis-iii",
  },
  {
    id: "ni-myrio",
    name: "NI myRIO",
    manufacturer: "National Instruments",
    tags: ["Tag11", "Tag12"],
    path: "/equipment/ni-myrio",
  },
  {
    id: "ni-usb-6008",
    name: "NI USB-6008",
    manufacturer: "National Instruments",
    tags: ["Tag13", "Tag14"],
    path: "/equipment/ni-usb-6008",
  },
  {
    id: "ni-usb-6009",
    name: "NI USB-6009",
    manufacturer: "National Instruments",
    tags: ["Tag15", "Tag16"],
    path: "/equipment/ni-usb-6009",
  },
  {
    id: "ni-usb-6211",
    name: "NI USB-6211",
    manufacturer: "National Instruments",
    tags: ["Tag17", "Tag18"],
    path: "/equipment/ni-usb-6211",
  },
  {
    id: "ni-usb-6212",
    name: "NI USB-6212",
    manufacturer: "National Instruments",
    tags: ["Tag19", "Tag20"],
    path: "/equipment/ni-usb-6212",
  },
  {
    id: "ni-usb-6218",
    name: "NI USB-6218",
    manufacturer: "National Instruments",
    tags: ["Tag21", "Tag22"],
    path: "/equipment/ni-usb-6218",
  },
];
