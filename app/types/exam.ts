export interface RawExam {
  id: number;
  assig: string;
  codi_upc: string;
  aules: string;
  inici: string;
  fi: string;
  quatr: number;
  curs: number;
  pla: string;
  tipus: string;
  tipus_assignatura: string;
  comentaris: string;
  eslaboratori: string;
}

export interface Exam {
  id: number;
  subject: string;
  room: string;
  start: string;
  end: string;
  type: string;
  comment: string;
}
