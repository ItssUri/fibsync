import { useMemo, useEffect, useState } from "react";
import { ClassBlock } from "@/types/schedule";
import { getColorAssignatura, isDarkColor } from "@/lib/colors-assignatures";
import { DAYS, START_HOUR, END_HOUR, layoutBlocks } from "@/lib/timetable-layout";

interface Props {
  blocks: (ClassBlock & { person?: string })[];
  showPerson?: boolean;
}

function mergeContiguousBlocks(blocks: (ClassBlock & { person?: string })[]) {
  function blockKey(b: ClassBlock & { person?: string }) {
    return [
      b.dia_setmana,
      b.codi_assig,
      b.grup,
      b.tipus,
      b.aules,
      b.idioma?.toLowerCase() ?? "",
      b.person?.toLowerCase() ?? "",
    ].join('|');
  }
  function parseTime(str: string) {
    const [h, m] = str.split(':').map(Number);
    return h * 60 + m;
  }
  function formatTime(mins: number) {
    const h = Math.floor(mins / 60)
      .toString()
      .padStart(2, "0");
    const m = (mins % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  }

  const sorted = [...blocks].sort((a, b) => {
    if (a.dia_setmana !== b.dia_setmana) return a.dia_setmana - b.dia_setmana;
    const keyA = blockKey(a);
    const keyB = blockKey(b);
    if (keyA !== keyB) return keyA.localeCompare(keyB);
    return parseTime(a.inici) - parseTime(b.inici);
  });

  const merged: (ClassBlock & { person?: string })[] = [];
  for (const block of sorted) {
    const last = merged[merged.length - 1];
    if (
      last &&
      blockKey(last) === blockKey(block)
    ) {
      const lastEnd = parseTime(last.inici) + last.durada * 60;
      const blockStart = parseTime(block.inici);
      if (blockStart === lastEnd) {
        last.durada += block.durada;
        continue;
      }
    }
    merged.push({ ...block });
  }
  return merged;
}

function groupOverlappingBlocks(blocks: ReturnType<typeof layoutBlocks>) {
  const sorted = [...blocks].sort((a, b) => a.top - b.top);
  const groups: { blocks: typeof blocks; top: number; height: number }[] = [];

  sorted.forEach(block => {
    let added = false;
    for (const group of groups) {
      const groupBottom = group.top + group.height;
      const blockBottom = block.top + block.height;
      if (block.top < groupBottom && blockBottom > group.top) {
        group.blocks.push(block);
        group.top = Math.min(group.top, block.top);
        group.height = Math.max(group.height, blockBottom - group.top);
        added = true;
        break;
      }
    }
    if (!added) {
      groups.push({ blocks: [block], top: block.top, height: block.height });
    }
  });
  return groups;
}

function getCurrentDayIndex() {
  const today = new Date();
  let jsDay = today.getDay();
  return jsDay === 0 ? 7 : jsDay;
}

function getCurrentTimePosition(date?: Date): number | null {
  const now = date ? date : new Date();
  const hour = now.getHours();
  const min = now.getMinutes();
  const totalMinutes = (hour + min / 60) - START_HOUR;
  const totalHours = END_HOUR - START_HOUR;

  if (hour < START_HOUR || hour >= END_HOUR) {
    return null;
  }
  return (totalMinutes / totalHours) * 100;
}

export default function TimetableGrid({ blocks, showPerson = false }: Props) {
  const mergedBlocks = useMemo(() => mergeContiguousBlocks(blocks), [blocks]);
  const positioned = layoutBlocks(mergedBlocks);
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

  const currentDayIdx = useMemo(() => getCurrentDayIndex(), []);

  const [now, setNow] = useState(() => new Date());
  const [currentTimePos, setCurrentTimePos] = useState(() => getCurrentTimePosition(now));

  useEffect(() => {
    const interval = setInterval(() => {
      const newNow = new Date();
      setNow(newNow);
      setCurrentTimePos(getCurrentTimePosition(newNow));
    }, 20000);
    const newNow = new Date();
    setNow(newNow);
    setCurrentTimePos(getCurrentTimePosition(newNow));
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timetable-scroll">
      <div className="timetable-frame">
        <div className="time-column">
          <div className="time-label" />
          {hours.map((h) => (
            <div key={h} className="time-label">
              {h}:00
            </div>
          ))}
        </div>
        <div className="flex flex-1">
          {DAYS.map((day) => {
            const blocksForDay = positioned.filter((b) => b.dia_setmana === day.value);
            const overlapGroups = groupOverlappingBlocks(blocksForDay);

            return (
              <div key={day.value} className="day-column" style={{ position: "relative" }}>
                <div className="day-heading">
                  {day.label}
                </div>
                <div className="day-body" style={{ position: "relative" }}>
                  {day.value === currentDayIdx && currentTimePos !== null && (
                    <div
                      className="timetable-now-bar"
                      style={{
                        position: "absolute",
                        top: `${currentTimePos}%`,
                        left: 0,
                        width: "100%",
                        height: "2px",
                        background: "rgba(255, 51, 51, 0.44)",
                        zIndex: 4,
                        pointerEvents: "none",
                      }}
                      aria-label="Barra de l'hora actual"
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: -40,
                          top: "-7px",
                          background: "rgba(255,255,255,0.85)",
                          color: "#c00",
                          fontSize: 10,
                          padding: "0 3px",
                          borderRadius: "4px",
                          fontWeight: 600,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                        }}
                      >
                        {`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`}
                      </span>
                    </div>
                  )}

                  {overlapGroups.map((group, groupIdx) => {
                    const groupCount = group.blocks.length;
                    const gapPercent = 2;
                    const totalGap = groupCount > 1 ? gapPercent * (groupCount - 1) : 0;
                    const blockWidthPct = groupCount > 0
                      ? (100 - totalGap) / groupCount
                      : 100;

                    const groupWidth = blockWidthPct * groupCount + totalGap;
                    const marginLeftBase = (100 - groupWidth) / 2;

                    return group.blocks.map((b, idx) => {
                      const subjectColor = getColorAssignatura(b.codi_assig);
                      const isDark = isDarkColor(subjectColor);
                      const languageCode = b.idioma
                        ? b.idioma
                          .split(",")
                          .map((value) => value.trim().toLowerCase())
                          .map((value) => {
                            if (value === "castellano") return "ES";
                            if (value === "català" || value === "catalan") return "CA";
                            if (value === "english") return "EN";
                            return value;
                          })
                          .join(", ")
                        : "";

                      const left = `${marginLeftBase + idx * (blockWidthPct + gapPercent)}%`;

                      return (
                        <div
                          key={`${b.codi_assig}-${b.grup}-${groupIdx}-${idx}`}
                          className="class-block"
                          style={{
                            position: "absolute",
                            top: `${b.top}%`,
                            left,
                            width: `${blockWidthPct}%`,
                            height: `${b.height}%`,
                            backgroundColor: subjectColor,
                            color: isDark ? "#f7f5ed" : "#17211c",
                            zIndex: 3,
                          }}
                        >
                          <div className="class-block-header">
                            <strong>{b.codi_assig} · {b.grup}</strong>
                            {languageCode ? <span className="class-block-language">{languageCode}</span> : null}
                          </div>
                          <div className="class-block-type">
                            {b.tipus === "T"
                              ? "Teoria"
                              : b.tipus === "P"
                              ? "Problemes"
                              : "Laboratori"} · {b.aules}
                          </div>
                          <div style={{ fontSize: 10, opacity: 0.7 }} className='hores-horari'>
                            {b.inici} &ndash; {
                              (() => {
                                const [h, m] = b.inici.split(":").map(Number);
                                const end = h * 60 + m + b.durada * 60;
                                const endStr = `${Math.floor(end/60)
                                  .toString()
                                  .padStart(2, '0')}:${(end % 60)
                                  .toString()
                                  .padStart(2, '0')}`;
                                return endStr;
                              })()
                            }
                          </div>
                        </div>
                      );
                    });
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
