import { fetchExams } from "@/lib/exams";
import { getColorAssignatura } from "@/lib/colors-assignatures";

export default async function ExamsList() {
  const exams = await fetchExams();

  return (
    <section className="exams-panel">
      <h2 className="section-label">Pròxims exàmens</h2>
      {exams.length === 0 ? (
        <p className="empty-state">No hi ha exàmens propers.</p>
      ) : (
        <ul
          className="
            exam-list 
            grid 
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-2
            mt-2
          "
          style={{ listStyle: "none", paddingLeft: 0 }}
        >
          {exams.map((exam) => (
            <li
              key={exam.id}
              className="exam-item"
              style={{
                borderLeftColor: getColorAssignatura(exam.subject),
                backgroundColor: `${getColorAssignatura(exam.subject)}20`,
              }}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{exam.subject}</span>
                  {exam.type ? (
                    <span
                      className="exam-type-badge"
                      style={{
                        backgroundColor: `${getColorAssignatura(exam.subject)}33`,
                        border: `1px solid ${getColorAssignatura(exam.subject)}`,
                      }}
                    >
                      {exam.type === "P" ? "Parcial" : exam.type === "F" ? "Final" : exam.type}
                    </span>
                  ) : null}
                  <span className="text-sm text-gray-600 ml-1">{exam.room}</span>
                </div>
                {exam.comment ? (
                  <span className="text-xs text-gray-500">{exam.comment}</span>
                ) : null}
              </div>
              <time className="text-sm text-gray-600">
                {new Date(exam.start).toLocaleString("ca-ES", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
