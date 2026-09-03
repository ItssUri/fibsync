import { Suspense } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import NowInClass from "@/components/NowInClass";
import ExamsList from "@/components/ExamsList";
import TimetableSection from "@/components/TimetableSection";
import EventList from "@/components/EventList";
import { colorsAssignatures } from "./lib/colors-assignatures";

export default function Home() {
  return (
    <main className="dashboard-shell space-y-10">
      <header className="masthead masthead--app-shell">
        <div className="masthead-brand">
          <span className="masthead-brand__word">
            f<span className="masthead-brand__i">i</span>bsync
          </span>
          <span className="masthead-brand__subtitle">horari + exàmens</span>
        </div>

        <ThemeToggle />
      </header>
      <NowInClass />
      <TimetableSection />
      <Suspense fallback={<p className="text-gray-500">Carregant esdeveniments...</p>}>
        <EventList />
      </Suspense>
      <Suspense fallback={<p className="text-gray-500">Carregant exàmens...</p>}>
        <ExamsList />
      </Suspense>
      <footer className="site-footer">
        <span>
          made with &lt;3 by{" "}
          <a href="mailto:uri@uridev.cat" style={{ textDecoration:"underline" }}>
            uri
          </a>{" "}
          |{" "}
        </span>
   
        <a
          className="site-footer__link"
          href="https://github.com/ItssUri/fibsync"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <svg className="site-footer__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.31 6.84 9.66.5.09.68-.22.68-.48 0-.24-.01-1.04-.02-1.9-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.92-.64.07-.63.07-.63 1.02.07 1.56 1.08 1.56 1.08.9 1.58 2.37 1.12 2.95.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.72 0 0 .84-.27 2.75 1.06A9.29 9.29 0 0 1 12 6.84c.85 0 1.7.11 2.5.33 1.9-1.33 2.74-1.06 2.74-1.06.55 1.41.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.93-2.34 4.79-4.57 5.05.36.32.68.95.68 1.91 0 1.38-.01 2.49-.01 2.83 0 .27.18.58.69.48A10.23 10.23 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
            />
          </svg>
        </a>
      </footer>
    </main>
  );
}
