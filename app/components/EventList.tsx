"use client";
import { getColorAssignatura } from "@/lib/colors-assignatures";
import { fetchEvents } from "@/lib/events";
import { Event } from "@/types/event";
import { useEffect, useState, useMemo } from "react";

function isDarkColor(hex: string): boolean {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  if (c.length !== 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 128;
}

function formatEventDate(dateString: string) {
  const date = new Date(dateString);
  const weekdays = ["dg.", "dl.", "dt.", "dc.", "dj.", "dv.", "ds."];
  const day = weekdays[date.getDay()];
  const dayNum = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${day} ${dayNum}/${month}`;
}

function compareEvents(a: Event, b: Event): number {
  const aDate = new Date(a.data).getTime();
  const bDate = new Date(b.data).getTime();
  if (aDate !== bDate) return aDate - bDate;
  if (a.assignatura < b.assignatura) return -1;
  if (a.assignatura > b.assignatura) return 1;
  if (a.nom < b.nom) return -1;
  if (a.nom > b.nom) return 1;
  return 0;
}

function getMonthRange(from: Date) {
  const nextMonth = new Date(from);
  nextMonth.setMonth(from.getMonth() + 1);
  return { start: from, end: nextMonth };
}

function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

function hexToRgba20(hex: string): string {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  if (c.length !== 6) return "rgba(0,0,0,0.2)";
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r},${g},${b},0.1)`;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [theme, setTheme] = useState<string>("light");

  const [filterAssignatura, setFilterAssignatura] = useState<string>("");
  const [filterGrup, setFilterGrup] = useState<string>("");
  const [filterTime, setFilterTime] = useState<"nextMonth" | "all">("nextMonth");

  useEffect(() => {
    (async () => {
      const now = new Date();
      const allEvents = await fetchEvents();
      const upcoming = allEvents.filter((event: Event) => new Date(event.data) > now).sort(compareEvents);
      setEvents(upcoming);
    })();

    const themeValue = typeof window !== "undefined" ? window.localStorage.getItem("fibsync-theme") : null;
    setTheme(themeValue === "dark" ? "dark" : "light");

    function handleStorage() {
      const themeValue = window.localStorage.getItem("fibsync-theme");
      setTheme(themeValue === "dark" ? "dark" : "light");
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    if (filterTime === "nextMonth") {
      const now = new Date();
      const { start, end } = getMonthRange(now);
      filtered = filtered.filter((e) => {
        const d = new Date(e.data);
        return d >= start && d < end;
      });
    }

    if (filterAssignatura) {
      filtered = filtered.filter((e) => e.assignatura === filterAssignatura);
    }

    if (filterGrup) {
      filtered = filtered.filter(
        (e) =>
          e.grup === undefined ||
          e.grup === null ||
          `${e.grup}` === filterGrup
      );
    }

    return filtered;
  }, [events, filterAssignatura, filterGrup, filterTime]);

  const assignatures = useMemo(
    () => unique(events.map((e) => e.assignatura)).sort(),
    [events]
  );
  const grups = useMemo(
    () =>
      unique(
        events
          .map((e) => e.grup)
          .filter((g) => g !== undefined && g !== null)
          .map((g) => `${g}`)
      ).sort(),
    [events]
  );

  const cssVars = {
    background: "var(--background)",
    foreground: "var(--foreground)",
    ink: "var(--ink)",
    muted: "var(--muted)",
    line: "var(--line)",
    paper: "var(--paper)",
  };

  return (
    <section className="exams-panel" style={{ background: cssVars.background }}>
      <h2 className="section-label" style={{ color: cssVars.ink }}>Esdeveniments</h2>
      <div
        className="flex flex-wrap gap-4 mb-4 items-end p-4 rounded-lg"
        style={{
          background: cssVars.paper,
          border: `1px solid ${cssVars.line}`,
          color: cssVars.foreground
        }}
      >
        <div className="flex flex-col gap-1 min-w-[140px]">
          <label
            className="text-xs font-semibold mb-1"
            style={{ color: "var(--muted)" }}
          >
            Assignatura
          </label>
          <select
            className="
              px-2 py-1 rounded-lg border text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition shadow-sm
            "
            style={{
              background: cssVars.paper,
              color: cssVars.ink,
              borderColor: cssVars.line,
            }}
            value={filterAssignatura}
            onChange={(e) => setFilterAssignatura(e.target.value)}
          >
            <option value="">Totes</option>
            {assignatures.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 min-w-[110px]">
          <label
            className="text-xs font-semibold mb-1"
            style={{ color: "var(--muted)" }}
          >
            Grup
          </label>
          <select
            className="
              px-2 py-1 rounded-lg border text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition shadow-sm
            "
            style={{
              background: cssVars.paper,
              color: cssVars.ink,
              borderColor: cssVars.line,
            }}
            value={filterGrup}
            onChange={(e) => setFilterGrup(e.target.value)}
          >
            <option value="">Tots</option>
            {grups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 min-w-[120px]">
          <label
            className="text-xs font-semibold mb-1"
            style={{ color: "var(--muted)" }}
          >
            Període
          </label>
          <select
            className="
              px-2 py-1 rounded-lg border text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition shadow-sm
            "
            style={{
              background: cssVars.paper,
              color: cssVars.ink,
              borderColor: cssVars.line,
            }}
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value as "nextMonth" | "all")}
          >
            <option value="nextMonth">Pròxim mes</option>
            <option value="all">Tots els futurs</option>
          </select>
        </div>
      </div>
      {filteredEvents.length === 0 ? (
        <div
          className="empty-state px-5 py-6 text-center rounded-lg shadow-inner"
          style={{
            color: cssVars.muted,
            background: `var(--paper)`,
            border: `1px solid ${cssVars.line}`,
          }}
        >
          No hi ha esdeveniments propers.
        </div>
      ) : (
        <ul
          className="exams-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2"
          style={{ listStyle: "none", paddingLeft: 0 }}
        >
          {filteredEvents.map((event) => {
            const color = getColorAssignatura(event.assignatura);

            const isDarkTheme = theme === "dark";
            const cardBg = hexToRgba20(color);

            return (
              <li
                key={event.nom + event.data + event.assignatura + event.grup}
                className="exam-card flex flex-col rounded-xl shadow border border-l-[6px] p-4 hover:scale-[1.015] transition-all"
                style={{
                  borderLeft: `6px solid ${color}`,
                  borderTop: `1px solid var(--line)`,
                  borderRight: `1px solid var(--line)`,
                  borderBottom: `1px solid var(--line)`,
                  background: cardBg,
                  color: "var(--ink)",
                }}
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-base truncate" style={{ color: "var(--ink)" }}>
                      {event.nom}
                    </span>
                    <span
                      className="text-xs truncate"
                      style={{ color: "var(--muted)" }}
                      title={event.desc}
                    >
                      {event.desc}
                    </span>
                  </div>
                  <span
                    className="exam-type-badge rounded px-2 py-1 text-xs font-mono uppercase"
                    style={{
                      backgroundColor: `${color}22`,
                      border: `1px solid ${color}`,
                      color: isDarkTheme ? "var(--foreground)" : color,
                    }}
                  >
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
                <div className="exam-details flex flex-wrap gap-2 text-xs items-center">
                  <span
                    className="exam-assignatura font-mono px-1 rounded bg-opacity-20"
                    style={{
                      backgroundColor: `${color}1A`,
                      color: isDarkTheme ? "var(--foreground)" : color,
                    }}
                  >
                    {event.assignatura}
                  </span>
                  {event.grup && (
                    <span className="exam-group" style={{ color: "var(--muted)" }}>
                      Grup {event.grup}
                    </span>
                  )}

                  <span className="exam-date whitespace-nowrap" style={{
                    color: "var(--muted)"
                  }}>
                    {formatEventDate(event.data)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}