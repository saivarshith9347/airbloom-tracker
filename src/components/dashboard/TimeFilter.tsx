import { cn } from "@/lib/utils";

interface TimeFilterProps {
  value: number;
  onChange: (hours: number) => void;
}

const options = [
  { label: "1h", value: 1 },
  { label: "6h", value: 6 },
  { label: "24h", value: 24 },
];

export function TimeFilter({ value, onChange }: TimeFilterProps) {
  return (
    <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
            value === opt.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
