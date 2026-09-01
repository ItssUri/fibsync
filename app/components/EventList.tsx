"use client";
import { getColorAssignatura } from "@/lib/colors-assignatures";
import { fetchEvents } from "@/lib/events";
import { Event } from "@/types/event";

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

import { useEffect, useState } from "react";

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    (async () => {
      const now = new Date();
      const data = await fetchEvents();
      const filtered = data.filter((event: Event) => new Date(event.data) > now)
                           .sort(compareEvents);
      setEvents(filtered);
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

  return (
    <section className="exams-panel">
      <h2 className="section-label">Esdeveniments</h2>
      {events.length === 0 ? (
        <div className="empty-state px-5 py-6 text-center text-gray-500 bg-gray-100 dark:bg-zinc-800 rounded-lg shadow-inner">
          No hi ha esdeveniments propers.
        </div>
      ) : (
        <ul
          className="exams-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2"
          style={{ listStyle: "none", paddingLeft: 0 }}
        >
          {events.map((event) => {
            const color = getColorAssignatura(event.assignatura);
            const useDark = theme === "dark";
            const isDark = useDark ? isDarkColor(color) : false;

            return (
              <li
                key={event.nom + event.data + event.assignatura + event.grup}
                className="exam-card flex flex-col rounded-xl shadow border bg-white dark:bg-zinc-900 border-l-[6px] p-4 hover:scale-[1.015] transition-all"
                style={{
                  borderLeft: `6px solid ${color}`,
                  borderTop: "1px solid rgba(0,0,0,0.10)",
                  borderRight: "1px solid rgba(0,0,0,0.10)",
                  borderBottom: "1px solid rgba(0,0,0,0.10)",
                  backgroundColor: `var(--event-bg, ${color}09)`,
                }}
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-base truncate">
                      {event.nom}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate" title={event.desc}>
                      {event.desc}
                    </span>
                  </div>
                  <span
                    className="exam-type-badge rounded px-2 py-1 text-xs font-mono uppercase"
                    style={{
                      backgroundColor: `${color}22`,
                      border: `1px solid ${color}`,
                      color: isDark ? "#fff" : color,
                    }}
                  >
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
                <div className="exam-details flex flex-wrap gap-2 text-xs text-gray-700 dark:text-gray-300 items-center">
                  <span
                    className="exam-assignatura font-mono px-1 rounded bg-opacity-20"
                    style={{
                      backgroundColor: `${color}1A`,
                      color: isDark ? "#fff" : color,
                    }}
                  >
                    {event.assignatura}
                  </span>
                  {event.grup && (
                    <span className="exam-group">
                      Grup {event.grup}
                    </span>
                  )}

                  <span className="exam-date whitespace-nowrap">
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