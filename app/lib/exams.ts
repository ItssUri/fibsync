import { RawExam, Exam } from "@/types/exam";
import { getSubjectSet } from "@/lib/getSubjects";

const SUBJECTS = getSubjectSet();

export function getCurrentAcademicYear(now: Date = new Date()): number {
  return now.getFullYear();
}

export function getCurrentAcademicSemester(now: Date = new Date()): number {
  const month = now.getMonth();

  if (month >= 2 && month <= 6) return 2;
  return 1;
}

export function matchesCurrentSemester(raw: RawExam, now: Date = new Date()): boolean {
  return raw.curs === getCurrentAcademicYear(now) && raw.quatr === getCurrentAcademicSemester(now);
}

function toExam(raw: RawExam): Exam {
  return {
    id: raw.id,
    subject: raw.assig,
    room: raw.aules,
    start: raw.inici,
    end: raw.fi,
    type: raw.tipus,
    comment: raw.comentaris,
  };
}

export async function fetchExams(): Promise<Exam[]> {
  const res = await fetch("https://api.fib.upc.edu/v2/examens/?format=json", {
    headers: { "client-id": process.env.FIB_API_CLIENT_ID! },
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("Failed to fetch exams");

  const data: { count: number; results: RawExam[] } = await res.json();
  const now = new Date();

  return data.results
    .filter(
      (e) =>
        SUBJECTS.has(e.assig) &&
        matchesCurrentSemester(e, now) &&
        new Date(e.inici) > now,
    )
    .map(toExam)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}
