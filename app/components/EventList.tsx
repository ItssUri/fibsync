"use client";
import { getColorAssignatura } from "@/lib/colors-assignatures";
import { fetchEvents } from "@/lib/events";
import { Event, EventDateItem } from "@/types/event";
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

type FlattenedEvent = {
  nom: string;
  desc: string;
  type: string;
  assignatura: string;
  grup?: number | string;
  date: string;
};

function compareEvents(a: FlattenedEvent, b: FlattenedEvent): number {
  const aDate = new Date(a.date).getTime();
  const bDate = new Date(b.date).getTime();
  if (aDate !== bDate) return aDate - bDate;
  if (a.assignatura < b.assignatura) return -1;
  if (a.assignatura > b.assignatura) return 1;
  if (a.nom < b.nom) return -1;
  if (a.nom > b.nom) return 1;
  return 0;
}

function getMonthRange(from: Date) {
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);
  const nextMonth = new Date(start);
  nextMonth.setMonth(start.getMonth() + 1);
  return { start, end: nextMonth };
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

function flattenEvents(events: Event[]): FlattenedEvent[] {
  const out: FlattenedEvent[] = [];
  for (const ev of events) {
    for (const item of ev.data) {
      out.push({
        nom: ev.nom,
        desc: ev.desc,
        type: ev.type,
        assignatura: ev.assignatura,
        grup: item.grup,
        date: item.dia,
      });
    }
  }
  return out;
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
      setEvents(allEvents);
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

  const flattenedEvents = useMemo(() => flattenEvents(events), [events]);

  const filteredEvents = useMemo(() => {
    let filtered = [...flattenedEvents];

    if (filterTime === "nextMonth") {
      const now = new Date();
      const { start, end } = getMonthRange(now);
      filtered = filtered.filter((e) => {
        const d = new Date(e.date);
        return d >= start && d < end;
      });
    }

    if (filterAssignatura) {
      filtered = filtered.filter((e) => e.assignatura === filterAssignatura);
    }

    if (filterGrup) {
      filtered = filtered.filter((e) =>
        e.grup === undefined ||
        e.grup === null ||
        `${e.grup}` === filterGrup
      );
    }

    filtered = filtered.filter((e) => new Date(e.date) > new Date());

    return filtered.sort(compareEvents);
  }, [flattenedEvents, filterAssignatura, filterGrup, filterTime]);

  const assignatures = useMemo(
    () => unique(flattenedEvents.map((e) => e.assignatura)).sort(),
    [flattenedEvents]
  );
  const grups = useMemo(
    () =>
      unique(
        flattenedEvents
          .map((e) => e.grup)
          .filter((g) => g !== undefined && g !== null)
          .map((g) => `${g}`)
      ).sort(),
    [flattenedEvents]
  );

  const cssVars = {
    background: "var(--background)",
    foreground: "var(--foreground)",
    ink: "var(--ink)",
    muted: "var(--muted)",
    line: "var(--line)",
    paper: "var(--paper)",
  };

  const FESTAFIB_IMG = "https://www.festafib.cat/assets/icon-CXyCn6LF.png";
  const FESTAFIB_GRAY = "#B3B2AF";
  const FESTAFIB_RED = "#C10000";

  function festafibCardBg(): string {
    return "rgba(179,178,175,0.09)";
  }

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
            let color: string;
            let cardBg: string;
            let festafib = false;
            if (event.type.toLowerCase() === 'festafib') {
              festafib = true;
              color = FESTAFIB_RED;
              cardBg = festafibCardBg();
            } else if (event.assignatura.toLowerCase() === 'festiu') {
              if (event.nom.toLowerCase() === 'diada de catalunya') {
                color = "#C1121F";
                cardBg = "linear-gradient(to right, transparent 0 40%, rgba(193,18,31,0.15) 76% 100%) 0 0 / 100% 13% no-repeat, linear-gradient(to right, transparent 0 40%, rgba(193,18,31,0.15) 76% 100%) 0 29% / 100% 13% no-repeat, linear-gradient(to right, transparent 0 40%, rgba(193,18,31,0.15) 76% 100%) 0 58% / 100% 13% no-repeat, linear-gradient(to right, transparent 0 40%, rgba(193,18,31,0.15) 76% 100%) 0 87% / 100% 13% no-repeat, linear-gradient(to right, rgba(255,224,0,0.14), rgba(255,224,0,0.0))";
              } else {
                color = "#69d1ce";
                cardBg = hexToRgba20(color);
              }
            }
            else {
              color = getColorAssignatura(event.assignatura);
              cardBg = hexToRgba20(color);
            }

            const isDarkTheme = theme === "dark";

            return (
              <li
                key={
                  event.nom +
                  event.date +
                  event.assignatura +
                  (event.grup !== undefined ? event.grup : "")
                }
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
                    <div className="flex items-center gap-2">
                      {festafib && (
                        <img
                          src={FESTAFIB_IMG}
                          alt="FestaFIB"
                          style={{
                            width: "1.6em",
                            height: "1.6em",
                            display: "inline-block",
                            borderRadius: "0.33em",
                            background: 'transparent',
                            marginRight: "0em",
                          }}
                        />
                      )}
                      <span className="font-semibold text-base truncate" style={{ color: "var(--ink)" }} title={event.nom}>
                        {event.nom}
                      </span>
                    </div>
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
                      backgroundColor: festafib ? `${FESTAFIB_RED}1A` : `${color}22`,
                      border: `1px solid ${color}`,
                      color: festafib
                        ? FESTAFIB_RED
                        : isDarkTheme ? "var(--foreground)" : color,
                    }}
                  >
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
                <div className="exam-details flex flex-wrap gap-2 text-xs items-center">
                  <span
                    className="exam-assignatura font-mono px-1 rounded bg-opacity-20"
                    style={{
                      backgroundColor: festafib ? `${FESTAFIB_GRAY}1A` : `${color}1A`,
                      color: festafib
                        ? FESTAFIB_GRAY
                        : isDarkTheme ? "var(--foreground)" : color,
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
                    {formatEventDate(event.date)}
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