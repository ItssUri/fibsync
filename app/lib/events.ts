import {Event} from "@/types/event";
import {readFile} from "fs/promises";
import {join} from "path";
import eventsData from "@/data/events.json";

export async function fetchEvents(): Promise<Event[]> {
    return eventsData.events.map((event: any) => ({
        nom: event.nom,
        desc: event.desc,
        type: event.type,
        assignatura: event.assignatura,
        data: event.data,
        grup: event.grup,
    }));
}