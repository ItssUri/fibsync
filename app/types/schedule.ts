export type Weekday = 1 | 2 | 3 | 4 | 5; // dilluns-divendres

export type ClassType = "T" | "P" | "L"; // teoria, problemes, laboratori

export interface ClassBlock {
  codi_assig: string;
  grup: string;
  dia_setmana: Weekday;
  inici: string; // "HH:MM"
  durada: number; // hours
  tipus: ClassType;
  aules: string;
  idioma: string;
}

export type Schedules = Record<string, ClassBlock[]>; // person name -> blocks
