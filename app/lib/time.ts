import schedulesData from "../data/schedules.json";
import { Schedules, ClassBlock } from "@/types/schedule";

const schedules = schedulesData as Schedules;

export interface CurrentStatus {
  person: string;
  inClass: boolean;
  block?: ClassBlock;
}

export function getCurrentStatus(now: Date = new Date()): CurrentStatus[] {
  const day = now.getDay(); // 0=Sun..6=Sat -> need to map to your 1-5 (Mon-Fri)
  const dayOfWeek = day === 0 ? 7 : day; // Sunday edge case, adjust to your convention
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return Object.entries(schedules).map(([person, blocks]) => {
    const activeBlock = blocks.find((b) => {
      if (b.dia_setmana !== dayOfWeek) return false;
      const [h, m] = b.inici.split(":").map(Number);
      const startMinutes = h * 60 + m;
      const endMinutes = startMinutes + b.durada * 60;
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    });

    return {
      person,
      inClass: !!activeBlock,
      block: activeBlock,
    };
  });
}
