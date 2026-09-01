"use client";

import { useEffect, useState } from "react";
import { getColorAssignatura } from "@/lib/colors-assignatures";
import { getCurrentStatus, CurrentStatus } from "@/lib/time";

export default function NowInClass() {
  const [statuses, setStatuses] = useState<CurrentStatus[]>([]);

  useEffect(() => {
    // initial + refresh every minute
    const update = () => setStatuses(getCurrentStatus());
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  const inClass = statuses.filter((s) => s.inClass);
  const free = statuses.filter((s) => !s.inClass);

  return (
    <div className="status-panel">
      <section>
        <h2 className="section-label">A classe ara</h2>
        {inClass.length === 0 ? (
          <p className="empty-state">Ningú a classe ara mateix.</p>
        ) : (
          <ul
            className="status-list grid grid-cols-1 md:grid-cols-2 gap-1"
            /* PC = md: 2 columnes, mobile = 1 columna */
            style={{ listStyle: "none", paddingLeft: 0 }}
          >
            {inClass.map(({ person, block }) => {
              const subjectColor = block?.codi_assig ? getColorAssignatura(block.codi_assig) : "#79b36c";
              const classType =
                block?.tipus === "T"
                  ? "Teoria"
                  : block?.tipus === "P"
                  ? "Problemes"
                  : block?.tipus === "L"
                  ? "Laboratori"
                  : "Classe";

              return (
                <li
                  key={person}
                  className="status-item"
                  style={{
                    borderLeftColor: subjectColor,
                    backgroundColor: `${subjectColor}22`,
                  }}
                >
                  <div className="status-item-main">
                    <span className="font-medium">{person}</span>
                    <span className="status-item-subject">{block?.codi_assig}</span>
                    <span className="status-item-meta">
                      {classType} · Grup {block?.grup}
                    </span>
                  </div>
                  <span className="status-item-room">{block?.aules}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="section-label">Lliures</h2>
        <ul className="free-list">
          {free.map(({ person }) => (
            <li key={person}>
              {person}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
