// src/lib/schedules.ts
import schedulesData from "@/data/schedules.json";
import { Schedules } from "@/types/schedule";

const schedules = schedulesData as Schedules;

export function getSubjectSet(): Set<string> {
  const subjects = new Set<string>();
  for (const person in schedules) {
    for (const block of schedules[person]) {
      subjects.add(block.codi_assig);
    }
  }
  return subjects;
}
