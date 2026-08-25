export const colorsAssignatures: Record<string, string> = {
  F: "#58CE3D",
  FM: "#27A03A",
  IC: "#B07889",
  PRO1: "#15AFF5",

  EC: "#E389C6",
  M1: "#237B0C",
  M2: "#5EF7CE",
  PRO2: "#D0CC90",

  BD: "#8366A8",
  CI: "#B2909A",
  EDA: "#85A40F",
  PE: "#EAB670",
  SO: "#73E65C",

  AC: "#8C10EB",
  EEE: "#322185",
  IDI: "#EC8EAB",
  IES: "#179A77",
  XC: "#60B9A3",

  PAR: "#635EAC",
  PROP: "#48B4B8",

  // TIC
  AD: "#BD9738",
  CASO: "#2F355D",
  CPD: "#CECE93",
  DA: "#0C0AC3",
  IM: "#839E34",
  SDX: "#76565F",
  TCI: "#BDC99F",

  ASO: "#184FF7",
  PI: "#E427D5",
  PTI: "#5AAEB7",
  SI: "#AEBC29",
  SOA: "#6719B4",
  TXC: "#EE3442",

  // COMPUTADORS
  PAP: "#7B148F",
  PCA: "#A9FAC7",
  PDS: "#6aa494",
  STR: "#BC11CA",
  VLSI: "#E3F5D8",

  AC2: "#F6A304",
  DSBM: "#3B9C32",
  MP: "#168C99",
  PEC: "#89B3DB",
  SO2: "#E5A5FC",
  XC2: "#FB78E6",

  // SOFTWARE
  AS: "#4A6E7B",
  ASW: "#71F253",
  DBD: "#24572F",
  ER: "#322B86",
  GPS: "#9440FB",
  PES: "#B70633",

  CAP: "#5740DC",
  CBDE: "#6CDE1F",
  CSI: "#2D8596",
  ECSDI: "#DF0DAF",
  SIM: "#7E3913",
  SOAD: "#5C40E2",

  // SISTEMES
  ADEI: "#CFB5AA",
  DSI: "#474BE4",
  NE: "#D0D7E6",
  PSI: "#CA59EE",
  SIO: "#7A449F",

  ABD: "#2704D9",
  CAIM: "#F138B5",
  EDO: "#BD0D5A",
  IO: "#0B963F",
  MI: "#CD7B74",
  VPE: "#CD7B74",

  // COMPU
  AA: "#958290",
  APA: "#F74603",
  CL: "#0CA2DE",
  CN: "#01C92A",
  SID: "#629C3C",

  A: "#7B2022",
  G: "#A33F2D",
  IA: "#4E82D0",
  LI: "#056FC3",
  LP: "#155B19",
  TC: "#E2F1B8",

  // OPTATIVES
  APC: "#49BAB5",
  APSS: "#057FA3",
  ASDP: "#9398F6",
  ASMI: "#1160AD",
  C: "#7832CD",
  CCQ: "#4E21C7",
  CDI: "#DB601E",
  DCS: "#9BED3E",
  EET: "#048707",
  FDM: "#AB57F2",
  FOMAR: "#F44C77",
  GCS: "#8BDA81",
  GEOC: "#2B6679",
  I2R3: "",
  I2R6: "",
  LDPE: "#06F427",
  MD: "#301AC7",
  PAE: "#BC0335",
  ROB: "#60D274",
  SLDS: "#3921EA",
  TGA: "#8EE568",
  VC: "#C34D0A",
  VJ: "#E46C3A",
  WSE: "#C8D20A",
};

export function getColorAssignatura(codi: string): string {
  return colorsAssignatures[codi] ?? "#999999";
}

export function isDarkColor(hex: string): boolean {
  const value = hex.replace("#", "");
  const normalized = value.length === 3
    ? value.split("").map((char) => char + char).join("")
    : value;

  if (normalized.length !== 6) return false;

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance < 0.5;
}
