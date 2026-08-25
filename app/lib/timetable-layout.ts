// src/lib/timetable-layout.ts
import { ClassBlock, Weekday } from "@/types/schedule";

export const DAYS: { value: Weekday; label: string }[] = [
  { value: 1, label: "Dilluns" },
  { value: 2, label: "Dimarts" },
  { value: 3, label: "Dimecres" },
  { value: 4, label: "Dijous" },
  { value: 5, label: "Divendres" },
];

export const START_HOUR = 8;
export const END_HOUR = 20;

export interface PositionedBlock extends ClassBlock {
  person?: string; // only set in combined view
  top: number; // % from top of grid
  height: number; // % of grid height
}

export function layoutBlocks(blocks: (ClassBlock & { person?: string })[]): PositionedBlock[] {
  const totalHours = END_HOUR - START_HOUR;
  return blocks.map((b) => {
    const [h, m] = b.inici.split(":").map(Number);
    const startOffset = h + m / 60 - START_HOUR;
    return {
      ...b,
      top: (startOffset / totalHours) * 100,
      height: (b.durada / totalHours) * 100,
    };
  });
}
