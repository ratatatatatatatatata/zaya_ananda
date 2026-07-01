import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 1.8" /></>,
  award: <><circle cx="12" cy="9" r="5" /><path d="M9 13.2L7.6 20l4.4-2.4L16.4 20 15 13.2" /></>,
  laptop: <><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2 20h20" /></>,
  shield: <path d="M12 3l7 3v5c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6z" />,
  star: <path d="M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.4 7.2 18.9l.9-5.4L4.2 9.7l5.4-.8z" />,
  sparkles: <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" /></>,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  home: <path d="M4 11l8-6.5 8 6.5M6.5 9.5V19h11V9.5" />,
  bag: <><path d="M6 8h12l-1 11.5H7z" /><path d="M9 8V6.2a3 3 0 0 1 6 0V8" /></>,
};

export function Icon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths[name] ?? null}
    </svg>
  );
}
