interface LocationIconProps {
  type: "default" | "searching" | "success" | "error";
  className?: string;
}

export function LocationIcon({ type, className = "" }: LocationIconProps) {
  switch (type) {
    case "default":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 text-secondary ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "searching":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-14 w-14 text-accent animate-pulse ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
    case "success":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-14 w-14 text-success ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case "error":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-14 w-14 text-destructive ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
}
