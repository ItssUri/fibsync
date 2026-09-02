export interface EventDateItem {
    grup: number;
    dia: string;
}

export interface Event {
    nom: string;
    desc: string;
    type: string;
    assignatura: string;
    data: EventDateItem[];
}