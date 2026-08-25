// src/components/TimetableGrid.tsx
import { ClassBlock } from "@/types/schedule";
import { getColorAssignatura, isDarkColor } from "@/lib/colors-assignatures";
import { DAYS, START_HOUR, END_HOUR, layoutBlocks } from "@/lib/timetable-layout";

interface Props {
  blocks: (ClassBlock & { person?: string })[];
  showPerson?: boolean; // label each block with the person's name (combined view)
}

export default function TimetableGrid({ blocks, showPerson = false }: Props) {
  const positioned = layoutBlocks(blocks);
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

  return (
    <div className="timetable-scroll">
      <div className="timetable-frame">
      {/* hour labels */}
      <div className="time-column">
        <div className="time-label" />
        {hours.map((h) => (
          <div key={h} className="time-label">
            {h}:00
          </div>
        ))}
      </div>

      {/* day columns */}
      <div className="flex flex-1">
        {DAYS.map((day) => (
          <div key={day.value} className="day-column">
            <div className="day-heading">
              {day.label}
            </div>
            <div className="day-body">
              {positioned
                .filter((b) => b.dia_setmana === day.value)
                .map((b, idx) => {
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

                  return (
                    <div
                      key={`${b.codi_assig}-${b.grup}-${idx}`}
                      className="class-block"
                      style={{
                        top: `${b.top}%`,
                        height: `${b.height}%`,
                        backgroundColor: subjectColor,
                        color: isDark ? "#f7f5ed" : "#17211c",
                      }}
                    >
                      <div className="class-block-header">
                        <strong>{b.codi_assig} · {b.grup}</strong>
                        {languageCode ? <span className="class-block-language">{languageCode}</span> : null}
                      </div>
                      <div>
                        {b.tipus === "T" ? "Teoria" : b.tipus === "P" ? "Problemes" : "Laboratori"} · {b.aules}
                      </div>
                      {showPerson && b.person && <div>{b.person}</div>}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
