// src/components/TimetableSection.tsx
"use client";

import { useSyncExternalStore } from "react";
import schedulesData from "@/data/schedules.json";
import { Schedules } from "@/types/schedule";
import TimetableGrid from "@/components/TimetableGrid";

const schedules = schedulesData as Schedules;
const people = Object.keys(schedules);
const STORAGE_KEY = "fibsync-selected-timetable";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  if (typeof window === "undefined") {
    return people[0] ?? "";
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved && people.includes(saved) ? saved : people[0] ?? "";
}

export default function TimetableSection() {
  const active = useSyncExternalStore(subscribe, getSnapshot, () => people[0] ?? "");

  const setActive = (next: string) => {
    if (!people.includes(next)) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event("storage"));
  };

  const tabs = people.map((p) => ({ key: p, label: p }));

  return (
    <section className="timetable-panel">
      <h2 className="section-label">Setmana</h2>
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`tab ${active === tab.key ? "tab-active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <TimetableGrid blocks={schedules[active]} />
    </section>
  );
}
