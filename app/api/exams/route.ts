import { NextResponse } from "next/server";
import { fetchExams } from "@/lib/exams";

export async function GET() {
  try {
    const exams = await fetchExams();
    return NextResponse.json(exams);
  } catch {
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 502 });
  }
}
